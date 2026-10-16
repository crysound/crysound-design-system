"use client";
import type { ComponentProps, HTMLAttributes } from 'react';
import { cx } from './utils';
export type HeadingVariant = 'page' | 'section' | 'subsection';
export interface HeadingProps extends ComponentProps<'h2'> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: HeadingVariant;
}
/** HTML hierarchy and visual size are independent. */
export function Heading({level, variant = level === 1 ? 'page' : level === 2 ? 'section' : 'subsection', className, ...props}: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return <Tag {...props} className={cx('cs-heading', `cs-heading--${variant}`, className)} />;
}
export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div';
  variant?: 'body' | 'lead' | 'caption' | 'label';
  tone?: 'default' | 'muted';
}
export function Text({as: Tag = 'p', variant = 'body', tone = 'default', className, ...props}: TextProps) {
  return <Tag {...props} className={cx('cs-text', `cs-text--${variant}`, tone === 'muted' && 'cs-text--muted', className)} />;
}
