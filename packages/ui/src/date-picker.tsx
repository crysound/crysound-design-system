"use client";
import { useId, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
export interface DatePickerProps {
  label: string; value?: string; defaultValue?: string; onChange?: (value:string)=>void;
  min?: string; max?: string; disabled?: boolean; error?: string; placeholder?: string;
}
function parse(value?:string) { if(!value||!/^\d{4}-\d{2}-\d{2}$/.test(value))return undefined;const [y,m,d]=value.split('-').map(Number);const date=new Date(y,m-1,d,12);return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d?date:undefined; }
function iso(date:Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function DatePicker({label,value,defaultValue='',onChange,min,max,disabled,error,placeholder='选择日期'}:DatePickerProps) {
  const [internal,setInternal]=useState(defaultValue);const selected=value??internal;
  const today=iso(new Date());const initial=parse(selected)??new Date();
  const [month,setMonth]=useState(new Date(initial.getFullYear(),initial.getMonth(),1,12));
  const [open,setOpen]=useState(false);const id=useId();const grid=useRef<HTMLDivElement>(null);const focusDate=useRef<string | undefined>(undefined);
  const first=new Date(month.getFullYear(),month.getMonth(),1,12);const start=new Date(first);start.setDate(1-(first.getDay()+6)%7);
  const days=Array.from({length:42},(_,i)=>{const date=new Date(start);date.setDate(start.getDate()+i);return date;});
  const allowed=(day:string)=>(!min||day>=min)&&(!max||day<=max);
  function choose(day:string){if(disabled||!allowed(day))return;setInternal(day);onChange?.(day);setOpen(false);}
  function moveFocus(date:Date) { const day=iso(date);if(!allowed(day))return;focusDate.current=day;setMonth(new Date(date.getFullYear(),date.getMonth(),1,12));requestAnimationFrame(()=>grid.current?.querySelector<HTMLButtonElement>(`[data-date="${day}"]`)?.focus()); }
  const icon=(path:string)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path}/></svg>;
  return <div className="cs-field cs-date-field"><label id={id}>{label}</label><Popover.Root open={open} onOpenChange={next=>{setOpen(next);if(next){const date=parse(selected)??new Date();setMonth(new Date(date.getFullYear(),date.getMonth(),1,12));}}}><Popover.Trigger disabled={disabled} aria-labelledby={id} aria-invalid={!!error} aria-describedby={error?`${id}-error`:undefined} className="cs-date-trigger">{icon('M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z')}<span data-placeholder={!selected||undefined}>{parse(selected)?selected:placeholder}</span>{icon('m6 9 6 6 6-6')}</Popover.Trigger><Popover.Portal><Popover.Content className="cs-date-popover" align="start" sideOffset={8} collisionPadding={12} onOpenAutoFocus={event=>{event.preventDefault();requestAnimationFrame(()=>{const target=grid.current?.querySelector<HTMLButtonElement>(`[data-date="${selected||today}"]:not(:disabled)`);(target??grid.current?.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus();});}}>
    <div className="cs-date-header"><button type="button" aria-label="上个月" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1,12))}>{icon('m15 18-6-6 6-6')}</button><strong aria-live="polite">{month.getFullYear()}年 {month.getMonth()+1}月</strong><button type="button" aria-label="下个月" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1,12))}>{icon('m9 6 6 6-6 6')}</button></div>
    <div className="cs-date-weekdays" aria-hidden="true">{['一','二','三','四','五','六','日'].map(d=><span key={d}>{d}</span>)}</div>
    <div className="cs-date-grid" ref={grid} role="group" aria-label="选择日期">{days.map(date=>{const day=iso(date);return <button type="button" key={day} data-date={day} data-outside={date.getMonth()!==month.getMonth()||undefined} data-today={day===today||undefined} aria-label={day} aria-pressed={day===selected} disabled={!allowed(day)} tabIndex={day===(focusDate.current||(selected||today))?0:-1} onClick={()=>choose(day)} onKeyDown={event=>{let delta=0;if(event.key==='ArrowLeft')delta=-1;if(event.key==='ArrowRight')delta=1;if(event.key==='ArrowUp')delta=-7;if(event.key==='ArrowDown')delta=7;if(event.key==='Home')delta=-(date.getDay()+6)%7;if(event.key==='End')delta=6-(date.getDay()+6)%7;if(delta||['Home','End'].includes(event.key)){event.preventDefault();const next=new Date(date);next.setDate(date.getDate()+delta);moveFocus(next);}if(event.key==='PageUp'||event.key==='PageDown'){event.preventDefault();moveFocus(new Date(date.getFullYear(),date.getMonth()+(event.key==='PageUp'?-1:1),1,12));}}}>{date.getDate()}</button>;})}</div>
    <div className="cs-date-footer"><button type="button" disabled={!allowed(today)} onClick={()=>choose(today)}>今天</button><button type="button" onClick={()=>{setInternal('');onChange?.('');setOpen(false);}}>清空</button></div>
  </Popover.Content></Popover.Portal></Popover.Root>{error&&<span id={`${id}-error`} className="cs-error">{error}</span>}</div>;
}
