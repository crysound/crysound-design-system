# 品牌空白页视觉核对

日期：2026-10-22。实现：`http://127.0.0.1:5174/#scene/blank`，样板库第五项“品牌空白页”。

## 参考与比较范围

- Source visual truth：`/var/folders/93/xy36g4916c735syc38hmlcfc0000gn/T/codex-clipboard-974f3f95-b37a-4523-a69d-7289ad430b03.png`，2103×1601px。
- 参考是四张重复明暗帧组成的评审板。比较左上浅色帧 `(48,162)-(1038,784)` 与左下深色帧 `(48,847)-(1038,1469)`，各990×622px；不把评审说明、版本名或重复排版当成产品内容。
- 实现桌面 CSS 视口1280×720，截图1280×928px，像素密度1。品牌画布为1280×800px；比较时裁出内容并统一缩至990×622px。小于2px的比例差不作精确几何判断。
- 全景比较：`/tmp/crysound-blank-qa-light-final.jpg`、`/tmp/crysound-blank-qa-dark-final.jpg`。每张都在同一输入中并排呈现参考与实现。
- 聚焦比较：`/tmp/crysound-blank-qa-light-type.jpg`，对齐后的Logo、标题与说明；深色嵌入比较：`/tmp/crysound-blank-qa-embedded-after.jpg`。
- 原生页面截图：`/tmp/crysound-blank-light-final.jpg`、`/tmp/crysound-blank-dark-final.jpg`。空白模式：`/tmp/crysound-blank-no-title.jpg`。

## 比较历史与修复

1. 第一轮：`/tmp/crysound-blank-qa-light-first.jpg`、`/tmp/crysound-blank-qa-dark-first.jpg`。
   - [P2，已修复] 浅色波峰进入标题区。浅色波面下移6%，标题区恢复留白；没有拉伸或重绘素材。
   - [P2，已修复] Logo/标题整体偏下、页脚偏上；原独立页面还继承文档边距。上下内距改为4cqw，保留5cqw左右内距；独立预览移除文档容器内距，维持16:10。
   - [P2，已修复] 标题字重和深色波面亮度偏强。标题采用系统medium，深色素材透明度72%，浅色90%。修复后全景及标题聚焦比较见上方最终证据。
2. 第二轮：在Ocean客户主题的深色文档中嵌入深色画布。
   - [P1，已修复] 文档的全局标题规则覆盖画布标题，形成深底深字。证据：`/tmp/crysound-blank-qa-embedded-before.jpg`。
   - 修复：仅在`.brand-blank-copy`局部绑定`--cs-text-heading:var(--blank-fg)`，避免主题属性的加载顺序覆盖。深色标题计算值恢复`rgb(255,255,255)`，浅色恢复`rgb(23,0,87)`。修复后并排证据：`/tmp/crysound-blank-qa-embedded-after.jpg`。

## 必查视觉表面

- 字体：沿用项目苹方优先系统字体；标题medium、4cqw/1.2行高，最大64px，移动端至少28px；说明最大28px。聚焦比较中未发现断字、截断或不可读层级。与参考的字面宽度/抗锯齿细微差异保留为P3。
- 布局：Logo、文案和页脚左对齐，右侧保留留白；装饰跨下半部。独立画布16:10，嵌入和独立实现复用同一组件。320px下导航换行，页面实测`scrollWidth === innerWidth === 320`。
- 色彩：深底使用既有Brand900 `#170057`，白色标准Logo与白字；浅底由既有Brand50和白色表面混合。Ocean明暗主题下外围控件继续继承主题，品牌画布有意固定CRYSOUND配色。
- 素材：Logo直接复用项目标准SVG。两张1586×992透明PNG由Image Gen参照截图生成，不使用手绘SVG、CSS形状或整板截图代替波面。原始点位/点径/行列不可从评审截图恢复；本次是品牌空白页适配，不是原v10几何文件的逐点复刻。波面密度及局部青色亮点仍有细微差别，作为明确的P3素材深化项。
- 内容：保留“让声音被看见”“声学测量与分析”；页脚采用产品可用的品牌说明，移除评审版本名与“概念静态帧”等说明。没有虚构数据或业务操作。

## 交互、响应与验证

- 已通过浏览器验证：样板库第五项→展开样板→返回样板库，浅/深色切换，显示/隐藏标题。隐藏后Logo、波面和页脚保留，可访问标题仍存在。
- 已测试320×900小屏的明暗/空白模式：`/tmp/crysound-blank-mobile-light.jpg`、`/tmp/crysound-blank-mobile-empty.jpg`。Logo与正文可读，装饰允许响应式取景；无横向页面溢出。
- 已验证默认CRYSOUND明暗及Ocean明暗文档环境；浏览器捕获的error日志为空。结束时恢复CRYSOUND浅色和默认视口，保留独立页面预览。
- 使用共享Button/Switch及原生链接，保留键盘与焦点语义；图案无动画且不进入辅助技术读序。专项测试覆盖配色按钮Space操作、标题开关、素材/Logo切换及独立入口。
- `npm run check`通过，47个测试文件、217项测试通过；Registry、样式规范、类型与生产构建通过。

## 后续精修与验收

无剩余可操作的P0/P1/P2。若后续提供原始波面资产，可替换生成PNG以达到逐点一致；不影响当前空白页使用。

- [x] 明暗画布与品牌标准Logo
- [x] 可隐藏标题的空白模式
- [x] 样板库与独立页面入口
- [x] 桌面、窄屏、客户主题和标题对比度
- [x] 浏览器视觉复核、交互与完整检查

final result: passed
