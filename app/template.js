'use client';

/**
 * template.js re-mounts on every navigation, which makes it the right place for
 * the "reveal" half of the page transition: a navy curtain (already covering the
 * screen from PageTransition) slides up and the new page fades + rises in.
 * The very first page load is skipped (the preloader handles that).
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

let firstLoad = true;

export default function Template({ children }) {
  // false on the server and on the first hydration; true for client-side navigations
  const [reveal] = useState(() => !firstLoad);
  const [curtain, setCurtain] = useState(reveal);

  useEffect(() => {
    firstLoad = false;
    if (reveal) {
      window.__lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
  }, [reveal]);

  return (
    <>
      {curtain && (
        <motion.div
          className="route-curtain"
          initial={{ y: '0%' }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.12 }}
          onAnimationComplete={() => setCurtain(false)}
          aria-hidden="true"
        />
      )}
      <motion.div
        initial={reveal ? { opacity: 0, y: 36 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: reveal ? 0.35 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
