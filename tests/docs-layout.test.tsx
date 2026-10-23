import React, { useState } from "react";
import { afterEach, it, expect, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SidebarContent, ComponentSearch } from "../apps/docs/src/docs-layout";
import { PreviewFrame } from "../apps/docs/src/preview-frame";
import { ToastProvider, Input } from "../packages/ui/src/index";
afterEach(cleanup);
it("collapses component groups without losing current-route semantics", async () => {
  const user = userEvent.setup();
  render(<SidebarContent route="component/input" />);
  expect(screen.getByRole("link", { name: "Inputs 输入框" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const originalInputLink=screen.getByRole("link", { name: "Inputs 输入框" });
  const baseHeading=screen.getByRole("button", { name: "Base components" });
  await user.click(baseHeading);
  expect(originalInputLink).toBeInTheDocument();
  const panel=document.getElementById(baseHeading.getAttribute('aria-controls')!);
  expect(panel).toHaveAttribute('inert');
  expect(panel).toHaveAttribute('aria-hidden','true');
  expect(baseHeading).toHaveFocus();
  expect(
    screen.queryByRole("link", { name: "Inputs 输入框" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Base components" }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(
    screen.getByRole("link", { name: "DataTable 数据表格" }),
  ).toBeInTheDocument();
  await user.keyboard(' ');
  expect(screen.getByRole("link", { name: "Inputs 输入框" })).toBe(originalInputLink);
  expect(panel).not.toHaveAttribute('inert');
  expect(baseHeading).toHaveFocus();
});
it("filters the component search and dismisses it after choosing a result", async () => {
  const user = userEvent.setup();
  function Example() {
    const [open, setOpen] = useState(true);
    return <ComponentSearch open={open} onOpenChange={setOpen} />;
  }
  render(<Example />);
  await user.type(
    screen.getByRole("textbox", { name: "搜索组件名称" }),
    "Combobox",
  );
  const dialog = screen.getByRole("dialog", { name: "搜索组件" });
  expect(within(dialog).getAllByRole("link")).toHaveLength(1);
  expect(
    screen.getByRole("link", { name: "Combobox 搜索选择" }),
  ).toHaveAttribute("href", "#component/combobox");
  await user.click(screen.getByRole("link", { name: "Combobox 搜索选择" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
it("switches an example between preview and code and delegates the theme toggle", async () => {
  const user = userEvent.setup();
  const toggle = vi.fn();
  render(
    <ToastProvider>
      <PreviewFrame
        title="Input example"
        code={'<Input label="设备" />'}
        theme="light"
        onToggleTheme={toggle}
      >
        <Input label="设备" />
      </PreviewFrame>
    </ToastProvider>,
  );
  expect(screen.getByRole("textbox", { name: "设备" })).toBeInTheDocument();
  await user.click(screen.getByRole("tab", { name: "Code" }));
  expect(screen.getByRole("tabpanel", { name: "Code" })).toHaveTextContent(
    '<Input label="设备" />',
  );
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  await user.click(screen.getByRole("tab", { name: "Preview" }));
  expect(screen.getByRole("textbox", { name: "设备" })).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "切换Input example的主题" }),
  );
  expect(toggle).toHaveBeenCalledOnce();
});

it("keeps documentation sections independent and exposes one templates destination",async()=>{
  const user=userEvent.setup();const onNavigate=vi.fn();render(<SidebarContent route="templates" onNavigate={onNavigate}/>);
  const gettingStarted=screen.getByRole('button',{name:'Getting started'});
  gettingStarted.focus();await user.keyboard('{Enter}');
  expect(gettingStarted).toHaveAttribute('aria-expanded','false');
  expect(screen.queryByRole('link',{name:'Overview 简介'})).not.toBeInTheDocument();
  expect(screen.getByRole('link',{name:'Foundations 基础规范'})).toBeVisible();
  const templates=screen.getByRole('link',{name:'Templates 样板库'});
  expect(templates).toHaveAttribute('aria-current','page');expect(templates).toHaveAttribute('href','#templates');
  expect(screen.queryByRole('link',{name:'Product patterns 产品模式'})).not.toBeInTheDocument();
  expect(screen.queryByRole('link',{name:'Scene styles 场景样板'})).not.toBeInTheDocument();
  await user.click(templates);expect(onNavigate).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('button',{name:'Design foundations'}));
  expect(screen.queryByRole('link',{name:'Foundations 基础规范'})).not.toBeInTheDocument();
  expect(screen.getByRole('link',{name:'MediaGallery 图片画廊'})).toBeVisible();
  expect(templates).toBeVisible();
});
