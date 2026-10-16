import { CompositionFoundations } from "./composition-foundations";
import { BoundaryPreview } from "./boundary-preview";
import { LogoGuidelines } from "./logo-guidelines";
import { ChevronRight, LinkExternal01 } from "@untitledui/icons";
import { TypographyFoundations } from "./typography-foundations";
import { GlassFoundations } from "./glass-foundations";
import { SpringFoundations } from "./spring-foundations";
import { AlphaFoundations } from "./alpha-foundations";
import { RadiusFoundations } from "./radius-foundations";
import { SpaceFoundations } from "./space-foundations";
import { ThemeSelect } from "./theme-select";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Input,
  Card,
  Metric,
  DeviceTable,
  Dialog,
  StatusBadge,
  EmptyState,
  DataTable,
  Badge,
  type Device,
} from "../../../packages/ui/src/index";
import "../../../packages/tokens/src/tokens.css";
import "../../../packages/ui/src/styles.css";
import "./site.css";
import "./reference-layout.css";
import {
  DocsBrand,
  DocsHeader,
  SidebarContent,
  LibraryOverview,
  docCategories,
  ComponentSearch,
} from "./docs-layout";
import { catalog, groups } from "./catalog";
import {
  ComponentPage,
  FoundationGallery,
  MeasurementForm,
  sampleDevices,
  deviceColumns,
  ToastProvider,
} from "./explorer";
const FileIconsPage = React.lazy(() => import("./file-icons-page"));
const IconLibrary = React.lazy(() => import("./icon-library"));
const devices: Device[] = [
  {
    id: "CS-001",
    name: "声学成像仪 01",
    model: "演示型号 A",
    status: "online",
    location: "实验室 A",
  },
  {
    id: "CS-002",
    name: "产线检测工位",
    model: "演示型号 B",
    status: "running",
    location: "生产线 02",
  },
  {
    id: "CS-003",
    name: "环境监测设备",
    model: "演示型号 C",
    status: "warning",
    location: "测试区域",
  },
];
function savedSetting(
  key: string,
  fallback: string,
  allowed: string[],
): string {
  try {
    const value = JSON.parse(localStorage.getItem("cs-docs-settings") || "{}")[
      key
    ];
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}
function App() {
  const [route, setRoute] = useState(
    window.location.hash.slice(1) || "overview",
  );
  const [searchOpen, setSearchOpen] = useState(false);
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key === "/" &&
        !target.closest("input,textarea,select,[contenteditable=true]")
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const activeDoc = catalog.find((item) => route === `component/${item.id}`);
  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash.slice(1) || "overview");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  React.useEffect(() => {
    if (!route.endsWith("-components")) {
      window.scrollTo(0, 0);
    } else {
      requestAnimationFrame(() =>
        document.getElementById(route)?.scrollIntoView(),
      );
    }
  }, [route]);
  const [context, setContext] = useState(() =>
    savedSetting("context", "website", ["website", "software"]),
  );
  const [theme, setTheme] = useState(() =>
    savedSetting("theme", "light", ["light", "dark"]),
  );
  const [customer, setCustomer] = useState(() =>
    savedSetting("customer", "crysound", ["crysound", "ocean"]),
  );
  const [density, setDensity] = useState(() =>
    savedSetting("density", "comfortable", ["comfortable", "compact"]),
  );
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Device>();
  React.useEffect(() => {
    Object.assign(document.documentElement.dataset, {
      theme,
      customer,
      density,
      context,
    });
    try {
      localStorage.setItem(
        "cs-docs-settings",
        JSON.stringify({ theme, customer, density, context }),
      );
    } catch {}
  }, [theme, customer, density, context]);
  React.useEffect(() => {
    document.title = activeDoc
      ? `${activeDoc.name} · CRYSOUND Design System`
      : "CRYSOUND Design System";
  }, [activeDoc]);
  return (
    <div className="shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main-content");
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        跳转到内容
      </a>
      <ComponentSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <aside className="docs-sidebar">
        <div className="docs-sidebar-brand">
          <DocsBrand />
        </div>
        <SidebarContent route={route} />
      </aside>
      <main id="main-content" tabIndex={-1}>
        <DocsHeader
          route={route}
          activeDoc={activeDoc}
          theme={theme}
          onSearch={() => setSearchOpen(true)}
          onThemeToggle={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
          settings={
            <div className="docs-settings-fields">
              <ThemeSelect label="界面密度" value={density} onValueChange={setDensity} options={[{ value: "comfortable", label: "舒适 / 40px" }, { value: "compact", label: "紧凑 / 32px" }]} />
              <ThemeSelect label="客户主题" value={customer} onValueChange={setCustomer} options={[{ value: "crysound", label: "CRYSOUND" }, { value: "ocean", label: "Ocean 示例" }]} />
              <ThemeSelect label="应用表面" value={context} onValueChange={setContext} options={[{ value: "website", label: "官网 / 中性灰" }, { value: "software", label: "软件 / Slate 灰" }]} />
            </div>
          }
        />

        {route === "logo" ? <LogoGuidelines /> : ["icons", "file-icons"].includes(route) ? (
          <React.Suspense fallback={<p role="status">正在加载图标库…</p>}>{route === "file-icons" ? <FileIconsPage /> : <IconLibrary />}</React.Suspense>
        ) : activeDoc ? (
          <ComponentPage
            key={activeDoc.id}
            item={activeDoc}
            theme={theme}
            onToggleTheme={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
          />
        ) : [
            "overview",
            "library",
            ...docCategories.map((category) => `${category.id}-components`),
          ].includes(route) ? (
          <LibraryOverview />
        ) : (
          <div className="docs-legacy-content" data-section={route}>
            <section id="overview" className="intro">
              <div className="eyebrow">ENGINEERED FOR CLARITY</div>
              <h1>精密，一以贯之。</h1>
              <p>
                面向产品软件、客户定制与品牌官网的统一设计语言。
                <br />
                从一枚按钮到一个检测工作流，让体验保持清晰、可靠、可扩展。
              </p>
              <div className="intro-meta">
                <span>React + TypeScript</span>
                <span>{catalog.length} 类组件</span>
                <span>可安装源码 Registry</span>
                <span>可组合组件</span>
              </div>
              <div className="notice">
                设计依据：已提取三个 Figma 文件的结构与代表节点。主色
                #170057、字体及基础灰阶已有来源；深色主题、状态色和控件高度仍为扩展提案。
              </div>
            </section>
            <section id="library">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">COMPONENT LIBRARY</div>
                  <h2>从通用控件，到测量工作流</h2>
                </div>
                <Badge tone="brand">{catalog.length} 类组件</Badge>
              </div>
              <p className="section-intro">
                选择组件查看交互、变体、代码与 API。所有组件共享 CRYSOUND Token
                与主题。
              </p>
              <div className="component-index">
                {groups.map((group) => (
                  <div className="component-index-group" key={group}>
                    <h3>
                      {group}
                      <span>
                        {catalog.filter((item) => item.group === group).length}
                      </span>
                    </h3>
                    {catalog
                      .filter((item) => item.group === group)
                      .map((item) => (
                        <a key={item.id} href={`#component/${item.id}`}>
                          <span>
                            {item.name}
                            <small>{item.zh}</small>
                          </span>
                          <ChevronRight size={16} aria-hidden="true" />
                        </a>
                      ))}
                  </div>
                ))}
              </div>
            </section>
            <section id="installation">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">GET STARTED</div>
                  <h2>两种接入方式，一个组件源</h2>
                </div>
              </div>
              <div className="two-col">
                <Card
                  title="组件包"
                  description="统一版本，适合多个产品共同升级。"
                >
                  <pre>
                    <code>{`npm run build
npm pack -w @crysound/tokens
npm pack -w @crysound/ui`}</code>
                  </pre>
                  <div className="example">
                    <p>在消费项目安装生成的两个 .tgz。npm 包尚未发布。</p>
                  </div>
                </Card>
                <Card
                  title="源码 Registry"
                  description="将源码安装到客户项目，支持独立扩展。"
                >
                  <pre>
                    <code>{`npx shadcn@latest add ${window.location.origin}/r/crysound-ui.json`}</code>
                  </pre>
                  <div className="example">
                    <p>
                      在已初始化 shadcn 的 React 项目运行。当前 Registry
                      由本地文档服务提供。
                    </p>
                    <a
                      href="r/crysound-ui.json"
                      target="_blank"
                      rel="noreferrer"
                    >
                      查看安装清单 <LinkExternal01 size={14} aria-hidden="true" style={{verticalAlign:"middle"}} />
                    </a>
                  </div>
                </Card>
              </div>
            </section>
            <section id="foundations">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">01 / FOUNDATIONS</div>
                  <h2>统一基础，灵活表达</h2>
                </div>
                <span>品牌 · 语义 · 密度</span>
              </div>
              <p className="foundation-intro">按当前任务查阅：先确定颜色与文字，再选择布局、材质和动效。每组保留来源、应用场景与接入示例。</p>
              <Tabs defaultValue="colors" className="foundation-groups">
                <TabsList aria-label="基础规范分组" className="foundation-group-tabs">
                  <TabsTrigger value="colors">颜色与语义</TabsTrigger>
                  <TabsTrigger value="type">字体与排版</TabsTrigger>
                  <TabsTrigger value="layout">间距与圆角</TabsTrigger>
                  <TabsTrigger value="material">边界与材质</TabsTrigger>
                  <TabsTrigger value="motion">交互与动效</TabsTrigger>
                  <TabsTrigger value="composition">组合与验收</TabsTrigger>
                </TabsList>
                <TabsContent value="colors">
              <div className="swatches">
                {[
                  ["品牌", "--cs-brand"],
                  ["正文 / Slate 700", "--cs-text"],
                  ["成功", "--cs-success"],
                  ["警告", "--cs-warning"],
                  ["危险", "--cs-danger"],
                  ["辅助紫", "--cs-accent"],
                ].map(([name, token]) => (
                  <div key={token}>
                    <div
                      className="swatch"
                      style={{ background: `var(${token})` }}
                    />
                    <strong>{name}</strong>
                    <code>{token}</code>
                  </div>
                ))}
              </div>
              <div className="slate-foundation">
                <h3>品牌色阶 / CRYSOUND Purple</h3>
                <p>主色 Brand 900（#170057）· 悬停 Brand 800 · 浅色背景 Brand 50。除主色外为衍生色阶提案，客户主题通过语义 Token 独立覆盖。</p>
                <div className="slate-scale">
                  {[
                    [50, "#f0ecf8"],
                    [100, "#e4dcf2"],
                    [200, "#cbbbe5"],
                    [300, "#af95d5"],
                    [400, "#916ac1"],
                    [500, "#7446a9"],
                    [600, "#5c2d8e"],
                    [700, "#451d76"],
                    [800, "#301875"],
                    [900, "#170057"],
                    [950, "#0d0033"],
                  ].map(([level, hex]) => (
                    <div key={level}>
                      <div className="slate-chip" style={{ background: `var(--cs-brand-${level})` }} />
                      <strong>Brand {level}</strong>
                      <code>{hex}</code>
                    </div>
                  ))}
                </div>
              </div>
              <div className="slate-foundation">
                <h3>文字色阶 / Slate</h3>
                <p>标题 Slate 900 · 正文 Slate 700 · 辅助文字 Slate 500 · 禁用文字 Slate 400。深色模式自动使用对应的浅色层级。</p>
                <div className="slate-scale">
                  {[
                    [50, "#f8fafc"], [100, "#f1f5f9"], [200, "#e2e8f0"],
                    [300, "#cbd5e1"], [400, "#94a3b8"], [500, "#64748b"],
                    [600, "#475569"], [700, "#334155"], [800, "#1e293b"],
                    [900, "#0f172a"], [950, "#020617"],
                  ].map(([level, hex]) => (
                    <div key={level}>
                      <div className="slate-chip" style={{ background: `var(--cs-slate-${level})` }} />
                      <strong>Slate {level}</strong>
                      <code>{hex}</code>
                    </div>
                  ))}
                </div>
              </div>
              <div className="spec-line">
                <span>字体 / 苹方 PingFang SC + 系统回退</span>
                <span>基础间距 / 4px</span>
                <span>圆角 / 4px</span>
              </div>
                </TabsContent>
                <TabsContent value="type"><TypographyFoundations /><details className="foundation-reference"><summary>原始字号 Token · 兼容与扩展</summary><FoundationGallery section="type" /></details></TabsContent>
                <TabsContent value="layout"><SpaceFoundations /><details className="foundation-reference"><summary>间距速查与浮层层级</summary><FoundationGallery section="layout" /></details><RadiusFoundations /></TabsContent>
                <TabsContent value="material"><BoundaryPreview /><AlphaFoundations /><GlassFoundations /></TabsContent>
                <TabsContent value="motion"><SpringFoundations /></TabsContent>
                <TabsContent value="composition"><CompositionFoundations /></TabsContent>
              </Tabs>
            </section>
            <section id="components">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">02 / COMPONENTS</div>
                  <h2>细节一致，操作明确</h2>
                </div>
              </div>
              <div className="two-col">
                <Card
                  title="操作按钮"
                  description="主次层级、危险操作与反馈状态"
                >
                  <div className="example buttons">
                    <Button onClick={() => setSelected(devices[0])}>
                      连接设备
                    </Button>
                    <Button variant="secondary" onClick={() => setQuery("")}>
                      清除筛选
                    </Button>
                    <Dialog
                      trigger={<Button variant="danger">危险操作示例</Button>}
                      title="危险操作确认"
                      description="这是交互演示，不会删除真实设备。"
                    >
                      <p>实际业务应在这里提供明确的操作对象和后果。</p>
                    </Dialog>
                    <Button loading>正在检测</Button>
                    <Button disabled>不可用</Button>
                  </div>
                </Card>
                <Card
                  title="输入与验证"
                  description="可关联标签、说明和错误信息"
                >
                  <div className="example">
                    <Input
                      label="搜索设备"
                      placeholder="输入设备名称或编号"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      hint="搜索会同步过滤下方设备列表。"
                    />
                    <div style={{ marginTop: 16 }}>
                      <Input
                        label="设备编号示例"
                        defaultValue=""
                        error="请输入设备编号（验证状态展示）"
                      />
                    </div>
                  </div>
                </Card>
              </div>
              <Card title="状态语言" description="文字与颜色共同表达状态">
                <div className="example buttons">
                  {(
                    [
                      "online",
                      "running",
                      "warning",
                      "error",
                      "offline",
                    ] as const
                  ).map((s) => (
                    <StatusBadge key={s} status={s} />
                  ))}
                </div>
              </Card>
            </section>
            <section id="patterns">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">03 / PRODUCT PATTERNS</div>
                  <h2>为测量工作流而设计</h2>
                </div>
                <span>演示数据</span>
              </div>
              <Card
                title="测量任务配置"
                description="实际组合表单、选择器、滑块与验证反馈。"
              >
                <div className="example">
                  <MeasurementForm />
                </div>
              </Card>
              <Card
                title="设备数据工作台"
                description="支持搜索、排序、分页和跨页选择，全部使用演示数据。"
              >
                <DataTable
                  caption="演示设备工作台"
                  data={sampleDevices}
                  columns={deviceColumns}
                  getRowId={(row) => row.id}
                  selectable
                  pageSize={4}
                />
              </Card>
              <div className="metrics">
                <Card title="声压级">
                  <Metric
                    label="当前读数"
                    animate
                    value="68.4"
                    unit="dB SPL"
                    note="演示数据 · 非实时采集"
                  />
                </Card>
                <Card title="设备连接">
                  <Metric
                    label="在线设备"
                    animate
                    value="2"
                    unit="/ 3"
                    note="运行中设备计入在线"
                  />
                </Card>
                <Card title="采样设置">
                  <Metric
                    label="采样率"
                    animate
                    value="48"
                    unit="kHz"
                    note="演示配置"
                  />
                </Card>
              </div>
              <Card title="设备管理" description="设备、位置与运行状态">
                <DeviceTable
                  devices={devices.filter((d) =>
                    `${d.name}${d.id}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )}
                  onSelect={setSelected}
                />
              </Card>
              {selected && (
                <Card
                  title={selected.name}
                  description={`${selected.id} · ${selected.location}`}
                  actions={
                    <Button
                      variant="ghost"
                      onClick={() => setSelected(undefined)}
                    >
                      收起
                    </Button>
                  }
                >
                  <div className="example">
                    <StatusBadge status={selected.status} />
                    <p>
                      设备详情示例。业务集成时在此接入连接、校准和测量记录。
                    </p>
                  </div>
                </Card>
              )}
              <Card title="空状态">
                <EmptyState
                  title="尚未创建测量任务"
                  description="连接设备后，创建第一个测量任务。"
                  action={
                    <Dialog
                      trigger={<Button>创建任务示例</Button>}
                      title="创建测量任务"
                      description="此流程展示组件组合方式。"
                    >
                      <Input
                        label="任务名称"
                        placeholder="例如：产线噪声检测"
                      />
                    </Dialog>
                  }
                />
              </Card>
            </section>
            <section id="customization">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">04 / CUSTOMIZATION</div>
                  <h2>同一套系统，多种交付</h2>
                </div>
              </div>
              <Card
                title="实时主题预览"
                description="调整应用级主题，页面和弹窗同步变化。"
              >
                <div className="example controls">
                  <ThemeSelect label="应用表面" value={context} onValueChange={setContext} options={[{ value: "website", label: "官网 / 中性灰" }, { value: "software", label: "软件 / Slate 灰" }]} />
                  <ThemeSelect label="客户主题" value={customer} onValueChange={setCustomer} options={[{ value: "crysound", label: "CRYSOUND 提案" }, { value: "ocean", label: "Ocean 客户示例" }]} />
                  <ThemeSelect label="界面密度" value={density} onValueChange={setDensity} options={[{ value: "comfortable", label: "舒适 / 40px" }, { value: "compact", label: "紧凑 / 32px" }]} />
                </div>
                <pre>{`import { Button } from '@crysound/ui';\nimport '@crysound/tokens/tokens.css';\nimport '@crysound/ui/styles.css';\n\n<Button onClick={connectDevice}>连接设备</Button>`}</pre>
              </Card>
            </section>
          </div>
        )}
        <footer>
          CRYSOUND Design System · 0.2.0 · 基于 Figma 变量的工程首版
        </footer>
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <App />
  </ToastProvider>,
);
