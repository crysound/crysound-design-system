import { useState } from 'react';
import { HelpCircle } from '@untitledui/icons';
import { InlineCTA } from '../../../packages/ui/src/index';
function ReportPreview() {
  return <svg className="cta-report-preview" viewBox="0 0 240 180" role="img" aria-label="测量报告模板预览">
    <rect width="240" height="180" fill="var(--cs-subtle)"/>
    <rect x="42" y="18" width="156" height="162" rx="5" fill="var(--cs-surface)" stroke="var(--cs-border)"/>
    <text x="56" y="40" fill="var(--cs-text-heading)" fontSize="10" fontWeight="var(--cs-weight-semibold)">声学测量报告</text>
    <path d="M56 49H184" stroke="var(--cs-border)"/>
    <text x="56" y="67" fill="var(--cs-muted)" fontSize="7">声压级</text>
    <text x="56" y="87" fill="var(--cs-text)" fontSize="19" fontWeight="var(--cs-weight-medium)">68.4<tspan fontSize="7" dx="5" fill="var(--cs-muted)">dB SPL</tspan></text>
    <path d="M56 104H184M56 121H184M56 138H184" stroke="var(--cs-border)" strokeWidth=".5"/>
    <path d="m56 129 12-5 12 4 12-17 12 7 12-13 12 8 12-19 12 13 12-5 12 6 8-10" fill="none" stroke="var(--cs-brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M56 154H111M56 161H143" stroke="var(--cs-border)" strokeWidth="3" strokeLinecap="round"/>
  </svg>;
}
export function InlineCTADemo() {
  const [message,setMessage]=useState('');
  return <div className="inline-cta-demo"><InlineCTA shadow="sm" title="全新测量报告已上线" description="统一报告格式，让团队更高效地整理与交付测量结果。" media={<ReportPreview/>} primaryAction={{label:'配置模板',onClick:()=>setMessage('已触发配置模板示例。')}} secondaryAction={{label:'了解更多',onClick:()=>setMessage('已触发了解更多示例。')}} /><InlineCTA tone="brand" title="需要定制检测流程？" description="联系技术团队，了解 CRYSOUND 产品集成方案。" primaryAction={{label:'查看产品模式',href:'#patterns'}} secondaryAction={{label:'稍后再说',onClick:()=>setMessage('已选择稍后再说。')}} dismissible onDismiss={()=>setMessage('提示已关闭。')} /><InlineCTA title="配置尚未完成" description="演示加载与禁用操作状态。" icon={<HelpCircle size={24}/>} primaryAction={{label:'保存配置',loading:true}} secondaryAction={{label:'取消',disabled:true}} /><p className="cs-help" role="status">{message||'操作仅为组件演示，不发送请求。'}</p></div>;
}
