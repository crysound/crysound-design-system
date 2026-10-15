import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LineChart, BarChart } from '../packages/ui/src/index';
afterEach(cleanup);
const series=[{key:'a',label:'测点 A'}];
describe('charts',()=>{
  it('shows accessible data and toggles a series',()=>{
    render(<LineChart title="趋势" unit="dB" data={[{label:'一',values:{a:10}},{label:'二',values:{a:null}}]} series={series}/>);
    fireEvent.focus(screen.getByRole('button',{name:'一：测点 A 10 dB'}));
    expect(screen.getByText('测点 A：10 dB')).toBeInTheDocument();
    const legend=screen.getByRole('button',{name:'测点 A'});fireEvent.click(legend);expect(legend).toHaveAttribute('aria-pressed','false');
    expect(screen.getByRole('table',{hidden:true})).toHaveTextContent('—');
  });
  it('distinguishes empty and loading states',()=>{
    const view=render(<BarChart title="统计" data={[]} series={series}/>);expect(screen.getByText('暂无图表数据')).toBeInTheDocument();
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

});
