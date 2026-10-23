"use client";
import {useEffect,useRef,useState,type ComponentPropsWithoutRef} from 'react';
import {cx} from './utils';

export interface NavigationPanelImageSource {src:string;preview?:string;}
export interface NavigationPanelMediaProps extends Omit<ComponentPropsWithoutRef<'span'>,'children'> {
 sources:readonly NavigationPanelImageSource[];
 fit?:'cover'|'contain';
}
const decodedSources=new Set<string>();

/** A custom composition shares one lazy-load and decode boundary across all layers. */
export function NavigationPanelMedia({sources,...props}:NavigationPanelMediaProps) {
 if(!sources.length)return null;
 return <NavigationPanelMediaContent key={JSON.stringify(sources)} sources={sources} {...props}/>;
}
export function NavigationPanelImage({src,preview,fit='cover'}:{src:string;preview?:string;fit?:'cover'|'contain'}) {
 return <NavigationPanelMedia sources={[{src,preview}]} fit={fit}/>;
}
function NavigationPanelMediaContent({sources,fit='cover',className,...props}:NavigationPanelMediaProps) {
 const root=useRef<HTMLSpanElement>(null);
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
  if(!active||!root.current)return;
  const images=Array.from(root.current.querySelectorAll<HTMLImageElement>('[data-navigation-source]'));
  const complete=images.every(image=>image.complete&&image.naturalWidth>0);
  let cancelled=false;
  const cancelPending:(()=>void)[]=[];
  const pending=images.map(element=>new Promise<boolean>(resolve=>{
   let settled=false;
   const finish=(ready:boolean)=>{if(settled)return;settled=true;element.removeEventListener('load',loaded);element.removeEventListener('error',failed);resolve(ready);};
   const loaded=async()=>{try {await element.decode?.();} catch { /* A loaded image can still paint after decode rejection. */ }finish(element.naturalWidth>0);};
   const failed=()=>{if(!cancelled)setState('error');finish(false);};
   element.addEventListener('load',loaded);
   element.addEventListener('error',failed);
   cancelPending.push(()=>finish(false));
   if(element.complete){if(element.naturalWidth>0)void loaded();else failed();}
  }));
  void Promise.all(pending).then(ready=>{
   if(cancelled)return;
   if(!ready.every(Boolean)){setState('error');return;}
   setCached(complete||sources.every(source=>decodedSources.has(source.src)));
   for(const source of sources){decodedSources.add(source.src);if(decodedSources.size>128)decodedSources.delete(decodedSources.values().next().value!);}
   setState('ready');
  });
  return()=>{cancelled=true;cancelPending.forEach(cancel=>cancel());};
 },[active]);

 const original=(source:NavigationPanelImageSource,index:number)=> <img key={index} data-navigation-source="" data-layer={index} src={active?source.src:undefined} alt="" loading="lazy" decoding="async"/>;
 const preview=(source:NavigationPanelImageSource,index:number)=>source.preview?<img key={index} data-layer={index} src={source.preview} alt="" loading="lazy" decoding="async"/>:null;
 return <span {...props} ref={root} className={cx('cs-navigation-image',className)} data-state={state} data-fit={fit} data-cached={cached||undefined} aria-hidden="true">
  {sources.length===1?<img className="cs-navigation-image-full" data-navigation-source="" src={active?sources[0].src:undefined} alt="" loading="lazy" decoding="async"/>:<span className="cs-navigation-image-full">{sources.map(original)}</span>}
  {sources.length===1?(sources[0].preview&&<img className="cs-navigation-image-preview" src={sources[0].preview} alt="" loading="lazy" decoding="async"/>):sources.some(source=>source.preview)&&<span className="cs-navigation-image-preview">{sources.map(preview)}</span>}
  {state==='error'&&<svg className="cs-navigation-image-error" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 17 5-5 4 4 4-6 5 7M8 8h.01"/></svg>}
 </span>;
}
