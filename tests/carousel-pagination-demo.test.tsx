import React from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {CarouselPaginationDemo} from '../apps/docs/src/carousel-pagination-demo';
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.useRealTimers();});
it('shows automatic content rotation and stops after manual pagination focus',()=>{
 vi.useFakeTimers();vi.spyOn(document,'hidden','get').mockReturnValue(false);
 render(<CarouselPaginationDemo/>);
 expect(screen.getByRole('group',{name:'1 / 3 · 默认图片 1'})).toBeVisible();
 act(()=>vi.advanceTimersByTime(5000));expect(screen.getByRole('group',{name:'2 / 3 · 默认图片 2'})).toBeVisible();
 const target=screen.getByRole('button',{name:'默认图片 3'});fireEvent.focus(target);fireEvent.click(target);
 expect(target).toHaveAttribute('aria-current','true');
 act(()=>vi.advanceTimersByTime(10000));expect(screen.getByRole('group',{name:'3 / 3 · 默认图片 3'})).toBeVisible();
 expect(screen.queryByRole('button',{name:/播放轮播|暂停轮播/})).not.toBeInTheDocument();
});
it('shows default 16:9 images with pagination and usage rules',()=>{
 const {container}=render(<CarouselPaginationDemo/>);
 expect(screen.getByRole('img',{name:'默认图片 1（16:9）'})).toHaveAttribute('viewBox','0 0 1600 900');
 expect(container.querySelector('select,.pagination-demo-copy,.pagination-demo-skeleton-example,.cs-skeleton,.cs-carousel-play')).toBeNull();
 expect(screen.getByRole('group',{name:'轮播分页'})).toBeVisible();
 expect(screen.getByText('轮播与分页位置规则')).toBeVisible();
});
