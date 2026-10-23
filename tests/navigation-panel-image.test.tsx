import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NavigationPanel} from '../packages/ui/src/index';

let observers:{notify:(visible:boolean)=>void;disconnect:ReturnType<typeof vi.fn>}[];
const preview='data:image/jpeg;base64,cHJldmlldw==';
const cards=(image='/blogs.png')=>({id:'resources',label:'Resources',layout:'cards' as const,links:[{label:'Blogs',href:'#blogs',image,imagePreview:preview}]});
const photo=()=>screen.getByRole('link',{name:'Blogs'}).querySelector('.cs-navigation-image-full') as HTMLImageElement;
const wrapper=()=>photo().parentElement!;
const enter=()=>act(()=>observers.at(-1)!.notify(true));

beforeEach(()=>{
 observers=[];
 vi.spyOn(HTMLImageElement.prototype,'complete','get').mockReturnValue(false);
 vi.spyOn(HTMLImageElement.prototype,'naturalWidth','get').mockReturnValue(600);
 vi.stubGlobal('IntersectionObserver',class {
  disconnect=vi.fn();
  constructor(callback:IntersectionObserverCallback){observers.push({notify:visible=>callback([{isIntersecting:visible} as IntersectionObserverEntry],this as unknown as IntersectionObserver),disconnect:this.disconnect});}
  observe(){}
 });
});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});

it('keeps the real photo unfetched offscreen and its preview available until decoding finishes',async()=>{
 render(<NavigationPanel item={cards()} variant="website"/>);
 expect(photo()).not.toHaveAttribute('src');expect(wrapper().querySelector('.cs-navigation-image-preview')).toHaveAttribute('src',preview);
 act(()=>observers[0].notify(false));expect(photo()).not.toHaveAttribute('src');
 let finish!:()=>void;
 const decode=vi.fn(()=>new Promise<void>(resolve=>{finish=resolve;}));Object.defineProperty(photo(),'decode',{value:decode});
 enter();expect(photo()).toHaveAttribute('src','/blogs.png');expect(photo()).toHaveAttribute('loading','lazy');expect(photo()).toHaveAttribute('decoding','async');
 expect(observers[0].disconnect).toHaveBeenCalled();fireEvent.load(photo());expect(decode).toHaveBeenCalledOnce();expect(wrapper()).toHaveAttribute('data-state','loading');
 await act(async()=>finish());expect(wrapper()).toHaveAttribute('data-state','ready');
});

it('shows cached, complete images without replaying the blur reveal',async()=>{
 vi.spyOn(HTMLImageElement.prototype,'complete','get').mockReturnValue(true);
 render(<NavigationPanel item={cards()}/>);Object.defineProperty(photo(),'decode',{value:vi.fn().mockResolvedValue(undefined)});
 await act(async()=>observers[0].notify(true));expect(wrapper()).toHaveAttribute('data-state','ready');expect(wrapper()).toHaveAttribute('data-cached','true');
});

it('does not replay a decoded source when a reopened menu receives an asynchronous cache load',async()=>{
 const first=render(<NavigationPanel item={cards('/remembered.png')}/>);enter();await act(async()=>fireEvent.load(photo()));expect(wrapper()).toHaveAttribute('data-state','ready');first.unmount();
 render(<NavigationPanel item={cards('/remembered.png')}/>);enter();await act(async()=>fireEvent.load(photo()));expect(wrapper()).toHaveAttribute('data-state','ready');expect(wrapper()).toHaveAttribute('data-cached','true');
});

it('retains the preview and a working native link when the photo fails',async()=>{
 const navigate=vi.fn();const user=userEvent.setup();render(<NavigationPanel item={cards()} onNavigate={navigate}/>);enter();fireEvent.error(photo());
 expect(wrapper()).toHaveAttribute('data-state','error');expect(wrapper().querySelector('.cs-navigation-image-preview')).toBeInTheDocument();expect(wrapper().querySelector('.cs-navigation-image-error')).toBeInTheDocument();
 await user.tab();expect(screen.getByRole('link',{name:'Blogs'})).toHaveFocus();await user.keyboard('{Enter}');expect(navigate).toHaveBeenCalledWith('#blogs');
});

it('ignores stale observers and decode completion after the source changes or unmounts',async()=>{
 const {rerender,unmount}=render(<NavigationPanel item={cards()}/>);
 let finish!:()=>void;Object.defineProperty(photo(),'decode',{value:()=>new Promise<void>(resolve=>{finish=resolve;})});enter();fireEvent.load(photo());
 const oldObserver=observers[0];rerender(<NavigationPanel item={cards('/new.png')}/>);
 expect(oldObserver.disconnect).toHaveBeenCalled();await act(async()=>{oldObserver.notify(true);finish();});
 expect(photo()).not.toHaveAttribute('src');expect(wrapper()).toHaveAttribute('data-state','loading');
 const currentObserver=observers.at(-1)!;unmount();expect(currentObserver.disconnect).toHaveBeenCalled();act(()=>currentObserver.notify(true));
});

it('falls back to native lazy loading when IntersectionObserver is unavailable and tolerates decode rejection',async()=>{
 vi.stubGlobal('IntersectionObserver',undefined);render(<NavigationPanel item={cards()}/>);
 expect(photo()).toHaveAttribute('src','/blogs.png');Object.defineProperty(photo(),'decode',{value:vi.fn().mockRejectedValue(new Error('decode unavailable'))});
 await act(async()=>fireEvent.load(photo()));expect(wrapper()).toHaveAttribute('data-state','ready');
});

it('leaves caller-supplied custom media in control of its own loading behavior',()=>{
 render(<NavigationPanel item={{...cards(),links:[{...cards().links[0],media:<svg data-testid="custom-art"/>}]}}/>);
 expect(screen.getByTestId('custom-art')).toBeInTheDocument();expect(observers).toHaveLength(0);expect(screen.getByRole('link',{name:'Blogs'}).querySelector('img')).toBeNull();
});
