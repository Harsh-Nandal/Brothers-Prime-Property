'use client';

/**
 * ScrollScene — scroll-driven 3D storytelling section for the home page.
 *   Desktop: a tall section with a pinned (sticky) WebGL canvas; as you scroll
 *            the low-poly house/towers assemble and the camera changes angle
 *            between four story steps.
 *   Phones / reduced motion / low power: a light static version with
 *            illustrated cards (no WebGL, no pinned scrolling).
 */
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useCapabilities, useInView } from '@/lib/useCapabilities';
import { Reveal } from '@/components/motion';
import PlotArt from '@/components/PlotArt';

const StoryScene = dynamic(() => import('@/components/three/StoryScene'), { ssr: false });

export const storySteps = [
  {
    n: '01',
    title: 'Find Your Plot',
    text: 'Start with the land. Browse plots across prime locations and shortlist the ones that fit your budget, size and plans.',
  },
  {
    n: '02',
    title: 'Check Every Detail',
    text: 'Review layouts, sizes and documentation details with our team — clear answers, shared openly, before you decide.',
  },
  {
    n: '03',
    title: 'Picture Your Home',
    text: 'See how your plot can come to life — a home on your own land, in a neighbourhood that is growing around you.',
  },
  {
    n: '04',
    title: 'Move In With Confidence',
    text: 'From site visit to registration we stay beside you, so the day you get your keys feels as good as it should.',
  },
];

export default function ScrollScene() {
  const caps = useCapabilities();
  const section = useRef(null);
  const sticky = useRef(null);
  const inView = useInView(sticky, '0px');
  const [step, setStep] = useState(0);
  const full = caps.ready && caps.tier === 'high';
  const { scrollYProgress } = useScroll({ target: full ? section : undefined, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(3, Math.max(0, Math.floor(v * 4)))));

  if (!full) {
    // lightweight static story
    return (
      <section className="story" aria-labelledby="story-title" style={{ padding: '90px 0' }}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">The Journey</span>
            <h2 id="story-title" className="h-lg">
              From Land to <span className="gold-text">Landmark</span>
            </h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 40, alignItems: 'start' }}>
            <Reveal>
              <div style={{ borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(255,212,103,.35)', aspectRatio: '16/11' }}>
                <PlotArt seed={4} hue="gold" label="Illustration of a plot development at dusk" />
              </div>
            </Reveal>
            <div className="story-static">
              {storySteps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.06}>
                  <div className="glass">
                    <div className="num" style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-300)', fontWeight: 800 }}>
                      {s.n}
                    </div>
                    <h3 style={{ margin: '4px 0 6px' }}>{s.title}</h3>
                    <p style={{ margin: 0, color: '#b9c6d8' }}>{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="story" style={{ height: '520vh' }} aria-labelledby="story-title">
      <div ref={sticky} className="story__sticky">
        <div className="story__canvas">
          <StoryScene progress={scrollYProgress} active={inView} />
        </div>

        <div className="story__copy">
          <div className="container" style={{ position: 'relative', height: '100%' }}>
            <div style={{ position: 'absolute', left: 0, top: 'calc(var(--nav-h) + 24px)' }}>
              <span className="eyebrow">The Journey</span>
              <h2 id="story-title" className="h-md" style={{ marginBottom: 0 }}>
                From Land to <span className="gold-text">Landmark</span>
              </h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                className="story__step glass"
                style={{ left: 0, bottom: '12vh', padding: '28px 30px', position: 'absolute' }}
                initial={{ opacity: 0, y: 40, rotateX: 12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="num">{storySteps[step].n}</div>
                <h3 className="h-md" style={{ marginBottom: 8 }}>
                  {storySteps[step].title}
                </h3>
                <p style={{ margin: 0, color: '#c4d0e0' }}>{storySteps[step].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="story__dots" aria-hidden="true">
          {storySteps.map((s, i) => (
            <i key={s.n} className={i === step ? 'on' : ''} />
          ))}
        </div>
      </div>
    </section>
  );
}
