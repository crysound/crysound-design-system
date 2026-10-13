# 参考系统的采用方式

本轮读取的是两个开源仓库实际组件源码与许可，而非只参考 README 或截图。

| 参考 | 核对快照 | 检查内容 | CRYSOUND 的采用方式 |
| --- | --- | --- | --- |
| Untitled UI React | 1d410cb8facde8d50869e7bbb5f3d048e2267466 | base/buttons、checkbox、select、avatar、progress 的组织及组件目录 | 尺寸/状态成组展示、标签与说明关联、中文规范、品牌与语义变量分离 |
| shadcn/ui | 30a58d4498f270af1c1e981a7d78a15cf5740841 | new-york-v4 的 tabs、command、dialog、dropdown、表单目录及 registry 规范 | Radix 组合式交互、cmdk 搜索、可安装源码 Registry、按组件浏览代码与 API |

链接：[Untitled UI React](https://github.com/untitleduico/react)、[shadcn/ui](https://github.com/shadcn-ui/ui)、[Registry item 规范](https://ui.shadcn.com/docs/registry/registry-item-json)。

这两套开源仓库声明 MIT 许可。当前实现为 CRYSOUND 自行编写的组件与样式，没有逐文件复制其源码；第三方运行依赖仍遵循各自许可。Untitled UI PRO、商业图标、头像图片与 Figma 商业资源未纳入。

## 取舍

- 不混用 React Aria 与 Radix 的同类交互行为：当前统一用已有 Radix，减少两套焦点和状态模型。
- 不将参考库的紫色或圆角当作品牌依据：主色 #170057 和 4px 基础圆角来自用户 Figma。新增语义、尺寸、阴影、层级与动态 Token 为明确的扩展提案。
- 固定选项 Select 使用原生 select，搜索选择使用 Popover + cmdk；未把原生选择器伪装成完全自定义列表。
- DataTable 提供中小规模本地数据的完整交互，暂不引入大型表格框架。服务端分页、列拖动、虚拟滚动是后续扩展。
- 源码 Registry 提供整套可运行组件，不声称已经对参考库的全部组件达到功能对等。

## 0.2.0 的范围

33 类组件按操作、表单、导航、浮层、展示、反馈、仪器业务、数据分类。每类有可交互示例、使用代码、主要参数和使用约定。还提供测量任务表单与设备数据工作台两类组合示例。

剩余范围：日期/时间选择、树、虚拟滚动、拖拽布局、命令面板、复杂菜单、完整图表、波形/频谱/声学热力图。这些需要单独的数据、交互与业务约定，不能用静态图片替代功能。
