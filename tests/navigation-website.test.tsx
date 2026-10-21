import React from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NavigationMenu,type NavigationMenuItem} from '../packages/ui/src/navigation-menu';
const microphone={label:'Microphone',href:'#mic',image:'/mic.png'};
const daq={label:'SonoDAQ',href:'#daq',image:'/daq.png'};
const items:NavigationMenuItem[]=[{id:'products',label:'Products',layout:'catalog',neutralInitialSelection:true,products:[microphone,daq],groups:[{title:'Sensors',products:[microphone],links:[{label:'Microphone Sets',href:'#sets',products:[microphone]},{label:'Calibrators',href:'#calibrators',products:[{label:'Calibrator',href:'#calibrator'}]}]},{title:'Data Acquisition',products:[daq],links:[{label:'DAQ Systems',href:'#systems',products:[daq]}]}]}];
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();});
function enter(element:Element,pointerType:string){const event=new Event('pointerover',{bubbles:true});Object.defineProperty(event,'pointerType',{value:pointerType});fireEvent(element,event);}
it('previews catalog categories only after hover intent and cancels abandoned or touch previews',()=>{
 vi.useFakeTimers();render(<NavigationMenu items={items} activateOnHover/>);fireEvent.click(screen.getByRole('button',{name:'Products'}));
 const target=screen.getByRole('button',{name:'Data Acquisition'});
 expect(screen.getByRole('button',{name:'Sensors'})).toHaveAttribute('aria-pressed','false');
 enter(target,'touch');act(()=>vi.advanceTimersByTime(200));expect(screen.getByRole('link',{name:'Microphone'})).toBeInTheDocument();
 enter(target,'mouse');act(()=>vi.advanceTimersByTime(179));expect(screen.getByRole('link',{name:'Microphone'})).toBeInTheDocument();
 fireEvent.pointerOut(target);act(()=>vi.advanceTimersByTime(200));expect(screen.getByRole('link',{name:'Microphone'})).toBeInTheDocument();
 enter(target,'mouse');act(()=>vi.advanceTimersByTime(180));expect(screen.queryByRole('link',{name:'Microphone'})).not.toBeInTheDocument();
 expect(target).toHaveAttribute('aria-pressed','true');expect(screen.getByRole('link',{name:'SonoDAQ'})).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Sensors'}));expect(screen.getByRole('link',{name:'Microphone'})).toBeInTheDocument();
});
it('keeps subtype keyboard navigation and resets a closed catalog to its featured collection',async()=>{
 const user=userEvent.setup();render(<NavigationMenu items={items}/>);const trigger=screen.getByRole('button',{name:'Products'});await user.click(trigger);
 await user.click(screen.getByRole('button',{name:'Microphone Sets'}));await user.keyboard('{End}');
 expect(screen.getByRole('button',{name:'Calibrators'})).toHaveFocus();expect(screen.getByRole('link',{name:'Calibrator'})).toBeVisible();
 await user.keyboard('{Escape}');expect(trigger).toHaveFocus();await user.click(trigger);
 expect(screen.getByRole('link',{name:'Microphone'})).toBeVisible();expect(screen.getByRole('link',{name:'SonoDAQ'})).toBeVisible();
});
it('renders native image-card destinations and closes the menu on navigation',async()=>{
 const user=userEvent.setup();const navigate=vi.fn();render(<NavigationMenu onNavigate={navigate} items={[{id:'resources',label:'Resources',layout:'cards',links:[{label:'Download',href:'#downloads',image:'/download.png'},{label:'Blogs',href:'#blogs',image:'/blogs.png'}]}]}/>);
 await user.click(screen.getByRole('button',{name:'Resources'}));const panel=screen.getByRole('dialog',{name:'Resources导航'});
 const link=within(panel).getByRole('link',{name:'Blogs'});expect(link).toHaveAttribute('href','#blogs');expect(link.querySelector('img')).toHaveAttribute('src','/blogs.png');
 await user.click(link);expect(navigate).toHaveBeenCalledWith('#blogs');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
it('uses nested mobile disclosures with Radix Escape focus return and working links',async()=>{
 const user=userEvent.setup();const navigate=vi.fn();render(<div data-theme="dark" data-customer="ocean"><NavigationMenu label="Main navigation" items={items} collapsible onNavigate={navigate} mobileToggleLabels={{open:'Open navigation',close:'Close navigation'}}/></div>);
 const trigger=screen.getByRole('button',{name:'Open navigation'});await user.click(trigger);
 let panel=screen.getByRole('dialog',{name:'Main navigation'});expect(panel.closest('[data-theme="dark"]')).toHaveAttribute('data-customer','ocean');
 await user.click(within(panel).getByText('Products',{selector:'summary'}));await user.click(within(panel).getByText('Sensors',{selector:'summary'}));
 expect(within(panel).getByRole('link',{name:'Microphone Sets'})).toHaveAttribute('href','#sets');
 await user.keyboard('{Escape}');expect(trigger).toHaveFocus();expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
 await user.click(trigger);panel=screen.getByRole('dialog',{name:'Main navigation'});await user.click(within(panel).getByText('Products',{selector:'summary'}));await user.click(within(panel).getByText('Sensors',{selector:'summary'}));await user.click(within(panel).getByRole('link',{name:'Microphone Sets'}));
 expect(navigate).toHaveBeenCalledWith('#sets');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
it('keeps the new menu open through consecutive trigger changes and Escape reopening',async()=>{
 const user=userEvent.setup();render(<NavigationMenu items={[...items,{id:'resources',label:'Resources',layout:'cards',links:[{label:'Blogs',href:'#blogs'}]}]}/>);
 const products=screen.getByRole('button',{name:'Products'});const resources=screen.getByRole('button',{name:'Resources'});
 await user.click(products);await user.click(resources);
 expect(resources).toHaveAttribute('aria-expanded','true');expect(screen.getByRole('dialog',{name:'Resources导航'})).toBeVisible();
 await user.keyboard('{Escape}');await user.click(products);
 expect(products).toHaveAttribute('aria-expanded','true');expect(screen.getByRole('dialog',{name:'Products导航'})).toBeVisible();
 await user.click(resources);expect(screen.getByRole('link',{name:'Blogs'})).toBeVisible();
});
it('keeps capsule primary navigation click-operated while catalog hover preview is enabled',async()=>{
 const user=userEvent.setup();render(<NavigationMenu shape="capsule" activateOnHover items={[...items,{id:'resources',label:'Resources',layout:'cards',links:[{label:'Blogs',href:'#blogs'}]}]}/>);
 const products=screen.getByRole('button',{name:'Products'});const resources=screen.getByRole('button',{name:'Resources'});
 await user.hover(products);expect(products).toHaveAttribute('aria-expanded','false');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
 await user.click(products);await user.hover(resources);
 expect(products).toHaveAttribute('aria-expanded','true');expect(resources).toHaveAttribute('aria-expanded','false');expect(screen.getByRole('dialog',{name:'Products导航'})).toBeVisible();
 await user.keyboard('{Escape}');expect(products).toHaveFocus();await user.keyboard('{Enter}');expect(screen.getByRole('dialog',{name:'Products导航'})).toBeVisible();
});
it('responds on press at the pointer position and reverses immediately on a repeated click',()=>{
 render(<NavigationMenu shape="capsule" items={items}/>);const trigger=screen.getByRole('button',{name:'Products'});
 vi.spyOn(trigger,'getBoundingClientRect').mockReturnValue({left:100,top:20,right:300,bottom:60,x:100,y:20,width:200,height:40,toJSON:()=>({})});
 fireEvent(trigger,new MouseEvent('pointerdown',{bubbles:true,button:0,clientX:150,clientY:30}));
 expect(trigger).toHaveAttribute('aria-expanded','false');expect(trigger.style.getPropertyValue('--cs-navigation-click-x')).toBe('25%');expect(trigger.style.getPropertyValue('--cs-navigation-click-y')).toBe('25%');
 const first=trigger.querySelector('.cs-navigation-click-pulse');expect(first).toBeInTheDocument();
 fireEvent.click(trigger,{detail:1});expect(trigger).toHaveAttribute('aria-expanded','true');
 fireEvent(trigger,new MouseEvent('pointerdown',{bubbles:true,button:0,clientX:250,clientY:50}));
 const repeated=trigger.querySelector('.cs-navigation-click-pulse');expect(repeated).not.toBe(first);expect(first).not.toBeInTheDocument();
 fireEvent.click(trigger,{detail:1});expect(trigger).toHaveAttribute('aria-expanded','false');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
 const ended=new Event('animationend',{bubbles:true});Object.defineProperty(ended,'animationName',{value:'cs-navigation-click-pulse'});fireEvent(repeated!,ended);
 expect(trigger.querySelector('.cs-navigation-click-pulse')).toBeNull();
});
it.each([false,true])('keeps keyboard toggling and focus return with reduced motion %s',async reduced=>{
 const original=Object.getOwnPropertyDescriptor(window,'matchMedia');
 Object.defineProperty(window,'matchMedia',{configurable:true,value:vi.fn(()=>({matches:reduced}))});
 try {
  const user=userEvent.setup();render(<NavigationMenu shape="capsule" items={items}/>);const trigger=screen.getByRole('button',{name:'Products'});
  await user.tab();await user.keyboard('{Enter}');expect(trigger).toHaveAttribute('aria-expanded','true');
  expect(trigger.style.getPropertyValue('--cs-navigation-click-x')).toBe('50%');expect(trigger.style.getPropertyValue('--cs-navigation-click-y')).toBe('50%');
  expect(!!trigger.querySelector('.cs-navigation-click-pulse')).toBe(!reduced);
  await user.keyboard('{Escape}');expect(trigger).toHaveFocus();await user.keyboard(' ');expect(trigger).toHaveAttribute('aria-expanded','true');
 } finally { if(original)Object.defineProperty(window,'matchMedia',original);else Reflect.deleteProperty(window,'matchMedia'); }
});
