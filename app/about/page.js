import Link from 'next/link';
import { site, features } from '@/lib/site';
import PlotArt from '@/components/PlotArt';
import TiltCard from '@/components/TiltCard';
import FeatureFlipCard from '@/components/FeatureFlipCard';
import MagneticButton from '@/components/MagneticButton';
import { Reveal, SplitText, Watermark, FadeIn, GoldDivider } from '@/components/motion';
import { ArrowRight } from '@/components/Icons';

export const metadata = {
  title: 'About Us',
  description: `Learn about ${site.name} — our values, our approach to clear documentation and how we help families and investors find the right plot.`,
  alternates: { canonical: '/about' },
};

const values = [
  { t: 'Integrity', d: 'We share information plainly — sizes, locations and paperwork details — before you ask.' },
  { t: 'Clarity', d: 'No hidden terms. Every plot comes with straight answers and documentation shared openly.' },
  { t: 'Care', d: 'Buying land is a big decision. We stay with you from first call to registration.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero noise">
        <Watermark variant="dark" position="right" opacity={0.07} />
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span aria-current="page">About</span>
          </nav>
          <SplitText as="h1" className="h-xl" text="About *Brothers* Prime" waitForSite />
          <FadeIn waitForSite delay={0.5}>
            <p className="lead">{site.tagline}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section section--cream noise">
        <Watermark variant="light" position="right" />
        <div className="container grid-2">
          <div>
            <Reveal><span className="eyebrow">Our Story</span></Reveal>
            <SplitText as="h2" className="h-lg" text="Land You Can *Trust*" />
            <Reveal delay={0.1}>
              <p className="lead" style={{ marginTop: 16 }}>
                {site.name} presents carefully selected residential, commercial and farm plots in growing locations. Our approach is simple: honest guidance, clear documentation and a team that is easy to reach.
              </p>
              <p style={{ color: 'var(--muted)' }}>
                {/* PLACEHOLDER: replace with the client's approved company story, founding year and team details. */}
                Whether you are building your first home or investing for the future, we help you compare options, visit the site and decide with confidence.
              </p>
              <MagneticButton href="/projects" className="btn btn--navy">
                View Projects <ArrowRight width={18} height={18} />
              </MagneticButton>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <TiltCard max={7}>
              <div style={{ borderRadius: 28, overflow: 'hidden', aspectRatio: '4/3.2', border: '1px solid rgba(201,132,0,.45)', boxShadow: '0 40px 80px -40px rgba(7,21,38,.7)' }}>
                <PlotArt seed={5} hue="steel" label="Illustration of a planned plot development" />
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="section section--dark noise">
        <Watermark variant="dark" position="center" opacity={0.06} />
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 720, marginInline: 'auto', marginBottom: 48 }}>
            <Reveal><span className="eyebrow">Our Values</span></Reveal>
            <SplitText as="h2" className="h-lg" text="What We *Stand* For" />
            <GoldDivider style={{ marginTop: 22 }} />
          </div>
          <div className="grid-3">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.1}>
                <TiltCard>
                  <div className="glass" style={{ padding: 32, height: '100%' }}>
                    <h3 className="depth-1" style={{ marginBottom: 10 }}>{v.t}</h3>
                    <p className="depth-1" style={{ margin: 0, color: '#b9c6d8' }}>{v.d}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream noise">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Reveal><span className="eyebrow">Why Choose Us</span></Reveal>
            <SplitText as="h2" className="h-lg" text="The Prime *Difference*" />
          </div>
          <div className="grid-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}><FeatureFlipCard feature={f} /></Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
