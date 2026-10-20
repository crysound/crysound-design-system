import {useState} from 'react';
import {Carousel,Select} from '../../../packages/ui/src/index';
const examples=[
 {id:'acquisition',label:'Data acquisition',image:'/scene-assets/solution-setup.png',title:'Connect every measurement',description:'Keep acquisition, analysis and results in one clear workflow.'},
 {id:'sound-power',label:'Sound power',image:'/scene-assets/solution-sound-power.png',title:'Measure sound power',description:'Review measurement conditions, compare results and explore the details.'},
 {id:'analysis',label:'Acoustic analysis',image:'/scene-assets/solution-consistency.png',title:'Explore the full spectrum',description:'Inspect tones, harmonics and broadband noise across your channels.'},
];
export function CarouselPaginationDemo(){
 const [scene,setScene]=useState('image');const [value,setValue]=useState(0);
 return <div className="pagination-demo"><Select label="内容场景" value={scene} onChange={event=>{setScene(event.target.value);setValue(0);}}><option value="image">图片展示：图内底部居中</option><option value="card">图文卡片：内容下方居中</option></Select><Carousel key={scene} className={`pagination-demo-carousel pagination-demo-${scene}`} label="自动轮播示例" autoPlay interval={5000} arrows={false} value={value} onValueChange={setValue} items={examples.map(item=>({id:item.id,label:item.label,content:<div className="pagination-demo-slide"><img src={item.image} alt={item.label}/><div className="pagination-demo-copy"><h3>{item.title}</h3><p>{item.description}</p></div></div>}))}/><p className="cs-help">第 {value+1} / {examples.length} 张 · 每5秒切换；悬停暂缓，聚焦后停止，可手动继续播放。</p><details className="website-control-details"><summary>轮播与分页位置规则</summary><ul><li>图片或Banner：仅在底部有安全留白时，将分页放在图内底部居中，距离容器边缘16–24px，并保证对比度。</li><li>图文、产品或文章卡片：分页放在内容下方，间隔16–24px；不覆盖标题、正文和操作按钮。</li><li>嵌入容器小于480px时，本示例将图内分页移到内容下方；不要仅按浏览器宽度判断。</li><li>自动轮播由 Carousel 管理，建议至少5秒。必须有暂停/继续控制，悬停暂缓、键盘聚焦停止、页面隐藏暂缓；减少动态效果时禁用自动播放。</li><li>0条显示空状态；1条不显示分页也不自动切换。建议2–7个分页点，更多内容由业务调整分组或使用页码。</li><li>分页只表达当前位置，不承担数据列表分页。支持点击、方向键、Home/End；自动切换不移动键盘焦点。</li></ul></details></div>;
}
