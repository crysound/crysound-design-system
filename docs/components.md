# 组件 API 与业务边界

所有组件通过 `@crysound/ui` 导出，样式独立导入。基础 HTML 属性原样传递；Button 与 Input 支持 ref。

| 组件 | 关键属性 | 规则 |
| --- | --- | --- |
| Button | variant: primary / secondary / ghost / danger；loading；disabled；onClick | 默认 type=button；表单提交显式设 type=submit；loading 阻止重复点击 |
| Input | label（必填）；hint；error；value；onChange | 标签与错误说明通过 ID 关联；业务验证由调用方提供 |
| StatusBadge | status: online / offline / warning / error / running；children | 可覆盖显示文字；始终保留文字，不单靠颜色 |
| Card | title；description；actions；children | 内容区组件自行选择合适 padding；标题是 h3，应用负责整体标题层级 |
| Metric | label；value；unit；note | 单位和采集时间由业务层提供；无效值传入“—”，不要用 0 代表断连 |
| EmptyState | title；description；action | 为用户提供具体下一步；数据加载失败应由业务层明确说明 |
| Dialog | trigger；title；description；children | trigger 应是可接收 ref 的单个按钮元素；支持 Escape、焦点限制与恢复；这是非受控基础弹窗 |
| DeviceTable | devices；onSelect | 提供 id/name/model/status/location；onSelect 缺省时隐藏操作列；空数组显示空状态 |

DeviceTable 保留少量设备展示 API；新增 DataTable 支持本地搜索、排序、分页与跨页选择。大量数据仍需服务端分页或虚拟滚动。Dialog 关闭按钮目前为中文，国际化 API 留待下一版本。

## 应用级主题

主题放在 html 根元素，保证浮层 Portal 也继承 CSS 变量。

```tsx
// 由应用设置；服务端渲染应用建议直接在 html 输出这些属性。
document.documentElement.dataset.theme = 'dark';
document.documentElement.dataset.density = 'compact';
document.documentElement.dataset.customer = 'ocean';
```

软件浅色模式可额外设置 `data-context="software"` 使用 Figma 中的 Slate 表面灰阶。不要把客户主题等同于数据访问权限，权限和租户隔离属于业务层。


## 0.2.0 扩展 API

完整 33 类组件的参数、示例与使用约定位于文档站；静态索引源是 apps/docs/src/catalog.ts。新增组件按职责拆分为 forms、navigation、overlays、display、toast、data-table 模块，并通过包入口统一导出。

- 表单：Textarea/Select 继承原生属性并关联 label/hint/error；Checkbox/Switch/RadioGroup/Slider 继承 Radix 的受控与默认状态属性。
- Combobox：单选搜索，options 为 value/label/disabled，支持 value/onValueChange 和 defaultValue。
- FileUpload：接收 accept、multiple、maxSize（字节）与 onFilesChange；只选择文件，不上传。
- 浮层：Tooltip、Popover、DropdownMenu、Sheet、AlertDialog。触发器必须是支持 ref 的单个元素；Button 可直接使用。
- AlertDialog：onConfirm 返回 Promise 时进入 pending，阻止重复提交与关闭；拒绝时保留上下文并显示错误。
- DialogRoot/Trigger/Content/Title/Description/Close：用于自定义受控表单与多步骤业务流程。
- ToastProvider/useToast：应用级非阻断通知，支持关闭、时长与辅助操作；最多保留 5 条。
- DataTable<T>：columns 的 accessor 提供搜索/排序原始值，cell 可自定义展示；getRowId 必须稳定且唯一。选择范围为当前页，已选状态跨页保留。
- 新增 Badge、Avatar、Alert、Progress、Skeleton、Separator 共享主题 Token。Progress value=null 表示未知完成度。

Input与Textarea在鼠标或键盘聚焦时显示主色边框和浅色外环，失焦后恢复；外环不占据布局空间。错误状态同步使用`--cs-danger-fg`，禁用控件不获得焦点。外环按用户后续反馈收细为1px，颜色为当前主色或错误色的12%混合，混合比例属于依据用户参考图的工程适配值；根级明暗与客户主题通过语义变量继承。强制颜色模式改用系统Highlight实线焦点框。

Textarea在支持悬停的设备上，未聚焦时悬停显示1px主色边框与1px浅色外环；外环宽度按用户要求设置，12%混合沿用聚焦外环的工程适配值。移出后恢复，聚焦后沿用上述聚焦样式；错误状态使用错误色，禁用项不显示悬停反馈。强制颜色模式使用1px系统Highlight外框。

Select在支持悬停的设备上使用主色边框与4px浅色外环（`--cs-space-1`）；键盘聚焦或菜单展开时也保留该反馈。收起且移出、失焦后恢复，禁用项不显示外环，错误状态沿用错误色。原生多选或分组选项的回退控件遵循同一规则；选项行为与Radix焦点管理不变。

## 文字接入约定

优先使用 Heading（level必填，variant为page/section/subsection）和 Text（body/lead/caption/label，tone为default/muted）。level决定HTML标题层级，variant决定视觉大小；不要为字体大小跳级。body默认14/22，长说明lead16/26，caption12/18；数字为工程建议，不来源于Claude截图。Text默认p，可as=span/div，label只是视觉角色，表单关联由Input等组件负责。组件内部不要额外覆盖font-size、line-height、font-weight；外部布局使用gap。密度不自动缩小这些内容文字角色，控件密度继续独立维护。导入tokens.css后再导入styles.css，Portal主题设在html。

验收需覆盖长中文/英文、200%缩放、窄屏、明暗和客户主题、表单错误说明；组件样式不依赖文档站CSS。旧原始字号Token仍保留兼容，不推荐消费项目任意组合所有档位。

文字角色已进入共享组件默认样式：表单label使用medium，提示/错误说明与表格元数据使用caption；表格正文、浮层说明、Accordion内容、Tabs面板和Alert描述使用body；菜单、Tabs触发器与树项目使用control（按密度14px，行高20px）。登录标题与SectionHeader lg为page；普通弹窗、Sheet和SectionHeader md为section，卡片与SectionHeader sm为subsection。图表、视频、头像和测量数字的专用排版保留。

Charts默认使用适中密度网格：纵轴主刻度之间补一条浅线，横轴仅在足够宽时补少量辅助线。纵轴刻度按至少44px、数值横轴按至少72px间距抽稀，保留首尾，不改变数据坐标或yDomain；yStep为候选刻度间隔，不保证每档都显示。minorGrid=false可关闭辅助网格；分类标签随宽度减少。

## 八档字号与场景 · 2026-10-16

用户确认采用12/14/16/18/20/24/30/36基础字号。此条覆盖此前page28/36及compact13px提案：page现为24/32，紧凑控件保持14/20。新增Heading display36/44（官网页面/首屏）、marketing-section30/40（官网区域）、Text intro18/28（重点导语）。官网卡片可用page、阅读正文用lead16/26；工作台section20/28、subsection16/24、body14/22、label14/20、caption12/18。行高、中文行宽及段长仍为工程建议，不宣称第三方官方参数或已完成全部产品验收。

Accordion 动效参考 Claude Design 官网 FAQ（2026-10-16 实测）：内容采用 grid 行高与透明度400ms同步过渡；加号竖线250ms旋转90度并淡出，形成减号；曲线 cubic-bezier(.165,.84,.44,1)。保留 Radix 单项展开、键盘与禁用行为；收起内容 inert / aria-hidden，不可聚焦。减少动态效果时立即切换，不复制官网字体和展示尺度。

Accordion 的动画容器与 Radix 尺寸测量节点分离，避免尺寸读取临时清除 transition 时长导致跳帧；保持相同的400ms曲线并允许中途反向切换。

## LinkGroup 链接组

官网页脚和链接目录使用共享LinkGroup，label为可访问分组名，items接受原生链接属性。悬停一项时仅同组其他项切换为cs-muted，当前项保持cs-text；颜色200ms ease，不缩放、位移、加粗。此为参考Claude Design官网反馈方式的CRYSOUND适配，分组淡化不宣称完全复刻其实现。键盘显示焦点环，不触发全组淡化；触摸保持正常文字，减少动态效果取消过渡，增强对比度取消淡化。每组独立，禁止应用于状态、错误和关键工作台操作。

## 边界组合规则（已落实共享组件）

Card默认outlined且无阴影；页面分组使用variant="plain"（标题和留白），嵌入分组可用variant="inset"（浅表面，无闭合边框）。CardBody提供内容间距，CardActions仅使用顶部单向分隔线。Toolbar为有名称的操作分组，ToolbarButton默认ghost并保留Button全部加载、禁用及键盘语义；关键次级操作显式variant="secondary"。不根据DOM父容器强制取消Input或Secondary按钮边框。阴影只在独立浮层或显式shadow属性时使用，内容卡片不默认抬升。

```tsx
<Card title="账号管理" variant="plain">
  <CardBody>
    <Card title="工作账号 A">
      <CardBody>额度与状态</CardBody>
      <CardActions><Toolbar label="账号操作"><ToolbarButton>查看用量</ToolbarButton></Toolbar></CardActions>
    </Card>
  </CardBody>
</Card>
```

## 原子交互反馈 · 2026-10-16

Button按压缩放0.98，使用120ms恢复过渡，替代向下1px位移；禁用/加载不触发。Dialog、Popover、Dropdown及Select浮层采用200ms成对进出与遮罩淡入淡出，由Radix Presence管理退出生命周期，保持原焦点与关闭行为。附件行仅在新增挂载时200ms淡入，使用文件名/大小/修改时间稳定标识，删除前项或更新进度不重播其他附件。减少动态效果取消上述动画及按压缩放。常规文字不添加模糊与逐字揭示，静态卡片不添加抬升。参数为CRYSOUND适配建议。

## 共享组合模板

FilterToolbar（受控搜索、筛选插槽、重置回调）、QuotaCard（ready/loading/error/empty、未知额度、重试与操作区）、DetailPanel（原生dl字段、安全换行）、FormDialog（原生表单验证、异步提交、错误重试、取消和Radix焦点返回）均从@crysound/ui导出。API与业务验证由消费项目提供；FormDialog取消不代表取消业务请求，消费方需要时自行使用AbortController。旧提交结果不会关闭重新打开的弹窗。额度输入为0–100百分比，null/非有限值显示未知，不伪装为0%。基础规范“组合与验收”提供可操作演示、布局/长内容规则、状态主题清单、导入顺序、圆角迁移状态与动效使用表。

ToolbarButton的Ghost默认采用中性正文色和medium字重，悬停时才增强；不与品牌主操作争抢注意力。QuotaCard使用20px内容边距、12px辅助说明，演示状态控件放在卡片外，不作为业务操作区。

## 表格长标题

DataTable的columns.cell可返回TableCellText，标题用body14/22常规字重，description放caption12/18；卡号独立列后不重复拼入标题。共享表格使用较轻分隔线、中性排序按钮与等宽数字。必要任务说明不截断；同一状态行不要同时使用粗体标题、品牌底块和高对比分割线。运营排程示例依据截图改编，未访问需登录的内部数据或部署到ops站点。

## 指标组与组合说明

MetricGroup以原生dl组织多个指标，items提供稳定id、label、value、unit、note；未知值用null。标准数值30/40、紧凑24/32，标签14/20、单位与备注12/18，数值medium并启用tabular-nums；全组共用一个表面和弱分隔线，不为每项再套Card。容器宽度决定5/3/2/1列，一组建议3–5项；无备注保留行位，长标签和数值自然换行，移动端不缩小单位来硬挤。阈值、成本估算、币种格式及数据统计由消费项目提供。

参考社区open-claude-ui第一篇的表面、边界、文字角色思路及第八篇等宽数字约束；该仓库没有此业务指标组，不宣称Claude官方参数或同款组件。基础规范组合说明和Checkbox独立文档补充首行对齐、说明位置、组内间距与避免重复Card等规则。

## 资源链接卡片

ResourceCard与ResourceCardGroup参考https://claude.com/product/claude-code资源区（2026-10-16读取当前CSS）：原卡片24px圆角、32px内距，颜色200ms / 背景与阴影500ms ease；组hover时非hover卡片背景透明；全局focus-visible为2px实线+2px偏移。CRYSOUND适配为20px圆角、24px内距、20/28标题，采用语义表面与焦点色；键盘焦点也可触发组内表面退后，属于适配扩展。保持一个原生链接覆盖整卡，不嵌套交互元素，不给普通Card增加悬停抬升。减少动态效果与强制颜色有降级。


## 连续卡片边界

outlined卡片的四边由 `.cs-card[data-variant="outlined"]` 明确维护，不根据first-child、nth-child或所在行取消边框。plain/inset继续保持无边框；这不是对消费项目任意CSS的强制隔离。

分隔线应限定在列表、表格或CardActions内部，避免全局 `section:first-child { border-top:0 }` 等规则命中整张卡片。网格使用gap，不用负margin拼接闭合卡片；排查父容器overflow、绝对定位层、白色遮罩及尺寸计算。不要用额外outline或伪元素叠画边框掩盖来源。

验收连续卡片的首项、换行首项、长说明与空说明，检查四个圆角和四边。截图只能定位现象；消费页仍需检查实际computed style及遮挡元素，不能仅凭截图确认根因。


工作台页面底色使用 --cs-bg（light/software为#f8fafc），内容卡片使用 --cs-surface（白色）；--cs-subtle用于局部辅助区域。不要把Slate 200或更深的控件灰色铺满整个工作区，也不要通过加深背景代替分组。接入应用如仍使用硬编码#e2e8f0，需改为语义令牌才能同步本调整。

按钮默认md高度按用户要求改为36px，使用独立的cs-button-height语义Token；紧凑密度保留32px。sm/lg及移动触摸场景继续由显式尺寸约束，输入框等表单控件不随按钮调整。

## Checkbox 勾选动效

参考用户指定的 HeroUI Checkbox Button Group 公开演示交互，独立实现共享 Radix Checkbox 指示器。用常驻、aria-hidden 的 SVG 对号和横线路径替代文字字形；选中时绘入并淡入，取消时反向收回并淡出，使用现有 `--cds-dur-base`（200ms）与 `--cds-ease-out`。CSS transition 可在快速切换时从当前显示值反向，不延迟实际 checked 状态。不复制商业组件源码，也不引入动画依赖。`prefers-reduced-motion: reduce` 取消路径、缩放及透明度过渡；受控/非受控、部分选中、禁用、键盘、表单提交与 reset 保持 Radix 语义。


## 桌面仪器布局适配

Select的`hideLabel`只隐藏视觉标签，保留可访问名称与原生select表单语义。TabsList的`tone="brand"`为显式品牌实心选中项，默认tone不变。LineChart的`variant="instrument"`压缩外边距、采用直角与顶部图例；`emptyLabel`可明确未采集或断连状态，加载语义与键盘读数保持。均为兼容新增属性，消费项目仍负责数据和硬件流程。

## 呼吸加载动画

LoadingIndicator新增`variant="pulse"`，使用系统品牌/中性语义色、3秒轻微缩放与光晕呼吸。`animate=false`及系统减少动态效果均关闭循环，保留图形与任务文字；`role=status`只宣读任务标签，装饰图形不重复播报。参考社区Open Claude UI的呼吸状态灯方向，尺寸与光晕是CRYSOUND工程适配，不宣称Claude官方参数。原有spinner/ring/dots默认与API保持兼容，详见[加载指示器](./loading-indicator.md)。

按用户要求新增`variant="logo"`，嵌入公司标准图形标志的原始矢量路径。四边依次明暗、中心常驻，2.4秒循环；Logo与文字同步呼吸，暂停和减少动态效果恢复完整静态Logo。与图库默认封面复用内部CrysoundMark，不依赖文档站资产URL，沿用现有尺寸、配色和可访问状态契约。
