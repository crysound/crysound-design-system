import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { VideoPlayer } from '../packages/ui/src/index';
afterEach(cleanup);
describe('VideoPlayer', () => {
  it('shows an empty state and disables speed without a source', () => {
    render(<VideoPlayer title="培训" />);
    expect(screen.getByText('尚未选择视频')).toBeInTheDocument();
    expect(screen.getByLabelText('播放速度')).toBeDisabled();
  });
  it('changes speed, reports errors and retries loading', () => {
    render(<VideoPlayer title="测量视频" src="/test.webm" captions={[{src:'/zh.vtt',srcLang:'zh',label:'中文'}]} />);
    const video=screen.getByLabelText('测量视频') as HTMLVideoElement;
    fireEvent.change(screen.getByLabelText('播放速度'),{target:{value:'1.5'}});
    expect(video.playbackRate).toBe(1.5);
    expect(video.querySelector('track')).toHaveAttribute('srclang','zh');
    fireEvent.error(video);
    expect(screen.getByRole('alert')).toHaveTextContent('视频无法播放');
    const load=vi.spyOn(video,'load').mockImplementation(()=>{});
    fireEvent.click(screen.getByRole('button',{name:'重试'}));
    expect(load).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('正在缓冲');
  });
});
