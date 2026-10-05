'use client';

/**
 * Gallery3D — coverflow-style 3D carousel built with CSS 3D transforms
 * (perspective + rotateY + translateZ), animated with framer-motion springs.
 * Works for real photos (next/image) or the illustrated placeholders.
 * Drag / swipe, arrow keys, buttons, dots and autoplay (pauses on hover/focus).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import PlotArt from '@/components/PlotArt';
import { ArrowLeft, ArrowRight } from '@/components/Icons';
import { settings } from '@/lib/settings';

export default function Gallery3D({ slides, name }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const drag = useRef({ x: 0, down: false });
  const n = slides.length;

  const go = useCallback((i) => setActive(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || reduce || n < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), settings.gallery.autoplayMs);
    return () => clearInterval(id);
  }, [paused, reduce, n]);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(active + 1);
    if (e.key === 'ArrowLeft') go(active - 1);
  };

  const shortest = (i) => {
    // signed distance around the ring so the carousel loops visually
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  return (
    <div
      className="cover"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${name} gallery`}
      tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="cover__stage"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, down: true };
        }}
        onPointerUp={(e) => {
          if (!drag.current.down) return;
          const dx = e.clientX - drag.current.x;
          drag.current.down = false;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
        }}
        onPointerLeave={() => (drag.current.down = false)}
      >
        {slides.map((s, i) => {
          const d = shortest(i);
          const abs = Math.abs(d);
          const visible = abs <= 2;
          return (
            <motion.div
              key={i}
              className={`cover__slide${d === 0 ? ' is-active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={d !== 0}
              initial={false}
              animate={{
                x: reduce ? d * 120 : `${d * 62}%`,
                z: reduce ? 0 : -abs * 190,
                rotateY: reduce ? 0 : d === 0 ? 0 : d > 0 ? -48 : 48,
                scale: d === 0 ? 1 : 0.86,
                opacity: visible ? 1 - abs * 0.28 : 0,
              }}
              transition={{ type: 'spring', stiffness: 130, damping: 20, mass: 0.9 }}
              style={{ zIndex: 10 - abs, pointerEvents: visible ? 'auto' : 'none' }}
              onClick={() => d !== 0 && go(i)}
            >
              {s.src ? (
                <Image src={s.src} alt={s.alt || `${name} photo ${i + 1}`} fill sizes="(max-width: 760px) 70vw, 640px" style={{ objectFit: 'cover' }} draggable={false} />
              ) : (
                <PlotArt seed={s.seed} hue={s.hue} label={s.alt || `${name} illustration ${i + 1}`} />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="cover__ctrl">
        <button className="round-btn" onClick={() => go(active - 1)} aria-label="Previous slide">
          <ArrowLeft width={22} height={22} />
        </button>
        <div className="cover__dots">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === active} />
          ))}
        </div>
        <button className="round-btn" onClick={() => go(active + 1)} aria-label="Next slide">
          <ArrowRight width={22} height={22} />
        </button>
      </div>
      <p className="cover__caption" aria-live="polite">
        {slides[active].caption || `${name} · ${active + 1} / ${n}`}
      </p>
    </div>
  );
}
