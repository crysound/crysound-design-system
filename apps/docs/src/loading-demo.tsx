import {useState} from 'react';
import {LoadingIndicator,Switch} from '../../../packages/ui/src/index';
export function LoadingDemo(){
 const [animate,setAnimate]=useState(true);
 return <div className="loading-demo">
  <section><div className="loading-demo-heading"><h3>Pulse 呼吸加载</h3><Switch label="播放呼吸动画" checked={animate} onCheckedChange={setAnimate}/></div><div className="loading-demo-panel"><LoadingIndicator variant="pulse" size="lg" label="正在准备测量界面…" animate={animate}/></div></section>
  {(['pulse','spinner','ring','dots'] as const).map(variant=><section key={variant}><h3>{variant==='pulse'?'Pulse 尺寸':variant==='spinner'?'Spinner 旋转':variant==='ring'?'Ring 圆环':'Dots 跳点'}</h3><div className="loading-demo-row">{(['sm','md','lg'] as const).map(size=><div key={size}><LoadingIndicator variant={variant} size={size} label="加载中" animate={variant==='pulse'?animate:undefined}/><small>{size}</small></div>)}</div></section>)}
  <section><h3>中性样式与仅图形</h3><div className="loading-demo-row"><LoadingIndicator variant="pulse" tone="neutral" label="正在读取测量记录…" animate={animate}/><LoadingIndicator variant="pulse" label="正在加载预览" showLabel={false} animate={animate}/></div></section>
  <p className="cs-help">用于等待时长不确定的任务。已知进度使用 Progress；内容占位使用 Skeleton。减少动态效果时保留静态指示和文字。</p>
 </div>;
}
