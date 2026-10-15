import { useRef, useState } from 'react';
import { DeviceTable, StatusBadge, DialogRoot, DialogContent, DialogTitle, DialogDescription, DialogClose, type Device } from '../../../packages/ui/src/index';

export function DeviceTableDemo({devices}: {devices: Device[]}) {
  const [selected, setSelected] = useState<Device>();
  const [open, setOpen] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  return <DialogRoot open={open} onOpenChange={setOpen}>
    <DeviceTable devices={devices} onSelect={device => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setSelected(device);
      setOpen(true);
    }} />
    <DialogContent className="cs-instrument-dialog cs-instrument-dialog--sm" onCloseAutoFocus={event => {
      event.preventDefault();
      if (returnFocus.current?.isConnected) returnFocus.current.focus();
    }}>
      <header className="cs-instrument-dialog-header"><DialogTitle>设备详情</DialogTitle><DialogDescription>演示设备信息，不连接真实设备。</DialogDescription></header>
      {selected && <dl className="device-detail-fields">
        <div><dt>设备名称</dt><dd>{selected.name}</dd></div>
        <div><dt>设备编号</dt><dd>{selected.id}</dd></div>
        <div><dt>型号</dt><dd>{selected.model}</dd></div>
        <div><dt>位置</dt><dd>{selected.location}</dd></div>
        <div><dt>状态</dt><dd><StatusBadge status={selected.status} /></dd></div>
      </dl>}
      <DialogClose className="cs-instrument-dialog-close" aria-label="关闭设备详情"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></DialogClose>
    </DialogContent>
  </DialogRoot>;
}
