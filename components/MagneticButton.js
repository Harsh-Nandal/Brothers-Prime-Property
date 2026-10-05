'use client';

/**
 * MagneticButton — a button / link that is gently pulled toward the cursor.
 * Pass `href` for a link (internal → next/link, http → <a>) or `onClick` for a button.
 * Visual style comes from the classes: btn btn--gold | btn--ghost | btn--navy.
 */
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export default function MagneticButton({
  href,
  onClick,
  children,
  className = 'btn btn--gold',
  strength = 0.32,
  type = 'button',
  external,
  ...rest
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.5 });

  const move = (e) => {
    if (reduce || e.pointerType === 'touch' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  const isExternal = external ?? (href && /^(https?:|tel:|mailto:)/.test(href));
  const inner = (
    <motion.span ref={ref} style={{ x, y, display: 'inline-block' }} onPointerMove={move} onPointerLeave={leave} whileTap={{ scale: 0.96 }}>
      {href ? (
        isExternal ? (
          <a href={href} className={className} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" {...rest}>
            {children}
          </a>
        ) : (
          <Link href={href} className={className} {...rest}>
            {children}
          </Link>
        )
      ) : (
        <button type={type} className={className} onClick={onClick} {...rest}>
          {children}
        </button>
      )}
    </motion.span>
  );
  return inner;
}
