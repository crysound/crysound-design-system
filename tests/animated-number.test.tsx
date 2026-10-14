import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { Metric } from '../packages/ui/src/index';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('shows exact updated values without rolling when reduced motion is requested', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  const { rerender } = render(<Metric label="声压级" value="68.4" unit="dB SPL" animate />);
  const number = screen.getByRole('img', { name: '68.4' });
  expect(Array.from(number.querySelectorAll<HTMLElement>('.cs-number-track')).map(track => track.style.transform)).toEqual(['translateY(-6em)', 'translateY(-8em)', 'translateY(-4em)']);
  rerender(<Metric label="声压级" value="52.1" unit="dB SPL" animate />);
  expect(screen.getByRole('img', { name: '52.1' })).toBeInTheDocument();
  expect(screen.getByText('dB SPL')).toBeInTheDocument();
  expect(Array.from(number.querySelectorAll<HTMLElement>('.cs-number-track')).map(track => track.style.transform)).toEqual(['translateY(-5em)', 'translateY(-2em)', 'translateY(-1em)']);
});
