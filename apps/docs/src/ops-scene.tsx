import {useState,type ReactNode} from 'react';
import {Activity,Server01,File02,Sliders04,LayoutLeft} from '@untitledui/icons';
import {Button} from '../../../packages/ui/src/index';
import {NoiseMonitor} from './noise-monitor';
export function OpsScene({measurement}:{measurement:ReactNode}){
 const [page,setPage]=useState('live');const [collapsed,setCollapsed]=useState(false);
 const nav=[{id:'live',label:'实时监测',icon:Activity},{id:'events',label:'事件记录',icon:File02},{id:'points',label:'监测点',icon:Server01},{id:'measurement',label:'测量配置',icon:Sliders04}];
 const name=nav.find(n=>n.id===page)!.label;
 return <div className="scene-precision ops-scene" data-collapsed={collapsed}><aside className="ops-sidebar"><a href="#templates/scenes" className="ops-logo" aria-label="返回样板库"><img src="/crysound-logo.svg" alt="CRYSOUND"/></a><nav aria-label="工作台导航">{nav.map(n=><button key={n.id} type="button" title={collapsed?n.label:undefined} aria-label={n.label} aria-current={page===n.id?'page':undefined} onClick={()=>setPage(n.id)}><n.icon size={18}/><span>{n.label}</span></button>)}</nav><span className="ops-sidebar-foot">噪声监测演示工作空间</span></aside><div className="ops-main"><header className="ops-topbar"><Button variant="ghost" aria-label={collapsed?'展开侧栏':'收起侧栏'} onClick={()=>setCollapsed(!collapsed)}><LayoutLeft size={18}/></Button><strong>{name}</strong><div><span>本地演示</span><span className="ops-top-state"><i/>模拟信号源</span></div></header><div className="ops-content">{page==='measurement'?<><header className="ops-heading"><h2>测量配置</h2><p>设备选择与参数配置演示</p></header><div className="ops-measure">{measurement}</div></>:null}<div hidden={page==='measurement'}><NoiseMonitor page={page}/></div><footer className="ops-footnote">模拟数据每秒更新，不连接麦克风或硬件。阈值为演示设置，不作为噪声合规判定。</footer></div></div></div>;
}
