import { LineChart, BarChart } from '../../../packages/ui/src/index';
const data=['09:00','10:00','11:00','12:00','13:00','14:00','15:00'].map((label,i)=>({label,values:{a:[42,48,46,61,54,67,63][i],b:[35,41,39,52,48,55,50][i]}}));
const series=[{key:'a',label:'测点 A'},{key:'b',label:'测点 B'}];
export function ChartsDemo(){return <div className="charts-demo"><LineChart title="声压级趋势" description="演示数据，非实时采集。点击图例切换序列。" unit="dB SPL" data={data} series={series}/><BarChart title="测点对比" description="演示读数，不代表产品规格。" unit="dB SPL" data={data} series={series}/><div className="charts-demo-states"><LineChart title="空数据" data={[]} series={series}/><BarChart title="加载状态" data={[]} series={series} loading/></div></div>;}
