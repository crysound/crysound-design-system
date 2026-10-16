import { MetricGroup } from '../../../packages/ui/src/index';
export function MetricGroupDemo() {
  return <MetricGroup label="运营排程概览" items={[
    {id:'merged',label:'今日合入',value:60,unit:'张卡',note:'已确认部分'},
    {id:'capacity',label:'开发名额',value:'6 / 12',unit:'个',note:'剩余 6 个'},
    {id:'queue',label:'排队任务',value:53,unit:'个',note:'近 1 小时峰值 69'},
    {id:'cost',label:'今日服务器费用',value:'9.25',unit:'美元',note:'估算金额'},
    {id:'remaining',label:'冲刺剩余',value:7,unit:'天',note:'目标 10-22'},
  ]}/>;
}
