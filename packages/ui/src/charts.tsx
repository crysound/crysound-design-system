"use client";
import { useEffect, useId, useRef, useState } from 'react';
export interface ChartDatum { label: string; x?: number; values: Record<string, number | null> }
export interface ChartSeries { key: string; label: string; color?: string; channel?: number }
export interface ChartProps {
  title: string; description?: string; data: ChartDatum[]; series: ChartSeries[]; unit?: string;
  height?: number; loading?: boolean;
  xScale?: 'category'|'linear'|'log'; xLabel?: string; yLabel?: string;
  xDomain?: [number, number]; yDomain?: [number, number]; yStep?: number; measurementInfo?: string[];
}
export const chartChannelColors: readonly string[] = Object.freeze(Array.from({length:64},(_,index)=>`var(--cs-chart-channel-${String(index+1).padStart(2,'0')})`));
export function LineChart(props:ChartProps) {return <Chart {...props} kind="line"/>;}
export function BarChart(props:ChartProps) {return <Chart {...props} kind="bar"/>;}
function Chart({title,description,data,series,unit='',height=300,loading=false,xScale='category',xLabel,yLabel,xDomain,yDomain,yStep,measurementInfo,kind}:ChartProps&{kind:'line'|'bar'}) {
  const id=useId();const [active,setActive]=useState<number | undefined>(undefined);const [hidden,setHidden]=useState<string[]>([]);
  const visible=series.filter(item=>!hidden.includes(item.key));
  const values=data.flatMap(row=>visible.map(item=>row.values[item.key])).filter((n):n is number=>typeof n==='number'&&Number.isFinite(n));
  const plot = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(960);
  useEffect(() => {
    if (!plot.current) return;
    const element = plot.current;
    const measure = () => setWidth(Math.max(320, Math.round(element.getBoundingClientRect().width)));
    measure(); const observer = new ResizeObserver(measure); observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const low=Math.min(0,...values), high=Math.max(0,...values);
  const rough=(high-low||10)/5, power=10**Math.floor(Math.log10(rough));
  const stepY=yStep&&Number.isFinite(yStep)&&yStep>0?yStep:([1,2,5,10].find(n=>n*power>=rough)??10)*power;
  const validDomain=yDomain&&Number.isFinite(yDomain[0])&&Number.isFinite(yDomain[1])&&yDomain[1]>yDomain[0];
  const min=validDomain?yDomain[0]:Math.floor(low/stepY)*stepY;
  const max=validDomain?yDomain[1]:Math.max(min+stepY,Math.ceil(high/stepY)*stepY);
  const ticks=Array.from({length:Math.min(100,Math.floor((max-min)/stepY)+1)},(_,i)=>min+i*stepY);
  const top=12,left=76,right=16,bottom=54,svgHeight=Math.max(180,height),plotHeight=svgHeight-top-bottom,plotWidth=width-left-right;
  const y=(value:number)=>top+plotHeight-(value-min)/(max-min)*plotHeight;
  const step=plotWidth/Math.max(1,data.length);
  const numeric=xScale!=='category'&&data.every(row=>Number.isFinite(row.x)&& (xScale!=='log'||row.x!>0));
  const transformX=(n:number)=>xScale==='log'?Math.log10(n):n;
  const validXDomain=xDomain&&Number.isFinite(xDomain[0])&&Number.isFinite(xDomain[1])&&xDomain[1]>xDomain[0]&&(xScale!=='log'||xDomain[0]>0);
  const xMin=validXDomain?transformX(xDomain[0]):numeric&&data.length?Math.min(...data.map(row=>transformX(row.x!))):0;
  const xMax=validXDomain?transformX(xDomain[1]):numeric&&data.length?Math.max(...data.map(row=>transformX(row.x!))):10;
  const x=(i:number)=>numeric?(xMax===xMin?left+plotWidth/2:left+(transformX(data[i].x!)-xMin)/(xMax-xMin)*plotWidth):left+step*(i+.5);
  const xTicks=numeric&&xScale==='log'?[20,50,100,200,500,1000,2000,5000,10000,20000].filter(n=>transformX(n)>=xMin&&transformX(n)<=xMax):numeric&&xScale==='linear'?Array.from({length:5},(_,i)=>xMin+(xMax-xMin)*i/4):[];
  const hitLeft=(i:number)=>i===0?left:(x(i-1)+x(i))/2;
  const hitRight=(i:number)=>i===data.length-1?width-right:(x(i)+x(i+1))/2;
  const color=(item:ChartSeries)=>item.color??chartChannelColors[Number.isInteger(item.channel)&&item.channel!>=1&&item.channel!<=64?item.channel!-1:series.indexOf(item)%chartChannelColors.length];
  const selected=active===undefined?undefined:data[active];
  const cursorFormat=(n:number)=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:3}).format(n);
  const cursorValue=selected?visible.map(item=>selected.values[item.key]).find((value):value is number=>typeof value==='number'&&Number.isFinite(value)):undefined;
  const cursorY=cursorValue===undefined?top:Math.min(top+plotHeight,Math.max(top,y(cursorValue)));
  const format=(n:number)=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2,notation:Math.abs(n)>=10000?'compact':'standard'}).format(n);
  return <figure className="cs-chart" aria-labelledby={`${id}-title`}>
    <figcaption><strong id={`${id}-title`}>{title}</strong>{description&&<p>{description}</p>}</figcaption>
    {measurementInfo&&<div className="cs-chart-measurement-info">{measurementInfo.map(info=><span key={info}>{info}</span>)}</div>}
    <div className="cs-chart-legend" role="group" aria-label={`${title} 数据序列`}>{series.map(item=><button key={item.key} type="button" aria-pressed={!hidden.includes(item.key)} onClick={()=>setHidden(current=>current.includes(item.key)?current.filter(key=>key!==item.key):[...current,item.key])}><span style={{background:color(item)}}/>{item.label}</button>)}</div>
    <>
      <div ref={plot} className="cs-chart-plot" onMouseLeave={()=>setActive(undefined)}>
        <svg viewBox={`0 0 ${width} ${svgHeight}`} width="100%" height={svgHeight} role="img" aria-label={`${title}，${kind==='line'?'折线图':'柱状图'}，${data.length} 组数据；详细数值见下方数据表`}>
          <defs><clipPath id={`${id}-clip`}><rect x={left} y={top} width={plotWidth} height={plotHeight}/></clipPath></defs>
          <text x={20} y={top+plotHeight/2} transform={`rotate(-90 20 ${top+plotHeight/2})`} textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="12">{yLabel??unit}</text>
          <text x={left+plotWidth/2} y={svgHeight-10} textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="12">{xLabel}</text>
          <rect x={left} y={top} width={plotWidth} height={plotHeight} fill="var(--cs-chart-plot-bg)" stroke="var(--cs-chart-grid)"/>
          {Array.from({length:19},(_,i)=><line key={`minor-x-${i}`} x1={left+plotWidth*(i+1)/20} x2={left+plotWidth*(i+1)/20} y1={top} y2={top+plotHeight} stroke="var(--cs-chart-grid)" strokeWidth=".5"/>)}
          {ticks.slice(0,-1).flatMap(value=>[1,2,3].map(part=><line key={`${value}-${part}`} x1={left} x2={width-right} y1={y(value+stepY*part/4)} y2={y(value+stepY*part/4)} stroke="var(--cs-chart-grid)" strokeWidth=".5"/>))}
          {ticks.map(value=>{const yy=y(value);return <g key={value}><line x1={left} x2={width-right} y1={yy} y2={yy} stroke="var(--cs-chart-grid)" strokeWidth="1"/><text x={left-10} y={yy+4} textAnchor="end" fill="var(--cs-chart-axis)" fontSize="11">{format(value)}</text></g>;})}
          {xTicks.map(value=>{const xx=left+(transformX(value)-xMin)/(xMax-xMin)*plotWidth;return <g key={value}><line x1={xx} x2={xx} y1={top} y2={top+plotHeight} stroke="var(--cs-chart-grid)" strokeWidth="1"/><text x={xx} y={top+plotHeight+20} textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="11">{value>=1000?`${value/1000}k`:format(value)}</text></g>;})}
          {selected&&active!==undefined&&!loading&&<g className="cs-chart-crosshair" clipPath={`url(#${id}-clip)`} pointerEvents="none">
            <line x1={x(active)} x2={x(active)} y1={top} y2={top+plotHeight}/>
            {visible.map(item=>{const value=selected.values[item.key];return typeof value==='number'&&Number.isFinite(value)?<line key={item.key} x1={left} x2={width-right} y1={y(value)} y2={y(value)}/>:null;})}
          </g>}
          {min<0&&<line x1={left} x2={width-right} y1={y(0)} y2={y(0)} stroke="var(--cs-chart-axis)"/>}
          {!loading&&kind==='line'&&visible.map(item=>{let path='';let connected=false;data.forEach((row,i)=>{const n=row.values[item.key];if(typeof n!=='number'||!Number.isFinite(n)){connected=false;return;}path+=`${connected?'L':'M'}${x(i)},${y(n)} `;connected=true;});return <path key={item.key} d={path} fill="none" stroke={color(item)} strokeWidth="1.5" strokeLinejoin="round" clipPath={`url(#${id}-clip)`}/>;})}
          {!loading&&data.map((row,i)=><g key={`${row.label}-${i}`}>
            {(!xTicks.length&&(data.length<=10||i%Math.ceil(data.length/8)===0))&&<text x={x(i)} y={top+plotHeight+24} textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="11">{row.label.length>10?row.label.slice(0,9)+'…':row.label}</text>}
            {visible.map((item,j)=>{const n=row.values[item.key];if(typeof n!=='number'||!Number.isFinite(n))return null;const barWidth=Math.min(36,step*.7/Math.max(1,visible.length));return kind==='bar'?<rect key={item.key} x={x(i)-visible.length*barWidth/2+j*barWidth} y={Math.min(y(0),y(n))} width={Math.max(1,barWidth-3)} height={Math.max(1,Math.abs(y(n)-y(0)))} clipPath={`url(#${id}-clip)`} rx="0" fill={color(item)} opacity={active===undefined||active===i?1:.55}/>:active===i?<circle key={item.key} cx={x(i)} cy={y(n)} r="5" fill={color(item)} stroke="#334155" strokeWidth="1.5"/>:null;})}
            <rect x={hitLeft(i)} y={top} width={Math.max(1,hitRight(i)-hitLeft(i))} height={plotHeight} fill="transparent" tabIndex={0} role="button" aria-label={`${row.label}：${visible.map(item=>`${item.label} ${typeof row.values[item.key]==='number'?row.values[item.key]:'无数据'} ${unit}`).join('，')}`} onMouseEnter={()=>setActive(i)} onMouseMove={()=>setActive(i)} onFocus={()=>setActive(i)} onBlur={()=>setActive(undefined)} onKeyDown={event=>{if(event.key==='Escape'){setActive(undefined);return;}if(event.key==='Enter'||event.key===' '){event.preventDefault();setActive(i);return;}if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=event.key==='ArrowRight'?event.currentTarget.parentElement?.nextElementSibling:event.currentTarget.parentElement?.previousElementSibling;next?.querySelector<SVGRectElement>('[role="button"]')?.focus();}}}/>
          </g>)}
        </svg>
        {selected&&active!==undefined&&!loading&&visible.length>0&&<div className="cs-chart-tooltip" aria-hidden="true" data-flip={x(active)>left+plotWidth*.6||undefined} style={{left:`${x(active)/width*100}%`,top:`${Math.min(svgHeight-110,Math.max(8,cursorY-36))}px`}}>
          <div className="cs-chart-tooltip-title">{typeof selected.x==='number'&&xLabel?.includes('Hz')?`${cursorFormat(selected.x)} Hz`:selected.label}</div>
          {visible.map(item=><div className="cs-chart-tooltip-row" key={item.key}><span className="cs-chart-tooltip-dot" style={{background:color(item)}}/><span>{item.label}</span><strong>{typeof selected.values[item.key]==='number'&&Number.isFinite(selected.values[item.key])?cursorFormat(selected.values[item.key]!):'—'} {unit}</strong></div>)}
        </div>}
        {(loading||!data.length||!series.length)&&<div className="cs-chart-overlay" role={loading?'status':undefined}><span>{loading?'正在加载图表…':'暂无图表数据'}</span></div>}
      </div>
      {!loading&&data.length>0&&series.length>0&&<><div className="cs-sr-only" aria-live="polite" aria-atomic="true">{selected?<><strong>{selected.label}</strong>{visible.map(item=><span key={item.key}>{item.label}：{typeof selected.values[item.key]==='number'?cursorFormat(selected.values[item.key]!):'—'} {unit}</span>)}</>:<span>移动鼠标查看数值 · Tab / 方向键移动 · Esc 隐藏{unit?` · 单位 ${unit}`:''}</span>}</div>
      <details className="cs-chart-data"><summary>查看数据表</summary><div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">{title}原始数据</caption><thead><tr><th>项目</th>{series.map(item=><th key={item.key}>{item.label}{unit?` (${unit})`:''}</th>)}</tr></thead><tbody>{data.map((row,i)=><tr key={i}><th scope="row">{row.label}</th>{series.map(item=><td key={item.key}>{typeof row.values[item.key]==='number'&&Number.isFinite(row.values[item.key])?format(row.values[item.key]!):'—'}</td>)}</tr>)}</tbody></table></div></details></>}
    </>
  </figure>;
}
