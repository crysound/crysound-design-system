"use client";
import {
  Children,
  isValidElement,
  useEffect,
  forwardRef,
  useId,
  useRef,
  useState,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
  type ComponentProps,
} from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
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
  SelectHTMLAttributes<HTMLSelectElement> & FieldProps & {hideLabel?: boolean}
>(function Select(
  {
    label,
    hideLabel = false,
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
  const native = useRef<HTMLSelectElement | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = Children.toArray(children).filter(isValidElement).map(child => {
    const option = child.props as { value?: string | number; children?: ReactNode; disabled?: boolean };
    return { value: String(option.value ?? option.children ?? ''), label: option.children, disabled: option.disabled };
  });
  const [current, setCurrent] = useState(String(props.value ?? props.defaultValue ?? options[0]?.value ?? ''));
  useEffect(() => {
    const select = native.current;
    const reset = () => requestAnimationFrame(() => setCurrent(select?.value ?? ''));
    select?.form?.addEventListener('reset', reset);
    return () => select?.form?.removeEventListener('reset', reset);
  }, []);
  const value = props.value !== undefined ? String(props.value) : current;
  const description = [described, (error || hint) && `${field}-help`].filter(Boolean).join(' ') || undefined;
  // Preserve native multi-select, grouped options and custom child contracts.
  if (props.multiple || props.size || Children.toArray(children).some(child => !isValidElement(child) || child.type !== 'option')) {
    return <div className="cs-field"><label className={hideLabel?'cs-sr-only':undefined} htmlFor={field}>{label}</label><select {...props} ref={ref} id={field} className={cx('cs-input cs-select',className)} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={description}>{children}</select><Help id={`${field}-help`} error={error} hint={hint}/></div>;
  }
  return <div className="cs-field">
    <label className={hideLabel?'cs-sr-only':undefined} id={`${field}-label`} htmlFor={field}>{label}</label>
    <select {...props} ref={node => { native.current = node; if(typeof ref === 'function') ref(node); else if(ref) ref.current = node; }}
      className="cs-select-native" aria-hidden="true" tabIndex={-1} value={value}
      onChange={event => {setCurrent(event.target.value); props.onChange?.(event);}}
      onInvalid={event => {trigger.current?.focus(); props.onInvalid?.(event);}}>{children}</select>
    <Menu.Root modal={false}>
      <Menu.Trigger ref={trigger} id={field} disabled={props.disabled} className={cx('cs-input cs-select-trigger',className)} style={props.style}
        aria-labelledby={`${field}-label ${field}-value`} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={description}>
        <span id={`${field}-value`}>{options.find(option => option.value === value)?.label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </Menu.Trigger>
      <Menu.Portal><Menu.Content className="cs-select-menu" sideOffset={6} align="start" collisionPadding={12}>
        <Menu.RadioGroup value={value} onValueChange={next => {
          const select = native.current;
          if(!select) return;
          Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value')?.set?.call(select,next);
          select.dispatchEvent(new Event('change',{bubbles:true}));
        }}>
          {options.map(option => <Menu.RadioItem key={option.value} value={option.value} disabled={option.disabled} className="cs-select-option">
            <span className="cs-select-option-label">{option.label}</span><Menu.ItemIndicator className="cs-select-option-indicator" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="m20 6-11 11-5-5"/></svg></Menu.ItemIndicator>
          </Menu.RadioItem>)}
        </Menu.RadioGroup>
      </Menu.Content></Menu.Portal>
    </Menu.Root>
    <Help id={`${field}-help`} error={error} hint={hint}/>
  </div>;
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
        <C.Indicator forceMount className="cs-checkbox-indicator" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path className="cs-checkbox-check" d="m3.5 8 3 3 6-6" pathLength="1" />
            <path className="cs-checkbox-mixed" d="M4 8h8" pathLength="1" />
          </svg>
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
              <R.Indicator forceMount className="cs-radio-dot" aria-hidden="true" />
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
export interface FileUploadProps {
  label: string; accept?: string; multiple?: boolean; maxSize?: number; maxFiles?: number;
  disabled?: boolean; onFilesChange?: (files: File[]) => void;
  progress?: Record<string, number>; errors?: Record<string, string>; onRetry?: (file: File) => void;
}
export function FileUpload({label,accept,multiple=false,maxSize=10*1024*1024,maxFiles=10,disabled,onFilesChange,progress={},errors={},onRetry}:FileUploadProps) {
  const id=useId();const input=useRef<HTMLInputElement>(null);
  const [files,setFiles]=useState<File[]>([]);const [error,setError]=useState('');const [drag,setDrag]=useState(false);
  const limit=multiple?Math.max(1,maxFiles):1;
  const bytes=(n:number)=>n>=1024*1024?`${(n/1024/1024).toFixed(1)} MB`:`${Math.max(1,Math.ceil(n/1024))} KB`;
  function matches(file:File) {return !accept||accept.split(',').some(rule=>{rule=rule.trim().toLowerCase();return rule.startsWith('.')?file.name.toLowerCase().endsWith(rule):rule.endsWith('/*')?file.type.toLowerCase().startsWith(rule.slice(0,-1)):file.type.toLowerCase()===rule;});}
  function update(next:File[]) {setFiles(next);onFilesChange?.(next);}
  function add(incoming:File[]) {
    if(disabled||!incoming.length)return;
    if(incoming.some(file=>!matches(file))){setError(`不支持的文件类型，请选择 ${accept} 文件。`);return;}
    if(incoming.some(file=>file.size>maxSize)){setError(`单个文件不能超过 ${bytes(maxSize)}`);return;}
    const next=multiple?[...files]:[];
    for(const file of incoming)if(!next.some(current=>current.name===file.name&&current.size===file.size&&current.lastModified===file.lastModified))next.push(file);
    if(next.length>limit){setError(`最多选择 ${limit} 个文件。`);return;}
    setError('');update(next);
  }
  return <div className="cs-field cs-upload-field"><label htmlFor={id}>{label}</label>
    <div className="cs-upload-dropzone" data-dragging={drag||undefined} data-disabled={disabled||undefined} onDragOver={event=>{event.preventDefault();if(!disabled)setDrag(true);}} onDragLeave={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setDrag(false);}} onDrop={event=>{event.preventDefault();setDrag(false);add(Array.from(event.dataTransfer.files));}}>
      <input ref={input} id={id} type="file" accept={accept} multiple={multiple} disabled={disabled} aria-describedby={`${id}-help`} aria-invalid={!!error} className="cs-sr-only" onChange={event=>{add(Array.from(event.target.files??[]));event.target.value='';}} />
      <button type="button" className="cs-upload-choose" disabled={disabled} onClick={()=>input.current?.click()}>
        <span className="cs-upload-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4" /></svg></span>
        <span><strong>点击选择文件</strong> 或拖拽到此处</span>
        <small>{accept||'所有文件类型'} · 每个文件最大 {bytes(maxSize)}{multiple?` · 最多 ${limit} 个`:''}</small>
      </button>
    </div>
    <span id={`${id}-help`} className={error?'cs-error':'cs-help'} role={error?'alert':undefined}>{error||'仅本地选择，实际上传与进度由消费项目提供。'}</span>
    {files.length>0&&<ul className="cs-upload-list">{files.map((file,i)=>{const percent=progress[file.name];const failure=errors[file.name];return <li key={JSON.stringify([file.name,file.size,file.lastModified])}>
      <svg className="cs-upload-file-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M14 2H5v20h14V7Zm0 0v5h5M8 12h8M8 16h6" /></svg>
      <div className="cs-upload-file-details"><strong>{file.name}</strong><span>{bytes(file.size)} · {failure?'上传失败':percent===undefined?'已选择':percent>=100?'上传完成':`上传中 ${Math.round(percent)}%`}</span>{failure?<span className="cs-error" role="alert">{failure}</span>:percent!==undefined&&<progress aria-label={`${file.name} 上传进度`} max="100" value={Math.max(0,Math.min(100,percent))}/>}</div>
      {failure&&onRetry&&<button type="button" disabled={disabled} onClick={()=>onRetry(file)}>重试</button>}
      <button type="button" aria-label={`移除 ${file.name}`} disabled={disabled} onClick={()=>{update(files.filter((_,index)=>index!==i));setError('');}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
    </li>;})}</ul>}
  </div>;
}
