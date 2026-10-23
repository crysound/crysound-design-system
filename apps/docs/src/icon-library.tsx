import {icons as LucideIcons} from "lucide-react";
import { useState } from "react";
import { Checkbox } from "../../../packages/ui/src/index";
import * as Icons from "@untitledui/icons";
const entries = Object.entries(Icons).filter(([name]) => !name.endsWith('Rtl')).sort(([a], [b]) => a.localeCompare(b));
const lucideEntries = Object.entries(LucideIcons).filter(([name])=>!name.endsWith("Icon")&&!name.startsWith("Lucide")).sort(([a],[b])=>a.localeCompare(b));
const existingNames=new Set(entries.map(([name])=>name));
const mergedEntries=[...entries,...lucideEntries.filter(([name])=>!existingNames.has(name))].sort(([a],[b])=>a.localeCompare(b));
const categories = [
  ["全部", ""], ["导航", "Arrow|Chevron|Menu|Home|Link"],
  ["操作", "Plus|Minus|Edit|Trash|Copy|Download|Upload|Check|Search|Settings"],
  ["状态", "Alert|Info|Help|Check|XCircle|Clock"],
  ["数据与设备", "Chart|Bar|Pie|Activity|Wave|Volume|Microphone|Monitor|Cpu|Wifi|Bluetooth|Database"],
  ["文件", "File|Folder|Image|Book|Clipboard"], ["用户", "User|Users|Lock|Shield|Key"],
];
export default function IconLibrary({ filesOnly = false }: { filesOnly?: boolean }) {
  const libraryEntries = filesOnly ? mergedEntries.filter(([name]) => /^(File|Folder)/.test(name)) : mergedEntries;
  const visibleCategories = filesOnly ? [["全部文件", ""], ["文档", "^File0"], ["文件夹", "^Folder"], ["上传下载", "Upload|Download|Attachment"], ["文件状态", "Check|Lock|Shield|Question|X|Plus|Minus|Search"]] : categories;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState(24);
  const [brand, setBrand] = useState(false);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(filesOnly ? "File01" : "Activity");
  const [message, setMessage] = useState("");
  const matches = libraryEntries.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()) && (!category || new RegExp(category).test(name)));
  const pages = Math.max(1, Math.ceil(matches.length / 80));
  const activePage = Math.min(page, pages - 1);
  const stroke = Number((size * 0.075).toFixed(2));
  const snippet = `<${selected} size={${size}} strokeWidth={${stroke}} aria-hidden="true"${brand ? ' style={{ color: "var(--cs-brand)" }}' : ''} />`;
  async function copy() {
    try { await navigator.clipboard.writeText(snippet); setMessage("已复制代码"); }
    catch { setMessage("复制失败，请从下方代码框手动复制。"); }
  }
  return <article className="icon-library">
    <h1>{filesOnly ? "文件图标 / File icons" : "图标库 / Icons"}</h1>
    <p className="icon-intro">{libraryEntries.length} 个开源线性图标，与产品组件统一使用。支持按名称搜索、分类浏览及复制 React 代码。</p>
    <div className="icon-guidance">常用尺寸 16 / 20 / 24 / 32px，描边分别为1.2 / 1.5 / 1.8 / 2.4px（项目建议值），默认继承文字颜色。纯装饰图标使用 aria-hidden；图标按钮应在按钮上提供 aria-label。</div>
    {filesOnly && <div className="file-type-examples" aria-label="常见文件类型">{[
      ["PDF", "报告文档", "File06"], ["DOCX", "文字文档", "File02"],
      ["XLSX / CSV", "表格与测量数据", "File03"], ["JSON / XML", "配置文件", "FileCode01"],
      ["PNG / JPG", "图像文件", "File04"], ["WAV / MP3", "音频记录", "File05"],
      ["ZIP", "归档文件", "File07"], ["其他", "通用文件", "File01"],
    ].map(([extension, description, name]) => { const Icon = Icons[name as keyof typeof Icons]; return <button className="file-type-example" key={extension} onClick={()=>{setSelected(name);setMessage("");}} aria-pressed={selected===name}><Icon size={32} strokeWidth={2.4} aria-hidden="true" /><strong>{extension}</strong><span>{description}</span></button>; })}</div>}
    <div className="icon-tools">
      <input className="cs-input" aria-label="搜索图标" placeholder="搜索英文名称，例如 Search、Volume、Arrow…" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} />
      <div className="icon-sizes" role="group" aria-label="图标尺寸">{[16,20,24,32].map(n => <button key={n} className="cs-button cs-button--secondary" aria-pressed={size===n} onClick={()=>setSize(n)}>{n}px</button>)}</div>
      <Checkbox label="品牌色" checked={brand} onCheckedChange={checked => setBrand(checked === true)} />
    </div>
    <div className="icon-categories" role="group" aria-label="图标分类">{visibleCategories.map(([label, filter]) => <button key={label} className="cs-button cs-button--secondary" aria-pressed={category===filter} onClick={()=>{setCategory(filter);setPage(0);}}>{label}</button>)}</div>
    <div className="icon-code-panel"><div><strong>{selected}</strong><button className="cs-button cs-button--secondary" onClick={copy}>复制代码</button></div><pre><code>{snippet}</code></pre><span role="status">{message}</span></div>
    <p className="cs-help">找到 {matches.length} 个图标 · 点击图标选择代码示例</p>
    <div className="icon-grid">{matches.slice(activePage*80,(activePage+1)*80).map(([name, Icon]) => <button key={name} className="icon-tile" aria-pressed={selected===name} onClick={()=>{setSelected(name);setMessage("");}}><Icon size={size} strokeWidth={stroke} aria-hidden="true" style={{color:brand?'var(--cs-brand)':'var(--cs-text)'}} /><span>{name}</span></button>)}</div>
    {!matches.length && <p className="icon-empty">没有匹配的图标，请更换关键词或分类。</p>}
    <div className="icon-pagination"><button className="cs-button cs-button--secondary" disabled={activePage===0} onClick={()=>setPage(activePage-1)}>上一页</button><span>第 {activePage+1} / {pages} 页</span><button className="cs-button cs-button--secondary" disabled={activePage===pages-1} onClick={()=>setPage(activePage+1)}>下一页</button></div>
    <p className="cs-help">依赖：{!existingNames.has(selected)?'lucide-react · ISC 许可':'@untitledui/icons · MIT 许可'} · 消费项目需安装对应包。<a href={!existingNames.has(selected)?'./licenses/lucide-react-LICENSE.txt':'./licenses/untitled-ui-icons-MIT.txt'} target="_blank" rel="noreferrer">查看许可</a></p>
  </article>;
}
