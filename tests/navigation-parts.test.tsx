import {useId,useRef,useState} from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NavigationBar,NavigationBarTrigger,NavigationBarLink,NavigationPanel,type NavigationMenuItem} from '../packages/ui/src/index';

afterEach(cleanup);
const microphone={label:'Microphone',href:'#mic',image:'/mic.png'};
const daq={label:'SonoDAQ',href:'#daq',image:'/daq.png'};
const item:NavigationMenuItem={id:'products',label:'Products',layout:'catalog',neutralInitialSelection:true,products:[microphone,daq],groups:[{title:'Sensors',products:[microphone],links:[{label:'Microphone sets',href:'#sets',products:[microphone]}]},{title:'DAQ',products:[daq],links:[{label:'DAQ systems',href:'#systems',products:[daq]}]}]};

it('composes a controlled native navigation bar without submitting its containing form',async()=>{
 const submit=vi.fn();const user=userEvent.setup();
 function Example() {
  const [open,setOpen]=useState(false);const id=useId();const trigger=useRef<HTMLButtonElement>(null);
  return <form onSubmit={event=>{event.preventDefault();submit();}}><NavigationBar label="Primary" shape="capsule" open={open}>
   <NavigationBarTrigger ref={trigger} aria-controls={id} aria-expanded={open} onClick={()=>setOpen(value=>!value)} onKeyDown={event=>{if(event.key==='Escape')setOpen(false);}}>Products</NavigationBarTrigger>
   <NavigationBarTrigger disabled>Unavailable</NavigationBarTrigger><NavigationBarLink href="#about">About</NavigationBarLink>
  </NavigationBar><div id={id} hidden={!open}>Product navigation</div></form>;
 }
 render(<Example/>);const trigger=screen.getByRole('button',{name:'Products'});
 await user.tab();await user.keyboard('{Enter}');expect(trigger).toHaveAttribute('aria-expanded','true');expect(trigger).toHaveAttribute('data-state','open');expect(screen.getByText('Product navigation')).toBeVisible();expect(submit).not.toHaveBeenCalled();
 expect(document.getElementById(trigger.getAttribute('aria-controls')!)).toHaveTextContent('Product navigation');
 await user.keyboard('{Escape}');expect(trigger).toHaveAttribute('data-state','closed');expect(trigger).toHaveFocus();
 await user.tab();expect(screen.getByRole('link',{name:'About'})).toHaveFocus();
});

it('supports standalone catalog keyboard selection and native destinations without a popover',async()=>{
 const user=userEvent.setup();const navigate=vi.fn();render(<div data-theme="dark" data-customer="ocean"><NavigationPanel item={item} variant="website" onNavigate={navigate}/></div>);
 const region=screen.getByRole('region',{name:'Products导航面板'});expect(region.closest('[data-theme="dark"]')).toHaveAttribute('data-customer','ocean');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
 const sensors=within(region).getByRole('button',{name:'Sensors'});expect(sensors).toHaveAttribute('aria-pressed','false');
 await user.click(sensors);await user.keyboard('{ArrowDown}');expect(screen.getByRole('button',{name:'DAQ'})).toHaveFocus();expect(screen.getByRole('button',{name:'DAQ'})).toHaveAttribute('aria-pressed','true');expect(screen.queryByRole('link',{name:'Microphone'})).not.toBeInTheDocument();
 const link=within(region).getByRole('link',{name:'SonoDAQ'});expect(link).toHaveAttribute('href','#daq');await user.click(link);expect(navigate).toHaveBeenCalledWith('#daq');expect(region).toBeInTheDocument();
});

it('resets standalone catalog selection when the caller changes the item identity',async()=>{
 const user=userEvent.setup();const {rerender}=render(<NavigationPanel item={item}/>);await user.click(screen.getByRole('button',{name:'DAQ'}));
 const solutions:NavigationMenuItem={id:'solutions',label:'Solutions',layout:'catalog',groups:[{title:'Industry',links:[{label:'Industrial',href:'#industrial'}],products:[{label:'Factory',href:'#factory'}]}]};
 rerender(<NavigationPanel item={solutions}/>);expect(screen.getByRole('button',{name:'Industry'})).toHaveAttribute('aria-pressed','true');expect(screen.getByRole('link',{name:'Factory'})).toBeVisible();expect(screen.queryByRole('link',{name:'SonoDAQ'})).not.toBeInTheDocument();
});

it('renders the cards layout with semantic links and forwards navigation',async()=>{
 const user=userEvent.setup();const navigate=vi.fn();render(<NavigationPanel item={{id:'resources',label:'Resources',layout:'cards',links:[{label:'Blogs',href:'#blogs',image:'/blogs.jpg'}]}} onNavigate={navigate}/>);
 const link=screen.getByRole('link',{name:'Blogs'});expect(link.querySelector('img')).toHaveAttribute('alt','');expect(link).toHaveAttribute('href','#blogs');await user.click(link);expect(navigate).toHaveBeenCalledWith('#blogs');
});

it('keeps an empty standalone catalog explicit',()=>{
 render(<NavigationPanel item={{id:'empty',label:'Empty catalog',layout:'catalog',groups:[]}}/>);expect(screen.getByRole('region',{name:'Empty catalog导航面板'})).toHaveTextContent('暂无产品');expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
