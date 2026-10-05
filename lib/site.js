/**
 * Central site configuration.
 * Edit this file (and the NEXT_PUBLIC_* env vars) to change contact details,
 * navigation and SEO defaults. Everything marked PLACEHOLDER must be replaced
 * with the client's approved details before going live.
 */

export const site = {
  name: 'Brothers Prime Properties',
  shortName: 'Brothers Prime',
  tagline: 'Premium plots. Clear documents. Prime locations.',
  description:
    'Brothers Prime Properties showcases premium residential and commercial plots with clear documentation and prime locations. Explore available projects and send an enquiry today.',
  // Public URL of the deployed site (used for sitemap, canonical URLs, OG tags)
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com',

  // PLACEHOLDER contact details — replace with the client's approved details
  phone: process.env.NEXT_PUBLIC_PHONE || '+91 90000 00000',
  // WhatsApp number in international format, digits only (no +, spaces or dashes)
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '919000000000',
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@example.com',
  address: process.env.NEXT_PUBLIC_ADDRESS || 'Office address line, City, State, India',
  hours: 'Mon – Sat · 10:00 AM – 7:00 PM',
  // Used for the Google Maps embed on the contact page
  mapQuery: process.env.NEXT_PUBLIC_MAP_QUERY || 'Real estate office',

  socials: [
    // { label: 'Instagram', href: 'https://instagram.com/yourhandle' },
  ],
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

/** Build a wa.me link with an optional prefilled message. */
export function whatsappLink(message = 'Hello, I would like to know more about your plots.') {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Strip spaces so the number can be used in tel: links. */
export function telLink() {
  return `tel:${site.phone.replace(/[^+\d]/g, '')}`;
}

/** Keywords shown in the gold marquee strip. */
export const marqueeWords = [
  'Premium Plots',
  'Clear Documents',
  'Prime Locations',
  'Transparent Deals',
  'Trusted Guidance',
  'Future-Ready Investment',
];

/** Count-up stats on the home page. PLACEHOLDER numbers — replace with real ones. */
export const stats = [
  { value: 150, suffix: '+', label: 'Plots Showcased' },
  { value: 12, suffix: '+', label: 'Prime Projects' },
  { value: 500, suffix: '+', label: 'Happy Enquiries' },
  { value: 100, suffix: '%', label: 'Clear Documentation' },
];

/** Feature cards (3D flip) on the home page. */
export const features = [
  {
    icon: 'doc',
    title: 'Clear Documents',
    front: 'Paperwork you can trust.',
    back: 'Every plot is presented with its documentation details so you can decide with confidence.',
  },
  {
    icon: 'pin',
    title: 'Prime Locations',
    front: 'Where growth happens.',
    back: 'Projects chosen near roads, markets, schools and the corridors that are developing fastest.',
  },
  {
    icon: 'shield',
    title: 'Transparent Process',
    front: 'No surprises.',
    back: 'Straight answers on pricing, size and availability — shared openly from the first call.',
  },
  {
    icon: 'key',
    title: 'Guided Buying',
    front: 'Support every step.',
    back: 'From site visit to registration, our team stays with you and answers every question.',
  },
];
