import { ResourceCard, ResourceCardGroup } from '../../../packages/ui/src/index';
export function ResourceCardDemo() {
  return <ResourceCardGroup label="技术资源"><ResourceCard href="#installation" title="安装与接入" source="开发文档"/><ResourceCard href="#foundations" title="基础规范与组合规则" source="设计规范"/><ResourceCard href="#templates" title="测量任务组合与样板" source="产品指南"/><ResourceCard href="#component/checkbox" title="表单控件与键盘操作" source="组件说明"/><ResourceCard href="#component/line-bar-charts" title="声学图表与数据展示" source="组件说明"/><ResourceCard href="https://github.com/ya7881/crysound-design-system" title="源码与接入示例" source="GitHub" external/></ResourceCardGroup>;
}
