# 源码安装与共享组件包

## 源码 Registry

运行 `npm run dev`，在已完成 shadcn 初始化的 React 项目中执行：

```sh
npx shadcn@latest add http://127.0.0.1:5173/r/crysound-ui.json
```

如果本地服务使用其他端口，以页面显示的安装命令为准。安装清单也保存在 `apps/docs/public/r/crysound-ui.json`。未配置可公开访问的托管服务；GitHub 仓库保持私有，不要把私有源码的 raw URL 当成匿名可安装的地址。

文件安装到 `components` 别名所指目录下的 `crysound/ui` 和 `crysound/tokens.css`，不会覆盖同名 shadcn 基础组件。按项目实际别名导入：

```tsx
import { Button, Select } from '@/components/crysound/ui';
import '@/components/crysound/tokens.css';
import '@/components/crysound/ui/styles.css';
```

适用于需要由客户项目独立维护源码的交付。后续升级应审查差异，避免覆盖客户自定义内容；不要在没有审查的情况下自动覆盖所有文件。

## 组件包

```sh
npm run build
npm pack -w @crysound/tokens
npm pack -w @crysound/ui
```

把生成的两个 tarball 安装到目标项目。UI 包声明 React 19 peer dependency，并包含完整类型与样式。包尚未发布到 npm，不能直接使用不存在的公开包版本。

## 安装清单维护

- `npm run registry:build` 从实际组件源码和 package.json 生成清单；不要手改生成 JSON。
- `npm run registry:check` 使用本地保存的官方 JSON Schema，检查清单格式、文件内容同步与相对导入完整性。
- 原始 Schema 来源：https://ui.shadcn.com/schema/registry-item.json，保存于 `scripts/schemas/registry-item.json`，避免 CI 依赖在线抓取。
- 新增源文件必须正确导出，使用相对导入，不依赖当前工作区独有的路径别名。
