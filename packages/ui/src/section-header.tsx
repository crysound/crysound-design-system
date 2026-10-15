import { useId, type ReactNode } from 'react';
export interface SectionHeaderProps {
  title: string; description?: ReactNode; eyebrow?: string; icon?: ReactNode;
  badge?: ReactNode; actions?: ReactNode; children?: ReactNode;
  level?: 2|3|4; divider?: boolean; size?: 'sm'|'md'|'lg';
}
export function SectionHeader({title,description,eyebrow,icon,badge,actions,children,level=2,divider=true,size='md'}:SectionHeaderProps) {
  const id=useId();const Heading=`h${level}` as 'h2'|'h3'|'h4';
  return <header className={`cs-section-header cs-section-header--${size}`} data-divider={divider||undefined} aria-labelledby={id}>
    <div className="cs-section-header-main">
      {icon&&<div className="cs-section-header-icon" aria-hidden="true">{icon}</div>}
      <div className="cs-section-header-copy">{eyebrow&&<span className="cs-section-header-eyebrow">{eyebrow}</span>}<div className="cs-section-header-title"><Heading id={id}>{title}</Heading>{badge}</div>{description&&<div className="cs-section-header-description">{description}</div>}</div>
      {actions&&<div className="cs-section-header-actions">{actions}</div>}
    </div>
    {children&&<div className="cs-section-header-content">{children}</div>}
  </header>;
}
