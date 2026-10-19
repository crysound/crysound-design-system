import React from 'react';
import {afterEach,it,expect} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {CarouselPagination} from '../packages/ui/src/carousel-pagination';
afterEach(cleanup);
function Demo(){const [value,setValue]=React.useState(0);return <CarouselPagination count={6} value={value} onValueChange={setValue}/>;}
it('selects slides by click and supports wrapping keyboard navigation',async()=>{const user=userEvent.setup();render(<Demo/>);await user.click(screen.getByRole('button',{name:'第 6 张'}));expect(screen.getByRole('button',{name:'第 6 张'})).toHaveAttribute('aria-current','true');await user.keyboard('{ArrowRight}');expect(screen.getByRole('button',{name:'第 1 张'})).toHaveFocus();expect(screen.getByRole('button',{name:'第 1 张'})).toHaveAttribute('aria-current','true');await user.keyboard('{End}');expect(screen.getByRole('button',{name:'第 6 张'})).toHaveFocus();await user.keyboard('{Home}');expect(screen.getByRole('button',{name:'第 1 张'})).toHaveFocus();});
it('hides empty pagination and prevents changes when disabled',async()=>{let calls=0;const {rerender}=render(<CarouselPagination count={0} value={0} onValueChange={()=>calls++}/>);expect(screen.queryByRole('group')).not.toBeInTheDocument();rerender(<CarouselPagination count={2} value={0} onValueChange={()=>calls++} disabled/>);await userEvent.click(screen.getByRole('button',{name:'第 2 张'}));expect(calls).toBe(0);expect(screen.getByRole('button',{name:'第 1 张'})).toBeDisabled();});
