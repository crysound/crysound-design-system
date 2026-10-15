import type { HTMLAttributes } from 'react';
export type ShadowLevel = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface ShadowProps extends HTMLAttributes<HTMLDivElement> { level?: ShadowLevel }
/** A surface with optional elevation; does not introduce interaction semantics. */
export function Shadow({ level = 'sm', className, ...props }: ShadowProps) {
  return <div {...props} className={['cs-shadow', className].filter(Boolean).join(' ')} data-shadow={level} />;
}
