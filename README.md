# CRYSOUND Design System

面向 CRYSOUND 产品软件、管理后台、官网和客户定制的 React + TypeScript 设计系统工程首版。

**状态：0.2.0。** 已读取三个输入 Figma 文件的结构与代表节点，提取 OpenTest 软件与 CRYSOUND 官网变量。主色 #170057、HarmonyOS Sans SC、4px 圆角与间距基线有来源；深色主题、状态色和控件高度是待批准的扩展提案。本仓库没有复制 Untitled UI PRO 资源，也没有声称完成 Figma 视觉还原。

## 本地运行

需要 Node.js 22.12+ 或 24 LTS，以及 npm 10+。

```sh
npm ci
npm run dev
npm run check
```

开发服务器默认 [http://127.0.0.1:5173](http://127.0.0.1:5173)。`check` 执行 Token/Registry 生成、官方 Schema 校验、类型检查、交互测试和三个工作区的生产构建。

## 仓库结构

| 目录 | 职责 |
| --- | --- |
| `packages/tokens` | 可跨框架使用的主题 CSS 与生成的 Token JSON |
| `packages/ui` | 带类型声明的 React 组件库，独立 ESM 构建 |
| `apps/docs` | 可运行的中文规范、组件与业务模式展示 |
| `docs` | 架构、定制策略、设计依据与后续路线 |
| `.github/workflows` | GitHub 持续集成 |

## 接入项目

尚未发布到 npm。先在本仓库构建后打包：

```sh
npm run build
npm pack -w @crysound/tokens
npm pack -w @crysound/ui
```

在目标项目安装这两个生成的 `.tgz` 文件和 React 19，然后：

```tsx
import { Button, Input, StatusBadge } from '@crysound/ui';
import '@crysound/tokens/tokens.css';
import '@crysound/ui/styles.css';

export function DeviceConnection() {
  return <div>
    <Input label="设备地址" placeholder="192.168.1.10" />
    <StatusBadge status="offline" />
    <Button onClick={() => console.log('在业务层接入连接服务')}>连接设备</Button>
  </div>;
}
```

默认使用系统字体，优先使用 macOS 自带的苹方（PingFang SC），其他平台回退到当地系统字体；无需下载字体文件。

在 HTML 根元素设置 `data-theme="dark"`、`data-density="compact"`、`data-customer="ocean"` 切换模式。将主题设置在根元素可让 Portal 弹窗继承主题。

## 33 类组件

| 分类 | 组件 |
| --- | --- |
| 操作 | Button（4 种层级、3 种尺寸、加载、禁用、图标） |
| 表单 | Input、Textarea、Select、Combobox、Checkbox、Switch、RadioGroup、Slider、FileUpload |
| 导航 | Tabs、Accordion、Breadcrumbs、Pagination |
| 浮层 | Dialog、AlertDialog、Sheet、Popover、Tooltip、DropdownMenu |
| 展示 | Badge、Avatar、Separator、Card |
| 反馈 | Alert、ToastProvider/useToast、Progress、Skeleton、EmptyState |
| 仪器业务 | StatusBadge、Metric、DeviceTable |
| 数据 | DataTable（搜索、排序、分页、跨页选择） |

中文文档站支持组件搜索、独立组件路由、交互预览、使用代码和 API 参数。图标库（#icons）提供 1181 个 Untitled UI 图标的名称搜索、分类、尺寸和品牌色预览及 React 代码复制；消费项目安装 `@untitledui/icons` 后可按需导入。产品模式提供测量任务配置与设备工作台。设备读数与列表都是演示数据，没有硬件通信能力。

## 源码安装

在已经初始化 shadcn 的 React 项目中运行（端口以本地实际服务为准）：

```sh
npx shadcn@latest add http://127.0.0.1:5173/r/crysound-ui.json
```

Registry 从实际源码生成，将组件安装到项目的 components 别名下 `crysound/` 目录。导入安装后的 `crysound/tokens.css` 和 `crysound/ui/styles.css`。详见 [安装与接入](docs/registry.md)。当前没有公开托管 Registry，仓库保持私有。

## 维护与设计依据

- [组件约定](docs/components.md)
- [架构与客户定制](docs/architecture.md)
- [Figma 来源映射](docs/design-review.md)
- [两套参考系统的采用方式](docs/reference-adoption.md)
- [版本变更](CHANGELOG.md)

## 参考资料与权利

- [Untitled UI React](https://github.com/untitleduico/react)：参考视觉层级与组件组织。
- [shadcn/ui](https://github.com/shadcn-ui/ui)：参考组件源码可控、可组合的方式。
- [OpenTest V4](https://www.figma.com/design/Ea2zZC9NZCRY7SP1BySrvv/OpenTest-V4?node-id=8-2225)
- [OpenTest 官网](https://www.figma.com/design/vs6mXxpmwkI91R1JLsLG6c/OpenTest?node-id=1-19978)
- [公司官网 2.0](https://www.figma.com/design/bsk0jyVDkS9VCM3gjmhdaM/Website?node-id=19939-12429)

本次组件为独立实现，没有直接拷贝上述仓库源码。依赖的许可由各依赖自行声明。Figma 商业素材与 PRO 资源的权利不因开源 React 仓库的许可而改变。当前默认保留本项目代码权利，未擅自将 CRYSOUND 品牌和用户设计开源授权。

GitHub 仓库：[ya7881/crysound-design-system](https://github.com/ya7881/crysound-design-system)，私有仓库。npm 包尚未发布；现阶段可克隆源码或使用构建后的 tarball。

## 导航图标语义

- 站内列表详情、查看全部和进入子页面：默认使用明确的文字链接；需要方向提示时使用统一图标库的 ChevronRight / ArrowRight。
- 右上箭头 / LinkExternal 仅用于外部站点或明确的新窗口跳转，不作为卡片、表格行尾、标题链接的默认装饰。
- 表格已有可点击名称时，不重复添加无标签的行尾箭头。确需独立详情操作时，提供“查看详情”文字或带 aria-label 的按钮。
- 使用 SVG 图标组件，禁止用 Unicode 箭头字符拼接按钮文案，避免不同平台基线、尺寸和字重不一致。

站内文字操作统一使用 `<ActionLink href="/samples">全部样本</ActionLink>`；外部导航显式传 `external`。箭头使用组件内的 16px SVG、1.5px 线宽和 6px 间距，不拼接字符。

Select 的普通单选使用统一 Radix 浮层，不使用操作系统原生弹出菜单；保留 option、value/defaultValue、onChange、name、required 与原生 select ref。multiple、size 和 optgroup 保留原生语义。业务页面请使用共享 Select，直接写原生 select 不会获得统一浮层。
