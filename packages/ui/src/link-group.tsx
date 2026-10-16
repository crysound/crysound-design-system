"use client";
import { useId, type AnchorHTMLAttributes, type ComponentProps, type ReactNode } from 'react';
import { cx } from './utils';
export interface LinkGroupItem extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  label: ReactNode;
  href: string;
}
export interface LinkGroupProps extends Omit<ComponentProps<'nav'>, 'children'> {
  label: string;
  items: LinkGroupItem[];
}
/** A locally scoped navigation group for website footers and link directories. */
export function LinkGroup({label, items, className, ...props}: LinkGroupProps) {
  const id = useId();
  return <nav {...props} aria-labelledby={id} className={cx('cs-link-group', className)}>
    <p id={id} className="cs-link-group-title">{label}</p>
    <ul className="cs-link-group-list">{items.map(({label: text, className: linkClass, rel, target, href, ...link}, index) => <li key={`${href}-${index}`}>
      <a {...link} href={href} target={target} rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)} className={cx('cs-link-group-link', linkClass)}>{text}</a>
    </li>)}</ul>
  </nav>;
}
