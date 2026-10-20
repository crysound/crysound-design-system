"use client";
export interface LoadingIndicatorProps {
  variant?: 'spinner' | 'ring' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showLabel?: boolean;
  tone?: 'brand' | 'neutral';
  animate?: boolean;
}
export function LoadingIndicator({variant='spinner',size='md',label='正在加载…',showLabel=true,tone='brand',animate=true}:LoadingIndicatorProps) {
  return <div className={`cs-loading-indicator cs-loading-indicator--${variant} cs-loading-indicator--${size} cs-loading-indicator--${tone}`} data-animate={animate} role="status" aria-live="polite" aria-atomic="true">
    {variant==='pulse'?<span className="cs-loading-pulse" aria-hidden="true"><span/><i/></span>:variant==='dots'?<span className="cs-loading-dots" aria-hidden="true"><i/><i/><i/></span>:<svg className="cs-loading-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">{variant==='ring'?<><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity=".18"/><path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>:Array.from({length:12},(_,i)=><path key={i} d="M12 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i*30} 12 12)`} opacity={(i+1)/12}/>)}</svg>}
    <span className={showLabel?'cs-loading-label':'cs-sr-only'}>{label}</span>
  </div>;
}
