import {useState,type ReactNode} from 'react';
import * as P from '@radix-ui/react-popover';
export interface NavigationMenuLink { label:string;href:string;description?:string; }
export interface NavigationMenuGroup {title:string;links:NavigationMenuLink[];}
export interface NavigationMenuItem {id:string;label:string;href?:string;groups?:NavigationMenuGroup[];featured?:ReactNode;}
export interface NavigationMenuProps {items:NavigationMenuItem[];label?:string;className?:string;onNavigate?:(href:string)=>void;}
/** Multi-column website navigation. Radix owns dismissal and focus restoration. */
export function NavigationMenu({items,label='主导航',className,onNavigate}:NavigationMenuProps){
 const [open,setOpen]=useState<string>();
 return <nav aria-label={label} className={['cs-navigation-menu',className].filter(Boolean).join(' ')}>{items.map(item=>item.groups?.length?<P.Root key={item.id} open={open===item.id} onOpenChange={v=>setOpen(v?item.id:undefined)}><P.Trigger className="cs-navigation-menu-trigger">{item.label}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></P.Trigger><P.Content sideOffset={8} align="start" collisionPadding={16} className="cs-navigation-menu-panel" aria-label={`${item.label}导航`}><div className="cs-navigation-menu-columns">{item.groups.map(group=><section key={group.title}><h3>{group.title}</h3><ul>{group.links.map(link=><li key={`${link.href}-${link.label}`}><a href={link.href} onClick={()=>{setOpen(undefined);onNavigate?.(link.href);}}><span>{link.label}</span>{link.description&&<small>{link.description}</small>}</a></li>)}</ul></section>)}{item.featured&&<aside className="cs-navigation-menu-featured">{item.featured}</aside>}</div></P.Content></P.Root>:<a className="cs-navigation-menu-link" key={item.id} href={item.href} onClick={()=>{setOpen(undefined);if(item.href)onNavigate?.(item.href);}}>{item.label}</a>)}</nav>;
}
