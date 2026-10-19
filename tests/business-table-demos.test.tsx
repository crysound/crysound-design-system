import {afterEach,it,expect} from 'vitest';
import {render,screen,within,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DataTableDemo} from '../apps/docs/src/data-table-demo';
afterEach(cleanup);
it('filters cloud failures and opens their actual record details',async()=>{
 const user=userEvent.setup();render(<DataTableDemo/>);
 await user.type(screen.getByRole('searchbox',{name:'搜索记录'}),'失败');
 const table=screen.getByRole('table',{name:'声像云端任务列表'});
 expect(within(table).queryByRole('progressbar')).not.toBeInTheDocument();
 expect(table).toHaveTextContent('文件校验失败');
 await user.click(within(table).getByRole('button',{name:'查看 CL-004'}));
 expect(screen.getByRole('dialog',{name:'声像任务详情'})).toHaveTextContent('声学成像仪 04');
});
it('preserves overloaded readings and represents disconnected resources without zero',async()=>{
 const user=userEvent.setup();render(<DataTableDemo/>);
 await user.click(screen.getByRole('tab',{name:'设备与算力'}));
 const table=screen.getByRole('table',{name:'设备与算力资源列表'});
 const overload=within(table).getByRole('progressbar',{name:'RS-005 负载占比'});
 expect(overload).toHaveAttribute('aria-valuenow','100');
 expect(overload.closest('td')).toHaveTextContent('108%');
 expect(overload.closest('td')).toHaveTextContent('超过基准容量');
 const disconnected=within(table).getAllByRole('row').find(row=>row.textContent?.includes('RS-006'))!;
 expect(disconnected).toHaveTextContent('无读数');
 expect(within(disconnected).queryByRole('progressbar')).not.toBeInTheDocument();
});
it('clears scene selection and uses search for a small general table',async()=>{
 const user=userEvent.setup();render(<DataTableDemo/>);
 await user.click(screen.getByRole('checkbox',{name:'选择记录 CL-001'}));
 await user.click(screen.getByRole('tab',{name:'通用事项'}));
 expect(screen.getByText('15 条记录 · 已选 0 条（可跨页）')).toBeVisible();
 expect(screen.queryByRole('button',{name:'部门 全部'})).not.toBeInTheDocument();
 await user.type(screen.getByRole('searchbox',{name:'搜索记录'}),'研发');
 expect(screen.getByText('5 条记录 · 已选 0 条（可跨页）')).toBeVisible();
 expect(screen.getByRole('table',{name:'通用项目事项列表'})).toHaveTextContent('1,200');
});
