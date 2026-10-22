import {afterEach,expect,it} from 'vitest';
import {cleanup,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NavigationMenuDemo} from '../apps/docs/src/navigation-menu-demo';

afterEach(cleanup);

it('connects the website catalog to subtype products and resets it after closing',async()=>{
 const user=userEvent.setup();
 render(<div data-theme="dark" data-customer="ocean"><NavigationMenuDemo/></div>);
 const trigger=screen.getByRole('button',{name:'Products'});
 await user.click(trigger);
 let panel=screen.getByRole('dialog',{name:'Products导航'});
 expect(panel.closest('[data-theme="dark"]')).toHaveAttribute('data-customer','ocean');
 expect(within(panel).getByRole('link',{name:'OpenTest'})).toBeVisible();
 expect(within(panel).getByRole('link',{name:'Products home'})).toHaveAttribute('href',expect.stringContaining('#product-line/'));
 await user.click(within(panel).getByRole('button',{name:'Data Acquisition'}));
 await user.click(within(panel).getByRole('button',{name:'Data Acquisition Module'}));
 expect(within(panel).getByRole('link',{name:'CRY5001 Smart Battery Module - BAT'})).toBeVisible();
 expect(within(panel).queryByRole('link',{name:'OpenTest'})).not.toBeInTheDocument();
 await user.keyboard('{Escape}');
 expect(trigger).toHaveFocus();
 await user.keyboard('{Enter}');
 panel=screen.getByRole('dialog',{name:'Products导航'});
 expect(within(panel).getByRole('link',{name:'OpenTest'})).toBeVisible();
});

it('uses the website image destinations for resources, support, and contact',async()=>{
 const user=userEvent.setup();render(<NavigationMenuDemo/>);
 for(const [menu,destination] of [['Resources','Download'],['Support','Technical Support'],['Contact','Contact Us']]) {
  const trigger=screen.getByRole('button',{name:menu});
  await user.click(trigger);
  const link=within(screen.getByRole('dialog',{name:`${menu}导航`})).getByRole('link',{name:destination});
  expect(link).toHaveAttribute('href',expect.stringMatching(/^https:\/\//));
  expect(link.querySelector('img')).toHaveAttribute('src',expect.stringContaining('/scene-assets/navigation/'));
  await user.keyboard('{Escape}');expect(trigger).toHaveFocus();
 }
});
