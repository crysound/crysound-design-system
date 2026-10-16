import React from 'react';
import {afterEach, it, expect, vi} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ProgressList} from '../packages/ui/src/index';
afterEach(cleanup);
it('preserves unknown progress and keeps disclosure keyboard focusable', async () => {
  const user=userEvent.setup();
  const {container}=render(<ProgressList title="Tasks" items={[{id:'a',title:'Calibration',progress:null,details:<p>Connect device</p>},{id:'b',title:'Disabled',progress:150,disabled:true,details:<p>Hidden details</p>}]}/>);
  expect(screen.getByText('暂无数据')).toBeInTheDocument();
  expect(screen.queryByRole('progressbar',{name:'Calibration完成度'})).not.toBeInTheDocument();
  expect(screen.getByRole('progressbar',{name:'Disabled完成度'})).toHaveAttribute('value','100');
  await user.tab(); expect(container.querySelector('summary')).toHaveFocus();
  await user.click(container.querySelector('summary')!);
  expect(container.querySelector('details')).toHaveAttribute('open');
  expect(container.querySelectorAll('summary')).toHaveLength(1);
});
it('offers retry and separate loading and empty states', async () => {
  const retry=vi.fn(); const user=userEvent.setup();
  const {rerender}=render(<ProgressList title="Tasks" items={[]} state="error" onRetry={retry}/>);
  await user.click(screen.getByRole('button',{name:'重试'}));expect(retry).toHaveBeenCalledOnce();
  rerender(<ProgressList title="Tasks" items={[]} state="loading"/>);expect(screen.getByRole('status')).toHaveTextContent('正在加载');
  rerender(<ProgressList title="Tasks" items={[]}/>);expect(screen.getByText('暂无任务')).toBeInTheDocument();
});
