"use client";
import type { ReactNode } from 'react';

/** Compatibility export: text is always immediately readable, without reveal effects. */
export function TextReveal({ text }: { text: string }) {
  return <span className="cs-text-reveal">{text}</span>;
}
export function revealText(children: ReactNode): ReactNode {
  return children;
}
