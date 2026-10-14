import { useState } from 'react';
import { HelpCircle } from '@untitledui/icons';
import { InlineCTA } from '../../../packages/ui/src/index';
export function InlineCTADemo() {
  const [message,setMessage]=useState('');
  return <div className="inline-cta-demo"><InlineCTA title="全新测量报告已上线" description="配置报告模板，统一团队的结果交付方式，让测量数据更有价值。" media={<img src="/video-poster.svg" alt="声学测量波形预览"/>} primaryAction={{label:'配置模板',onClick:()=>setMessage('已触发配置模板示例。')}} secondaryAction={{label:'了解更多',onClick:()=>setMessage('已触发了解更多示例。')}} /><InlineCTA tone="brand" title="需要定制检测流程？" description="联系技术团队，了解 CRYSOUND 产品集成方案。" primaryAction={{label:'查看产品模式',href:'#patterns'}} secondaryAction={{label:'稍后再说',onClick:()=>setMessage('已选择稍后再说。')}} dismissible onDismiss={()=>setMessage('提示已关闭。')} /><InlineCTA title="配置尚未完成" description="演示加载与禁用操作状态。" icon={<HelpCircle size={24}/>} primaryAction={{label:'保存配置',loading:true}} secondaryAction={{label:'取消',disabled:true}} /><p className="cs-help" role="status">{message||'操作仅为组件演示，不发送请求。'}</p></div>;
}
