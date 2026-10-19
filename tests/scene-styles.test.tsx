import React from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {SceneStyles,SceneStandalone} from '../apps/docs/src/scene-styles';
afterEach(()=>{cleanup();vi.restoreAllMocks();});
it('selects devices and locks configuration until measurement stops',async()=>{
  const user=userEvent.setup();render(<SceneStyles/>);
  await user.click(screen.getByRole('button',{name:'测量配置'}));
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
  render(<SceneStyles/>);await user.click(screen.getByRole('tab',{name:/数据看板/}));
  await user.click(screen.getByRole('tab',{name:'平均声级'}));
  expect(screen.getByRole('img',{name:/平均声级趋势/})).toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:'导出 CSV'}));
  expect(click).toHaveBeenCalledOnce();expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
  expect(screen.getByRole('status')).toHaveTextContent('已导出');
});
it('filters product families and returns focus after closing details',async()=>{
  const user=userEvent.setup();render(<SceneStyles/>);await user.click(screen.getByRole('tab',{name:/品牌官网/}));
  await user.click(screen.getByRole('tab',{name:'音频测试'}));
  expect(screen.queryByRole('heading',{name:'CRY5820 SonoDAQ Pro'})).not.toBeInTheDocument();
  const trigger=screen.getByRole('button',{name:'查看系列'});await user.click(trigger);
  expect(screen.getByRole('dialog')).toHaveTextContent('蓝牙音频测试');
  await user.keyboard('{Escape}');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(trigger).toHaveFocus();
});

it("opens a standalone scene with explicit scene navigation",()=>{render(<SceneStandalone scene="analytics"/>);expect(screen.getByRole("heading",{name:"测量质量概览"})).toBeVisible();expect(screen.getByRole("link",{name:"数据看板"})).toHaveAttribute("aria-current","page");expect(screen.getByRole("link",{name:"品牌官网"})).toHaveAttribute("href","#scene/brand");});
it('switches brand product imagery using explicit product controls',async()=>{const user=userEvent.setup();render(<SceneStandalone scene="brand"/>);await user.click(screen.getByRole('button',{name:'声学成像'}));expect(screen.getByRole('button',{name:'声学成像'})).toHaveAttribute('aria-pressed','true');expect(screen.getByRole('img',{name:'SonoCam Pi 声学成像产品'})).toBeVisible();expect(screen.queryByRole('img',{name:'数据采集分析软件展示'})).not.toBeInTheDocument();await user.click(screen.getByRole('button',{name:'便携检测'}));expect(screen.getByRole('img',{name:'SonoCam Pocket 声学成像产品'})).toBeVisible();});
it('switches noise monitoring views and handles pause and disconnection',async()=>{const user=userEvent.setup();render(<SceneStandalone scene="precision"/>);expect(screen.getByRole('heading',{name:'实时声级趋势'})).toBeVisible();await user.click(screen.getByRole('button',{name:'暂停更新'}));expect(screen.getByRole('status')).toHaveTextContent('已暂停');await user.click(screen.getByRole('button',{name:'模拟断开连接'}));expect(screen.getByRole('status')).toHaveTextContent('读数不可用');expect(screen.getByRole('button',{name:'继续更新'})).toBeDisabled();await user.click(screen.getByRole('button',{name:'恢复模拟连接'}));await user.click(screen.getByRole('button',{name:'监测点'}));await user.click(screen.getByRole('button',{name:/产线工位.*切换到此测点/}));expect(screen.getByRole('button',{name:'当前监测点 产线工位'})).toBeVisible();await user.click(screen.getByRole('button',{name:'收起侧栏'}));expect(screen.getByRole('button',{name:'展开侧栏'})).toBeVisible();});
it('cycles all four official hero compositions and wraps to the first',async()=>{
 const user=userEvent.setup();render(<SceneStandalone scene="brand"/>);
 await user.click(screen.getByRole('button',{name:'下一组产品展示'}));
 expect(screen.getByRole('heading',{name:'SOUND POWER MEASUREMENT'})).toBeVisible();
 await user.click(screen.getByRole('button',{name:'上一组产品展示'}));
 expect(screen.getByRole('heading',{name:'DATA ACQUISITION'})).toBeVisible();
 await user.click(screen.getByRole('button',{name:'上一组产品展示'}));
 expect(screen.getByRole('button',{name:'便携检测'})).toHaveAttribute('aria-pressed','true');
 await user.click(screen.getByRole('button',{name:'下一组产品展示'}));
 expect(screen.getByRole('button',{name:'数据采集'})).toHaveAttribute('aria-pressed','true');
});
