import { Button, Input, Card, CardBody, CardActions, Toolbar, ToolbarButton } from '../../../packages/ui/src/index';

function AccountExample({quiet}: {quiet: boolean}) {
  return <section className={`boundary-demo ${quiet ? 'boundary-demo--quiet' : 'boundary-demo--framed'}`} aria-label={quiet ? '建议效果' : '调整前示意'}>
    <header className="boundary-demo-heading"><div><h4>账号管理</h4><p>查看额度与连接状态</p></div><Button variant={quiet ? 'ghost' : 'secondary'} onClick={() => {window.location.hash = 'component/button';}}>管理</Button></header>
    <div className="boundary-account">
      <header><strong>工作账号 A</strong><span className="boundary-plan">专业版</span><span className="boundary-status">● 在线</span></header>
      <div className="boundary-quota"><div><span>本周剩余额度</span><strong>59%</strong></div><progress value={59} max={100} aria-label="本周剩余额度"/><p>10 月 22 日重置</p></div>
      <div className="boundary-quota"><div><span>5 小时剩余额度</span><strong>62%</strong></div><progress value={62} max={100} aria-label="5 小时剩余额度"/><p>16:09 重置</p></div>
      <div className="boundary-tools"><Button variant={quiet ? 'ghost' : 'secondary'} onClick={() => {window.location.hash = 'component/progress';}}>查看用量</Button><Button variant={quiet ? 'ghost' : 'secondary'} onClick={() => {window.location.hash = 'component/card';}}>账号详情</Button></div>
    </div>
    <div className="boundary-form"><Input label="账号备注" placeholder="例如：测试环境"/><Button variant="secondary" onClick={() => {window.location.hash = 'component/input';}}>查看表单组件</Button></div>
  </section>;
}
export function BoundaryPreview() {
  return <section className="radius-foundations" aria-labelledby="boundary-preview-heading">
    <h3 id="boundary-preview-heading">边界使用 / 效果对比</h3>
    <p className="cs-help">同一组内容对比边界与层级。右侧展示采用的组合规则；输入框和关键次级操作仍保留边界。</p>
    <div className="boundary-comparison"><div><h4>调整前示意</h4><p className="cs-help">外框、卡片、操作区反复描边，内容卡片附带阴影。</p><AccountExample quiet={false}/></div><div><h4>建议效果</h4><p className="cs-help">标题与留白分组、卡片内使用分隔线、工具栏使用 Ghost。</p><AccountExample quiet/></div></div>
    <h4>共享组件接入示例</h4>
    <Card title="测量任务" description="页面分组使用 plain，内部独立卡片保留一次边界" variant="plain">
      <CardBody><Card title="产线噪声检测" description="声学成像仪 01 · 待执行"><CardBody><Input label="任务名称" defaultValue="产线噪声检测"/><p className="cs-text cs-text--body">内容区通过间距分组，输入框保留清晰边界。</p></CardBody><CardActions><Toolbar label="测量任务操作"><ToolbarButton onClick={() => {window.location.hash = 'component/progress';}}>查看进度</ToolbarButton><ToolbarButton onClick={() => {window.location.hash = 'component/card';}}>任务详情</ToolbarButton><Button variant="secondary" onClick={() => {window.location.hash = 'component/input';}}>编辑配置</Button></Toolbar></CardActions></Card></CardBody>
    </Card>
    <p className="cs-help">阴影留给菜单、Popover、Dialog 等浮层；常规内容以表面和边界区分，不添加默认抬升动画。预览数据为演示数据。</p>
  </section>;
}
