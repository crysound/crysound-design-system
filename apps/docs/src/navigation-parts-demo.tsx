import {useId,useState} from 'react';
import {NavigationBar,NavigationBarTrigger,NavigationBarLink,NavigationPanel,Select} from '../../../packages/ui/src/index';
import {brandNavigationItems} from './brand-navigation-items';

export function NavigationBarDemo() {
 const [open,setOpen]=useState<string>();
 const id=useId();
 return <div className="navigation-parts-demo">
  <NavigationBar label="一级导航栏示例" shape="capsule" panelVariant="website" open={!!open}>
   {brandNavigationItems.map(item=>item.groups||item.links?<NavigationBarTrigger key={item.id} aria-expanded={open===item.id} aria-controls={id} onClick={()=>setOpen(current=>current===item.id?undefined:item.id)} onKeyDown={event=>{if(event.key==='Escape')setOpen(undefined);}}>{item.label}</NavigationBarTrigger>:<NavigationBarLink key={item.id} href={item.href}>{item.label}</NavigationBarLink>)}
  </NavigationBar>
  <p className="cs-help">点击箭头项查看展开状态；完整下拉交互见 <a href="#component/navigation-menu">NavigationMenu</a>。</p>
  <div id={id} role="region" aria-label="展开状态预览" hidden={!open}><p className="cs-help">当前展开：{brandNavigationItems.find(item=>item.id===open)?.label}</p></div>
 </div>;
}

export function NavigationPanelDemo({cards=false}:{cards?:boolean}) {
 const choices=brandNavigationItems.filter(item=>cards?item.layout==='cards':item.layout==='catalog');
 const [selected,setSelected]=useState(choices[0].id);
 const item=choices.find(item=>item.id===selected)??choices[0];
 return <div className="navigation-parts-demo">
  <div className="navigation-parts-demo-control"><Select label={cards?'图片卡片示例':'分类目录示例'} value={item.id} onChange={event=>setSelected(event.target.value)}>{choices.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</Select></div>
  <NavigationPanel item={item} variant="website" activateOnHover/>
 </div>;
}
