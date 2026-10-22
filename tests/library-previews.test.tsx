import React from 'react';
import {expect,it} from 'vitest';
import {render,cleanup} from '@testing-library/react';
import {docCategories,PreviewThumbnail} from '../apps/docs/src/docs-layout';
import {catalog} from '../apps/docs/src/catalog';
it('provides a specific thumbnail and category entry for every catalog component',()=>{
  const listed=docCategories.flatMap(category=>category.ids);
  expect(new Set(listed).size).toBe(listed.length);
  expect([...listed].sort()).toEqual(catalog.map(component=>component.id).sort());
  for(const id of listed){
    const {container}=render(<PreviewThumbnail id={id}/>);
    expect(container.querySelector('[data-preview-fallback]'),id).toBeNull();
    expect(container.firstElementChild,id).not.toBeNull();
    cleanup();
  }
});

it('offers one empty-state entry after consolidating page emptiness',()=>{
  const listed=docCategories.flatMap(category=>category.ids);
  expect(listed.filter(id=>id.startsWith('empty-'))).toEqual(['empty-state']);
  expect(catalog.filter(component=>component.id.startsWith('empty-')).map(component=>component.name)).toEqual(['EmptyState']);
});
