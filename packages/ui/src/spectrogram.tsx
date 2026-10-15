"use client";
import { useEffect, useId, useRef, useState } from 'react';

export interface SpectrogramFrame { time: number; levels: (number | null)[] }
export interface SpectrogramProps {
  title: string; description?: string; frequencies: number[]; frames: SpectrogramFrame[];
  range?: [number, number]; unit?: string; height?: number; loading?: boolean;
  frequencyScale?: 'linear' | 'log';
}
const stops = [[68,1,84],[59,82,139],[33,145,140],[94,201,98],[253,231,37]];
function heatColor(value: number, min: number, max: number) {
  const t = Math.max(0,Math.min(1,(value-min)/(max-min))) * (stops.length-1);
  const index = Math.min(stops.length-2,Math.floor(t)), mix=t-index;
  return `rgb(${stops[index].map((v,i)=>Math.round(v+(stops[index+1][i]-v)*mix)).join(',')})`;
}
/** Displays supplied time-frequency levels; signal processing belongs to the consumer. */
export function Spectrogram({title,description,frequencies,frames,range=[20,90],unit='dB SPL',height=320,loading=false,frequencyScale='linear'}:SpectrogramProps) {
  const id=useId(), root=useRef<HTMLDivElement>(null);
  const [width,setWidth]=useState(960), [cursor,setCursor]=useState<{frame:number;bin:number}>();
  useEffect(()=>{if(!root.current)return;const el=root.current;const measure=()=>setWidth(Math.max(320,Math.round(el.getBoundingClientRect().width)));measure();const observer=new ResizeObserver(measure);observer.observe(el);return()=>observer.disconnect();},[]);
  const valid=frequencies.length>0&&frames.length>0&&frequencies.every((f,i)=>Number.isFinite(f)&&(frequencyScale!=='log'||f>0)&&(i===0||f>frequencies[i-1]))&&frames.every((f,i)=>Number.isFinite(f.time)&&(i===0||f.time>frames[i-1].time));
  const min=Number.isFinite(range[0])?range[0]:20, max=Number.isFinite(range[1])&&range[1]>min?range[1]:min+70;
  const left=76,right=28,top=12,bottom=54,h=Math.max(180,height),pw=width-left-right,ph=h-top-bottom;
  const timeMin=valid?frames[0].time:0, timeStep=frames.length>1?frames.at(-1)!.time-frames.at(-2)!.time:1;
  const timeMax=valid?frames.at(-1)!.time+timeStep:10;
  const frequency=(n:number)=>frequencyScale==='log'?Math.log10(n):n;
  const fMin=valid?frequency(frequencies[0]):0, fStep=frequencies.length>1?frequency(frequencies.at(-1)!)-frequency(frequencies.at(-2)!):1;
  const fMax=valid?frequency(frequencies.at(-1)!)+fStep:1000;
  const x=(time:number)=>left+(time-timeMin)/(timeMax-timeMin)*pw;
  const y=(value:number)=>top+ph-(value-fMin)/(fMax-fMin)*ph;
  const selection=cursor&&valid&&frames[cursor.frame]&&cursor.bin<frequencies.length?cursor:undefined;
  const value=selection?frames[selection.frame].levels[selection.bin]:undefined;
  const format=(n:number)=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2}).format(n);
  const announce=selection?`${format(frames[selection.frame].time)} s，${format(frequencies[selection.bin])} Hz，${typeof value==='number'&&Number.isFinite(value)?format(value)+' '+unit:'无数据'}`:'';
  return <figure className="cs-chart cs-spectrogram" aria-labelledby={`${id}-title`}>
    <figcaption><strong id={`${id}-title`}>{title}</strong>{description&&<p>{description}</p>}</figcaption>
    <div className="cs-spectrogram-scale"><span>{min}</span><span className="cs-spectrogram-colorbar"/><span>{max} {unit}</span></div>
    <div className="cs-chart-plot" ref={root} onMouseLeave={()=>setCursor(undefined)}>
      <svg width="100%" height={h} viewBox={`0 0 ${width} ${h}`} role="img" aria-label={`${title}，时频谱；方向键移动读取数值`}>
        <rect x={left} y={top} width={pw} height={ph} fill="var(--cs-chart-plot-bg)" stroke="var(--cs-chart-grid)"/>
        {valid&&!loading&&frames.map((frame,fi)=>frequencies.map((f,bi)=>{const level=frame.levels[bi];const x1=x(frame.time),x2=x(frames[fi+1]?.time??timeMax),y1=y(frequency(frequencies[bi+1]??(frequencyScale==='log'?10**fMax:fMax))),y2=y(frequency(f));return <rect key={`${fi}-${bi}`} data-cell={`${fi}-${bi}`} x={x1} y={y1} width={Math.max(0,x2-x1)} height={Math.max(0,y2-y1)} fill={typeof level==='number'&&Number.isFinite(level)?heatColor(level,min,max):'var(--cs-chart-plot-bg)'} role="button" tabIndex={selection?fi===selection.frame&&bi===selection.bin?0:-1:fi===0&&bi===0?0:-1} aria-label={`${format(frame.time)} s，${format(f)} Hz，${typeof level==='number'&&Number.isFinite(level)?format(level)+' '+unit:'无数据'}`} onMouseMove={()=>setCursor({frame:fi,bin:bi})} onFocus={()=>setCursor({frame:fi,bin:bi})} onKeyDown={event=>{if(event.key==='Escape'){setCursor(undefined);return;}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const nextFrame=Math.max(0,Math.min(frames.length-1,fi+(event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0))),nextBin=Math.max(0,Math.min(frequencies.length-1,bi+(event.key==='ArrowUp'?1:event.key==='ArrowDown'?-1:0)));root.current?.querySelector<SVGRectElement>(`[data-cell="${nextFrame}-${nextBin}"]`)?.focus();}}/>;}))}
        {Array.from({length:5},(_,i)=>{const time=timeMin+(timeMax-timeMin)*i/4,ff=fMin+(fMax-fMin)*i/4;return <g key={i} pointerEvents="none"><text x={x(time)} y={top+ph+20} fill="var(--cs-chart-axis)" textAnchor="middle" fontSize="11">{format(time)}</text><text x={left-10} y={y(ff)+4} fill="var(--cs-chart-axis)" textAnchor="end" fontSize="11">{format(frequencyScale==='log'?10**ff:ff)}</text></g>;})}
        <text x="20" y={top+ph/2} transform={`rotate(-90 20 ${top+ph/2})`} fill="var(--cs-chart-axis)" textAnchor="middle" fontSize="12">频率 / Hz</text><text x={left+pw/2} y={h-10} fill="var(--cs-chart-axis)" textAnchor="middle" fontSize="12">时间 / s</text>
      </svg>
      {(loading||!valid)&&<div className="cs-chart-overlay" role={loading?'status':undefined}><span>{loading?'正在加载图表…':'暂无时频数据'}</span></div>}
      {selection&&!loading&&<div className="cs-spectrogram-readout" aria-hidden="true">{announce}</div>}
    </div>
    <span className="cs-sr-only" aria-live="polite">{announce}</span>
  </figure>;
}
