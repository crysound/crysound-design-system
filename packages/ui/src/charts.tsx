"use client";
import { useId, useState } from 'react';
export interface ChartDatum { label: string; values: Record<string, number | null> }
export interface ChartSeries { key: string; label: string; color?: string }
export interface ChartProps {
  title: string; description?: string; data: ChartDatum[]; series: ChartSeries[]; unit?: string;
  height?: number; loading?: boolean;
}
const palette=['var(--cs-brand)','#0ea5e9','#f97316','#22c55e','#a855f7'];
export function LineChart(props:ChartProps) {return <Chart {...props} kind="line"/>;}
export function BarChart(props:ChartProps) {return <Chart {...props} kind="bar"/>;}
function Chart({title,description,data,series,unit='',height=280,loading=false,kind}:ChartProps&{kind:'line'|'bar'}) {
  const id=useId();const [active,setActive]=useState<number | undefined>(undefined);const [hidden,setHidden]=useState<string[]>([]);
  const visible=series.filter(item=>!hidden.includes(item.key));
  const values=data.flatMap(row=>visible.map(item=>row.values[item.key])).filter((n):n is number=>typeof n==='number'&&Number.isFinite(n));
  const low=Math.min(0,...values);const high=Math.max(0,...values);const span=high-low||1;const min=low<0?low-span*.1:0;const max=high>0?high+span*.1:1;
  const width=640,top=20,left=56,right=16,bottom=40,plotHeight=220,plotWidth=width-left-right;
  const y=(value:number)=>top+plotHeight-(value-min)/(max-min)*plotHeight;
  const step=plotWidth/Math.max(1,data.length);const x=(i:number)=>left+step*(i+.5);
  const color=(item:ChartSeries)=>item.color??palette[series.indexOf(item)%palette.length];
  const selected=active===undefined?undefined:data[active];
  const format=(n:number)=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2,notation:Math.abs(n)>=10000?'compact':'standard'}).format(n);
  return <figure className="cs-chart" aria-labelledby={`${id}-title`}>
    <figcaption><strong id={`${id}-title`}>{title}</strong>{description&&<p>{description}</p>}</figcaption>
    <div className="cs-chart-legend" role="group" aria-label={`${title} 数据序列`}>{series.map(item=><button key={item.key} type="button" aria-pressed={!hidden.includes(item.key)} onClick={()=>setHidden(current=>current.includes(item.key)?current.filter(key=>key!==item.key):[...current,item.key])}><span style={{background:color(item)}}/>{item.label}</button>)}</div>
    {loading?<div className="cs-chart-empty" style={{height}} role="status">正在加载图表…</div>:!data.length||!series.length?<div className="cs-chart-empty" style={{height}}>暂无图表数据</div>:<>
      <div className="cs-chart-plot" onMouseLeave={()=>setActive(undefined)}>
        <svg viewBox={`0 0 ${width} ${top+plotHeight+bottom}`} width="100%" height={Math.max(180,height)} role="img" aria-label={`${title}，${kind==='line'?'折线图':'柱状图'}，${data.length} 组数据；详细数值见下方数据表`}>
          {[0,1,2,3,4].map(i=>{const value=min+(max-min)*i/4;const yy=y(value);return <g key={i}><line x1={left} x2={width-right} y1={yy} y2={yy} stroke="var(--cs-border)" strokeDasharray="3 3"/><text x={left-10} y={yy+4} textAnchor="end" fill="var(--cs-muted)" fontSize="11">{format(value)}</text></g>;})}
          {min<0&&<line x1={left} x2={width-right} y1={y(0)} y2={y(0)} stroke="var(--cs-muted)"/>}
          {kind==='line'&&visible.map(item=>{let path='';let connected=false;data.forEach((row,i)=>{const n=row.values[item.key];if(typeof n!=='number'||!Number.isFinite(n)){connected=false;return;}path+=`${connected?'L':'M'}${x(i)},${y(n)} `;connected=true;});return <path key={item.key} d={path} fill="none" stroke={color(item)} strokeWidth="2" strokeLinejoin="round"/>;})}
          {data.map((row,i)=><g key={`${row.label}-${i}`}>
            {(data.length<=10||i%Math.ceil(data.length/8)===0)&&<text x={x(i)} y={top+plotHeight+24} textAnchor="middle" fill="var(--cs-muted)" fontSize="11">{row.label.length>10?row.label.slice(0,9)+'…':row.label}</text>}
            {visible.map((item,j)=>{const n=row.values[item.key];if(typeof n!=='number'||!Number.isFinite(n))return null;const barWidth=Math.min(36,step*.7/Math.max(1,visible.length));return kind==='bar'?<rect key={item.key} x={x(i)-visible.length*barWidth/2+j*barWidth} y={Math.min(y(0),y(n))} width={Math.max(1,barWidth-3)} height={Math.max(1,Math.abs(y(n)-y(0)))} rx="3" fill={color(item)} opacity={active===undefined||active===i?1:.55}/>:<circle key={item.key} cx={x(i)} cy={y(n)} r={active===i?5:3} fill="var(--cs-surface)" stroke={color(item)} strokeWidth="2"/>;})}
            <rect x={left+step*i} y={top} width={step} height={plotHeight} fill="transparent" tabIndex={0} role="button" aria-label={`${row.label}：${visible.map(item=>`${item.label} ${typeof row.values[item.key]==='number'?row.values[item.key]:'无数据'} ${unit}`).join('，')}`} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onBlur={()=>setActive(undefined)} onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=event.key==='ArrowRight'?event.currentTarget.parentElement?.nextElementSibling:event.currentTarget.parentElement?.previousElementSibling;next?.querySelector<SVGRectElement>('[role="button"]')?.focus();}}}/>
          </g>)}
        </svg>
      </div>
      <div className="cs-chart-readout" aria-live="polite">{selected?<><strong>{selected.label}</strong>{visible.map(item=><span key={item.key}>{item.label}：{typeof selected.values[item.key]==='number'?format(selected.values[item.key]!):'—'} {unit}</span>)}</>:<span>悬浮或使用 Tab、方向键查看数值{unit?` · 单位 ${unit}`:''}</span>}</div>
      <details className="cs-chart-data"><summary>查看数据表</summary><div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">{title}原始数据</caption><thead><tr><th>项目</th>{series.map(item=><th key={item.key}>{item.label}{unit?` (${unit})`:''}</th>)}</tr></thead><tbody>{data.map((row,i)=><tr key={i}><th scope="row">{row.label}</th>{series.map(item=><td key={item.key}>{typeof row.values[item.key]==='number'&&Number.isFinite(row.values[item.key])?format(row.values[item.key]!):'—'}</td>)}</tr>)}</tbody></table></div></details>
    </>}
  </figure>;
}
