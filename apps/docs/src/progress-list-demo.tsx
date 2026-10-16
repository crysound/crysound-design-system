import {ProgressList} from '../../../packages/ui/src/index';
export function ProgressListDemo() {
  return <ProgressList title="测量任务进度" overallProgress={77} notice="设备同步暂不可用，以下进度按已完成的测量记录统计。" items={[
    {id:'calibrate',title:'传声器校准与通道检查',description:'实验室 A · 采集设备 01',progress:93,progressLabel:'28 / 30',date:'10-17',status:'进行中',details:<p>已完成 28 路校准，剩余 2 路等待连接。重新连接后继续采集，已保存记录保持有效。</p>},
    {id:'response',title:'扬声器频率响应测试',description:'实验室 B · 测试批次 02',progress:72,progressLabel:'18 / 25',date:'10-19',status:'进行中',details:<p>测量范围与合格阈值由任务配置提供。此处仅展示详情排版。</p>},
    {id:'report',title:'测量报告汇总与复核',progress:null,date:'10-22',status:'待同步',details:<p>尚未取得完成数量，不将未知进度显示为 0%。</p>},
  ]}/>;
}
