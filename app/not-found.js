import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="notfound noise">
      <div>
        <div className="notfound__logo">
          <Image src="/logo-icon-on-dark.png" alt="Brothers Prime Properties" fill sizes="420px" style={{ objectFit: 'contain' }} priority />
        </div>
        <h1 className="gold-text">404</h1>
        <p className="lead" style={{ marginInline: 'auto' }}>This plot seems to be off the map.</p>
        <Link href="/" className="btn btn--gold" style={{ marginTop: 24 }}>Back to Home</Link>
      </div>
    </section>
  );
}
