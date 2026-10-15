"use client";
import { Children, cloneElement, isValidElement, type CSSProperties, type ReactNode } from 'react';

/** Shared character reveal. Screen readers receive the unchanged complete text. */
export function TextReveal({ text }: { text: string }) {
  return <span className="cs-text-reveal"><span className="cs-sr-only">{text}</span><span aria-hidden="true">{Array.from(text).map((character, index) => <span className="cs-text-reveal-character" key={index} style={{ '--cs-character-delay': `${index * 90}ms` } as CSSProperties}>{character}</span>)}</span></span>;
}

export function revealText(children: ReactNode): ReactNode {
  return Children.map(children, child => {
    if (typeof child === 'string' && child.trim()) return <TextReveal text={child} />;
    if (!isValidElement<{ children?: ReactNode }>(child) || typeof child.type !== 'string' || ['h1','h2','h3','h4','h5','h6','input','textarea','select','code','pre','svg','button'].includes(child.type)) return child;
    return cloneElement(child, {}, revealText(child.props.children));
  });
}
