import React from 'react';
import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RatingReviews, type RatingReview } from '../packages/ui/src/index';

afterEach(cleanup);
const reviews: RatingReview[] = [
  {id:'a', name:'Alex', date:'2026/10/18', score:5, verified:true, content:'First review'},
  {id:'b', name:'Morgan', date:'2026/10/16', score:5, content:'Second review'},
  {id:'c', name:'Jordan', date:'2026/10/14', score:5, content:'Third review'},
  {id:'d', name:'Sam', date:'2026/10/12', score:4, content:'Fourth review'},
];

it('keeps the mean, distribution and individual ratings consistent and verification explicit', () => {
  render(<RatingReviews reviews={reviews} />);
  expect(screen.getByText('4.75')).toBeVisible();
  expect(screen.getByRole('img', {name:'Rating Overview：4.75 / 5'})).toBeVisible();
  expect(screen.getByRole('button', {name:'5 / 5 · 3 Reviews'})).toBeEnabled();
  expect(screen.getByRole('button', {name:'3 / 5 · 0 Reviews'})).toBeDisabled();
  expect(screen.getAllByRole('article')).toHaveLength(4);
  expect(screen.getAllByText('Verified review')).toHaveLength(1);
  expect(within(screen.getByText('Fourth review').closest('article')!).getByRole('img', {name:'Sam：4 / 5'})).toBeVisible();
});

it('filters with the keyboard and restores all reviews without changing the overall mean', async () => {
  const user = userEvent.setup();
  render(<RatingReviews reviews={reviews} />);
  const four = screen.getByRole('button', {name:'4 / 5 · 1 Reviews'});
  four.focus();
  await user.keyboard(' ');
  expect(four).toHaveAttribute('aria-pressed','true');
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByText('Fourth review')).toBeVisible();
  expect(screen.getByText('4.75')).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('1 Reviews · 4 / 5');
  const all = screen.getByRole('button', {name:'All 4'});
  all.focus();
  await user.keyboard('{Enter}');
  expect(all).toHaveAttribute('aria-pressed','true');
  expect(screen.getAllByRole('article')).toHaveLength(4);
});

it('resets a stale filter when the consuming application removes its matching reviews', async () => {
  const user = userEvent.setup();
  const {rerender} = render(<RatingReviews reviews={reviews} />);
  await user.click(screen.getByRole('button', {name:'4 / 5 · 1 Reviews'}));
  rerender(<RatingReviews reviews={reviews.slice(0,3)} />);
  await waitFor(() => expect(screen.getByRole('button', {name:'All 3'})).toHaveAttribute('aria-pressed','true'));
  expect(screen.getAllByRole('article')).toHaveLength(3);
  expect(screen.getByText('5.00')).toBeVisible();
});

it('shows an empty state rather than a fabricated average when there are no reviews', () => {
  render(<RatingReviews reviews={[]} labels={{empty:'暂无评价'}} />);
  expect(screen.getByText('—')).toBeVisible();
  expect(screen.getByText('暂无评价')).toBeVisible();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
  expect(screen.getByRole('button', {name:'All 0'})).toHaveAttribute('aria-pressed','true');
  for (const score of [5,4,3,2,1]) expect(screen.getByRole('button', {name:`${score} / 5 · 0 Reviews`})).toBeDisabled();
});
