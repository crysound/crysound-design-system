"use client";
import { useEffect, useRef, useState } from 'react';

function RollingDigit({ digit, active }: { digit: number; active: boolean }) {
  const track = useRef<HTMLSpanElement>(null);
  const motion = useRef({ position: 0, velocity: 0 });
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const target = active ? digit : 0;
    let frame = 0;
    let previous = performance.now();
    const paint = () => {
      if (track.current) track.current.style.transform = `translateY(${-motion.current.position}em)`;
    };
    const snap = () => { cancelAnimationFrame(frame); motion.current = { position: target, velocity: 0 }; paint(); };
    if (media?.matches) { snap(); return; }
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.04);
      previous = now;
      // Exact critically damped spring step; re-targeting retains position and velocity.
      const omega = 18;
      const offset = motion.current.position - target;
      const combined = motion.current.velocity + omega * offset;
      const decay = Math.exp(-omega * dt);
      motion.current.position = target + (offset + combined * dt) * decay;
      motion.current.velocity = (motion.current.velocity - omega * combined * dt) * decay;
      paint();
      if (Math.abs(motion.current.position - target) < 0.001 && Math.abs(motion.current.velocity) < 0.01) snap();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const reduce = () => { if (media?.matches) snap(); };
    media?.addEventListener('change', reduce);
    return () => { cancelAnimationFrame(frame); media?.removeEventListener('change', reduce); };
  }, [digit, active]);
  return <span className="cs-number-digit"><span className="cs-number-track" ref={track}>{Array.from({ length: 10 }, (_, number) => <span key={number}>{number}</span>)}</span></span>;
}

export function AnimatedNumber({ value }: { value: number | string }) {
  const root = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const text = String(value);
  useEffect(() => {
    if (!root.current || typeof IntersectionObserver === 'undefined') { setActive(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setActive(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <span ref={root} className="cs-animated-number" role="img" aria-label={text}><span aria-hidden="true" className="cs-number-visual">{Array.from(text).map((character, index) => /[0-9]/.test(character) ? <RollingDigit key={text.length - index} digit={Number(character)} active={active} /> : <span className="cs-number-symbol" key={text.length - index}>{character}</span>)}</span></span>;
}
