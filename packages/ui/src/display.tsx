"use client";
import {
  useState,
  type HTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react";
import * as P from "@radix-ui/react-progress";
import { cx } from "./utils";
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
export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  return (
    <span
      role="img"
      aria-label={name}
      className={cx("cs-avatar", `cs-avatar--${size}`)}
    >
      {src && src !== failedSrc ? (
        <img src={src} alt="" onError={() => setFailedSrc(src)} />
      ) : (
        <span aria-hidden="true">
          {name
            .trim()
            .split(/\s+/)
            .map((n) => Array.from(n)[0])
            .slice(0, 2)
            .join("") || "?"}
        </span>
      )}
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
      {action}
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
  width = "100%",
  height = 16,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx("cs-skeleton", className)}
      style={{ width, height, ...props.style }}
    />
  );
}
export function Separator({
  orientation = "horizontal",
  decorative = true,
}: {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cx("cs-separator", `cs-separator--${orientation}`)}
    />
  );
}
