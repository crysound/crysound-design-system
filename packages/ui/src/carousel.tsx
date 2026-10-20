import {useEffect,useId,useRef,useState,type ReactNode} from 'react';
import {CarouselPagination} from './carousel-pagination';
import {IconButton} from './icon-button';
export interface CarouselItem {id:string;label:string;content:ReactNode;}
export interface CarouselProps {items:CarouselItem[];label:string;value?:number;defaultValue?:number;onValueChange?:(value:number)=>void;loop?:boolean;pagination?:boolean;arrows?:boolean;autoPlay?:boolean;showPlayControl?:boolean;interval?:number;className?:string;controlsClassName?:string;paginationClassName?:string;previousLabel?:string;nextLabel?:string;previousIcon?:ReactNode;nextIcon?:ReactNode;}
const Arrow=({back=false}:{back?:boolean})=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={back?'M19 12H5m7-7-7 7 7 7':'M5 12h14m-7-7 7 7-7 7'}/></svg>;
export function Carousel({items,label,value,defaultValue=0,onValueChange,loop=true,pagination=true,arrows=true,autoPlay=false,showPlayControl=true,interval=5000,className,controlsClassName,paginationClassName,previousLabel="上一张",nextLabel="下一张",previousIcon,nextIcon}:CarouselProps){
 const id=useId();const pointerRunning=useRef(false);const [internal,setInternal]=useState(defaultValue);const [running,setRunning]=useState(autoPlay);const [hover,setHover]=useState(false);const [hidden,setHidden]=useState(false);const [reduced,setReduced]=useState(false);
 const index=Math.max(0,Math.min(items.length-1,Math.floor(Number.isFinite(value??internal)?(value??internal):0)));
 const [presentedId,setPresentedId]=useState(()=>items[index]?.id);const slides=useRef(new Map<string,HTMLDivElement>());
 const foundIndex=items.findIndex(item=>item.id===presentedId);const presentedIndex=foundIndex<0?index:foundIndex;const targetId=items[index]?.id;
 // Retain mounted images and the current frame until the requested slide is decoded.
 useEffect(()=>{
  if(targetId===undefined||targetId===presentedId)return;
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
 },[targetId,presentedId,items]);
 const change=(next:number)=>{if(next===index)return;if(value===undefined)setInternal(next);onValueChange?.(next);};
 useEffect(()=>{setRunning(autoPlay);},[autoPlay]);
 useEffect(()=>{const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media?.matches??false);const visibility=()=>setHidden(document.hidden);update();visibility();media?.addEventListener('change',update);document.addEventListener('visibilitychange',visibility);return()=>{media?.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);};},[]);
 useEffect(()=>{if(!running||hover||hidden||reduced||items.length<2||(!loop&&index===items.length-1))return;const timer=window.setInterval(()=>change((index+1)%items.length),Math.max(1000,Number.isFinite(interval)?interval:5000));return()=>window.clearInterval(timer);},[running,hover,hidden,reduced,index,items.length,loop,interval,value,onValueChange]);
 useEffect(()=>{if(!loop&&items.length>0&&index===items.length-1)setRunning(false);},[loop,index,items.length]);
 const next=(delta:number)=>{const n=index+delta;change(loop?(n+items.length)%items.length:Math.max(0,Math.min(items.length-1,n)));};
 return <section className={['cs-carousel',className].filter(Boolean).join(' ')} aria-label={label} aria-roledescription="轮播图" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setRunning(false)} onKeyDown={e=>{if(e.target!==e.currentTarget||items.length<2)return;if(e.key==='ArrowRight'){e.preventDefault();next(1);}else if(e.key==='ArrowLeft'){e.preventDefault();next(-1);}}} tabIndex={items.length>1?0:undefined}>
 {!items.length?<div className="cs-carousel-empty">暂无内容</div>:<div className="cs-carousel-viewport" id={id} aria-live={running?'off':'polite'} aria-atomic="true"><div className="cs-carousel-track" style={{transform:`translate3d(${-presentedIndex*100}%,0,0)`}}>{items.map((item,i)=><div key={item.id} ref={node=>{if(node)slides.current.set(item.id,node);else slides.current.delete(item.id);}} className="cs-carousel-slide" role="group" aria-roledescription="幻灯片" aria-label={`${i+1} / ${items.length} · ${item.label}`} aria-hidden={i!==presentedIndex||undefined} inert={i!==presentedIndex||undefined}>{item.content}</div>)}</div></div>}
 {items.length>1&&<div className={["cs-carousel-controls",controlsClassName].filter(Boolean).join(" ")}>{arrows&&<IconButton label={previousLabel} tooltip={false} variant="ghost" disabled={!loop&&index===0} onClick={()=>next(-1)}>{previousIcon??<Arrow back/>}</IconButton>}{pagination&&<CarouselPagination className={paginationClassName} count={items.length} value={index} onValueChange={change} labels={items.map(i=>i.label)} controls={id}/>}{arrows&&<IconButton label={nextLabel} tooltip={false} variant="ghost" disabled={!loop&&index===items.length-1} onClick={()=>next(1)}>{nextIcon??<Arrow/>}</IconButton>}{autoPlay&&showPlayControl&&<button type="button" className="cs-carousel-play" disabled={reduced} onPointerDown={()=>{pointerRunning.current=running;}} onClick={e=>setRunning(e.detail>0?!pointerRunning.current:!running)}>{reduced?'已减少动态效果':running?'暂停轮播':'播放轮播'}</button>}</div>}
 </section>;
}
