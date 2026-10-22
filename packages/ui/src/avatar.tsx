"use client";
import { Children, cloneElement, isValidElement, useState, type HTMLAttributes, type ReactNode } from "react";
import { CrysoundMark } from "./brand-mark";
import { cx } from "./utils";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarStatus = "online" | "away" | "busy" | "offline";
const statusNames: Record<AvatarStatus, string> = { online: "在线", away: "离开", busy: "忙碌", offline: "离线" };

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  name: string;
  src?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: "circle" | "rounded";
  variant?: "initials" | "logo";
  status?: AvatarStatus;
  statusLabel?: string;
  loading?: boolean;
}

// A new source mounts a fresh visual, isolating late events from previous images.
function AvatarVisual({ src, fallback, loading }: { src?: string; fallback: ReactNode; loading: boolean }) {
  const [state, setState] = useState<"pending" | "loaded" | "error">("pending");
  return <span className="cs-avatar-face" data-state={loading ? "loading" : src ? state : "fallback"} aria-hidden="true">
    <span className="cs-avatar-fallback">{fallback}</span>
    {src && state !== "error" && <img src={src} alt="" draggable={false} onLoad={() => setState("loaded")} onError={() => setState("error")} />}
    {loading && <span className="cs-avatar-loading" />}
  </span>;
}

export function Avatar({ name, src, initials, size = "md", shape = "circle", variant = "initials", status, statusLabel, loading = false, className, ...props }: AvatarProps) {
  const label = name.trim() || "未知用户";
  const letters = (initials?.trim() ? Array.from(initials.trim()).slice(0, 2).join("") : Array.from(name.trim())[0] || "?").toLocaleUpperCase();
  const presence = status ? statusLabel?.trim() || statusNames[status] : undefined;
  return <span {...props} role="img" aria-label={props["aria-label"] ?? [label, presence, loading ? "头像加载中" : undefined].filter(Boolean).join("，")} aria-busy={loading || undefined} className={cx("cs-avatar", `cs-avatar--${size}`, className)} data-shape={shape} data-variant={variant}>
    <AvatarVisual key={src || ""} src={src} loading={loading} fallback={variant === "logo" ? <CrysoundMark className="cs-avatar-logo" /> : letters} />
    {status && <span className="cs-avatar-status" data-status={status} title={presence} aria-hidden="true" />}
  </span>;
}

export interface AvatarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  label?: string;
  size?: AvatarSize;
  max?: number;
}

export function AvatarGroup({ children, label = "参与成员", size = "md", max, className, ...props }: AvatarGroupProps) {
  const avatars = Children.toArray(children).filter(child => isValidElement<AvatarProps>(child) && child.type === Avatar);
  const limit = max === undefined || !Number.isFinite(max) ? avatars.length : Math.max(1, Math.floor(max));
  const remaining = Math.max(0, avatars.length - limit);
  return <div {...props} role="group" aria-label={props["aria-label"] ?? label} className={cx("cs-avatar-group", className)}>
    {avatars.slice(0, limit).map(child => isValidElement<AvatarProps>(child) ? cloneElement(child, { size }) : null)}
    {remaining > 0 && <span className={cx("cs-avatar", `cs-avatar--${size}`, "cs-avatar-group-count")} role="img" aria-label={`另有 ${remaining} 位成员`} data-shape="circle"><span className="cs-avatar-face" aria-hidden="true">{remaining > 99 ? "99+" : `+${remaining}`}</span></span>}
    {!avatars.length && <span className="cs-avatar-group-empty">暂无成员</span>}
  </div>;
}
