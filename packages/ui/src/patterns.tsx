"use client";
import { useRef, useState, type ReactNode } from 'react';
import { ChevronUp } from '@untitledui/icons';
import { Button, Input, Card, CardBody, CardActions, ToolbarButton } from './index';
import { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from './overlays';

export interface FilterToolbarProps {
  label: string; query: string; onQueryChange: (value: string) => void; onReset: () => void;
  placeholder?: string; filters?: ReactNode; actions?: ReactNode; disabled?: boolean;
}
export function FilterToolbar({label, query, onQueryChange, onReset, placeholder, filters, actions, disabled}: FilterToolbarProps) {
  return <div className="cs-filter-toolbar" role="group" aria-label={label}>
    <Input type="search" label="搜索" placeholder={placeholder} value={query} onChange={event => onQueryChange(event.target.value)} disabled={disabled}/>
    <div className="cs-filter-controls">{filters}<ToolbarButton disabled={disabled} onClick={onReset} iconStart={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/></svg>}>重置</ToolbarButton>{actions}</div>
  </div>;
}
export interface QuotaItem { id: string; label: string; remaining: number | null; reset?: string; }
export interface QuotaCardProps {
  title: string; description?: string; badge?: ReactNode; status?: ReactNode; quotas: QuotaItem[];
  state?: 'ready' | 'loading' | 'empty' | 'error'; error?: string; onRetry?: () => void; actions?: ReactNode;
}
export function QuotaCard({title, description, badge, status, quotas, state = 'ready', error, onRetry, actions}: QuotaCardProps) {
  return <Card title={title} description={description} actions={<div className="cs-pattern-meta">{badge}{status}</div>} className="cs-quota-card" aria-busy={state === 'loading'}>
    <CardBody>
      {state === 'loading' ? <p role="status">正在加载额度…</p> : state === 'error' ? <div><p role="alert">{error || '额度加载失败，请重试。'}</p>{onRetry && <ToolbarButton onClick={onRetry}>重试</ToolbarButton>}</div> : state === 'empty' || !quotas.length ? <p className="cs-muted">暂无额度数据</p> : quotas.map(item => {
        const value = item.remaining !== null && Number.isFinite(item.remaining) ? Math.max(0, Math.min(100, item.remaining)) : null;
        return <div className="cs-quota-item" key={item.id}><div><span>{item.label}</span><strong>{value === null ? '暂不可用' : `${value}%`}</strong></div>{value !== null && <progress aria-label={item.label} value={value} max={100}/>} {item.reset && <p>{item.reset}</p>}</div>;
      })}
    </CardBody>
    {actions && <CardActions>{actions}</CardActions>}
  </Card>;
}
export interface DetailField { id: string; label: string; value: ReactNode; }
export interface DetailPanelProps {
  title: string; description?: string; status?: ReactNode; fields: DetailField[]; actions?: ReactNode;
  variant?: 'card' | 'website';
  /** Initial expansion of the website variant. */
  defaultOpen?: boolean;
}
export function DetailPanel({title, description, status, fields, actions, variant='card', defaultOpen=true}: DetailPanelProps) {
  const [open,setOpen]=useState(defaultOpen);
  const content=fields.length ? <dl className="cs-detail-fields">{fields.map(field => <div key={field.id}><dt>{field.label}</dt><dd>{field.value ?? '—'}</dd></div>)}</dl> : <p className="cs-muted">暂无详情</p>;
  if(variant==='website')return <details className="cs-detail-panel--website" open={open} onToggle={event=>setOpen(event.currentTarget.open)}>
    <summary className="cs-detail-website-summary"><ChevronUp className="cs-detail-website-chevron" size={20} aria-hidden="true"/><h3 className="cs-detail-website-title">{title}</h3></summary>
    <div className="cs-detail-website-body">
      {(description||status)&&<div className="cs-detail-website-meta">{description&&<p>{description}</p>}{status&&<div>{status}</div>}</div>}
      {content}
      {actions&&<div className="cs-detail-website-actions">{actions}</div>}
    </div>
  </details>;
  return <Card title={title} description={description} actions={status}><CardBody>{content}</CardBody>{actions && <CardActions>{actions}</CardActions>}</Card>;
}
export interface FormDialogProps {
  title: string; description: string; trigger: ReactNode; children: ReactNode;
  onSubmit: (data: FormData) => void | Promise<void>; submitLabel?: string;
}
/** Validation belongs to native fields or the consumer; no API or business rules are embedded. */
export function FormDialog({title, description, trigger, children, onSubmit, submitLabel = '保存'}: FormDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(0);
  function changeOpen(next: boolean) { request.current++; setOpen(next); setPending(false); setError(''); }
  return <DialogRoot open={open} onOpenChange={changeOpen}><DialogTrigger asChild>{trigger}</DialogTrigger><DialogContent>
    <DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription>
    <form className="cs-form-dialog" aria-busy={pending} onSubmit={async event => {
      event.preventDefault(); if (pending) return;
      const data = new FormData(event.currentTarget); const attempt = ++request.current;
      setPending(true); setError('');
      try { await onSubmit(data); if (request.current === attempt) changeOpen(false); }
      catch (reason) { if (request.current === attempt) setError(reason instanceof Error ? reason.message : '保存失败，请重试。'); }
      finally { if (request.current === attempt) setPending(false); }
    }}>
      <fieldset disabled={pending}>{children}</fieldset>
      {pending && <p role="status">正在保存…</p>}{error && <p className="cs-error" role="alert">{error}</p>}
      <div className="cs-form-dialog-actions"><Button variant="secondary" onClick={() => changeOpen(false)}>取消</Button><Button type="submit" loading={pending}>{submitLabel}</Button></div>
    </form>
  </DialogContent></DialogRoot>;
}
