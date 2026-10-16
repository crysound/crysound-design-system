import { ResourceCardDemo } from "./resource-card-demo";
import { MetricGroupDemo } from "./metric-group-demo";
import { SchedulingTableExample } from "./scheduling-table-example";
import { WebsiteReference } from "./website-reference";
import { useState } from 'react';
import { FilterToolbar, QuotaCard, DetailPanel, FormDialog, Button, Input, Select, Checkbox } from '../../../packages/ui/src/index';

export function CompositionExamples({only}: {only?: string}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [state, setState] = useState<'ready'|'loading'|'empty'|'error'>('ready');
  const [fail, setFail] = useState(false);
  const [name, setName] = useState('产线声学检测');
  return <div className="composition-examples">
    {(!only || only === "filter-toolbar") && <section><h4>筛选工具栏</h4><FilterToolbar label="任务筛选" query={query} onQueryChange={setQuery} placeholder="搜索任务名称" onReset={() => {setQuery('');setStatus('all');}} filters={<Select label="任务状态" value={status} onChange={event => setStatus(event.target.value)}><option value="all">全部状态</option><option value="ready">待执行</option><option value="running">进行中</option></Select>}/><p className="cs-help" role="status">{query ? `搜索：${query}` : '未设置搜索条件'} · {status === 'all' ? '全部状态' : status === 'ready' ? '待执行' : '进行中'}</p></section>}
    {(!only || only === "quota-card") && <section><h4>额度卡片</h4><div className="composition-preview-control"><Select label="预览状态" value={state} onChange={event => setState(event.target.value as typeof state)}><option value="ready">正常</option><option value="loading">加载中</option><option value="empty">空数据</option><option value="error">错误</option></Select></div><QuotaCard title="工作账号 A" description="专业版 · 工作账号" status={<span className="cs-muted">在线</span>} state={state} quotas={[{id:'week',label:'本周剩余额度',remaining:59,reset:'下周重置'},{id:'session',label:'当前周期剩余额度',remaining:62,reset:'16:09 重置'}]} onRetry={() => setState('ready')}/></section>}
    {(!only || only === "detail-panel") && <section><h4>详情面板与长内容</h4><DetailPanel title={name} description="状态与字段遵循独立文字角色" status={<span className="cs-muted">待执行</span>} fields={[{id:'device',label:'设备',value:'声学成像仪 01'},{id:'id',label:'任务标识',value:'CRYSOUND-OpenTest-production-acoustic-analysis-20261016-000000123456789'},{id:'rate',label:'采样率',value:'48,000 Hz'},{id:'note',label:'说明',value:'长说明保持自然换行，不为了压缩卡片而截断错误信息或关键参数。'}]}/></section>}
    {(!only || only === "form-dialog") && <section><h4>表单弹窗与失败重试</h4><Checkbox label="模拟保存失败" checked={fail} onCheckedChange={value => setFail(value === true)}/><FormDialog title="编辑测量任务" description="填写名称并保存。演示仅更新当前页面，不发送网络请求。" trigger={<Button variant="secondary">编辑任务</Button>} onSubmit={data => {if(fail) throw new Error('演示保存失败，请关闭模拟失败后重试。');setName(String(data.get('name')));}}><Input label="任务名称" name="name" required defaultValue={name}/><p className="cs-help">业务验证和请求由消费项目提供，弹窗处理提交、错误展示和焦点返回。</p></FormDialog></section>}
  </div>;
}
export function CompositionFoundations() {
  return <section className="radius-foundations" aria-labelledby="composition-heading">
    <h3 id="composition-heading">组合模板与视觉验收</h3><p className="cs-help">四个共享组合提供稳定布局；演示不包含硬件协议、账号鉴权或业务 API。下面的布局数值为工程建议。</p>
    <h4>指标摘要 · 统一组合</h4><MetricGroupDemo/>
    <p className="cs-help">借鉴 open-claude-ui 的文字角色、弱边界和等宽数字思路；该仓库未提供这组业务指标模板，下面为 CRYSOUND 组合适配。</p>
    <CompositionExamples/>
    <section className="radius-foundations"><h4>资源链接卡片 · Hover 与键盘聚焦</h4><p className="cs-help">适用于官网资源入口。鼠标移动或使用Tab查看同组表面变化；焦点环与悬停背景分别承担定位和反馈。</p><ResourceCardDemo/></section>
    <SchedulingTableExample/>
    <WebsiteReference/>
    <h4>基础状态验收</h4><div className="composition-state-row"><Button variant="secondary">默认 / 悬停 / 键盘焦点</Button><Button loading>处理中</Button><Button disabled>暂无权限</Button></div><Input label="错误状态示例" error="请填写任务名称。" aria-label="错误状态示例"/>

    <details className="foundation-reference"><summary>组件组合规则：从零件到完整区域</summary><ul><li>指标组：一块表面承载3–5个同级指标；标签、数值、单位、备注各用固定文字角色，缺少备注时保留对齐空间。</li><li>表单与Checkbox：控件与首行标签对齐，多行帮助放在标签下方；同组选择项统一间距，不让说明改变控件位置。</li><li>标题与操作：标题承担分组，次级操作用ToolbarButton；不要让所有文字和操作都变成品牌色粗体。</li><li>卡片内部分组：优先间距与单向分隔线；输入框保留必要边界，不堆叠阴影和闭合框。</li><li>同一信息带共用数字格式、单位位置和状态语义；不要用字体大小代替重要性判断。</li><li>先看实际组合的长内容、明暗主题和窄容器，再确认单个组件参数。参考仓库为社区整理，参数不视为官方标准。</li></ul></details>
    <h4>布局与长内容规则</h4>
    <div className="cs-table-scroll"><table className="cs-table"><thead><tr><th>场景</th><th>默认建议</th><th>验收重点</th></tr></thead><tbody>{[
      ['工作台布局','区块间距24px；卡片内容间距16px；标准控件40px、紧凑32px','窄屏换行，不把正文一起缩小'],
      ['官网内容','展示区按容器限宽；阅读正文16/26，中文约30–44字/行','大屏不把正文横向铺满'],
      ['筛选工具栏','搜索可伸缩，筛选与操作间距8–12px','各控件底部对齐；窄屏分行'],
      ['长内容','名称和ID允许安全折行，数字使用等宽数字特性','单位与数字完整；错误和必要说明不截断'],
      ['预览截断','仅用于可打开完整内容的列表摘要','必须提供查看完整内容的入口'],
    ].map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    <details className="foundation-reference"><summary>状态与主题验收清单</summary><ul><li>正常、悬停、按压、键盘焦点、加载、禁用、错误、空数据分别验证。</li><li>错误必须可恢复；加载不能重复提交；未知额度不得显示为0%。</li><li>亮色、深色、客户主题检查正文、边界、进度和浮层；主题设在根元素并传播到Portal。</li><li>320px窄屏、200%缩放、长中文与英文ID检查溢出；Tab/Shift+Tab、Esc及关闭后焦点返回检查。</li><li>系统减少动态效果时无位移和呼吸；触摸设备不依赖hover获取必要信息。</li></ul></details>
    <details className="foundation-reference"><summary>消费项目接入</summary><pre className="space-code"><code>{`import { FilterToolbar, QuotaCard, DetailPanel, FormDialog } from '@crysound/ui';
import '@crysound/tokens/tokens.css';
import '@crysound/ui/styles.css';

// 在 HTML 根元素设置主题，浮层同样继承。
document.documentElement.dataset.theme = 'dark';
// 将 query、filters、提交请求放在消费项目；不要全局重置组件字号。
// CSS 顺序：项目 reset → tokens → UI styles → 有范围的项目覆盖。`}</code></pre></details>
    <details className="foundation-reference"><summary>圆角迁移清单</summary><p className="cs-help">控件4px、Popover8px、胶囊与圆形已落实；Card和Dialog当前仍为4px，建议8/16px尚未全局迁移。独立内容面板12px与官网展示20px按场景采用，不宣称已全库统一。</p></details>
    <details className="foundation-reference"><summary>动效使用表</summary><div className="cs-table-scroll"><table className="cs-table"><thead><tr><th>类型</th><th>使用规则</th></tr></thead><tbody><tr><td>默认</td><td>按钮轻按压、Tab指示器、Accordion展开、浮层进出、附件新增淡入</td></tr><tr><td>可选</td><td>真实加载时骨架扫光；明确状态变化时成功反馈；按需弹簧预设</td></tr><tr><td>禁止作为默认</td><td>文字晕开、静态卡片抬升、在线状态持续呼吸、整列表重复入场</td></tr></tbody></table></div></details>
  </section>;
}
