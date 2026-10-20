import {useState} from 'react';
import {Carousel} from '../../../packages/ui/src/index';
const examples=[1,2,3].map(number=>({id:`image-${number}`,label:`默认图片 ${number}`,number}));
function DefaultImage({number}:{number:number}){
 return <div className="pagination-demo-slide">
  <svg className="pagination-demo-placeholder" viewBox="0 0 1600 900" role="img" aria-label={`默认图片 ${number}（16:9）`}>
   <svg x="752" y="354" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
   </svg>
   <text x="800" y="510" textAnchor="middle" className="pagination-demo-placeholder-ratio">16:9</text>
   <text x="1540" y="840" textAnchor="end" className="pagination-demo-placeholder-index">{String(number).padStart(2,'0')}</text>
  </svg>
 </div>;
}
export function CarouselPaginationDemo(){
 const [value,setValue]=useState(0);
 return <div className="pagination-demo"><Carousel className="pagination-demo-carousel" label="自动轮播示例" autoPlay showPlayControl={false} interval={5000} arrows={false} value={value} onValueChange={setValue} items={examples.map(item=>({id:item.id,label:item.label,content:<DefaultImage number={item.number}/>}))}/><p className="cs-help">第 {value+1} / {examples.length} 张 · 每5秒切换；悬停暂缓，聚焦后停止，支持圆点手动切换。</p><details className="website-control-details"><summary>轮播与分页位置规则</summary><ul><li>本示例使用三张默认16:9图片，随容器等比缩放；分页始终位于图片下方居中，保留适度留白与完整点击区域。</li><li>图文、产品或文章卡片：分页放在内容下方，间隔16–24px；不覆盖标题、正文和操作按钮。</li><li>自动轮播由 Carousel 管理，建议至少5秒。本示例不显示播放按钮，悬停暂缓、键盘聚焦后停止自动切换，之后可用圆点浏览；页面隐藏暂缓，减少动态效果时禁用自动播放。</li><li>0条显示空状态；1条不显示分页也不自动切换。建议2–7个分页点，更多内容由业务调整分组或使用页码。</li><li>切换保留已挂载的幻灯片，连续平移轨道，不从透明重新淡入。快速切换以最新目标为准，减少动态效果时直接切换；使用实际图片时，等待加载、解码后展示。</li><li>分页只表达当前位置，不承担数据列表分页。支持点击、方向键、Home/End；自动切换不移动键盘焦点。</li></ul></details></div>;
}
