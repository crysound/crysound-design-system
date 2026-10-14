"use client";
import { useRef, useState, useEffect, type VideoHTMLAttributes } from 'react';
export interface VideoPlayerProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'controls' | 'title'> {
  title: string;
  captions?: { src: string; srcLang: string; label: string; default?: boolean }[];
}
export function VideoPlayer({ title, src, poster, captions = [], className, onError, onLoadedData, onWaiting, onPlaying, ...props }: VideoPlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<'ready'|'loading'|'error'>('ready');
  const [speed, setSpeed] = useState('1');
  useEffect(()=>{setState('ready');setSpeed('1');},[src]);
  return <figure className={`cs-video-player ${className ?? ''}`}>
    <div className="cs-video-stage">
      {src ? <video {...props} ref={video} src={src} poster={poster} controls playsInline preload="metadata" aria-label={title}
        onError={event=>{setState('error');onError?.(event);}}
        onLoadedData={event=>{setState('ready');onLoadedData?.(event);}}
        onWaiting={event=>{setState('loading');onWaiting?.(event);}}
        onPlaying={event=>{setState('ready');onPlaying?.(event);}}>
        {captions.map(track=><track key={track.src} kind="captions" {...track} />)}
        当前浏览器不支持视频播放。
      </video> : <div className="cs-video-message"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 8 6 4-6 4Z"/></svg><strong>尚未选择视频</strong><span>提供视频地址或在示例中选择本地文件。</span></div>}
      {src && state==='loading' && <div className="cs-video-status" role="status">正在缓冲…</div>}
      {src && state==='error' && <div className="cs-video-message cs-video-error" role="alert"><strong>视频无法播放</strong><span>请检查地址、文件格式或网络连接。</span><button type="button" className="cs-button cs-button--secondary" onClick={()=>{setState('loading');video.current?.load();}}>重试</button></div>}
    </div>
    <figcaption className="cs-video-caption"><span>{title}</span><label>播放速度<select aria-label="播放速度" value={speed} disabled={!src || state==='error'} onChange={e=>{setSpeed(e.target.value);if(video.current)video.current.playbackRate=Number(e.target.value);}}>{['0.5','0.75','1','1.25','1.5','2'].map(rate=><option key={rate} value={rate}>{rate}×</option>)}</select></label></figcaption>
  </figure>;
}
