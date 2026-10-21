import {NavigationMenu,type NavigationMenuItem} from '../../../packages/ui/src/index';

const items:NavigationMenuItem[]=[
 {id:'products',label:'Products',groups:[{title:'Sensors',links:[{label:'Measurement microphones',href:'#component/media-gallery'},{label:'Sound calibrators',href:'#component/media-gallery'}]},{title:'Data Acquisition',links:[{label:'SonoDAQ',href:'#templates'},{label:'OpenTest',href:'#scene/opentest'}]}]},
 {id:'solutions',label:'Solutions',groups:[{title:'By Industry',links:[{label:'Automotive',href:'#templates'},{label:'Consumer Electronics',href:'#templates'}]},{title:'By Application',links:[{label:'Sound Power Measurement',href:'#scene/brand'},{label:'Acoustic Imaging',href:'#scene/brand'}]}]},
 {id:'resources',label:'Resources',groups:[{title:'Resources',links:[{label:'Installation',href:'#installation'},{label:'Components',href:'#library'},{label:'Templates',href:'#templates'}]}]},
 {id:'support',label:'Support',groups:[{title:'Support',links:[{label:'Design foundations',href:'#foundations'},{label:'Customization',href:'#customization'}]}]},
 {id:'contact',label:'Contact',groups:[{title:'Contact',links:[{label:'CRYSOUND overview',href:'#overview'}]}]},
 {id:'about',label:'About Us',href:'#overview'},
 {id:'shop',label:'Shop',href:'#templates'},
];

export function NavigationMenuDemo() {
 return <div className="navigation-menu-demo">
  <p className="cs-help">品牌官网一级导航 · 胶囊样式</p>
  <NavigationMenu label="官网导航示例" shape="capsule" items={items}/>
  <p className="cs-help">悬停显示浅灰背景与品牌色文字；点击或 Enter / Space 展开，Escape 关闭并返回焦点。示例链接指向系统文档与样板。</p>
 </div>;
}
