'use client';

/**
 * SmoothScroll — Lenis inertia scrolling for the whole site.
 * - Disabled for prefers-reduced-motion and when NEXT_PUBLIC_DISABLE_SMOOTH=true
 * - The Lenis instance is exposed on window.__lenis so other components
 *   (preloader, route transitions) can stop/start or jump to the top.
 */
import { useEffect } from 'react';
import Lenis from 'lenis';
import { settings } from '@/lib/settings';

export default function SmoothScroll() {
  useEffect(() => {
    if (!settings.enableSmoothScroll) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // keep native touch scrolling on phones (more reliable, better battery)
      syncTouch: false,
    });
    window.__lenis = lenis;

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // anchor links (#id) scroll smoothly
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: -80 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
