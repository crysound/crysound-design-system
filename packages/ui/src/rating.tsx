"use client";
import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef } from "react";
import * as Radio from "@radix-ui/react-radio-group";
import { cx } from "./utils";

export interface RatingProps extends Omit<ComponentPropsWithoutRef<typeof Radio.Root>, "value" | "defaultValue" | "onValueChange" | "children" | "asChild"> {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Positive integer; defaults to five stars. */
  max?: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  getValueLabel?: (value: number, max: number) => string;
}

const valueLabel = (value: number, max: number) => value === 0 ? `未评分，共 ${max} 星` : `${value} 星，共 ${max} 星`;
function Star() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 2.9 1.1-6.3-4.6-4.4 6.3-.9Z" />
  </svg>;
}

export function Rating({
  label, value, defaultValue = 0, onValueChange, max: requestedMax = 5,
  size = "md", readOnly = false, hideLabel = false, hint, error,
  getValueLabel = valueLabel, className, name, required, disabled,
  onPointerLeave, onKeyDown, "aria-describedby": described, ...props
}: RatingProps) {
  const generated = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const max = Number.isFinite(requestedMax) && requestedMax >= 1 ? Math.floor(requestedMax) : 5;
  const normalize = (next: number) => Number.isFinite(next) ? Math.min(max, Math.max(0, Math.round(next))) : 0;
  const [internal, setInternal] = useState(defaultValue);
  const [preview, setPreview] = useState<number | null>(null);
  const selected = normalize(value ?? internal);
  const displayed = disabled || readOnly ? selected : preview ?? selected;
  const description = [described, (error || hint) && `${generated}-help`].filter(Boolean).join(" ") || undefined;

  useEffect(() => { setPreview(null); }, [selected, disabled, readOnly, max]);
  useEffect(() => {
    const form = groupRef.current?.closest("form");
    const reset = (event: Event) => queueMicrotask(() => {
      if (!event.defaultPrevented && value === undefined) {
        setInternal(defaultValue);
        setPreview(null);
      }
    });
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [value, defaultValue, readOnly]);

  return <div className="cs-field cs-rating" data-size={size}>
    <span id={`${generated}-label`} className={hideLabel ? "cs-sr-only" : "cs-label"}>{label}</span>
    {readOnly ? <>
      <div {...props} ref={groupRef} role="img" aria-label={`${label}：${getValueLabel(selected, max)}`}
        aria-describedby={description} className={cx("cs-rating-stars", className)} data-disabled={disabled || undefined}>
        {Array.from({ length: max }, (_, index) => <span key={index} className="cs-rating-item" data-filled={index < selected}><Star /></span>)}
      </div>
      {name && <input type="hidden" name={name} value={selected} disabled={disabled} />}
    </> : <Radio.Root
      {...props} ref={groupRef} name={name} required={required} disabled={disabled}
      value={selected ? String(selected) : ""} orientation="horizontal"
      aria-labelledby={`${generated}-label`} aria-describedby={description}
      aria-invalid={error ? true : props["aria-invalid"]}
      className={cx("cs-rating-stars", className)} data-disabled={disabled || undefined}
      onValueChange={next => {
        const score = Number(next);
        if (value === undefined) setInternal(score);
        setPreview(null);
        onValueChange?.(score);
      }}
      onPointerLeave={event => { setPreview(null); onPointerLeave?.(event); }}
      onKeyDown={event => { setPreview(null); onKeyDown?.(event); }}
    >
      {Array.from({ length: max }, (_, index) => <Radio.Item
        key={index} value={String(index + 1)} className="cs-rating-item"
        aria-label={getValueLabel(index + 1, max)} data-filled={index < displayed}
        onPointerEnter={event => { if (!disabled && event.pointerType !== "touch") setPreview(index + 1); }}
      ><Star /></Radio.Item>)}
    </Radio.Root>}
    {(error || hint) && <span id={`${generated}-help`} className={cx("cs-help", !!error && "cs-error")}>{error || hint}</span>}
  </div>;
}
