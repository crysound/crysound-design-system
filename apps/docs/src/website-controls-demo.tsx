import {SearchLg} from '@untitledui/icons';
import {useState} from 'react';
import {IconButton,MediaGallery} from '../../../packages/ui/src/index';
const icon=<SearchLg size={20} strokeWidth={1.5}/>;
const images=[{id:'daq',src:'/scene-assets/sonodaq.png',alt:'SonoDAQ Pro 采集设备',caption:'多通道数据采集'},{id:'pi',src:'/scene-assets/sonocam.png',alt:'SonoCam Pi 声学成像设备',caption:'声源定位与声学成像'},{id:'meter',src:'/scene-assets/sound-meter.png',alt:'声级计',caption:'噪声测量设备'}];
export function IconButtonDemo(){const [notice,setNotice]=useState('');return <div className="website-icon-demo"><div className="website-icon-variants">{([{label:'搜索产品',caption:'默认',variant:'ghost'},{label:'搜索产品（次要）',caption:'边框',variant:'secondary'},{label:'搜索产品（强调）',caption:'强调',variant:'primary'},{label:'不可用的搜索',caption:'禁用',variant:'ghost',disabled:true}] as const).map(item=><div key={item.label}><IconButton label={item.label} variant={item.variant} disabled={'disabled' in item&&item.disabled} onClick={()=>setNotice('已触发搜索操作')}>{icon}</IconButton><span>{item.caption}</span></div>)}</div><p className="cs-help" role="status">{notice}</p></div>;}

export function MediaGalleryDemo(){return <div className="website-gallery-demo"><MediaGallery images={images} label="产品图片" layout="grid"/></div>;}
