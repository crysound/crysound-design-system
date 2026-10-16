import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LineChart, BarChart } from '../packages/ui/src/index';
afterEach(cleanup);
const series=[{key:'a',label:'测点 A'}];
describe('charts',()=>{
  it('keeps the zero baseline inside the displayed axis domain',()=>{
    const view=render(<LineChart title="FFT" yDomain={[-150,-40]} data={[{label:'1k',values:{a:-80}}]} series={series}/>);
    const baseline=()=>view.container.querySelector('line[stroke="var(--cs-chart-axis)"]');
    expect(baseline()).toBeNull();
    view.rerender(<LineChart title="波形" yDomain={[-1,1]} data={[{label:'0',values:{a:.5}}]} series={series}/>);
    expect(baseline()).toHaveAttribute('clip-path');
    const frame=view.container.querySelector('clipPath rect')!;
    const yy=Number(baseline()!.getAttribute('y1'));
    expect(yy).toBeGreaterThanOrEqual(Number(frame.getAttribute('y')));
    expect(yy).toBeLessThanOrEqual(Number(frame.getAttribute('y'))+Number(frame.getAttribute('height')));
  });
  it('shows accessible data and toggles a series',()=>{
    render(<LineChart title="趋势" unit="dB" data={[{label:'一',values:{a:10}},{label:'二',values:{a:null}}]} series={series}/>);
    fireEvent.focus(screen.getByRole('button',{name:'一：测点 A 10 dB'}));
    expect(screen.getByText('测点 A：10 dB')).toBeInTheDocument();
    const legend=screen.getByRole('button',{name:'测点 A'});fireEvent.click(legend);expect(legend).toHaveAttribute('aria-pressed','false');
    expect(screen.getByRole('table',{hidden:true})).toHaveTextContent('—');
  });
  it('distinguishes empty and loading states',()=>{
    const view=render(<BarChart title="统计" data={[]} series={series}/>);expect(screen.getByText('暂无图表数据')).toBeInTheDocument();expect(screen.getByRole('img')).toBeInTheDocument();
    view.rerender(<BarChart title="统计" data={[]} series={series} loading/>);expect(screen.getByRole('status')).toHaveTextContent('正在加载');
  });
  it('spaces equal frequency ratios equally on a logarithmic axis and uses the requested dB scale',()=>{
    const view=render(<LineChart title="频响" xScale="log" xLabel="频率 / Hz" yDomain={[40,80]} yStep={20} data={[{label:'20 Hz',x:20,values:{a:50}},{label:'200 Hz',x:200,values:{a:60}},{label:'2k Hz',x:2000,values:{a:70}}]} series={series}/>);
    const path=view.container.querySelector('path[clip-path]')!.getAttribute('d')!;
    const positions=Array.from(path.matchAll(/[ML]([\d.]+),/g),match=>Number(match[1]));
    expect(positions[1]-positions[0]).toBeCloseTo(positions[2]-positions[1]);
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('频率 / Hz')).toBeInTheDocument();
  });

  it('keeps explicit channel colors stable when a series is hidden or reordered',()=>{
    const channels=[{key:'a',label:'通道64',channel:64},{key:'b',label:'通道2',channel:2}];
    const data=[{label:'测点',values:{a:10,b:20}}];
    const view=render(<LineChart title="通道色" data={data} series={channels}/>);
    const swatch=()=>screen.getByRole('button',{name:'通道64'}).querySelector('span')!;
    expect(swatch().style.background).toBe('var(--cs-chart-channel-64)');
    fireEvent.click(screen.getByRole('button',{name:'通道2'}));
    view.rerender(<LineChart title="通道色" data={data} series={[channels[1],channels[0]]}/>);
    expect(swatch().style.background).toBe('var(--cs-chart-channel-64)');
    view.rerender(<LineChart title="通道色" data={data} series={[{...channels[0],color:'#123456'}]}/>);
    expect(swatch().style.background).toBe('rgb(18, 52, 86)');
  });

  it('shows precise cursor values on pointer movement without clicking',()=>{
    const view=render(<LineChart title="FFT" unit="dBV rms" xScale="log" xLabel="Frequency(Hz)" data={[{label:'140.625 Hz',x:140.625,values:{a:-69.704}}]} series={series}/>);
    const point=screen.getByRole('button',{name:'140.625 Hz：测点 A -69.704 dBV rms'});
    fireEvent.mouseMove(point);
    expect(view.container.querySelector('.cs-chart-tooltip')).toHaveTextContent('140.625 Hz');
    expect(view.container.querySelector('.cs-chart-tooltip')).toHaveTextContent('-69.704 dBV rms');
    expect(view.container.querySelectorAll('.cs-chart-crosshair line')).toHaveLength(2);
    fireEvent.mouseLeave(view.container.querySelector('.cs-chart-plot')!);
    expect(view.container.querySelector('.cs-chart-tooltip')).not.toBeInTheDocument();
    fireEvent.focus(point);
    expect(view.container.querySelector('.cs-chart-tooltip')).toBeInTheDocument();
    fireEvent.keyDown(point,{key:'Escape'});
    expect(view.container.querySelector('.cs-chart-tooltip')).not.toBeInTheDocument();
  });

  it('draws a negative dBFS level upward from an explicit lower baseline',()=>{
    const view=render(<BarChart title="电平" unit="dBFS" yDomain={[-80,0]} barBaseline={-80} data={[{label:'CH 01',values:{a:-20}}]} series={series}/>);
    const bar=view.container.querySelector('rect[clip-path]')!;
    const frame=view.container.querySelector('clipPath rect')!;
    const bottom=Number(frame.getAttribute('y'))+Number(frame.getAttribute('height'));
    expect(Number(bar.getAttribute('y'))).toBeLessThan(bottom);
    expect(Number(bar.getAttribute('y'))+Number(bar.getAttribute('height'))).toBeCloseTo(bottom);
  });

});

it('keeps dense axis endpoints while reducing labels and removes minor grid by default', () => {
  const view = render(<LineChart title="稀疏标尺" height={300} yDomain={[-150,-40]} yStep={10} xScale="log" data={[{label:'20',x:20,values:{a:-130}},{label:'20000',x:20000,values:{a:-80}}]} series={[{key:'a',label:'通道'}]} />);
  const labels = Array.from(view.container.querySelectorAll('[data-axis-tick="y"] text')).map(el => el.textContent);
  expect(labels.length).toBeLessThanOrEqual(6);
  expect(labels[0]).toBe('-150');
  expect(labels.at(-1)).toBe('-40');
  expect(view.container.querySelectorAll('line[stroke-width=".5"]')).toHaveLength(0);
});
