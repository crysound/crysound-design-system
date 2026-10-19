"use client";
import { useEffect, useId, useRef, useState } from 'react';
export interface ChartDatum { label: string; x?: number; values: Record<string, number | null> }
export interface ChartSeries { key: string; label: string; color?: string; channel?: number }
export interface ChartProps {
  title: string; description?: string; data: ChartDatum[]; series: ChartSeries[]; unit?: string;
  height?: number; loading?: boolean; barBaseline?: number; minorGrid?: boolean;
  xScale?: 'category'|'linear'|'log'; xLabel?: string; yLabel?: string;
  xDomain?: [number, number]; yDomain?: [number, number]; yStep?: number; measurementInfo?: string[];
}
function spacedTicks(values: number[], position: (value: number) => number, minimumGap: number) {
  if (values.length < 2) return values;
  const result = [values[0]];
  for (const value of values.slice(1, -1)) {
    if (Math.abs(position(value) - position(result[result.length - 1])) >= minimumGap) result.push(value);
  }
  const last = values[values.length - 1];
  if (result.length > 1 && Math.abs(position(last) - position(result[result.length - 1])) < minimumGap) result.pop();
  result.push(last);
  return result;
}
export const chartChannelColors: readonly string[] = Object.freeze(Array.from({length:64},(_,index)=>`var(--cs-chart-channel-${String(index+1).padStart(2,'0')})`));
export function LineChart(props:ChartProps) {return <Chart {...props} kind="line"/>;}
export function AreaChart(props:ChartProps) {return <Chart {...props} kind="area"/>;}
export function ScatterChart(props:ChartProps) {return <Chart {...props} kind="scatter"/>;}
export function StackedBarChart(props:ChartProps) {return <Chart {...props} kind="stacked"/>;}
export function BarChart(props:ChartProps) {return <Chart {...props} kind="bar"/>;}
function Chart({title,description,data,series,unit='',height=300,loading=false,barBaseline=0,xScale='category',xLabel,yLabel,xDomain,yDomain,yStep,measurementInfo,minorGrid=true,kind}:ChartProps&{kind:'line'|'bar'|'area'|'scatter'|'stacked'}) {
  const id=useId();const [active,setActive]=useState<number | undefined>(undefined);const [hidden,setHidden]=useState<string[]>([]);
  const visible=series.filter(item=>!hidden.includes(item.key));
  const values=data.flatMap(row=>visible.map(item=>row.values[item.key])).filter((n):n is number=>typeof n==='number'&&Number.isFinite(n));
  const plot = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(960);
  useEffect(() => {
    if (!plot.current) return;
    const element = plot.current;
    const measure = () => setWidth(Math.max(240, Math.round(element.getBoundingClientRect().width)));
    measure(); const observer = new ResizeObserver(measure); observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const stackedBounds=data.flatMap(row=>[visible.reduce((sum,item)=>sum+Math.max(0,Number.isFinite(row.values[item.key])?row.values[item.key]!:0),0),visible.reduce((sum,item)=>sum+Math.min(0,Number.isFinite(row.values[item.key])?row.values[item.key]!:0),0)]);
  const domainValues=kind==='stacked'?stackedBounds:values;
  const low=Math.min(0,...domainValues), high=Math.max(0,...domainValues);
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
  const displayedYTicks = spacedTicks(ticks, y, 44);
  const displayedXTicks = spacedTicks(xTicks, value => left+(transformX(value)-xMin)/(xMax-xMin||1)*plotWidth, 72);
  const minorYPositions = displayedYTicks.slice(0,-1).map((value,index) => (y(value)+y(displayedYTicks[index+1]))/2);
  const minorXPositions = displayedXTicks.slice(0,-1).flatMap((value,index) => {
    const start = left+(transformX(value)-xMin)/(xMax-xMin||1)*plotWidth;
    const end = left+(transformX(displayedXTicks[index+1])-xMin)/(xMax-xMin||1)*plotWidth;
    if (end-start < 120) return [];
    const divisions = Math.min(4, Math.max(2, Math.floor((end-start)/150)));
    return Array.from({length:divisions-1},(_,part)=>start+(end-start)*(part+1)/divisions);
  });
  const categoryStride = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor(plotWidth / 72))));
  const hitLeft=(i:number)=>i===0?left:(x(i-1)+x(i))/2;
  const hitRight=(i:number)=>i===data.length-1?width-right:(x(i)+x(i+1))/2;
  const color=(item:ChartSeries)=>item.color??(Number.isInteger(item.channel)&&item.channel!>=1&&item.channel!<=64?chartChannelColors[item.channel!-1]:`var(--cs-chart-series-${series.indexOf(item)%6+1})`);
  const selected=active===undefined?undefined:data[active];
  const cursorFormat=(n:number)=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:3}).format(n);
  const cursorValue=selected?visible.map(item=>selected.values[item.key]).find((value):value is number=>typeof value==='number'&&Number.isFinite(value)):undefined;
  const cursorY=cursorValue===undefined?top:Math.min(top+plotHeight,Math.max(top,y(cursorValue)));
  const format=(n:number)=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2,notation:Math.abs(n)>=10000?'compact':'standard'}).format(n);
  return <figure className="cs-chart" data-kind={kind} aria-labelledby={`${id}-title`}>
    <figcaption><strong id={`${id}-title`}>{title}</strong>{description&&<p>{description}</p>}</figcaption>
    {measurementInfo&&<div className="cs-chart-measurement-info">{measurementInfo.map(info=><span key={info}>{info}</span>)}</div>}

    <>
      <div ref={plot} className="cs-chart-plot" onMouseLeave={()=>setActive(undefined)}>
        <svg viewBox={`0 0 ${width} ${svgHeight}`} width="100%" height={svgHeight} role="img" aria-label={`${title}，${({line:'折线图',bar:'柱状图',area:'面积图',scatter:'散点图',stacked:'堆叠柱状图'})[kind]}，${data.length} 组数据；详细数值见下方数据表`}>
          <defs><clipPath id={`${id}-clip`}><rect x={left} y={top} width={plotWidth} height={plotHeight}/></clipPath></defs>
          <text x={20} y={top+plotHeight/2} transform={`rotate(-90 20 ${top+plotHeight/2})`} textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="var(--cs-text-xs)">{yLabel??unit}</text>
          <text x={left+plotWidth/2} y={svgHeight-10} textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="var(--cs-text-xs)">{xLabel}</text>
          <rect x={left} y={top} width={plotWidth} height={plotHeight} fill="var(--cs-chart-plot-bg)"/>
          {minorGrid && minorXPositions.map((xx,index)=><line key={`minor-x-${index}`} data-grid="minor-x" x1={xx} x2={xx} y1={top} y2={top+plotHeight} stroke="var(--cs-chart-grid)" strokeWidth=".5" strokeDasharray="1 4" opacity=".4"/>)}
          {minorGrid && minorYPositions.map((yy,index)=><line key={`minor-y-${index}`} data-grid="minor-y" x1={left} x2={width-right} y1={yy} y2={yy} stroke="var(--cs-chart-grid)" strokeWidth=".5" strokeDasharray="1 4" opacity=".4"/>)}
          {displayedYTicks.map(value=>{const yy=y(value);return <g key={value} data-axis-tick="y"><line x1={left} x2={width-right} y1={yy} y2={yy} stroke="var(--cs-chart-grid)" strokeWidth="1" strokeDasharray="2 4"/><text x={left-10} y={yy+4} textAnchor="end" fill="var(--cs-chart-axis)" fontSize="var(--cs-text-xs)">{format(value)}</text></g>;})}
          {displayedXTicks.map(value=>{const xx=left+(transformX(value)-xMin)/(xMax-xMin)*plotWidth;return <g key={value} data-axis-tick="x"><line x1={xx} x2={xx} y1={top} y2={top+plotHeight} stroke="var(--cs-chart-grid)" strokeWidth="1" strokeDasharray="2 4"/><text x={xx} y={top+plotHeight+20} textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="var(--cs-text-xs)">{value>=1000?`${value/1000}k`:format(value)}</text></g>;})}
          {selected&&active!==undefined&&!loading&&<g className="cs-chart-crosshair" clipPath={`url(#${id}-clip)`} pointerEvents="none">
            <line x1={x(active)} x2={x(active)} y1={top} y2={top+plotHeight}/>
            {visible.map(item=>{const value=selected.values[item.key];return typeof value==='number'&&Number.isFinite(value)?<line key={item.key} x1={left} x2={width-right} y1={y(value)} y2={y(value)}/>:null;})}
          </g>}
          {min<0&&max>=0&&<line x1={left} x2={width-right} y1={y(0)} y2={y(0)} stroke="var(--cs-chart-axis)" clipPath={`url(#${id}-clip)`}/>}
          {!loading&&(kind==='line'||kind==='area')&&visible.map(item=>{let path='';let connected=false;data.forEach((row,i)=>{const n=row.values[item.key];if(typeof n!=='number'||!Number.isFinite(n)){connected=false;return;}path+=`${connected?'L':'M'}${x(i)},${y(n)} `;connected=true;});const segments=path.trim().split(/(?=M)/).filter(Boolean);return <g key={item.key}>{kind==='area'&&segments.map((segment,index)=>{const coords=segment.trim().split(/[ML ]+/).filter(Boolean);const first=coords[0].split(',')[0],last=coords[coords.length-1].split(',')[0];return <path key={index} data-area="true" d={`${segment} L${last},${y(Math.max(min,Math.min(max,0)))} L${first},${y(Math.max(min,Math.min(max,0)))} Z`} fill={color(item)} fillOpacity=".16" clipPath={`url(#${id}-clip)`}/>;})}<path d={path} fill="none" stroke={color(item)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${id}-clip)`}/></g>;})}
          {!loading&&data.map((row,i)=><g key={`${row.label}-${i}`}>
            {(!xTicks.length&&i%categoryStride===0)&&<text x={x(i)} y={top+plotHeight+24} textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="var(--cs-text-xs)">{row.label.length>10?row.label.slice(0,9)+'…':row.label}</text>}
            {visible.map((item,j)=>{const n=row.values[item.key];if(typeof n!=='number'||!Number.isFinite(n))return null;const barWidth=Math.min(36,step*.7/Math.max(1,visible.length));if(kind==='scatter')return <circle key={item.key} data-scatter="true" cx={x(i)} cy={y(n)} r={active===i?6:4} fill={color(item)} fillOpacity=".8" stroke="var(--cs-chart-plot-bg)" strokeWidth="1" clipPath={`url(#${id}-clip)`}/>;if(kind==='stacked'){const base=visible.slice(0,j).reduce((sum,prev)=>{const v=row.values[prev.key];return sum+(typeof v==='number'&&Number.isFinite(v)&&(n>=0?v>=0:v<0)?v:0);},0);return <rect key={item.key} data-stacked="true" x={x(i)-Math.min(44,step*.65)/2} y={Math.min(y(base),y(base+n))} width={Math.min(44,step*.65)} height={Math.abs(y(base+n)-y(base))} fill={color(item)} stroke="var(--cs-chart-plot-bg)" strokeWidth="1" clipPath={`url(#${id}-clip)`}/>;}return kind==='bar'?<rect key={item.key} x={x(i)-visible.length*barWidth/2+j*barWidth} y={Math.min(y(Number.isFinite(barBaseline)?barBaseline:0),y(n))} width={Math.max(1,barWidth-3)} height={Math.max(1,Math.abs(y(n)-y(Number.isFinite(barBaseline)?barBaseline:0)))} clipPath={`url(#${id}-clip)`} rx="2" fill={color(item)} opacity={active===undefined||active===i?1:.55}/>:active===i?<circle key={item.key} cx={x(i)} cy={y(n)} r="4" fill={color(item)} stroke="var(--cs-chart-plot-bg)" strokeWidth="2"/>:null;})}
            <rect x={hitLeft(i)} y={top} width={Math.max(1,hitRight(i)-hitLeft(i))} height={plotHeight} fill="transparent" tabIndex={0} role="button" aria-label={`${row.label}：${visible.map(item=>`${item.label} ${typeof row.values[item.key]==='number'?row.values[item.key]:'无数据'} ${unit}`).join('，')}`} onMouseEnter={()=>setActive(i)} onMouseMove={()=>setActive(i)} onFocus={()=>setActive(i)} onBlur={()=>setActive(undefined)} onKeyDown={event=>{if(event.key==='Escape'){setActive(undefined);return;}if(event.key==='Enter'||event.key===' '){event.preventDefault();setActive(i);return;}if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=event.key==='ArrowRight'?event.currentTarget.parentElement?.nextElementSibling:event.currentTarget.parentElement?.previousElementSibling;next?.querySelector<SVGRectElement>('[role="button"]')?.focus();}}}/>
          </g>)}
        </svg>
        {selected&&active!==undefined&&!loading&&visible.length>0&&<div className="cs-chart-tooltip" aria-hidden="true" data-flip={x(active)>left+plotWidth*.6||undefined} style={{left:`${x(active)/width*100}%`,top:`${Math.min(svgHeight-110,Math.max(8,cursorY-36))}px`}}>
          <div className="cs-chart-tooltip-title">{typeof selected.x==='number'&&xLabel?.includes('Hz')?`${cursorFormat(selected.x)} Hz`:selected.label}</div>
          {visible.map(item=><div className="cs-chart-tooltip-row" key={item.key}><span className="cs-chart-tooltip-dot" style={{background:color(item)}}/><span>{item.label}</span><strong>{typeof selected.values[item.key]==='number'&&Number.isFinite(selected.values[item.key])?cursorFormat(selected.values[item.key]!):'—'} {unit}</strong></div>)}
        </div>}
        {(loading||!data.length||!series.length)&&<div className="cs-chart-overlay" role={loading?'status':undefined}><span>{loading?'正在加载图表…':'暂无图表数据'}</span></div>}
      </div>
    <div className="cs-chart-legend" role="group" aria-label={`${title} 数据序列`}>{series.map(item=><button key={item.key} type="button" aria-pressed={!hidden.includes(item.key)} onClick={()=>setHidden(current=>current.includes(item.key)?current.filter(key=>key!==item.key):[...current,item.key])}><span style={{background:color(item)}}/>{item.label}</button>)}</div>
      {!loading&&data.length>0&&series.length>0&&<><div className="cs-sr-only" aria-live="polite" aria-atomic="true">{selected?<><strong>{selected.label}</strong>{visible.map(item=><span key={item.key}>{item.label}：{typeof selected.values[item.key]==='number'?cursorFormat(selected.values[item.key]!):'—'} {unit}</span>)}</>:<span>移动鼠标查看数值 · Tab / 方向键移动 · Esc 隐藏{unit?` · 单位 ${unit}`:''}</span>}</div>
      <details className="cs-chart-data"><summary>查看数据表</summary><div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">{title}原始数据</caption><thead><tr><th>项目</th>{series.map(item=><th key={item.key}>{item.label}{unit?` (${unit})`:''}</th>)}</tr></thead><tbody>{data.map((row,i)=><tr key={i}><th scope="row">{row.label}</th>{series.map(item=><td key={item.key}>{typeof row.values[item.key]==='number'&&Number.isFinite(row.values[item.key])?format(row.values[item.key]!):'—'}</td>)}</tr>)}</tbody></table></div></details></>}
    </>
  </figure>;
}

export interface DonutDatum {label:string;value:number;color?:string}
export interface DonutChartProps {title:string;description?:string;data:DonutDatum[];unit?:string;loading?:boolean}
export function DonutChart({title,description,data,unit='',loading=false}:DonutChartProps){
 const id=useId();const [hidden,setHidden]=useState<string[]>([]);const [active,setActive]=useState<string>();
 const valid=data.filter(d=>Number.isFinite(d.value)&&d.value>0);const visible=valid.filter(d=>!hidden.includes(d.label));const total=visible.reduce((sum,d)=>sum+d.value,0);let cumulative=0;
 const color=(d:DonutDatum)=>d.color??`var(--cs-chart-series-${data.indexOf(d)%6+1})`;
 const current=visible.find(d=>d.label===active);const format=(v:number)=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2}).format(v);
 return <figure className="cs-chart cs-donut-chart" aria-labelledby={`${id}-title`}><figcaption><strong id={`${id}-title`}>{title}</strong>{description&&<p>{description}</p>}</figcaption><div className="cs-donut-plot"><svg viewBox="0 0 360 280" role="img" aria-label={`${title}，环形图；详细数值见数据表`}><circle cx="180" cy="140" r="94" fill="none" stroke="var(--cs-chart-grid)" strokeWidth="32"/>{!loading&&visible.map(d=>{const start=cumulative/total*360;cumulative+=d.value;const angle=d.value/total*360;return <circle key={d.label} data-donut-segment="true" cx="180" cy="140" r="94" fill="none" stroke={color(d)} strokeWidth={active===d.label?38:32} pathLength="100" strokeDasharray={`${d.value/total*100} ${100-d.value/total*100}`} transform={`rotate(${start-90} 180 140)`} opacity={!active||active===d.label?1:.4} onMouseEnter={()=>setActive(d.label)} onMouseLeave={()=>setActive(undefined)}><title>{d.label}：{format(d.value)} {unit}，{(angle/3.6).toFixed(1)}%</title></circle>;})}<text x="180" y="129" textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="14">{current?.label??'合计'}</text><text x="180" y="160" textAnchor="middle" fill="var(--cs-chart-axis)" fontSize="24">{loading?'—':format(current?.value??total)} {unit}</text></svg>{(loading||!total)&&<div role={loading?'status':undefined}>{loading?'正在加载图表…':'暂无可展示数据'}</div>}</div><div className="cs-chart-legend" role="group" aria-label={`${title} 数据序列`}>{valid.map(d=><button key={d.label} type="button" aria-pressed={!hidden.includes(d.label)} onFocus={()=>setActive(d.label)} onBlur={()=>setActive(undefined)} onMouseEnter={()=>setActive(d.label)} onMouseLeave={()=>setActive(undefined)} onClick={()=>{setHidden(prev=>prev.includes(d.label)?prev.filter(k=>k!==d.label):[...prev,d.label]);setActive(undefined);}}><span style={{background:color(d)}}/>{d.label}</button>)}</div><span className="cs-sr-only" aria-live="polite">{current?`${current.label} ${format(current.value)} ${unit}`:`可见合计 ${format(total)} ${unit}`}</span><details className="cs-chart-data"><summary>查看数据表</summary><div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">{title}原始数据</caption><thead><tr><th>分类</th><th>数值{unit&&` (${unit})`}</th><th>占全部有效数据</th></tr></thead><tbody>{data.map((d,i)=><tr key={i}><th scope="row">{d.label}</th><td>{Number.isFinite(d.value)?format(d.value):'—'}</td><td>{Number.isFinite(d.value)&&d.value>0?`${(d.value/(valid.reduce((sum,v)=>sum+v.value,0)||1)*100).toFixed(1)}%`:'—'}</td></tr>)}</tbody></table></div></details></figure>;
}
