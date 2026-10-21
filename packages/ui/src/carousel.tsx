import {useEffect,useId,useLayoutEffect,useRef,useState,type CSSProperties,type ReactNode,type PointerEvent} from 'react';
import {CarouselPagination} from './carousel-pagination';
import {IconButton} from './icon-button';
export interface CarouselItem {id:string;label:string;content:ReactNode;}
export interface CarouselProps {items:CarouselItem[];label:string;value?:number;defaultValue?:number;onValueChange?:(value:number)=>void;loop?:boolean;draggable?:boolean;itemsPerView?:number;pagination?:boolean;arrows?:boolean;autoPlay?:boolean;showPlayControl?:boolean;interval?:number;className?:string;controlsClassName?:string;paginationClassName?:string;previousLabel?:string;nextLabel?:string;previousIcon?:ReactNode;nextIcon?:ReactNode;}
const Arrow=({back=false}:{back?:boolean})=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={back?'M19 12H5m7-7-7 7 7 7':'M5 12h14m-7-7 7 7-7 7'}/></svg>;
export function Carousel({items,label,value,defaultValue=0,onValueChange,loop=true,draggable=false,itemsPerView=1,pagination=true,arrows=true,autoPlay=false,showPlayControl=true,interval=5000,className,controlsClassName,paginationClassName,previousLabel="上一张",nextLabel="下一张",previousIcon,nextIcon}:CarouselProps){
 const id=useId();const pointerRunning=useRef(false);const [internal,setInternal]=useState(defaultValue);const [running,setRunning]=useState(autoPlay);const [hover,setHover]=useState(false);const [hidden,setHidden]=useState(false);const [reduced,setReduced]=useState(false);
 const index=Math.max(0,Math.min(items.length-1,Math.floor(Number.isFinite(value??internal)?(value??internal):0)));
 const [presentedId,setPresentedId]=useState(()=>items[index]?.id);const slides=useRef(new Map<number,HTMLDivElement>());
 const foundIndex=items.findIndex(item=>item.id===presentedId);const presentedIndex=foundIndex<0?index:foundIndex;const targetId=items[index]?.id;
 const track=useRef<HTMLDivElement>(null);const [dragging,setDragging]=useState(false);const [dragOffset,setDragOffset]=useState(0);const suppressClick=useRef(false);
 const viewportRef=useRef<HTMLDivElement>(null);const cardRail=Number.isFinite(itemsPerView)&&itemsPerView>1;
 const [visibleCount,setVisibleCount]=useState(1);const [step,setStep]=useState(100);
 const wheel=useRef<{offset:number;timer:ReturnType<typeof setTimeout>}|null>(null);
 const renderedItems=cardRail?[...items,...items.slice(0,visibleCount-1)]:items;
 const gesture=useRef<{id:number;x:number;y:number;width:number;offset:number;dx:number;lastX:number;time:number;velocity:number;active:boolean;viewport:HTMLDivElement}|null>(null);
 const cancelWheel=()=>{if(!wheel.current)return;clearTimeout(wheel.current.timer);wheel.current=null;setDragging(false);setDragOffset(0);};
 const change=(next:number)=>{cancelWheel();if(next===index)return;if(value===undefined)setInternal(next);onValueChange?.(next);};
 useLayoutEffect(()=>{
  if(!cardRail){setStep(100);setVisibleCount(1);return;}
  const viewport=viewportRef.current;if(!viewport)return;
  const measure=()=>{
   const first=track.current?.firstElementChild;const second=first?.nextElementSibling;
   const width=viewport.getBoundingClientRect().width;if(!first||!width)return;
   const cardWidth=first.getBoundingClientRect().width;
   const distance=second?second.getBoundingClientRect().left-first.getBoundingClientRect().left:width;
   const gap=distance-cardWidth;
   setStep(distance/width*100);setVisibleCount(Math.max(1,Math.min(items.length,Math.round((width+gap)/distance))));
  };
  measure();const observer=new ResizeObserver(measure);observer.observe(viewport);return()=>observer.disconnect();
 },[cardRail,itemsPerView,items.length]);
 const livePosition=()=>{
  const matrix=getComputedStyle(track.current!).transform.match(/^matrix(3d)?\((.+)\)$/);
  if(matrix&&viewportRef.current?.clientWidth){const values=matrix[2].split(',').map(Number);return -values[matrix[1]?12:4]/viewportRef.current.clientWidth*100;}
  const percent=track.current?.style.transform.match(/^translate3d\(([-+\d.e]+)%,/);if(percent)return -Number(percent[1]);
  return presentedIndex*step-dragOffset;
 };
 const prepareImages=(start:number)=>{
  for(let i=Math.max(0,start);i<Math.min(renderedItems.length,start+visibleCount);i++)slides.current.get(i)?.querySelectorAll('img').forEach(image=>{image.loading='eager';});
 };
 // Percent offsets also follow the pointer inside an externally scaled design preview.
 useLayoutEffect(()=>{if(!dragging&&index===presentedIndex)setDragOffset(0);},[dragging,index,presentedIndex]);
 const startDrag=(event:PointerEvent<HTMLDivElement>)=>{
  if(!draggable||items.length<2||event.button!==0||event.isPrimary===false||gesture.current)return;
  suppressClick.current=false;
  cancelWheel();
  const target=event.target as Element;
  if(target.closest('button,input,textarea,select,[role="slider"],[contenteditable="true"],[data-carousel-no-drag]'))return;
  const viewport=event.currentTarget;const width=viewport.getBoundingClientRect().width;if(!width)return;
  const offset=presentedIndex*step-livePosition();
  gesture.current={id:event.pointerId,x:event.clientX,y:event.clientY,width,offset,dx:0,lastX:event.clientX,time:event.timeStamp,velocity:0,active:false,viewport};
  setDragOffset(offset);setDragging(true);
  prepareImages(presentedIndex-1);prepareImages(presentedIndex+1);
 };
 const moveDrag=(event:PointerEvent<HTMLDivElement>)=>{
  const current=gesture.current;if(!current||event.pointerId!==current.id)return;
  const dx=event.clientX-current.x;const dy=event.clientY-current.y;
  if(!current.active){
   if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)){gesture.current=null;setDragging(false);setDragOffset(0);return;}
   if(Math.abs(dx)<8||Math.abs(dx)<=Math.abs(dy))return;
   current.active=true;current.viewport.setPointerCapture(event.pointerId);setRunning(false);
  }
  event.preventDefault();
  const elapsed=event.timeStamp-current.time;if(elapsed>0)current.velocity=(event.clientX-current.lastX)/elapsed;
  current.lastX=event.clientX;current.time=event.timeStamp;current.dx=dx;
  if(cardRail){
   const position=presentedIndex*step-current.offset-dx/current.width*100;const limit=(items.length-1)*step;
   const resisted=position<0?position*.2:position>limit?limit+(position-limit)*.2:position;
   setDragOffset(presentedIndex*step-resisted);
  }else{
   const atEdge=(presentedIndex===0&&dx>0)||(presentedIndex===items.length-1&&dx<0);
   const distance=atEdge?dx*.2:dx;const percent=Math.max(-90,Math.min(90,distance/current.width*100));
   setDragOffset(current.offset+percent);
  }
 };
 const finishDrag=(event:PointerEvent<HTMLDivElement>,cancel=false)=>{
  const current=gesture.current;if(!current||event.pointerId!==current.id)return;
  gesture.current=null;setDragging(false);
  if(current.viewport.hasPointerCapture(current.id))current.viewport.releasePointerCapture(current.id);
  if(!current.active){setDragOffset(0);return;}
  suppressClick.current=true;event.preventDefault();
  const velocity=event.timeStamp-current.time<100?current.velocity:0;
  const projected=current.dx+velocity*140;
  const proposed=cardRail?Math.round((presentedIndex*step-current.offset-current.dx/current.width*100)/step):Math.abs(projected)>=Math.min(80,current.width*.16)?presentedIndex+(projected<0?1:-1):presentedIndex;
  const target=cancel?presentedIndex:Math.max(0,Math.min(items.length-1,proposed));
  if(target===presentedIndex)setDragOffset(0);
  change(target);
 };
 useEffect(()=>{
  if(!cardRail||!draggable)return;
  const viewport=viewportRef.current;if(!viewport)return;
  const onWheel=(event:WheelEvent)=>{
   if(gesture.current||event.ctrlKey)return;
   const delta=event.deltaX||(event.shiftKey?event.deltaY:0);if(!delta)return;
   const width=viewport.getBoundingClientRect().width;if(!width)return;
   const unit=event.deltaMode===1?16:event.deltaMode===2?width:1;
   const current=wheel.current?.offset??livePosition();const next=Math.max(0,Math.min((items.length-1)*step,current+delta*unit/width*100));
   if(Math.abs(next-current)<.001)return;
   event.preventDefault();setRunning(false);setDragging(true);setDragOffset(presentedIndex*step-next);
   prepareImages(Math.floor(next/step));
   if(wheel.current)clearTimeout(wheel.current.timer);
   wheel.current={offset:next,timer:setTimeout(()=>{
    wheel.current=null;setDragging(false);const target=Math.round(next/step);
    if(target===presentedIndex)setDragOffset(0);change(target);
   },140)};
  };
  viewport.addEventListener('wheel',onWheel,{passive:false});
  return()=>{viewport.removeEventListener('wheel',onWheel);cancelWheel();};
 },[cardRail,draggable,items.length,visibleCount,index,presentedIndex,step,value,onValueChange]);
 // Retain mounted images and the current frame until the requested slide is decoded.
 useEffect(()=>{
  if(dragging||targetId===undefined||targetId===presentedId)return;
  const controller=new AbortController();const {signal}=controller;
  const images=Array.from({length:visibleCount},(_,offset)=>Array.from(slides.current.get(index+offset)?.querySelectorAll('img')??[])).flat();
  images.forEach(image=>{image.loading='eager';});
  const ready=images.filter(image=>!image.complete||typeof image.decode==='function').map(image=>{
   return new Promise<void>(resolve=>{
    const finish=()=>{image.removeEventListener('load',loaded);image.removeEventListener('error',finish);signal.removeEventListener('abort',finish);resolve();};
    const loaded=()=>{if(signal.aborted||!image.decode){finish();return;}image.decode().catch(()=>{}).then(finish);};
    if(image.complete){loaded();return;}
    image.addEventListener('load',loaded,{once:true});image.addEventListener('error',finish,{once:true});signal.addEventListener('abort',finish,{once:true});
   });
  });
  if(!ready.length)setPresentedId(targetId);
  else void Promise.all(ready).then(()=>{if(!signal.aborted)setPresentedId(targetId);});
  return()=>controller.abort();
 },[targetId,presentedId,items,dragging,visibleCount,index]);
 useEffect(()=>{setRunning(autoPlay);},[autoPlay]);
 useEffect(()=>{const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media?.matches??false);const visibility=()=>setHidden(document.hidden);update();visibility();media?.addEventListener('change',update);document.addEventListener('visibilitychange',visibility);return()=>{media?.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);};},[]);
 useEffect(()=>{if(!running||hover||hidden||reduced||dragging||items.length<2||(!loop&&index===items.length-1))return;const timer=window.setInterval(()=>change((index+1)%items.length),Math.max(1000,Number.isFinite(interval)?interval:5000));return()=>window.clearInterval(timer);},[running,hover,hidden,reduced,dragging,index,items.length,loop,interval,value,onValueChange]);
 useEffect(()=>{if(!loop&&items.length>0&&index===items.length-1)setRunning(false);},[loop,index,items.length]);
 const next=(delta:number)=>{const n=index+delta;change(loop?(n+items.length)%items.length:Math.max(0,Math.min(items.length-1,n)));};
 return <section className={['cs-carousel',cardRail&&'cs-carousel--cards',className].filter(Boolean).join(' ')} aria-label={label} aria-roledescription="轮播图" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setRunning(false)} onKeyDown={e=>{if(e.target!==e.currentTarget||items.length<2)return;if(e.key==='ArrowRight'){e.preventDefault();next(1);}else if(e.key==='ArrowLeft'){e.preventDefault();next(-1);}}} tabIndex={items.length>1?0:undefined}>
 {!items.length?<div className="cs-carousel-empty">暂无内容</div>:<div ref={viewportRef} className="cs-carousel-viewport" id={id} style={cardRail?{'--cs-carousel-items':Math.max(1,Math.min(items.length,Math.floor(itemsPerView)))} as CSSProperties:undefined} aria-live={running?'off':'polite'} aria-atomic="true" data-draggable={draggable&&items.length>1||undefined} data-dragging={dragging||undefined} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={event=>finishDrag(event,true)} onLostPointerCapture={event=>finishDrag(event,true)} onPointerLeave={event=>{if(gesture.current&&!gesture.current.active)finishDrag(event,true);}} onDragStart={event=>{if(draggable)event.preventDefault();}} onClickCapture={event=>{if(suppressClick.current&&event.detail!==0){event.preventDefault();event.stopPropagation();suppressClick.current=false;}}}><div ref={track} className="cs-carousel-track" style={{transform:`translate3d(${-presentedIndex*step+dragOffset}%,0,0)`}}>{renderedItems.map((item,i)=>{const visible=i>=presentedIndex&&i<presentedIndex+visibleCount;return <div key={i<items.length?item.id:`copy:${item.id}`} ref={node=>{if(node)slides.current.set(i,node);else slides.current.delete(i);}} className="cs-carousel-slide" role="group" aria-roledescription={cardRail?'卡片':'幻灯片'} aria-label={`${i%items.length+1} / ${items.length} · ${item.label}`} aria-hidden={!visible||undefined} inert={!visible||undefined}>{item.content}</div>;})}</div></div>}
 {items.length>1&&<div className={["cs-carousel-controls",controlsClassName].filter(Boolean).join(" ")} onClickCapture={cancelWheel}>{arrows&&<IconButton label={previousLabel} tooltip={false} variant="ghost" disabled={!loop&&index===0} onClick={()=>next(-1)}>{previousIcon??<Arrow back/>}</IconButton>}{pagination&&<CarouselPagination className={paginationClassName} count={items.length} value={index} onValueChange={change} labels={items.map(i=>i.label)} controls={id}/>}{arrows&&<IconButton label={nextLabel} tooltip={false} variant="ghost" disabled={!loop&&index===items.length-1} onClick={()=>next(1)}>{nextIcon??<Arrow/>}</IconButton>}{autoPlay&&showPlayControl&&<button type="button" className="cs-carousel-play" disabled={reduced} onPointerDown={()=>{pointerRunning.current=running;}} onClick={e=>setRunning(e.detail>0?!pointerRunning.current:!running)}>{reduced?'已减少动态效果':running?'暂停轮播':'播放轮播'}</button>}</div>}
 </section>;
}
