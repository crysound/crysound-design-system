import {forwardRef,type ReactNode} from 'react';
import {Button,type ButtonProps} from './index';
import {Tooltip} from './overlays';
export interface IconButtonProps extends Omit<ButtonProps,'children'|'iconStart'|'iconEnd'|'aria-label'> {
 label:string;
 children:ReactNode;
 tooltip?:boolean;
}
export const IconButton=forwardRef<HTMLButtonElement,IconButtonProps>(function IconButton({label,children,tooltip=true,variant="ghost",className,...props},ref){
 const button=<Button {...props} variant={variant} ref={ref} aria-label={label} className={['cs-icon-button',className].filter(Boolean).join(' ')}><span aria-hidden="true" className="cs-icon-button-glyph">{children}</span></Button>;
 return tooltip?<Tooltip content={label}>{button}</Tooltip>:button;
});
