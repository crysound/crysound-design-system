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
        <div className="cs-rating-reviews-average">
          <strong>{average === null ? '—' : average.toFixed(2)}</strong>
          <Rating label={text.overview} value={average ?? 0} readOnly precision="fractional" hideLabel size="lg" getValueLabel={() => average === null ? text.empty : `${average.toFixed(2)} / 5`} />
          <span>{reviews.length} {text.reviews}</span>
        </div>
        <div className="cs-rating-reviews-distribution" role="group" aria-label={`${text.overview} · ${text.reviews}`}>
          {counts.map(({score,count}) => <button key={score} type="button" className="cs-rating-reviews-tier" aria-label={`${score} / 5 · ${count} ${text.reviews}`} aria-pressed={filter === score} aria-controls={list} disabled={!count || !onFilterChange} onClick={() => onFilterChange?.(filter === score ? null : score)}>
            <span className="cs-rating-reviews-tier-label" aria-hidden="true">{score}<RatingStar /></span>
            <progress aria-hidden="true" max={reviews.length || 1} value={count} />
            <span aria-hidden="true">{count}</span>
          </button>)}
          <button type="button" className="cs-rating-reviews-all" disabled={!onFilterChange} aria-pressed={filter === null} aria-controls={list} onClick={() => onFilterChange?.(null)}><span>{text.all}</span><span>{reviews.length}</span></button>
        </div>
      </aside>;
}
export interface RatingReviewCardProps { review:RatingReview; verifiedLabel?:string; className?:string; }
/** One review with author, verification, score and content. */
export function RatingReviewCard({review,verifiedLabel='Verified review',className}:RatingReviewCardProps) {
 return <article className={cx("cs-rating-review",className)}>
          <header className="cs-rating-review-header">
            <Avatar name={review.name} initials={review.initials} size="lg" appearance="soft" />
            <div className="cs-rating-review-identity">
              <div className="cs-rating-review-name"><h4>{review.name}</h4>{review.verified && <span className="cs-rating-review-verified"><span aria-hidden="true"><Check size={12}/></span>{verifiedLabel}</span>}</div>
              {review.role && <p>{review.role}</p>}
              <time dateTime={review.dateTime}>{review.date}</time>
            </div>
            <div className="cs-rating-review-score"><Rating label={review.name} value={review.score} readOnly hideLabel size="sm" getValueLabel={score => `${score} / 5`} /><span aria-hidden="true">{review.score}/5</span></div>
          </header>
          <div className="cs-rating-review-content">{review.content}</div>
        </article>;
}
