import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LoadingIndicator } from '../packages/ui/src/index';
afterEach(cleanup);
describe('LoadingIndicator',()=>{
  it.each(['pulse','logo'] as const)('retains an accessible status when the %s label is hidden',(variant)=>{
    render(<LoadingIndicator variant={variant} label="正在读取设备" showLabel={false}/>);
    expect(screen.getByRole('status')).toHaveTextContent('正在读取设备');
    expect(screen.getByText('正在读取设备')).toHaveClass('cs-sr-only');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
  it.each(['pulse','logo'] as const)('keeps a single status when a consumer pauses %s motion and updates the task',(variant)=>{
    const view=render(<LoadingIndicator variant={variant} label="正在准备测量界面…"/>);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    view.rerender(<LoadingIndicator variant={variant} animate={false} label="正在读取测量记录…"/>);
    expect(screen.getByRole('status')).toHaveTextContent('正在读取测量记录…');
    expect(screen.queryByText('正在准备测量界面…')).not.toBeInTheDocument();
    expect(view.container.querySelector(`[class="cs-loading-${variant}"]`)).toHaveAttribute('aria-hidden','true');
  });
  it('renders each variant without exposing decorative graphics',()=>{
    const view=render(<LoadingIndicator variant="dots"/>);
    expect(view.container.querySelectorAll('i')).toHaveLength(3);
    view.rerender(<LoadingIndicator variant="ring" size="lg"/>);
    expect(view.container.querySelector('svg')).toHaveAttribute('aria-hidden','true');
  });
});
