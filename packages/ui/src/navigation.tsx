"use client";
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import * as T from "@radix-ui/react-tabs";
import * as A from "@radix-ui/react-accordion";
import { Button } from "./index";
import { revealText } from "./text-reveal";
import { cx } from "./utils";
export const Tabs = T.Root;
export function TabsList({
  className, children, ref, variant = "line", ...props
}: ComponentProps<typeof T.List> & { variant?: "line" | "pill" }) {
  const list = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = list.current;
    const bar = indicator.current;
    if (!root || !bar) return;
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const snapTime = getComputedStyle(root).getPropertyValue('--cds-dur-snap').trim();
    const snapSeconds = snapTime.endsWith('ms') ? parseFloat(snapTime) / 1000 : parseFloat(snapTime);
    const omega = 6.6 / (Number.isFinite(snapSeconds) && snapSeconds > 0 ? snapSeconds : .12);
    let frame = 0;
    let previous = 0;
    let initialized = false;
    const current = { x: 0, width: 0, vx: 0, vw: 0 };
    const target = { x: 0, width: 0 };
    const paint = () => {
      bar.style.transform = `translateX(${current.x}px)`;
      bar.style.width = `${Math.max(0, current.width)}px`;
    };
    const snap = () => {
      cancelAnimationFrame(frame);
      current.x = target.x; current.width = target.width; current.vx = 0; current.vw = 0;
      paint();
    };
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, .04);
      previous = now;
      const decay = Math.exp(-omega * dt);
      for (const [position, velocity] of [['x', 'vx'], ['width', 'vw']] as const) {
        const offset = current[position] - target[position];
        const combined = current[velocity] + omega * offset;
        current[position] = target[position] + (offset + combined * dt) * decay;
        current[velocity] = (current[velocity] - omega * combined * dt) * decay;
      }
      paint();
      if (Math.abs(current.x - target.x) < .1 && Math.abs(current.width - target.width) < .1 && Math.abs(current.vx) < .1 && Math.abs(current.vw) < .1) snap();
      else frame = requestAnimationFrame(tick);
    };
    const measure = () => {
      const active = root.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!active) { bar.style.opacity = '0'; return; }
      // Layout coordinates stay correct inside scaled component thumbnails.
      target.x = active.offsetLeft;
      target.width = active.offsetWidth;
      bar.style.top = `${active.offsetTop + (variant === 'line' ? active.offsetHeight - 2 : 0)}px`;
      bar.style.height = `${variant === 'line' ? 2 : active.offsetHeight}px`;
      bar.style.opacity = '1';
      root.dataset.indicatorReady = 'true';
      cancelAnimationFrame(frame);
      if (!initialized || media?.matches) snap();
      else { previous = performance.now(); frame = requestAnimationFrame(tick); }
      initialized = true;
    };
    const observer = new MutationObserver(measure);
    observer.observe(root, { attributes: true, subtree: true, attributeFilter: ['data-state'] });
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    root.querySelectorAll('[role="tab"]').forEach(tab => resize.observe(tab));
    const reduce = () => { if (media?.matches) snap(); };
    media?.addEventListener('change', reduce);
    measure();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); media?.removeEventListener('change', reduce); };
  }, [variant]);
  return <T.List {...props} ref={element => {
    list.current = element;
    if (typeof ref === 'function') return ref(element);
    if (ref) ref.current = element;
  }} className={cx("cs-tabs-list", `cs-tabs-list--${variant}`, className)}>
    <span ref={indicator} className="cs-tabs-indicator" aria-hidden="true" />
    {children}
  </T.List>;
}
export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof T.Trigger>) {
  return <T.Trigger {...props} className={cx("cs-tabs-trigger", className)} />;
}
export function TabsContent({
  className, children,
  ...props
}: ComponentProps<typeof T.Content>) {
  return <T.Content {...props} className={cx("cs-tabs-content", className)}>{revealText(children)}</T.Content>;
}
export interface AccordionItem {
  value: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}
export function Accordion({
  items,
  defaultValue,
  disabled = false,
}: {
  items: AccordionItem[];
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <A.Root
      type="single"
      collapsible
      defaultValue={defaultValue}
      disabled={disabled}
      className="cs-accordion"
    >
      {items.map((item) => (
        <A.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className="cs-accordion-item"
        >
          <A.Header className="cs-accordion-header">
            <A.Trigger className="cs-accordion-trigger">
              {item.title}
              <span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M5 12h14M12 5v14"/></svg></span>
            </A.Trigger>
          </A.Header>
          <A.Content className="cs-accordion-content">
            <div>{item.content}</div>
          </A.Content>
        </A.Item>
      ))}
    </A.Root>
  );
}
export function Breadcrumbs({
  items,
  label = "面包屑导航",
}: {
  items: { label: string; href?: string }[];
  label?: string;
}) {
  return (
    <nav aria-label={label} className="cs-breadcrumbs">
      <ol>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`}>
            {i > 0 && (
              <svg className="cs-breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            )}
            {i === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function Pagination({
  page,
  pageCount,
  onPageChange,
  label = "分页",
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  label?: string;
}) {
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.max(1, Math.min(count, page));
  const pages = Array.from(
    new Set(
      [1, current - 1, current, current + 1, count].filter(
        (n) => n > 0 && n <= count,
      ),
    ),
  ).sort((a, b) => a - b);
  return (
    <nav aria-label={label} className="cs-pagination">
      <Button
        variant="secondary"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
        aria-label="上一页"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
      </Button>
      {pages.map((number, i) => (
        <span key={number}>
          {i > 0 && number - pages[i - 1] > 1 && (
            <span className="cs-page-gap">…</span>
          )}
          <Button
            variant={current === number ? "primary" : "ghost"}
            aria-current={current === number ? "page" : undefined}
            aria-label={`第 ${number} 页`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Button>
        </span>
      ))}
      <Button
        variant="secondary"
        disabled={current === count}
        onClick={() => onPageChange(current + 1)}
        aria-label="下一页"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
      </Button>
    </nav>
  );
}
