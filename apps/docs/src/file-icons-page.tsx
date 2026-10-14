import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FileIcon, fileIconTypes, type FileIconVariant, type FileIconType } from '../../../packages/ui/src/index';
export default function FileIconsPage() {
  const [variant,setVariant]=useState<FileIconVariant>('default');
  const [query,setQuery]=useState('');
  const [status,setStatus]=useState('');
  const matches=fileIconTypes.filter(type=>type.includes(query.toLowerCase().trim()));
  async function copy(type:FileIconType, format:'svg'|'jsx') {
    const text=format==='svg' ? renderToStaticMarkup(<FileIcon type={type} variant={variant} size={40} />) : `import { FileIcon } from '@crysound/ui';\n\n<FileIcon type="${type}" variant="${variant}" size={40} aria-hidden="true" />`;
    try { await navigator.clipboard.writeText(text); setStatus(`${type} ${format.toUpperCase()} 已复制`); } catch { setStatus('无法访问剪贴板，请重试。'); }
  }
  return <article className="icon-library"><h1>文件类型图标 / File icons</h1><p className="icon-intro">{fileIconTypes.length} 种文件类型，提供彩色、灰色和实色三种样式，用于附件、报告、测量数据和文件列表。</p><p className="cs-help">参考 <a href="https://www.untitledui.com/resources/file-icons" target="_blank" rel="noreferrer">Untitled UI File icons</a> 的类型与组织方式，图形为本项目独立实现。</p>
    <div className="file-icons-toolbar"><div className="icon-sizes" role="group" aria-label="文件图标样式">{(['default','gray','solid'] as const).map(v=><button className="cs-button cs-button--secondary" key={v} aria-pressed={variant===v} onClick={()=>setVariant(v)}>{v==='default'?'Default':v==='gray'?'Gray':'Solid'}</button>)}</div><input className="cs-input" aria-label="搜索文件类型" placeholder="搜索文件类型，例如 pdf、csv、wav…" value={query} onChange={e=>setQuery(e.target.value)} /></div>
    <p className="cs-help" role="status">{status || `共 ${matches.length} 种类型 · 默认尺寸 40px，可通过 size 调整`}</p>
    <div className="file-format-grid">{matches.map(type=><div className="file-format-card" key={type}><FileIcon type={type} variant={variant} size={48} aria-hidden="true" /><strong>{type}</strong><div><button onClick={()=>copy(type,'svg')}>复制 SVG</button><button onClick={()=>copy(type,'jsx')}>复制 JSX</button></div></div>)}</div>
    {!matches.length && <p className="icon-empty">没有匹配的文件类型，请更换关键词。</p>}
    <h3>使用示例</h3><pre className="space-code"><code>{`import { FileIcon } from '@crysound/ui';\n\n<FileIcon type="pdf" variant="default" size={40} aria-label="PDF 文件" />\n<FileIcon type="csv" variant="gray" size={32} aria-hidden="true" />`}</code></pre><p className="cs-help">图标与文件名同时出现时使用 aria-hidden；单独显示时提供 aria-label。文件类型颜色固定，不随客户品牌切换。</p>
  </article>;
}
