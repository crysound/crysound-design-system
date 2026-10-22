import { Avatar, AvatarGroup, Badge, type AvatarSize } from "../../../packages/ui/src/index";

const sizes = [{ size: "sm", label: "小", pixels: 28 }, { size: "md", label: "中", pixels: 40 }, { size: "lg", label: "大", pixels: 56 }] as const;
const members = [{ name: "林晨", initials: "L" }, { name: "Alex Chen", initials: "A" }, { name: "周宁", initials: "Z" }, { name: "李娜", initials: "L" }, { name: "王明", initials: "W" }];

export function AvatarDemo() {
  return <div className="avatar-demo-sizes">
    <span className="avatar-demo-corner" aria-hidden="true" />
    {sizes.map(({ size, label, pixels }) => <div className="avatar-demo-size-label" key={size}>{label}<small>{pixels}px</small></div>)}
    <span className="avatar-demo-row-label">首字母</span>
    {sizes.map(({ size }, i) => <Avatar key={size} name={members[i].name} initials={members[i].initials} size={size} />)}
    <span className="avatar-demo-row-label">公司 Logo</span>
    {sizes.map(({ size, label }) => <Avatar key={size} name={`CRYSOUND 公司，${label}号头像`} size={size} variant="logo" shape="rounded" />)}
    <span className="avatar-demo-row-label">浅色首字母</span>
    {sizes.map(({ size }, i) => <Avatar key={size} name={members[i].name} initials={members[i].initials} size={size} appearance="soft" />)}
    <span className="avatar-demo-row-label">浅色 Logo</span>
    {sizes.map(({ size, label }) => <Avatar key={size} name={`CRYSOUND 公司，浅色${label}号头像`} size={size} variant="logo" shape="rounded" appearance="soft" />)}
  </div>;
}

export function AvatarStatusDemo() {
  return <div className="avatar-demo-status-grid">
    {([{ status: "online", label: "在线", name: "林晨", initials: "L" }, { status: "away", label: "离开", name: "周宁", initials: "Z" }, { status: "busy", label: "忙碌", name: "Alex Chen", initials: "A" }, { status: "offline", label: "离线", name: "李娜", initials: "L" }] as const).map(({ status, label, name, initials }) => <div className="avatar-demo-item" key={status}><Avatar name={name} initials={initials} status={status} /><span>{label}</span></div>)}
  </div>;
}

function TeamAvatars({ size = "md", label = "声学研发团队" }: { size?: AvatarSize; label?: string }) {
  return <AvatarGroup size={size} max={3} label={label}>{members.map(({ name, initials }) => <Avatar key={name} name={name} initials={initials} />)}</AvatarGroup>;
}

export function AvatarGroupDemo() {
  return <div className="avatar-demo-groups">
    {sizes.map(({ size, label }) => <div className="avatar-demo-group-row" key={size}><span className="avatar-demo-row-label">{label}号组合</span><TeamAvatars size={size} label={`${label}号协作成员`} /></div>)}
  </div>;
}

export function AvatarCombinationsDemo() {
  return <div className="avatar-demo-combinations">
    <div className="avatar-demo-combination"><div className="avatar-demo-identity"><Avatar name="林晨" initials="L" status="online" /><div><strong>林晨</strong><small>声学工程师</small></div></div><Badge tone="brand">当前账号</Badge></div>
    <div className="avatar-demo-combination"><div className="avatar-demo-identity"><Avatar name="CRYSOUND" variant="logo" shape="rounded" /><div><strong>CRYSOUND</strong><small>企业工作空间</small></div></div><Badge>企业</Badge></div>
    <div className="avatar-demo-combination"><div className="avatar-demo-identity"><TeamAvatars size="sm" /><div><strong>声学研发团队</strong><small>5 位成员</small></div></div></div>
  </div>;
}

export function AvatarFallbackDemo() {
  return <div className="avatar-demo-status-grid">
    <div className="avatar-demo-item"><Avatar name="林晨" initials="L" loading /><span>加载中</span></div>
    <div className="avatar-demo-item"><Avatar name="陈言" initials="C" src="data:image/png;base64,AA==" /><span>图片不可用</span></div>
    <div className="avatar-demo-item"><Avatar name="" /><span>未命名</span></div>
    <div className="avatar-demo-item"><Avatar name="Alex Chen" initials="AC" /><span>自定义缩写</span></div>
  </div>;
}
