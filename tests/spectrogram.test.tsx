import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Spectrogram } from '../packages/ui/src/index';
afterEach(cleanup);
describe('Spectrogram',()=>{
  it('distinguishes missing levels from zero and navigates the time-frequency matrix',()=>{
    const view=render(<Spectrogram title="时频分析" frequencies={[100,200]} frames={[{time:0,levels:[null,40]},{time:1,levels:[0,60]}]} range={[0,80]}/>);
    const first=screen.getByRole('button',{name:'0 s，100 Hz，无数据'});
    expect(first).toHaveAttribute('fill','var(--cs-chart-plot-bg)');
    fireEvent.focus(first);
    fireEvent.keyDown(first,{key:'ArrowRight'});
    expect(screen.getByRole('button',{name:'1 s，100 Hz，0 dB SPL'})).toHaveFocus();
    expect(view.container.querySelector('.cs-spectrogram-readout')).toHaveTextContent('0 dB SPL');
    fireEvent.keyDown(document.activeElement!,{key:'ArrowUp'});
    expect(screen.getByRole('button',{name:'1 s，200 Hz，60 dB SPL'})).toHaveFocus();
    fireEvent.keyDown(document.activeElement!,{key:'Escape'});
    expect(view.container.querySelector('.cs-spectrogram-readout')).not.toBeInTheDocument();
  });
  it('keeps empty and loading states separate',()=>{
    const view=render(<Spectrogram title="时频分析" frequencies={[]} frames={[]}/>);
    expect(screen.getByText('暂无时频数据')).toBeInTheDocument();
    view.rerender(<Spectrogram title="时频分析" frequencies={[]} frames={[]} loading/>);
    expect(screen.getByRole('status')).toHaveTextContent('正在加载图表');
  });
});
