import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from './utils';
export interface ResourceCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title' | 'children'> {
  href: string; title: ReactNode; source: string; external?: boolean;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}
/** Entire card is one native link; never nest buttons or secondary links inside it. */
export function ResourceCard({title, source, external = false, headingLevel = 3, className, target, rel, ...props}: ResourceCardProps) {
  const Heading = `h${headingLevel}` as 'h2'|'h3'|'h4'|'h5'|'h6';
  return <a {...props} className={cx('cs-resource-card',className)} target={target ?? (external ? '_blank' : undefined)} rel={rel ?? (external || target === '_blank' ? 'noopener noreferrer' : undefined)}>
    <Heading className="cs-resource-card-title">{title}</Heading>
    <span className="cs-resource-card-source"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={external ? 'M14 3h7v7M21 3 10 14M10 3H3v18h18v-7' : 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2'}/></svg>{source}{external && <span className="cs-sr-only">（新窗口打开）</span>}</span>
  </a>;
}
export interface ResourceCardGroupProps extends HTMLAttributes<HTMLElement> { label: string; }
export function ResourceCardGroup({label,className,...props}: ResourceCardGroupProps) {
  return <nav {...props} aria-label={label} className={cx('cs-resource-card-group',className)}/>;
}
