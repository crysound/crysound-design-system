"use client";
import {useEffect,useRef,useState} from 'react';

interface NavigationPanelImageProps {src:string;preview?:string;}
const decodedSources=new Set<string>();

/** Decorative card image: keep its box stable and reveal only a decoded source. */
export function NavigationPanelImage({src,preview}:NavigationPanelImageProps) {
 const root=useRef<HTMLSpanElement>(null);
 const image=useRef<HTMLImageElement>(null);
 const [active,setActive]=useState(false);
 const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
 const [cached,setCached]=useState(false);

 useEffect(()=>{
  if(!root.current)return;
  if(typeof IntersectionObserver==='undefined'){setActive(true);return;}
  let cancelled=false;
  const observer=new IntersectionObserver(entries=>{
   if(!cancelled&&entries.some(entry=>entry.isIntersecting)){setActive(true);observer.disconnect();}
  },{rootMargin:'160px'});
  observer.observe(root.current);
  return()=>{cancelled=true;observer.disconnect();};
 },[]);

 useEffect(()=>{
  if(!active||!image.current)return;
  const element=image.current;
  let cancelled=false;
  const fail=()=>{if(!cancelled)setState('error');};
  const reveal=async()=>{
   try {await element.decode?.();} catch { /* A loaded source can still paint if decode is unavailable. */ }
   if(!cancelled){
    if(element.naturalWidth>0){
     if(decodedSources.has(src))setCached(true);
     decodedSources.add(src);
     if(decodedSources.size>128)decodedSources.delete(decodedSources.values().next().value!);
     setState('ready');
    }else fail();
   }
  };
  const loaded=()=>{void reveal();};
  element.addEventListener('load',loaded);
  element.addEventListener('error',fail);
  if(element.complete&&element.naturalWidth>0){setCached(true);void reveal();}
  else if(element.complete)fail();
  return()=>{cancelled=true;element.removeEventListener('load',loaded);element.removeEventListener('error',fail);};
 },[active]);

 return <span ref={root} className="cs-navigation-image" data-state={state} data-cached={cached||undefined} aria-hidden="true">
  <img ref={image} className="cs-navigation-image-full" src={active?src:undefined} alt="" loading="lazy" decoding="async"/>
  {preview&&<img className="cs-navigation-image-preview" src={preview} alt="" decoding="async"/>}
  {state==='error'&&<svg className="cs-navigation-image-error" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 17 5-5 4 4 4-6 5 7M8 8h.01"/></svg>}
 </span>;
}
