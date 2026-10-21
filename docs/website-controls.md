# 官网共享控件

四个组件从 `@crysound/ui` 导出，样式随现有 `styles.css` 提供。消费应用提供内容、链接、产品数据和导航动作；组件不请求接口、不处理账户或交易。

## IconButton

`label` 为必填的可访问名称；继承 Button 的 variant、size、disabled、loading、onClick 等属性，支持 ref。默认ghost轻量样式，使用中性色文字及悬停浅底；需要强调时显式设置primary。默认36px，sm28px，lg48px；触屏点击区至少44px。默认显示 Tooltip，可用 tooltip=false 关闭。

## NavigationMenu

items 由 `{id,label,href?,groups?,featured?}` 构成；groups 是 `{title,links:[{label,href,description?}]}`。分组项使用 Radix Popover 展开，其余为普通链接。支持 Tab、Enter/Space、Escape、点击外部关闭以及焦点返回。内容保留在主题树内，继承 data-theme、data-customer 和语义变量。移动端面板按列堆叠并独立滚动。

## Carousel

items 是 `{id,label,content}`。value/onValueChange 支持受控使用，defaultValue 支持非受控；默认 loop=true、pagination=true、autoPlay=false、interval=5000。无数据展示空状态，单项隐藏切换控制。聚焦轮播本体时支持左右方向键，分页支持 Home/End。自动播放至少1000ms间隔，提供播放/暂停；悬停临时暂停，键盘聚焦停止，页面隐藏时暂停，减少动态效果时禁用自动切换。非循环模式到末项停止，卸载时清理定时器。默认保留各页内容并使用300ms连续轨道平移；目标图片加载、解码后再展示，非当前页使用aria-hidden和inert，减少动态效果时直接切换。不提供虚拟化。

`draggable` 默认关闭，通过 `<Carousel draggable loop={false} … />` 开启鼠标和触摸拖动。整页模式内容按实际指针距离跟随，松手后按距离与短时速度投影切换一组；拖动停在首末页，边界有阻尼。按下时从当前呈现的轨道位置继续，提前加载相邻页，目标图片尚未就绪时保留拖动后的画面。横向意图超过8px才捕获指针，纵向滑动和双指缩放留给页面；表单和按钮不接管。拖动产生的点击会被拦截，短点击与键盘链接仍正常；取消或丢失捕获时回到当前页。直接拖动后停止自动播放，减少动态效果时取消松手过渡。阈值、速度投影和阻尼为工程适配建议，不宣称原生系统参数。

`itemsPerView` 默认1，维持上述整页轮播行为。设置为4时开启连续卡片轨道：桌面最多4张，轨道容器≤1100px时最多2张、≤640px时1张，间隔复用24px空间变量。每个item仅提供一张卡片，拖动松手对齐最近卡片，长距离拖动可跨多张；支持触控板横向滚动和Shift+滚轮，停止140ms后吸附，普通纵向滚动与Ctrl缩放不拦截。首末位置对应原始卡片，尾部只补足当前可见数量所需的副本；辅助技术与Tab顺序仅暴露当前可见卡片，避免重复入口。切换等待整个目标可见范围内图片就绪，容器缩放后重新测量步距并保留当前卡片。

官网Solutions与Blogs使用`<Carousel draggable itemsPerView={4} loop={false} … />`，各卡片复用MediaGallery，保留系统字体、原有内容与Dialog。行为对照用户本地`官网-全新改版/js/main.js`的Solutions/Blogs轨道实现：直接跟随、最近卡片吸附、横向wheel及Shift+wheel；卡片轨道的560ms缓动采用该项目`.solution-track`/`.blog-track`参数。没有修改源官网工程。

## MediaGallery

images 是 `{id,src,alt,thumbnail?,caption?}`，alt 必填。支持受控与非受控索引，复用 Carousel 的切换行为；缩略图可点击并支持方向键与 Home/End。放大使用现有 Radix Dialog，关闭后焦点回到入口。图片请求失败展示重试入口；切换图片后独立处理错误。图库不自动播放，不执行图片上传或远程处理。

文档示例采用当前 CRYSOUND 样板中已授权的本地产品素材，只用于展示组件，不声明同一产品的多角度实拍。

轮播文档与品牌样板统一复用OfficialBanner内容组合，使用原官网的四组文案、产品图片、阴影和比例。共享Carousel提供切换状态、键盘与播放行为；controlsClassName/paginationClassName用于摆放原版覆盖式控件，previousLabel/nextLabel用于本地化入口名称。此样板第四组仍为静态产品图，不包含原站3D运行时。

NavigationMenu参照用户指定的线上官网导航更新：brand/actions提供品牌与工具区域；catalog布局包含大类、子分类、产品网格和底部入口，links[].products与groups[].products控制相应内容。默认columns仍支持资源类的分组链接。面板与整个导航栏对齐，以本地主题变量呈现选中态和卡片边界。导航数据由消费应用提供，组件不处理商城或业务请求。

2026-10-21 对照用户本地“官网-全新改版”导航更新品牌官网样板：保留Products、Solutions、Resources、Support、Contact、About Us、Shop的次序；采用72px顶栏和居中1380px菜单内容区。Products使用原项目5类、28个二级目录及对应产品导航图；Solutions保留行业/应用两级筛选与27张入口卡片；其余三个大菜单使用原项目的图片入口。只复制本次导航引用的本地素材至`scene-assets/navigation/`，未修改原官网工程。文字沿用系统字体；颜色与阴影使用语义变量。固定网格在窄桌面容器内采用比例列，属于工程适配，不宣称所有宽度均为逐像素复刻。

共享NavigationMenu新增可选`layout="cards"`、`links`图片入口、链接`media`插槽、`catalogLabels`以及`neutralInitialSelection`；`activateOnHover`在指针停留180ms后切换分类，离开或卸载取消，触摸继续点击选择，默认仍为点击。`collapsible`显式启用以自身1200px容器为界的手机导航；使用Radix Popover管理打开、外部点击、Escape与焦点返回，目录使用原生details/summary。跨越断点会关闭当前菜单，嵌入1714px设计画布仍按画布实际宽度展示桌面导航。商城、账号与搜索保留原样板的本地演示边界，导航目标使用原项目提供的官网地址。

MediaGallery 的四种官网卡片、容器断点、缺字段占位和交付验证遵循 [官网卡片使用规则](./media-gallery.md)。该规则区分默认图片封面与数据空状态，不允许用虚构数据补齐卡片。

## 官网胶囊标签留白

品牌官网胶囊分类标签采用16px字号（`--cs-text-md`）、1.5行高与400常规字重，组件示例与官网样板一致；常规圆角Tabs继续使用默认控件文字角色。每项最小宽度80px（`--cs-space-20`，本次工程适配值），短标签如“All”保持舒展的胶囊比例，长标签按内容扩展；横向空间不足时滚动，不挤压选项。

`TabsList variant="pill" shape="capsule"` 的底槽内边距统一使用 `--cs-space-1`（4px）。首项选中时，上、左、下留白相等；末项对应上、右、下相等。胶囊选中表面使用无方向偏移的轻阴影，避免向下偏移的阴影压缩底部视觉留白；2px模糊与12%文字色混合为工程适配值。静态选中项与动画指示器共享该规则，不叠加两层阴影；常规圆角标签沿用原阴影，品牌实心tone仍无阴影。
