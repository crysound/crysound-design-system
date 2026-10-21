import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../packages/ui/src/navigation';

let now = 0;
let sequence = 0;
let resize = () => {};
let frames = new Map<number, FrameRequestCallback>();
let preferenceListeners = new Set<() => void>();
let media = {matches: false, addEventListener: (_: string, listener: () => void) => {preferenceListeners.add(listener);}, removeEventListener: (_: string, listener: () => void) => {preferenceListeners.delete(listener);}};
let geometry: Record<string, {x: number; width: number}>;

beforeEach(() => {
  now = 0; sequence = 0; frames = new Map(); preferenceListeners = new Set();
  media = {...media, matches: false};
  geometry = {a: {x: 4, width: 80}, b: {x: 88, width: 120}, c: {x: 212, width: 100}};
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('matchMedia', () => media);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {frames.set(++sequence, callback); return sequence;});
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {frames.delete(id);});
  vi.stubGlobal('ResizeObserver', class {
    constructor(callback: () => void) {resize = callback;}
    observe() {}
    disconnect() {}
  });
  for (const property of ['offsetLeft', 'offsetWidth', 'offsetTop', 'offsetHeight'] as const) {
    vi.spyOn(HTMLElement.prototype, property, 'get').mockImplementation(function(this: HTMLElement) {
      const box = geometry[this.dataset.testid ?? ''];
      if (!box) return 0;
      return property === 'offsetLeft' ? box.x : property === 'offsetWidth' ? box.width : property === 'offsetTop' ? 4 : 40;
    });
  }
});
afterEach(() => {cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals();});

function Fixture() {
  return <Tabs defaultValue="a"><TabsList variant="pill" shape="capsule" tone="brand" aria-label="分类"><TabsTrigger value="a" data-testid="a">全部产品</TabsTrigger><TabsTrigger value="b" data-testid="b" disabled>不可用分类</TabsTrigger><TabsTrigger value="c" data-testid="c">数据采集</TabsTrigger></TabsList><TabsContent value="a">全部内容</TabsContent><TabsContent value="c">采集内容</TabsContent></Tabs>;
}
function step() {
  act(() => {now += 16; const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(now));});
}
function settle() {for (let count = 0; count < 100 && frames.size; count++) step();}
const position = (indicator: HTMLElement) => Number(indicator.style.transform.match(/translateX\(([-.\d]+)px\)/)?.[1]);
async function choose(name: string) {
  await act(async () => {fireEvent.mouseDown(screen.getByRole('tab', {name}), {button: 0, ctrlKey: false});});
}

it('updates content immediately and redirects a moving capsule from its current presentation', async () => {
  const view = render(<Fixture/>);
  const indicator = view.container.querySelector<HTMLElement>('.cs-tabs-indicator')!;
  expect(position(indicator)).toBe(4);
  expect(screen.getAllByRole('tab')).toHaveLength(3);
  expect(screen.getByRole('tab', {name: '全部产品'})).toHaveAccessibleName('全部产品');
  await choose('数据采集');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('采集内容');
  expect(position(indicator)).toBe(4);
  for (let frame = 0; frame < 4; frame++) step();
  const interrupted = position(indicator);
  expect(interrupted).toBeGreaterThan(4);
  expect(interrupted).toBeLessThan(212);
  await choose('全部产品');
  expect(position(indicator)).toBe(interrupted);
  expect(screen.getByRole('tabpanel')).toHaveTextContent('全部内容');
  settle();
  expect(position(indicator)).toBe(4);
  expect(indicator.style.width).toBe('80px');
  expect(frames.size).toBe(0);
});

it('keeps an in-flight selection aligned after its layout changes and cancels work on unmount', async () => {
  const view = render(<Fixture/>);
  const indicator = view.container.querySelector<HTMLElement>('.cs-tabs-indicator')!;
  await choose('数据采集'); step(); step();
  const interrupted = position(indicator);
  geometry.c = {x: 252, width: 140};
  act(() => resize());
  expect(position(indicator)).toBe(interrupted);
  settle();
  expect(position(indicator)).toBe(252);
  expect(indicator.style.width).toBe('140px');
  await choose('全部产品'); step();
  view.unmount();
  expect(frames.size).toBe(0);
  expect(preferenceListeners.size).toBe(0);
});

it('snaps when reduced motion is enabled initially or during a transition', async () => {
  media.matches = true;
  const view = render(<Fixture/>);
  const indicator = view.container.querySelector<HTMLElement>('.cs-tabs-indicator')!;
  await choose('数据采集');
  expect(position(indicator)).toBe(212);
  step(); // Flush Radix's initial panel animation bookkeeping.
  expect(frames.size).toBe(0);
  act(() => {media.matches = false; preferenceListeners.forEach(listener => listener());});
  await choose('全部产品'); step();
  expect(position(indicator)).toBeGreaterThan(4);
  act(() => {media.matches = true; preferenceListeners.forEach(listener => listener());});
  expect(position(indicator)).toBe(4);
  expect(frames.size).toBe(0);
});
