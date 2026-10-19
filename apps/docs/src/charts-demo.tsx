import { LineChart, BarChart, AreaChart, ScatterChart, StackedBarChart, DonutChart, Spectrogram, Tabs, TabsList, TabsTrigger, TabsContent } from '../../../packages/ui/src/index';
const frequencies=[20,25,31.5,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
const response=frequencies.map((x,i)=>({x,label:`${x>=1000?`${x/1000}k`:x} Hz`,values:{a:Number((78+3*Math.sin(i*.37)-9*Math.exp(-i/4)-Math.max(0,i-25)*1.5).toFixed(1)),b:Number((76+2.5*Math.sin(i*.37+.35)-8*Math.exp(-i/4)-Math.max(0,i-25)*1.7).toFixed(1))}}));
const bands=response.map((row,i)=>({...row,values:{a:Number((44+15*Math.sin(i*.2)+7*Math.exp(-((i-8)**2)/12)).toFixed(1)),b:Number((41+14*Math.sin(i*.2)+5*Math.exp(-((i-8)**2)/12)).toFixed(1))}}));
const series=[{key:'a',label:'CH 1 · 测量通道',channel:1},{key:'b',label:'CH 2 · 参考通道',channel:2}];

const waveform=Array.from({length:481},(_,i)=>({x:i/48,label:`${(i/48).toFixed(3)} ms`,values:{a:.7*Math.sin(2*Math.PI*i/48)+.1*Math.sin(6*Math.PI*i/48),b:.65*Math.sin(2*Math.PI*i/48+.22)}}));
const fft=Array.from({length:301},(_,i)=>{const x=20*10**(i/100),peak=(hz:number)=>Math.exp(-((Math.log10(x/hz)/.045)**2));return {x,label:`${x.toFixed(3)} Hz`,values:{a:-130+48*peak(1000)+25*peak(2000)+18*peak(3000)+3*Math.sin(i*2.1),b:-133+46*peak(1000)+20*peak(2000)+14*peak(3000)+3*Math.cos(i*1.7)}};});
const phase=response.map((row,i)=>({...row,values:{a:20*Math.sin(i/7)-i*5,b:16*Math.sin(i/7+.2)-i*5.3}}));
const history=Array.from({length:61},(_,i)=>({x:i,label:`${i} s`,values:{a:68+2*Math.sin(i/7)+4*Math.exp(-(((i-35)/5)**2)),b:65+1.5*Math.sin(i/8)}}));
const spectrumFrequencies=Array.from({length:40},(_,i)=>50+i*200);
const frames=Array.from({length:48},(_,i)=>({time:i*.1,levels:spectrumFrequencies.map((f,j)=>30+52*Math.exp(-(((f-1000-i*75)/350)**2))+14*Math.exp(-(((f-3000)/500)**2))+3*Math.sin(i+j))}));
const channels=Array.from({length:8},(_,i)=>({key:`ch${i+1}`,label:`CH ${String(i+1).padStart(2,'0')}`,channel:i+1}));
const levels=[{label:'RMS',values:Object.fromEntries(channels.map((ch,i)=>[ch.key,-18-i*4+2*Math.sin(i)]))}];
const common={series,measurementInfo:['合成演示数据 · 非实时采集']};
export function ChartsDemo(){return <div className="charts-demo">
  <p className="charts-demo-intro">按趋势、比较、构成与测量任务选择图表。所有示例均为合成数据；统计聚合、FFT、滤波、加权与校准由消费项目提供。</p>
  <CommonChartsDemo/><h3>声学测量图表</h3><Tabs defaultValue="response">
    <TabsList aria-label="声学图表类型" className="charts-type-tabs">
      {[['waveform','时域波形'],['fft','FFT 频谱'],['response','频率响应'],['phase','相位响应'],['octave','倍频程频谱'],['history','声级时间历程'],['spectrogram','时频谱'],['levels','通道电平']].map(([value,label])=><TabsTrigger value={value} key={value}>{label}</TabsTrigger>)}
    </TabsList>
    <TabsContent value="waveform"><LineChart {...common} title="时域波形 / Time waveform" description="检查瞬态、削波与双通道时序" unit="FS" xScale="linear" xDomain={[0,10]} xLabel="时间 / ms" yLabel="幅值 / FS" yDomain={[-1,1]} yStep={.5} data={waveform}/></TabsContent>
    <TabsContent value="fft"><LineChart {...common} title="FFT 频谱 / FFT spectrum" description="观察基频、谐波及噪声分布；本例为合成频谱" unit="dBV rms" xScale="log" xLabel="频率 / Hz" yLabel="FFT 幅值 / dBV rms" yDomain={[-150,-40]} yStep={10} data={fft}/></TabsContent>
    <TabsContent value="response"><LineChart {...common} title="声压频率响应" description="对数频率轴 · 双通道幅值对比" unit="dB SPL" xLabel="频率 / Hz" yLabel="声压级 / dB SPL" xScale="log" yDomain={[40,100]} yStep={10} data={response}/></TabsContent>
    <TabsContent value="phase"><LineChart {...common} title="相位响应 / Phase response" description="查看随频率变化的通道相位角" unit="°" xLabel="频率 / Hz" yLabel="相位 / °" xScale="log" yDomain={[-180,180]} yStep={60} data={phase}/></TabsContent>
    <TabsContent value="octave"><BarChart {...common} title="1/3 倍频程频谱" description="中心频率频带对比；本例非滤波器输出" unit="dB SPL" xLabel="中心频率 / Hz" yLabel="频带声压级 / dB SPL" yDomain={[20,80]} yStep={10} data={bands}/></TabsContent>
    <TabsContent value="history"><LineChart {...common} title="声级时间历程 / Level history" description="查看声级随时间的变化与事件；非实际加权计算结果" unit="dB(A)" xScale="linear" xLabel="时间 / s" yLabel="声级 / dB(A)" yDomain={[50,90]} yStep={10} data={history}/></TabsContent>
    <TabsContent value="spectrogram"><Spectrogram title="时频谱 / Spectrogram" description="以独立幅值色标观察频率随时间变化；本例为合成矩阵" frequencies={spectrumFrequencies} frames={frames} range={[20,90]} unit="dB SPL"/></TabsContent>
    <TabsContent value="levels"><BarChart title="多通道电平 / Channel levels" description="比较八个通道的 RMS 电平；示例非设备读数" measurementInfo={['合成演示数据 · 非实时采集']} unit="dBFS" xLabel="通道组" yLabel="RMS 电平 / dBFS" yDomain={[-80,0]} yStep={10} barBaseline={-80} data={levels} series={channels}/></TabsContent>
  </Tabs>
  <details className="charts-demo-status"><summary>空数据与加载状态</summary><div className="charts-demo-states"><LineChart title="时域信号 · 空数据" xScale="linear" xDomain={[0,10]} yDomain={[-1,1]} yStep={.5} xLabel="Time (ms)" yLabel="Amplitude (FS)" data={[]} series={[{key:'signal',label:'Signal',channel:1}]}/><BarChart title="加载状态" data={[]} series={series} loading/></div></details>
</div>;}

const generalSeries=[{key:'a',label:'实验室 A'},{key:'b',label:'实验室 B'},{key:'c',label:'产线工位'}];
const monthly=[42,56,48,71,65,84].map((a,i)=>({label:`${i+1} 月`,values:{a,b:Math.round(a*.7+8),c:Math.round(a*.4+5)}}));
const scatter=Array.from({length:25},(_,i)=>({x:30+i*2,label:`样本 ${i+1}`,values:{a:42+i*.6+Math.sin(i*1.7)*4}}));
function CommonChartsDemo(){return <section className="charts-common"><h3>通用数据图表</h3><p className="charts-demo-intro">趋势用折线，数量用柱状，构成用堆叠或环形，相关性用散点。图例可切换序列，键盘可读取数据点；均为合成示例。</p><Tabs defaultValue="line"><TabsList aria-label="通用图表类型" className="charts-type-tabs">{[['line','趋势折线'],['bar','分组柱状'],['stacked','堆叠柱状'],['area','面积图'],['scatter','散点图'],['donut','环形图']].map(([key,label])=><TabsTrigger value={key} key={key}>{label}</TabsTrigger>)}</TabsList><TabsContent value="line"><LineChart title="测量任务趋势" description="比较连续周期内的任务变化" data={monthly} series={generalSeries.slice(0,2)} unit="次" minorGrid={false}/></TabsContent><TabsContent value="bar"><BarChart title="各工作区任务量" description="并排比较相同周期的分类数量；数量轴从零开始" data={monthly} series={generalSeries} unit="次" minorGrid={false}/></TabsContent><TabsContent value="stacked"><StackedBarChart title="任务总量与构成" description="在同一坐标中比较各月总量及各工作区贡献" data={monthly} series={generalSeries} unit="次" minorGrid={false}/></TabsContent><TabsContent value="area"><AreaChart title="采集任务规模" description="轻透明填充表达规模变化；缺失值断开，不补零" data={monthly} series={generalSeries.slice(0,2)} unit="次" minorGrid={false}/></TabsContent><TabsContent value="scatter"><ScatterChart title="负载与处理时长" description="查看两个连续变量的关系；散点不连线，不能据此推断因果" data={scatter} series={[{key:'a',label:'测量样本'}]} unit="ms" xScale="linear" xLabel="设备负载 / %" yLabel="处理时长 / ms" yDomain={[30,70]} yStep={10} minorGrid={false}/></TabsContent><TabsContent value="donut"><DonutChart title="任务类型构成" description="适用于少量、非负且互斥的分类；图例可隐藏分类" data={[{label:'数据采集',value:128},{label:'声学成像',value:86},{label:'音频测试',value:54},{label:'其他测量',value:32}]} unit="次"/></TabsContent></Tabs></section>;}
