import React, { useState } from "react";
import { afterEach, describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Button,
  Checkbox,
  Switch,
  RadioGroup,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  Combobox,
  AlertDialog,
  Sheet,
  DropdownMenu,
  DataTable,
  FileUpload,
  Progress,
  Slider,
  ToastProvider,
  useToast,
  Pagination,
} from "../packages/ui/src/index";
afterEach(cleanup);
describe("form interaction contracts", () => {
  it("toggles checkbox from its label and supports a mixed state", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox label="保存原始数据" />
        <Checkbox label="部分选择" checked="indeterminate" />
      </>,
    );
    await user.click(screen.getByText("保存原始数据"));
    expect(
      screen.getByRole("checkbox", { name: "保存原始数据" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "部分选择" }),
    ).toBePartiallyChecked();
    await user.keyboard(" ");
    expect(
      screen.getByRole("checkbox", { name: "保存原始数据" }),
    ).not.toBeChecked();
  });
  it("announces the switch description and blocks disabled changes", async () => {
    const change = vi.fn();
    render(
      <Switch
        label="自动重连"
        description="设备断开时恢复"
        disabled
        onCheckedChange={change}
      />,
    );
    expect(screen.getByRole("switch")).toHaveAccessibleDescription(
      "设备断开时恢复",
    );
    await userEvent.click(screen.getByText("自动重连"));
    expect(change).not.toHaveBeenCalled();
  });
  it("moves radio selection with the keyboard and skips disabled options", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup
        label="计权"
        defaultValue="a"
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B", disabled: true },
          { value: "z", label: "Z" },
        ]}
      />,
    );
    screen.getByRole("radio", { name: "A" }).focus();
    await user.keyboard("{ArrowDown>}");
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "Z" })).toBeChecked(),
    );
    await user.keyboard("{/ArrowDown}");
  });
  it("searches and selects combobox options while excluding disabled values", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Combobox
        label="设备"
        options={[
          { value: "a", label: "SonoDAQ" },
          { value: "b", label: "声学成像仪" },
          { value: "c", label: "不可用设备", disabled: true },
        ]}
        onValueChange={change}
      />,
    );
    await user.click(screen.getByRole("button", { name: "设备" }));
    await user.type(screen.getByRole("combobox"), "Sono");
    expect(
      screen.queryByRole("option", { name: "声学成像仪" }),
    ).not.toBeInTheDocument();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(change).toHaveBeenCalledWith("a");
    expect(screen.getByRole("button", { name: "设备" })).toHaveTextContent(
      "SonoDAQ",
    );
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
  it("preserves existing attachment rows when another file is removed or progress changes", async () => {
    const user = userEvent.setup();
    const {rerender} = render(<FileUpload label="Attachments" multiple />);
    await user.upload(screen.getByLabelText("Attachments"), [new File(["a"], "a.txt"), new File(["b"], "b.txt")]);
    const row = screen.getByText("b.txt").closest("li");
    await user.click(screen.getByRole("button", {name:"移除 a.txt"}));
    expect(screen.getByText("b.txt").closest("li")).toBe(row);
    rerender(<FileUpload label="Attachments" multiple progress={{"b.txt":50}} />);
    expect(screen.getByText("b.txt").closest("li")).toBe(row);
    expect(screen.getByRole("progressbar")).toHaveAttribute("value", "50");
  });
  it("rejects oversized files before notifying the business layer", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <FileUpload
        label="配置文件"
        accept=".json"
        maxSize={1048576}
        onFilesChange={change}
      />,
    );
    await user.upload(
      screen.getByLabelText("配置文件"),
      new File([new Uint8Array(2 * 1048576)], "large.json", {
        type: "application/json",
      }),
    );
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByLabelText("配置文件")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await user.upload(
      screen.getByLabelText("配置文件"),
      new File(["{}"], "valid.json", { type: "application/json" }),
    );
    expect(change).toHaveBeenCalledTimes(1);
    expect(screen.getByText("valid.json")).toBeInTheDocument();
  });
});
describe("slider contracts", () => {
  it("changes numeric values with keyboard commands", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Slider
        label="输入增益"
        unit="dB"
        min={0}
        max={60}
        defaultValue={[24]}
        onValueChange={change}
      />,
    );
    screen.getByRole("slider", { name: "输入增益" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "25");
    await user.keyboard("{End}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "60");
    expect(change).toHaveBeenLastCalledWith([60]);
  });
  it("provides distinct accessible names for range boundaries", () => {
    render(<Slider label="频率" min={20} max={100} defaultValue={[30, 60]} />);
    expect(screen.getByRole("slider", { name: "频率 下限" })).toHaveAttribute(
      "aria-valuenow",
      "30",
    );
    expect(screen.getByRole("slider", { name: "频率 上限" })).toHaveAttribute(
      "aria-valuenow",
      "60",
    );
  });
});
describe("navigation and overlay contracts", () => {
  it("links tabs and panels and supports arrow navigation", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="设备">
          <TabsTrigger value="a">参数</TabsTrigger>
          <TabsTrigger value="b">日志</TabsTrigger>
        </TabsList>
        <TabsContent value="a">参数内容</TabsContent>
        <TabsContent value="b">日志内容</TabsContent>
      </Tabs>,
    );
    await user.click(screen.getByRole("tab", { name: "参数" }));
    expect(screen.getByRole("tablist", { name: "设备" })).toHaveAttribute("data-input", "pointer");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tablist", { name: "设备" })).toHaveAttribute("data-input", "keyboard");
    expect(
      await screen.findByRole("tabpanel", { name: "日志" }),
    ).toHaveTextContent("日志内容");
    expect(screen.getByRole("tab", { name: "日志" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
  it("opens accordion content and can collapse it again", async () => {
    const user = userEvent.setup();
    render(
      <Accordion
        items={[{ value: "a", title: "校准要求", content: "预热后校准" }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "校准要求" }));
    expect(screen.getByText("预热后校准")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "校准要求" }));
    expect(screen.getByText("预热后校准").closest(".cs-accordion-content")).toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: "校准要求" })).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{Enter}");
    expect(screen.getByText("预热后校准").closest(".cs-accordion-content")).not.toHaveAttribute("inert");
  });
  it("keeps a failed async confirmation open and permits retry", async () => {
    const user = userEvent.setup();
    const confirm = vi
      .fn()
      .mockRejectedValueOnce(new Error("设备离线"))
      .mockResolvedValueOnce(undefined);
    render(
      <AlertDialog
        trigger={<Button>删除</Button>}
        title="删除任务？"
        description="请确认操作"
        onConfirm={confirm}
      />,
    );
    await user.click(screen.getByRole("button", { name: "删除" }));
    await user.click(screen.getByRole("button", { name: "确认" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("设备离线");
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "确认" }));
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: "删除" })).toHaveFocus();
  });
  it("prevents duplicate confirmation and dismissal while a request is pending", async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const confirm = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    render(
      <AlertDialog
        trigger={<Button>提交</Button>}
        title="提交任务"
        description="等待请求"
        onConfirm={confirm}
      />,
    );
    await user.click(screen.getByRole("button", { name: "提交" }));
    await user.click(screen.getByRole("button", { name: "确认" }));
    expect(screen.getByRole("button", { name: "确认" })).toBeDisabled();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    resolve();
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    expect(confirm).toHaveBeenCalledTimes(1);
  });
  it("restores focus when a sheet closes with Escape", async () => {
    const user = userEvent.setup();
    render(
      <Sheet
        trigger={<Button>设备设置</Button>}
        title="设置"
        description="参数设置"
      >
        内容
      </Sheet>,
    );
    await user.click(screen.getByRole("button", { name: "设备设置" }));
    expect(screen.getByRole("dialog")).toHaveAccessibleName("设置");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "设备设置" })).toHaveFocus();
  });
  it("uses menu semantics and never activates a disabled item", async () => {
    const user = userEvent.setup();
    const disabled = vi.fn();
    const active = vi.fn();
    render(
      <DropdownMenu
        trigger={<Button>更多</Button>}
        items={[
          { id: "a", label: "导出", onSelect: active },
          { id: "b", label: "删除", disabled: true, onSelect: disabled },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "更多" }));
    expect(screen.getByRole("menuitem", { name: "删除" })).toHaveAttribute(
      "data-disabled",
    );
    await user.click(screen.getByRole("menuitem", { name: "导出" }));
    expect(active).toHaveBeenCalledTimes(1);
    expect(disabled).not.toHaveBeenCalled();
  });
  it("keeps pagination boundaries and current-page semantics", async () => {
    function Example() {
      const [page, setPage] = useState(1);
      return <Pagination page={page} pageCount={3} onPageChange={setPage} />;
    }
    render(<Example />);
    expect(screen.getByRole("button", { name: "上一页" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "下一页" }));
    expect(screen.getByRole("button", { name: "第 2 页" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
const data = [
  { id: "a", name: "Beta", count: 2 },
  { id: "b", name: "Alpha", count: 10 },
  { id: "c", name: "Gamma", count: 1 },
];
const columns = [
  {
    id: "name",
    header: "名称",
    accessor: (r: (typeof data)[number]) => r.name,
    sortable: true,
  },
  {
    id: "count",
    header: "数量",
    accessor: (r: (typeof data)[number]) => r.count,
    sortable: true,
  },
];
describe("data table contracts", () => {
  it("sorts numbers numerically in both directions", async () => {
    render(
      <DataTable
        caption="记录"
        data={data}
        columns={columns}
        getRowId={(r) => r.id}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "数量" }));
    let rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Gamma");
    expect(screen.getByRole("columnheader", { name: "数量" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await userEvent.click(screen.getByRole("button", { name: "数量" }));
    rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Alpha");
  });
  it("preserves selection across pages and only selects the visible page", async () => {
    const user = userEvent.setup();
    const selection = vi.fn();
    render(
      <DataTable
        caption="记录"
        data={data}
        columns={columns}
        getRowId={(r) => r.id}
        selectable
        pageSize={2}
        onSelectionChange={selection}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "选择当前页" }));
    expect(selection).toHaveBeenLastCalledWith(["a", "b"]);
    await user.click(screen.getByRole("button", { name: "下一页" }));
    expect(
      screen.getByRole("checkbox", { name: "选择当前页" }),
    ).not.toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "选择记录 c" }));
    expect(selection).toHaveBeenLastCalledWith(["a", "b", "c"]);
    await user.click(screen.getByRole("button", { name: "上一页" }));
    expect(screen.getByRole("checkbox", { name: "选择当前页" })).toBeChecked();
  });
  it("resets the page when searching and announces empty results", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        caption="记录"
        data={data}
        columns={columns}
        getRowId={(r) => r.id}
        pageSize={1}
      />,
    );
    await user.click(screen.getByRole("button", { name: "下一页" }));
    await user.type(screen.getByRole("textbox", { name: "搜索记录" }), "Gamma");
    expect(screen.getByRole("table")).toHaveTextContent("Gamma");
    expect(screen.getByText("第 1 / 1 页")).toBeInTheDocument();
    await user.clear(screen.getByRole("textbox", { name: "搜索记录" }));
    await user.type(
      screen.getByRole("textbox", { name: "搜索记录" }),
      "missing",
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("没有匹配记录")).toBeInTheDocument();
  });
});
describe("feedback contracts", () => {
  it("clamps progress and exposes indeterminate state", () => {
    const { rerender } = render(<Progress label="导出" value={120} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    rerender(<Progress label="导出" value={null} />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow",
    );
  });
  it("announces and dismisses toast notifications", async () => {
    function Trigger() {
      const toast = useToast();
      return (
        <Button
          onClick={() =>
            toast({
              title: "配置已保存",
              description: "设置已更新",
              duration: 60000,
            })
          }
        >
          保存
        </Button>
      );
    }
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "保存" }));
    expect(screen.getAllByText("配置已保存").length).toBeGreaterThan(0);
    await userEvent.click(screen.getByRole("button", { name: "关闭通知" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "关闭通知" }),
      ).not.toBeInTheDocument(),
    );
  });
});
