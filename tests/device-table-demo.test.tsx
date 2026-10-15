import React from 'react';
import { afterEach, expect, it } from 'vitest';
import { render, screen, within, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeviceTableDemo } from '../apps/docs/src/device-table-demo';
afterEach(cleanup);
it('opens the selected device and restores focus after closing', async () => {
  const user = userEvent.setup();
  render(<DeviceTableDemo devices={[
    {id:'A', name:'设备甲', model:'型号甲', location:'实验室', status:'online'},
    {id:'B', name:'设备乙', model:'型号乙', location:'生产线', status:'offline'},
  ]} />);
  const first = screen.getByRole('button', {name:'查看 设备甲'});
  await user.click(first);
  expect(within(screen.getByRole('dialog', {name:'设备详情'})).getByText('型号甲')).toBeInTheDocument();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(first).toHaveFocus();
  const second = screen.getByRole('button', {name:'查看 设备乙'});
  await user.click(second);
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByText('型号乙')).toBeInTheDocument();
  expect(within(dialog).queryByText('型号甲')).not.toBeInTheDocument();
  await user.click(within(dialog).getByRole('button', {name:'关闭设备详情'}));
  await waitFor(() => expect(second).toHaveFocus());
});
