import React,{useRef,useState} from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FloatingToc} from '../packages/ui/src/floating-toc';
const items=[{id:'toc-first',label:'Overview'},{id:'toc-second',label:'Analysis mode'},{id:'toc-disabled',label:'Unavailable',disabled:true}];
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();vi.useRealTimers();});
function bounds(top:number){return {x:0,y:top,top,bottom:top+300,left:0,right:600,width:600,height:300,toJSON(){}};}
it('navigates inside the supplied scroll root without changing the router hash',async()=>{
 vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return bounds(this.id==='toc-second'?400:0);});
 const scrollTo=vi.fn();const changed=vi.fn();
 function Example(){const root=useRef<HTMLDivElement>(null);const [active,setActive]=useState('toc-first');return <><FloatingToc items={items} activeId={active} onActiveChange={id=>{setActive(id);changed(id);}} scrollContainerRef={root} offset={24}/><div ref={el=>{root.current=el;if(el)el.scrollTo=scrollTo;}}><section id="toc-first"/><section id="toc-second"/></div></>;}
 render(<Example/>);const hash=location.hash;const user=userEvent.setup();
 await user.tab();expect(screen.getByRole('link',{name:'Overview'})).toHaveFocus();
 await user.tab();expect(screen.getByRole('link',{name:'Analysis mode'})).toHaveFocus();
 await user.keyboard('{Enter}');
 expect(scrollTo).toHaveBeenCalledWith({top:376,behavior:'smooth'});
 expect(changed).toHaveBeenCalledWith('toc-second');
 expect(screen.getByRole('link',{name:'Analysis mode'})).toHaveAttribute('aria-current','location');
 expect(location.hash).toBe(hash);expect(screen.queryByRole('link',{name:'Unavailable'})).toBeNull();
});
it('tracks scrolled sections and clears the active title after idle time',()=>{
 vi.useFakeTimers();let secondTop=400;let frame:FrameRequestCallback|undefined;
 vi.stubGlobal('requestAnimationFrame',(callback:FrameRequestCallback)=>{frame=callback;return 1;});vi.stubGlobal('cancelAnimationFrame',vi.fn());
 vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return bounds(this.id==='toc-second'?secondTop:0);});
 render(<><FloatingToc items={items} offset={24}/><section id="toc-first"/><section id="toc-second"/></>);
 secondTop=10;act(()=>{document.dispatchEvent(new Event('scroll'));frame?.(0);});
 expect(screen.getByRole('link',{name:'Analysis mode'})).toHaveAttribute('aria-current','location');
 const nav=screen.getByRole('navigation',{name:'On this page'});expect(nav).toHaveAttribute('data-label-visible','true');
 act(()=>vi.advanceTimersByTime(6000));expect(nav).not.toHaveAttribute('data-label-visible');
});
it('respects reduced motion and ignores targets that do not exist',async()=>{
 vi.stubGlobal('matchMedia',()=>({matches:true}));const scrollTo=vi.spyOn(window,'scrollTo').mockImplementation(()=>{});
 vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(()=>bounds(200));
 render(<><FloatingToc items={[...items,{id:'missing',label:'Missing'}]} offset={24}/><section id="toc-first"/><section id="toc-second"/></>);
 const user=userEvent.setup();await user.click(screen.getByRole('link',{name:'Analysis mode'}));
 expect(scrollTo).toHaveBeenCalledWith({top:176,behavior:'instant'});
 await user.click(screen.getByRole('link',{name:'Missing'}));expect(scrollTo).toHaveBeenCalledTimes(1);
});
it('renders no empty navigation',()=>{const {container}=render(<FloatingToc items={[]}/>);expect(container).toBeEmptyDOMElement();});
