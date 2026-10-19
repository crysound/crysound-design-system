import {useRef,type HTMLAttributes} from 'react';
export interface CarouselPaginationProps extends Omit<HTMLAttributes<HTMLDivElement>,'onChange'> {
 count:number;
 value:number;
 onValueChange:(value:number)=>void;
 labels?:readonly string[];
 controls?:string;
 disabled?:boolean;
}
/** Controlled, zero-based navigation for a consumer-owned carousel. */
export function CarouselPagination({count,value,onValueChange,labels,controls,disabled=false,className,...props}:CarouselPaginationProps){
 const refs=useRef<(HTMLButtonElement|null)[]>([]);
 const length=Number.isFinite(count)?Math.max(0,Math.floor(count)):0;
 if(!length)return null;
 const current=Math.max(0,Math.min(length-1,Number.isFinite(value)?Math.floor(value):0));
 return <div {...props} role="group" aria-label={props['aria-label']??'轮播分页'} className={['cs-carousel-pagination',className].filter(Boolean).join(' ')}>{Array.from({length},(_,i)=><button key={i} ref={el=>{refs.current[i]=el;}} type="button" className="cs-carousel-pagination-item" aria-label={labels?.[i]??`第 ${i+1} 张`} aria-current={i===current?'true':undefined} aria-controls={controls} disabled={disabled} tabIndex={i===current?0:-1} onClick={()=>{if(i!==current)onValueChange(i);}} onKeyDown={e=>{let next:number;if(e.key==='ArrowRight')next=(i+1)%length;else if(e.key==='ArrowLeft')next=(i-1+length)%length;else if(e.key==='Home')next=0;else if(e.key==='End')next=length-1;else return;e.preventDefault();refs.current[next]?.focus();if(next!==current)onValueChange(next);}}><span aria-hidden="true"/></button>)}</div>;
}
