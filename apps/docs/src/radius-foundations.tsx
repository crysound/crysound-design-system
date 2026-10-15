const radii = [
  ['none', '--cs-radius-none', '0px', '直角', '表格拼接、贴边区域', '扩展建议'],
  ['sm', '--cs-radius-sm', '2px', '微圆角', '软件微控件、小型指示条', '软件来源记录'],
  ['default', '--cs-radius', '4px', '默认', '按钮、输入框、选择器', 'Figma 变量依据'],
  ['md', '--cs-radius-md', '6px', '中等', '菜单项、工具栏内部操作', '扩展建议'],
  ['lg', '--cs-radius-lg', '8px', '容器', '卡片、常规浮层', '扩展建议'],
  ['xl', '--cs-radius-xl', '12px', '大容器', '复杂选择面板、独立内容面板', '扩展建议'],
  ['pill', '--cs-radius-pill', '9999px', '胶囊', '开关轨道、胶囊标签', '扩展建议'],
  ['circle', '--cs-radius-circle', '50%', '圆形', '头像、单选框、状态点', '扩展建议'],
] as const;

export function RadiusFoundations() {
  return <section className="radius-foundations" aria-labelledby="radius-heading">
    <div className="space-section-heading"><h3 id="radius-heading">圆角矩阵 / Radius</h3><p>以 4px 为默认控件圆角。按组件职责选择档位，紧凑与舒适密度保持相同圆角。下列场景是使用建议，不代表所有既有组件已完成迁移。</p></div>
    <div className="radius-scale">{radii.map(([name, token, value, label]) => <figure key={name}><div className={`radius-sample${name === 'circle' ? ' radius-sample--circle' : ''}`} style={{borderRadius: `var(${token})`}} aria-hidden="true" /><figcaption><strong>{label}</strong><span>{value}</span><code>{token}</code></figcaption></figure>)}</div>
    <div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">圆角 Token 与使用场景</caption><thead><tr><th>档位</th><th>Token</th><th>值</th><th>建议场景</th><th>依据</th></tr></thead><tbody>{radii.map(([name, token, value, , usage, source]) => <tr key={name}><td>{name}</td><td><code>{token}</code></td><td>{value}</td><td>{usage}</td><td>{source}</td></tr>)}</tbody></table></div>
    <p className="cs-help">胶囊使用大半径，圆形使用 50% 且宽高相等。嵌套容器可按“内圆角 ≈ 外圆角 − 内距”判断，最小为 0；不要将圆角档位逐层累加。客户主题可覆盖 Token，并在明暗模式下保持结构一致。</p>
    <pre className="space-code"><code>{`.panel { border-radius: var(--cs-radius-lg); }\n.control { border-radius: var(--cs-radius); }\n.avatar { width: 32px; height: 32px; border-radius: var(--cs-radius-circle); }`}</code></pre>
  </section>;
}
