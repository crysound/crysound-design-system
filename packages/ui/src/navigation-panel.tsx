"use client";
import {useCallback,useEffect,useId,useRef,useState,type ComponentProps} from 'react';
import type {NavigationMenuItem,NavigationMenuLink} from './navigation-menu.types';
import {NavigationChevron as Chevron} from './navigation-menu-icons';
import {NavigationPanelImage} from './navigation-panel-image';
import {cx} from './utils';

export interface NavigationPanelProps extends Omit<ComponentProps<'div'>,'children'|'onNavigate'> {
 item:NavigationMenuItem;
 variant?:'default'|'website';
 activateOnHover?:boolean;
 onNavigate?:(href:string)=>void;
}
/** Inline menu contents. NavigationMenu supplies positioning, dismissal and focus return. */
export function NavigationPanel({item,variant='default',activateOnHover=false,onNavigate=()=>{},className,...props}:NavigationPanelProps) {
 return <div {...props} role={props.role??'region'} aria-label={props['aria-label']??`${item.label}导航面板`} className={cx('cs-navigation-panel',className)} data-variant={variant} data-layout={item.layout??'columns'}>
  {item.layout==='catalog'?<CatalogPanel key={item.id} item={item} navigate={onNavigate} activateOnHover={activateOnHover}/>:item.layout==='cards'?<CardsPanel links={item.links??[]} navigate={onNavigate}/>:<div className="cs-navigation-menu-columns">{item.groups?.map(group=><section key={group.title}><h3>{group.title}</h3><ul>{group.links.map(link=><li key={`${link.href}-${link.label}`}><a href={link.href} onClick={()=>onNavigate(link.href)}><span>{link.label}</span>{link.description&&<small>{link.description}</small>}</a></li>)}</ul></section>)}{item.featured&&<aside className="cs-navigation-menu-featured">{item.featured}</aside>}</div>}
 </div>;
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
  <div ref={grid} className="cs-navigation-products" role="group" aria-label={item.catalogLabels?.products??'推荐产品'}>{products.map(product=><a key={`${product.href}-${product.label}`} href={product.href} onClick={()=>navigate(product.href)}>{(product.media||product.image)&&<span className="cs-navigation-product-media">{product.media??<NavigationPanelImage src={product.image!} preview={product.imagePreview} fit="contain"/>}</span>}<span className="cs-navigation-product-title">{product.label}</span></a>)}{!products.length&&<p className="cs-help">暂无产品</p>}</div>
 </div>{item.footer&&<Footer link={item.footer} navigate={navigate}/>}</>;
}
function CardsPanel({links,navigate}:{links:NavigationMenuLink[];navigate:(href:string)=>void}) {
 return <div className="cs-navigation-cards" data-count={links.length}>{links.map(link=><a href={link.href} key={`${link.href}-${link.label}`} onClick={()=>navigate(link.href)}>{(link.media||link.image)&&<span className="cs-navigation-card-media">{link.media??<NavigationPanelImage key={link.image} src={link.image!} preview={link.imagePreview}/>}</span>}<span className="cs-navigation-card-label"><span>{link.label}</span><Chevron/></span></a>)}</div>;
}
