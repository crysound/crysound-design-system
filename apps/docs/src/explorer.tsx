import { TextReveal } from "../../../packages/ui/src/text-reveal";
import { LoginDemo } from "./login-demo";
import { TreeViewDemo } from "./tree-view-demo";
import { SectionHeaderDemo } from "./section-header-demo";
import { ProgressStepsDemo } from "./progress-steps-demo";
import { LoadingDemo } from "./loading-demo";
import { ChartsDemo } from "./charts-demo";
import { InlineCTADemo } from "./inline-cta-demo";
import { CommandMenuDemo } from "./command-menu-demo";
import { ColorPickerDemo } from "./color-picker-demo";
import { VideoDemo } from "./video-demo";
import { useState, type FormEvent } from "react";
import * as UI from "../../../packages/ui/src/index";
import { catalog, type ComponentDoc } from "./catalog";
import {
  PreviewFrame,
  LeadExample,
  StateExamples,
  idsWithStateExamples,
  copyExample,
} from "./preview-frame";
import {
  Copy01,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Code02,
  LinkExternal01,
} from "@untitledui/icons";
const {
  Button,
  DatePicker,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  RadioGroup,
  Slider,
  Combobox,
  FileUpload,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  Breadcrumbs,
  Pagination,
  Dialog,
  AlertDialog,
  Sheet,
  Popover,
  Tooltip,
  DropdownMenu,
  Badge,
  Avatar,
  Alert,
  Progress,
  Skeleton,
  Separator,
  ToastProvider,
  useToast,
  Card,
  Metric,
  StatusBadge,
  EmptyState,
  DataTable,
  DeviceTable,
} = UI;
export const sampleDevices: UI.Device[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: `CS-${String(i + 1).padStart(3, "0")}`,
    name:
      ["声学成像仪", "产线检测工位", "环境监测设备", "数据采集终端"][i % 4] +
      ` ${String(i + 1).padStart(2, "0")}`,
    model: ["演示型号 A", "演示型号 B", "演示型号 C"][i % 3],
    status: (["online", "running", "warning", "offline"] as const)[i % 4],
    location: ["实验室 A", "生产线 02", "测试区域"][i % 3],
  }),
);
export const deviceColumns: UI.DataColumn<UI.Device>[] = [
  {
    id: "name",
    header: "设备名称",
    accessor: (r) => r.name,
    sortable: true,
    cell: (r) => (
      <div>
        <strong>{r.name}</strong>
        <small>
          {r.id} · {r.model}
        </small>
      </div>
    ),
  },
  {
    id: "location",
    header: "位置",
    accessor: (r) => r.location,
    sortable: true,
  },
  {
    id: "status",
    header: "状态",
    accessor: (r) => r.status,
    cell: (r) => <StatusBadge status={r.status} />,
  },
];
function Stack({ children }: { children: React.ReactNode }) {
  return <div className="demo-stack">{children}</div>;
}
export function ComponentDemo({ id }: { id: string }) {
  const toast = useToast();
  const [value, setValue] = useState("daq");
  const [checked, setChecked] = useState(true);
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState(36);
  const [selected, setSelected] = useState<UI.Device>();
  const options = [
    { value: "daq", label: "SonoDAQ 数据采集" },
    { value: "imaging", label: "声学成像仪" },
    { value: "noise", label: "环境噪声监测" },
    { value: "offline", label: "离线设备（不可用）", disabled: true },
  ];
  switch (id) {
    case "button":
      return (
        <Stack>
          <div className="demo-row">
            <Button
              iconStart="+"
              onClick={() =>
                toast({
                  title: "已触发连接操作",
                  description: "演示不会连接真实设备。",
                })
              }
            >
              连接设备
            </Button>
            <Button variant="secondary">次要操作</Button>
            <Button variant="ghost">文字操作</Button>
            <Button variant="danger">危险操作</Button>
          </div>
          <div className="demo-row">
            <Button size="sm">小尺寸</Button>
            <Button>默认尺寸</Button>
            <Button size="lg">大尺寸</Button>
          </div>
          <div className="demo-row">
            <Button loading>正在采集</Button>
            <Button disabled>不可用</Button>
          </div>
        </Stack>
      );
    case "input":
      return (
        <Stack>
          <Input
            label="设备名称"
            placeholder="实验室设备 01"
            hint="名称会显示在设备列表中。"
          />
          <Input
            label="连接地址"
            defaultValue="192.168."
            error="请输入完整的设备地址。"
          />
          <Input label="只读序列号" value="CS-2026-001" readOnly />
          <Input label="不可用字段" disabled placeholder="请先连接设备" />
        </Stack>
      );
    case "textarea":
      return (
        <Stack>
          <Textarea
            label="测量备注"
            hint="记录测量环境与异常现象。"
            placeholder="例如：检测前已完成环境噪声检查。"
          />
          <Textarea label="错误状态" error="备注不能超过规定长度。" />
          <Textarea label="禁用状态" disabled />
        </Stack>
      );
    case "select":
      return (
        <Stack>
          <Select
            label="采样率"
            defaultValue="48000"
            hint="示例选项，不代表设备规格。"
          >
            <option value="48000">48 kHz</option>
            <option value="96000">96 kHz</option>
            <option disabled>192 kHz（不可用）</option>
          </Select>
          <Select label="设备输入" disabled>
            <option>未连接设备</option>
          </Select>
        </Stack>
      );
    case "combobox":
      return (
        <Stack>
          <Combobox
            label="设备类型"
            options={options}
            value={value}
            onValueChange={setValue}
          />
          <span className="cs-help">当前值：{value}</span>
          <Combobox label="禁用选择" options={options} disabled />
        </Stack>
      );
    case "checkbox":
      return (
        <Stack>
          <Checkbox
            label="保存原始数据"
            description="用于后续报告复核。"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          <Checkbox label="部分选中" checked="indeterminate" />
          <Checkbox label="不可用选项" disabled />
          <Checkbox label="禁用已选" checked disabled />
        </Stack>
      );
    case "switch":
      return (
        <Stack>
          <Switch
            label="自动重连"
            description="设备断开后尝试恢复。"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Switch label="禁用设置" disabled />
          <span className="cs-help">
            当前设置：{checked ? "已启用" : "已关闭"}
          </span>
        </Stack>
      );
    case "radio-group":
      return (
        <RadioGroup
          label="频率计权"
          defaultValue="a"
          options={[
            {
              value: "a",
              label: "A 计权",
              description: "用于常规噪声测量示例。",
            },
            {
              value: "z",
              label: "Z 计权",
              description: "不进行频率加权的示例设置。",
            },
            { value: "c", label: "C 计权（不可用）", disabled: true },
          ]}
        />
      );
    case "slider":
      return (
        <Stack>
          <Slider label="输入增益" unit="dB" defaultValue={[24]} max={60} />
          <Slider
            label="频率范围示例"
            unit="Hz"
            min={20}
            max={20000}
            step={10}
            defaultValue={[100, 12000]}
          />
          <Slider label="禁用滑块" defaultValue={[50]} disabled />
        </Stack>
      );
    case "file-upload":
      return (
        <Stack><FileUpload
          label="选择校准配置"
          accept=".json,.csv"
          multiple
          maxSize={1048576}
          onFilesChange={(files) =>
            toast({
              title: `已选择 ${files.length} 个本地文件`,
              description: "未上传至服务器。",
            })
          }
        /><FileUpload label="上传图片" accept="image/png,image/jpeg,image/webp" maxSize={5*1024*1024} /><FileUpload label="不可用上传器" disabled /></Stack>
      );
    case "tabs":
      return (
        <Stack>
          <Tabs defaultValue="parameters">
            <TabsList aria-label="设备信息">
              <TabsTrigger value="parameters">参数设置</TabsTrigger>
              <TabsTrigger value="logs">运行日志</TabsTrigger>
              <TabsTrigger value="report" disabled>
                报告（不可用）
              </TabsTrigger>
            </TabsList>
            <TabsContent value="parameters">
              <Input label="设备名称" defaultValue="声学成像仪 01" />
            </TabsContent>
            <TabsContent value="logs">
              <Alert title="设备状态已同步" tone="success">
                这里只展示演示日志。
              </Alert>
            </TabsContent>
          </Tabs>
          <Tabs defaultValue="day">
            <TabsList variant="pill" aria-label="时间范围">
              <TabsTrigger value="day">今天</TabsTrigger>
              <TabsTrigger value="week">本周</TabsTrigger>
            </TabsList>
            <TabsContent value="day">今日任务视图</TabsContent>
            <TabsContent value="week">本周任务视图</TabsContent>
          </Tabs>
        </Stack>
      );
    case "accordion":
      return (
        <Accordion
          items={[
            {
              value: "calibration",
              title: "校准前的准备",
              content:
                "确认设备预热、环境稳定，并核对校准文件与设备序列号。此处为流程示例。",
            },
            {
              value: "connection",
              title: "设备连接检查",
              content:
                "检查供电、通信接口和设备地址。实际要求以设备说明书为准。",
            },
            {
              value: "disabled",
              title: "暂无权限的配置",
              content: "不可见内容",
              disabled: true,
            },
          ]}
        />
      );
    case "breadcrumbs":
      return (
        <Breadcrumbs
          items={[
            { label: "设计系统", href: "#overview" },
            { label: "仪器业务", href: "#patterns" },
            { label: "设备详情" },
          ]}
        />
      );
    case "pagination":
      return (
        <Stack>
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
          <span className="cs-help">
            当前第 {page} 页，点击页码或使用上一页 / 下一页。
          </span>
        </Stack>
      );
    case "dialog":
      return (
        <Dialog
          trigger={<Button>新建测量任务</Button>}
          title="新建测量任务"
          description="填写任务信息后关闭，示例不会发送业务请求。"
        >
          <Input label="任务名称" placeholder="例如：产线噪声检测" />
        </Dialog>
      );
    case "alert-dialog":
      return (
        <div className="demo-row">
          <AlertDialog
            trigger={<Button variant="danger">删除演示任务</Button>}
            title="删除演示任务？"
            description="这只是组件示例，不会删除真实数据。"
            onConfirm={() => toast({ title: "演示任务已删除" })}
          />
          <AlertDialog
            trigger={<Button variant="secondary">测试失败与重试</Button>}
            title="提交操作"
            description="用于展示异步失败后仍保留上下文。"
            onConfirm={async () => {
              throw new Error("演示错误：连接已中断，请重试。");
            }}
          />
        </div>
      );
    case "sheet":
      return (
        <Sheet
          trigger={<Button>查看设备设置</Button>}
          title="设备设置"
          description="示例配置面板，保留列表的上下文。"
        >
          <Stack>
            <Input label="设备名称" defaultValue="声学成像仪 01" />
            <Select label="采样率">
              <option>48 kHz</option>
              <option>96 kHz</option>
            </Select>
            <Switch label="自动重连" defaultChecked />
            <Alert title="演示模式">更改不会发送到真实设备。</Alert>
          </Stack>
        </Sheet>
      );
    case "popover":
      return (
        <Popover
          title="筛选设备"
          trigger={<Button variant="secondary">打开筛选</Button>}
        >
          <Stack>
            <Checkbox label="仅显示在线设备" />
            <Checkbox label="包含运行中的设备" defaultChecked />
          </Stack>
        </Popover>
      );
    case "tooltip":
      return (
        <div className="demo-row">
          <Tooltip content="导出当前筛选结果">
            <Button variant="secondary">悬停或聚焦查看提示</Button>
          </Tooltip>
          <Tooltip content="设备正在等待数据">
            <Button variant="ghost" aria-label="设备状态说明">
              ?
            </Button>
          </Tooltip>
        </div>
      );
    case "dropdown-menu":
      return (
        <DropdownMenu
          trigger={<Button variant="secondary" className="dropdown-example-trigger"><span>更多操作</span><ChevronDown size={16} aria-hidden="true" /></Button>}
          items={[
            {
              id: "export",
              label: "导出配置",
              shortcut: "CSV",
              onSelect: () => toast({ title: "已触发导出示例" }),
            },
            {
              id: "rename",
              label: "重命名",
              onSelect: () => toast({ title: "已触发重命名示例" }),
            },
            { id: "disabled", label: "暂无权限", disabled: true },
            {
              id: "delete",
              label: "删除演示任务",
              danger: true,
              separatorBefore: true,
              onSelect: () => toast({ title: "请在业务层进入危险操作确认" }),
            },
          ]}
        />
      );
    case "badge":
      return (
        <Stack>
          {(["soft", "outline"] as const).map((variant) => (
            <div className="demo-row" key={variant}>
              {(
                ["neutral", "brand", "success", "warning", "danger"] as const
              ).map((tone, i) => (
                <Badge key={tone} tone={tone} variant={variant}>
                  {["默认", "品牌", "成功", "警告", "危险"][i]}
                </Badge>
              ))}
            </div>
          ))}
        </Stack>
      );
    case "avatar":
      return (
        <div className="demo-row">
          <Avatar name="林 工程师" size="sm" />
          <Avatar name="周 工程师" />
          <Avatar name="CRYSOUND" size="lg" />
          <span className="cs-help">无图片时显示姓名缩写。</span>
        </div>
      );
    case "alert":
      return (
        <Stack>
          <Alert title="连接成功" tone="success">
            设备状态已更新。
          </Alert>
          <Alert
            title="设备连接中断"
            tone="warning"
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast({ title: "已触发重连示例" })}
              >
                重试
              </Button>
            }
          >
            检查设备供电与通信线路。
          </Alert>
          <Alert title="配置未能保存" tone="danger">
            请检查输入并重新提交。
          </Alert>
          <Alert title="演示说明" tone="brand">
            这些信息不会触发真实业务操作。
          </Alert>
        </Stack>
      );
    case "toast":
      return (
        <div className="demo-row">
          <Button
            onClick={() =>
              toast({
                title: "配置已保存",
                description: "示例通知，5 秒后自动关闭。",
              })
            }
          >
            显示通知
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast({
                title: "演示任务已归档",
                action: {
                  label: "撤销",
                  altText: "撤销演示任务归档",
                  onClick: () => toast({ title: "已撤销归档示例" }),
                },
              })
            }
          >
            带撤销操作
          </Button>
        </div>
      );
    case "progress":
      return (
        <Stack>
          <Progress label="报告生成示例" value={progress} />
          <div className="demo-row">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setProgress((p) => Math.min(100, p + 16))}
            >
              增加进度
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setProgress(0)}>
              重置
            </Button>
          </div>
          <Progress label="等待设备响应" value={null} />
        </Stack>
      );
    case "skeleton":
      return (
        <div aria-busy="true" aria-label="正在加载设备资料">
          <Stack>
            <div className="demo-row">
              <Skeleton width={48} height={48} />
              <div className="demo-flex">
                <Skeleton width="60%" height={18} />
                <div style={{ height: 10 }} />
                <Skeleton width="40%" height={12} />
              </div>
            </div>
            <Skeleton height={100} />
          </Stack>
        </div>
      );
    case "separator":
      return (
        <Stack>
          <span>设备身份</span>
          <Separator decorative={false} />
          <div className="demo-row">
            <span>参数</span>
            <Separator orientation="vertical" />
            <span>日志</span>
            <Separator orientation="vertical" />
            <span>报告</span>
          </div>
        </Stack>
      );
    case "card":
      return (
        <Card
          title="设备概况"
          description="示例设备状态"
          actions={<Badge tone="success">在线</Badge>}
        >
          <Metric
            label="当前声压级"
            value="68.4"
            unit="dB SPL"
            note="演示数据 · 非实时采集"
          />
        </Card>
      );
    case "status-badge":
      return (
        <div className="demo-row">
          {(["online", "running", "warning", "error", "offline"] as const).map(
            (status) => (
              <StatusBadge status={status} key={status} />
            ),
          )}
        </div>
      );
    case "login-page":
      return <LoginDemo />;
    case "tree-view":
      return <TreeViewDemo />;
    case "section-header":
      return <SectionHeaderDemo />;
    case "progress-steps":
      return <ProgressStepsDemo />;
    case "loading-indicator":
      return <LoadingDemo />;
    case "line-bar-charts":
      return <ChartsDemo />;
    case "inline-cta":
      return <InlineCTADemo />;
    case "date-picker":
      return <Stack><DatePicker label="测量日期" defaultValue="2026-10-14" /><DatePicker label="计划日期" min="2026-10-01" max="2026-12-31" /><DatePicker label="不可用日期" disabled /><DatePicker label="必填日期" error="请选择测量日期" /></Stack>;
    case "command-menu":
      return <CommandMenuDemo />;
    case "color-picker":
      return <ColorPickerDemo />;
    case "video-player":
      return <VideoDemo />;
    case "metric":
      return (
        <div className="demo-row metric-demo-row">
          <Metric
            label="声压级"
            value="68.4"
            unit="dB SPL"
            note="A 计权 · 演示数据"
          />
          <Metric label="采样率" value="48" unit="kHz" />
          <Metric label="无效读数" value="—" unit="dB SPL" note="设备未连接" />
        </div>
      );
    case "empty-state":
      return (
        <EmptyState
          title="尚未创建测量任务"
          description="连接设备后，创建第一个测量任务。"
          action={
            <Button onClick={() => toast({ title: "已触发创建任务示例" })}>
              创建任务
            </Button>
          }
        />
      );
    case "device-table":
      return (
        <Stack>
          <DeviceTable
            devices={sampleDevices.slice(0, 3)}
            onSelect={setSelected}
          />
          {selected && (
            <Alert title={selected.name}>
              {selected.id} · {selected.location}
            </Alert>
          )}
        </Stack>
      );
    case "data-table":
      return (
        <DataTable
          caption="演示设备数据"
          data={sampleDevices}
          columns={deviceColumns}
          getRowId={(r) => r.id}
          selectable
          pageSize={4}
        />
      );
    default:
      return null;
  }
}
export function ComponentPage({
  item,
  theme,
  onToggleTheme,
}: {
  item: ComponentDoc;
  theme: string;
  onToggleTheme: () => void;
}) {
  const toast = useToast();
  const imports =
    item.id === "tabs"
      ? "Tabs, TabsList, TabsTrigger, TabsContent"
      : item.id === "toast"
        ? "ToastProvider, useToast"
        : item.id === "card"
          ? "Card, Metric"
          : item.id === "dialog"
            ? "Dialog, Button, Input"
            : item.id === "alert-dialog"
              ? "AlertDialog, Button"
              : item.id === "sheet"
                ? "Sheet, Button, Input"
                : item.id === "popover"
                  ? "Popover, Button, Checkbox"
                  : item.id === "tooltip"
                    ? "Tooltip, Button"
                    : item.id === "dropdown-menu"
                      ? "DropdownMenu, Button"
                      : item.id === "empty-state"
                        ? "EmptyState, Button"
                        : item.name;
  const code = `import { ${imports} } from '@crysound/ui';\n\n${item.code}`;
  const previous = catalog[catalog.indexOf(item) - 1];
  const next = catalog[catalog.indexOf(item) + 1];
  return (
    <article
      className={`component-page reference-component-page reference-component-page--${item.id}`}
    >
      <section className="reference-component-heading">
        <div className="reference-title-row">
          <div>
            <h1>{item.name} components</h1>
            <span className="reference-component-label">REACT</span>
          </div>
          <div className="reference-title-actions">
            <button
              className="docs-text-button"
              onClick={() => copyExample(code, toast)}
            >
              Copy
              <Copy01 size={14} />
            </button>
            {previous ? (
              <a
                className="docs-square-button"
                href={`#component/${previous.id}`}
                aria-label={`上一个组件：${previous.name}`}
              >
                <ArrowLeft size={16} />
              </a>
            ) : (
              <button
                className="docs-square-button"
                disabled
                aria-label="没有上一个组件"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            {next ? (
              <a
                className="docs-square-button"
                href={`#component/${next.id}`}
                aria-label={`下一个组件：${next.name}`}
              >
                <ArrowRight size={16} />
              </a>
            ) : (
              <button
                className="docs-square-button"
                disabled
                aria-label="没有下一个组件"
              >
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
        <p>
          <TextReveal text={`${item.description} 使用 CRYSOUND 语义 Token，支持明暗主题和客户定制。`}/>
        </p>
        <div className="reference-resource-links">
          <a
            href="https://github.com/ya7881/crysound-design-system"
            target="_blank"
            rel="noreferrer"
          >
            <Code02 size={12} />
            GitHub
            <LinkExternal01 size={10} />
          </a>
          <a href="#installation">
            <Copy01 size={12} />
            安装文档
            <LinkExternal01 size={10} />
          </a>
          <a
            href="#component-api"
            onClick={(event) => {
              event.preventDefault();
              document
                .getElementById("component-api")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            API 参数
            <LinkExternal01 size={10} />
          </a>
        </div>
      </section>
      <PreviewFrame
        title={`${item.name} example`}
        code={code}
        wide={["data-table", "device-table"].includes(item.id)}
        theme={theme}
        onToggleTheme={onToggleTheme}
      >
        <LeadExample id={item.id} />
      </PreviewFrame>
      <section className="reference-installation">
        <h2>Installation</h2>
        <p>使用源码 Registry 安装，或通过组件包接入项目。</p>
        <Tabs defaultValue="cli">
          <TabsList aria-label="安装方式">
            <TabsTrigger value="cli">CLI</TabsTrigger>
            <TabsTrigger value="package">Package</TabsTrigger>
          </TabsList>
          <TabsContent value="cli">
            <pre className="reference-install-code">
              <code>
                npx shadcn@latest add {window.location.origin}
                /r/crysound-ui.json
              </code>
            </pre>
          </TabsContent>
          <TabsContent value="package">
            <pre className="reference-install-code">
              <code>{`import { ${item.name} } from '@crysound/ui';\nimport '@crysound/tokens/tokens.css';\nimport '@crysound/ui/styles.css';`}</code>
            </pre>
            <p className="cs-help">
              先安装 Release 中的 tokens 与 ui 两个 .tgz 安装包。
            </p>
          </TabsContent>
        </Tabs>
      </section>
      {idsWithStateExamples.has(item.id) && (
        <section className="reference-variants">
          <h2>{item.name} examples</h2>
          <p>查看组件的尺寸、状态与配置变体。</p>
          <StateExamples
            item={item}
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
        </section>
      )}
      <section id="component-api" className="reference-api">
        <h2>API reference</h2>
        <p>主要属性与默认值。完整类型随组件包发布。</p>
        <div className="cs-table-scroll api-table">
          <table className="cs-table">
            <caption className="cs-sr-only">{item.name} API 参数</caption>
            <thead>
              <tr>
                <th>属性</th>
                <th>类型</th>
                <th>默认 / 要求</th>
              </tr>
            </thead>
            <tbody>
              {item.props.map(([name, type, defaultValue]) => (
                <tr key={name}>
                  <td>
                    <code>{name}</code>
                  </td>
                  <td>{type}</td>
                  <td>{defaultValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="component-guidance">
        <h2>使用约定</h2>
        <p>{item.guidance}</p>
      </section>
      <div className="component-neighbors">
        {[previous, next].filter(Boolean).map((neighbor) => (
          <a key={neighbor.id} href={`#component/${neighbor.id}`}>
            <span>{neighbor.group}</span>
            <strong>
              {neighbor.name}
              <ArrowRight size={16} />
            </strong>
          </a>
        ))}
      </div>
    </article>
  );
}

export function MeasurementForm() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("请输入任务名称。");
      return;
    }
    setError("");
    setCreated(true);
    toast({ title: "演示任务已创建", description: name.trim() });
  };
  return (
    <form onSubmit={submit} noValidate className="measurement-form">
      <div className="two-col">
        <Input
          label="任务名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          placeholder="例如：产线噪声检测"
        />
        <Combobox
          label="采集设备"
          options={[
            { value: "cs-1", label: "声学成像仪 01" },
            { value: "cs-2", label: "数据采集终端 02" },
          ]}
          defaultValue="cs-1"
        />
      </div>
      <div className="two-col">
        <Select label="采样率" defaultValue="48">
          <option value="48">48 kHz</option>
          <option value="96">96 kHz</option>
        </Select>
        <RadioGroup
          label="频率计权"
          defaultValue="a"
          options={[
            { value: "a", label: "A 计权" },
            { value: "z", label: "Z 计权" },
          ]}
        />
      </div>
      <Slider label="输入增益" unit="dB" max={60} defaultValue={[24]} />
      <Textarea label="备注" rows={3} />
      <Checkbox label="保存原始测量数据" defaultChecked />
      {created && (
        <Alert title="演示任务已创建" tone="success">
          {name} · 未连接硬件或提交服务器。
        </Alert>
      )}
      <div className="demo-row">
        <Button type="submit">创建演示任务</Button>
        <span className="cs-help">组合示例，不执行真实测量。</span>
      </div>
    </form>
  );
}
export { ToastProvider };
export function FoundationGallery() {
  return (
    <div className="foundation-gallery">
      <div>
        <h3>字号与层级</h3>
        <p className="cs-help">变量已统一提供，消费项目无需重复定义比例。</p>
        <div className="type-specs">
          {[
            ["xs", "12px", "text extra small", "说明与辅助信息"],
            ["sm", "14px", "text small", "表单标签与紧凑正文"],
            ["md", "16px", "text base", "默认正文"],
            ["lg", "18px", "text large", "组件与面板标题"],
            ["xl", "20px", "text extra large", "分组标题"],
            ["2xl", "24px", "text 2x large", "内容区域标题"],
            ["3xl", "30px", "text 3x large", "页面标题"],
            ["4xl", "36px", "text 4x large", "产品页面标题"],
          ].map(([token, size, label, text]) => (
            <div key={token}>
              <div className="type-spec-label">
                <strong>{label}</strong>
                <code>--cs-text-{token}</code>
              </div>
              <span style={{ fontSize: `var(--cs-text-${token})` }}>{text}</span>
              <small>{size}</small>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3>常用间距与浮层层级</h3>
        <p className="cs-help">
          4px 基线来自 Figma；扩展间距与浮层层级为系统提案。
        </p>
        <div className="space-specs">
          {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
            <div key={n}>
              <code>{n}</code>
              <span style={{ width: `var(--cs-space-${n})` }} />
              <small>{n * 4}px</small>
            </div>
          ))}
        </div>
        <div className="layer-specs">
          <span>
            Overlay <strong>40</strong>
          </span>
          <span>
            Modal <strong>50</strong>
          </span>
          <span>
            Popover <strong>60</strong>
          </span>
          <span>
            Tooltip <strong>70</strong>
          </span>
          <span>
            Toast <strong>80</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
