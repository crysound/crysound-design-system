"use client";
import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './navigation';
export interface ColorFill {
  mode: 'solid' | 'gradient' | 'image';
  color: string;
  opacity: number;
  endColor: string;
  angle: number;
  imageUrl?: string;
}
export interface ColorPickerProps {
  value?: ColorFill;
  defaultValue?: Partial<ColorFill>;
  onChange?: (fill: ColorFill) => void;
  disabled?: boolean;
  onClose?: () => void;
}
const defaults: ColorFill = { mode:'solid',color:'#170057',opacity:100,endColor:'#a855f7',angle:90 };
const validHex = (text: string) => /^#[0-9a-f]{6}$/i.test(text);
export function colorFillBackground(fill: ColorFill): string {
  const color=validHex(fill.color)?fill.color:defaults.color;
  const end=validHex(fill.endColor)?fill.endColor:defaults.endColor;
  return fill.mode==='gradient' ? `linear-gradient(${Number.isFinite(fill.angle)?fill.angle:90}deg, ${color}, ${end})` : color;
}
export function ColorPicker({value,defaultValue,onChange,disabled=false,onClose}:ColorPickerProps) {
  const [internal,setInternal]=useState<ColorFill>({...defaults,...defaultValue});
  const fill=value??internal;
  const [draft,setDraft]=useState(fill.color);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [saved,setSaved]=useState(['#16a34a','#2563eb','#4f46e5','#9333ea','#db2777','#dc2626','#ea580c','#170057']);
  const localImage=useRef<string | undefined>(undefined);
  useEffect(()=>{setDraft(fill.color);},[fill.color]);
  useEffect(()=>()=>{if(localImage.current)URL.revokeObjectURL(localImage.current);},[]);
  function update(patch:Partial<ColorFill>) { if(disabled)return;const next={...fill,...patch};setInternal(next);onChange?.(next);setError(''); }
  async function eyedrop() {
    const ctor=(window as unknown as {EyeDropper?:new()=>{open:()=>Promise<{sRGBHex:string}>}}).EyeDropper;
    if(!ctor){setMessage('此浏览器不支持屏幕取色，请使用色板或 Hex 输入。');return;}
    try { const result=await new ctor().open();update({color:result.sRGBHex}); } catch {setMessage('已取消取色。');}
  }
  return <div className="cs-color-picker">
    {onClose && <button type="button" className="cs-color-close" aria-label="关闭颜色选择器" onClick={onClose}>×</button>}
    <fieldset disabled={disabled} className="cs-color-fieldset">
      <legend className="cs-sr-only">填充颜色</legend>
      <Tabs value={fill.mode} onValueChange={mode=>update({mode:mode as ColorFill['mode']})}>
        <TabsList aria-label="填充类型"><TabsTrigger value="solid" disabled={disabled}>Solid</TabsTrigger><TabsTrigger value="gradient" disabled={disabled}>Gradient</TabsTrigger><TabsTrigger value="image" disabled={disabled}>Image</TabsTrigger></TabsList>
        <TabsContent value="solid"><HexColorPicker color={validHex(fill.color)?fill.color:defaults.color} onChange={color=>update({color})} aria-label="选择纯色" /></TabsContent>
        <TabsContent value="gradient"><div className="cs-color-gradient-preview" style={{background:colorFillBackground(fill)}} /><div className="cs-color-gradient-inputs"><label>起始色<input type="color" aria-label="渐变起始色" value={fill.color} onChange={e=>update({color:e.target.value})} /></label><label>结束色<input type="color" aria-label="渐变结束色" value={fill.endColor} onChange={e=>update({endColor:e.target.value})} /></label><label>角度<input type="number" aria-label="渐变角度" min="0" max="360" value={fill.angle} onChange={e=>update({angle:Math.max(0,Math.min(360,Number(e.target.value)))})} /></label></div></TabsContent>
        <TabsContent value="image"><div className="cs-color-image-preview">{fill.imageUrl?<img src={fill.imageUrl} alt="填充图片预览" onError={()=>setError('图片无法显示，请重新选择。')} />:<span>选择一张图片作为填充</span>}</div><label className="cs-field">图片文件<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp|gif)$/.test(file.type)||file.size>10*1024*1024){setError('请选择不超过 10 MB 的 PNG、JPG、WebP 或 GIF。');return;}if(localImage.current)URL.revokeObjectURL(localImage.current);localImage.current=URL.createObjectURL(file);update({imageUrl:localImage.current});}} /></label><p className="cs-help">仅在本地预览，最多 10 MB；持久化图片由消费项目处理。</p></TabsContent>
      </Tabs>
      <div className="cs-color-opacity"><button type="button" aria-label="屏幕取色" onClick={()=>void eyedrop()} disabled={disabled || fill.mode==='image'}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m15 4 5 5M4 20l3-1L20 6a2 2 0 0 0-3-3L4 16Z" /></svg></button><label>透明度 {fill.opacity}%<input type="range" aria-label="透明度" min="0" max="100" value={fill.opacity} onChange={e=>update({opacity:Number(e.target.value)})} /></label></div>
      {fill.mode!=='image' && <div className="cs-color-hex-row"><span>Hex</span><span className="cs-color-dot" style={{background:fill.color}} /><input aria-label="Hex 颜色" value={draft} aria-invalid={!!error} onChange={e=>{setDraft(e.target.value);if(validHex(e.target.value))update({color:e.target.value});}} onBlur={()=>{if(!validHex(draft))setError('请输入完整的六位 Hex 色值，例如 #170057。');}} /><label><input type="number" aria-label="透明度百分比" min="0" max="100" value={fill.opacity} onChange={e=>update({opacity:Math.max(0,Math.min(100,Number(e.target.value)))})} />%</label></div>}
      {error && <p role="alert" className="cs-error">{error}</p>}
      <div className="cs-color-saved-heading"><strong>Saved</strong><button type="button" disabled={fill.mode==='image'} onClick={()=>{if(validHex(fill.color)){setSaved(current=>Array.from(new Set([...current,fill.color])).slice(-16));setMessage('当前颜色已加入本次会话色板。');}}}>＋ Add</button></div>
      <div className="cs-color-swatches" role="group" aria-label="保存的颜色">{saved.map(color=><button key={color} type="button" aria-label={`选择 ${color}`} aria-pressed={fill.color.toLowerCase()===color.toLowerCase()} style={{background:color}} onClick={()=>update({color})} />)}</div>
      <span className="cs-help" role="status">{message}</span>
    </fieldset>
  </div>;
}
