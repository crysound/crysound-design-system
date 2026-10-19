import {useId,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowNarrowUpRight} from '@untitledui/icons';
import {Button,Dialog,DropdownMenu,Tabs,TabsList,TabsTrigger,TabsContent} from '../../../packages/ui/src/index';
const slides=[
 {label:'数据采集',title:'DATA ACQUISITION',description:'Pioneering high-speed, precision signal acquisition technology. Multi-channel synchronized DAQ and modular designs.',image:'',alt:'数据采集分析软件展示'},
 {label:'声功率测量',title:'SOUND POWER MEASUREMENT',description:'From synchronous multi-channel acquisition to analysis and reporting. A complete workflow for sound power measurement.',image:'hero-sound-power.png',alt:'声功率测量系统展示'},
 {label:'声学成像',title:'CRY8500 SERIES SONOCAM PI',description:'Make sound visible. Explore acoustic imaging for research, source localization and field inspection.',image:'hero-pi.png',alt:'SonoCam Pi 声学成像产品'},
 {label:'便携检测',title:'SONOCAM POCKET ACOUSTIC CAMERA',description:'Professional acoustic imaging in your pocket. A compact companion for everyday inspection.',image:'hero-pocket.png',alt:'SonoCam Pocket 声学成像产品'},
];
const categories=[{id:'all',name:'全部产品'},{id:'sensor',name:'传感与测量'},{id:'daq',name:'数据采集'},{id:'imaging',name:'声学成像'},{id:'noise',name:'噪声测量'},{id:'audio',name:'音频测试'}];
const products=[
 {id:'daq',title:'CRY5820 SonoDAQ Pro',description:'多通道同步数据采集，为声学测量建立完整的信号链路。',image:'sonodaq.png'},
 {id:'imaging',title:'CRY8500 Series SonoCam Pi',description:'面向研发与检测场景的声学成像产品系列。',image:'sonocam.png'},
 {id:'sensor',title:'测量传声器',description:'从声音信号出发，连接精密声学传感与测量。',image:'microphone.png'},
 {id:'audio',title:'CRY578 Bluetooth LE Audio Interface',description:'蓝牙音频测试，连接音频设备与性能分析。',image:'audio-interface.png'},
 {id:'noise',title:'CRY2833 Sound Level Meter',description:'服务于环境与工业场景的噪声测量。',image:'sound-meter.png'},
 {id:'daq',title:'OpenTest',description:'组织采集、分析与报告，构建清晰的声学测试流程。',image:'hero-monitor.png'},
];
const solutions=[
 {title:'Sound Power Measurement',image:'solution-sound-power.png',description:'Connect acquisition, analysis and reporting in one measurement workflow.'},
 {title:'Simplify On-Site Setup',image:'solution-setup.png',description:'Bring channel configuration and measurement preparation into a clear process.'},
 {title:'Consistent Measurement',image:'solution-consistency.png',description:'Build a repeatable workflow for acoustic testing and result review.'},
];
export function BrandSample(){
 const [hero,setHero]=useState(0);const [category,setCategory]=useState('all');
 const productSection=useRef<HTMLElement>(null);const solutionSection=useRef<HTMLElement>(null);const footer=useRef<HTMLElement>(null);
 const heroId=useId();const active=slides[hero];
 const scroll=(target:HTMLElement|null)=>target?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 const showProducts=(id='all')=>{setCategory(id);scroll(productSection.current);};
 return <div className="scene-brand scene-brand-official" lang="en">
  <header className="scene-brand-nav"><img src="/crysound-logo.svg" alt="CRYSOUND"/><nav aria-label="Brand website navigation">
   <DropdownMenu label="产品导航" trigger={<Button variant="ghost" size="sm">Products</Button>} items={categories.map(c=>({id:c.id,label:c.name,onSelect:()=>showProducts(c.id)}))}/>
   <Button variant="ghost" size="sm" onClick={()=>scroll(solutionSection.current)}>Solutions</Button>
   <Button variant="ghost" size="sm" onClick={()=>scroll(footer.current)}>Resources</Button>
   <Dialog title="Contact CRYSOUND" description="Explore acoustic measurement with CRYSOUND." trigger={<Button variant="ghost" size="sm">Contact</Button>}><p>产品咨询与技术支持请访问 CRYSOUND 官网。</p><a href="https://www.crysound.com/" target="_blank" rel="noopener noreferrer">前往官网 <ArrowNarrowUpRight size={16}/></a></Dialog>
  </nav><a href="https://www.crysound.com/" target="_blank" rel="noopener noreferrer">访问官网 <ArrowNarrowUpRight size={16}/></a></header>
  <section className="scene-official-hero" data-slide={hero} aria-label="产品展示" aria-roledescription="轮播图">
   <div className="scene-official-copy" id={heroId}>{hero===0&&<span className="scene-official-new">NEW</span>}<h2>{active.title}</h2><p>{active.description}</p><Button onClick={()=>showProducts(hero===2||hero===3?'imaging':'daq')}>Learn More</Button></div>
   <div className="scene-official-visual">{hero===0?<><img className="scene-official-monitor" src="/scene-assets/hero-monitor.png" alt={active.alt}/><img className="scene-official-rack" src="/scene-assets/hero-rack.png" alt="CRYSOUND 数据采集设备"/></>:<img className="scene-official-product" src={`/scene-assets/${active.image}`} alt={active.alt}/>}</div>
   <div className="scene-official-controls"><Button variant="ghost" size="sm" aria-label="上一组产品展示" onClick={()=>setHero((hero+slides.length-1)%slides.length)}><ArrowLeft size={18}/></Button><div className="scene-official-switch" role="group" aria-label="切换产品展示">{slides.map((s,i)=><Button variant="ghost" size="sm" key={s.label} aria-label={s.label} title={s.label} aria-controls={heroId} aria-pressed={hero===i} onClick={()=>setHero(i)}><span/></Button>)}</div><Button variant="ghost" size="sm" aria-label="下一组产品展示" onClick={()=>setHero((hero+1)%slides.length)}><ArrowRight size={18}/></Button></div>
  </section>
  <section className="scene-brand-solutions" ref={solutionSection}><div className="scene-brand-section-heading"><div><h3>Solutions</h3><p>Provide high-quality solutions for the acoustic field</p></div><Button variant="ghost" iconEnd={<ArrowRight size={18}/>} onClick={()=>showProducts()}>Explore Products</Button></div><div className="scene-solution-grid">{solutions.map(s=><article key={s.title}><img src={`/scene-assets/${s.image}`} alt="" loading="lazy"/><div><h4>{s.title}</h4><p>{s.description}</p><Dialog title={s.title} description="解决方案概览" trigger={<Button variant="ghost" size="sm" iconEnd={<ArrowRight size={16}/>}>See More</Button>}><p>{s.description}</p><p>此处展示官网场景组合；详细配置与适用条件请联系 CRYSOUND。</p><a href="https://www.crysound.com/" target="_blank" rel="noopener noreferrer">访问官网</a></Dialog></div></article>)}</div></section>
  <section className="scene-brand-products" ref={productSection}><div className="scene-brand-section-heading"><h3>Products</h3><span>Built for your next discovery.</span></div><Tabs value={category} onValueChange={setCategory}><TabsList aria-label="样板产品分类">{categories.map(c=><TabsTrigger key={c.id} value={c.id}>{c.name}</TabsTrigger>)}</TabsList><TabsContent value={category}><div className="scene-product-grid">{products.filter(p=>category==='all'||p.id===category).map(p=><article key={p.title}><div className="scene-product-image"><img src={`/scene-assets/${p.image}`} alt={p.title} loading="lazy"/></div><h4>{p.title}</h4><p>{p.description}</p><Dialog title={p.title} description="产品系列概览" trigger={<Button variant="ghost" iconEnd={<ArrowRight size={16}/>}>查看系列</Button>}><img className="scene-product-dialog-image" src={`/scene-assets/${p.image}`} alt={p.title}/><p>{p.description}</p><a href="https://www.crysound.com/" target="_blank" rel="noopener noreferrer">前往 CRYSOUND 官网了解产品</a></Dialog></article>)}</div></TabsContent></Tabs></section>
  <footer className="scene-brand-footer" ref={footer}><div><img src="/crysound-logo.svg" alt="CRYSOUND"/><h3>Measure Sound Better</h3><p>Precision in every signal.<br/>Possibility in every discovery.</p></div><div><strong>Resources & Support</strong><p>Discover acoustic measurement products,<br/>applications and technical support.</p><a href="https://www.crysound.com/" target="_blank" rel="noopener noreferrer">Visit CRYSOUND <ArrowNarrowUpRight size={18}/></a></div></footer>
 </div>;
}
