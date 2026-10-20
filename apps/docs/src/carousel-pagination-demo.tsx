import {useState} from 'react';
import {Carousel} from '../../../packages/ui/src/index';
const examples=[
 {id:'acquisition',label:'Data acquisition',image:'/scene-assets/solution-setup.png',title:'Connect every measurement',description:'Keep acquisition, analysis and results in one clear workflow.'},
 {id:'sound-power',label:'Sound power',image:'/scene-assets/solution-sound-power.png',title:'Measure sound power',description:'Review measurement conditions, compare results and explore the details.'},
 {id:'analysis',label:'Acoustic analysis',image:'/scene-assets/solution-consistency.png',title:'Explore the full spectrum',description:'Inspect tones, harmonics and broadband noise across your channels.'},
];
export function CarouselPaginationDemo(){
 const [value,setValue]=useState(0);
 return <div className="pagination-demo"><Carousel className="pagination-demo-carousel pagination-demo-card" label="自动轮播示例" autoPlay showPlayControl={false} interval={5000} arrows={false} value={value} onValueChange={setValue} items={examples.map(item=>({id:item.id,label:item.label,content:<div className="pagination-demo-slide"><img src={item.image} alt={item.label}/><div className="pagination-demo-copy"><h3>{item.title}</h3><p>{item.description}</p></div></div>}))}/><p className="cs-help">第 {value+1} / {examples.length} 张 · 每5秒切换；悬停暂缓，聚焦后停止，支持圆点手动切换。</p><details className="website-control-details"><summary>轮播与分页位置规则</summary><ul><li>本示例仅保留图文卡片，分页始终位于卡片内容下方居中。</li><li>图文、产品或文章卡片：分页放在内容下方，间隔16–24px；不覆盖标题、正文和操作按钮。</li><li>嵌入容器小于480px时，图文由左右布局改为上下堆叠；分页仍在内容下方。</li><li>自动轮播由 Carousel 管理，建议至少5秒。本示例不显示播放按钮，悬停暂缓、键盘聚焦后停止自动切换，之后可用圆点浏览；页面隐藏暂缓，减少动态效果时禁用自动播放。</li><li>0条显示空状态；1条不显示分页也不自动切换。建议2–7个分页点，更多内容由业务调整分组或使用页码。</li><li>分页只表达当前位置，不承担数据列表分页。支持点击、方向键、Home/End；自动切换不移动键盘焦点。</li></ul></details></div>;
}
