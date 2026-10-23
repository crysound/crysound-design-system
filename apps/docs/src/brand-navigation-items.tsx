import type {CSSProperties} from 'react';
import {NavigationPanelMedia,type NavigationMenuItem,type NavigationMenuLink} from '../../../packages/ui/src/index';
import data from './brand-navigation-data.json';
import previews from './brand-navigation-previews.json';
import './brand-navigation-media.css';

const website='https://crysound-website.ya-wang346019.chatgpt.site/';
interface Product {label:string;href:string;images:string[];crop:string|number;}
const collections:Record<string,{label:string;href:string;products:Product[]}>=data.products.collections;
function productLink(product:Product):NavigationMenuLink {
 return {label:product.label,href:product.href,media:<NavigationPanelMedia className="brand-nav-product" data-crop={product.crop} fit="contain" sources={product.images.map(src=>({src,preview:(previews as Record<string,string>)[src]}))}/>};
}
const unique=(products:Product[])=>[...new Map(products.map(p=>[p.href,p])).values()];
const solutionLinks=data.solutions.cards.map(card=>({label:card.label,href:card.href,media:<span className="brand-nav-solution-icon"><span aria-hidden="true" data-large={card.large||undefined} style={{'--solution-icon-url':`url("${card.image}")`} as CSSProperties}/></span>,groups:card.groups}));
export const brandNavigationItems:NavigationMenuItem[]=[
 {id:'products',label:'Products',layout:'catalog',neutralInitialSelection:true,catalogLabels:{categories:'Product categories',products:'Featured products'},products:data.products.featured.map(productLink),groups:data.products.categories.map(category=>({title:category.title,links:category.collections.map(key=>{const collection=collections[key];return{label:collection.label,href:collection.href,products:collection.products.map(productLink)};}),products:unique(category.collections.flatMap(key=>collections[key].products)).map(productLink)})),footer:{label:'Products home',href:website+'#product-line/acoustic-imaging'}},
 {id:'solutions',label:'Solutions',layout:'catalog',neutralInitialSelection:true,catalogLabels:{categories:'Solution navigation groups',products:'Featured solutions'},products:solutionLinks,groups:data.solutions.groups.map(group=>({title:group.title,links:group.links.map(link=>({label:link.label,href:website+'#solutions/all?category='+encodeURIComponent(link.group!),products:solutionLinks.filter(card=>card.groups.includes(link.group!))})),products:solutionLinks.filter(card=>card.groups.includes(group.group))})),footer:{label:'Solutions home',href:website+'#solutions/all'}},
 ...data.menus.map(menu=>({...menu,layout:'cards' as const})),
 {id:'about',label:'About Us',href:website+'#why-crysound'},
 {id:'shop',label:'Shop',href:website+'#shop'},
];
