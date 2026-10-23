import React,{useState} from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Input} from '../packages/ui/src/index';
afterEach(cleanup);
it('clears controlled input through native change and restores focus without submitting',async()=>{
 const submit=vi.fn();function Demo(){const [value,setValue]=useState('Device');return <form onSubmit={submit}><Input label="设备" value={value} onChange={e=>setValue(e.target.value)} clearable/></form>}
 render(<Demo/>);await userEvent.click(screen.getByRole('button',{name:'清空设备'}));expect(screen.getByLabelText('设备')).toHaveValue('');expect(screen.getByLabelText('设备')).toHaveFocus();expect(submit).not.toHaveBeenCalled();
});
it('keeps selects in native form data and disables editing for readonly groups',async()=>{
 const {container,rerender}=render(<form><Input label="电话" name="phone" defaultValue="123" leadingSelect={{label:'区号',name:'code',options:[{value:'+86',label:'+86'},{value:'+1',label:'+1'}]}}/></form>);
 await userEvent.selectOptions(screen.getByLabelText('区号'),'+1');expect(new FormData(container.querySelector('form')!).get('code')).toBe('+1');
 rerender(<Input label="电话" defaultValue="123" readOnly clearable leadingSelect={{label:'区号',options:[{value:'+86',label:'+86'}]}}/>);expect(screen.getByLabelText('区号')).toBeDisabled();expect(screen.queryByRole('button',{name:'清空电话'})).toBeNull();
});
it('toggles password visibility without changing value',async()=>{
 render(<Input label="密码" type="password" defaultValue="sample-only" passwordToggle/>);await userEvent.click(screen.getByRole('button',{name:'显示密码'}));expect(screen.getByLabelText('密码')).toHaveAttribute('type','text');expect(screen.getByLabelText('密码')).toHaveValue('sample-only');await userEvent.click(screen.getByRole('button',{name:'隐藏密码'}));expect(screen.getByLabelText('密码')).toHaveAttribute('type','password');
});
it('exposes required validation and help through keyboard focus',async()=>{
 render(<Input label="Website" required prefix="https://" prefixDivider helpTooltip="Enter a domain" helpLabel="Website help"/>);
 expect(screen.getByRole('textbox',{name:'Website'})).toBeRequired();
 await userEvent.tab();await userEvent.tab();
 expect(screen.getByRole('button',{name:'Website help'})).toHaveFocus();
 expect(await screen.findByRole('tooltip')).toHaveTextContent('Enter a domain');
});
