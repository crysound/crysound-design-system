"use client";
import type { ReactNode } from 'react';
import { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from './overlays';
export interface InstrumentDialogProps {
  trigger: ReactNode; title: string; description: string; children: ReactNode; actions?: ReactNode;
  open?: boolean; onOpenChange?: (open: boolean) => void; size?: 'sm' | 'md' | 'lg';
}
export function InstrumentDialog({trigger,title,description,children,actions,open,onOpenChange,size='md'}:InstrumentDialogProps) {
  return <DialogRoot open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className={`cs-instrument-dialog cs-instrument-dialog--${size}`}>
      <header className="cs-instrument-dialog-header"><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></header>
      <div className="cs-instrument-dialog-body">{children}</div>
      {actions && <footer className="cs-instrument-dialog-footer">{actions}</footer>}
      <DialogClose className="cs-instrument-dialog-close" aria-label="关闭弹窗"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></DialogClose>
    </DialogContent>
  </DialogRoot>;
}
