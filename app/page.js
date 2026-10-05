import { site, stats, features, telLink, whatsappLink } from '@/lib/site';
import { getFeatured } from '@/lib/projects';
import Hero3DLoader from '@/components/Hero3DLoader';
import EnquiryForm from '@/components/EnquiryForm';
import Marquee from '@/components/Marquee';
import ScrollScene from '@/components/ScrollScene';
import HorizontalShowcase from '@/components/HorizontalShowcase';
import FeatureFlipCard from '@/components/FeatureFlipCard';
import MagneticButton from '@/components/MagneticButton';
import TiltCard from '@/components/TiltCard';
import PlotArt from '@/components/PlotArt';
import { CountUp, FadeIn, GoldDivider, Reveal, SplitText, Watermark } from '@/components/motion';
import { ArrowRight, Phone, WhatsApp } from '@/components/Icons';

export const metadata = {
  title: { absolute: `${site.name} — Premium Plots & Property Showcase` },
  description: site.description,
  alternates: { canonical: '/' },
};

const process = [
  { t: 'Enquire', d: 'Tell us what you are looking for — location, size and budget. We reply quickly on call or WhatsApp.' },
  { t: 'Visit the Site', d: 'We arrange a site visit so you can see the plot, the surroundings and the access for yourself.' },
  { t: 'Review the Documents', d: 'Go through layouts, sizes and documentation details with our team and ask every question you have.' },
  { t: 'Book & Register', d: 'Finalise your plot with guided support through booking, payment schedule and registration.' },
];

export default function HomePage() {
  const featured = getFeatured();

  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="hero noise" aria-labelledby="hero-title">
        <Hero3DLoader />
        <div className="container hero__grid">
          <div className="hero__copy">
            <FadeIn waitForSite delay={0.05}>
              <span className="hero__badge">
                <i /> {site.name}
              </span>
            </FadeIn>
            <SplitText as="h1" className="h-xl" text="Premium Plots in *Prime* Locations" waitForSite delay={0.15} />
            <FadeIn waitForSite delay={0.7}>
              <p className="lead">
                Carefully selected residential and commercial plots with clear documentation and honest guidance — from your first enquiry to registration.
              </p>
            </FadeIn>
            <FadeIn waitForSite delay={0.85} className="hero__actions">
              <MagneticButton href="/projects" className="btn btn--gold">
                Explore Projects <ArrowRight width={18} height={18} />
              </MagneticButton>
              <MagneticButton href={whatsappLink()} className="btn btn--ghost">
                <WhatsApp width={18} height={18} /> WhatsApp Us
              </MagneticButton>
            </FadeIn>
            <FadeIn waitForSite delay={1} className="hero__stats">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="stat__value">
                    <CountUp value={s.value} suffix={s.suffix} waitForSite />
                  </div>
                  <div className="stat__label">{s.label}</div>
                </div>
              ))}
            </FadeIn>
          </div>

          <FadeIn waitForSite delay={1.1} className="hero__form-wrap" y={50}>
            <EnquiryForm floating compact source="home-hero" title="Get a Free Callback" subtitle="Share your number — our team will call you back." />
          </FadeIn>
        </div>
        <div className="scroll-cue" aria-hidden="true">
          <i />
          Scroll
        </div>
      </section>

      <Marquee />

      {/* ----------------------------------------------------------- ABOUT */}
      <section className="section section--cream noise">
        <Watermark variant="light" position="right" />
        <div className="container grid-2">
          <div>
            <Reveal>
              <span className="eyebrow">About Us</span>
            </Reveal>
            <SplitText as="h2" className="h-lg" text="Built on Trust, *Rooted* in Land" />
            <Reveal delay={0.1}>
              <p className="lead" style={{ marginTop: 18 }}>
                {site.name} helps families and investors find the right plot with confidence. We keep things simple: honest information, clear paperwork and a team that stays with you until the keys — or the registry — are in your hands.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="checklist" style={{ margin: '18px 0 30px' }}>
                <li>Carefully shortlisted projects in growing locations</li>
                <li>Documentation details shared openly, up front</li>
                <li>Site visits and guidance at every step</li>
              </ul>
              <MagneticButton href="/about" className="btn btn--navy">
                Our Story <ArrowRight width={18} height={18} />
              </MagneticButton>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <TiltCard max={7}>
              <div style={{ borderRadius: 28, overflow: 'hidden', aspectRatio: '4/3.2', border: '1px solid rgba(201,132,0,.45)', boxShadow: '0 40px 80px -40px rgba(7,21,38,.7)' }}>
                <PlotArt seed={2} hue="gold" label="Illustration of a planned plot development at dusk" />
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------- SCROLL-DRIVEN 3D STORY */}
      <ScrollScene />

      {/* ------------------------------------------- FEATURED (HORIZONTAL SCROLL) */}
      <HorizontalShowcase projects={featured} />

      {/* -------------------------------------------------------- WHY US (FLIP) */}
      <section className="section section--cream noise">
        <Watermark variant="light" position="left" />
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 720, marginInline: 'auto', marginBottom: 56 }}>
            <Reveal>
              <span className="eyebrow">Why Choose Us</span>
            </Reveal>
            <SplitText as="h2" className="h-lg" text="A Prime Experience, *Start* to Finish" />
            <GoldDivider style={{ marginTop: 22 }} />
          </div>
          <div className="grid-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <FeatureFlipCard feature={f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ PROCESS */}
      <section className="section section--white">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 120 }}>
            <Reveal>
              <span className="eyebrow">How It Works</span>
            </Reveal>
            <SplitText as="h2" className="h-lg" text="Four Simple Steps to *Your* Plot" />
            <Reveal delay={0.1}>
              <p className="lead" style={{ marginTop: 16 }}>
                No jargon, no pressure. Here is how we take you from first question to final registration.
              </p>
            </Reveal>
          </div>
          <div className="steps">
            {process.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.06}>
                <div className="step">
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className="section section--dark noise cta-band">
        <Watermark variant="dark" position="center" opacity={0.07} />
        <div className="container" style={{ maxWidth: 820 }}>
          <Reveal>
            <span className="eyebrow">Let&apos;s Talk</span>
          </Reveal>
          <SplitText as="h2" className="h-lg" text="Ready to Find Your *Prime* Plot?" />
          <Reveal delay={0.1}>
            <p className="lead" style={{ marginInline: 'auto', marginTop: 16 }}>
              Call us, message us on WhatsApp or request a callback. We will share available plots and arrange a site visit at your convenience.
            </p>
            <div className="actions">
              <MagneticButton href={whatsappLink()} className="btn btn--gold">
                <WhatsApp width={18} height={18} /> Chat on WhatsApp
              </MagneticButton>
              <MagneticButton href={telLink()} className="btn btn--ghost">
                <Phone width={18} height={18} /> {site.phone}
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
