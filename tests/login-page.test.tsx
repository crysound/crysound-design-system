import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from '../packages/ui/src/index';
afterEach(cleanup);
describe('LoginPage',()=>{
  it('toggles password visibility and sends credentials to the consumer callback',async()=>{
    const submit=vi.fn();render(<LoginPage onSubmit={submit}/>);
    fireEvent.change(screen.getByLabelText('账号'),{target:{value:'engineer'}});fireEvent.change(screen.getByLabelText('密码',{exact:true}),{target:{value:'example'}});
    fireEvent.click(screen.getByRole('button',{name:'显示密码'}));expect(screen.getByLabelText('密码',{exact:true})).toHaveAttribute('type','text');
    fireEvent.click(screen.getByRole('button',{name:'登录'}));await waitFor(()=>expect(submit).toHaveBeenCalledWith({account:'engineer',password:'example',remember:false}));
  });
  it('shows consumer errors and permits retry',async()=>{
    render(<LoginPage onSubmit={async()=>{throw new Error('登录失败');}}/>);
    fireEvent.submit(screen.getByLabelText('账号').closest('form')!);expect(await screen.findByRole('alert')).toHaveTextContent('登录失败');expect(screen.getByRole('button',{name:'登录'})).not.toBeDisabled();
  });
});
