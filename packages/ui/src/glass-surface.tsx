"use client";
import type { ComponentProps } from 'react';
import { cx } from './utils';
export interface GlassSurfaceProps extends ComponentProps<'div'> {
  weight?: 'light' | 'regular' | 'thick';
  opaque?: boolean;
}
/** Visual material only; does not supply dialog, focus or overlay behavior. */
export function GlassSurface({weight = 'regular', opaque = false, className, ...props}: GlassSurfaceProps) {
  return <div {...props} data-opaque={opaque || undefined} className={cx('cs-glass', `cs-glass--${weight}`, className)} />;
}
