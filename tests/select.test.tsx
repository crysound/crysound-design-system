import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, it, expect, vi } from 'vitest';
import { Select } from '../packages/ui/src/index';
afterEach(cleanup);
it('submits the selected value and keeps controlled selection and errors',()=>{
  const change=vi.fn();
  const view=render(<form><Select label="类型" name="type" value="a" onChange={change} error="请选择类型"><option value="a">血清</option><option value="b">组织</option></Select></form>);
  expect(screen.getByRole('button',{name:'类型 血清'})).toHaveAttribute('aria-invalid','true');
  const select=view.container.querySelector('select')!;
  fireEvent.change(select,{target:{value:'b'}});
  expect(change).toHaveBeenCalledOnce();
  view.rerender(<form><Select label="类型" name="type" value="b"><option value="a">血清</option><option value="b">组织</option></Select></form>);
  expect(screen.getByRole('button',{name:'类型 组织'})).toBeInTheDocument();
  expect(new FormData(view.container.querySelector('form')!).get('type')).toBe('b');
});
it('disables the visible trigger and preserves the forwarded native ref',()=>{
  const ref={current:null as HTMLSelectElement|null};
  render(<Select label="类型" disabled ref={ref}><option value="a">血清</option></Select>);
  expect(screen.getByRole('button')).toBeDisabled();
  expect(ref.current).toBeInstanceOf(HTMLSelectElement);
});
