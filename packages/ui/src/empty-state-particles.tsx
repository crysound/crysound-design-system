"use client";
import {useEffect,useRef,useState} from 'react';
import {PauseCircle,PlayCircle} from '@untitledui/icons';

const TAU=Math.PI*2;
const columns=58,rows=20;

// A small deterministic sound surface, adapted from the reference's visual rhythm.
// Depth changes dot size/opacity; a travelling band gently releases and gathers rows.
function sampleSurface(seconds:number){
  const phase=seconds/16*TAU;
  const points=[];
  for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){
    const u=column/(columns-1),depth=row/(rows-1),v=depth-.5;
    const seed=(row*73+column*137)*2.399963;
    const release=(.5+.5*Math.sin(phase-u*TAU))**3;
    const swell=Math.sin(u*TAU+.16*Math.sin(phase)+v*.45);
    const x=16+u*368+v*20+Math.sin(seed+phase)*release*9;
    const y=100-swell*(32+3*Math.sin(phase))+v*52+Math.cos(seed*1.7-phase)*release*13;
    const radius=.45+depth*.48+release*.15;
    const alpha=(.24+depth*.42+release*.18)*(.25+.75*Math.sin(u*Math.PI)**.4);
    points.push({x,y,radius,alpha});
  }
  return points;
}

function staticPaths(seconds:number){
  const paths=['','','',''];
  for(const point of sampleSurface(seconds)){
    const {x,y,radius:r}=point;
    const bin=Math.min(3,Math.floor(point.alpha*4));
    paths[bin]+=`M${(x-r).toFixed(2)} ${y.toFixed(2)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(r*2).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-r*2).toFixed(2)} 0`;
  }
  return paths;
}

/** Internal decoration for EmptyState; never a loading/progress signal. */
export function EmptyStateParticles({animated=true}:{animated?:boolean}){
  const canvas=useRef<HTMLCanvasElement>(null);
  const elapsed=useRef(0);
  const [paused,setPaused]=useState(false);
  const [reduced,setReduced]=useState(false);
  const [ready,setReady]=useState(false);
  const active=animated&&!paused&&!reduced;

  useEffect(()=>{
    const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media?.matches??false);
    update();media?.addEventListener('change',update);
    return()=>media?.removeEventListener('change',update);
  },[]);

  useEffect(()=>{
    const target=canvas.current;
    const host=target?.parentElement;
    if(!target||!host||typeof CanvasRenderingContext2D==='undefined')return;
    const context=target.getContext('2d');
    if(!context)return;
    setReady(true);
    let frame=0,previous=0,lastPaint=0,disposed=false;
    let width=0,height=0;
    let visible=typeof IntersectionObserver==='undefined';

    const paint=()=>{
      if(!width||!height)return;
      context.clearRect(0,0,400,200);
      context.fillStyle=getComputedStyle(target).color;
      for(const {x,y,radius,alpha} of sampleSurface(elapsed.current)){
        context.globalAlpha=alpha;
        context.beginPath();context.arc(x,y,radius,0,TAU);context.fill();
      }
      context.globalAlpha=1;
    };
    const canRun=()=>!disposed&&active&&visible&&!document.hidden&&width>0&&height>0;
    const tick=(now:number)=>{
      frame=0;
      if(!canRun())return;
      if(previous)elapsed.current+=Math.min((now-previous)/1000,.1);
      previous=now;
      if(now-lastPaint>=1000/30){paint();lastPaint=now;}
      frame=requestAnimationFrame(tick);
    };
    const sync=()=>{
      if(disposed)return;
      cancelAnimationFrame(frame);frame=0;previous=0;
      paint();
      if(canRun())frame=requestAnimationFrame(tick);
    };
    const resize=()=>{
      if(disposed)return;
      const bounds=host.getBoundingClientRect();
      width=bounds.width;height=bounds.height;
      const ratio=Math.min(window.devicePixelRatio||1,2);
      target.width=Math.max(1,Math.round(width*ratio));
      target.height=Math.max(1,Math.round(height*ratio));
      context.setTransform(target.width/400,0,0,target.height/200,0,0);
      sync();
    };
    resize();
    const sizeObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):undefined;
    sizeObserver?.observe(host);
    const viewObserver=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(entries=>{
      visible=entries.some(entry=>entry.isIntersecting);sync();
    }):undefined;
    viewObserver?.observe(host);
    document.addEventListener('visibilitychange',sync);
    window.addEventListener('resize',resize);
    return()=>{
      disposed=true;
      cancelAnimationFrame(frame);
      sizeObserver?.disconnect();viewObserver?.disconnect();
      document.removeEventListener('visibilitychange',sync);
      window.removeEventListener('resize',resize);
    };
  },[active]);

  const label=paused?'播放辅助图形动画':'暂停辅助图形动画';
  return <div className="cs-empty-state-graphic">
    <div className="cs-empty-state-art cs-empty-state-art--particles" aria-hidden="true" inert data-running={active&&ready}>
      <svg viewBox="0 0 400 200" preserveAspectRatio="none" focusable="false">{staticPaths(elapsed.current).map((d,index)=><path key={index} d={d} fill="currentColor" fillOpacity={(index+.5)/4}/>)}</svg>
      <canvas ref={canvas}/>
    </div>
    {animated&&!reduced&&ready&&<button type="button" className="cs-empty-state-motion-toggle" aria-label={label} title={label} onClick={()=>setPaused(value=>!value)}>{paused?<PlayCircle size={18}/>:<PauseCircle size={18}/>}</button>}
  </div>;
}
