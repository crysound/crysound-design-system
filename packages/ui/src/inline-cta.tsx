"use client";
import { useState, type ReactNode } from 'react';
import type { ShadowLevel } from './shadow';
import { Button } from './index';
export interface InlineCTAAction { label: string; onClick?: () => void; href?: string; disabled?: boolean; loading?: boolean }
export interface InlineCTAProps {
  shadow?: ShadowLevel;
  title: string; description?: ReactNode; icon?: ReactNode; media?: ReactNode; tone?: 'neutral'|'brand';
  primaryAction: InlineCTAAction; secondaryAction?: InlineCTAAction; dismissible?: boolean; onDismiss?: () => void;
}
export function InlineCTA({title,description,icon,media,tone='neutral',shadow,primaryAction,secondaryAction,dismissible=false,onDismiss}:InlineCTAProps) {
  const [dismissed,setDismissed]=useState(false);
  if(dismissed)return null;
  function action(item:InlineCTAAction,primary:boolean) {
    if(item.href&&!item.disabled&&!item.loading)return <a className={`cs-button cs-button--${primary?'primary':'secondary'}`} href={item.href} onClick={item.onClick}>{item.label}</a>;
    return <Button type="button" variant={primary?'primary':'secondary'} size="sm" disabled={item.disabled} loading={item.loading} onClick={item.onClick}>{item.label}</Button>;
  }
  return <aside data-shadow={shadow} className={`cs-inline-cta cs-inline-cta--${tone}${media ? ' cs-inline-cta--media' : ''}`} aria-label={title}>
    {media&&<div className="cs-inline-cta-media">{media}</div>}
    {icon&&<div className="cs-inline-cta-icon" aria-hidden="true">{icon}</div>}
    <div className="cs-inline-cta-content"><strong>{title}</strong>{description&&<div>{description}</div>}</div>
    <div className="cs-inline-cta-actions">{secondaryAction&&action(secondaryAction,false)}{action(primaryAction,true)}</div>
    {dismissible&&<button type="button" className="cs-inline-cta-close" aria-label={`关闭 ${title}`} onClick={()=>{setDismissed(true);onDismiss?.();}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>}
  </aside>;
}
