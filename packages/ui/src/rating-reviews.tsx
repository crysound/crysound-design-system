"use client";
import { useEffect, useId, useState, type ReactNode } from 'react';
import { Check } from '@untitledui/icons';
import { Avatar } from './avatar';
import { Rating } from './rating';
import { RatingStar } from './rating-star';
import { cx } from './utils';

export type ReviewScore = 1 | 2 | 3 | 4 | 5;
export interface RatingReview {
  id: string;
  name: string;
  initials?: string;
  role?: string;
  date: string;
  dateTime?: string;
  score: ReviewScore;
  content: ReactNode;
  /** Verification is supplied by the consuming application. */
  verified?: boolean;
}
export interface RatingReviewsProps {
  reviews: readonly RatingReview[];
  labels?: Partial<{ overview: string; reviews: string; all: string; verified: string; empty: string }>;
  className?: string;
}

/** In-memory review composition; the application supplies review content and verification. */
export function RatingReviews({ reviews, labels, className }: RatingReviewsProps) {
  const heading = useId();
  const list = useId();
  const [filter, setFilter] = useState<ReviewScore | null>(null);
  const text = { overview:'Rating Overview', reviews:'Reviews', all:'All', verified:'Verified review', empty:'No reviews yet.', ...labels };
  const visible = filter === null ? reviews : reviews.filter(review => review.score === filter);
  useEffect(() => {
    if (filter !== null && !reviews.some(review => review.score === filter)) setFilter(null);
  }, [reviews, filter]);

  return <section className={cx('cs-rating-reviews', className)} aria-labelledby={heading}>
    <div className="cs-rating-reviews-layout">
      <RatingOverview reviews={reviews} labels={labels} filter={filter} onFilterChange={setFilter} resultsId={list} headingId={heading}/>
      <div className="cs-rating-reviews-results" id={list}>
        <p role="status" className="cs-sr-only">{visible.length} {text.reviews}{filter === null ? '' : ` · ${filter} / 5`}</p>
        {visible.length ? <ul className="cs-rating-reviews-list">{visible.map(review => <li key={review.id}><RatingReviewCard review={review} verifiedLabel={text.verified}/></li>)}</ul> : <p className="cs-rating-reviews-empty">{text.empty}</p>}
      </div>
    </div>
  </section>;
}

export interface RatingOverviewProps {
 reviews: readonly RatingReview[];
 labels?: RatingReviewsProps['labels'];
 filter?: ReviewScore | null;
 onFilterChange?: (score: ReviewScore | null) => void;
 resultsId?: string;
 headingId?: string;
 className?: string;
}
/** Standalone summary; a consumer can connect its filter to any review list. */
export function RatingOverview({reviews,labels,filter=null,onFilterChange,resultsId:list,headingId,className}:RatingOverviewProps) {
 const generated=useId();const heading=headingId??generated;
 const text={overview:'Rating Overview',reviews:'Reviews',all:'All',empty:'No reviews yet.',...labels};
  const counts = [5,4,3,2,1].map(score => ({ score:score as ReviewScore, count:reviews.filter(review => review.score === score).length }));
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length : null;
 return       <aside className={cx("cs-rating-reviews-overview",className)}>
        <h3 id={heading}>{text.overview}</h3>
        <RatingSummary value={average} count={reviews.length} label={text.overview} countLabel={text.reviews} emptyLabel={text.empty}/>
        <div className="cs-rating-reviews-distribution" role="group" aria-label={`${text.overview} · ${text.reviews}`}>
          {counts.map(({score,count}) => <RatingDistributionRow key={score} score={score} count={count} total={reviews.length} countLabel={text.reviews} selected={filter===score} controls={list} disabled={!count || !onFilterChange} onSelect={()=>onFilterChange?.(filter===score?null:score)}/>)}
          <button type="button" className="cs-rating-reviews-all" disabled={!onFilterChange} aria-pressed={filter === null} aria-controls={list} onClick={() => onFilterChange?.(null)}><span>{text.all}</span><span>{reviews.length}</span></button>
        </div>
      </aside>;
}
export interface RatingReviewCardProps { review:RatingReview; verifiedLabel?:string; className?:string; }
/** One review with author, verification, score and content. */
export function RatingReviewCard({review,verifiedLabel='Verified review',className}:RatingReviewCardProps) {
 return <article className={cx("cs-rating-review",className)}>
          <header className="cs-rating-review-header">
            <Avatar name={review.name} initials={review.initials} size="md" appearance="soft" />
            <div className="cs-rating-review-identity">
              <div className="cs-rating-review-name"><h4>{review.name}</h4>{review.verified && <span className="cs-rating-review-verified"><span aria-hidden="true"><Check size={12}/></span>{verifiedLabel}</span>}</div>
              {review.role && <p>{review.role}</p>}
              <time dateTime={review.dateTime}>{review.date}</time>
            </div>
            <RatingScore value={review.score} label={review.name}/>
          </header>
          <div className="cs-rating-review-content">{review.content}</div>
        </article>;
}

export interface RatingSummaryProps { value:number|null; count:number; label?:string; countLabel?:string; emptyLabel?:string; className?:string; }
export function RatingSummary({value,count,label='Rating',countLabel='Reviews',emptyLabel='No reviews yet.',className}:RatingSummaryProps) {
 return <div className={cx('cs-rating-reviews-average',className)}>
  <strong>{value===null?'—':value.toFixed(2)}</strong>
  <Rating label={label} value={value??0} readOnly precision="fractional" hideLabel size="lg" getValueLabel={()=>value===null?emptyLabel:`${value.toFixed(2)} / 5`}/>
  <span>{count} {countLabel}</span>
 </div>;
}
export interface RatingDistributionRowProps { score:ReviewScore; count:number; total:number; countLabel?:string; selected?:boolean; disabled?:boolean; controls?:string; onSelect?:()=>void; className?:string; }
export function RatingDistributionRow({score,count,total,countLabel='Reviews',selected=false,disabled=false,controls,onSelect,className}:RatingDistributionRowProps) {
 return <button type="button" className={cx('cs-rating-reviews-tier',className)} aria-label={`${score} / 5 · ${count} ${countLabel}`} aria-pressed={selected} aria-controls={controls} disabled={disabled||!onSelect} onClick={onSelect}>
  <span className="cs-rating-reviews-tier-label" aria-hidden="true">{score}<RatingStar/></span>
  <progress aria-hidden="true" max={total||1} value={count}/><span aria-hidden="true">{count}</span>
 </button>;
}
export interface RatingScoreProps { value:number; label:string; className?:string; }
export function RatingScore({value,label,className}:RatingScoreProps) {
 return <div className={cx('cs-rating-review-score',className)}><Rating label={label} value={value} readOnly precision="fractional" hideLabel size="sm" getValueLabel={score=>`${score} / 5`}/><span aria-hidden="true">{value}/5</span></div>;
}
