'use client';

/**
 * HorizontalShowcase — featured projects in a horizontal-scroll gallery driven
 * by vertical scrolling (sticky container + translateX mapped from scroll
 * progress). On phones / reduced motion it becomes a normal vertical stack.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import MagneticButton from '@/components/MagneticButton';
import { ArrowRight } from '@/components/Icons';
import { useCapabilities } from '@/lib/useCapabilities';

export default function HorizontalShowcase({ projects }) {
  const caps = useCapabilities();
  const section = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const scrollTarget = caps.ready && !caps.isPhone && !caps.reducedMotion && viewportWidth >= 900 ? section : undefined;
  const { scrollYProgress } = useScroll({ target: scrollTarget, offset: ['start start', 'end end'] });

  // horizontal travel = track width − viewport width
  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };

    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
      measure();
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [caps.ready, projects.length]);

  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);

  const stacked = !caps.ready || caps.isPhone || caps.reducedMotion || viewportWidth < 900;

  const head = (
    <div className="container hshow__head">
      <span className="eyebrow">Featured Projects</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 20 }}>
        <h2 className="h-lg" style={{ margin: 0 }}>
          Plots Worth <span className="gold-text">Investing</span> In
        </h2>
        <MagneticButton href="/projects" className="btn btn--ghost">
          All Projects <ArrowRight width={18} height={18} />
        </MagneticButton>
      </div>
    </div>
  );

  if (stacked) {
    return (
      <section className="section section--dark noise" aria-label="Featured projects">
        {head}
        <div className="container grid-3" style={{ marginTop: 40 }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} dark />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={section}
      className="hshow section--dark noise"
      style={{ height: `calc(100svh + ${Math.round(dist * 1.15)}px)`, background: 'radial-gradient(1200px 600px at 80% -10%, #12304f55, transparent 60%), var(--navy-900)', color: 'var(--cream)', position: 'relative', isolation: 'isolate' }}
      aria-label="Featured projects"
    >
      <div className="hshow__sticky">
        {head}
        <motion.div ref={track} className="hshow__track" style={{ x }}>
          {projects.map((p, i) => (
            <div key={p.slug} className="hshow__item">
              <ProjectCard project={p} index={i} dark />
            </div>
          ))}
        </motion.div>
        <div className="hshow__bar" aria-hidden="true">
          <motion.span style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  );
}
