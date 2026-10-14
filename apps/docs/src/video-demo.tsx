import { useEffect, useState } from 'react';
import { VideoPlayer } from '../../../packages/ui/src/index';
export function VideoDemo() {
  const [file,setFile]=useState<File>();
  const [src,setSrc]=useState('/demo-video.webm');
  useEffect(()=>{if(!file)return;const url=URL.createObjectURL(file);setSrc(url);return ()=>URL.revokeObjectURL(url);},[file]);
  return <div className="video-demo"><VideoPlayer title={file?.name ?? '测量演示 / 合成声波动画'} src={src} poster="/video-poster.svg" /><label className="cs-field">选择本地视频<input type="file" accept="video/*" onChange={e=>setFile(e.target.files?.[0])} /></label><p className="cs-help">内置动画为合成演示素材。可选择本地视频，文件仅在浏览器播放。播放器使用自定义浮动控制栏，支持键盘、进度、音量、全屏及画中画（依浏览器能力）。</p></div>;
}
