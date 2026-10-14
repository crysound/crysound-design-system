import { useState } from 'react';
import { Folder, FilePlus01, User01, Users01, HelpCircle, LayersThree01, Settings01 } from '@untitledui/icons';
import { Button, CommandMenu, type CommandMenuGroup } from '../../../packages/ui/src/index';
export function CommandMenuDemo() {
  const [selected,setSelected]=useState('');
  const groups:CommandMenuGroup[]=[
    {id:'tasks',label:'工作区',items:[{id:'project',label:'测量项目',icon:<Folder size={20}/>,keywords:['project']},{id:'new',label:'新建测量任务',shortcut:'⌘ N',icon:<FilePlus01 size={20}/>,keywords:['new','task']},{id:'invite',label:'邀请成员',shortcut:'⌘ I',icon:<Users01 size={20}/>}]},
    {id:'settings',label:'设置与支持',items:[{id:'profile',label:'个人资料',icon:<User01 size={20}/>},{id:'team',label:'团队设置',icon:<Settings01 size={20}/>},{id:'help',label:'帮助与支持',icon:<HelpCircle size={20}/>,keywords:['help']},{id:'changes',label:'更新日志',icon:<LayersThree01 size={20}/>},{id:'admin',label:'管理员设置（不可用）',disabled:true,icon:<Settings01 size={20}/>}]}];
  return <div className="command-menu-demo"><CommandMenu groups={groups} onSelect={setSelected}/><CommandMenu groups={groups} trigger={<Button variant="secondary">打开命令菜单</Button>} onSelect={setSelected}/><p className="cs-help" role="status">{selected?`已执行演示命令：${selected}`:'支持搜索、方向键选择和 Enter 执行。快捷键为提示，消费项目负责绑定。'}</p></div>;
}
