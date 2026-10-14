import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TreeView } from '../packages/ui/src/index';
afterEach(cleanup);
describe('TreeView',()=>{
  it('expands with the keyboard and selects a child',()=>{
    const change=vi.fn();render(<TreeView label="目录" nodes={[{id:'folder',label:'项目',children:[{id:'file',label:'报告.pdf'}]}]} onSelectionChange={change}/>);
    const parent=screen.getByRole('treeitem',{name:'项目'});fireEvent.keyDown(parent,{key:'ArrowRight'});
    expect(parent).toHaveAttribute('aria-expanded','true');const child=screen.getByRole('treeitem',{name:'报告.pdf'});fireEvent.click(child);expect(change).toHaveBeenCalledWith('file');expect(child).toHaveAttribute('aria-selected','true');
  });
  it('does not select disabled nodes',()=>{
    const change=vi.fn();render(<TreeView label="目录" nodes={[{id:'off',label:'不可用',disabled:true}]} onSelectionChange={change}/>);
    fireEvent.click(screen.getByRole('treeitem'));expect(change).not.toHaveBeenCalled();
  });
});
