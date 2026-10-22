"use client";
import {useId,type HTMLAttributes,type ReactNode} from 'react';
import {CrysoundMark} from './brand-mark';
import {cx} from './utils';

export interface EmptyPageProps extends Omit<HTMLAttributes<HTMLElement>,'title'|'children'> {
  title:string;
  description?:ReactNode;
  layout?:'page'|'section';
  tone?:'neutral'|'brand';
  headingLevel?:1|2|3;
  logo?:ReactNode;
  icon?:ReactNode;
  illustration?:ReactNode;
  action?:ReactNode;
  footer?:ReactNode;
}

/** A presentational empty page; fetching, recovery and creation stay in the app. */
export function EmptyPage({title,description,layout='page',tone='neutral',headingLevel,logo,icon,illustration,action,footer,className,...props}:EmptyPageProps){
  const generated=useId();
  const titleId=`${generated}-title`;
  const descriptionId=description?`${generated}-description`:undefined;
  const Heading=headingLevel===1?'h1':headingLevel===3||(!headingLevel&&layout==='section')?'h3':'h2';
  return <section {...props} className={cx('cs-empty-page',className)} data-layout={layout} data-tone={tone} aria-labelledby={props['aria-labelledby']??(props['aria-label']?undefined:titleId)} aria-describedby={props['aria-describedby']??descriptionId}>
    {illustration&&<div className="cs-empty-page-art" aria-hidden="true" inert>{illustration}</div>}
    {logo&&<header className="cs-empty-page-brand">{logo}</header>}
    <div className="cs-empty-page-body"><div className="cs-empty-page-copy">
      {icon!==null&&<div className="cs-empty-page-icon" aria-hidden="true" inert>{icon??<CrysoundMark className="cs-empty-page-mark"/>}</div>}
      <Heading id={titleId}>{title}</Heading>
      {description&&<div className="cs-empty-page-description" id={descriptionId}>{description}</div>}
      {action&&<div className="cs-empty-page-actions">{action}</div>}
    </div></div>
    {footer&&<footer className="cs-empty-page-footer">{footer}</footer>}
  </section>;
}
