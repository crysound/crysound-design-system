import React from 'react';
import {afterEach,describe,it,expect} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button,Input,Dialog,DeviceTable} from '../packages/ui/src/index';
afterEach(cleanup);
describe('accessible component contracts',()=>{
 it('blocks repeated submissions while loading',async()=>{let calls=0;render(<Button loading onClick={()=>calls++}>保存</Button>);await userEvent.click(screen.getByRole('button'));expect(calls).toBe(0);expect(screen.getByRole('button')).toHaveAttribute('aria-busy','true')});
 it('associates validation with its field',()=>{render(<Input label="设备编号" error="编号必填"/>);const input=screen.getByLabelText('设备编号');expect(input).toHaveAttribute('aria-invalid','true');expect(input).toHaveAccessibleDescription('编号必填')});
 it('supports keyboard dialog dismissal and restores focus',async()=>{const user=userEvent.setup();render(<Dialog trigger={<Button>打开</Button>} title="新建任务" description="填写任务信息"><Input label="名称"/></Dialog>);await user.click(screen.getByRole('button',{name:'打开'}));expect(screen.getByRole('dialog')).toHaveAccessibleName('新建任务');await user.keyboard('{Escape}');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(screen.getByRole('button',{name:'打开'})).toHaveFocus()});
 it('shows a meaningful empty result',()=>{render(<DeviceTable devices={[]}/>);expect(screen.getByText('暂无设备')).toBeInTheDocument()});
});
