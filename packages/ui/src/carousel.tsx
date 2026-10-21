import {useEffect,useId,useLayoutEffect,useRef,useState,type ReactNode,type PointerEvent} from 'react';
import {CarouselPagination} from './carousel-pagination';
import {IconButton} from './icon-button';
export interface CarouselItem {id:string;label:string;content:ReactNode;}
export interface CarouselProps {items:CarouselItem[];label:string;value?:number;defaultValue?:number;onValueChange?:(value:number)=>void;loop?:boolean;draggable?:boolean;pagination?:boolean;arrows?:boolean;autoPlay?:boolean;showPlayControl?:boolean;interval?:number;className?:string;controlsClassName?:string;paginationClassName?:string;previousLabel?:string;nextLabel?:string;previousIcon?:ReactNode;nextIcon?:ReactNode;}
const Arrow=({back=false}:{back?:boolean})=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={back?'M19 12H5m7-7-7 7 7 7':'M5 12h14m-7-7 7 7-7 7'}/></svg>;
export function Carousel({items,label,value,defaultValue=0,onValueChange,loop=true,draggable=false,pagination=true,arrows=true,autoPlay=false,showPlayControl=true,interval=5000,className,controlsClassName,paginationClassName,previousLabel="上一张",nextLabel="下一张",previousIcon,nextIcon}:CarouselProps){
 const id=useId();const pointerRunning=useRef(false);const [internal,setInternal]=useState(defaultValue);const [running,setRunning]=useState(autoPlay);const [hover,setHover]=useState(false);const [hidden,setHidden]=useState(false);const [reduced,setReduced]=useState(false);
 const index=Math.max(0,Math.min(items.length-1,Math.floor(Number.isFinite(value??internal)?(value??internal):0)));
 const [presentedId,setPresentedId]=useState(()=>items[index]?.id);const slides=useRef(new Map<string,HTMLDivElement>());
 const foundIndex=items.findIndex(item=>item.id===presentedId);const presentedIndex=foundIndex<0?index:foundIndex;const targetId=items[index]?.id;
 const track=useRef<HTMLDivElement>(null);const [dragging,setDragging]=useState(false);const [dragOffset,setDragOffset]=useState(0);const suppressClick=useRef(false);
 const gesture=useRef<{id:number;x:number;y:number;width:number;offset:number;dx:number;lastX:number;time:number;velocity:number;active:boolean;viewport:HTMLDivElement}|null>(null);
 const change=(next:number)=>{if(next===index)return;if(value===undefined)setInternal(next);onValueChange?.(next);};
 // Percent offsets also follow the pointer inside an externally scaled design preview.
 useLayoutEffect(()=>{if(!dragging&&index===presentedIndex)setDragOffset(0);},[dragging,index,presentedIndex]);
 const startDrag=(event:PointerEvent<HTMLDivElement>)=>{
  if(!draggable||items.length<2||event.button!==0||event.isPrimary===false||gesture.current)return;
  const target=event.target as Element;
  if(target.closest('button,input,textarea,select,[role="slider"],[contenteditable="true"],[data-carousel-no-drag]'))return;
  const viewport=event.currentTarget;const width=viewport.getBoundingClientRect().width;if(!width)return;
  const matrix=getComputedStyle(track.current!).transform.match(/^matrix(3d)?\((.+)\)$/);let offset=dragOffset;
  if(matrix){const values=matrix[2].split(',').map(Number);offset=values[matrix[1]?12:4]/viewport.clientWidth*100+presentedIndex*100;}
  gesture.current={id:event.pointerId,x:event.clientX,y:event.clientY,width,offset,dx:0,lastX:event.clientX,time:event.timeStamp,velocity:0,active:false,viewport};
  suppressClick.current=false;setDragOffset(offset);setDragging(true);
  for(const adjacent of [presentedIndex-1,presentedIndex+1])slides.current.get(items[adjacent]?.id)?.querySelectorAll('img').forEach(image=>{image.loading='eager';});
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
  const atEdge=(presentedIndex===0&&dx>0)||(presentedIndex===items.length-1&&dx<0);
  const distance=atEdge?dx*.2:dx;const percent=Math.max(-90,Math.min(90,distance/current.width*100));
  setDragOffset(current.offset+percent);
 };
 const finishDrag=(event:PointerEvent<HTMLDivElement>,cancel=false)=>{
  const current=gesture.current;if(!current||event.pointerId!==current.id)return;
  gesture.current=null;setDragging(false);
  if(current.viewport.hasPointerCapture(current.id))current.viewport.releasePointerCapture(current.id);
  if(!current.active){setDragOffset(0);return;}
  suppressClick.current=true;event.preventDefault();
  const velocity=event.timeStamp-current.time<100?current.velocity:0;
  const projected=current.dx+velocity*140;
  const target=!cancel&&Math.abs(projected)>=Math.min(80,current.width*.16)?Math.max(0,Math.min(items.length-1,presentedIndex+(projected<0?1:-1))):presentedIndex;
  if(target===presentedIndex)setDragOffset(0);
  change(target);
 };
 // Retain mounted images and the current frame until the requested slide is decoded.
 useEffect(()=>{
  if(dragging||targetId===undefined||targetId===presentedId)return;
  const controller=new AbortController();const {signal}=controller;
  const images=Array.from(slides.current.get(targetId)?.querySelectorAll('img')??[]);
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
 },[targetId,presentedId,items,dragging]);
 useEffect(()=>{setRunning(autoPlay);},[autoPlay]);
 useEffect(()=>{const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media?.matches??false);const visibility=()=>setHidden(document.hidden);update();visibility();media?.addEventListener('change',update);document.addEventListener('visibilitychange',visibility);return()=>{media?.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);};},[]);
 useEffect(()=>{if(!running||hover||hidden||reduced||dragging||items.length<2||(!loop&&index===items.length-1))return;const timer=window.setInterval(()=>change((index+1)%items.length),Math.max(1000,Number.isFinite(interval)?interval:5000));return()=>window.clearInterval(timer);},[running,hover,hidden,reduced,dragging,index,items.length,loop,interval,value,onValueChange]);
 useEffect(()=>{if(!loop&&items.length>0&&index===items.length-1)setRunning(false);},[loop,index,items.length]);
 const next=(delta:number)=>{const n=index+delta;change(loop?(n+items.length)%items.length:Math.max(0,Math.min(items.length-1,n)));};
 return <section className={['cs-carousel',className].filter(Boolean).join(' ')} aria-label={label} aria-roledescription="轮播图" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setRunning(false)} onKeyDown={e=>{if(e.target!==e.currentTarget||items.length<2)return;if(e.key==='ArrowRight'){e.preventDefault();next(1);}else if(e.key==='ArrowLeft'){e.preventDefault();next(-1);}}} tabIndex={items.length>1?0:undefined}>
 {!items.length?<div className="cs-carousel-empty">暂无内容</div>:<div className="cs-carousel-viewport" id={id} aria-live={running?'off':'polite'} aria-atomic="true" data-draggable={draggable&&items.length>1||undefined} data-dragging={dragging||undefined} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={event=>finishDrag(event,true)} onLostPointerCapture={event=>finishDrag(event,true)} onPointerLeave={event=>{if(gesture.current&&!gesture.current.active)finishDrag(event,true);}} onDragStart={event=>{if(draggable)event.preventDefault();}} onClickCapture={event=>{if(suppressClick.current&&event.detail!==0){event.preventDefault();event.stopPropagation();suppressClick.current=false;}}}><div ref={track} className="cs-carousel-track" style={{transform:dragOffset?`translate3d(${-presentedIndex*100+dragOffset}%,0,0)`:`translate3d(${-presentedIndex*100}%,0,0)`}}>{items.map((item,i)=><div key={item.id} ref={node=>{if(node)slides.current.set(item.id,node);else slides.current.delete(item.id);}} className="cs-carousel-slide" role="group" aria-roledescription="幻灯片" aria-label={`${i+1} / ${items.length} · ${item.label}`} aria-hidden={i!==presentedIndex||undefined} inert={i!==presentedIndex||undefined}>{item.content}</div>)}</div></div>}
 {items.length>1&&<div className={["cs-carousel-controls",controlsClassName].filter(Boolean).join(" ")}>{arrows&&<IconButton label={previousLabel} tooltip={false} variant="ghost" disabled={!loop&&index===0} onClick={()=>next(-1)}>{previousIcon??<Arrow back/>}</IconButton>}{pagination&&<CarouselPagination className={paginationClassName} count={items.length} value={index} onValueChange={change} labels={items.map(i=>i.label)} controls={id}/>}{arrows&&<IconButton label={nextLabel} tooltip={false} variant="ghost" disabled={!loop&&index===items.length-1} onClick={()=>next(1)}>{nextIcon??<Arrow/>}</IconButton>}{autoPlay&&showPlayControl&&<button type="button" className="cs-carousel-play" disabled={reduced} onPointerDown={()=>{pointerRunning.current=running;}} onClick={e=>setRunning(e.detail>0?!pointerRunning.current:!running)}>{reduced?'已减少动态效果':running?'暂停轮播':'播放轮播'}</button>}</div>}
 </section>;
}
