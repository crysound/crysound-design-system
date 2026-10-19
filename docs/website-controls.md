# 官网共享控件

四个组件从 `@crysound/ui` 导出，样式随现有 `styles.css` 提供。消费应用提供内容、链接、产品数据和导航动作；组件不请求接口、不处理账户或交易。

## IconButton

`label` 为必填的可访问名称；继承 Button 的 variant、size、disabled、loading、onClick 等属性，支持 ref。默认ghost轻量样式，使用中性色文字及悬停浅底；需要强调时显式设置primary。默认36px，sm28px，lg48px；触屏点击区至少44px。默认显示 Tooltip，可用 tooltip=false 关闭。

## NavigationMenu

items 由 `{id,label,href?,groups?,featured?}` 构成；groups 是 `{title,links:[{label,href,description?}]}`。分组项使用 Radix Popover 展开，其余为普通链接。支持 Tab、Enter/Space、Escape、点击外部关闭以及焦点返回。内容保留在主题树内，继承 data-theme、data-customer 和语义变量。移动端面板按列堆叠并独立滚动。

## Carousel

items 是 `{id,label,content}`。value/onValueChange 支持受控使用，defaultValue 支持非受控；默认 loop=true、pagination=true、autoPlay=false、interval=5000。无数据展示空状态，单项隐藏切换控制。聚焦轮播本体时支持左右方向键，分页支持 Home/End。自动播放至少1000ms间隔，提供播放/暂停；悬停临时暂停，键盘聚焦停止，页面隐藏时暂停，减少动态效果时禁用自动切换。非循环模式到末项停止，卸载时清理定时器。默认使用淡入过渡，不提供拖拽或虚拟化。

## MediaGallery

images 是 `{id,src,alt,thumbnail?,caption?}`，alt 必填。支持受控与非受控索引，复用 Carousel 的切换行为；缩略图可点击并支持方向键与 Home/End。放大使用现有 Radix Dialog，关闭后焦点回到入口。图片请求失败展示重试入口；切换图片后独立处理错误。图库不自动播放，不执行图片上传或远程处理。

文档示例采用当前 CRYSOUND 样板中已授权的本地产品素材，只用于展示组件，不声明同一产品的多角度实拍。

轮播文档与品牌样板统一复用OfficialBanner内容组合，使用原官网的四组文案、产品图片、阴影和比例。共享Carousel提供切换状态、键盘与播放行为；controlsClassName/paginationClassName用于摆放原版覆盖式控件，previousLabel/nextLabel用于本地化入口名称。此样板第四组仍为静态产品图，不包含原站3D运行时。

NavigationMenu参照用户指定的线上官网导航更新：brand/actions提供品牌与工具区域；catalog布局包含大类、子分类、产品网格和底部入口，links[].products与groups[].products控制相应内容。默认columns仍支持资源类的分组链接。面板与整个导航栏对齐，以本地主题变量呈现选中态和卡片边界。导航数据为代表性声学产品子集，不包含完整官网目录或商城逻辑。
