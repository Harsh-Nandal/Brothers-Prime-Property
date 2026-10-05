import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/cinzel/800.css';
import '@fontsource-variable/inter';
import './globals.css';

import { site } from '@/lib/site';
import Shell from '@/components/Shell';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Premium Plots & Property Showcase`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ['plots for sale', 'residential plots', 'commercial plots', 'real estate', 'property', 'Brothers Prime Properties'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — Premium Plots & Property Showcase`,
    description: site.description,
    url: site.url,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: site.name }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#071526',
  width: 'device-width',
  initialScale: 1,
};

// Structured data for search engines
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: site.name,
  url: site.url,
  logo: `${site.url.replace(/\/$/, '')}/logo-transparent.png`,
  image: `${site.url.replace(/\/$/, '')}/og.png`,
  description: site.description,
  telephone: site.phone,
  email: site.email,
  address: { '@type': 'PostalAddress', streetAddress: site.address, addressCountry: 'IN' },
};

// Runs before paint: if the intro already played this session, hide the preloader at once.
const seenScript = `try{if(sessionStorage.getItem('bpp-seen')==='1'){document.documentElement.dataset.seen='1'}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: seenScript }} />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Shell footer={<Footer />}>{children}</Shell>
      </body>
    </html>
  );
}
