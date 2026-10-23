"use client";
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import * as P from '@radix-ui/react-popover';
import {NavigationBar,NavigationBarTrigger,NavigationBarLink} from './navigation-bar';
import {NavigationPanel} from './navigation-panel';
import {NavigationChevron as Chevron} from './navigation-menu-icons';
import type {NavigationMenuItem,NavigationMenuProps} from './navigation-menu.types';
export type {NavigationMenuLink,NavigationMenuGroup,NavigationMenuItem,NavigationMenuProps} from './navigation-menu.types';

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
 const mobileNavigation=collapsible?<P.Root open={mobileOpen} onOpenChange={v=>{if(v){measure();setOpen(undefined);}setMobileOpen(v);}}><P.Trigger className="cs-navigation-mobile-toggle" aria-label={mobileOpen?mobileToggleLabels.close:mobileToggleLabels.open}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{mobileOpen?<path d="m6 6 12 12M6 18 18 6"/>:<path d="M4 6h16M4 12h16M4 18h16"/>}</svg></P.Trigger><P.Content sideOffset={0} align="end" collisionPadding={0} className="cs-navigation-mobile-panel" aria-label={label} onCloseAutoFocus={event=>{if(open)event.preventDefault();}}><div className="cs-navigation-mobile-items">{items.map(item=><MobileLinks key={item.id} item={item} navigate={navigate}/>)}</div>{actions&&<div className="cs-navigation-mobile-actions">{actions}</div>}</P.Content></P.Root>:undefined;
 const nav=<NavigationBar ref={root} style={{'--cs-navigation-available-height':`${available}px`} as CSSProperties} label={label} shape={shape} panelVariant={panelVariant} open={!!(open||mobileOpen)} className={className} brand={brand} actions={actions} mobileNavigation={mobileNavigation}>
  {items.map(item=>item.groups?.length||item.links?.length?<P.Root key={item.id} open={open===item.id} onOpenChange={v=>{if(v)measure();setOpen(current=>v?item.id:current===item.id?undefined:current);}}><P.Trigger asChild><NavigationBarTrigger data-menu={item.id}>{item.label}</NavigationBarTrigger></P.Trigger><P.Content sideOffset={0} align="start" collisionPadding={16} className={`cs-navigation-menu-panel cs-navigation-menu-panel--${item.layout??'columns'}`} data-menu={item.id} aria-label={`${item.label}导航`} onCloseAutoFocus={event=>{if(open&&open!==item.id)event.preventDefault();}}><NavigationPanel item={item} variant={panelVariant} onNavigate={navigate} activateOnHover={activateOnHover}/></P.Content></P.Root>:<NavigationBarLink key={item.id} href={item.href} onClick={()=>{setOpen(undefined);if(item.href)onNavigate?.(item.href);}}>{item.label}</NavigationBarLink>)}
 </NavigationBar>;
 return collapsible?<div className="cs-navigation-shell" ref={shell}>{nav}</div>:nav;
}
