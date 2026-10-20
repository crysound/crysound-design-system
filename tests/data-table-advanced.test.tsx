import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,within,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DataTable,tableCsvCell,type DataColumn} from '../packages/ui/src/index';
afterEach(()=>{cleanup();vi.restoreAllMocks();});
const data=[{id:'a',name:'设备甲',area:'实验室',value:48},{id:'b',name:'设备乙',area:'产线',value:null},{id:'c',name:'设备丙',area:'实验室',value:62}];
const columns:DataColumn<typeof data[number]>[]=[{id:'name',header:'设备',accessor:r=>r.name,sortable:true,pinned:true,width:180},{id:'area',header:'区域',accessor:r=>r.area,filterable:true},{id:'value',header:'声级',accessor:r=>r.value,sortable:true,align:'right'}];
it('combines filters with search, resets page, and restores the view',async()=>{const user=userEvent.setup();render(<DataTable searchMode="always" filterMode="always" caption="设备" data={data} columns={columns} getRowId={r=>r.id} pageSize={1}/>);await user.click(screen.getByRole('button',{name:'下一页'}));await user.click(screen.getByRole('button',{name:'区域 全部'}));await user.click(screen.getByRole('menuitemradio',{name:'实验室'}));expect(screen.getByRole('table')).toHaveTextContent('设备甲');await user.type(screen.getByRole('searchbox',{name:'搜索记录'}),'丙');expect(screen.getByRole('table')).toHaveTextContent('设备丙');await user.click(screen.getByRole('button',{name:'重置视图'}));expect(screen.getByRole('status')).toHaveTextContent('3 条记录');});
it('cycles sorting and keeps missing values last in both directions',async()=>{const user=userEvent.setup();render(<DataTable searchMode="always" filterMode="always" caption="设备" data={data} columns={columns} getRowId={r=>r.id}/>);const rowNames=()=>within(screen.getByRole('table')).getAllByRole('row').slice(1).map(r=>r.textContent);await user.click(screen.getByRole('button',{name:'声级'}));expect(rowNames().at(-1)).toContain('设备乙');await user.click(screen.getByRole('button',{name:'声级'}));expect(rowNames()[0]).toContain('设备丙');expect(rowNames().at(-1)).toContain('设备乙');await user.click(screen.getByRole('button',{name:'声级'}));expect(rowNames()[1]).toContain('设备乙');expect(screen.getByRole('columnheader',{name:'声级'})).toHaveAttribute('aria-sort','none');});
it('hides columns but preserves at least one and exposes pinned styling',async()=>{const user=userEvent.setup();const {container}=render(<DataTable searchMode="always" filterMode="always" caption="设备" data={data} columns={columns} getRowId={r=>r.id} columnVisibility stickyHeader maxHeight={240}/>);expect(container.querySelector('th[data-pinned]')).toHaveStyle({minWidth:'180px'});await user.click(screen.getByText('显示列'));await user.click(screen.getByRole('checkbox',{name:'声级'}));expect(screen.queryByRole('columnheader',{name:'声级'})).not.toBeInTheDocument();await user.click(screen.getByRole('checkbox',{name:'区域'}));expect(screen.getByRole('checkbox',{name:'设备'})).toBeDisabled();await user.click(screen.getByRole('button',{name:'重置视图'}));expect(screen.getByRole('columnheader',{name:'声级'})).toBeVisible();});
it('exports filtered records and only visible columns',async()=>{const user=userEvent.setup();const blobs:Blob[]=[];Object.defineProperty(URL,'createObjectURL',{configurable:true,value:vi.fn((b:Blob)=>{blobs.push(b);return 'blob:test';})});Object.defineProperty(URL,'revokeObjectURL',{configurable:true,value:vi.fn()});vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});render(<DataTable searchMode="always" filterMode="always" caption="设备" data={data} columns={columns} getRowId={r=>r.id} columnVisibility exportable pageSize={1}/>);await user.click(screen.getByRole('button',{name:'区域 全部'}));await user.click(screen.getByRole('menuitemradio',{name:'产线'}));await user.click(screen.getByText('显示列'));await user.click(screen.getByRole('checkbox',{name:'声级'}));await user.click(screen.getByRole('button',{name:'导出 CSV'}));expect(blobs).toHaveLength(1);const csv=await new Promise<string>(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.readAsText(blobs[0]);});expect(csv).toContain('设备乙');expect(csv).not.toContain('设备甲');expect(csv).not.toContain('声级');expect(screen.getByRole('status')).toHaveTextContent('已导出当前筛选的 1 条记录');expect(tableCsvCell('=1+1')).toBe('"\'=1+1"');expect(tableCsvCell(-20)).toBe('"-20"');});
it('replaces stale rows with loading or retryable errors',async()=>{const user=userEvent.setup();const retry=vi.fn();const {rerender}=render(<DataTable searchMode="always" filterMode="always" caption="设备" data={data} columns={columns} getRowId={r=>r.id} loading exportable/>);expect(screen.queryByRole('table')).not.toBeInTheDocument();expect(screen.getByRole('button',{name:'导出 CSV'})).toBeDisabled();rerender(<DataTable searchMode="always" filterMode="always" caption="设备" data={data} columns={columns} getRowId={r=>r.id} error="连接已断开" onRetry={retry}/>);expect(screen.getByRole('alert')).toHaveTextContent('连接已断开');await user.click(screen.getByRole('button',{name:'重试'}));expect(retry).toHaveBeenCalledOnce();});

it('adapts controls to source size and retains active filters after narrowing',async()=>{const user=userEvent.setup();const {rerender}=render(<DataTable caption="设备" data={data} columns={columns} getRowId={r=>r.id}/>);expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();expect(screen.queryByRole('button',{name:'重置视图'})).not.toBeInTheDocument();expect(screen.queryByRole('button',{name:'区域 全部'})).not.toBeInTheDocument();const many=Array.from({length:20},(_,i)=>({...data[i%3],id:String(i)}));rerender(<DataTable caption="设备" data={many.slice(0,10)} columns={columns} getRowId={r=>r.id}/>);expect(screen.getByRole('searchbox')).toBeVisible();expect(screen.queryByRole('button',{name:'区域 全部'})).not.toBeInTheDocument();rerender(<DataTable caption="设备" data={many} columns={columns} getRowId={r=>r.id}/>);await user.click(screen.getByRole('button',{name:'区域 全部'}));await user.click(screen.getByRole('menuitemradio',{name:'产线'}));expect(screen.getByRole('button',{name:'区域 产线'})).toBeVisible();expect(screen.getByRole('button',{name:'重置视图'})).toBeVisible();rerender(<DataTable caption="设备" data={many.slice(0,3)} columns={columns} getRowId={r=>r.id}/>);expect(screen.getByRole('button',{name:'区域 产线'})).toBeVisible();});

it.each([0,1,2,3])('hides the entire footer for %i rows fitting on one page',count=>{
 const {container}=render(<DataTable caption="设备" data={data.slice(0,count)} columns={columns} getRowId={r=>r.id} pageSize={3}/>);
 expect(container.querySelector('.cs-table-footer')).not.toBeInTheDocument();
 expect(screen.queryByRole('button',{name:'下一页'})).not.toBeInTheDocument();
 expect(screen.getByRole('status')).toHaveTextContent(`${count} 条记录`);
});
it('hides pagination after searching and restores it when the query is cleared',async()=>{
 const user=userEvent.setup();const {container}=render(<DataTable caption="设备" data={data} columns={columns} getRowId={r=>r.id} pageSize={2} searchMode="always"/>);
 expect(container.querySelector('.cs-table-footer')).toBeInTheDocument();
 await user.click(screen.getByRole('button',{name:'下一页'}));
 await user.type(screen.getByRole('searchbox',{name:'搜索记录'}),'丙');
 expect(container.querySelector('.cs-table-footer')).not.toBeInTheDocument();
 expect(screen.getByRole('table')).toHaveTextContent('设备丙');
 await user.clear(screen.getByRole('searchbox',{name:'搜索记录'}));
 expect(container.querySelector('.cs-table-footer')).toBeInTheDocument();
 expect(screen.getByText('1–2 / 3 条 · 第 1 / 2 页')).toBeVisible();
 await user.type(screen.getByRole('searchbox',{name:'搜索记录'}),'不存在');
 expect(container.querySelector('.cs-table-footer')).not.toBeInTheDocument();
 expect(screen.getByText('没有匹配记录')).toBeVisible();
});
it('keeps hidden selections clearable in the toolbar when filters leave one page',async()=>{
 const user=userEvent.setup();const onSelectionChange=vi.fn();const {container}=render(<DataTable caption="设备" data={data} columns={columns} getRowId={r=>r.id} pageSize={1} selectable filterMode="always" onSelectionChange={onSelectionChange}/>);
 await user.click(screen.getByRole('checkbox',{name:'选择记录 a'}));
 await user.click(screen.getByRole('button',{name:'下一页'}));
 await user.click(screen.getByRole('checkbox',{name:'选择记录 b'}));
 await user.click(screen.getByRole('button',{name:'区域 全部'}));
 await user.click(screen.getByRole('menuitemradio',{name:'产线'}));
 expect(container.querySelector('.cs-table-footer')).not.toBeInTheDocument();
 expect(screen.getByText('已选 2 条')).toBeVisible();
 expect(screen.getByRole('checkbox',{name:'选择记录 b'})).toBeChecked();
 await user.click(screen.getByRole('button',{name:'清除选择'}));
 expect(onSelectionChange).toHaveBeenLastCalledWith([]);
 expect(screen.queryByRole('button',{name:'清除选择'})).not.toBeInTheDocument();
 expect(screen.getByRole('checkbox',{name:'选择记录 b'})).not.toBeChecked();
});
it('clamps the page when data shrinks and hides the footer during pending or failed loads',async()=>{
 const user=userEvent.setup();const props={caption:'设备',columns,getRowId:(r:typeof data[number])=>r.id,pageSize:1};
 const {rerender,container}=render(<DataTable {...props} data={data}/>);
 await user.click(screen.getByRole('button',{name:'下一页'}));
 await user.click(screen.getByRole('button',{name:'下一页'}));
 rerender(<DataTable {...props} data={data.slice(0,2)}/>);
 expect(screen.getByText('2–2 / 2 条 · 第 2 / 2 页')).toBeVisible();
 rerender(<DataTable {...props} data={data.slice(0,1)}/>);
 expect(container.querySelector('.cs-table-footer')).not.toBeInTheDocument();
 expect(screen.getByRole('table')).toHaveTextContent('设备甲');
 rerender(<DataTable {...props} data={data} loading/>);
 expect(container.querySelector('.cs-table-footer')).not.toBeInTheDocument();
 rerender(<DataTable {...props} data={data} error="加载失败"/>);
 expect(container.querySelector('.cs-table-footer')).not.toBeInTheDocument();
 expect(screen.getByRole('alert')).toHaveTextContent('加载失败');
});
