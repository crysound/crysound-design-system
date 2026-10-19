import {Button,DataTable,Dialog,Progress,TableCellText,type DataColumn} from '../../../packages/ui/src/index';

export type BusinessView='cloud'|'resources'|'general';
type Value=string|number|null;
type DetailEntry=[string,Value];
function RecordDetail({id,title,entries}:{id:string;title:string;entries:DetailEntry[]}){
 return <Dialog title={title} description={`${id} · 本地合成示例`} trigger={<Button variant="ghost" size="sm" aria-label={`查看 ${id}`}>查看</Button>}><dl className="table-demo-detail">{entries.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value??'—'}</dd></div>)}</dl><p>用于验证表格组合；未连接云端服务或设备。</p></Dialog>;
}
function StateText({value}:{value:string}){return <span className="table-demo-state" data-tone={['失败','离线','需处理','已逾期'].includes(value)?'danger':['已完成','可用','已交付'].includes(value)?'success':'neutral'}><span aria-hidden="true">●</span>{value}</span>;}
function Capacity({value,label}:{value:number;label:string}){return <div className="table-demo-capacity"><span>{value}%</span><Progress value={value} label={label} showValue={false}/></div>;}
type CloudRow={id:string;name:string;project:string;device:string;type:string;files:number;size:number;progress:number;status:string;time:string};
const cloudRows:CloudRow[]=Array.from({length:16},(_,i)=>({id:`CL-${String(i+1).padStart(3,'0')}`,name:['空压站管路巡检','配电柜局放排查','车间阀门泄漏复检','厂界声源定位'][i%4],project:['华东工厂 / 一期','研发中心','南区能源站'][i%3],device:`声学成像仪 ${String(i%4+1).padStart(2,'0')}`,type:['气体泄漏','局部放电','气体泄漏','环境声源'][i%4],files:8+i*3,size:128+i*37,progress:[100,72,0,100,38][i%5],status:['已完成','分析中','待上传','失败','上传中'][i%5],time:`10-19 ${String(8+Math.floor(i/4)).padStart(2,'0')}:${String(i%4*15).padStart(2,'0')}`}));
const cloudColumns:DataColumn<CloudRow>[]=[
 {id:'name',header:'任务 / 编号',accessor:r=>r.name,pinned:true,width:230,sortable:true,cell:r=><TableCellText description={r.id}>{r.name}</TableCellText>},
 {id:'project',header:'项目',accessor:r=>r.project,filterable:true,sortable:true,width:170},
 {id:'type',header:'检测类型',accessor:r=>r.type,filterable:true,width:130},
 {id:'status',header:'云端状态',accessor:r=>r.status,filterable:true,width:120,cell:r=><StateText value={r.status}/>},
 {id:'progress',header:'处理进度',accessor:r=>r.progress,align:'right',width:150,cell:r=>r.status==='失败'?<TableCellText description="文件校验失败">已中断</TableCellText>:r.status==='待上传'?<span className="table-demo-muted">等待上传</span>:<Capacity value={r.progress} label={`${r.id} 处理进度`}/>},
 {id:'files',header:'文件 / 个',accessor:r=>r.files,align:'right',sortable:true,width:110},
 {id:'size',header:'数据量 / MB',accessor:r=>r.size,align:'right',sortable:true,width:130},
 {id:'time',header:'更新时间',accessor:r=>r.time,sortable:true,width:140},
 {id:'action',header:'操作',align:'center',accessor:r=>r.id,exportable:false,width:90,cell:r=><RecordDetail id={r.id} title="声像任务详情" entries={[["任务",r.name],["项目",r.project],["采集设备",r.device],["检测类型",r.type],["云端状态",r.status],["文件数量",r.files],["数据量",`${r.size} MB`],["异常说明",r.status==='失败'?'文件校验失败，请在消费应用中重新上传':'—']]}/>},
];
type ResourceRow={id:string;name:string;group:string;type:string;cores:number;load:number|null;used:number;capacity:number;status:string;task:string};
const resourceRows:ResourceRow[]=Array.from({length:14},(_,i)=>({id:`RS-${String(i+1).padStart(3,'0')}`,name:['声像分析节点','测量采集工作站','报告生成节点','归档存储节点'][i%4]+` ${String(Math.floor(i/4)+1).padStart(2,'0')}`,group:['云端分析','实验室采集','数据归档'][i%3],type:i%4===3?'存储节点':i%4===1?'工作站':'计算节点',cores:[16,8,12,4][i%4],load:i===5?null:[32,74,96,18,108][i%5],used:120+i*23,capacity:1024,status:i===5?'离线':i%5===4?'需处理':'可用',task:i===5?'—':['声像批处理','噪声采集','报告编排','历史文件归档'][i%4]}));
const resourceColumns:DataColumn<ResourceRow>[]=[
 {id:'name',header:'资源 / 编号',accessor:r=>r.name,sortable:true,pinned:true,width:230,cell:r=><TableCellText description={r.id}>{r.name}</TableCellText>},
 {id:'group',header:'资源组',accessor:r=>r.group,filterable:true,width:140},
 {id:'type',header:'类型',accessor:r=>r.type,filterable:true,width:120},
 {id:'status',header:'连接状态',accessor:r=>r.status,filterable:true,width:130,cell:r=><StateText value={r.status}/>},
 {id:'cores',header:'CPU / 核',accessor:r=>r.cores,align:'right',sortable:true,width:110},
 {id:'load',header:'负载 / %',accessor:r=>r.load,align:'right',sortable:true,width:150,cell:r=>r.load===null?<span className="table-demo-muted">— 无读数</span>:<div className="table-demo-load" data-warning={r.load>90||undefined}><Capacity value={r.load} label={`${r.id} 负载占比`}/>{r.load>100&&<small>超过基准容量</small>}</div>},
 {id:'used',header:'存储已用 / GB',accessor:r=>r.used,align:'right',sortable:true,width:150},
 {id:'task',header:'当前任务',accessor:r=>r.task,width:160},
 {id:'action',header:'操作',align:'center',accessor:r=>r.id,exportable:false,width:90,cell:r=><RecordDetail id={r.id} title="资源详情" entries={[["资源",r.name],["资源组",r.group],["连接状态",r.status],["CPU",`${r.cores} 核`],["模拟负载",r.load===null?null:`${r.load}%`],["存储",`${r.used} / ${r.capacity} GB`],["当前任务",r.task]]}/>},
];
type GeneralRow={id:string;name:string;department:string;owner:string;priority:string;status:string;due:string;budget:number};
const generalRows:GeneralRow[]=Array.from({length:15},(_,i)=>({id:`PR-${String(i+1).padStart(3,'0')}`,name:['季度设备校准','实验室环境改造','采集终端采购','质量文档整理','测试流程评审'][i%5],department:['研发','质量','运营'][i%3],owner:['陈工','林工','王工','周工'][i%4],priority:['常规','高','低'][i%3],status:['进行中','待开始','已交付','已逾期'][i%4],due:`2026-10-${String(19+i%12).padStart(2,'0')}`,budget:1200+i*850}));
const generalColumns:DataColumn<GeneralRow>[]=[
 {id:'name',header:'事项 / 编号',accessor:r=>r.name,pinned:true,sortable:true,width:230,cell:r=><TableCellText description={r.id}>{r.name}</TableCellText>},
 {id:'department',header:'部门',accessor:r=>r.department,filterable:true,width:110},
 {id:'owner',header:'负责人',accessor:r=>r.owner,filterable:true,width:110},
 {id:'priority',header:'优先级',accessor:r=>r.priority,filterable:true,width:110},
 {id:'status',header:'状态',accessor:r=>r.status,filterable:true,width:120,cell:r=><StateText value={r.status}/>},
 {id:'due',header:'截止日期',accessor:r=>r.due,sortable:true,width:150},
 {id:'budget',header:'预算 / CNY',accessor:r=>r.budget,align:'right',sortable:true,width:140,cell:r=>r.budget.toLocaleString('zh-CN')},
 {id:'action',header:'操作',align:'center',accessor:r=>r.id,exportable:false,width:90,cell:r=><RecordDetail id={r.id} title="事项详情" entries={[["事项",r.name],["负责人",r.owner],["部门",r.department],["状态",r.status],["截止日期",r.due],["预算",`¥${r.budget.toLocaleString('zh-CN')}`]]}/>},
];
export function BusinessTable({view,state,onRetry,onSelectionChange}:{view:BusinessView;state:string;onRetry:()=>void;onSelectionChange:(ids:string[])=>void}){
 const props={selectable:true,columnVisibility:true,exportable:true,stickyHeader:true,maxHeight:420,pageSize:6,loading:state==='loading',error:state==='error'?'演示数据加载失败，请重试。':undefined,onRetry,onSelectionChange,searchPlaceholder:'搜索名称、编号或字段内容…'};
 if(view==='cloud')return <DataTable {...props} caption="声像云端任务列表" columns={cloudColumns} data={state==='empty'?[]:cloudRows} getRowId={r=>r.id}/>;
 if(view==='resources')return <DataTable {...props} caption="设备与算力资源列表" columns={resourceColumns} data={state==='empty'?[]:resourceRows} getRowId={r=>r.id}/>;
 return <DataTable {...props} caption="通用项目事项列表" columns={generalColumns} data={state==='empty'?[]:generalRows} getRowId={r=>r.id}/>;
}
