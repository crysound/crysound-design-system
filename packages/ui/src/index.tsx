"use client";
import {
  forwardRef,
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
const cx = (...parts: (string | undefined | false)[]) =>
  parts.filter(Boolean).join(" ");
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      loading = false,
      size = "md",
      iconStart,
      iconEnd,
      disabled,
      children,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cx(
          "cs-button",
          `cs-button--${variant}`,
          `cs-button--${size}`,
          className,
        )}
      >
        {loading && <span aria-hidden="true" className="cs-spinner" />}
        {!loading && iconStart && <span aria-hidden="true">{iconStart}</span>}
        {children}
        {iconEnd && <span aria-hidden="true">{iconEnd}</span>}
      </button>
    );
  },
);
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    id,
    className,
    "aria-describedby": description,
    ...props
  },
  ref,
) {
  const generated = useId();
  const inputId = id ?? generated;
  const helpId = `${inputId}-help`;
  return (
    <div className="cs-field">
      <label htmlFor={inputId}>{label}</label>
      <input
        {...props}
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={
          [description, error || hint ? helpId : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cx("cs-input", className)}
      />
      {(error || hint) && (
        <span id={helpId} className={cx("cs-help", !!error && "cs-error")}>
          {error || hint}
        </span>
      )}
    </div>
  );
});
export type Status = "online" | "offline" | "warning" | "error" | "running";
const statusLabels: Record<Status, string> = {
  online: "在线",
  offline: "离线",
  warning: "需关注",
  error: "故障",
  running: "运行中",
};
export function StatusBadge({
  status,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { status: Status }) {
  return (
    <span
      {...props}
      className={cx("cs-badge", `cs-badge--${status}`, props.className)}
    >
      <span aria-hidden="true" className="cs-dot" />
      {children ?? statusLabels[status]}
    </span>
  );
}
export function Card({
  title,
  description,
  children,
  actions,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <section {...props} className={cx("cs-card", props.className)}>
      <header className="cs-card-header">
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}
export function Metric({
  label,
  value,
  unit,
  note,
}: {
  label: string;
  value: number | string;
  unit?: string;
  note?: string;
}) {
  return (
    <div className="cs-metric">
      <div className="cs-muted">{label}</div>
      <div className="cs-metric-value">
        {value} <span>{unit}</span>
      </div>
      {note && <div className="cs-muted">{note}</div>}
    </div>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="cs-empty">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Dialog({
  trigger,
  title,
  description,
  children,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="cs-dialog-overlay" />
        <DialogPrimitive.Content className="cs-dialog">
          <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description>
            {description}
          </DialogPrimitive.Description>
          {children}
          <DialogPrimitive.Close asChild>
            <Button variant="secondary">关闭</Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
export interface Device {
  id: string;
  name: string;
  model: string;
  status: Status;
  location: string;
}
export function DeviceTable({
  devices,
  onSelect,
}: {
  devices: Device[];
  onSelect?: (device: Device) => void;
}) {
  return devices.length ? (
    <div className="cs-table-scroll">
      <table className="cs-table cs-device-table">
        <caption className="cs-sr-only">设备列表</caption>
        <thead>
          <tr>
            <th scope="col">设备 / 型号</th>
            <th scope="col">位置</th>
            <th scope="col">状态</th>
            {onSelect && <th scope="col">操作</th>}
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <th scope="row">
                {device.name}
                <small>
                  {device.model} · {device.id}
                </small>
              </th>
              <td>{device.location}</td>
              <td>
                <StatusBadge status={device.status} />
              </td>
              {onSelect && (
                <td>
                  <Button
                    variant="ghost"
                    onClick={() => onSelect(device)}
                    aria-label={`查看 ${device.name}`}
                  >
                    查看
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState title="暂无设备" description="请添加设备，或调整筛选条件。" />
  );
}

export * from "./forms";
export * from "./navigation";
export * from "./overlays";
export * from "./display";
export * from "./toast";
export * from "./data-table";
export * from "./file-icon";
export * from "./video-player";
export * from "./color-picker";
export * from "./command-menu";

export * from "./date-picker";
export * from "./inline-cta";

export * from "./charts";
export * from "./loading-indicator";
