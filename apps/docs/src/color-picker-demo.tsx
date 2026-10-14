import { useState } from 'react';
import { ColorPicker, colorFillBackground, type ColorFill } from '../../../packages/ui/src/index';
export function ColorPickerDemo() {
  const [fill,setFill]=useState<ColorFill>({mode:'solid',color:'#170057',opacity:100,endColor:'#a855f7',angle:90});
  return <div className="color-picker-demo"><ColorPicker value={fill} onChange={setFill} /><div className="color-picker-result"><strong>实时填充预览</strong><div className="color-picker-result-checker"><div style={{background:fill.mode==='image'?undefined:colorFillBackground(fill),opacity:fill.opacity/100}}>{fill.mode==='image'&&fill.imageUrl&&<img src={fill.imageUrl} alt="填充效果" />}</div></div><code>{fill.mode==='image'?'本地图片填充':colorFillBackground(fill)}</code><span className="cs-help">透明度 {fill.opacity}% · Saved 色板保存在本次会话中</span></div></div>;
}
