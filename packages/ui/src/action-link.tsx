import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
export type ActionLinkSize = 'md' | 'lg';
export interface ActionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** External navigation uses a distinct diagonal arrow. */
  external?: boolean;
  arrow?: boolean;
  /** md: regular 14px text; lg: 16px website text. */
  size?: ActionLinkSize;
}
/** Consistent text action with an opt-in SVG navigation cue. */
export const ActionLink = forwardRef<HTMLAnchorElement, ActionLinkProps>(function ActionLink(
  { external = false, arrow = true, size = 'md', children, className, target, rel, ...props }, ref,
) {
  return <a {...props} ref={ref} className={['cs-action-link', `cs-action-link--${size}`, className].filter(Boolean).join(' ')} target={target ?? (external ? '_blank' : undefined)} rel={rel ?? (external || target === '_blank' ? 'noopener noreferrer' : undefined)}>
    <span>{children}</span>
    {arrow && <svg className="cs-action-link-arrow" data-external={external || undefined} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={external ? 'M7 17 17 7M7 7h10v10' : 'M5 12h14m-5-5 5 5-5 5'} />
    </svg>}
  </a>;
});

/** Button semantics for actions such as opening a dialog, sharing ActionLink motion. */
export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional visual cue; does not change button semantics. */
  arrow?: 'right' | 'up-right';
  /** md: regular 14px text; lg: 16px website text. */
  size?: ActionLinkSize;
}
export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
 {children,className,type='button',arrow,size='md',...props},ref,
){return <button {...props} ref={ref} type={type} className={['cs-action-link',`cs-action-link--${size}`,'cs-action-button',className].filter(Boolean).join(' ')}>
  <span>{children}</span>
  {arrow && <svg className="cs-action-link-arrow" data-external={arrow === 'up-right' || undefined} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={arrow === 'up-right' ? 'M7 17 17 7M7 7h10v10' : 'M5 12h14m-5-5 5 5-5 5'} />
  </svg>}
</button>;});
