import {IconButtonDemo} from './website-controls-demo';
import { useId, useState, type ReactNode } from "react";
import {
  SearchLg,
  ChevronDown,
  ChevronRight,
  Grid01,
  LayersThree01,
  Code02,
  Package,
  Settings01,
  Sun,
  Moon01,
  Menu01,
  ArrowRight,
  ArrowLeft,
  Copy01,
  LinkExternal01,
  Check,
} from "@untitledui/icons";
import {
  DialogRoot as SearchRoot,
  DialogContent as SearchContent,
  DialogTitle as SearchTitle,
  DialogDescription as SearchDescription,
} from "../../../packages/ui/src/index";
import { catalog, type ComponentDoc } from "./catalog";
import {
  Breadcrumbs,
  Avatar,
  ActionLink,
  CarouselPagination,
  Badge,
  Button,
  Checkbox,
  Input,
  NumberInput,
  Rating,
  Progress,
  Shadow,
  MetricGroup,
  QuotaCard,
  DetailPanel,
  ResourceCard,
  ProgressList,
  Toolbar,
  ToolbarButton,
  LinkGroup,
  FilterToolbar,
  RadioGroup,
  Pagination,
  LoadingIndicator,
  ProgressSteps,
  VideoPlayer,
  Slider,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  StatusBadge,
  EmptyState,
  Popover,
  Sheet,
} from "../../../packages/ui/src/index";
const docSections = [
  {
    id: "getting-started", name: "入门指南", english: "Getting started",
    links: [["overview", "Overview", "简介"], ["installation", "Installation", "安装与接入"]],
  },
  {
    id: "design-foundations", name: "设计基础", english: "Design foundations",
    links: [["foundations", "Foundations", "基础规范"], ["logo", "Logo guidelines", "标志规范"], ["icons", "Icons", "图标库"], ["file-icons", "File icons", "文件图标"], ["customization", "Customization", "主题与客户定制"]],
  },
  {
    id: "templates", name: "样板库", english: "Templates",
    links: [["templates", "Templates", "样板库"]],
  },
] as const;
export const docCategories = [
  {
    id: "base",
    name: "基础组件",
    english: "Base components",
    description:
      "按钮、输入、选择器和状态控件——用于搭建产品软件、管理后台、客户定制界面与响应式 Web 应用的基础组件。",
    ids: [
      "avatar",
      "badge",
      "button",
      "icon-button",
      "action-link",
      "carousel-pagination",
      "floating-toc",
      "checkbox",
      "combobox",
      "input",
      "rating",
      "progress",
      "radio-group",
      "select",
      "slider",
      "switch",
      "textarea",
      "tooltip",
      "separator",
      "skeleton",
      "shadow",
    ],
  },
  {
    id: "application",
    name: "应用组件",
    english: "Application UI components",
    description:
      "内容卡片、图片画廊、对话框、菜单、导航和数据表格——组合常见的内容展示、产品任务与应用工作流。",
    ids: [
      "media-gallery",
      "resource-card",
      "metric-group",
      "progress-list",
      "filter-toolbar",
      "quota-card",
      "detail-panel",
      "form-dialog",
      "toolbar",
      "link-group",
      "navigation-menu",
      "accordion",
      "alert",
      "alert-dialog",
      "breadcrumbs",
      "card",
      "data-table",
      "dialog",
      "dropdown-menu",
      "empty-state",
      "file-upload",
      "pagination",
      "popover",
      "sheet",
      "tabs",
      "toast",
      "video-player",
      "color-picker",
      "command-menu",
      "date-picker",
      "inline-cta",
      "line-bar-charts",
      "loading-indicator",
      "progress-steps",
      "section-header",
      "tree-view",
    ],
  },
  {
    id: "instrument",
    name: "仪器业务组件",
    english: "Instrument components",
    description:
      "设备状态、测量读数和设备列表——为 CRYSOUND 的仪器与声学产品统一信息表达。",
    ids: ["device-table", "metric", "status-badge", "login-page", "instrument-dialog"],
  },
];
export function categoryFor(id: string) {
  return (
    docCategories.find((category) => category.ids.includes(id)) ??
    docCategories[0]
  );
}
export function DocsBrand() {
  return (
    <a className="docs-brand" href="#library" aria-label="CRYSOUND 设计系统首页">
      <img className="docs-brand-logo" src="/crysound-logo.svg" alt="CRYSOUND" width="1476" height="199" />
    </a>
  );
}
export function SidebarContent({
  route,
  onNavigate,
  searchFocus = false,
  showSearch = false,
}: {
  route: string;
  onNavigate?: () => void;
  searchFocus?: boolean;
  showSearch?: boolean;
}) {
  const sidebarId=useId();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const toggle = (id: string) =>
    setCollapsed((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  const filtered = catalog.filter((item) =>
    `${item.name} ${item.zh}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="sidebar-content">
      {showSearch && (
        <label className="docs-search">
          <SearchLg size={16} aria-hidden="true" />
          <input
            aria-label="搜索组件"
            placeholder="搜索组件…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={searchFocus}
          />
          <kbd>/</kbd>
        </label>
      )}
      <nav aria-label="设计系统文档" className="docs-nav">
        {docSections.map(section=>{
          if(section.id==='templates')return <div className="docs-nav-section docs-nav-section--single" key={section.id}><div className="docs-nav-links"><a href="#templates" aria-current={route==='templates'||route.startsWith('templates/')?'page':undefined} onClick={onNavigate}>Templates<span>样板库</span></a></div></div>;
          const open=!collapsed.includes(section.id);
          return <div className="docs-nav-section" key={section.id}>
            <button className="docs-nav-heading" title={section.name} onClick={()=>toggle(section.id)} aria-expanded={open} aria-controls={`${sidebarId}-${section.id}`}>
              {section.english}<ChevronDown size={14} aria-hidden="true"/>
            </button>
            <div className="docs-nav-content" id={`${sidebarId}-${section.id}`} aria-hidden={!open||undefined} inert={!open||undefined}><div className="docs-nav-links">{section.links.map(([id,name,zh])=><a key={id} href={`#${id}`} aria-current={route===id?'page':undefined} onClick={onNavigate}>{name}<span>{zh}</span></a>)}</div></div>
          </div>;
        })}
        {docCategories.map((category) => {
          const items = category.ids
            .map((id) => filtered.find((item) => item.id === id))
            .filter((item): item is ComponentDoc => !!item);
          if (!items.length) return null;
          const open = !!query || !collapsed.includes(category.id);
          return (
            <div className="docs-nav-section" key={category.id}>
              <button
                className="docs-nav-heading"
                onClick={() => toggle(category.id)}
                aria-expanded={open}
                aria-controls={`${sidebarId}-${category.id}`}
              >
                {category.english}
                <ChevronDown size={14} aria-hidden="true" />
              </button>
              <div className="docs-nav-content" id={`${sidebarId}-${category.id}`} aria-hidden={!open||undefined} inert={!open||undefined}>
                <div className="docs-nav-links">
                  {category.id === "base" && !query && (
                    <a
                      href="#library"
                      aria-current={route === "library" ? "page" : undefined}
                      onClick={onNavigate}
                    >
                      Overview <span>总览</span>
                    </a>
                  )}
                  {items.map((item) => (
                    <a
                      href={`#component/${item.id}`}
                      key={item.id}
                      aria-current={
                        route === `component/${item.id}` ? "page" : undefined
                      }
                      onClick={onNavigate}
                    >
                      {item.name}
                      <span>{item.zh}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {query && !filtered.length && <p className="cs-help">没有匹配组件</p>}
      </nav>
    </div>
  );
}
export function PreviewThumbnail({ id }: { id: string }) {
  switch (id) {
    case "shadow":
      return <div className="thumb-row">{(['xs','md','xl'] as const).map(level=><Shadow key={level} level={level} style={{width:64,height:64,display:'grid',placeItems:'center',borderRadius:'var(--cs-radius-lg)',fontSize:12}}>{level}</Shadow>)}</div>;
    case "instrument-dialog":
      return <div className="thumb-modal"><strong>通道校准</strong><span>确认设备连接后开始校准。</span><div style={{display:'flex',justifyContent:'space-between',gap:12}}><span>采集设备 01</span><StatusBadge status="online"/></div><Progress value={66} label="校准进度"/><div className="thumb-row"><Button size="sm" variant="secondary">取消</Button><Button size="sm">开始校准</Button></div></div>;
    case "icon-button":return <IconButtonDemo/>;
    case "media-gallery":return <img src="/scene-assets/sonodaq.png" alt="产品图片画廊" style={{width:120,height:80,objectFit:'contain'}}/>;
    case "floating-toc":
      return <div aria-label="悬浮目录示意" style={{display:'grid',gap:12}}>{Array.from({length:8},(_,i)=><span key={i} style={{display:'block',width:i===3?28:16,height:i===3?2:1,background:i===3?'var(--cs-text)':'var(--cs-border)'}}/>)}</div>;
    case "carousel-pagination":
      return <CarouselPagination count={6} value={3} onValueChange={()=>{}}/>;
    case "action-link":
      return <ActionLink href="#library">查看全部设备</ActionLink>;
    case "resource-card":
      return <ResourceCard href="#installation" title="安装与接入" source="开发文档"/>;
    case "metric-group":
      return <MetricGroup label="测量概览" density="compact" items={[{id:'devices',label:'在线设备',value:8,unit:'台',note:'当前连接状态'}]}/>;
    case "progress-list":
      return <ProgressList title="测量任务" items={[{id:'check',title:'通道检查',progress:80,progressLabel:'8 / 10',date:'10-19'}]}/>;
    case "filter-toolbar":
      return <FilterToolbar label="任务筛选" query="" onQueryChange={()=>{}} onReset={()=>{}}/>;
    case "quota-card":
      return <QuotaCard title="测量空间" quotas={[{id:'storage',label:'剩余容量',remaining:62,reset:'本周期可用'}]}/>;
    case "detail-panel":
      return <DetailPanel title="测量任务" fields={[{id:'device',label:'设备',value:'采集终端 01'},{id:'rate',label:'采样率',value:'48 kHz'}]}/>;
    case "form-dialog":
      return <div className="thumb-modal"><strong>编辑测量任务</strong><span>更新名称与测量配置。</span><Input label="任务名称" defaultValue="通道检查"/><footer className="thumb-row"><Button size="sm" variant="secondary">取消</Button><Button size="sm">保存</Button></footer></div>;
    case "toolbar":
      return <Toolbar label="任务操作"><ToolbarButton>刷新</ToolbarButton><ToolbarButton>导出</ToolbarButton><ToolbarButton>更多</ToolbarButton></Toolbar>;
    case "link-group":
      return <LinkGroup label="技术资源" items={[{id:'start',label:'快速开始',href:'#installation'},{id:'components',label:'组件文档',href:'#library'},{id:'guide',label:'使用指南',href:'#foundations'}]}/>;
    case "navigation-menu":
    case "navigation-bar":
      return <div className="navigation-menu-thumbnail" role="img" aria-label="网站一级导航示意"><span>Products <ChevronDown size={12}/></span><span>Solutions <ChevronDown size={12}/></span><span>About Us</span></div>;
    case "navigation-panel":
      return <div className="navigation-panel-thumbnail" role="img" aria-label="分类目录与图片卡片示意"><span>分类目录</span><span>产品图片</span></div>;

    case "button":
      return (
        <div className="thumb-row">
          <Button size="sm" variant="secondary">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </div>
      );
    case "avatar":
      return (
        <div className="thumb-row">
          <Avatar name="林晨" initials="L" size="sm" />
          <Avatar name="Alex Chen" status="online" />
          <Avatar name="CRYSOUND" variant="logo" shape="rounded" size="lg" />
        </div>
      );
    case "badge":
      return (
        <div className="thumb-row">
          <Badge tone="success">Active</Badge>
          <Badge tone="brand">New</Badge>
        </div>
      );
    case "checkbox":
      return (
        <div className="thumb-stack">
          <Checkbox label="保存原始数据" checked />
          <Checkbox label="自动生成报告" />
        </div>
      );
    case "switch":
      return (
        <div className="thumb-stack">
          <Switch label="自动重连" checked />
          <Switch label="远程访问" />
        </div>
      );
    case "radio-group":
      return (
        <RadioGroup
          label="Frequency weighting"
          defaultValue="a"
          options={[
            { value: "a", label: "A 计权" },
            { value: "z", label: "Z 计权" },
          ]}
        />
      );
    case "input":
      return <Input label="Email" placeholder="you@example.com" />;
    case "number-input":
      return <NumberInput label="演示阈值 / dB(A)" defaultValue={64} min={30} max={90} />;
    case "rating-summary":
    case "rating-distribution-row":
    case "rating-score":
    case "rating-overview":
    case "rating-review-card":
    case "rating":
      return <Rating label="产品评分" value={2} size="lg" hideLabel readOnly />;
    case "textarea":
      return (
        <div className="thumb-input">
          <span>备注</span>
          <div>记录测量环境与异常现象…</div>
        </div>
      );
    case "select":
    case "combobox":
      return (
        <div className="thumb-select">
          <Avatar name="CRYSOUND" size="sm" />
          <span>SonoDAQ</span>
          <ChevronDown size={16} />
        </div>
      );
    case "progress":
      return <Progress label="Upload progress" value={68} />;
    case "slider":
      return <Slider label="Input gain" defaultValue={[36]} max={60} />;
    case "badge-group":
    case "status-badge":
      return (
        <div className="thumb-row">
          <StatusBadge status="online" />
          <StatusBadge status="running" />
        </div>
      );
    case "metric":
      return (
        <div className="thumb-metric">
          <span>声压级 / SPL</span>
          <strong>
            68.4 <small>dB</small>
          </strong>
          <Badge tone="success">A 计权</Badge>
        </div>
      );
    case "tabs":
      return (
        <Tabs defaultValue="day">
          <TabsList variant="pill" aria-label="Thumbnail tabs">
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This week</TabsTrigger>
            <TabsTrigger value="month">This month</TabsTrigger>
          </TabsList>
        </Tabs>
      );
    case "login-page":
      return <div className="thumb-menu"><div><strong>欢迎回来</strong></div><div>账号　________</div><div>密码　••••••••</div><Button size="sm">登录</Button></div>;
    case "tree-view":
      return <div className="thumb-menu"><div>⌄ 测量项目</div><div>　产线检测</div><div>　检测报告.pdf</div><div>› 设备目录</div></div>;
    case "section-header":
      return <div className="thumb-menu"><div><strong>测量项目</strong><Button size="sm">新建</Button></div><small>查看项目、设备与报告</small></div>;
    case "progress-steps":
      return <ProgressSteps steps={[{id:"a",title:"设备"},{id:"b",title:"配置"},{id:"c",title:"完成"}]} currentStep="b" />;
    case "loading-indicator":
      return <LoadingIndicator variant="ring" size="lg" label="加载中" />;
    case "line-bar-charts":
      return <svg width="220" height="100" viewBox="0 0 220 100" aria-hidden="true"><path d="M10 80H210M10 15V80" fill="none" stroke="var(--cs-border)"/><path d="m10 65 30-15 30 10 30-30 30 10 30-25 30 10" fill="none" stroke="var(--cs-chart-channel-01)" strokeWidth="3"/><path d="m10 75 30-10 30 5 30-20 30 5 30-20 30 10" fill="none" stroke="var(--cs-chart-channel-02)" strokeWidth="3"/></svg>;
    case "inline-cta":
      return <div className="thumb-alert"><div><strong>配置报告模板</strong><small>统一团队的结果交付</small></div><Button size="sm">开始配置</Button></div>;
    case "date-picker":
      return <div className="thumb-menu"><div>2026 年 10 月</div><div>一　二　三　四　五</div><div>12　13　14　15　16</div></div>;
    case "command-menu":
      return <div className="thumb-menu"><div>⌕ 搜索命令…</div><div>新建测量任务 <small>⌘ N</small></div><div>团队设置</div></div>;
    case "color-picker":
      return <div className="thumb-color-picker"><div /><span>#170057</span></div>;
    case "video-player":
      return <VideoPlayer title="测量演示" poster="/video-poster.svg" src="/demo-video.webm" />;
    case "pagination":
      return (
        <Pagination page={1} pageCount={12} onPageChange={() => {}} />
      );
    case "alert":
      return (
        <div className="thumb-alert">
          <Check size={18} />
          <div>
            <strong>配置已保存</strong>
            <small>设备设置已更新。</small>
          </div>
        </div>
      );
    case "card":
      return (
        <div className="thumb-mini-card">
          <span>Device overview</span>
          <strong>SonoDAQ Go</strong>
          <StatusBadge status="online" />
        </div>
      );
    case "accordion":
      return (
        <div className="thumb-mini-list">
          <div>
            校准要求 <ChevronDown size={14} />
          </div>
          <div>
            设备连接 <ChevronDown size={14} />
          </div>
        </div>
      );
    case "data-table":
    case "device-table":
      return (
        <div className="thumb-table">
          <div>
            <span>Device</span>
            <span>Status</span>
          </div>
          <div>
            <span>SonoDAQ 01</span>
            <StatusBadge status="online" />
          </div>
          <div>
            <span>Acoustic 02</span>
            <StatusBadge status="running" />
          </div>
        </div>
      );
    case "dialog":
    case "alert-dialog":
      return (
        <div className="thumb-modal">
          <strong>
            {id === "alert-dialog" ? "删除任务？" : "新建测量任务"}
          </strong>
          <span>请确认当前任务信息。</span>
          <div className="thumb-row">
            <Button size="sm" variant="secondary">
              取消
            </Button>
            <Button
              size="sm"
              variant={id === "alert-dialog" ? "danger" : "primary"}
            >
              确认
            </Button>
          </div>
        </div>
      );
    case "sheet":
      return (
        <div className="thumb-drawer">
          <strong>设备设置</strong>
          <div />
          <div />
          <Button size="sm">保存设置</Button>
        </div>
      );
    case "dropdown-menu":
      return (
        <div className="thumb-mini-list">
          <div>
            导出配置 <Copy01 size={12} />
          </div>
          <div>
            查看详情 <LinkExternal01 size={12} />
          </div>
          <div>重命名</div>
        </div>
      );
    case "popover":
      return (
        <div className="thumb-modal">
          <strong>筛选设备</strong>
          <Checkbox label="仅在线设备" checked />
        </div>
      );
    case "tooltip":
      return (
        <div className="thumb-stack">
          <span className="thumb-tooltip">导出当前筛选结果</span>
          <Button size="sm" variant="secondary">
            Export report
          </Button>
        </div>
      );
    case "file-upload":
      return (
        <div className="thumb-upload">
          <Package size={24} />
          <span>选择配置文件</span>
          <small>JSON / CSV · 最大 10 MB</small>
        </div>
      );
    case "empty-state":
      return <div className="thumb-empty-state"><EmptyState title="暂无测量任务" description="创建第一个任务" icon={<Grid01/>}/></div>;
    case "breadcrumbs":
      return (
        <div className="thumb-row">
          <Grid01 size={16} />
          <ChevronRight size={14} />
          <span>Devices</span>
          <ChevronRight size={14} />
          <strong>SonoDAQ</strong>
        </div>
      );
    case "toast":
      return (
        <div className="thumb-notification">
          <Check size={18} />
          <div>
            <strong>配置已保存</strong>
            <small>设置已更新</small>
          </div>
          <span>×</span>
        </div>
      );
    case "separator":
      return (
        <div className="thumb-divider">
          <span>参数</span>
          <hr />
          <span>设备信息</span>
        </div>
      );
    case "skeleton":
      return (
        <div className="thumb-skeleton">
          <i />
          <div>
            <i />
            <i />
          </div>
        </div>
      );
    default:
      return <span data-preview-fallback={id}><LayersThree01 size={40} /></span>;
  }
}
export function LibraryOverview() {
  return (
    <div className="library-overview" id="library">
      <section className="library-introduction" id="overview">
        <h1>
          CRYSOUND <span>React UI components</span>
        </h1>
        <p>
          面向 CRYSOUND 产品软件、管理后台与客户定制的 React
          组件库。所有组件共享品牌
          Token，支持明暗主题与紧凑密度，可通过组件包或源码 Registry 接入项目。
        </p>
        <a
          href="#base-components"
          className="docs-action docs-action--secondary"
        >
          浏览组件
          <ArrowRight size={16} />
        </a>
      </section>
      {docCategories.map((category) => (
        <section
          key={category.id}
          id={`${category.id}-components`}
          className="library-category"
        >
          <h2>{category.english}</h2>
          <p>{category.description}</p>
          <div className="preview-card-grid">
            {category.ids.map((id) => {
              const item = catalog.find((component) => component.id === id)!;
              return (
                <div key={id} className="preview-card">
                  <div className="preview-card-art" aria-hidden="true">
                    <div
                      className={`preview-card-render preview-card-render--${id}`}
                      inert
                    >
                      <PreviewThumbnail id={id} />
                    </div>
                  </div>
                  <a href={`#component/${id}`} className="preview-card-caption">
                    <strong>
                      {item.name}
                      <span>{item.zh}</span>
                    </strong>
                    <small>{item.group} · 交互示例与 API</small>
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
export function DocsHeader({
  route,
  activeDoc,
  theme,
  onThemeToggle,
  onSearch,
  settings,
}: {
  route: string;
  activeDoc?: ComponentDoc;
  theme: string;
  onThemeToggle: () => void;
  onSearch: () => void;
  settings: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const docSection=docSections.find(section=>section.links.some(([id])=>id===route||(id==='templates'&&route.startsWith('templates/'))));
  return (
    <header className="docs-topbar cs-glass cs-glass--regular">
      <div className="docs-mobile-brand">
        <DocsBrand />
      </div>
      <div className="docs-header-breadcrumbs">
        <Breadcrumbs label="当前位置" items={[
          { label: activeDoc ? categoryFor(activeDoc.id).name : docSection?.name ?? "组件", href: docSection ? `#${docSection.links[0][0]}` : "#library" },
          ...(activeDoc ? [{ label: "组件", href: "#library" }] : []),
          { label: activeDoc?.name ?? ({
            logo: "Logo 规范", foundations: "基础规范", icons: "图标库", "file-icons": "File icons 文件图标",
            installation: "安装与接入", templates: "场景样板", customization: "主题与定制",
          } as Record<string, string>)[route] ?? "简介" },
        ]} />
      </div>
      <div className="docs-header-actions">
        <button type="button" className="docs-icon-button" aria-label="搜索组件" onClick={onSearch}>
          <SearchLg size={18} aria-hidden="true" />
        </button>
        <button
          className="docs-icon-button"
          aria-label={theme === "dark" ? "切换浅色主题" : "切换深色主题"}
          onClick={onThemeToggle}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon01 size={18} />}
        </button>
        <Popover
          title="预览设置"
          trigger={
            <button className="docs-icon-button" aria-label="打开预览设置">
              <Settings01 size={18} />
            </button>
          }
        >
          {settings}
        </Popover>
        <a
          className="docs-icon-button docs-desktop-action"
          href="https://github.com/crysound/design-system"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub 仓库"
        >
          <Code02 size={18} />
        </a>
        <a
          className="docs-action docs-desktop-action"
          href="https://github.com/crysound/design-system"
          target="_blank"
          rel="noopener noreferrer"
        >
          代码仓库
        </a>
        <div className="docs-mobile-menu">
          <Sheet
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            side="left"
            trigger={
              <button className="docs-icon-button" aria-label="打开导航菜单">
                <Menu01 size={22} />
              </button>
            }
            title="CRYSOUND UI"
            description="组件与设计规范"
          >
            <SidebarContent
              route={route}
              onNavigate={() => setMobileOpen(false)}
              showSearch
            />
          </Sheet>
        </div>
      </div>
    </header>
  );
}
export function ComponentSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const results = catalog.filter((item) =>
    `${item.name} ${item.zh}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <SearchRoot
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <SearchContent className="docs-search-dialog">
        <SearchTitle className="cs-sr-only">搜索组件</SearchTitle>
        <SearchDescription className="cs-sr-only">
          输入组件名称或中文关键词。
        </SearchDescription>
        <label className="docs-search">
          <SearchLg size={20} aria-hidden="true" />
          <input
            autoFocus
            aria-label="搜索组件名称"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索组件或中文关键词…"
          />
          <kbd>Esc</kbd>
        </label>
        <div className="docs-search-results">
          {results.length ? (
            <ul>
              {results.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#component/${item.id}`}
                    onClick={() => onOpenChange(false)}
                  >
                    <Grid01 size={16} />
                    <span>
                      {item.name}
                      <small>{item.zh}</small>
                    </span>
                    <ChevronRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>没有匹配组件</p>
          )}
        </div>
      </SearchContent>
    </SearchRoot>
  );
}
