'use client';

/**
 * Shell — the persistent chrome around every page: smooth scroll, preloader,
 * custom cursor, scroll progress bar, navbar, footer, WhatsApp button and the
 * route-transition curtain. `MotionConfig reducedMotion="user"` makes every
 * framer-motion animation respect the OS "reduce motion" setting.
 */
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/Preloader';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import PageTransition from '@/components/PageTransition';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export default function Shell({ children, footer }) {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <Preloader />
      <CustomCursor />
      <ScrollProgress />
      <PageTransition />
      <Navbar />
      <main id="main">{children}</main>
      {footer}
      <WhatsAppButton />
    </MotionConfig>
  );
}
