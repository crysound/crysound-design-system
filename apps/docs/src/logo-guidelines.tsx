const source='https://www.figma.com/design/4LCdJror6iRukSUQaU7ABy/?node-id=1-5487';
export function LogoGuidelines() {
  return <article className="logo-guidelines">
    <header><h1>Logo 规范 / Brand mark</h1><p>统一 CRYSOUND 品牌标识的组合、配色与安全距离。以下标准版资产来自「品牌vi」源文件。</p></header>
    <section><h2>标准品牌标识 · 1X</h2><p>X 为标志符号高度，四周至少保留 1X 安全距离。安全区域内不放置文字、图形或容器边缘。</p>
      <div className="logo-clearspace"><div className="logo-clearspace-inner"><img src="./brand/logo-horizontal-purple.svg" alt="CRYSOUND 标准横版品牌标识"/><span>1X</span></div></div>
    </section>
    <section><h2>标准配色</h2><div className="logo-variant-grid">{[
      ['purple','品牌紫','#170057','浅色背景优先使用'],['black','黑色','#000000','单色印刷与黑白材料'],['white','反白','#FFFFFF','深色纯色背景使用'],
    ].map(([id,name,color,note])=><figure key={id}><div className={`logo-variant-preview logo-variant-preview--${id}`}><img src={`./brand/logo-horizontal-${id}.svg`} alt={`CRYSOUND ${name}横版`}/></div><figcaption><strong>{name} · {color}</strong><p>{note}</p><a href={`./brand/logo-horizontal-${id}.svg`} download>下载 SVG</a></figcaption></figure>)}</div></section>
    <section><h2>尺寸与组合</h2><div className="logo-rules-grid"><div><h3>最小尺寸</h3><p>参考提供的品牌规范：数字端标志高度 ≥ 10px，印刷端 ≥ 5mm。实际使用应确保文字清晰，避免直接把复合中英文标识压缩至极限。</p></div><div><h3>12 种标准组合</h3><p>英文横版、英文竖版、中英文横版、中英文竖版，各提供品牌紫、黑色、反白三种版本。此页预览英文横版，其余组合请使用源文件。</p></div><div><h3>紧凑场景</h3><p>源文件另设 Compact 0.5X、头像及品牌主张组合。不要直接裁切标准版安全区域替代专用资产。</p></div><div><h3>保持原始比例</h3><p>禁止拉伸、倾斜、替换字体、改动符号与文字间距，以及添加描边、阴影或渐变。不得把 UI 图标线宽规则应用到品牌标识。</p></div></div></section>
    <section><h2>交付与使用</h2><p>优先使用 SVG，保持原始宽高比。三种配色使用独立原始资产，不通过 CSS 滤镜改色。下载文件仅包含标识，使用方需额外保留安全距离。</p><a href={source} target="_blank" rel="noreferrer">打开 Figma 品牌规范源文件</a></section>
  </article>;
}
