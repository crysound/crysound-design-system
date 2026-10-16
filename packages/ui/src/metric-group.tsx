import type { CSSProperties } from 'react';
export interface MetricGroupItem {
  id: string; label: string; value: number | string | null; unit?: string; note?: string; status?: {label: string; tone: 'neutral' | 'warning' | 'danger'};
}
export interface MetricGroupProps {
  label: string; items: MetricGroupItem[]; density?: 'standard' | 'compact'; variant?: 'metrics' | 'summary';
  className?: string; style?: CSSProperties;
}
/** One summary surface, consistent value/unit baselines, no implicit business thresholds. */
export function MetricGroup({label, items, density = 'standard', variant = 'metrics', className, style}: MetricGroupProps) {
  return <section aria-label={label} className={['cs-metric-group',className].filter(Boolean).join(' ')} data-density={density} data-variant={variant} style={{...style, '--cs-metric-columns': Math.max(1,Math.min(items.length,5)), '--cs-metric-columns-medium': Math.max(1,Math.min(items.length,3)), '--cs-metric-columns-small': Math.max(1,Math.min(items.length,2))} as CSSProperties}>
    {items.length ? <dl className="cs-metric-group-grid">{items.map(item => {
      const known = item.value !== null && (typeof item.value !== 'number' || Number.isFinite(item.value));
      return <div key={item.id} className="cs-metric-group-item"><dt>{item.label}{item.status && <span className="cs-metric-group-status" data-tone={item.status.tone}><span aria-hidden="true"/>{item.status.label}</span>}</dt><dd><div className="cs-metric-group-reading"><span>{known ? item.value : '—'}</span>{known && item.unit && <span className="cs-metric-group-unit">{item.unit}</span>}</div><p className="cs-metric-group-note">{item.note || (known ? '\u00a0' : '暂无数据')}</p></dd></div>;
    })}</dl> : <p className="cs-metric-group-empty">暂无指标</p>}
  </section>;
}
