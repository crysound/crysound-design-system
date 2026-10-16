import { MetricGroup } from '../../../packages/ui/src/index';
export function MetricGroupDemo() {
  return <MetricGroup label="声学测量概览" items={[
    {id:'devices',label:'在线设备',value:8,unit:'台',note:'设备连接状态'},
    {id:'channels',label:'采集通道',value:'16 / 24',unit:'路',note:'已启用 / 总通道'},
    {id:'rate',label:'采样率',value:48,unit:'kHz',note:'当前采集配置'},
    {id:'duration',label:'测量时长',value:'12.5',unit:'分钟',note:'当前测量任务'},
    {id:'reports',label:'生成报告',value:6,unit:'份',note:'本次测试批次'},
  ]}/>;
}

export function StatusSummaryDemo() {
  return <section style={{width:'100%',minWidth:0}}><header style={{marginBottom:20}}><h3 style={{fontSize:'var(--cs-type-page-size)',lineHeight:'var(--cs-type-page-leading)',fontWeight:600,margin:'0 0 4px'}}>测量运行概览</h3><p className="cs-help" style={{margin:0}}>本次测试批次 · 演示数据</p></header><MetricGroup label="测量状态摘要" variant="summary" items={[
    {id:'tasks',label:'任务进度',value:2,unit:'项待完成',note:'本批次共 12 项测量任务'},
    {id:'connection',label:'设备连接',value:1,unit:'台待连接',note:'检查设备供电与通信线路',status:{label:'需处理',tone:'danger'}},
    {id:'storage',label:'存储占用',value:68,unit:'%',note:'剩余空间 32 GB'},
    {id:'review',label:'报告复核',value:3,unit:'份待复核',note:'请在导出前确认测量结果'},
  ]}/><p className="cs-help" style={{marginTop:12}}>数值用于概览，原因用简短说明表达；处理操作放在任务列表或详情中。</p></section>;
}
