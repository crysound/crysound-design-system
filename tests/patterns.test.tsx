import React from 'react';
import {afterEach, describe, it, expect, vi} from 'vitest';
import {render, screen, cleanup, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button, Input, FilterToolbar, QuotaCard, FormDialog} from '../packages/ui/src/index';
afterEach(cleanup);
describe('shared composition contracts', () => {
  it('keeps unknown quota distinct from zero and clamps numeric progress', () => {
    render(<QuotaCard title="Quota" quotas={[{id:'unknown', label:'Unknown', remaining:null},{id:'high',label:'High',remaining:140}]}/>);
    expect(screen.getByText('暂不可用')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name:'Unknown'})).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar', {name:'High'})).toHaveAttribute('value','100');
  });
  it('passes search and reset to the consumer', async () => {
    const user=userEvent.setup(); const change=vi.fn(); const reset=vi.fn();
    render(<FilterToolbar label="Filters" query="" onQueryChange={change} onReset={reset}/>);
    await user.type(screen.getByRole('searchbox'), 'a');
    expect(change).toHaveBeenCalledWith('a');
    await user.click(screen.getByRole('button',{name:'重置'})); expect(reset).toHaveBeenCalledOnce();
  });
  it('retains fields on submit failure and permits retry', async () => {
    const user=userEvent.setup(); const submit=vi.fn().mockRejectedValueOnce(new Error('Save failed')).mockResolvedValue(undefined);
    render(<FormDialog title="Settings" description="Edit name" trigger={<Button>Edit</Button>} onSubmit={submit}><Input label="Name" name="name" required defaultValue="Device"/></FormDialog>);
    await user.click(screen.getByRole('button',{name:'Edit'}));
    await user.click(screen.getByRole('button',{name:'保存'}));
    expect(await screen.findByRole('alert')).toHaveTextContent('Save failed');
    expect(screen.getByLabelText('Name')).toHaveValue('Device');
    await user.click(screen.getByRole('button',{name:'保存'}));
    await waitFor(()=>expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button',{name:'Edit'})).toHaveFocus();
    expect(submit.mock.calls[0][0].get('name')).toBe('Device');
  });
  it('ignores an old pending result after cancellation and reopening', async () => {
    const user=userEvent.setup(); let finish!:()=>void;
    const submit=vi.fn(()=>new Promise<void>(resolve=>{finish=resolve;}));
    render(<FormDialog title="Settings" description="Edit name" trigger={<Button>Edit</Button>} onSubmit={submit}><Input label="Name" name="name" defaultValue="Device"/></FormDialog>);
    await user.click(screen.getByRole('button',{name:'Edit'})); await user.click(screen.getByRole('button',{name:'保存'}));
    expect(screen.getByLabelText('Name')).toBeDisabled(); expect(submit).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button',{name:'取消'})); await user.click(screen.getByRole('button',{name:'Edit'}));
    finish(); await waitFor(()=>expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByLabelText('Name')).not.toBeDisabled();
  });
});
