"use client";
import {createContext,useContext,useEffect,useRef,useState,type ComponentProps,type CSSProperties,type ReactNode} from 'react';
import {NavigationChevron} from './navigation-menu-icons';
import {cx} from './utils';

const ShapeContext=createContext<'rounded'|'capsule'>('rounded');
export interface NavigationBarProps extends ComponentProps<'nav'> {
 label?:string;
 shape?:'rounded'|'capsule';
 panelVariant?:'default'|'website';
 brand?:ReactNode;
 actions?:ReactNode;
 open?:boolean;
 /** NavigationMenu supplies its mobile disclosure through this slot. */
 mobileNavigation?:ReactNode;
}
/** Primary navigation chrome. Its controls and expanded state are supplied by the caller. */
export function NavigationBar({label='主导航',shape='rounded',panelVariant='default',brand,actions,open=false,mobileNavigation,children,className,...props}:NavigationBarProps) {
 return <ShapeContext.Provider value={shape}><nav {...props} aria-label={props['aria-label']??label} data-shape={shape} data-panel-variant={panelVariant} data-open={open||undefined} className={cx('cs-navigation-menu',className)}>
  {brand&&<div className="cs-navigation-menu-brand">{brand}</div>}
  <div className="cs-navigation-menu-items">{children}</div>
  {actions&&<div className="cs-navigation-menu-actions">{actions}</div>}
  {mobileNavigation}
 </nav></ShapeContext.Provider>;
}
export type NavigationBarTriggerProps=ComponentProps<'button'>;
/** Native disclosure button, also used as the Radix trigger inside NavigationMenu. */
export function NavigationBarTrigger({children,className,style,onPointerDown,onClick,type='button',...props}:NavigationBarTriggerProps) {
 const motion=useContext(ShapeContext)==='capsule';
 const sequence=useRef(0);const [feedback,setFeedback]=useState({x:'50%',y:'50%',pulse:0});
 useEffect(()=>{if(!motion)setFeedback(current=>current.pulse?{...current,pulse:0}:current);},[motion]);
 const press=(button:HTMLButtonElement,clientX?:number,clientY?:number)=>{
  if(!motion||button.disabled)return;
  const bounds=button.getBoundingClientRect();
  const percent=(point:number|undefined,start:number,length:number)=>point===undefined||!length?'50%':`${Math.max(0,Math.min(100,(point-start)/length*100))}%`;
  setFeedback({x:percent(clientX,bounds.left,bounds.width),y:percent(clientY,bounds.top,bounds.height),pulse:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?0:++sequence.current});
 };
 return <button {...props} type={type} className={cx('cs-navigation-menu-trigger',className)} data-state={props['aria-expanded']===true||props['aria-expanded']==='true'?'open':'closed'} data-click-motion={motion||undefined} style={{...(motion?{'--cs-navigation-click-x':feedback.x,'--cs-navigation-click-y':feedback.y}:{}),...style} as CSSProperties} onPointerDown={event=>{onPointerDown?.(event);if(!event.defaultPrevented&&event.button===0)press(event.currentTarget,event.clientX,event.clientY);}} onClick={event=>{if(event.detail===0)press(event.currentTarget);onClick?.(event);}}>
  <span>{children}</span><NavigationChevron/>
  {motion&&feedback.pulse>0&&<span key={feedback.pulse} className="cs-navigation-click-pulse" aria-hidden="true" onAnimationEnd={event=>{if(event.animationName==='cs-navigation-click-pulse'){const pulse=feedback.pulse;setFeedback(current=>current.pulse===pulse?{...current,pulse:0}:current);}}}/>}
 </button>;
}
export type NavigationBarLinkProps=ComponentProps<'a'> & {tone?:'default'|'subtle'};
export function NavigationBarLink({className,tone='default',...props}:NavigationBarLinkProps) {
 return <a {...props} data-tone={tone} className={cx('cs-navigation-menu-link',className)}/>;
}
