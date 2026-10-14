import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SectionHeader, Button } from '../packages/ui/src/index';
afterEach(cleanup);
describe('SectionHeader',()=>{
  it('preserves heading semantics and action controls',()=>{
    render(<SectionHeader title="设备" description="查看连接状态" level={3} actions={<Button>新增</Button>}/>);
    expect(screen.getByRole('heading',{level:3,name:'设备'})).toBeInTheDocument();expect(screen.getByRole('button',{name:'新增'})).toBeInTheDocument();
  });
});
