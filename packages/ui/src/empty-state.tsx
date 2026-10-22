"use client";
import {useId,type HTMLAttributes,type ReactNode} from 'react';
import {cx} from './utils';
import {EmptyStateParticles} from './empty-state-particles';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLElement>,'title'|'children'> {
  title:string;
  description?:ReactNode;
  layout?:'page'|'section';
  tone?:'neutral'|'brand';
  headingLevel?:1|2|3;
  logo?:ReactNode;
  icon?:ReactNode;
  illustration?:ReactNode;
  /** Optional built-in sound surface. A custom illustration takes precedence. */
  graphic?:'particles';
  /** Motion for the built-in graphic; reduced-motion preferences take precedence. */
  animated?:boolean;
  action?:ReactNode;
  footer?:ReactNode;
}

/** A presentational empty state; fetching, recovery and creation stay in the app. */
export function EmptyState({title,description,layout='section',tone='neutral',headingLevel,logo,icon,illustration,graphic,animated=true,action,footer,className,...props}:EmptyStateProps){
  const generated=useId();
  const titleId=`${generated}-title`;
  const descriptionId=description?`${generated}-description`:undefined;
  const Heading=headingLevel===1?'h1':headingLevel===3||(!headingLevel&&layout==='section')?'h3':'h2';
  return <section {...props} className={cx('cs-empty','cs-empty-state',className)} data-layout={layout} data-tone={tone} aria-labelledby={props['aria-labelledby']??(props['aria-label']?undefined:titleId)} aria-describedby={props['aria-describedby']??descriptionId}>
    {logo&&<header className="cs-empty-state-brand">{logo}</header>}
    <div className="cs-empty-state-body"><div className="cs-empty-state-copy">
      {illustration?<div className="cs-empty-state-art" aria-hidden="true" inert>{illustration}</div>:graphic==='particles'&&<EmptyStateParticles animated={animated}/>}
      {icon!=null&&<div className="cs-empty-state-icon" aria-hidden="true" inert>{icon}</div>}
      <Heading id={titleId}>{title}</Heading>
      {description&&<div className="cs-empty-state-description" id={descriptionId}>{description}</div>}
      {action&&<div className="cs-empty-state-actions">{action}</div>}
    </div></div>
    {footer&&<footer className="cs-empty-state-footer">{footer}</footer>}
  </section>;
}
