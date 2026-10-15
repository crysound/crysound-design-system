import { useState } from 'react';
import { HelpCircle } from '@untitledui/icons';
import { InlineCTA, InlineCTASkeleton } from '../../../packages/ui/src/index';
function ReportPreview() {
  return <svg className="cta-report-preview" viewBox="0 0 280 200" role="img" aria-label="声学报告预览：声压级 68.4 dB SPL，频率响应曲线">
    <rect width="280" height="200" fill="var(--cs-surface)"/>
    <text x="24" y="29" fill="var(--cs-muted)" fontSize="9">声压级 · SPL</text>
    <text x="24" y="63" fill="var(--cs-text-heading)" fontSize="30" fontWeight="var(--cs-weight-medium)">68.4</text>
    <text x="95" y="62" fill="var(--cs-muted)" fontSize="9">dB SPL</text>
    <rect x="205" y="19" width="51" height="18" rx="9" fill="var(--cs-selected-bg)"/>
    <text x="230.5" y="31" textAnchor="middle" fill="var(--cs-brand)" fontSize="8">CH 01</text>
    {[94,119,144].map(y=><path key={y} d={`M24 ${y}H256`} stroke="var(--cs-border)" strokeOpacity=".55" strokeWidth=".5"/>)}
    <path d="M24 145C40 145 44 132 58 128S80 117 94 120S115 130 131 116S149 97 165 103S185 121 201 109S231 94 256 98" fill="none" stroke="var(--cs-brand)" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M24 145C40 145 44 132 58 128S80 117 94 120S115 130 131 116S149 97 165 103S185 121 201 109S231 94 256 98V157H24Z" fill="var(--cs-brand)" opacity=".035"/>
    <text x="24" y="174" fill="var(--cs-muted)" fontSize="8">20 Hz</text>
    <text x="140" y="174" textAnchor="middle" fill="var(--cs-muted)" fontSize="8">1 kHz</text>
    <text x="256" y="174" textAnchor="end" fill="var(--cs-muted)" fontSize="8">20 kHz</text>
  </svg>;
}
export function InlineCTADemo() {
  const [message,setMessage]=useState('');
  return <div className="inline-cta-demo"><InlineCTA shadow="sm" title="全新测量报告已上线" description="统一报告格式，让团队更高效地整理与交付测量结果。" media={<ReportPreview/>} primaryAction={{label:'配置模板',onClick:()=>setMessage('已触发配置模板示例。')}} secondaryAction={{label:'了解更多',onClick:()=>setMessage('已触发了解更多示例。')}} /><InlineCTA tone="brand" title="需要定制检测流程？" description="联系技术团队，了解 CRYSOUND 产品集成方案。" primaryAction={{label:'查看产品模式',href:'#patterns'}} secondaryAction={{label:'稍后再说',onClick:()=>setMessage('已选择稍后再说。')}} dismissible onDismiss={()=>setMessage('提示已关闭。')} /><InlineCTA title="配置尚未完成" description="演示加载与禁用操作状态。" icon={<HelpCircle size={24}/>} primaryAction={{label:'保存配置',loading:true}} secondaryAction={{label:'取消',disabled:true}} /><InlineCTASkeleton media shadow="sm" /><p className="cs-help" role="status">{message||'操作仅为组件演示，不发送请求。'}</p></div>;
}
