"use client";
import { useState, type ReactNode, type ComponentProps } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as Menu from "@radix-ui/react-dropdown-menu";
import * as D from "@radix-ui/react-dialog";
import * as AD from "@radix-ui/react-alert-dialog";
import { Button } from "./index";
import { cx } from "./utils";
export function Tooltip({
  content,
  children,
  delayDuration = 250,
}: {
  content: ReactNode;
  children: ReactNode;
  delayDuration?: number;
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content className="cs-tooltip" sideOffset={7}>
            {content}
            <TooltipPrimitive.Arrow className="cs-tooltip-arrow" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
export function Popover({
  trigger,
  title,
  children,
  open,
  onOpenChange,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align="start"
          className="cs-popover"
          aria-label={title}
        >
          <div className="cs-between">
            <strong>{title}</strong>
            <PopoverPrimitive.Close asChild>
              <button type="button" className="cs-overlay-close" aria-label="关闭浮层"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
            </PopoverPrimitive.Close>
          </div>
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
export interface MenuItem {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separatorBefore?: boolean;
  onSelect?: () => void;
}
export function DropdownMenu({
  trigger,
  items,
  label = "操作菜单",
}: {
  trigger: ReactNode;
  items: MenuItem[];
  label?: string;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild className="cs-dropdown-trigger">{trigger}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          className="cs-dropdown"
          sideOffset={6}
          align="end"
          aria-label={label}
        >
          {items.map((item) => (
            <div key={item.id}>
              {item.separatorBefore && (
                <Menu.Separator className="cs-separator" />
              )}
              <Menu.Item
                disabled={item.disabled}
                onSelect={item.onSelect}
                className={cx("cs-menu-item", item.danger && "cs-error")}
              >
                {item.label}
                {item.shortcut && (
                  <span className="cs-menu-shortcut">{item.shortcut}</span>
                )}
              </Menu.Item>
            </div>
          ))}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
export function Sheet({
  trigger,
  title,
  description,
  children,
  side = "right",
  open,
  onOpenChange,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  side?: "right" | "left";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Trigger asChild>{trigger}</D.Trigger>
      <D.Portal>
        <D.Overlay className="cs-dialog-overlay" />
        <D.Content className={cx("cs-sheet", `cs-sheet--${side}`)}>
          <div className="cs-between">
            <D.Title>{title}</D.Title>
            <D.Close asChild>
              <button type="button" className="cs-overlay-close" aria-label="关闭面板"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
            </D.Close>
          </div>
          <D.Description className="cs-muted">{description}</D.Description>
          <div className="cs-sheet-body">{children}</div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
export function AlertDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = "确认",
  cancelLabel = "取消",
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return (
    <AD.Root
      open={open}
      onOpenChange={(next) => {
        if (!pending) {
          setOpen(next);
          if (next) setError("");
        }
      }}
    >
      <AD.Trigger asChild>{trigger}</AD.Trigger>
      <AD.Portal>
        <AD.Overlay className="cs-dialog-overlay" />
        <AD.Content className="cs-dialog">
          <AD.Title>{title}</AD.Title>
          <AD.Description className="cs-dialog-description">{description}</AD.Description>
          {error && (
            <p role="alert" className="cs-error">
              {error}
            </p>
          )}
          <div className="cs-actions">
            <AD.Cancel asChild>
              <Button disabled={pending} variant="secondary">
                {cancelLabel}
              </Button>
            </AD.Cancel>
            <AD.Action asChild>
              <Button
                variant="danger"
                loading={pending}
                onClick={async (e) => {
                  e.preventDefault();
                  setPending(true);
                  setError("");
                  try {
                    await onConfirm();
                    setOpen(false);
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "操作失败，请重试。",
                    );
                  } finally {
                    setPending(false);
                  }
                }}
              >
                {confirmLabel}
              </Button>
            </AD.Action>
          </div>
        </AD.Content>
      </AD.Portal>
    </AD.Root>
  );
}
// Composable dialog primitives for custom workflows; the convenience Dialog remains compatible.
export const DialogRoot = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogTitle = D.Title;
export function DialogDescription({ className, ...props }: ComponentProps<typeof D.Description>) {
  return <D.Description {...props} className={cx("cs-dialog-description", className)} />;
}
export const DialogClose = D.Close;
export function DialogContent({
  className,
  ...props
}: ComponentProps<typeof D.Content>) {
  return (
    <D.Portal>
      <D.Overlay className="cs-dialog-overlay" />
      <D.Content {...props} className={cx("cs-dialog", className)} />
    </D.Portal>
  );
}
