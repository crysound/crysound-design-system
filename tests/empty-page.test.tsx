import React from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button,EmptyPage} from '../packages/ui/src/index';
import {EmptyPageDemo,EmptyPageSearchDemo,EmptyPageErrorDemo} from '../apps/docs/src/empty-page-demo';
afterEach(cleanup);

it('gives page and section emptiness distinct headings, names and descriptions',()=>{
  render(<><EmptyPage headingLevel={1} title="暂无测量任务" description="创建第一个任务。"/><EmptyPage layout="section" title="暂无附件" description="上传文件后显示。" aria-label="附件空白页"/></>);
  const page=screen.getByRole('region',{name:'暂无测量任务'});
  const section=screen.getByRole('region',{name:'附件空白页'});
  expect(page).toHaveAccessibleDescription('创建第一个任务。');
  expect(section).toHaveAccessibleDescription('上传文件后显示。');
  expect(within(page).getByRole('heading',{level:1})).toHaveTextContent('暂无测量任务');
  expect(within(section).getByRole('heading',{level:3})).toHaveTextContent('暂无附件');
  expect(page.getAttribute('aria-labelledby')).not.toBe(section.getAttribute('aria-labelledby'));
  expect(screen.queryByRole('main')).not.toBeInTheDocument();
});

it('keeps decoration out of the reading order and preserves the caller action keyboard behavior',async()=>{
  const user=userEvent.setup(),create=vi.fn();
  render(<EmptyPage title="暂无记录" logo={<img src="/logo.svg" alt="CRYSOUND"/>} illustration={<img src="/wave.png" alt="装饰波面"/>} icon={<svg role="img" aria-label="装饰图标"/>} action={<Button onClick={create}>创建记录</Button>} data-testid="empty"/>);
  expect(screen.getAllByRole('img')).toHaveLength(1);
  expect(screen.getByRole('img',{name:'CRYSOUND'})).toBeVisible();
  await user.tab();
  expect(screen.getByRole('button',{name:'创建记录'})).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(create).toHaveBeenCalledOnce();
  expect(screen.getByTestId('empty')).toHaveAccessibleName('暂无记录');
});

it('creates a documentation task and returns to the empty page when it is removed',async()=>{
  const user=userEvent.setup();render(<EmptyPageDemo/>);
  await user.click(screen.getByRole('button',{name:'创建任务'}));
  expect(screen.queryByRole('heading',{name:'暂无测量任务'})).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('已创建测量任务');
  expect(screen.getByRole('heading',{name:'测量任务 01'})).toBeVisible();
  await user.click(screen.getByRole('button',{name:'移除演示任务'}));
  expect(screen.getByRole('region',{name:'暂无测量任务'})).toBeVisible();
});

it('clears an unmatched search and retries a failed documentation load',async()=>{
  const user=userEvent.setup();render(<><EmptyPageSearchDemo/><EmptyPageErrorDemo/></>);
  expect(screen.getByRole('region',{name:'没有找到匹配记录'})).toBeVisible();
  await user.click(screen.getByRole('button',{name:'清空搜索'}));
  expect(screen.getByRole('searchbox',{name:'搜索测量记录'})).toHaveValue('');
  expect(within(screen.getByRole('list',{name:'测量记录'})).getAllByRole('listitem')).toHaveLength(2);
  expect(screen.queryByRole('region',{name:'没有找到匹配记录'})).not.toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:'重新加载'}));
  expect(screen.getByRole('status')).toHaveTextContent('记录已重新载入');
  expect(screen.queryByRole('region',{name:'记录加载失败'})).not.toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:'模拟加载失败'}));
  expect(screen.getByRole('region',{name:'记录加载失败'})).toBeVisible();
});
