'use client';

/**
 * CustomCursor — gold dot + lagging ring (desktop with a fine pointer only).
 * Uses transforms only (GPU friendly). The ring grows over links, buttons and
 * anything marked with data-cursor="hover".
 */
import { useEffect, useRef } from 'react';
import { settings } from '@/lib/settings';

export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!settings.enableCursor) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let shown = false; // reveal the cursor only after the first real mouse move
    let x = window.innerWidth / 2,
      y = window.innerHeight / 2,
      rx = x,
      ry = y,
      raf;

    const move = (e) => {
      if (!shown) {
        shown = true;
        document.documentElement.classList.add('has-cursor');
      }
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e) => {
      const hit = e.target.closest?.('a, button, [role="button"], [data-cursor="hover"], summary, label');
      ring.current?.classList.toggle('is-hover', !!hit);
    };
    const leave = () => {
      if (dot.current) dot.current.style.opacity = 0;
      if (ring.current) ring.current.style.opacity = 0;
    };
    const enter = () => {
      if (dot.current) dot.current.style.opacity = '';
      if (ring.current) ring.current.style.opacity = '';
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    document.documentElement.addEventListener('pointerenter', enter);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.documentElement.removeEventListener('pointerenter', enter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
