"use client";
import {
  type HTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react";
import * as P from "@radix-ui/react-progress";
import { cx } from "./utils";
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps, type AvatarSize, type AvatarStatus } from "./avatar";
export type Tone = "neutral" | "brand" | "success" | "warning" | "danger";
export function Badge({
  tone = "neutral",
  variant = "soft",
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  variant?: "soft" | "outline";
}) {
  return (
    <span
      {...props}
      className={cx(
        "cs-tag",
        `cs-tone-${tone}`,
        `cs-tag--${variant}`,
        props.className,
      )}
    >
      {children}
    </span>
  );
}
export function Alert({
  title,
  children,
  tone = "neutral",
  action,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: string;
  tone?: Tone;
  action?: ReactNode;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      {...props}
      className={cx("cs-alert", `cs-tone-${tone}`, props.className)}
    >
      <div className="cs-alert-content">
        <strong>{title}</strong>
        {children && <div>{children}</div>}
      </div>
      {action && <div className="cs-alert-action">{action}</div>}
    </div>
  );
}
export function Progress({
  value,
  label,
  showValue = true,
}: {
  value: number | null;
  label: string;
  showValue?: boolean;
}) {
  const safe = value === null ? null : Math.max(0, Math.min(100, value));
  return (
    <div className="cs-field">
      <div className="cs-between">
        <span className="cs-label">{label}</span>
        {showValue && (
          <span className="cs-help">
            {safe === null ? "处理中…" : `${Math.round(safe)}%`}
          </span>
        )}
      </div>
      <P.Root value={safe} max={100} aria-label={label} className="cs-progress">
        <P.Indicator
          className="cs-progress-indicator"
          style={
            safe === null
              ? undefined
              : { transform: `translateX(-${100 - safe}%)` }
          }
        />
      </P.Root>
    </div>
  );
}
export function Skeleton({
  effect = "pulse",
  variant = "rounded",
  animate = true,
  width = "100%",
  height = 16,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  effect?: "pulse" | "sweep";
  variant?: "rounded" | "circle" | "text";
  animate?: boolean;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx("cs-skeleton", `cs-skeleton--${variant}`, `cs-skeleton--${effect}`, className)}
      data-animate={animate}
      style={{ width, height, ...props.style }}
    />
  );
}
export function Separator({
  orientation = "horizontal",
  decorative = true,
  tone = "default",
}: {
  tone?: "default" | "subtle";
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      data-tone={tone}
      className={cx("cs-separator", `cs-separator--${orientation}`)}
    />
  );
}
