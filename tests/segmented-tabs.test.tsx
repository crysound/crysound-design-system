import React from 'react';
import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../packages/ui/src/index';
afterEach(cleanup);
it('preserves names, disabled skipping and panel association in compact segmented tabs', async () => {
  const user = userEvent.setup();
  const {container} = render(<Tabs defaultValue="a"><TabsList variant="pill" collapseInactiveLabels aria-label="内容"><TabsTrigger value="a" icon={<svg />}>概览</TabsTrigger><TabsTrigger value="b" icon={<svg />} disabled>详情</TabsTrigger><TabsTrigger value="c">历史</TabsTrigger></TabsList><TabsContent value="a">概览内容</TabsContent><TabsContent value="c">历史内容</TabsContent></Tabs>);
  expect(container.querySelector('.cs-tabs-container')).not.toBeNull();
  expect(screen.getByRole('tablist').hasAttribute('data-compact-segmented')).toBe(true);
  expect(screen.getByRole('tab', {name:'详情'})).toBeDisabled();
  expect(screen.getByRole('tab', {name:'历史'}).hasAttribute('data-has-icon')).toBe(false);
  await user.tab();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', {name:'历史'})).toHaveAttribute('data-state','active');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('历史内容');
});
it('leaves two-item and line lists unwrapped', () => {
  const {container} = render(<Tabs defaultValue="a"><TabsList variant="pill" collapseInactiveLabels><TabsTrigger value="a">甲</TabsTrigger><TabsTrigger value="b">乙</TabsTrigger></TabsList></Tabs>);
  expect(container.querySelector('.cs-tabs-container')).toBeNull();
});

it('keeps static segmented selection independent of a measured indicator',async()=>{
 const user=userEvent.setup();
 const {container}=render(<Tabs defaultValue="a"><TabsList variant="pill" indicatorMode="static" aria-label="分类"><TabsTrigger value="a">第一项</TabsTrigger><TabsTrigger value="b" disabled>禁用项</TabsTrigger><TabsTrigger value="c">最后一项</TabsTrigger></TabsList><TabsContent value="a">全部内容</TabsContent><TabsContent value="c">筛选内容</TabsContent></Tabs>);
 expect(container.querySelector('.cs-tabs-indicator')).toBeNull();
 await user.click(screen.getByRole('tab',{name:'最后一项'}));
 expect(screen.getByRole('tab',{name:'最后一项'})).toHaveAttribute('aria-selected','true');
 expect(screen.getByRole('tabpanel')).toHaveTextContent('筛选内容');
 await user.keyboard('{ArrowLeft}');
 expect(screen.getByRole('tab',{name:'第一项'})).toHaveFocus();
 expect(screen.getByRole('tab',{name:'禁用项'})).toBeDisabled();
});
