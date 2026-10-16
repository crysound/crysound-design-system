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
