import React from 'react';
import {it,expect,afterEach} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Select} from '../packages/ui/src/index';
afterEach(cleanup);
it('selects multiple values without closing and submits native repeated form fields',async()=>{
 const {container}=render(<form><Select label="Projects" name="project" multiple defaultValue={['a']}><option value="a">Alpha</option><option value="b">Beta</option><option value="c" disabled>Unavailable</option></Select></form>);
 await userEvent.click(screen.getByRole('button',{name:/Projects/}));
 await userEvent.click(screen.getByRole('menuitemcheckbox',{name:'Beta'}));
 expect(screen.getByRole('menuitemcheckbox',{name:'Alpha'})).toHaveAttribute('aria-checked','true');
 expect(screen.getByRole('menuitemcheckbox',{name:'Beta'})).toHaveAttribute('aria-checked','true');
 expect(new FormData(container.querySelector('form')!).getAll('project')).toEqual(['a','b']);
 await userEvent.click(screen.getByRole('menuitemcheckbox',{name:'Alpha'}));
 expect(new FormData(container.querySelector('form')!).getAll('project')).toEqual(['b']);
 await userEvent.keyboard('{Escape}');expect(screen.getByRole('button',{name:/Projects/})).toHaveFocus();
});
