import { forwardRef, type AnchorHTMLAttributes } from 'react';
export interface ActionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** External navigation uses a distinct diagonal arrow. */
  external?: boolean;
  arrow?: boolean;
}
/** Consistent text action with an opt-in SVG navigation cue. */
export const ActionLink = forwardRef<HTMLAnchorElement, ActionLinkProps>(function ActionLink(
  { external = false, arrow = true, children, className, target, rel, ...props }, ref,
) {
  return <a {...props} ref={ref} className={['cs-action-link', className].filter(Boolean).join(' ')} target={target ?? (external ? '_blank' : undefined)} rel={rel ?? (external || target === '_blank' ? 'noopener noreferrer' : undefined)}>
    <span>{children}</span>
    {arrow && <svg className="cs-action-link-arrow" data-external={external || undefined} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={external ? 'M7 17 17 7M7 7h10v10' : 'M5 12h14m-5-5 5 5-5 5'} />
    </svg>}
  </a>;
});
