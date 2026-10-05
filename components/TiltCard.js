'use client';

/**
 * TiltCard — vanilla-tilt style 3D hover card.
 *  - perspective + rotateX/rotateY that follow the pointer (spring smoothed)
 *  - moving glare highlight, gold border glow, smooth lift on hover
 *  - children can use .depth-1 / .depth-2 classes to float above the card (translateZ)
 * Touch devices and reduced-motion users get a plain card.
 */
import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export default function TiltCard({ children, className = '', max = 10, glare = true, lift = -8, scale = 1.02 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.6 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.6 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,236,170,0.75), rgba(255,255,255,0) 55%)`;

  const onMove = (e) => {
    if (reduce || e.pointerType === 'touch' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  };

  return (
    <div className="tilt-wrap" style={{ height: '100%' }}>
      <motion.div
        ref={ref}
        className={`tilt ${className}`}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100, height: '100%' }}
        whileHover={reduce ? undefined : { y: lift, scale }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {children}
        <span className="tilt__glow" aria-hidden="true" />
        {glare && <motion.span className="tilt__glare" aria-hidden="true" style={{ background: glareBg }} />}
      </motion.div>
    </div>
  );
}
