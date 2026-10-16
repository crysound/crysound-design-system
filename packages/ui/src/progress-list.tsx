import {useId, type ReactNode} from 'react';
export interface ProgressListItem {
  id: string; title: string; description?: string; progress: number | null;
  progressLabel?: string; date?: string; status?: string; disabled?: boolean; details?: ReactNode;
}
export interface ProgressListProps {
  title: string; items: ProgressListItem[]; notice?: string; overallProgress?: number | null;
  state?: 'ready' | 'loading' | 'error'; error?: string; onRetry?: () => void;
}
function Reading({value, label, name}: {value: number | null; label?: string; name: string}) {
  const known = value !== null && Number.isFinite(value);
  const percent = known ? Math.min(100, Math.max(0, value)) : null;
  return <span className="cs-progress-list-reading">{percent !== null && <progress aria-label={name} max={100} value={percent}/>}<span>{label || (percent === null ? '暂无数据' : `${Math.round(percent)}%`)}</span></span>;
}
/** Consumer supplies dates, totals and status semantics; unknown progress never becomes zero. */
export function ProgressList({title, items, notice, overallProgress, state='ready', error, onRetry}: ProgressListProps) {
  const heading = useId();
  const row = (item: ProgressListItem) => <><span className="cs-progress-list-task"><span className="cs-progress-list-name">{item.title}</span>{item.description && <span className="cs-progress-list-description">{item.description}</span>}</span><Reading value={item.progress} label={item.progressLabel} name={`${item.title}完成度`}/><span className="cs-progress-list-meta">{item.date || '—'}{item.status && <span>{item.status}</span>}</span><span className="cs-progress-list-chevron" aria-hidden="true">{item.details && <svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5"/></svg>}</span></>;
  return <section className="cs-progress-list" aria-labelledby={heading} aria-busy={state==='loading'}>
    <header className="cs-progress-list-header"><h3 id={heading}>{title}</h3>{overallProgress !== undefined && <Reading value={overallProgress} name="总完成度"/>}</header>
    {notice && <p className="cs-progress-list-notice">{notice}</p>}
    {state==='loading' ? <p role="status">正在加载进度…</p> : state==='error' ? <div role="alert"><p>{error || '进度加载失败'}</p>{onRetry && <button className="cs-button" onClick={onRetry}>重试</button>}</div> : !items.length ? <p className="cs-progress-list-notice">暂无任务</p> : <ul>{items.map(item => <li key={item.id}>{item.details && !item.disabled ? <details><summary className="cs-progress-list-row">{row(item)}</summary><div className="cs-progress-list-details">{item.details}</div></details> : <div className="cs-progress-list-row" aria-disabled={item.disabled || undefined}>{row({...item,details:undefined})}</div>}</li>)}</ul>}
  </section>;
}
