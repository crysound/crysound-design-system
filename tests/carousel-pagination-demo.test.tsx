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
 expect(screen.queryByRole('button',{name:/播放轮播|暂停轮播/})).not.toBeInTheDocument();
});
it('keeps only the card layout with pagination and usage rules',()=>{
 const {container}=render(<CarouselPaginationDemo/>);
 expect(container.querySelector('.pagination-demo-card')).toBeInTheDocument();
 expect(container.querySelector('select,.pagination-demo-image,.cs-carousel-play')).toBeNull();
 expect(screen.getByRole('group',{name:'轮播分页'})).toBeVisible();
 expect(screen.getByText('轮播与分页位置规则')).toBeVisible();
});
