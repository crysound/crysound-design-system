import { useState } from 'react';
import { GlassSurface, Checkbox, Button } from '../../../packages/ui/src/index';
export function GlassFoundations() {
  const [opaque, setOpaque] = useState(false);
  return <section className="radius-foundations" aria-labelledby="glass-heading">
    <div className="space-section-heading"><h3 id="glass-heading">半透明材质 / Glass</h3><p>参考 apple-design 的材质与层级原则：用半透明表达悬浮功能层，让滚动内容保留空间联系。以下数值是 CRYSOUND Web 适配建议，并非 Apple 原生材质参数。</p></div>
    <Checkbox label="使用不透明降级预览" checked={opaque} onCheckedChange={value => setOpaque(value === true)} />
    <div className="glass-material-grid">{[
      ['light', '轻材质', '72% · 12px', '小型浮动工具条；仅适合简单背景'],
      ['regular', '标准材质', '80% · 16px', '固定导航、滚动工具栏；当前站点导航采用'],
      ['thick', '厚材质', '92% · 24px', '较大的非阻塞侧面板；复杂背景优先使用'],
    ].map(([weight, label, value, usage]) => <div key={weight}><div className="glass-demo-scene"><div className="glass-demo-backdrop" aria-hidden="true"><span>CRYSOUND</span><span>测量任务 · 48 kHz</span><span>设备已连接</span></div><GlassSurface weight={weight as 'light' | 'regular' | 'thick'} opaque={opaque} className="glass-demo-material"><strong>{label}</strong><span>{value}</span><Button size="sm">查看任务</Button></GlassSurface></div><p>{usage}</p></div>)}</div>
    <h3>使用规则</h3>
    <ul><li>用于导航、工具栏和需要保留背景上下文的浮层；表格、长正文、输入区域和精密图表优先使用不透明表面。</li><li>轻材质不叠加轻材质；浮层内部按钮和状态信息使用独立实色，避免多层透明导致颜色漂移。</li><li>正文采用语义正文色，重要信息采用标题色，不降低文字透明度。在最复杂背景下检查文字和控件可辨性；必要时提高材质厚度或改为不透明。</li><li>模态任务继续配合遮罩，并由 Radix 管理焦点、Esc 和返回；GlassSurface 只提供材质，不提供弹窗行为。</li><li>固定栏允许内容滚动经过下方，边缘保持轻分隔；不要在每张卡片上使用模糊，也不要循环动画 blur，避免滚动重绘负担。</li><li>减少透明度、增强对比度、强制颜色或不支持 backdrop-filter 时使用实色。opaque 属性可由消费项目的“减少透明效果”设置控制。</li></ul>
    <p className="cs-help">同一档位在明暗主题下跟随 cs-surface，客户主题可覆盖 glass Token。当前组件不自动计算背景对比度，也不模拟系统 vibrancy 或 Liquid Glass 折射。</p>
    <pre className="space-code"><code>{`<GlassSurface weight="regular" opaque={reduceTransparency}>\n  <nav aria-label="任务工具栏">…</nav>\n</GlassSurface>\n\n/* 语义 header / aside 可直接复用材质类 */\n<header className="cs-glass cs-glass--regular">…</header>`}</code></pre>
  </section>;
}
