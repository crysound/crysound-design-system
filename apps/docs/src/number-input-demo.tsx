import { useState } from "react";
import { NumberInput } from "../../../packages/ui/src/index";

export function NumberInputDemo() {
  const [draft, setDraft] = useState("64");
  return <div className="demo-stack reference-demo-field">
    <NumberInput label="可清空的受控输入 / dB(A)" value={draft} onChange={event => setDraft(event.target.value)} min={30} max={90} hint={draft === "" ? "当前为空；不会自动变成0。" : `当前输入：${draft}；范围30–90。`} />
    <NumberInput label="小数步长 / dB" defaultValue={0.5} min={-12} max={12} step={0.1} hint="每次调整0.1，支持负值。" />
    <NumberInput label="空值输入 / s" placeholder="请输入时长" min={0} />
    <NumberInput label="错误状态 / dB(A)" defaultValue={95} min={30} max={90} error="请输入30至90之间的数值。" />
    <NumberInput label="只读数值 / Hz" value={1000} readOnly />
    <NumberInput label="禁用状态 / 路" defaultValue={4} disabled />
  </div>;
}
