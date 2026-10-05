import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site, whatsappLink, telLink } from '@/lib/site';
import { projects, getProject } from '@/lib/projects';
import Gallery3D from '@/components/Gallery3D';
import PlotLayout3D from '@/components/PlotLayout3D';
import EnquiryForm from '@/components/EnquiryForm';
import ProjectCard from '@/components/ProjectCard';
import MagneticButton from '@/components/MagneticButton';
import { Reveal, SplitText, Watermark, FadeIn, GoldDivider } from '@/components/motion';
import { Check, Pin, Phone, WhatsApp } from '@/components/Icons';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.type}`,
    description: `${p.tagline}. ${p.location}. ${p.sizeRange}. ${p.description.slice(0, 110)}…`,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.name} | ${site.name}`, description: p.tagline, url: `/projects/${p.slug}` },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  // Real photos if provided, otherwise premium illustrated placeholders
  const slides = p.images?.length
    ? p.images.map((src, i) => ({ src, alt: `${p.name} photo ${i + 1}` }))
    : [1, 2, 3, 4, 5].map((n) => ({ seed: n + p.slug.length, hue: n % 2 ? p.hue : p.hue === 'gold' ? 'steel' : 'gold', alt: `${p.name} illustration ${n}`, caption: `${p.name} · Illustration ${n} / 5` }));

  const others = projects.filter((x) => x.slug !== p.slug).slice(0, 3);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${p.location}`)}&output=embed`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    category: p.type,
    brand: { '@type': 'Organization', name: site.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero noise">
        <Watermark variant="dark" position="right" opacity={0.07} />
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/projects">Projects</Link> / <span aria-current="page">{p.name}</span>
          </nav>
          <SplitText as="h1" className="h-xl" text={p.name} waitForSite />
          <FadeIn waitForSite delay={0.45}>
            <p className="lead">{p.tagline}</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b9c6d8' }}>
              <Pin width={18} height={18} /> {p.location}
            </p>
          </FadeIn>
          <FadeIn waitForSite delay={0.6}>
            <dl className="pd-meta">
              <div><dt>Type</dt><dd>{p.type}</dd></div>
              <div><dt>Plot sizes</dt><dd>{p.sizeRange}</dd></div>
              <div><dt>Status</dt><dd>{p.status}</dd></div>
              <div><dt>Price</dt><dd>{p.startingPrice}</dd></div>
            </dl>
          </FadeIn>
        </div>
      </section>

      <section className="section section--cream noise">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Gallery</span>
            <h2 className="h-lg" style={{ marginBottom: 32 }}>Take a Closer Look</h2>
          </Reveal>
          <Gallery3D slides={slides} name={p.name} />
        </div>
      </section>

      <section className="section section--white">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <div>
            <Reveal><span className="eyebrow">Overview</span></Reveal>
            <SplitText as="h2" className="h-lg" text="About This *Project*" />
            <Reveal delay={0.1}><p className="lead" style={{ marginTop: 16 }}>{p.description}</p></Reveal>
            <Reveal delay={0.15}>
              <ul className="checklist" style={{ margin: '18px 0 28px' }}>
                {p.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <MagneticButton href={whatsappLink(`Hello, I am interested in ${p.name}. Please share details.`)} className="btn btn--gold">
                  <WhatsApp width={18} height={18} /> Enquire on WhatsApp
                </MagneticButton>
                <MagneticButton href={telLink()} className="btn btn--navy">
                  <Phone width={18} height={18} /> Call Now
                </MagneticButton>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <h3 className="h-md" style={{ marginBottom: 18 }}>Amenities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
              {p.amenities.map((a) => (
                <div key={a} className="amenity"><Check /> {a}</div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--dark noise">
        <Watermark variant="dark" position="center" opacity={0.06} />
        <div className="container">
          <Reveal>
            <span className="eyebrow">Interactive Layout</span>
            <h2 className="h-lg" style={{ marginBottom: 12 }}>Explore the Plot Layout in 3D</h2>
            <GoldDivider style={{ marginBottom: 36 }} />
          </Reveal>
          <PlotLayout3D layout={p.layout} projectName={p.name} />
        </div>
      </section>

      <section className="section section--cream noise">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <Reveal>
            <span className="eyebrow">Location</span>
            <h2 className="h-lg" style={{ marginBottom: 18 }}>Find It on the Map</h2>
            <div className="map-frame">
              <iframe title={`Map showing ${p.location}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: 10 }}>Map shows the approximate area. Exact site location shared on enquiry.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <EnquiryForm variant="light" source={`project:${p.slug}`} interest={p.name} title={`Enquire about ${p.name}`} subtitle="Our team will call you with sizes, pricing and a site-visit slot." />
          </Reveal>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <Reveal><span className="eyebrow">More Projects</span><h2 className="h-lg" style={{ marginBottom: 36 }}>You May Also Like</h2></Reveal>
          <div className="grid-3">
            {others.map((o) => <ProjectCard key={o.slug} project={o} index={projects.indexOf(o)} />)}
          </div>
        </div>
      </section>
    </>
  );
}
