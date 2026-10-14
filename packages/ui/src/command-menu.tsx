"use client";
import { useState, type ReactNode } from 'react';
import { Command } from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog';
export interface CommandMenuItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
}
export interface CommandMenuGroup { id: string; label: string; items: CommandMenuItem[] }
export interface CommandMenuProps {
  groups: CommandMenuGroup[];
  title?: string;
  placeholder?: string;
  emptyText?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (id: string) => void;
}
export function CommandMenu({groups,title='命令菜单',placeholder='搜索命令或页面…',emptyText='没有匹配的命令',trigger,open,onOpenChange,onSelect}:CommandMenuProps) {
  const [internal,setInternal]=useState(false);
  const [query,setQuery]=useState('');
  const isOpen=open??internal;
  const modal=trigger!==undefined||open!==undefined;
  const setOpen=(next:boolean)=>{setInternal(next);onOpenChange?.(next);if(!next)setQuery('');};
  const content=<Command className="cs-command-menu" label={title} loop>
    <div className="cs-command-menu-search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></svg><Command.Input value={query} onValueChange={setQuery} placeholder={placeholder} aria-label="搜索命令" />{modal&&<kbd>Esc</kbd>}</div>
    <Command.List className="cs-command-menu-list">
      <Command.Empty className="cs-command-menu-empty">{emptyText}</Command.Empty>
      {groups.map(group=><Command.Group key={group.id} heading={group.label} className="cs-command-menu-group">{group.items.map(item=><Command.Item key={item.id} value={item.id} keywords={[item.label,...(item.keywords??[])]} disabled={item.disabled} className="cs-command-menu-item" onSelect={()=>{item.onSelect?.();onSelect?.(item.id);if(modal)setOpen(false);}}>
        {item.icon&&<span className="cs-command-menu-icon" aria-hidden="true">{item.icon}</span>}
        <span className="cs-command-menu-label"><span>{item.label}</span>{item.description&&<small>{item.description}</small>}</span>
        {item.shortcut&&<kbd>{item.shortcut}</kbd>}
      </Command.Item>)}</Command.Group>)}
    </Command.List>
    <div className="cs-command-menu-footer"><span>↑ ↓ 选择</span><span>↵ 执行</span>{modal&&<span>Esc 关闭</span>}</div>
  </Command>;
  if(!modal)return content;
  return <Dialog.Root open={isOpen} onOpenChange={setOpen}>{trigger&&<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}<Dialog.Portal><Dialog.Overlay className="cs-dialog-overlay" /><Dialog.Content className="cs-command-menu-dialog" aria-describedby={undefined}><Dialog.Title className="cs-sr-only">{title}</Dialog.Title>{content}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
