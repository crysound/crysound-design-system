import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ColorPicker, colorFillBackground } from '../packages/ui/src/index';
afterEach(cleanup);
describe('ColorPicker',()=>{
  it('emits valid hex colors and rejects invalid input',()=>{
    const change=vi.fn();render(<ColorPicker onChange={change} />);
    const input=screen.getByLabelText('Hex 颜色');
    fireEvent.change(input,{target:{value:'#2563eb'}});
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({color:'#2563eb'}));
    change.mockClear();fireEvent.change(input,{target:{value:'invalid'}});fireEvent.blur(input);
    expect(screen.getByRole('alert')).toHaveTextContent('六位 Hex');expect(change).not.toHaveBeenCalled();
  });
  it('clamps opacity and preserves disabled values',()=>{
    const change=vi.fn();const view=render(<ColorPicker onChange={change} />);
    fireEvent.change(screen.getByLabelText('透明度百分比'),{target:{value:'150'}});
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({opacity:100}));
    view.rerender(<ColorPicker disabled onChange={change} />);change.mockClear();
    fireEvent.click(screen.getByLabelText('选择 #2563eb'));expect(change).not.toHaveBeenCalled();
  });
  it('normalizes invalid gradient colors before producing CSS',()=>{
    expect(colorFillBackground({mode:'gradient',color:'invalid',endColor:'#ffffff',opacity:100,angle:90})).toBe('linear-gradient(90deg, #170057, #ffffff)');
  });
});
