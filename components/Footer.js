import Image from 'next/image';
import Link from 'next/link';
import { nav, site, telLink, whatsappLink } from '@/lib/site';
import { projects } from '@/lib/projects';
import { GoldDivider, Watermark } from '@/components/motion';
import { Mail, Phone, Pin, Clock } from '@/components/Icons';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer noise">
      <Watermark variant="dark" position="left" />
      <div className="container">
        <GoldDivider style={{ marginBottom: 56 }} />
        <div className="footer__grid">
          <div>
            <div className="footer__logo">
              <Image src="/logo-light-on-dark.png" alt={site.name} fill sizes="300px" style={{ objectFit: 'contain', objectPosition: 'left center' }} />
            </div>
            <p style={{ maxWidth: 340 }}>{site.tagline} Explore verified plots and speak directly with our team.</p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Projects</h4>
            <ul>
              {projects.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Get in touch</h4>
            <ul>
              <li style={{ display: 'flex', gap: 10 }}>
                <Phone width={18} height={18} style={{ flex: 'none', marginTop: 4, color: 'var(--gold-300)' }} />
                <a href={telLink()}>{site.phone}</a>
              </li>
              <li style={{ display: 'flex', gap: 10 }}>
                <Mail width={18} height={18} style={{ flex: 'none', marginTop: 4, color: 'var(--gold-300)' }} />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li style={{ display: 'flex', gap: 10 }}>
                <Pin width={18} height={18} style={{ flex: 'none', marginTop: 4, color: 'var(--gold-300)' }} />
                <span>{site.address}</span>
              </li>
              <li style={{ display: 'flex', gap: 10 }}>
                <Clock width={18} height={18} style={{ flex: 'none', marginTop: 4, color: 'var(--gold-300)' }} />
                <span>{site.hours}</span>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-300)', fontWeight: 600 }}>
                  Chat on WhatsApp →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span>Project details, prices and approvals are shared by the developer — please verify before booking.</span>
        </div>
      </div>
    </footer>
  );
}
