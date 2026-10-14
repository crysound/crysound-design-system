"use client";
import { useRef, useState, useId, type ReactNode } from 'react';
export interface TreeNode { id: string; label: string; icon?: ReactNode; children?: TreeNode[]; disabled?: boolean }
export interface TreeViewProps {
  nodes: TreeNode[]; label: string; variant?: 'simple'|'files'; selectedId?: string; defaultSelectedId?: string;
  onSelectionChange?: (id: string)=>void; defaultExpandedIds?: string[];
}
export function TreeView({nodes,label,selectedId,defaultSelectedId,onSelectionChange,defaultExpandedIds=[],variant='simple'}:TreeViewProps) {
  const treeId=useId();
  const [selected,setSelected]=useState(defaultSelectedId);const [expanded,setExpanded]=useState(defaultExpandedIds);const [focused,setFocused]=useState<string | undefined>(undefined);const root=useRef<HTMLUListElement>(null);
  const current=selectedId??selected;
  const rows:{node:TreeNode;parent?:string}[]=[];
  function flatten(items:TreeNode[],parent?:string){for(const node of items){rows.push({node,parent});if(expanded.includes(node.id)&&node.children?.length)flatten(node.children,node.id);}}
  flatten(nodes);const enabled=rows.filter(row=>!row.node.disabled);
  const tabId=enabled.some(row=>row.node.id===focused)?focused:enabled.some(row=>row.node.id===current)?current:enabled[0]?.node.id;
  function focus(id:string){setFocused(id);requestAnimationFrame(()=>Array.from(root.current?.querySelectorAll<HTMLElement>('[role="treeitem"]')??[]).find(el=>el.dataset.id===id)?.focus());}
  function toggle(id:string){setExpanded(ids=>ids.includes(id)?ids.filter(item=>item!==id):[...ids,id]);}
  function select(node:TreeNode){if(node.disabled)return;setSelected(node.id);onSelectionChange?.(node.id);}
  function render(items:TreeNode[],level:number):ReactNode {return items.map((node,index)=>{const branch=!!node.children?.length;const isOpen=expanded.includes(node.id);return <li key={node.id} role="none"><div role="treeitem" data-id={node.id} aria-owns={branch&&isOpen?`${treeId}-${node.id}`:undefined} aria-level={level} aria-posinset={index+1} aria-setsize={items.length} aria-expanded={branch?isOpen:undefined} aria-selected={current===node.id} aria-disabled={!!node.disabled} tabIndex={node.id===tabId?0:-1} className="cs-tree-item" style={variant==='files'?{paddingLeft:12+(level-1)*20}:undefined} onFocus={()=>setFocused(node.id)} onClick={()=>select(node)} onDoubleClick={()=>{if(branch&&!node.disabled)toggle(node.id);}} onKeyDown={event=>{if(node.disabled)return;const index=enabled.findIndex(row=>row.node.id===node.id);const keys=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End','Enter',' '];if(keys.includes(event.key))event.preventDefault();if(event.key==='ArrowDown'&&enabled[index+1])focus(enabled[index+1].node.id);if(event.key==='ArrowUp'&&enabled[index-1])focus(enabled[index-1].node.id);if(event.key==='Home'&&enabled[0])focus(enabled[0].node.id);if(event.key==='End'&&enabled.length)focus(enabled[enabled.length-1].node.id);if(event.key==='Enter'||event.key===' ')select(node);if(event.key==='ArrowRight'&&branch){if(!isOpen)toggle(node.id);else {const child=node.children?.find(item=>!item.disabled);if(child)focus(child.id);}}if(event.key==='ArrowLeft'){if(branch&&isOpen)toggle(node.id);else {const parent=rows.find(row=>row.node.id===node.id)?.parent;if(parent)focus(parent);}}}}>
    <span className="cs-tree-toggle" aria-hidden="true" onClick={event=>{event.stopPropagation();if(branch&&!node.disabled){toggle(node.id);focus(node.id);}}}>{branch&&<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{transform:isOpen?'rotate(90deg)':undefined}}><path d="m9 6 6 6-6 6"/></svg>}</span>
    <span className="cs-tree-icon" aria-hidden="true">{node.icon??<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{branch?<path d="M3 7V4h7l2 3h9v13H3Z"/>:<path d="M5 3h9l5 5v13H5Zm9 0v5h5"/>}</svg>}</span><span className="cs-tree-label">{node.label}</span>
    </div>{branch&&isOpen&&<ul role="group" id={`${treeId}-${node.id}`}>{render(node.children!,level+1)}</ul>}</li>;});}
  return nodes.length?<ul ref={root} role="tree" aria-label={label} className={`cs-tree-view cs-tree-view--${variant}`}>{render(nodes,1)}</ul>:<div className="cs-tree-empty">暂无目录内容</div>;
}
