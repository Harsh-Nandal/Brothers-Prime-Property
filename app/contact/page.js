import Link from 'next/link';
import { site, telLink, whatsappLink } from '@/lib/site';
import EnquiryForm from '@/components/EnquiryForm';
import { Reveal, SplitText, Watermark, FadeIn } from '@/components/motion';
import { Phone, Mail, Pin, Clock, WhatsApp } from '@/components/Icons';

export const metadata = {
  title: 'Contact Us',
  description: `Call, WhatsApp or send an enquiry to ${site.name}. Find our office location on the map.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const cards = [
    { icon: <Phone />, label: 'Call us', value: site.phone, href: telLink() },
    { icon: <WhatsApp />, label: 'WhatsApp', value: 'Chat with our team', href: whatsappLink(), external: true },
    { icon: <Mail />, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: <Pin />, label: 'Office', value: site.address },
    { icon: <Clock />, label: 'Hours', value: site.hours },
  ];
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;

  return (
    <>
      <section className="page-hero noise">
        <Watermark variant="dark" position="right" opacity={0.07} />
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span aria-current="page">Contact</span>
          </nav>
          <SplitText as="h1" className="h-xl" text="Let’s *Talk* Plots" waitForSite />
          <FadeIn waitForSite delay={0.5}>
            <p className="lead">Call, message or send an enquiry — we usually reply the same day.</p>
          </FadeIn>
        </div>
      </section>

      <section className="section section--cream noise">
        <Watermark variant="light" position="left" />
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 16 }}>
            {cards.map((c, i) => {
              const inner = (
                <>
                  <span className="ico" aria-hidden="true">{c.icon}</span>
                  <span><small>{c.label}</small>{c.value}</span>
                </>
              );
              return (
                <Reveal key={c.label} delay={i * 0.07}>
                  {c.href ? (
                    <a className="contact-card" href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>
                  ) : (
                    <div className="contact-card">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.1}>
            <EnquiryForm variant="light" source="contact-page" title="Send an Enquiry" subtitle="Fill in the form and our team will contact you." />
          </Reveal>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Find Us</span>
            <h2 className="h-lg" style={{ marginBottom: 28 }}>Visit Our Office</h2>
            <div className="map-frame">
              <iframe title="Office location map" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
