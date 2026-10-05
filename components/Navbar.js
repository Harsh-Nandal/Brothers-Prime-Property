'use client';

/**
 * Navbar — transparent over the dark hero, turns into a cream glass bar with a
 * smaller logo once you scroll. Mobile: full-screen menu with staggered links.
 */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { nav, site, telLink, whatsappLink } from '@/lib/site';
import MagneticButton from '@/components/MagneticButton';
import { WhatsApp } from '@/components/Icons';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // close the menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  // lock scroll while the mobile menu is open
  useEffect(() => {
    if (open) {
      window.__lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      window.__lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <motion.header
        className={`nav${scrolled || open ? ' is-scrolled' : ''}`}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <div className="nav__inner">
          <Link href="/" className="brand" aria-label={`${site.name} — home`}>
            <span className="brand__logo">
              <Image className="on-dark" src="/logo-icon-on-dark.png" alt="" fill sizes="110px" priority style={{ objectFit: 'contain' }} />
              <Image className="on-light" src="/logo-icon-only.png" alt="" fill sizes="110px" priority style={{ objectFit: 'contain' }} />
            </span>
            <span className="brand__name">
              Brothers Prime
              <small>Properties</small>
            </span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {nav.map((l) => (
              <Link key={l.href} href={l.href} className="nav__link" aria-current={isActive(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav__cta">
            <MagneticButton href={whatsappLink()} className="btn btn--gold btn--sm" aria-label="Chat on WhatsApp">
              <WhatsApp width={18} height={18} /> Enquire Now
            </MagneticButton>
          </div>

          <button
            className="burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {nav.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={l.href} className="mobile-link" aria-current={isActive(l.href) ? 'page' : undefined}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              className="mobile-menu__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7 }}
            >
              <a href={telLink()}>{site.phone}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <MagneticButton href={whatsappLink()} className="btn btn--gold" style={{ marginTop: 10 }}>
                <WhatsApp width={20} height={20} /> WhatsApp Us
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
