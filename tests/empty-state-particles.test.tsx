import React from 'react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {act,cleanup,render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button,EmptyState} from '../packages/ui/src/index';

let hidden=false,reduced=false,nextFrame=0;
let frames:Map<number,FrameRequestCallback>;
let mediaListeners:Set<()=>void>;
let views:{notify:(visible:boolean)=>void;disconnect:ReturnType<typeof vi.fn>}[];
let sizes:{notify:()=>void;disconnect:ReturnType<typeof vi.fn>}[];
const context={clearRect:vi.fn(),setTransform:vi.fn(),beginPath:vi.fn(),arc:vi.fn(),fill:vi.fn(),fillStyle:'',globalAlpha:1};

beforeEach(()=>{
  hidden=false;reduced=false;nextFrame=0;frames=new Map();mediaListeners=new Set();views=[];sizes=[];
  for(const fn of [context.clearRect,context.setTransform,context.beginPath,context.arc,context.fill])fn.mockClear();
  vi.stubGlobal('CanvasRenderingContext2D',class {});
  vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockReturnValue({x:0,y:0,top:0,left:0,bottom:200,right:400,width:400,height:200,toJSON:()=>({})});
  vi.spyOn(document,'hidden','get').mockImplementation(()=>hidden);
  vi.stubGlobal('requestAnimationFrame',(callback:FrameRequestCallback)=>{frames.set(++nextFrame,callback);return nextFrame;});
  vi.stubGlobal('cancelAnimationFrame',(id:number)=>frames.delete(id));
  vi.stubGlobal('matchMedia',()=>({get matches(){return reduced;},addEventListener:(_event:string,listener:()=>void)=>mediaListeners.add(listener),removeEventListener:(_event:string,listener:()=>void)=>mediaListeners.delete(listener)}));
  vi.stubGlobal('IntersectionObserver',class {
    disconnect=vi.fn();
    constructor(callback:IntersectionObserverCallback){views.push({notify:visible=>callback([{isIntersecting:visible} as IntersectionObserverEntry],this as unknown as IntersectionObserver),disconnect:this.disconnect});}
    observe(){}
  });
  vi.stubGlobal('ResizeObserver',class {
    disconnect=vi.fn();
    constructor(callback:()=>void){sizes.push({notify:callback,disconnect:this.disconnect});}
    observe(){}
  });
});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});
const enterView=()=>views.at(-1)?.notify(true);
const advance=(time:number)=>{const pending=[...frames.values()];frames.clear();for(const callback of pending)callback(time);};

it('pauses and resumes from the keyboard while preserving the content action',async()=>{
  const user=userEvent.setup(),create=vi.fn();
  const {container}=render(<EmptyState title="暂无任务" graphic="particles" action={<Button onClick={create}>创建任务</Button>}/>);
  enterView();expect(frames.size).toBe(1);
  await user.tab();expect(screen.getByRole('button',{name:'暂停辅助图形动画'})).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(screen.getByRole('button',{name:'播放辅助图形动画'})).toHaveFocus();
  expect(frames.size).toBe(0);
  expect(container.querySelector('[data-running="false"]')).toHaveAttribute('aria-hidden','true');
  await user.tab();await user.keyboard('{Enter}');expect(create).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('button',{name:'播放辅助图形动画'}));enterView();
  expect(frames.size).toBe(1);
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it('responds to reduced motion and explicit static mode without a running frame loop',()=>{
  reduced=true;
  const {container,rerender}=render(<EmptyState title="暂无任务" graphic="particles"/>);
  enterView();expect(frames.size).toBe(0);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(container.querySelector('[data-running="false"] svg path')).toBeInTheDocument();
  act(()=>{reduced=false;for(const listener of mediaListeners)listener();});enterView();
  expect(frames.size).toBe(1);
  rerender(<EmptyState title="暂无任务" graphic="particles" animated={false}/>);enterView();
  expect(frames.size).toBe(0);expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('draws motion only in view, suspends hidden tabs and releases observers and pending frames',()=>{
  const {unmount}=render(<EmptyState title="暂无任务" graphic="particles"/>);
  expect(frames.size).toBe(0);enterView();
  advance(100);const first=context.arc.mock.calls.at(-1);
  advance(140);expect(context.arc.mock.calls.at(-1)).not.toEqual(first);
  hidden=true;document.dispatchEvent(new Event('visibilitychange'));expect(frames.size).toBe(0);
  hidden=false;document.dispatchEvent(new Event('visibilitychange'));expect(frames.size).toBe(1);
  views.at(-1)!.notify(false);expect(frames.size).toBe(0);
  enterView();expect(frames.size).toBe(1);
  const view=views.at(-1)!,size=sizes.at(-1)!;
  unmount();expect(frames.size).toBe(0);
  expect(view.disconnect).toHaveBeenCalledOnce();expect(size.disconnect).toHaveBeenCalledOnce();expect(mediaListeners.size).toBe(0);
  view.notify(true);size.notify();expect(frames.size).toBe(0);
});

it('lets a custom illustration override the built-in graphic without starting animation',()=>{
  render(<EmptyState title="暂无任务" graphic="particles" illustration={<img src="/wave.png" alt="装饰声面"/>}/>);
  expect(views).toHaveLength(0);expect(frames.size).toBe(0);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();expect(screen.queryByRole('img')).not.toBeInTheDocument();
});
