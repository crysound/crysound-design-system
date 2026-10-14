import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProgressSteps } from '../packages/ui/src/index';
afterEach(cleanup);
describe('ProgressSteps',()=>{
  it('marks the current step and emits enabled step selections',()=>{
    const change=vi.fn();render(<ProgressSteps steps={[{id:'a',title:'设备'},{id:'b',title:'配置'},{id:'c',title:'完成',disabled:true}]} currentStep="b" onStepChange={change}/>);
    expect(screen.getByRole('button',{name:/配置/})).toHaveAttribute('aria-current','step');
    fireEvent.click(screen.getByRole('button',{name:/设备/}));expect(change).toHaveBeenCalledWith('a');
    expect(screen.getByRole('button',{name:/^完成\s*待进行$/})).toBeDisabled();
  });
  it('describes errors without relying on color',()=>{
    render(<ProgressSteps steps={[{id:'a',title:'设备'}]} currentStep="a" errorStep="a"/>);
    expect(screen.getByText('发生错误')).toBeInTheDocument();
  });
});
