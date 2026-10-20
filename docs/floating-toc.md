# FloatingToc 悬浮目录

参考用户提供的本地 OpenTest FFT 页面 `/modules/fft/` 的真实 CSS 与交互：默认8×1px短刻度，当前14×2px；悬停/键盘聚焦展开为32/26/20/14px，按距离使用文字、次级文字及边框色。单项16px高，标题14/20；滚动后当前标题显示6秒。这里是共享组件适配，不宣称全页设计稿像素一致。

```tsx
const chapters = [
  { id: 'overview', label: 'Overview' },
  { id: 'analysis', label: 'Analysis mode' },
];
<FloatingToc items={chapters} offset={88} />
<section id="overview">…</section>
<section id="analysis">…</section>
```

- `items` 的 id 必须唯一、与真实章节对应；标签使用准确标题，不用行号代替可访问名称。空数组不显示导航；disabled 项无导航入口。缺失目标不会执行跳转。
- `activeId/onActiveChange` 可受控；省略时组件自动跟随滚动。使用 `aria-current="location"` 标识当前位置，刻度长短和粗细提供非颜色提示。
- `scrollContainerRef` 指定有独立滚动条的容器，省略时监听页面滚动。`offset` 为目标顶部留白，需匹配真实固定页头；组件不改 URL，避免覆盖消费项目的 hash 路由。
- `position="fixed"` 默认 top170px，left根据1200px内容区域计算。通过 `style` 中的 `--cs-toc-top`、`--cs-toc-left`、`--cs-toc-mobile-top` 适配页面；`inline` 供消费方放入自己的定位容器。
- 900px以下或触屏，改用共享 Select 的章节选择器，点击区至少44px；fixed 模式变为 sticky。应放在文档流中的内容区域前，不放在带 transform/overflow 裁切的父容器中。
- 导航使用原生链接 Tab/Enter；选择器复用既有 Radix 键盘与焦点行为。滚动不抢焦点；减少动态效果时跳转立即完成，刻度与标签无过渡。
- 章节、国际化、内容权限由消费应用提供。位置更新不接入业务API；内容动态增加或移除时同步更新 items。消费应用应对不再显示的当前章节同步受控 activeId。
- 配色继承语义 Token，深色及客户主题无需复制组件 CSS。不要用品牌 Logo 或图片代替章节标签。
