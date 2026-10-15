import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type MotionProps } from 'framer-motion';
import { getSpringPreset } from '../../../packages/ui/src/index';

export function SpringFoundations() {
  const reduce = useReducedMotion();
  const [panel, setPanel] = useState(false);
  const [badge, setBadge] = useState(0);
  const preset = (name: 'button' | 'popover' | 'badge'): MotionProps => getSpringPreset(name, reduce);
  return <section className="radius-foundations" aria-labelledby="spring-heading">
    <div className="space-section-heading"><h3 id="spring-heading">弹簧预设 / Spring</h3><p>三组用户指定的物理参数，按需启用。弹簧按刚度与阻尼收敛，不承诺固定 60 / 200ms；减少动态效果时关闭缩放、位移与回弹。</p></div>
    <div className="space-usage-grid">
      <div className="space-usage"><strong>按钮点击回弹</strong><p>按压缩放至 0.92；刚度 600，阻尼 30。</p><motion.button className="cs-button cs-button--primary" {...preset('button')}>按住体验</motion.button></div>
      <div className="space-usage"><strong>浮层进入与退出</strong><p>0.95 缩放，上浮 6px；刚度 320，阻尼 28。</p><button className="cs-button cs-button--secondary" onClick={() => setPanel(value => !value)} aria-expanded={panel} aria-controls="spring-panel-demo">{panel ? '收起预览' : '展开预览'}</button><div style={{minHeight: 80, paddingTop: 16}}><AnimatePresence>{panel && <motion.div id="spring-panel-demo" {...preset('popover')} style={{padding:16, background:'var(--cs-subtle)', borderRadius:'var(--cs-radius-lg)'}}>动效展示面板</motion.div>}</AnimatePresence></div></div>
      <div className="space-usage"><strong>成功徽章跳跃</strong><p>从 0.8 缩放至 1；刚度 380，阻尼 18，单次播放。</p><button className="cs-button cs-button--secondary" onClick={() => setBadge(value => value + 1)}>重播动效</button><div style={{paddingTop:16}}><motion.span key={badge} {...preset('badge')} style={{display:'inline-block', color:'var(--cs-success-fg)', padding:'4px 12px', borderRadius:'var(--cs-radius-pill)', background:'var(--cs-success-bg)'}}>已完成</motion.span></div></div>
    </div>
    <p className="cs-help">预设是参数对象，UI 包不依赖 Motion 运行时。消费项目按需安装 framer-motion，使用 useReducedMotion() 传入系统偏好。真实弹窗继续由 Radix 管理焦点、关闭与键盘行为；本例仅展示动效。</p>
    <pre className="space-code"><code>{`import { motion, useReducedMotion } from 'framer-motion';\nimport { getSpringPreset } from '@crysound/ui';\n\nconst reduced = useReducedMotion();\n<motion.button {...getSpringPreset('button', reduced)}>保存</motion.button>`}</code></pre>
  </section>;
}
