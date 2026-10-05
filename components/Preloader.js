'use client';

/**
 * Preloader — cinematic intro.
 *   1. A gold outline of the logo (roofs + towers) draws itself
 *   2. The real logo icon fades in and a gold shimmer sweeps across it
 *   3. A progress line fills, then the navy curtain splits open to reveal the site
 * Runs once per browser session (a tiny inline script in layout.js sets
 * html[data-seen="1"] on repeat visits so it never flashes). Skipped for
 * prefers-reduced-motion. Timeline is built with GSAP.
 */
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { settings } from '@/lib/settings';

// Simplified outline of the logo mark in a 1144 x 488 box
const PATHS = [
  // left roof
  'M12 440 L300 150 L520 360',
  // right roof
  'M1132 440 L860 150 L640 360',
  // centre gable
  'M350 458 L572 330 L794 458 Z',
  // towers
  'M390 330 L390 120 L470 90 L470 250',
  'M505 360 L505 30 L640 0 L640 330',
  'M665 300 L665 140 L745 110 L745 270',
  // ground line
  'M0 470 L1144 470',
];

export default function Preloader() {
  const root = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const skip =
      !settings.enablePreloader ||
      html.dataset.seen === '1' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const announce = () => {
      window.__bppReady = true;
      window.dispatchEvent(new Event('bpp:ready'));
    };

    if (skip) {
      setDone(true);
      html.dataset.seen = '1';
      announce();
      return;
    }

    window.__lenis?.stop();
    document.body.style.overflow = 'hidden';

    const el = root.current;
    const paths = el.querySelectorAll('.pl-path');
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    const finish = () => {
      sessionStorage.setItem('bpp-seen', '1');
      html.dataset.seen = '1';
      document.body.style.overflow = '';
      window.__lenis?.start();
      setDone(true);
    };

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(el.querySelector('.preloader__name'), { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
      .to(paths, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.08 }, 0.1)
      .to(el.querySelector('.preloader__bar span'), { scaleX: 1, duration: 2.1, ease: 'power1.inOut' }, 0)
      .to(el.querySelector('.preloader__logo'), { opacity: 1, duration: 0.7, ease: 'power2.out' }, 1.1)
      .to(paths, { opacity: 0, duration: 0.5 }, 1.5)
      .fromTo(
        el.querySelector('.preloader__shimmer'),
        { x: '-120%', opacity: 1 },
        { x: '120%', duration: 0.9, ease: 'power2.inOut' },
        1.45,
      )
      .to(el.querySelector('.preloader__center'), { scale: 1.08, opacity: 0, duration: 0.5, ease: 'power2.in' }, 2.35)
      // curtain split
      .to(el.querySelector('.preloader__panel--top'), { yPercent: -101, duration: 0.95, ease: 'power4.inOut' }, 2.55)
      .to(el.querySelector('.preloader__panel--bottom'), { yPercent: 101, duration: 0.95, ease: 'power4.inOut' }, 2.55)
      // tell the hero (split text, count-ups) to start while the curtain opens
      .call(announce, null, 2.85);

    return () => {
      tl.kill();
      document.body.style.overflow = '';
      window.__lenis?.start();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="preloader" role="status" aria-label="Loading Brothers Prime Properties">
      <div className="preloader__panel preloader__panel--top" />
      <div className="preloader__panel preloader__panel--bottom" />
      <div className="preloader__center">
        <div className="preloader__emblem">
          <svg viewBox="-20 -20 1184 528" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="plgold" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#ffd467" />
                <stop offset="0.5" stopColor="#f2a900" />
                <stop offset="1" stopColor="#c98400" />
              </linearGradient>
              <filter id="plglow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#plglow)" stroke="url(#plgold)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              {PATHS.map((d, i) => (
                <path key={i} className="pl-path" d={d} />
              ))}
            </g>
          </svg>
          <div className="preloader__logo">
            <Image
              src="/logo-icon-on-dark.png"
              alt=""
              fill
              sizes="520px"
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="preloader__shimmer" aria-hidden="true" />
        </div>
        <div className="preloader__name">Brothers Prime Properties</div>
        <div className="preloader__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
