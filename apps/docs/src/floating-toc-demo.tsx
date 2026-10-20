import {useRef,useState} from 'react';
import {FloatingToc} from '../../../packages/ui/src/index';
const chapters=[
 ['overview','Overview','Transform time signals into frequency-domain results.'],
 ['spectrum','FFT explained','Inspect tones, harmonics and broadband noise in a measured signal.'],
 ['workflows','Workflows','Use Monitor, Measure and Sequence for different measurement tasks.'],
 ['analysis','Analysis mode','Choose Baseband, Baseband (Precision) or Zoom to match the frequency region you need to inspect.'],
 ['resolution','Resolution','Choose the spectral spacing needed to resolve neighboring components.'],
 ['window','Window function','Balance spectral leakage and amplitude accuracy.'],
 ['averaging','Averaging','Combine repeated blocks to reduce random variation.'],
 ['control','Measurement control','Use manual, timed or triggered measurement.'],
 ['results','Analysis results','Inspect Fourier, auto- and cross-spectrum results.'],
 ['cursors','Cursors','Read values and compare frequencies with spectrum cursors.'],
 ['report','Review & report','Review saved records and export measurement results.'],
 ['video','Video guide','Follow the measurement workflow from setup to review.'],
];
const items=chapters.map(([id,label])=>({id:`toc-demo-${id}`,label}));
export function FloatingTocDemo(){
 const root=useRef<HTMLDivElement>(null);const [current,setCurrent]=useState(items[0].id);
 return <div className="floating-toc-demo"><p className="cs-help">滚动下方内容，或悬停、聚焦左侧刻度并点击跳转。窄屏切换为章节选择器。</p><div className="floating-toc-demo-stage"><aside><FloatingToc items={items} label="On this page" activeId={current} onActiveChange={setCurrent} scrollContainerRef={root} position="inline" offset={24}/></aside><div ref={root} className="floating-toc-demo-content" tabIndex={0} role="region" aria-label="FFT 章节滚动预览">{chapters.map(([id,title,description],index)=><section id={`toc-demo-${id}`} key={id}><span className="floating-toc-demo-number">{String(index+1).padStart(2,'0')}</span><h3>{title}</h3><p>{description}</p><div className="floating-toc-demo-example"><span>{id==='analysis'?'Baseband':'FFT Analysis'}</span><small>{id==='analysis'?'Full-band analysis':'Sound and vibration measurement'}</small><div aria-hidden="true"><i/><i/><i/><i/><i/></div></div></section>)}</div></div><p className="cs-help" role="status">当前章节：{items.find(item=>item.id===current)?.label}</p><details className="website-control-details"><summary>使用规则</summary><ul><li>用于有明确章节的长页面；每个 id 必须唯一并对应真实内容。</li><li>桌面默认8px短刻度，当前项14px加粗；悬停或键盘聚焦时，按距离展开为32/26/20/14px。</li><li>滚动后显示当前章节标题，停留6秒后隐藏；链接可通过 Tab 和 Enter 操作。</li><li>900px以下或触屏改用章节选择器，点击区域至少44px；固定导航应预留页头及内容安全间距。</li><li>offset 是目标章节与滚动区域顶部的留白；根据实际固定页头高度设置。默认不修改URL，避免与应用路由冲突。</li></ul></details></div>;
}
