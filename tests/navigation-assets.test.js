import {it,expect} from 'vitest';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import data from '../apps/docs/src/brand-navigation-data.json';
it('includes every referenced local menu image and a populated destination for every subtype',()=>{
 const paths=new Set();for(const collection of Object.values(data.products.collections)){expect(collection.products.length).toBeGreaterThan(0);for(const product of collection.products){expect(product.href).toMatch(/^https:\/\//);product.images.forEach(image=>paths.add(image));}}
 data.products.featured.forEach(product=>product.images.forEach(image=>paths.add(image)));data.solutions.cards.forEach(card=>paths.add(card.image));data.menus.forEach(menu=>menu.links.forEach(link=>paths.add(link.image)));
 for(const image of paths){
  expect(image).toMatch(/^\.\//);
  expect(new URL(image,'https://example.com/design-system/').pathname).toMatch(/^\/design-system\//);
  expect(existsSync(resolve('apps/docs/public',image)),image).toBe(true);
 }
 expect(data.products.categories).toHaveLength(5);expect(data.solutions.cards).toHaveLength(27);
});
