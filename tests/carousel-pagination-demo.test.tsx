import React from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {CarouselPaginationDemo} from '../apps/docs/src/carousel-pagination-demo';
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.useRealTimers();});
it('shows automatic content rotation and stops after manual pagination focus',()=>{
 vi.useFakeTimers();vi.spyOn(document,'hidden','get').mockReturnValue(false);
 render(<CarouselPaginationDemo/>);
 expect(screen.getByRole('group',{name:'1 / 3 · Data acquisition'})).toBeVisible();
 act(()=>vi.advanceTimersByTime(5000));expect(screen.getByRole('group',{name:'2 / 3 · Sound power'})).toBeVisible();
 const target=screen.getByRole('button',{name:'Acoustic analysis'});fireEvent.focus(target);fireEvent.click(target);
 expect(target).toHaveAttribute('aria-current','true');
 act(()=>vi.advanceTimersByTime(10000));expect(screen.getByRole('group',{name:'3 / 3 · Acoustic analysis'})).toBeVisible();
 expect(screen.getByRole('button',{name:'播放轮播'})).toBeVisible();
});
it('resets the content when switching from an image to a below-content layout',()=>{
 const {container}=render(<CarouselPaginationDemo/>);
 fireEvent.change(container.querySelector('select')!,{target:{value:'card'}});
 expect(container.querySelector('.pagination-demo-card')).toBeInTheDocument();
 expect(container.querySelector('.pagination-demo-image')).not.toBeInTheDocument();
 expect(screen.getByText('第 1 / 3 张 · 每5秒切换；悬停暂缓，聚焦后停止，可手动继续播放。')).toBeVisible();
 expect(screen.getByText('轮播与分页位置规则')).toBeVisible();
});
