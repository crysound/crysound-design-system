import { Button, Card } from '../../../packages/ui/src/index';
const radii = [
  ['none', '--cs-radius-none', '0px', '直角', '表格拼接、贴边区域', '扩展建议'],
  ['sm', '--cs-radius-sm', '2px', '微圆角', '软件微控件、小型指示条', '软件来源记录'],
  ['default', '--cs-radius', '4px', '默认', '按钮、输入框、选择器', 'Figma 变量依据'],
  ['md', '--cs-radius-md', '6px', '中等', '菜单项、工具栏内部操作', '扩展建议'],
  ['lg', '--cs-radius-lg', '8px', '容器', '卡片、常规浮层', '扩展建议'],
  ['10', '--cs-radius-10', '10px', '过渡容器', '需要介于 8 与 12px 的容器', '用户指定档位'],
  ['xl', '--cs-radius-xl', '12px', '大容器', '复杂选择面板、独立内容面板', '扩展建议'],
  ['2xl', '--cs-radius-2xl', '16px', '大型面板', '大型弹层、独立内容卡片', '用户指定档位'],
  ['3xl', '--cs-radius-3xl', '20px', '强调容器', '大尺寸展示区域、营销容器', '用户指定档位'],
  ['pill', '--cs-radius-pill', '99999px', '胶囊', '开关轨道、胶囊标签', '扩展建议'],
  ['circle', '--cs-radius-circle', '50%', '圆形', '头像、单选框、状态点', '扩展建议'],
] as const;

export function RadiusFoundations() {
  return <section className="radius-foundations" aria-labelledby="radius-heading">
    <div className="space-section-heading"><h3 id="radius-heading">圆角矩阵 / Radius</h3><p>以 4px 为默认控件圆角。按组件职责选择档位，紧凑与舒适密度保持相同圆角。下列场景是使用建议，不代表所有既有组件已完成迁移。</p></div>
    <div className="radius-scale">{radii.map(([name, token, value, label]) => <figure key={name}><div className={`radius-sample${name === 'circle' ? ' radius-sample--circle' : ''}`} style={{borderRadius: `var(${token})`}} aria-hidden="true" /><figcaption><strong>{label}</strong><span>{value}</span><code>{token}</code></figcaption></figure>)}</div>
    <div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">圆角 Token 与使用场景</caption><thead><tr><th>档位</th><th>Token</th><th>值</th><th>建议场景</th><th>依据</th></tr></thead><tbody>{radii.map(([name, token, value, , usage, source]) => <tr key={name}><td>{name}</td><td><code>{token}</code></td><td>{value}</td><td>{usage}</td><td>{source}</td></tr>)}</tbody></table></div>
    <p className="cs-help">胶囊使用大半径，圆形使用 50% 且宽高相等。嵌套容器可按“内圆角 ≈ 外圆角 − 内距”判断，最小为 0；不要将圆角档位逐层累加。客户主题可覆盖 Token，并在明暗模式下保持结构一致。</p>
    <h4>组件默认圆角与建议映射</h4>
    <p className="cs-help">当前默认来自共享组件样式；建议值用于后续迁移，不会在本次文档补充中改变组件。客户主题覆盖后的实际值以 Token 为准。</p>
    <div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">组件当前圆角与推荐值</caption><thead><tr><th>组件 / 职责</th><th>当前默认</th><th>建议映射</th><th>应用场景</th></tr></thead><tbody>{[
      ['Button、Input、Select', '4px · --cs-radius', '保持 4px', '工作台、表单与官网通用控件'],
      ['Card', '4px · --cs-radius', '8px · --cs-radius-lg（建议）', '工作台内容卡片'],
      ['Popover、DropdownMenu', '8px · --cs-radius-lg', '保持 8px', '常规浮层'],
      ['Tabs pill：外框 / 内项', '8px / 4px', '保持 8px / 4px', '分段选项，内距 4px'],
      ['Dialog', '4px · --cs-radius', '16px · --cs-radius-2xl（建议）', '独立模态弹窗'],
      ['独立内容面板', '按具体组件实现', '12px · --cs-radius-xl（建议）', '文件、代码与复杂预览'],
      ['官网展示容器', '消费项目定义', '20px · --cs-radius-3xl（建议）', '大型产品与方案展示'],
      ['Switch / Avatar', '胶囊 / 50%', '保持形态角色', '开关轨道 / 等宽高头像'],
    ].map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    <h4>圆角组合实景</h4>
    <p className="cs-help">以下容器采用建议值展示搭配，按钮复用真实共享组件。预览不代表全库已迁移。</p>
    <div className="radius-scenes">
      <article><h5>卡片内按钮</h5><Card title="设备状态" description="声学成像仪 · 实验室 A" style={{borderRadius:'var(--cs-radius-lg)'}}><p className="cs-text cs-text--body">设备在线，可开始配置测量任务。</p><Button variant="secondary" onClick={() => {window.location.hash = 'component/button';}}>查看按钮组件</Button></Card><p className="cs-help">卡片 8px · 按钮 4px。按钮保留自身角色，不按卡片内距计算圆角。</p></article>
      <article><h5>弹窗内面板</h5><section className="radius-dialog-scene" aria-label="弹窗布局静态示意"><h6>确认测量配置</h6><p className="cs-text cs-text--body">执行前核对设备与采集参数。</p><div className="radius-inner-panel"><strong>当前配置</strong><p>声学成像仪 01 · 48 kHz</p></div></section><p className="cs-help">静态示意：外层 16px、内距 8px、内面板 8px；真实 Dialog 当前仍为 4px。</p></article>
      <article><h5>官网展示容器</h5><section className="radius-marketing-scene" aria-label="官网产品展示示意"><span className="cs-text cs-text--caption">CRYSOUND · 声学测试</span><h6>让声音成为可见的洞察</h6><div className="radius-product-panel">产品与方案展示</div></section><p className="cs-help">外层 20px · 内距 8px · 内面板 12px。仅用于大型展示区域，不套用到所有卡片。</p></article>
    </div>
    <p className="cs-help">等距、轮廓平行的嵌套容器可参考：内圆角 ≈ max(0, 外圆角 − 内距)。这里的内距指两条轮廓间的实际距离，需考虑边框。独立按钮与输入框遵循控件角色；2px、10px保留为例外档位，不按父容器自动推导。</p>
    <pre className="space-code"><code>{`.panel { border-radius: var(--cs-radius-lg); }\n.control { border-radius: var(--cs-radius); }\n.avatar { width: 32px; height: 32px; border-radius: var(--cs-radius-circle); }`}</code></pre>
  </section>;
}
