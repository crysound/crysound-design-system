import { useState } from 'react';
import { InstrumentDialog, DialogClose, Button, Input, Select } from '../../../packages/ui/src/index';
export function InstrumentDialogDemo() {
  const [open,setOpen]=useState(false);
  const [message,setMessage]=useState('');
  return <div><InstrumentDialog open={open} onOpenChange={setOpen} trigger={<Button>配置测量任务</Button>} title="新建测量任务" description="选择设备和采样配置，创建新的声学测量任务。" actions={<><DialogClose asChild><Button variant="secondary">取消</Button></DialogClose><Button type="submit" form="instrument-task">创建任务</Button></>}>
    <form id="instrument-task" className="cs-instrument-dialog-body" onSubmit={e=>{e.preventDefault();setOpen(false);setMessage('已创建演示任务，未发送请求。');}}>
      <Input placeholderReveal label="任务名称" placeholder="例如：产线噪声检测" required autoFocus/>
      <Select label="测量设备" defaultValue="01"><option value="01">声学成像仪 01</option><option value="02">数据采集终端 02</option><option value="03" disabled>离线设备（不可用）</option></Select>
      <Select label="采样率" defaultValue="48"><option value="48">48 kHz</option><option value="96">96 kHz</option></Select>
    </form>
  </InstrumentDialog><p role="status" className="cs-help">{message || '演示表单弹窗；支持 Esc 关闭、键盘导航和返回触发按钮。'}</p></div>;
}
