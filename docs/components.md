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
