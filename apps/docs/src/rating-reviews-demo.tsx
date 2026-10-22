import { RatingReviews, type RatingReview } from '../../../packages/ui/src/index';

const reviews: RatingReview[] = [
  { id:'alex', name:'Alex Chen', initials:'AC', role:'Acoustics engineer', date:'2026/10/18', dateTime:'2026-10-18', score:5, verified:true, content:'The setup was straightforward, and the support team helped us verify our measurement workflow. The documentation made it easy to get started.' },
  { id:'morgan', name:'Morgan Lee', initials:'ML', role:'Vibration test engineer', date:'2026/10/16', dateTime:'2026-10-16', score:5, verified:true, content:'Clear instructions and responsive technical support. We were able to organize the first measurement session without interrupting our existing process.' },
  { id:'jordan', name:'Jordan Park', initials:'JP', role:'Product development engineer', date:'2026/10/14', dateTime:'2026-10-14', score:5, verified:true, content:'The workflow is easy to follow, from connecting the instrument to reviewing the results. Sharing the measurement configuration with the team was especially useful.' },
  { id:'sam', name:'Sam Rivera', initials:'SR', role:'Laboratory technician', date:'2026/10/12', dateTime:'2026-10-12', score:4, content:'A good overall experience with clear results. I would appreciate a few more examples for setting up a new test, but the core workflow works well.' },
];

export function RatingReviewsDemo() {
  return <div className="rating-reviews-demo"><p className="cs-help">演示数据 · 点击左侧星级可筛选评价，All 恢复全部。</p><RatingReviews reviews={reviews}/></div>;
}

export const ratingReviewsExampleCode = `import { RatingReviews, type RatingReview } from '@crysound/ui';

const reviews: RatingReview[] = ${JSON.stringify(reviews, null, 2)};

<RatingReviews reviews={reviews} />`;
