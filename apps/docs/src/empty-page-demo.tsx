import {useState} from 'react';
import {AlertCircle,File02,SearchLg} from '@untitledui/icons';
import {Button,Card,EmptyPage,Input} from '../../../packages/ui/src/index';

function BrandWave({brand=false}:{brand?:boolean}){
  return brand?<img src="/brand/blank-wave-dark.png" alt=""/>:<>
    <img className="empty-page-wave-light" src="/brand/blank-wave-light.png" alt=""/>
    <img className="empty-page-wave-dark" src="/brand/blank-wave-dark.png" alt=""/>
  </>;
}
export function EmptyPageDemo({brand=false}:{brand?:boolean}){
  const [created,setCreated]=useState(false);
  return <div className="empty-page-demo">{created?<div className="empty-page-result" role="region" aria-label="测量任务">
    <p role="status">已创建测量任务</p><Card title="测量任务 01" description="等待配置采集设备"/>
    <Button variant="secondary" onClick={()=>setCreated(false)}>移除演示任务</Button>
  </div>:<EmptyPage title="暂无测量任务" description="创建第一个任务，开始整理测量数据。" tone={brand?'brand':'neutral'} headingLevel={3}
    logo={<img className={brand?'empty-page-logo-white':'empty-page-logo-auto'} src={`/brand/logo-horizontal-${brand?'white':'purple'}.svg`} alt="CRYSOUND"/>}
    illustration={<BrandWave brand={brand}/>}
    action={<Button onClick={()=>setCreated(true)}>创建任务</Button>}
    footer="CRYSOUND · 声学测量与分析"/>}
    {!brand&&<div className="empty-page-assets"><a href="/brand/blank-wave-light.png" download>下载浅色波面</a><a href="/brand/blank-wave-dark.png" download>下载深色波面</a></div>}
  </div>;
}
export function EmptyPageSectionDemo(){
  return <div className="empty-page-section-demo"><div className="empty-page-section-header"><strong>项目附件</strong><span>0 个文件</span></div>
    <EmptyPage layout="section" title="暂无附件" description="上传配置、测量记录或报告后，会显示在这里。" icon={<File02/>}/>
  </div>;
}
export function EmptyPageSearchDemo(){
  const [query,setQuery]=useState('校准记录');
  const records=['实验室声学测量记录','产线噪声测量记录'];
  const matches=records.filter(record=>record.includes(query));
  return <div className="empty-page-search-demo"><Input label="搜索测量记录" type="search" value={query} onChange={event=>setQuery(event.target.value)}/>
    {matches.length?<ul className="empty-page-records" aria-label="测量记录">{matches.map(record=><li key={record}>{record}</li>)}</ul>:<EmptyPage layout="section" title="没有找到匹配记录" description="尝试其他关键词，或清空搜索查看全部记录。" icon={<SearchLg/>} action={<Button variant="secondary" onClick={()=>setQuery('')}>清空搜索</Button>}/>}
  </div>;
}
export function EmptyPageErrorDemo(){
  const [failed,setFailed]=useState(true);
  return <div className="empty-page-section-demo">{failed?<EmptyPage layout="section" title="记录加载失败" description="暂时无法获取测量记录，请重试。" icon={<AlertCircle className="empty-page-error-icon"/>} action={<Button onClick={()=>setFailed(false)}>重新加载</Button>}/>:<div className="empty-page-result"><p role="status">记录已重新载入</p><Card title="实验室声学测量记录" description="最近一次保存的任务"/><Button variant="secondary" onClick={()=>setFailed(true)}>模拟加载失败</Button></div>}</div>;
}
