import {useCallback,useEffect,useId,useRef,useState,type CSSProperties,type ReactNode} from 'react';
import * as P from '@radix-ui/react-popover';

export interface NavigationMenuLink {
 label:string;href:string;description?:string;image?:string;media?:ReactNode;products?:NavigationMenuLink[];
}
export interface NavigationMenuGroup {title:string;links:NavigationMenuLink[];products?:NavigationMenuLink[];}
export interface NavigationMenuItem {
 id:string;label:string;href?:string;groups?:NavigationMenuGroup[];featured?:ReactNode;
 layout?:'columns'|'catalog'|'cards';links?:NavigationMenuLink[];products?:NavigationMenuLink[];footer?:NavigationMenuLink;
 catalogLabels?:{categories:string;products:string};neutralInitialSelection?:boolean;
}
export interface NavigationMenuProps {
 items:NavigationMenuItem[];label?:string;className?:string;brand?:ReactNode;actions?:ReactNode;onNavigate?:(href:string)=>void;
 /** Capsule primary links are intended for brand websites. */
 shape?:'rounded'|'capsule';
 /** Website mega-menu surfaces, catalog cards, and footer geometry. */
 panelVariant?:'default'|'website';
 /** Pointer hover can preview catalog categories; click and keyboard always work. */
 activateOnHover?:boolean;
 /** A local container at 1200px switches to the accessible disclosure menu. */
 collapsible?:boolean;mobileToggleLabels?:{open:string;close:string};
}
const Chevron=()=> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>;
function NavigationTrigger({item,motion}:{item:Pick<NavigationMenuItem,'id'|'label'>;motion:boolean}) {
 const sequence=useRef(0);const [feedback,setFeedback]=useState({x:'50%',y:'50%',pulse:0});
 useEffect(()=>{if(!motion)setFeedback(current=>current.pulse?{...current,pulse:0}:current);},[motion]);
 const press=(button:HTMLButtonElement,clientX?:number,clientY?:number)=>{
  if(!motion)return;
  const bounds=button.getBoundingClientRect();
  const percent=(point:number|undefined,start:number,length:number)=>point===undefined||!length?'50%':`${Math.max(0,Math.min(100,(point-start)/length*100))}%`;
  setFeedback({x:percent(clientX,bounds.left,bounds.width),y:percent(clientY,bounds.top,bounds.height),pulse:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?0:++sequence.current});
 };
 return <P.Trigger className="cs-navigation-menu-trigger" data-menu={item.id} data-click-motion={motion||undefined} style={motion?{'--cs-navigation-click-x':feedback.x,'--cs-navigation-click-y':feedback.y} as CSSProperties:undefined} onPointerDown={event=>{if(event.button===0)press(event.currentTarget,event.clientX,event.clientY);}} onClick={event=>{if(event.detail===0)press(event.currentTarget);}}>
  <span>{item.label}</span><Chevron/>
  {motion&&feedback.pulse>0&&<span key={feedback.pulse} className="cs-navigation-click-pulse" aria-hidden="true" onAnimationEnd={event=>{if(event.animationName==='cs-navigation-click-pulse'){const pulse=feedback.pulse;setFeedback(current=>current.pulse===pulse?{...current,pulse:0}:current);}}}/>}
 </P.Trigger>;
}
function Footer({link,navigate}:{link:NavigationMenuLink;navigate:(href:string)=>void}) {
 return <a className="cs-navigation-menu-footer" href={link.href} onClick={()=>navigate(link.href)}>{link.label}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></a>;
}
function CatalogPanel({item,navigate,activateOnHover}:{item:NavigationMenuItem;navigate:(href:string)=>void;activateOnHover:boolean}) {
 const [group,setGroup]=useState(0);const [sub,setSub]=useState(-1);const [changed,setChanged]=useState(false);
 const refs=useRef<(HTMLButtonElement|null)[]>([]);const subRefs=useRef<(HTMLButtonElement|null)[]>([]);const grid=useRef<HTMLDivElement>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);const id=useId();const groups=item.groups??[];const current=groups[Math.min(group,groups.length-1)];
 const products=(sub>=0?current?.links[sub]?.products:undefined)??(changed?current?.products:item.products)??current?.products??[];
 const cancelHover=useCallback(()=>{clearTimeout(timer.current);timer.current=undefined;},[]);
 useEffect(()=>cancelHover,[cancelHover]);
 useEffect(()=>{if(grid.current)grid.current.scrollTop=0;},[group,sub]);
 const selectGroup=(i:number)=>{cancelHover();setGroup(i);setSub(-1);setChanged(true);};
 const selectSub=(i:number)=>{cancelHover();setSub(i);setChanged(true);};
 const hover=(pointerType:string,select:()=>void)=>{if(!activateOnHover||pointerType==='touch')return;cancelHover();timer.current=setTimeout(select,180);};
 const nextIndex=(key:string,i:number,count:number)=>key==='ArrowDown'?(i+1)%count:key==='ArrowUp'?(i-1+count)%count:key==='Home'?0:key==='End'?count-1:undefined;
 return <><div className="cs-navigation-catalog">
  <div className="cs-navigation-categories" role="group" aria-label={item.catalogLabels?.categories??'产品大类'}>{groups.map((g,i)=><button ref={el=>{refs.current[i]=el;}} key={g.title} type="button" aria-pressed={(changed||!item.neutralInitialSelection)&&i===group} aria-controls={id} onClick={()=>selectGroup(i)} onPointerEnter={e=>hover(e.pointerType,()=>selectGroup(i))} onPointerLeave={cancelHover} onKeyDown={e=>{const next=nextIndex(e.key,i,groups.length);if(next===undefined)return;e.preventDefault();selectGroup(next);refs.current[next]?.focus();}}><span>{g.title}</span><Chevron/></button>)}</div>
  <div id={id} className="cs-navigation-subcategories" role="group" aria-label={current?.title}>{current?.links.map((link,i)=><button ref={el=>{subRefs.current[i]=el;}} key={`${link.href}-${link.label}`} type="button" aria-pressed={i===sub} onClick={()=>selectSub(i)} onPointerEnter={e=>hover(e.pointerType,()=>selectSub(i))} onPointerLeave={cancelHover} onKeyDown={e=>{const next=nextIndex(e.key,i,current.links.length);if(next===undefined)return;e.preventDefault();selectSub(next);subRefs.current[next]?.focus();}}><span>{link.label}</span><Chevron/></button>)}</div>
  <div ref={grid} className="cs-navigation-products" role="group" aria-label={item.catalogLabels?.products??'推荐产品'}>{products.map(product=><a key={`${product.href}-${product.label}`} href={product.href} onClick={()=>navigate(product.href)}>{(product.media||product.image)&&<span className="cs-navigation-product-media">{product.media??<img src={product.image} alt="" loading="lazy"/>}</span>}<span className="cs-navigation-product-title">{product.label}</span></a>)}{!products.length&&<p className="cs-help">暂无产品</p>}</div>
 </div>{item.footer&&<Footer link={item.footer} navigate={navigate}/>}</>;
}
function CardsPanel({links,navigate}:{links:NavigationMenuLink[];navigate:(href:string)=>void}) {
 return <div className="cs-navigation-cards" data-count={links.length}>{links.map(link=><a href={link.href} key={`${link.href}-${link.label}`} onClick={()=>navigate(link.href)}>{(link.media||link.image)&&<span className="cs-navigation-card-media">{link.media??<img src={link.image} alt="" loading="lazy"/>}</span>}<span className="cs-navigation-card-label"><span>{link.label}</span><Chevron/></span></a>)}</div>;
}
function MobileLinks({item,navigate}:{item:NavigationMenuItem;navigate:(href:string)=>void}) {
 if(!item.groups?.length&&!item.links?.length)return <a href={item.href} onClick={()=>{if(item.href)navigate(item.href);}}>{item.label}</a>;
 return <details><summary>{item.label}<Chevron/></summary><div className="cs-navigation-mobile-links">{item.groups?.map(group=><details key={group.title}><summary>{group.title}<Chevron/></summary><div className="cs-navigation-mobile-links">{group.links.map(link=><a key={`${link.href}-${link.label}`} href={link.href} onClick={()=>navigate(link.href)}>{link.label}</a>)}</div></details>)}{item.links?.map(link=><a key={`${link.href}-${link.label}`} href={link.href} onClick={()=>navigate(link.href)}>{link.label}</a>)}{item.footer&&<a href={item.footer.href} onClick={()=>navigate(item.footer!.href)}>{item.footer.label}</a>}</div></details>;
}
/** Grouped website links, image-card menus, or a category / subtype / product catalog. */
export function NavigationMenu({items,label='主导航',className,brand,actions,onNavigate,shape='rounded',panelVariant='default',activateOnHover=false,collapsible=false,mobileToggleLabels={open:'展开导航',close:'收起导航'}}:NavigationMenuProps) {
 const [open,setOpen]=useState<string>();const [mobileOpen,setMobileOpen]=useState(false);const root=useRef<HTMLElement>(null);const shell=useRef<HTMLDivElement>(null);const [available,setAvailable]=useState(560);
 const measure=()=>setAvailable(Math.max(120,Math.floor(window.innerHeight-(root.current?.getBoundingClientRect().bottom??0)-16)));
 useEffect(()=>{if(!open&&!mobileOpen)return;measure();window.addEventListener('resize',measure);window.addEventListener('scroll',measure,true);return()=>{window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure,true);};},[open,mobileOpen]);
 useEffect(()=>{if(!collapsible||!shell.current)return;let previous:boolean|undefined;const observer=new ResizeObserver(entries=>{const mobile=entries[0].contentRect.width<=1200;if(previous!==undefined&&previous!==mobile){setOpen(undefined);setMobileOpen(false);}previous=mobile;});observer.observe(shell.current);return()=>observer.disconnect();},[collapsible]);
 const navigate=(href:string)=>{setOpen(undefined);setMobileOpen(false);onNavigate?.(href);};
 const nav=<nav ref={root} style={{'--cs-navigation-available-height':`${available}px`} as CSSProperties} aria-label={label} data-shape={shape} data-panel-variant={panelVariant} data-open={open||mobileOpen?true:undefined} className={['cs-navigation-menu',className].filter(Boolean).join(' ')}>
  {brand&&<div className="cs-navigation-menu-brand">{brand}</div>}
  <div className="cs-navigation-menu-items">{items.map(item=>item.groups?.length||item.links?.length?<P.Root key={item.id} open={open===item.id} onOpenChange={v=>{if(v)measure();setOpen(current=>v?item.id:current===item.id?undefined:current);}}><NavigationTrigger item={item} motion={shape==='capsule'}/><P.Content sideOffset={0} align="start" collisionPadding={16} className={`cs-navigation-menu-panel cs-navigation-menu-panel--${item.layout??'columns'}`} data-menu={item.id} aria-label={`${item.label}导航`} onCloseAutoFocus={event=>{if(open&&open!==item.id)event.preventDefault();}}>{item.layout==='catalog'?<CatalogPanel item={item} navigate={navigate} activateOnHover={activateOnHover}/>:item.layout==='cards'?<CardsPanel links={item.links??[]} navigate={navigate}/>:<div className="cs-navigation-menu-columns">{item.groups?.map(group=><section key={group.title}><h3>{group.title}</h3><ul>{group.links.map(link=><li key={`${link.href}-${link.label}`}><a href={link.href} onClick={()=>navigate(link.href)}><span>{link.label}</span>{link.description&&<small>{link.description}</small>}</a></li>)}</ul></section>)}{item.featured&&<aside className="cs-navigation-menu-featured">{item.featured}</aside>}</div>}</P.Content></P.Root>:<a className="cs-navigation-menu-link" key={item.id} href={item.href} onClick={()=>{setOpen(undefined);if(item.href)onNavigate?.(item.href);}}>{item.label}</a>)}</div>
  {actions&&<div className="cs-navigation-menu-actions">{actions}</div>}
  {collapsible&&<P.Root open={mobileOpen} onOpenChange={v=>{if(v){measure();setOpen(undefined);}setMobileOpen(v);}}><P.Trigger className="cs-navigation-mobile-toggle" aria-label={mobileOpen?mobileToggleLabels.close:mobileToggleLabels.open}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{mobileOpen?<path d="m6 6 12 12M6 18 18 6"/>:<path d="M4 6h16M4 12h16M4 18h16"/>}</svg></P.Trigger><P.Content sideOffset={0} align="end" collisionPadding={0} className="cs-navigation-mobile-panel" aria-label={label} onCloseAutoFocus={event=>{if(open)event.preventDefault();}}><div className="cs-navigation-mobile-items">{items.map(item=><MobileLinks key={item.id} item={item} navigate={navigate}/>)}</div>{actions&&<div className="cs-navigation-mobile-actions">{actions}</div>}</P.Content></P.Root>}
 </nav>;
 return collapsible?<div className="cs-navigation-shell" ref={shell}>{nav}</div>:nav;
}
