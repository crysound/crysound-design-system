"use client";
import {
  forwardRef,
  useId,
  useState,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
  type ComponentProps,
} from "react";
import * as C from "@radix-ui/react-checkbox";
import * as S from "@radix-ui/react-switch";
import * as R from "@radix-ui/react-radio-group";
import * as L from "@radix-ui/react-slider";
import * as P from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { cx } from "./utils";
import { Button } from "./index";
type FieldProps = { label: string; hint?: string; error?: string };
function Help({
  id,
  error,
  hint,
}: {
  id: string;
  error?: string;
  hint?: string;
}) {
  return error || hint ? (
    <span id={id} className={cx("cs-help", !!error && "cs-error")}>
      {error || hint}
    </span>
  ) : null;
}
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(function Textarea(
  {
    label,
    hint,
    error,
    id,
    className,
    "aria-describedby": described,
    ...props
  },
  ref,
) {
  const generated = useId();
  const field = id ?? generated;
  return (
    <div className="cs-field">
      <label htmlFor={field}>{label}</label>
      <textarea
        {...props}
        ref={ref}
        id={field}
        rows={props.rows ?? 4}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={
          [described, (error || hint) && `${field}-help`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cx("cs-input cs-textarea", className)}
      />
      <Help id={`${field}-help`} error={error} hint={hint} />
    </div>
  );
});
export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & FieldProps
>(function Select(
  {
    label,
    hint,
    error,
    id,
    className,
    children,
    "aria-describedby": described,
    ...props
  },
  ref,
) {
  const generated = useId();
  const field = id ?? generated;
  return (
    <div className="cs-field">
      <label htmlFor={field}>{label}</label>
      <select
        {...props}
        ref={ref}
        id={field}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={
          [described, (error || hint) && `${field}-help`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cx("cs-input cs-select", className)}
      >
        {children}
      </select>
      <Help id={`${field}-help`} error={error} hint={hint} />
    </div>
  );
});
export function Checkbox({
  label,
  description,
  id,
  className,
  ...props
}: ComponentProps<typeof C.Root> & { label: ReactNode; description?: string }) {
  const generated = useId();
  const field = id ?? generated;
  return (
    <div className="cs-choice">
      <C.Root
        {...props}
        id={field}
        aria-describedby={
          description ? `${field}-help` : props["aria-describedby"]
        }
        className={cx("cs-checkbox", className)}
      >
        <C.Indicator>
          {props.checked === "indeterminate" ? "−" : "✓"}
        </C.Indicator>
      </C.Root>
      <div>
        <label htmlFor={field}>{label}</label>
        {description && (
          <p className="cs-help" id={`${field}-help`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
export function Switch({
  label,
  description,
  id,
  className,
  ...props
}: ComponentProps<typeof S.Root> & { label: ReactNode; description?: string }) {
  const generated = useId();
  const field = id ?? generated;
  return (
    <div className="cs-choice">
      <S.Root
        {...props}
        id={field}
        aria-describedby={
          description ? `${field}-help` : props["aria-describedby"]
        }
        className={cx("cs-switch", className)}
      >
        <S.Thumb className="cs-switch-thumb" />
      </S.Root>
      <div>
        <label htmlFor={field}>{label}</label>
        {description && (
          <p className="cs-help" id={`${field}-help`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
export function RadioGroup({
  label,
  options,
  className,
  ...props
}: ComponentProps<typeof R.Root> & { label: string; options: ChoiceOption[] }) {
  const id = useId();
  return (
    <div className="cs-field">
      <span id={id} className="cs-label">
        {label}
      </span>
      <R.Root
        {...props}
        aria-labelledby={id}
        className={cx("cs-radio-group", className)}
      >
        {options.map((option, i) => (
          <div className="cs-choice" key={option.value}>
            <R.Item
              value={option.value}
              id={`${id}-${i}`}
              disabled={props.disabled || option.disabled}
              aria-describedby={
                option.description ? `${id}-${i}-help` : undefined
              }
              className="cs-radio"
            >
              <R.Indicator className="cs-radio-dot" />
            </R.Item>
            <div>
              <label htmlFor={`${id}-${i}`}>{option.label}</label>
              {option.description && (
                <p className="cs-help" id={`${id}-${i}-help`}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </R.Root>
    </div>
  );
}
export function Slider({
  label,
  unit = "",
  className,
  ...props
}: ComponentProps<typeof L.Root> & { label: string; unit?: string }) {
  const id = useId();
  const [internal, setInternal] = useState(
    props.defaultValue ?? [props.min ?? 0],
  );
  const value = props.value ?? internal;
  return (
    <div className="cs-field">
      <div className="cs-between">
        <span id={id} className="cs-label">
          {label}
        </span>
        <output>
          {value.join(" – ")} {unit}
        </output>
      </div>
      <L.Root
        {...props}
        value={value}
        onValueChange={(v) => {
          setInternal(v);
          props.onValueChange?.(v);
        }}
        className={cx("cs-slider", className)}
      >
        <L.Track className="cs-slider-track">
          <L.Range className="cs-slider-range" />
        </L.Track>
        {value.map((_, i) => (
          <L.Thumb
            key={i}
            aria-labelledby={value.length === 1 ? id : undefined}
            aria-label={
              value.length > 1
                ? `${label} ${i === 0 ? "下限" : "上限"}`
                : undefined
            }
            className="cs-slider-thumb"
          />
        ))}
      </L.Root>
    </div>
  );
}
export interface ComboboxProps {
  label: string;
  options: ChoiceOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
}
export function Combobox({
  label,
  options,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "选择项目",
  disabled,
  emptyText = "没有匹配项",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const selected = value ?? internal;
  const id = useId();
  return (
    <div className="cs-field">
      <span id={id} className="cs-label">
        {label}
      </span>
      <P.Root open={open} onOpenChange={setOpen}>
        <P.Trigger asChild>
          <Button
            variant="secondary"
            className="cs-combobox-trigger"
            disabled={disabled}
            aria-labelledby={id}
            aria-label={`${label}：${options.find((o) => o.value === selected)?.label ?? placeholder}`}
          >
            {options.find((o) => o.value === selected)?.label ?? placeholder}
            <svg className="cs-combobox-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </Button>
        </P.Trigger>
        <P.Portal>
          <P.Content
            className="cs-popover cs-combobox"
            sideOffset={6}
            align="start"
          >
            <Command label={`${label}搜索`}>
              <Command.Input
                placeholder="搜索…"
                aria-label={`搜索${label}`}
                className="cs-command-input"
              />
              <Command.List className="cs-command-list">
                <Command.Empty className="cs-command-empty">
                  {emptyText}
                </Command.Empty>
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    disabled={option.disabled}
                    onSelect={() => {
                      setInternal(option.value);
                      onValueChange?.(option.value);
                      setOpen(false);
                    }}
                    className="cs-command-item"
                  >
                    {option.label}
                    <span aria-hidden="true">
                      {option.value === selected ? "✓" : ""}
                    </span>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </P.Content>
        </P.Portal>
      </P.Root>
    </div>
  );
}
export function FileUpload({
  label,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  disabled,
  onFilesChange,
}: {
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  onFilesChange?: (files: File[]) => void;
}) {
  const id = useId();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  return (
    <div className="cs-field">
      <label htmlFor={id}>{label}</label>
      <div className="cs-file-upload">
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={`${id}-help`}
          aria-invalid={!!error}
          onChange={(e) => {
            const next = Array.from(e.target.files ?? []);
            if (next.some((f) => f.size > maxSize)) {
              setError(`文件不能超过 ${Math.round(maxSize / 1024 / 1024)} MB`);
              e.target.value = "";
              return;
            }
            setError("");
            setFiles(next);
            onFilesChange?.(next);
          }}
        />
        <span className="cs-help" id={`${id}-help`}>
          {error ||
            `仅本地选择，最大 ${Math.round(maxSize / 1024 / 1024)} MB；上传由业务层处理。`}
        </span>
      </div>
      {files.length > 0 && (
        <ul className="cs-file-list">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`}>
              {file.name}
              <span>{Math.ceil(file.size / 1024)} KB</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
