import React from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Carousel} from '../packages/ui/src/carousel';
afterEach(()=>{cleanup();vi.restoreAllMocks();});
const items=[
 {id:'a',label:'采集',content:<><img src="/a.png" alt="采集图片"/><input aria-label="采集备注"/></>},
 {id:'b',label:'成像',content:<><img src="/b.png" alt="成像图片"/><button type="button">成像操作</button></>},
 {id:'c',label:'测量',content:<img src="/c.png" alt="测量图片"/>},
];
it('keeps slide nodes, decoded images and local form state through repeated switching',async()=>{
 const user=userEvent.setup();const {container}=render(<Carousel items={items} label="产品"/>);
 const first=screen.getByRole('img',{name:'采集图片'});
 const hiddenSlide=container.querySelectorAll('.cs-carousel-slide')[1];
 const hiddenImage=hiddenSlide.querySelector('img');
 expect(hiddenSlide).toHaveAttribute('aria-hidden','true');expect(hiddenSlide).toHaveAttribute('inert');
 expect(screen.queryByRole('button',{name:'成像操作'})).not.toBeInTheDocument();
 await user.type(screen.getByRole('textbox',{name:'采集备注'}),'保留的内容');
 await user.click(screen.getByRole('button',{name:'成像'}));
 expect(screen.getByRole('img',{name:'成像图片'})).toBe(hiddenImage);
 expect(screen.queryByRole('textbox',{name:'采集备注'})).not.toBeInTheDocument();
 await user.click(screen.getByRole('button',{name:'采集'}));
 expect(screen.getByRole('img',{name:'采集图片'})).toBe(first);
 expect(screen.getByRole('textbox',{name:'采集备注'})).toHaveValue('保留的内容');
 expect(container.querySelectorAll('.cs-carousel-slide')).toHaveLength(3);
});
it('retains the visible frame until the next image has loaded and decoded',async()=>{
 const {container}=render(<Carousel items={items} label="产品"/>);
 const nextImage=container.querySelectorAll('img')[1];
 Object.defineProperty(nextImage,'complete',{value:false});
 let decoded!:()=>void;const decode=vi.fn(()=>new Promise<void>(resolve=>{decoded=resolve;}));
 Object.defineProperty(nextImage,'decode',{value:decode});
 fireEvent.click(screen.getByRole('button',{name:'成像'}));
 expect(nextImage.loading).toBe('eager');
 expect(screen.getByRole('img',{name:'采集图片'})).toBeVisible();
 expect(screen.queryByRole('img',{name:'成像图片'})).not.toBeInTheDocument();
 fireEvent.load(nextImage);expect(decode).toHaveBeenCalledOnce();
 expect(screen.getByRole('img',{name:'采集图片'})).toBeVisible();
 await act(async()=>{decoded();});
 expect(screen.getByRole('img',{name:'成像图片'})).toBe(nextImage);
 expect(container.querySelector('.cs-carousel-track')).toHaveStyle({transform:'translate3d(-100%,0,0)'});
});
it('ignores stale image decodes when a newer target is chosen',async()=>{
 const {container}=render(<Carousel items={items} label="产品"/>);
 let decoded!:()=>void;
 Object.defineProperty(container.querySelectorAll('img')[1],'decode',{value:()=>new Promise<void>(resolve=>{decoded=resolve;})});
 fireEvent.click(screen.getByRole('button',{name:'成像'}));
 fireEvent.click(screen.getByRole('button',{name:'测量'}));
 expect(screen.getByRole('img',{name:'测量图片'})).toBeVisible();
 await act(async()=>{decoded();});
 expect(screen.getByRole('img',{name:'测量图片'})).toBeVisible();
 expect(screen.getByRole('button',{name:'测量'})).toHaveAttribute('aria-current','true');
});
it('does not lock navigation when an image fails or decoding rejects',async()=>{
 const {container}=render(<Carousel items={items} label="产品"/>);
 const failed=container.querySelectorAll('img')[1];Object.defineProperty(failed,'complete',{value:false});
 fireEvent.click(screen.getByRole('button',{name:'成像'}));
 await act(async()=>{fireEvent.error(failed);});
 expect(screen.getByRole('group',{name:'2 / 3 · 成像'})).toBeVisible();
 Object.defineProperty(container.querySelectorAll('img')[2],'decode',{value:()=>Promise.reject(new Error('decode failed'))});
 fireEvent.click(screen.getByRole('button',{name:'测量'}));
 await act(async()=>{});
 expect(screen.getByRole('group',{name:'3 / 3 · 测量'})).toBeVisible();
});
