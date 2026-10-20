import React,{useState} from 'react';
import {afterEach,it,expect} from 'vitest';
import {cleanup,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ToastProvider} from '../packages/ui/src/index';
import {TemplatesLibrary,canonicalTemplateRoute} from '../apps/docs/src/templates-library';
afterEach(cleanup);
it.each([['patterns','templates'],['scene-styles','templates/scenes'],['templates','templates'],['templates/scenes','templates/scenes'],['scene/brand','scene/brand']])('normalizes %s without changing standalone scene routes',(input,result)=>{expect(canonicalTemplateRoute(input)).toBe(result);});
it('switches from task combinations to complete scenes with a single page heading',async()=>{
 const user=userEvent.setup();function Example(){const [view,setView]=useState<'tasks'|'scenes'>('tasks');return <ToastProvider><TemplatesLibrary view={view} onViewChange={setView}/></ToastProvider>;}
 render(<Example/>);
 expect(screen.getByRole('heading',{name:'样板库',level:1})).toBeVisible();
 expect(screen.getByRole('table',{name:'演示设备工作台'})).toBeVisible();
 await user.click(screen.getByRole('tab',{name:'完整场景'}));
 expect(screen.getAllByRole('heading',{level:1})).toHaveLength(1);
 expect(screen.queryByRole('table',{name:'演示设备工作台'})).not.toBeInTheDocument();
 const sceneTabs=screen.getByRole('tablist',{name:'场景样板风格'});
 await user.click(within(sceneTabs).getByRole('tab',{name:/数据看板/}));
 expect(screen.getByRole('heading',{name:'测量质量概览'})).toBeVisible();
 expect(screen.getByRole('link',{name:'展开样板'})).toHaveAttribute('href','#scene/analytics');
 await user.click(screen.getByRole('tab',{name:'任务组合'}));
 expect(screen.getByRole('table',{name:'演示设备工作台'})).toBeVisible();
});
