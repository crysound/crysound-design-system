"use client";
import {
  forwardRef, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState,
  type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode, type MouseEventHandler,
} from "react";
import { Eye, EyeOff, XClose, ChevronDown, HelpCircle } from "@untitledui/icons";
import * as Menu from "@radix-ui/react-dropdown-menu";
import { Tooltip } from "./overlays";
import { cx } from "./utils";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  placeholderReveal?: boolean;
}
export interface InputSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "multiple" | "size"> {
  label: string;
  options: readonly { value: string; label: string; disabled?: boolean }[];
}
export interface InputActionProps {
  label: string;
  icon?: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}
export interface InputProps extends InputFieldProps {
  /** Visual size; native numeric `size` still controls character width. */
  controlSize?: "sm" | "md" | "lg";
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  prefix?: string;
  suffix?: string;
  prefixDivider?: boolean;
  helpTooltip?: string;
  helpLabel?: string;
  leadingSelect?: InputSelectProps;
  trailingSelect?: InputSelectProps;
  trailingAction?: InputActionProps;
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  passwordToggle?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

function InputSelect({ label, options, disabled, ...props }: InputSelectProps) {
  const native = useRef<HTMLSelectElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [current,setCurrent] = useState(String(props.defaultValue ?? options[0]?.value ?? ""));
  const value = props.value !== undefined ? String(props.value) : current;
  useEffect(() => {
    const select = native.current;
    let active = true;
    const reset = (event: Event) => queueMicrotask(() => { if(active && !event.defaultPrevented) setCurrent(select?.value ?? ""); });
    select?.form?.addEventListener("reset",reset);
    return () => {active=false;select?.form?.removeEventListener("reset",reset);};
  },[props.form]);
  return <span className="cs-input-select">
    <select {...props} ref={native} className="cs-select-native" tabIndex={-1} aria-hidden="true" disabled={disabled} value={value}
      onInvalid={event=>{trigger.current?.focus();props.onInvalid?.(event);}}
      onChange={event=>{setCurrent(event.target.value);props.onChange?.(event);}}>
      {options.map(option => <option key={option.value} {...option}>{option.label}</option>)}
    </select>
    <Menu.Root modal={false}>
      <Menu.Trigger ref={trigger} type="button" disabled={disabled} className="cs-input-select-trigger" aria-label={label}>
        <span>{options.find(option=>option.value===value)?.label}</span><ChevronDown size={14} aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal><Menu.Content className="cs-select-menu" sideOffset={6} align="end" collisionPadding={12}>
        <Menu.RadioGroup value={value} onValueChange={next=>{
          const select=native.current;if(!select)return;
          Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value")?.set?.call(select,next);
          select.dispatchEvent(new Event("change",{bubbles:true}));
        }}>
          {options.map(option=><Menu.RadioItem key={option.value} value={option.value} disabled={option.disabled} className="cs-select-option">
            <span className="cs-select-option-label">{option.label}</span><Menu.ItemIndicator className="cs-select-option-indicator" aria-hidden="true">✓</Menu.ItemIndicator>
          </Menu.RadioItem>)}
        </Menu.RadioGroup>
      </Menu.Content></Menu.Portal>
    </Menu.Root>
  </span>;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  label, hint, error, id, className, placeholderReveal = false, controlSize = "md",
  iconStart, iconEnd, prefix, suffix, prefixDivider = false, helpTooltip, helpLabel = `${label}帮助`, leadingSelect, trailingSelect, trailingAction,
  clearable = false, clearLabel = `清空${label}`, onClear, passwordToggle = false,
  showPasswordLabel = "显示密码", hidePasswordLabel = "隐藏密码", type = "text",
  "aria-describedby": description, ...props
}, ref) {
  const generated = useId();
  const inputId = id ?? generated;
  const helpId = `${inputId}-help`;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, []);
  const [current, setCurrent] = useState(String(props.defaultValue ?? ""));
  const [revealed, setRevealed] = useState(false);
  const selection = useRef<{ start: number | null; end: number | null } | null>(null);
  const value = props.value !== undefined ? String(props.value ?? "") : current;
  const textEntry = ["text", "search", "url", "tel", "email", "password"].includes(type);
  const canClear = clearable && textEntry && !props.disabled && !props.readOnly && value.length > 0;
  const canReveal = passwordToggle && type === "password";
  const grouped = !!(helpTooltip || iconStart || iconEnd || prefix || suffix || leadingSelect || trailingSelect || trailingAction || (clearable && textEntry) || canReveal);
  const invalid = !!error || props["aria-invalid"] === true || props["aria-invalid"] === "true";

  useEffect(() => {
    const input = inputRef.current;
    const form = input?.form;
    let active = true;
    const reset = (event: Event) => {
      // Read after the browser's reset default action; respect prevented resets.
      queueMicrotask(() => {
        if (active && !event.defaultPrevented) {
          setCurrent(input?.value ?? "");
          setRevealed(false);
        }
      });
    };
    form?.addEventListener("reset", reset);
    return () => { active = false; form?.removeEventListener("reset", reset); };
  }, [props.form]);
  useLayoutEffect(() => {
    const saved = selection.current;
    const input = inputRef.current;
    if (saved && input) {
      input.focus({ preventScroll: true });
      input.setSelectionRange(saved.start, saved.end);
      selection.current = null;
    }
  }, [revealed]);

  function clear() {
    const input = inputRef.current;
    if (!input || !canClear) return;
    // Use the native setter so React emits its normal onChange with the real input.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus({ preventScroll: true });
    onClear?.();
  }
  const entry = <div className={cx(grouped ? "cs-input-entry" : "cs-input-wrap", placeholderReveal && "cs-input-reveal")}>
    <input {...props} ref={inputRef} id={inputId}
      type={canReveal && revealed ? "text" : type}
      className={cx("cs-input", className)} data-control-size={controlSize}
      aria-invalid={error ? true : props["aria-invalid"]}
      aria-describedby={[description, (error || hint) && helpId].filter(Boolean).join(" ") || undefined}
      onChange={event => { setCurrent(event.target.value); props.onChange?.(event); }} />
    {placeholderReveal && props.placeholder && <span className="cs-input-placeholder-reveal" aria-hidden="true">
      {Array.from(props.placeholder).map((char, index) => <span key={index} style={{ animationDelay: `${index * 90}ms` }}>{char}</span>)}
    </span>}
  </div>;
  return <div className="cs-field">
    <div className="cs-input-label-row"><label htmlFor={inputId}>{label}</label>{props.required && <span className="cs-input-required" aria-hidden="true">*</span>}</div>
    {grouped ? <div className="cs-input-control" data-size={controlSize}
      data-invalid={invalid || undefined} data-disabled={props.disabled || undefined} data-readonly={props.readOnly || undefined}>
      {leadingSelect && <InputSelect {...leadingSelect} disabled={props.disabled || props.readOnly || leadingSelect.disabled} />}
      {iconStart && <span className="cs-input-icon" aria-hidden="true">{iconStart}</span>}
      {prefix && <span className={cx("cs-input-affix", prefixDivider && "cs-input-affix--divided")}>{prefix}</span>}
      {entry}
      {suffix && <span className="cs-input-affix">{suffix}</span>}
      {iconEnd && <span className="cs-input-icon" aria-hidden="true">{iconEnd}</span>}
      {clearable && textEntry && <span className="cs-input-tool-slot">
        {canClear && <button type="button" className="cs-input-tool" aria-label={clearLabel} aria-controls={inputId}
          onPointerDown={event => event.preventDefault()} onClick={clear}><XClose size={16} aria-hidden="true" /></button>}
      </span>}
      {canReveal && <button type="button" className="cs-input-tool" disabled={props.disabled}
        aria-label={revealed ? hidePasswordLabel : showPasswordLabel} aria-pressed={revealed} aria-controls={inputId}
        onPointerDown={event => event.preventDefault()} onClick={() => {
          const input = inputRef.current;
          if (input) selection.current = { start: input.selectionStart, end: input.selectionEnd };
          setRevealed(previous => !previous);
        }}>{revealed ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button>}
      {helpTooltip && <Tooltip content={helpTooltip}><button type="button" className="cs-input-tool" aria-label={helpLabel} disabled={props.disabled}><HelpCircle size={18} aria-hidden="true" /></button></Tooltip>}
      {trailingSelect && <InputSelect {...trailingSelect} disabled={props.disabled || props.readOnly || trailingSelect.disabled} />}
      {trailingAction && <button type="button" className="cs-input-action"
        disabled={props.disabled || trailingAction.disabled} onClick={trailingAction.onClick}>
        {trailingAction.icon && <span aria-hidden="true">{trailingAction.icon}</span>}{trailingAction.label}
      </button>}
    </div> : entry}
    {(error || hint) && <span id={helpId} className={cx("cs-help", !!error && "cs-error")}>{error || hint}</span>}
  </div>;
});
