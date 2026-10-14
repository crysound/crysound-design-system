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
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(!!props.muted);
  const [volume, setVolume] = useState(1);
  const [cc, setCc] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const available = !!src && state !== 'error';
  const format = (n: number) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2,'0')}`;
  async function toggle() { if (!video.current) return; if (!video.current.paused) video.current.pause(); else try { await video.current.play(); } catch { setState('error'); } }
  async function fullscreen() { try { if(document.fullscreenElement) await document.exitFullscreen(); else await stage.current?.requestFullscreen(); } catch { /* Browser may not support fullscreen. */ } }
  const icon = (kind: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==='play'?<path d="m8 5 11 7-11 7Z" fill="currentColor" />:kind==='pause'?<><path d="M8 5v14M16 5v14" strokeWidth="4" /></>:kind==='full'?<path d="M15 3h6v6m0-6-7 7M9 21H3v-6m0 6 7-7" />:<><path d="M11 5 5 9H2v6h3l6 4Z" />{muted?<path d="m16 9 6 6m0-6-6 6" />:<path d="M15 8a6 6 0 0 1 0 8m4-11a10 10 0 0 1 0 14" />}</>}</svg>;

  useEffect(()=>{setState('ready');setSpeed('1');setPlaying(false);setTime(0);setDuration(0);},[src]);
  return <figure className={`cs-video-player ${className ?? ''}`}>
    <div ref={stage} className={`cs-video-stage ${playing ? "is-playing" : "is-paused"}`}>
      {src ? <video {...props} ref={video} src={src} poster={poster} playsInline tabIndex={0} preload="metadata" aria-label={title}
        onClick={()=>void toggle()} onDoubleClick={()=>void fullscreen()}
        onKeyDown={event=>{props.onKeyDown?.(event);if(event.defaultPrevented)return;const v=video.current;if(!v)return;if([' ','k','m','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))event.preventDefault();if(event.key===' '||event.key==='k')void toggle();if(event.key==='m')v.muted=!v.muted;if(event.key==='ArrowLeft')v.currentTime=Math.max(0,v.currentTime-10);if(event.key==='ArrowRight'&&Number.isFinite(v.duration))v.currentTime=Math.min(v.duration,v.currentTime+10);if(event.key==='ArrowUp')v.volume=Math.min(1,v.volume+0.1);if(event.key==='ArrowDown')v.volume=Math.max(0,v.volume-0.1);}}
        onPlay={event=>{setPlaying(true);props.onPlay?.(event);}} onPause={event=>{setPlaying(false);props.onPause?.(event);}}
        onEnded={event=>{setPlaying(false);props.onEnded?.(event);}}
        onTimeUpdate={event=>{setTime(event.currentTarget.currentTime);props.onTimeUpdate?.(event);}}
        onDurationChange={event=>{setDuration(Number.isFinite(event.currentTarget.duration)?event.currentTarget.duration:0);props.onDurationChange?.(event);}}
        onVolumeChange={event=>{setMuted(event.currentTarget.muted);setVolume(event.currentTarget.volume);props.onVolumeChange?.(event);}}
        onError={event=>{setState('error');onError?.(event);}}
        onLoadedData={event=>{setState('ready');onLoadedData?.(event);}}
        onWaiting={event=>{setState('loading');onWaiting?.(event);}}
        onPlaying={event=>{setState('ready');onPlaying?.(event);}}>
        {captions.map(track=><track key={track.src} kind="captions" {...track} />)}
        当前浏览器不支持视频播放。
      </video> : <div className="cs-video-message"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 8 6 4-6 4Z"/></svg><strong>尚未选择视频</strong><span>提供视频地址或在示例中选择本地文件。</span></div>}
      {available && !playing && <button className="cs-video-center-play" type="button" aria-label="播放视频" onClick={()=>void toggle()}>{icon('play')}</button>}
      {available && <div className="cs-video-controls" role="group" aria-label="视频控制">
        <button type="button" aria-label={playing?'暂停':'播放'} onClick={()=>void toggle()}>{icon(playing?'pause':'play')}</button>
        <button type="button" aria-label={muted?'取消静音':'静音'} onClick={()=>{if(video.current)video.current.muted=!video.current.muted;}}>{icon('volume')}</button>
        <input className="cs-video-volume" type="range" aria-label="音量" min="0" max="1" step="0.05" value={muted?0:volume} onChange={e=>{if(video.current){video.current.volume=Number(e.target.value);video.current.muted=false;}}} />
        <span className="cs-video-time">{format(time)}</span>
        <input className="cs-video-progress" type="range" aria-label="播放进度" min="0" max={duration || 1} step="0.1" value={time} disabled={!duration} onChange={e=>{if(video.current)video.current.currentTime=Number(e.target.value);}} />
        <span className="cs-video-time">-{format(Math.max(0,duration-time))}</span>
        <select aria-label="播放速度" value={speed} onChange={e=>{setSpeed(e.target.value);if(video.current)video.current.playbackRate=Number(e.target.value);}}>{['0.5','0.75','1','1.25','1.5','2'].map(rate=><option key={rate} value={rate}>{rate}×</option>)}</select>
        {captions.length>0 && <button type="button" aria-label="字幕" aria-pressed={cc} onClick={()=>{const next=!cc;setCc(next);if(video.current)Array.from(video.current.textTracks).forEach((track,i)=>{track.mode=next&&i===0?'showing':'disabled';});}}>CC</button>}
        <button type="button" aria-label="切换全屏" onClick={()=>void fullscreen()}>{icon('full')}</button>
      </div>}
      {src && state==='loading' && <div className="cs-video-status" role="status">正在缓冲…</div>}
      {src && state==='error' && <div className="cs-video-message cs-video-error" role="alert"><strong>视频无法播放</strong><span>请检查地址、文件格式或网络连接。</span><button type="button" className="cs-button cs-button--secondary" onClick={()=>{setState('loading');video.current?.load();}}>重试</button></div>}
    </div>
    <figcaption className="cs-sr-only">{title}</figcaption>
    {!available && <select className="cs-sr-only" aria-label="播放速度" disabled value="1" onChange={()=>{}}><option value="1">1×</option></select>}
  </figure>;
}
