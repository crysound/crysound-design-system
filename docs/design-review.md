# 来源审查与 Token 映射

2026-10-13：读取了三个用户指定 Figma 画布的结构。画布不能直接生成上下文，因此继续读取实际子节点；以下结论来自变量定义和节点上下文，并非仅从截图猜色。

| 来源 | 读取节点 | 证据 |
| --- | --- | --- |
| OpenTest V4 | 8:2225 → 8:2229、4489:9919 | 软件布局、变量、按钮默认/hover/active 三态 |
| OpenTest 官网 | 1:19978 → 2020:1545 | 下载按钮上下文与截图 |
| 公司官网 2.0 | 19939:12429 → 21685:8489、20843:26502 | 官网变量、标题上下文与截图 |

## 映射决定

| Figma 变量 | 原始值 | 代码 | 决定 |
| --- | --- | --- | --- |
| dc/color/foreground/primary、text/brand-primary | #170057 | --cs-brand | 两套 OpenTest 与公司官网一致，继承 |
| font/style/italic | HarmonyOS Sans SC | --cs-font | 保留来源记录；按用户要求，当前默认改为系统苹方字体 |
| dc/border radius/default | 4 | --cs-radius | 官网通用控件继承；软件微控件另有 2px，不强行合并 |
| spacing/1、2、3、4、6 | 4、8、12、16、24 | --cs-space-* | 继承 |
| 官网 text/primary、secondary | #333333、#707070 | --cs-text、--cs-muted | 默认官网/舒适基础 |
| 官网 border/primary | #d6d6d6 | --cs-border | 继承 |
| 软件 text/primary、secondary | #334155、#64748b | software profile | 通过 data-context=software 保留 |
| 软件 background/primary | #e2e8f0 | software profile --cs-bg | 保留仪器界面灰阶 |
| 官网辅色 | #00c5ff | 原始证据保留 | 不作为正文色；用途待品牌确认 |

原始提取见 `references/opentest-variables.json` 与 `references/crysound-website-variables.json`。截图为审查资料，不作为代码图片实现界面。未复制下载按钮或锁图标资产，因为首版实现的是归一化组件 API，不是这些屏幕的逐像素复刻。

## 尚未批准的扩展

深色主题、客户 Ocean 示例、状态色、40/32px 控件高度和 hover 色仍为工程提案。提供的 Engineer 微控件只有约 20px 高，因此未来需要单独定义仪器微控件尺寸，不把首版 compact 称为原图精确复刻。

完整组件状态审计、官网真实资产、正式 logo、跨页面 Token 冲突处理与视觉回归仍需后续深化。导航品牌区域已采用用户提供的标准 SVG Logo；字体按用户要求优先使用系统苹方，不打包或下载额外字体。

## 用户确认的文字色阶

按用户提供的 Tailwind Slate 色板，文字统一采用 Slate 50–950。亮色主题主文字为 Slate 900（#0f172a），次级文字为 Slate 700（#334155），辅助文字及占位符为 Slate 500（#64748b），禁用文字令牌为 Slate 400（#94a3b8）。深色主题分别使用 Slate 50、200、400、600。文档站与仪器软件共享此文字映射。上表中的 Figma 原始文字值保留作为历史来源；品牌色、状态色和表面色不在本次文字调整范围内。
