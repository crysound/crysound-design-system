import { Heading, Text, Button } from '../../../packages/ui/src/index';
const roles = [
  ['官网页面标题', 'Heading · display', '36 / 44', 'semibold', 'CRYSOUND、OpenTest 官网页面与常规首屏'],
  ['官网区域标题', 'Heading · marketing-section', '30 / 40', 'semibold', '官网产品、方案、功能分区'],
  ['重点导语', 'Text · intro', '18 / 28', 'normal', '官网导语、重点说明；建议 2–3 行'],
  ['页面标题', 'Heading · page', '24 / 32', 'semibold', '工作台页面标题；官网卡片标题'],
  ['区块标题', 'Heading · section', '20 / 28', 'semibold', '弹窗标题、主要内容分组'],
  ['小节标题', 'Heading · subsection', '16 / 24', 'medium', '卡片、列表分组'],
  ['说明正文', 'Text · lead', '16 / 26', 'normal', '长说明、阅读型页面'],
  ['界面正文', 'Text · body', '14 / 22', 'normal', '默认内容、列表描述'],
  ['控件标签', 'Text · label', '14 / 20', 'medium', '短标签；真实表单使用组件自带 label'],
  ['辅助信息', 'Text · caption', '12 / 18', 'normal', '时间、单位、补充元数据'],
];
export function TypographyFoundations() {
  return <section className="radius-foundations" aria-labelledby="typography-heading">
    <h3 id="typography-heading">文字角色 / Typography roles</h3><p>优先按信息职责调用完整样式，不从字号表中逐个挑选。基础字号统一为 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36px，由用户确认采用；行高与组合规则为待真实页面验证的工程建议，并非 Claude 或 Codex 官方参数。默认管理界面以 14px 正文为基线，阅读说明使用 16px。</p>
    <div className="type-role-preview"><Heading level={3} variant="page">设备连接已中断</Heading><Text variant="lead" tone="muted">当前测量已暂停。已采集的数据仍然保留，重新连接设备后可继续操作。</Text><div className="type-role-group"><Heading level={4} variant="subsection">接下来可以做什么</Heading><Text>检查设备供电与通信线路，确认网络连接正常。</Text><Text variant="caption" tone="muted">声学成像仪 01 · 实验室 A</Text></div><Button>重新连接</Button></div>
    <div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">语义文字角色矩阵，字号和行高单位为 px</caption><thead><tr><th>角色</th><th>调用方式</th><th>字号 / 行高</th><th>字重</th><th>用途</th></tr></thead><tbody>{roles.map(row => <tr key={row[0]}>{row.map((cell,index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
    <div className="glass-guidelines type-role-rules"><div><h4>一屏保持克制</h4><p>常规界面优先使用正文、辅助信息和一档局部标题；页面主标题只承担最高层级。不要把每个字段、按钮和状态都做大或加粗。</p></div><div><h4>标题语义不等于字号</h4><p>Heading 的 level 决定 h1–h6，variant 决定视觉角色。嵌入卡片或弹窗时保留正确文档层级，不为调整大小跳过标题级别。</p></div><div><h4>间距负责分组</h4><p>标题与说明建议 8px，内容分组 24px，段落 12px。组件自身维护内部间距；Text 默认无外边距，由布局容器控制。</p></div><div><h4>接入后仍需验收</h4><p>同时导入 tokens.css 和 styles.css；避免全局 h1、p、button 重置覆盖组件。检查长中文、英文、200% 缩放、窄屏和浮层主题继承。</p></div></div>
    <div className="glass-guidelines type-role-rules"><div><h4>官网展示</h4><p>CRYSOUND、OpenTest 官网：页面标题 36/44，区域标题 30/40，卡片标题 24/32，正文 16/26，辅助文字 14/20。大型品牌首屏超过 36px 时单独评审扩展。</p></div><div><h4>工作台与排程</h4><p>声像云端、运营排程：页面标题 24/32，区域标题 20/28，卡片标题 16/24，正文 14/22，元数据 12/18。紧凑模式仅压缩布局和控件高度，控件文字保持 14/20。</p></div><div><h4>阅读长度</h4><p>16/26 中文正文建议每行约 30–44 字，每段约 3–5 行；14/22 长说明每行约 28–40 字。移动端自然换行；必要说明不按行数截断。</p></div><div><h4>文字组合</h4><p>卡片优先标题、正文、辅助三层。短标签用 14/20，多行正文用 14/22；阅读段间距建议 16px，界面段间距建议 12px。</p></div></div>
    <details className="glass-code"><summary>推荐接入方式</summary><pre className="space-code"><code>{`import { Heading, Text } from '@crysound/ui';\nimport '@crysound/tokens/tokens.css';\nimport '@crysound/ui/styles.css';\n\n<Heading level={1}>工作台</Heading>\n<Text variant="body">今天的运行概况</Text>\n<Text variant="caption" tone="muted">更新于 09:30</Text>\n\n/* 使用文字角色，不另写 font-size / line-height / font-weight。 */`}</code></pre></details>
  </section>;
}
