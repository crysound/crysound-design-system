import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InlineCTA } from '../packages/ui/src/index';
afterEach(cleanup);
describe('InlineCTA',()=>{
  it('executes an action and dismisses the prompt',()=>{
    const action=vi.fn(),dismiss=vi.fn();render(<InlineCTA title="报告模板" primaryAction={{label:'配置',onClick:action}} dismissible onDismiss={dismiss}/>);
    fireEvent.click(screen.getByRole('button',{name:'配置'}));expect(action).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button',{name:'关闭 报告模板'}));expect(dismiss).toHaveBeenCalledOnce();expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
  it('uses link semantics for navigation and disables unavailable actions',()=>{
    render(<InlineCTA title="产品" primaryAction={{label:'浏览',href:'#patterns'}} secondaryAction={{label:'不可用',disabled:true}}/>);
    expect(screen.getByRole('link',{name:'浏览'})).toHaveAttribute('href','#patterns');expect(screen.getByRole('button',{name:'不可用'})).toBeDisabled();
  });
});
