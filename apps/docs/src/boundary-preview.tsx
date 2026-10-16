import { Button, Input, Card, CardBody, CardActions, Toolbar, ToolbarButton } from '../../../packages/ui/src/index';

export function BoundaryPreview() {
  return <section className="radius-foundations" aria-labelledby="boundary-preview-heading">
    <h3 id="boundary-preview-heading">边界使用 / 组件组合</h3>
    <p className="cs-help">页面分组使用标题与留白，卡片内部使用间距和单向分隔线，工具栏操作使用 Ghost。输入框与关键次级按钮保留清晰边界。</p>
    <Card title="测量任务" description="页面分组使用 plain，内部独立卡片保留一次边界" variant="plain">
      <CardBody><Card title="产线噪声检测" description="声学成像仪 01 · 待执行"><CardBody><Input label="任务名称" defaultValue="产线噪声检测"/><p className="cs-text cs-text--body">内容区通过间距分组，输入框保留清晰边界。</p></CardBody><CardActions><Toolbar label="测量任务操作"><ToolbarButton onClick={() => {window.location.hash = 'component/progress';}}>查看进度</ToolbarButton><ToolbarButton onClick={() => {window.location.hash = 'component/card';}}>任务详情</ToolbarButton><Button variant="secondary" onClick={() => {window.location.hash = 'component/input';}}>编辑配置</Button></Toolbar></CardActions></Card></CardBody>
    </Card>
    <p className="cs-help">阴影留给菜单、Popover、Dialog 等浮层；常规内容以表面和边界区分，不添加默认抬升动画。预览数据为演示数据。</p>
  </section>;
}
