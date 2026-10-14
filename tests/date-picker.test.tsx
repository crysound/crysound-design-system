import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../packages/ui/src/index';
afterEach(cleanup);
describe('DatePicker',()=>{
  it('shows the selected local date and respects disabled state',()=>{
    render(<DatePicker label="测量日期" defaultValue="2026-10-14" disabled />);
    expect(screen.getByRole('button',{name:'测量日期'})).toBeDisabled();
    expect(screen.getByText('2026-10-14')).toBeInTheDocument();
  });
  it('enforces min/max and emits a selected date',()=>{
    const change=vi.fn();render(<DatePicker label="日期" defaultValue="2026-10-14" min="2026-10-10" max="2026-10-20" onChange={change} />);
    fireEvent.click(screen.getByRole('button',{name:'日期'}));
    expect(screen.getByRole('button',{name:'2026-10-09'})).toBeDisabled();
    fireEvent.click(screen.getByRole('button',{name:'2026-10-15'}));
    expect(change).toHaveBeenCalledWith('2026-10-15');
  });
});
