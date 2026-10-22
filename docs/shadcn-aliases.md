# shadcn 语义别名映射

`@crysound/tokens/theme.css` 从 `tokens.json` 生成以下 shadcn 兼容变量。亮色与暗色选择器都只通过 `var()` 指向已有 CRYSOUND token，不复制或新增颜色值。`@crysound/tokens/tailwind.css` 再用 Tailwind CSS v4 的 `@theme inline` 暴露相应 utility 命名空间。

| shadcn 别名 | CRYSOUND 来源 |
| --- | --- |
| background / foreground | `--cs-bg` / `--cs-text` |
| card、popover（及 foreground） | `--cs-surface` / `--cs-text` |
| primary / primary-foreground | `--cs-brand` / `--cs-on-brand` |
| secondary、muted | `--cs-subtle`；前景分别为 `--cs-text`、`--cs-muted` |
| accent / accent-foreground | `--cs-brand-subtle` / `--cs-brand` |
| destructive / destructive-foreground / destructive-soft | `--cs-danger` / `--cs-on-brand` / `--cs-danger-bg` |
| border、input、ring | `--cs-border` / `--cs-border` / `--cs-focus` |
| success / success-soft | `--cs-success` / `--cs-success-bg` |
| warning / warning-soft | `--cs-warning` / `--cs-warning-bg` |
| info / info-soft | `--cs-chart-channel-17` / `--cs-subtle` |
| chart-1…5 | `--cs-chart-channel-01`…`--cs-chart-channel-05` |
| sidebar | surface/text/brand/subtle/border/focus 的对应现有 token |
| radius | `--cs-radius` |
| font-sans / font-heading / font-mono | `--cs-font` |

## 待设计师确认

- 当前没有独立 info 色，临时引用已有蓝色通道 `--cs-chart-channel-17`；`info-soft` 暂用 `--cs-subtle`。
- 当前没有独立等宽字体 token。为避免引入未经确认的字体值，`font-mono` 暂时引用 `--cs-font`。
- destructive 前景暂无独立 token，当前引用已有 `--cs-on-brand`。需要在亮色与暗色危险背景上继续做对比度验收。
- sidebar、secondary 和 muted 暂时复用已有表面层级，不新增专属设计值。
