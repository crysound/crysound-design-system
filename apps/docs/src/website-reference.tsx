import { useState } from 'react';
import { Heading, Text, Tabs, TabsList, TabsTrigger, TabsContent, ActionLink, LinkGroup } from '../../../packages/ui/src/index';
const products = [
  {name:'CRY5820 SonoDAQ Pro',category:'daq',kind:'数据采集',shape:'rack'},
  {name:'CRY8500 Series SonoCam Pi',category:'imaging',kind:'声学成像',shape:'camera'},
  {name:'CRY3018 Sound Calibrator',category:'sensor',kind:'声学校准',shape:'sensor'},
];
export function WebsiteReference() {
  const [category,setCategory] = useState('all');
  return <section className="radius-foundations" aria-labelledby="website-reference-heading">
    <h3 id="website-reference-heading">新官网参考与实例</h3>
    <p className="cs-help">参考本地“官网-全新改版”工程首页，2026-10-16 核对。覆盖首屏、区块标题、产品分类与网格、页脚；以下为代表性样本，未宣称全站或 Figma 完整一致。</p>
    <div className="cs-table-scroll"><table className="cs-table"><caption className="cs-sr-only">本地新官网当前实现与设计系统映射</caption><thead><tr><th>元素</th><th>官网当前实现</th><th>共享库适配</th></tr></thead><tbody>{[
      ['首页首屏标题','.hero h1 · 40/40 · 700','现状40px属于官网展示扩展；示例采用display36/44，未修改官网'],
      ['区块标题 / 说明','.section-title · 36/36标题、16/24说明','按角色采用30/40区域标题、16/26说明'],
      ['产品卡片标题','.product-card h3 · 20/28 · 500','保留20/28作为产品名称角色，避免强制套用工作台16px'],
      ['产品网格 / 边界','实测桌面视口下间距20px；卡片6px圆角、1px边框、无阴影','结构可复用；间距按场景选择，不给所有卡片默认抬升'],
      ['首屏操作','.primary-button · 16/24、胶囊999px','官网链接操作独立映射，通用按钮仍保持库内默认'],
      ['页脚链接','.footer-column a · 12/20；Manrope字体栈','采用LinkGroup和系统字体；字号按官网可读性需要验收'],
    ].map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    <details className="foundation-reference"><summary>参考范围与来源</summary><p className="cs-help">本地路径：~/Documents/官网-全新改版。首页 index.html 依次加载 styles.css、figma-overrides.css、sonic-cosmos.css、about-us.css、product-details.css、responsive.css；参数来自首页当前有效 computed style，受视口与页面状态影响。首屏自动轮播、产品网格和页脚只做代表性核对，未将基础CSS单独视为最终样式。</p><p className="cs-help">Manrope 与库内系统字体不同；官网40px首屏与库内八档字号不同。两者记录为接入差异，需在官网迁移时评审，不自动改写源工程。</p></details>
    <div className="website-example">
      <div className="website-example-hero"><div><Text variant="caption" tone="muted">CRYSOUND · DATA ACQUISITION</Text><Heading level={4} variant="display">精密采集，让声音成为洞察</Heading><Text variant="lead" tone="muted">从数据采集到声学分析，用一致的产品展示层级连接仪器与应用。</Text><ActionLink size="lg" href="#component/filter-toolbar">查看共享组合</ActionLink></div><div className="website-instrument" aria-label="数据采集仪器结构示意"><svg viewBox="0 0 320 160" fill="none" aria-hidden="true"><rect x="32" y="44" width="256" height="76" rx="6"/><path d="M48 60h224M48 104h224"/>{[0,1,2,3,4,5,6,7].map(i=><circle key={i} cx={62+i*28} cy="82" r="5"/>)}</svg><Text variant="caption" tone="muted">仪器结构示意</Text></div></div>
      <div className="website-example-heading"><div><Heading level={4} variant="marketing-section">产品系列</Heading><Text variant="body" tone="muted">分类导航与产品名称保持清晰，卡片以图像区域和留白分组。</Text></div><ActionLink size="lg" href="#library">浏览组件</ActionLink></div>
      <Tabs value={category} onValueChange={setCategory}><TabsList aria-label="官网示例产品分类"><TabsTrigger value="all">全部产品</TabsTrigger><TabsTrigger value="daq">数据采集</TabsTrigger><TabsTrigger value="imaging">声学成像</TabsTrigger><TabsTrigger value="sensor">传感与校准</TabsTrigger></TabsList><TabsContent value={category}>
      <div className="website-product-grid" aria-live="polite">{products.filter(p=>category==='all'||p.category===category).map(p=><article key={p.name}><div className="website-product-media" aria-hidden="true"><svg viewBox="0 0 160 100" fill="none">{p.shape==='rack'?<><rect x="15" y="30" width="130" height="40" rx="4"/><path d="M30 50h100"/></>:p.shape==='camera'?<><rect x="40" y="14" width="80" height="56" rx="8"/><circle cx="80" cy="42" r="17"/><path d="M68 70v18h24V70"/></>:<><rect x="62" y="12" width="36" height="76" rx="6"/><circle cx="80" cy="32" r="10"/></>}</svg></div><Text variant="caption" tone="muted">{p.kind}</Text><Heading level={5} variant="section">{p.name}</Heading></article>)}</div></TabsContent></Tabs>
      <div className="website-example-footer"><LinkGroup label="产品与方案" items={[{label:'组件总览',href:'#library'},{label:'样板库',href:'#templates'}]}/><LinkGroup label="资源与支持" items={[{label:'安装与接入',href:'#installation'},{label:'基础规范',href:'#foundations'}]}/></div>
    </div>
    <p className="cs-help">实例使用共享Heading/Text/Tabs/ActionLink/LinkGroup；产品名称来自本地首页，示意图为代码绘制的结构占位，非产品外观还原。参考用于建立官网组合规则，不将工作台密度直接套用官网。</p>
  </section>;
}
