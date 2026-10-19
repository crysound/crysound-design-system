import React from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {SceneStyles,SceneStandalone} from '../apps/docs/src/scene-styles';
afterEach(()=>{cleanup();vi.restoreAllMocks();});
it('selects devices and locks configuration until measurement stops',async()=>{
  const user=userEvent.setup();render(<SceneStyles/>);
  await user.click(screen.getByRole('button',{name:/产线采集终端 DAQ-02/}));
  expect(screen.getByRole('button',{name:/产线采集终端 DAQ-02/})).toHaveAttribute('aria-pressed','true');
  await user.click(screen.getByRole('button',{name:'开始测量'}));
  expect(screen.getByRole('button',{name:/多通道采集设备 DAQ-01/})).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('测量中');
  await user.click(screen.getByRole('button',{name:'停止测量'}));
  expect(screen.getByRole('button',{name:/多通道采集设备 DAQ-01/})).not.toBeDisabled();
  await user.type(screen.getByRole('searchbox',{name:'查找样板设备'}),'unmatched');
  expect(screen.getByText('没有匹配设备')).toBeInTheDocument();
});
it('switches analysis units and exports the current chart data',async()=>{
  const user=userEvent.setup();Object.defineProperty(URL,'createObjectURL',{value:vi.fn(()=> 'blob:report'),configurable:true});Object.defineProperty(URL,'revokeObjectURL',{value:vi.fn(),configurable:true});
  const click=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
  render(<SceneStyles/>);await user.click(screen.getByRole('tab',{name:/理性数据/}));
  await user.click(screen.getByRole('tab',{name:'平均声级'}));
  expect(screen.getByRole('img',{name:/平均声级趋势/})).toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:'导出 CSV'}));
  expect(click).toHaveBeenCalledOnce();expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
  expect(screen.getByRole('status')).toHaveTextContent('已导出');
});
it('filters product families and returns focus after closing details',async()=>{
  const user=userEvent.setup();render(<SceneStyles/>);await user.click(screen.getByRole('tab',{name:/品牌展示/}));
  await user.click(screen.getByRole('tab',{name:'音频测试'}));
  expect(screen.queryByRole('heading',{name:'多通道数据采集'})).not.toBeInTheDocument();
  const trigger=screen.getByRole('button',{name:'查看系列'});await user.click(trigger);
  expect(screen.getByRole('dialog')).toHaveTextContent('蓝牙音频测试');
  await user.keyboard('{Escape}');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(trigger).toHaveFocus();
});

it("opens a standalone scene with explicit scene navigation",()=>{render(<SceneStandalone scene="analytics"/>);expect(screen.getByRole("heading",{name:"测量质量概览"})).toBeVisible();expect(screen.getByRole("link",{name:"理性数据"})).toHaveAttribute("aria-current","page");expect(screen.getByRole("link",{name:"品牌展示"})).toHaveAttribute("href","#scene/brand");});
