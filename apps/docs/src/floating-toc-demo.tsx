import {useRef,useState} from 'react';
import {FloatingToc,Skeleton} from '../../../packages/ui/src/index';
const items=Array.from({length:12},(_,index)=>({id:`toc-demo-section-${index+1}`,label:`章节 ${String(index+1).padStart(2,'0')}`}));
export function FloatingTocDemo(){
 const root=useRef<HTMLDivElement>(null);const [current,setCurrent]=useState(items[0].id);
 return <div className="floating-toc-demo">
  <p className="cs-help">滚动下方骨架，或悬停、聚焦左侧刻度并点击跳转。窄屏切换为章节选择器。</p>
  <div className="floating-toc-demo-stage">
   <aside><FloatingToc items={items} label="页面目录" activeId={current} onActiveChange={setCurrent} scrollContainerRef={root} position="inline" offset={24}/></aside>
   <div ref={root} className="floating-toc-demo-content" tabIndex={0} role="region" aria-label="章节骨架滚动预览">
    {items.map(item=><section id={item.id} key={item.id} aria-label={item.label}>
     <div className="floating-toc-demo-placeholder" aria-hidden="true">
      <Skeleton variant="text" width="44%" height={28} animate={false}/>
      <div className="floating-toc-demo-lines">
       <Skeleton variant="text" height={12} animate={false}/>
       <Skeleton variant="text" width="92%" height={12} animate={false}/>
       <Skeleton variant="text" width="72%" height={12} animate={false}/>
      </div>
      <Skeleton className="floating-toc-demo-media" height={144} animate={false}/>
     </div>
    </section>)}
   </div>
  </div>
  <p className="cs-help" role="status">当前章节：{items.find(item=>item.id===current)?.label}</p>
  <details className="website-control-details"><summary>使用规则</summary><ul><li>用于有明确章节的长页面；每个 id 必须唯一并对应真实内容。</li><li>桌面默认8px短刻度，当前项14px加粗；悬停或键盘聚焦时，按距离展开为32/26/20/14px。</li><li>滚动后显示当前章节标题，停留6秒后隐藏；链接可通过 Tab 和 Enter 操作。</li><li>900px以下或触屏改用章节选择器，点击区域至少44px；固定导航应预留页头及内容安全间距。</li><li>offset 是目标章节与滚动区域顶部的留白；根据实际固定页头高度设置。默认不修改URL，避免与应用路由冲突。</li></ul></details>
 </div>;
}
