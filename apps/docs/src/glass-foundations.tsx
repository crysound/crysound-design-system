import { useState } from 'react';
import { GlassSurface, Checkbox, Tabs, TabsList, TabsTrigger } from '../../../packages/ui/src/index';
type Weight = 'light' | 'regular' | 'thick';
const materials = [
  ['light', '轻材质', '72%', '12px', '小型浮动工具条，适合简单背景'],
  ['regular', '标准材质', '80%', '16px', '固定导航与滚动工具栏'],
  ['thick', '厚材质', '92%', '24px', '较大的非阻塞面板，适合复杂背景'],
] as const;
export function GlassFoundations() {
  const [opaque, setOpaque] = useState(false);
  const [weight, setWeight] = useState<Weight>('regular');
  return <section className="radius-foundations glass-foundations" aria-labelledby="glass-heading">
    <div className="space-section-heading"><h3 id="glass-heading">半透明材质 / Glass</h3><p>用材质区分悬浮工具层与内容层。背景保留轮廓，前景始终清晰。以下为 CRYSOUND Web 适配建议。</p></div>
    <div className="glass-preview-controls"><Tabs value={weight} onValueChange={value => setWeight(value as Weight)}><TabsList variant="pill" aria-label="预览材质厚度">{materials.map(([key,label]) => <TabsTrigger key={key} value={key}>{label}</TabsTrigger>)}</TabsList></Tabs><Checkbox label="不透明模式" checked={opaque} onCheckedChange={value => setOpaque(value === true)} /></div>
    <div className="glass-preview" role="region" aria-label="毛玻璃滚动预览" tabIndex={0}>
      <GlassSurface weight={weight} opaque={opaque} className="glass-preview-toolbar"><div><strong>采集任务</strong><span>实验室 A · 声学成像仪 01</span></div><span className="glass-preview-count">06 个任务</span></GlassSurface>
      <div className="glass-preview-content"><div className="glass-preview-intro"><span>WORKSPACE / 01</span><strong>让内容流过，<br />让操作留在眼前。</strong><p>在此区域滚动，观察顶部工具栏的透底与模糊。</p></div>{['产线噪声检测', '环境噪声采集', '设备振动分析', '麦克风校准', '频率响应测量', '声源定位'].map((name,index) => <div className="glass-preview-task" key={name}><span className="glass-preview-index">{String(index + 1).padStart(2,'0')}</span><div><strong>{name}</strong><span>48 kHz · 测量任务</span></div><span className="glass-preview-task-state">{index === 0 ? '采集中' : '待执行'}</span></div>)}</div>
    </div>
    <div className="glass-preview-caption"><span>滚动预览 · 可使用键盘方向键</span><span>{opaque ? '实色降级' : `${materials.find(item => item[0] === weight)?.[2]} 表面色 · ${materials.find(item => item[0] === weight)?.[3]} 模糊 · 130% 饱和度`}</span></div>
    <div className="glass-material-specs">{materials.map(([key,label,opacity,blur,usage]) => <div key={key}><strong>{label}</strong><span>{opacity} / {blur}</span><p>{usage}</p></div>)}</div>
    <div className="glass-guidelines"><div><h4>适合悬浮的功能层</h4><p>导航、工具栏和保留上下文的非阻塞面板。表格、长正文、输入区与精密图表优先使用实色；轻材质不叠加轻材质。</p></div><div><h4>把可读性放在前面</h4><p>文字保持语义正文色与标题色，按钮使用实色。在复杂背景下检查辨识度，必要时增加厚度或切换不透明；不自动保证对比度。</p></div><div><h4>保留行为与层级</h4><p>模态任务配合遮罩，并由 Radix 管理焦点与关闭。GlassSurface 只负责材质；不要给每张卡片添加模糊或循环动画 blur。</p></div><div><h4>尊重辅助偏好</h4><p>减少透明度、增强对比度、强制颜色和不支持模糊时降级实色。opaque 可连接项目设置；明暗及客户主题跟随表面 Token。</p></div></div>
    <details className="glass-code"><summary>组件接入与材质 Token</summary><pre className="space-code"><code>{`<GlassSurface weight="regular" opaque={reduceTransparency}>\n  <nav aria-label="任务工具栏">…</nav>\n</GlassSurface>\n\n/* header / aside 等语义元素可复用样式 */\n<header className="cs-glass cs-glass--regular">…</header>\n\n--cs-glass-light-bg / --cs-glass-light-blur\n--cs-glass-regular-bg / --cs-glass-regular-blur\n--cs-glass-thick-bg / --cs-glass-thick-blur`}</code></pre><p className="cs-help">数值不是 Apple 原生材质参数。本实现不模拟系统 vibrancy 或 Liquid Glass 折射。</p></details>
  </section>;
}
