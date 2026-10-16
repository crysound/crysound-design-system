import { Heading, Text, Button } from '../../../packages/ui/src/index';
const roles = [
  ['页面标题', 'Heading · page', '28 / 36', 'semibold', '一个页面的主要标题'],
  ['区块标题', 'Heading · section', '20 / 28', 'semibold', '弹窗标题、主要内容分组'],
  ['小节标题', 'Heading · subsection', '16 / 24', 'medium', '卡片、列表分组'],
  ['说明正文', 'Text · lead', '16 / 26', 'normal', '长说明、阅读型页面'],
  ['界面正文', 'Text · body', '14 / 22', 'normal', '默认内容、列表描述'],
  ['控件标签', 'Text · label', '14 / 20', 'medium', '短标签；真实表单使用组件自带 label'],
  ['辅助信息', 'Text · caption', '12 / 18', 'normal', '时间、单位、补充元数据'],
];
export function TypographyFoundations() {
  return <section className="radius-foundations" aria-labelledby="typography-heading">
    <h3 id="typography-heading">文字角色 / Typography roles</h3><p>优先按信息职责调用完整样式，不从字号表中逐个挑选。以下字号与行高组合是 CRYSOUND 工程建议；默认管理界面以 14px 正文为基线，阅读说明使用 16px。</p>
    <div className="type-role-preview"><Heading level={3} variant="page">设备连接已中断</Heading><Text variant="lead" tone="muted">当前测量已暂停。已采集的数据仍然保留，重新连接设备后可继续操作。</Text><div className="type-role-group"><Heading level={4} variant="subsection">接下来可以做什么</Heading><Text>检查设备供电与通信线路，确认网络连接正常。</Text><Text variant="caption" tone="muted">声学成像仪 01 · 实验室 A</Text></div><Button>重新连接</Button></div>
    <div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">语义文字角色矩阵，字号和行高单位为 px</caption><thead><tr><th>角色</th><th>调用方式</th><th>字号 / 行高</th><th>字重</th><th>用途</th></tr></thead><tbody>{roles.map(row => <tr key={row[0]}>{row.map((cell,index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
    <div className="glass-guidelines type-role-rules"><div><h4>一屏保持克制</h4><p>常规界面优先使用正文、辅助信息和一档局部标题；页面主标题只承担最高层级。不要把每个字段、按钮和状态都做大或加粗。</p></div><div><h4>标题语义不等于字号</h4><p>Heading 的 level 决定 h1–h6，variant 决定视觉角色。嵌入卡片或弹窗时保留正确文档层级，不为调整大小跳过标题级别。</p></div><div><h4>间距负责分组</h4><p>标题与说明建议 8px，内容分组 24px，段落 12px。组件自身维护内部间距；Text 默认无外边距，由布局容器控制。</p></div><div><h4>接入后仍需验收</h4><p>同时导入 tokens.css 和 styles.css；避免全局 h1、p、button 重置覆盖组件。检查长中文、英文、200% 缩放、窄屏和浮层主题继承。</p></div></div>
    <details className="glass-code"><summary>推荐接入方式</summary><pre className="space-code"><code>{`import { Heading, Text } from '@crysound/ui';\nimport '@crysound/tokens/tokens.css';\nimport '@crysound/ui/styles.css';\n\n<Heading level={1}>工作台</Heading>\n<Text variant="body">今天的运行概况</Text>\n<Text variant="caption" tone="muted">更新于 09:30</Text>\n\n/* 使用文字角色，不另写 font-size / line-height / font-weight。 */`}</code></pre></details>
  </section>;
}
