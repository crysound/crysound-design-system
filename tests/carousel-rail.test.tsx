import React from 'react';
import {afterAll,afterEach,beforeAll,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {Carousel} from '../packages/ui/src/carousel';
class RailPointerEvent extends MouseEvent {
 readonly pointerId=1;readonly isPrimary=true;
}
beforeAll(()=>vi.stubGlobal('PointerEvent',RailPointerEvent));
afterAll(()=>vi.unstubAllGlobals());
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.useRealTimers();});
function setup({image=false,onValueChange=vi.fn()}={}){
 let width=600;let stride=160;let cardWidth=140;let resized:()=>void=()=>{};
 vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){
  const viewport=this.classList.contains('cs-carousel-viewport');const card=this.classList.contains('cs-carousel-slide');
  const index=card?Array.from(this.parentElement!.children).indexOf(this):0;
  const x=card?index*stride:0;const measuredWidth=viewport?width:card?cardWidth:0;
  return {x,y:0,left:x,top:0,right:x+measuredWidth,bottom:300,width:measuredWidth,height:300,toJSON:()=>({})};
 });
 const OriginalObserver=globalThis.ResizeObserver;
 vi.stubGlobal('ResizeObserver',class{constructor(callback:()=>void){resized=callback;}observe(){}disconnect(){}});
 const items=Array.from({length:5},(_,i)=>({id:String(i),label:`文章${i}`,content:<a href={`/article/${i}`} onClick={e=>e.preventDefault()}>文章链接{i}{image&&i===4&&<img src="/pending.png" alt="第五张图"/>}</a>}));
 const view=render(<Carousel items={items} itemsPerView={4} label="卡片列表" draggable loop={false} arrows={false} onValueChange={onValueChange}/>);
 vi.stubGlobal('ResizeObserver',OriginalObserver);
 const viewport=view.container.querySelector<HTMLElement>('.cs-carousel-viewport')!;
 Object.defineProperty(viewport,'clientWidth',{get:()=>width});
 const pointer=(type:string,x:number,time=0)=>{
  const event=new RailPointerEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:40,button:0});
  Object.defineProperty(event,'timeStamp',{value:time});fireEvent(viewport,event);
 };
 return {...view,viewport,pointer,onValueChange,resize:()=>{width=400;stride=200;cardWidth=180;act(()=>resized());},track:view.container.querySelector<HTMLElement>('.cs-carousel-track')!};
}
it('exposes four unique visible cards and uses tail copies without duplicate accessible links',()=>{
 const {container}=setup();expect(screen.getAllByRole('link')).toHaveLength(4);
 expect(container.querySelectorAll('.cs-carousel-slide')).toHaveLength(8);
 fireEvent.click(screen.getByRole('button',{name:'文章4'}));
 expect(screen.getAllByRole('link').map(link=>link.textContent)).toEqual(['文章链接4','文章链接0','文章链接1','文章链接2']);
 expect(screen.getAllByRole('button')).toHaveLength(5);
});
it('snaps to the nearest card and can cross more than one card in a single drag',()=>{
 const {pointer,track}=setup();pointer('pointerdown',500);pointer('pointermove',240,200);pointer('pointerup',240,320);
 expect(screen.getByRole('button',{name:'文章2'})).toHaveAttribute('aria-current','true');
 expect(Number(track.style.transform.match(/-?[\d.]+(?=%)/)![0])).toBeCloseTo(-160/600*100*2);
});
it('keeps a short card drag at its nearest stop',()=>{
 const {pointer,track}=setup();pointer('pointerdown',500);pointer('pointermove',450,200);pointer('pointerup',450,320);
 expect(track).toHaveStyle({transform:'translate3d(0%,0,0)'});
});
it('supports horizontal wheels and Shift wheel, without hijacking vertical scrolling or zoom',()=>{
 vi.useFakeTimers();const {viewport}=setup();
 expect(fireEvent.wheel(viewport,{deltaY:200})).toBe(true);
 expect(fireEvent.wheel(viewport,{deltaX:200,ctrlKey:true})).toBe(true);
 expect(fireEvent.wheel(viewport,{deltaX:160})).toBe(false);
 act(()=>vi.advanceTimersByTime(140));expect(screen.getByRole('button',{name:'文章1'})).toHaveAttribute('aria-current','true');
 fireEvent.wheel(viewport,{deltaY:160,shiftKey:true});act(()=>vi.advanceTimersByTime(140));
 expect(screen.getByRole('button',{name:'文章2'})).toHaveAttribute('aria-current','true');
 fireEvent.click(screen.getByRole('button',{name:'文章4'}));expect(fireEvent.wheel(viewport,{deltaX:100})).toBe(true);
});
it('preserves the selected card and accessible visible range after responsive resizing',()=>{
 const {resize,track}=setup();fireEvent.click(screen.getByRole('button',{name:'文章2'}));resize();
 expect(screen.getAllByRole('link').map(link=>link.textContent)).toEqual(['文章链接2','文章链接3']);
 expect(track).toHaveStyle({transform:'translate3d(-100%,0,0)'});
});
it('waits for every card entering the visible range to decode',async()=>{
 const {container}=setup({image:true});const image=container.querySelector('img')!;
 Object.defineProperty(image,'complete',{value:false});let decoded!:()=>void;
 Object.defineProperty(image,'decode',{value:()=>new Promise<void>(resolve=>{decoded=resolve;})});
 fireEvent.click(screen.getByRole('button',{name:'文章1'}));
 expect(screen.getByRole('link',{name:'文章链接0'})).toBeVisible();
 fireEvent.load(image);await act(async()=>{decoded();});
 expect(screen.queryByRole('link',{name:'文章链接0'})).not.toBeInTheDocument();
 expect(screen.getByRole('img',{name:'第五张图'})).toBe(image);
});
it('clears the wheel settle work when unmounted',()=>{
 vi.useFakeTimers();const {viewport,unmount,onValueChange}=setup();fireEvent.wheel(viewport,{deltaX:160});unmount();
 act(()=>vi.advanceTimersByTime(500));expect(onValueChange).not.toHaveBeenCalled();
});
it('lets pagination interrupt wheel settling without a stale scroll overriding the choice',()=>{
 vi.useFakeTimers();const {viewport}=setup();fireEvent.wheel(viewport,{deltaX:160});
 fireEvent.click(screen.getByRole('button',{name:'文章3'}));act(()=>vi.advanceTimersByTime(500));
 expect(screen.getByRole('button',{name:'文章3'})).toHaveAttribute('aria-current','true');
 expect(viewport).not.toHaveAttribute('data-dragging');
 fireEvent.wheel(viewport,{deltaX:-160});fireEvent.click(screen.getByRole('button',{name:'文章3'}));
 act(()=>vi.advanceTimersByTime(500));expect(screen.getByRole('button',{name:'文章3'})).toHaveAttribute('aria-current','true');
 expect(viewport).not.toHaveAttribute('data-dragging');
});
