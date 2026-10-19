const scale = [
  ['0',0],['0-5',2],['1',4],['1-5',6],['2',8],['2-5',10],['3',12],['3-5',14],
  ['4',16],['5',20],['6',24],['7',28],['8',32],['9',36],['10',40],['11',44],
  ['12',48],['14',56],['16',64],['20',80],['24',96],['28',112],['32',128],
  ['40',160],['48',192],['64',256],
] as const;
export function SpaceFoundations() {
  return <section className="space-foundations" aria-label="基础空间规范">
    <div className="space-section-heading"><h3>基础空间 / Spacing</h3><p>以 4px 为基线，2px 半步用于图标、边框与微调。间距必须使用下列基础刻度，不使用奇数或小数像素。原始 4–32px 基线来自 Figma，其余档位与场景规则为扩展建议。</p></div>
    <div className="space-scale-grid">{scale.map(([token, px]) => <div className="space-scale-row" key={token}><code>--cs-space-{token}</code><div className="space-bar-track"><span style={{ width:`var(--cs-space-${token})` }} /></div><small>{px}px</small></div>)}</div>
    <h3>按场景使用</h3>
    <div className="space-usage-grid">{[
      ['控件内部','8 / 12px','space-2 / space-3','图标与文字间距 8px；输入框左右内距 12px。',8,12],
      ['表单字段','4 / 24px','space-1 / space-6','标签与控件间距 4px；相邻字段组间距 24px。',4,24],
      ['卡片内容','16 / 24px','space-4 / space-6','紧凑卡片内距 16px；常规卡片内距 24px。',16,24],
      ['区块布局','24 / 32px','space-6 / space-8','工作台区块间距 24px；主要内容分组间距 32px。',24,32],
    ].map(([title, value, token, description, gap, padding])=><div className="space-usage" key={title}><strong>{title}</strong><span>{value}</span><p>{description}</p><code>{token}</code><div className="space-padding-demo" style={{padding:`${padding}px`,gap:`${gap}px`}}><span /><span /></div></div>)}</div>
    <h3>页面留白与响应式</h3>
    <p className="cs-help">以下为消费项目布局建议，预览站仍保留当前导航布局。断点以内容可读性为准。</p>
    <div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">响应式空间建议</caption><thead><tr><th>视口</th><th>页面左右留白</th><th>网格间距</th><th>内容列</th></tr></thead><tbody>{[
      ['手机 / <640px','16px · space-4','16px · space-4','1 列'],
      ['平板 / 640–1023px','24px · space-6','24px · space-6','1–2 列'],
      ['桌面 / ≥1024px','32px · space-8','24px · space-6','2–3 列'],
    ].map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    <h3>紧凑与舒适密度</h3>
    <div className="space-density-grid">{[['compact','紧凑','32px','8px','16px'],['comfortable','舒适','40px','12px','24px']].map(([mode,label,height,gap,padding])=><div className="space-density" key={mode}><strong>{label} / {mode}</strong><p>控件高度 {height} · 组件间距 {gap} · 内容内距 {padding}</p><div className="space-density-preview" style={{padding,gap}}><span style={{height}}>测量任务</span><span style={{height}}>设备配置</span></div></div>)}</div>
    <p className="cs-help">密度只调整布局与控件，不改变字号阶梯。手机上建议保证交互区域至少 44px；不要用空格或换行符撑开布局。</p>
    <h3>接入示例</h3>
    <pre className="space-code"><code>{`.measurement-panel {\n  display: grid;\n  gap: var(--cs-space-6);\n  padding: var(--cs-space-6);\n}\n\n@media (max-width: 639px) {\n  .measurement-panel { padding: var(--cs-space-4); }\n}`}</code></pre>
  </section>;
}
