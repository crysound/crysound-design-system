export function AlphaFoundations() {
  return <section className="radius-foundations" aria-labelledby="alpha-heading">
    <div className="space-section-heading"><h3 id="alpha-heading">透明度与发丝边 / Alpha & Hairline</h3><p>用户提供的透明度层级：0 / 5 / 10 / 20 / 35%。亮色使用 8% 灰度基色，深色使用白色（适配建议）；颜色会与底层表面叠加。</p></div>
    <div className="radius-scale">{[0, 1, 2, 3, 4].map((level) => <figure key={level}><div className="radius-sample" style={{background: `var(--cds-alpha-${level})`, borderRadius: 'var(--cs-radius)'}} aria-hidden="true" /><figcaption><strong>{[0, 5, 10, 20, 35][level]}%</strong><code>--cds-alpha-{level}</code></figcaption></figure>)}</div>
    <div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">透明度建议用途</caption><thead><tr><th>Token</th><th>建议用途</th></tr></thead><tbody>{[
      ['--cds-alpha-0', '透明'], ['--cds-alpha-1', '轻悬浮、骨架填充；禁用文字仍使用专属文字 Token'],
      ['--cds-border / alpha-2', '装饰性标准边框、次级填充'], ['--cds-border-strong / alpha-3', '较强边框、控件悬浮'], ['--cds-alpha-4', '需要强调的分割线'],
    ].map(([token, usage]) => <tr key={token}><td><code>{token}</code></td><td>{usage}</td></tr>)}</tbody></table></div>
    <h3>按屏幕像素密度调整</h3><p className="cs-help">1×：1px；≥2×：0.5px；≥3×：1/3px。低于 1px 的实际渲染受浏览器、缩放与像素对齐影响。用于弱分隔和装饰，不替换焦点环及承载控件识别的必要边界。</p>
    <div style={{padding: 'var(--cs-space-6)', border: 'var(--cds-ring-hairline) solid var(--cds-border)', borderRadius: 'var(--cs-radius-lg)'}}>当前屏幕发丝边预览</div>
    <pre className="space-code"><code>{`.quiet-panel {\n  border: var(--cds-ring-hairline) solid var(--cds-border);\n}\n/* 现有 --cs-border 保持兼容；新层级按场景选择。 */`}</code></pre>
  </section>;
}
