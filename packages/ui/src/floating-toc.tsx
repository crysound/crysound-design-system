import {useCallback,useEffect,useRef,useState,type CSSProperties,type RefObject} from 'react';
import {Select} from './index';
export interface FloatingTocItem { id:string; label:string; disabled?:boolean; }
export interface FloatingTocProps {
  items:FloatingTocItem[];
  label?:string;
  activeId?:string;
  onActiveChange?:(id:string)=>void;
  /** Heading clearance below a sticky page header, in pixels. */
  offset?:number;
  scrollContainerRef?:RefObject<HTMLElement|null>;
  position?:'fixed'|'inline';
  className?:string;
  style?:CSSProperties;
}
/** Chapter rail with scroll tracking; the consuming page owns section IDs and content. */
export function FloatingToc({items,label='On this page',activeId,onActiveChange,offset=88,scrollContainerRef,position='fixed',className,style}:FloatingTocProps){
  const [internal,setInternal]=useState(items.find(item=>!item.disabled)?.id??'');
  const [labelVisible,setLabelVisible]=useState(false);
  const idleTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const current=items.some(item=>item.id===(activeId??internal)&&!item.disabled)?(activeId??internal):items.find(item=>!item.disabled)?.id;
  const currentRef=useRef(current);currentRef.current=current;
  const changeCallback=useRef(onActiveChange);changeCallback.current=onActiveChange;
  const change=useCallback((id:string)=>{if(currentRef.current===id)return;currentRef.current=id;setInternal(id);changeCallback.current?.(id);},[]);
  const reveal=useCallback(()=>{setLabelVisible(true);clearTimeout(idleTimer.current);idleTimer.current=setTimeout(()=>setLabelVisible(false),6000);},[]);
  useEffect(()=>()=>clearTimeout(idleTimer.current),[]);
  useEffect(()=>{
    const root=scrollContainerRef?.current;
    const scope=root??document;
    const targets=items.filter(item=>!item.disabled).map(item=>({id:item.id,element:root?Array.from(root.querySelectorAll<HTMLElement>('[id]')).find(el=>el.id===item.id):document.getElementById(item.id)})).filter(item=>item.element);
    let frame=0;
    const update=()=>{
      frame=0;
      const threshold=(root?root.getBoundingClientRect().top+root.clientTop:0)+offset;
      let next:string|undefined=targets[0]?.id;
      for(const target of targets)if(target.element!.getBoundingClientRect().top<=threshold+1)next=target.id;
      const scrollTop=root?root.scrollTop:window.scrollY;
      const viewHeight=root?root.clientHeight:window.innerHeight;
      const fullHeight=root?root.scrollHeight:document.documentElement.scrollHeight;
      if(fullHeight>viewHeight&&scrollTop+viewHeight>=fullHeight-2)next=targets.at(-1)?.id;
      if(next)change(next);
    };
    const onScroll=()=>{reveal();if(!frame)frame=requestAnimationFrame(update);};
    // Resolve targets after mount, including content following this component.
    update();scope.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    const observer=typeof ResizeObserver==='undefined'?undefined:new ResizeObserver(onScroll);
    targets.forEach(target=>observer?.observe(target.element!));
    return()=>{cancelAnimationFrame(frame);scope.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);observer?.disconnect();};
  },[items,offset,scrollContainerRef,change,reveal]);
  const navigate=(id:string)=>{
    const item=items.find(item=>item.id===id&&!item.disabled);if(!item)return;
    const root=scrollContainerRef?.current;
    const target=root?Array.from(root.querySelectorAll<HTMLElement>('[id]')).find(el=>el.id===id):document.getElementById(id);
    if(!target)return;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const top=target.getBoundingClientRect().top+(root?root.scrollTop-root.getBoundingClientRect().top-root.clientTop:window.scrollY)-offset;
    (root??window).scrollTo({top:Math.max(0,top),behavior:reduced?'instant':'smooth'});
    change(id);reveal();
  };
  if(!items.length)return null;
  const activeIndex=items.findIndex(item=>item.id===current);
  return <nav aria-label={label} className={['cs-floating-toc',`cs-floating-toc--${position}`,className].filter(Boolean).join(' ')} style={style} data-label-visible={labelVisible||undefined}>
    <div className="cs-floating-toc-rail">{items.map((item,index)=>{const distance=Math.abs(index-activeIndex);return <a key={item.id} href={item.disabled?undefined:`#${encodeURIComponent(item.id)}`} aria-label={item.label} aria-disabled={item.disabled||undefined} aria-current={item.id===current?'location':undefined} className="cs-floating-toc-item" style={{'--cs-toc-mark-width':`${[32,26,20][distance]??14}px`,'--cs-toc-mark-color':distance===0?'var(--cs-text)':distance===1?'var(--cs-muted)':distance===2?'var(--cs-border-strong,var(--cs-muted))':'var(--cs-border)'} as CSSProperties} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();navigate(item.id);}}><span className="cs-floating-toc-mark" aria-hidden="true"/><span className="cs-floating-toc-label" aria-hidden="true">{item.label}</span></a>;})}</div>
    <div className="cs-floating-toc-mobile"><Select label={label} value={current??''} disabled={!current} onChange={event=>navigate(event.target.value)}>{items.map(item=><option key={item.id} value={item.id} disabled={item.disabled}>{item.label}</option>)}</Select></div>
  </nav>;
}
