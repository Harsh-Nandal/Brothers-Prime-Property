'use client';

/**
 * Shared motion building blocks:
 *   useSiteReady  – true once the preloader curtain has started opening
 *   Reveal        – fade + rise + slight rotateX when scrolled into view
 *   SplitText     – staggered word / letter reveal (use *word* for gold words)
 *   CountUp       – animated number
 *   GoldDivider   – thin gold line that draws on scroll
 *   Watermark     – large faint logo with parallax (4–6 % opacity)
 *   Parallax      – moves its children slower/faster than the page
 * All use transform + opacity only.
 */
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];

/** True after the intro preloader has finished (or was skipped). */
export function useSiteReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.__bppReady || document.documentElement.dataset.seen === '1') {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener('bpp:ready', on);
    return () => window.removeEventListener('bpp:ready', on);
  }, []);
  return ready;
}

export function Reveal({ children, delay = 0, y = 44, rotate = true, className = '', as = 'div', once = true, ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, rotateX: rotate ? 9 : 0 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration: 0.95, ease: EASE, delay }}
      style={{ transformPerspective: 900, transformOrigin: '50% 100%' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * SplitText — `text` may contain *gold* words wrapped in asterisks.
 * `by="word"` (default) or `by="letter"`. `waitForSite` delays the reveal until
 * the preloader is done (use for the hero).
 */
export function SplitText({ text, as = 'h2', className = '', by = 'word', delay = 0, stagger, waitForSite = false }) {
  const ready = useSiteReady();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const go = waitForSite ? ready : inView;

  const Tag = motion[as] || motion.h2;
  const plain = text.replace(/\*/g, '');
  const words = text.split(' ').map((w) => {
    const gold = w.startsWith('*') && w.endsWith('*');
    return { w: w.replace(/\*/g, ''), gold };
  });
  const step = stagger ?? (by === 'letter' ? 0.028 : 0.085);

  let counter = 0;
  return (
    <Tag ref={ref} className={className} aria-label={plain}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.12em' }}>
            {(by === 'letter' ? word.w.split('') : [word.w]).map((chunk, ci) => {
              const i = counter++;
              return (
                <motion.span
                  key={ci}
                  className={word.gold ? 'gold-text' : undefined}
                  style={{ display: 'inline-block' }}
                  initial={{ y: '115%', rotate: 6, opacity: 0 }}
                  animate={go ? { y: '0%', rotate: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.9, ease: EASE, delay: delay + i * step }}
                >
                  {chunk}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

/** FadeIn — simple fade + rise. `waitForSite` holds it until the preloader is done. */
export function FadeIn({ children, delay = 0, y = 24, waitForSite = false, className = '', style, as = 'div' }) {
  const ready = useSiteReady();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const go = waitForSite ? ready : inView;
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={go ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

export function CountUp({ value, suffix = '', duration = 2.2, waitForSite = false }) {
  const ref = useRef(null);
  const ready = useSiteReady();
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const go = waitForSite ? ready && inView : inView;

  useEffect(() => {
    if (ref.current) ref.current.textContent = '0';
  }, []);

  useEffect(() => {
    if (!go || !ref.current) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString('en-IN');
      },
    });
    return () => controls.stop();
  }, [go, value, duration]);

  return (
    <span className="gold-text">
      <span ref={ref}>{value.toLocaleString('en-IN')}</span>
      {suffix}
    </span>
  );
}

export function GoldDivider({ className = '', style }) {
  return (
    <motion.div
      className={`gold-divider ${className}`}
      style={style}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.6, ease: EASE }}
      aria-hidden="true"
    />
  );
}

/** Large faint logo behind a section. variant: "light" bg or "dark" bg. */
export function Watermark({ variant = 'light', position = 'right', opacity }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  const src = variant === 'dark' ? '/logo-icon-on-dark.png' : '/logo-icon-only.png';
  return (
    <div ref={ref} className={`watermark watermark--${position}`} style={opacity ? { opacity } : undefined} aria-hidden="true">
      <motion.div style={{ y }}>
        <Image src={src} alt="" width={1144} height={488} sizes="(max-width: 900px) 90vw, 900px" style={{ width: '100%', height: 'auto' }} />
      </motion.div>
    </div>
  );
}

/** Parallax wrapper: speed 0.2 = drifts 20 % of the section height. */
export function Parallax({ children, speed = 0.2, className = '', style }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  return (
    <div ref={ref} className={className} style={style}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
