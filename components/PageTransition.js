'use client';

/**
 * PageTransition — smooth route changes.
 *  1. Clicking an internal link slides a navy "curtain" up over the current page.
 *  2. The route changes while the screen is covered.
 *  3. app/template.js (the new page) slides the curtain away and fades the page in.
 * Skipped for reduced motion, modified clicks, new tabs, downloads and #hash links.
 */
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [covering, setCovering] = useState(false);
  const pending = useRef(null);

  // new page mounted -> hand over to template.js's reveal curtain
  useEffect(() => {
    setCovering(false);
    pending.current = null;
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page / hash only
      if (url.pathname.startsWith('/api/')) return;

      e.preventDefault();
      if (pending.current) return;
      pending.current = url.pathname + url.search;
      setCovering(true);
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), 560);
      // safety: never leave the screen covered
      window.setTimeout(() => setCovering(false), 5000);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return (
    <AnimatePresence>
      {covering && (
        <motion.div
          className="route-curtain"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ opacity: 1, transition: { duration: 0 } }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <motion.div
            style={{ width: 'min(260px, 50vw)', aspectRatio: '1144 / 488', position: 'relative' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <Image src="/logo-icon-on-dark.png" alt="" fill sizes="260px" style={{ objectFit: 'contain' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
