"use client";
import { type ComponentProps, type ReactNode } from "react";
import * as T from "@radix-ui/react-tabs";
import * as A from "@radix-ui/react-accordion";
import { Button } from "./index";
import { cx } from "./utils";
export const Tabs = T.Root;
export function TabsList({
  className,
  variant = "line",
  ...props
}: ComponentProps<typeof T.List> & { variant?: "line" | "pill" }) {
  return (
    <T.List
      {...props}
      className={cx("cs-tabs-list", `cs-tabs-list--${variant}`, className)}
    />
  );
}
export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof T.Trigger>) {
  return <T.Trigger {...props} className={cx("cs-tabs-trigger", className)} />;
}
export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof T.Content>) {
  return <T.Content {...props} className={cx("cs-tabs-content", className)} />;
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
              <span aria-hidden="true">+</span>
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
