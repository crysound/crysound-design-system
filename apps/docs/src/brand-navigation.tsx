import {useState} from 'react';
import {Button,Dialog,DropdownMenu,Input,NavigationMenu} from '../../../packages/ui/src/index';
import {brandNavigationItems} from './brand-navigation-items';
export {brandNavigationItems} from './brand-navigation-items';
import './brand-navigation.css';

const website='https://crysound-website.ya-wang346019.chatgpt.site/';
export function BrandNavigation({products}:{products:{title:string;description:string;image:string}[]}) {
 const [language,setLanguage]=useState('EN');const [search,setSearch]=useState('');
 const tools=<div className="brand-navigation-tools">
  <DropdownMenu label="Language options" trigger={<Button variant="ghost" size="sm" className="brand-navigation-language" aria-label={`Language: ${language}`}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><circle cx="10" cy="10" r="8.333"/><path d="M1.667 10h16.666M10 1.667c2.084 2.282 3.269 5.243 3.333 8.333-.064 3.09-1.249 6.051-3.333 8.333C7.916 16.051 6.731 13.09 6.667 10 6.731 6.91 7.916 3.949 10 1.667Z"/></svg><span>{language}</span></Button>} items={['EN','CN','FR','JA','ES'].map(code=>({id:code,label:code,onSelect:()=>setLanguage(code)}))}/>
  <Dialog title="Cart" description="Your shopping cart" trigger={<Button variant="ghost" size="sm" aria-label="Cart"><img src="./scene-assets/header-cart.svg" alt=""/></Button>}><p>Your cart is empty.</p><a href={website+'#shop'}>Explore the CRYSOUND shop</a></Dialog>
  <Dialog title="Account" description="CRYSOUND account" trigger={<Button variant="ghost" size="sm" aria-label="Account"><img src="./scene-assets/header-login.svg" alt=""/></Button>}><p>Manage your account on the CRYSOUND website.</p><a href={website+'#auth/sign-in'}>Visit CRYSOUND</a></Dialog>
  <Dialog title="Search" description="Find products" trigger={<Button variant="ghost" size="sm" aria-label="Search"><img src="./scene-assets/header-search.svg" alt=""/></Button>}><Input label="Search products" type="search" value={search} onChange={e=>setSearch(e.target.value)}/><ul className="brand-header-search-results">{products.filter(p=>!search||`${p.title} ${p.description}`.toLowerCase().includes(search.toLowerCase())).map(p=><li key={p.image}><strong>{p.title}</strong><p>{p.description}</p></li>)}</ul>{search&&!products.some(p=>`${p.title} ${p.description}`.toLowerCase().includes(search.toLowerCase()))&&<p>No products found.</p>}</Dialog>
 </div>;
 return <header className="scene-brand-header"><NavigationMenu shape="capsule" panelVariant="website" className="brand-website-navigation" label="Brand website navigation" brand={<a href="#scene/brand" aria-label="CRYSOUND home"><img src="./crysound-logo.svg" alt="CRYSOUND"/></a>} actions={tools} items={brandNavigationItems} activateOnHover collapsible mobileToggleLabels={{open:'Open navigation',close:'Close navigation'}}/></header>;
}
