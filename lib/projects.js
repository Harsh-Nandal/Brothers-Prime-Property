/**
 * Project / plot data.
 *
 * ALL CONTENT BELOW IS SAMPLE PLACEHOLDER DATA. Replace names, locations,
 * sizes, prices and descriptions with the client's approved information.
 * Pricing, ownership / legal information and approvals must be supplied and
 * approved by the client.
 *
 * Photos: add real images to /public/projects/<slug>/ and list them in
 * `images` (e.g. ['/projects/green-valley/1.jpg']). While `images` is empty the
 * site shows premium illustrated placeholders instead.
 */

// Tiny deterministic PRNG so the plot layout is identical on server and client
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Build a cols × rows block of plots with a deterministic status mix. */
function makeLayout(seed, cols, rows, soldRatio = 0.35, holdRatio = 0.1) {
  const rand = seeded(seed);
  const plots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const n = rand();
      const status = n < soldRatio ? 'sold' : n < soldRatio + holdRatio ? 'hold' : 'available';
      plots.push({ id: `${String.fromCharCode(65 + r)}${c + 1}`, row: r, col: c, status });
    }
  }
  return { cols, rows, plots };
}

export const projects = [
  {
    slug: 'green-valley-estate',
    name: 'Green Valley Estate',
    tagline: 'Landscaped residential plots near the highway',
    location: 'Sector 12, City Outskirts',
    type: 'Residential Plots',
    status: 'Available',
    featured: true,
    sizeRange: '100 – 300 sq. yd.',
    startingPrice: 'Price on request',
    hue: 'gold',
    description:
      'A thoughtfully planned residential colony with wide internal roads, green belts and quick access to the main highway. Ideal for families who want space to build their dream home in a growing neighbourhood.',
    highlights: [
      'Wide internal roads & street lighting',
      'Park and green belt planned',
      'Close to schools & markets',
      'Clear documentation — details on request',
    ],
    amenities: ['Gated entry', 'Parks', 'Water supply', 'Drainage', 'Street lights', 'Wide roads'],
    images: [],
    layout: makeLayout(11, 6, 4),
  },
  {
    slug: 'royal-heights-enclave',
    name: 'Royal Heights Enclave',
    tagline: 'Corner plots in a premium gated enclave',
    location: 'Main Bypass Road, Prime Zone',
    type: 'Residential Plots',
    status: 'Few Plots Left',
    featured: true,
    sizeRange: '150 – 400 sq. yd.',
    startingPrice: 'Price on request',
    hue: 'steel',
    description:
      'A premium gated enclave for buyers who want an address with presence. Corner and park-facing plots are limited, and demand is strong for this prime-zone project.',
    highlights: [
      'Gated community planning',
      'Corner & park-facing options',
      'Bypass road connectivity',
      'Limited plots remaining',
    ],
    amenities: ['Gated entry', 'CCTV planned', 'Parks', 'Club space', 'Street lights', 'Water supply'],
    images: [],
    layout: makeLayout(23, 7, 4, 0.55, 0.1),
  },
  {
    slug: 'prime-commercial-square',
    name: 'Prime Commercial Square',
    tagline: 'High-visibility commercial plots on the main road',
    location: 'Market Road Frontage',
    type: 'Commercial Plots',
    status: 'Available',
    featured: true,
    sizeRange: '50 – 200 sq. yd.',
    startingPrice: 'Price on request',
    hue: 'gold',
    description:
      'Road-facing commercial plots in a busy catchment — suited to showrooms, clinics, offices and retail. Strong footfall and visibility from day one.',
    highlights: [
      'Main road frontage',
      'High footfall catchment',
      'Suitable for retail & offices',
      'Flexible plot sizes',
    ],
    amenities: ['Road frontage', 'Parking space', 'Power supply', 'Drainage', 'Street lights'],
    images: [],
    layout: makeLayout(37, 5, 3, 0.3, 0.1),
  },
  {
    slug: 'sunrise-meadows',
    name: 'Sunrise Meadows',
    tagline: 'Affordable plots for first-time buyers',
    location: 'East Corridor, Growth Area',
    type: 'Residential Plots',
    status: 'Available',
    featured: false,
    sizeRange: '80 – 200 sq. yd.',
    startingPrice: 'Price on request',
    hue: 'steel',
    description:
      'Budget-friendly plots in a fast-developing corridor — a smart starting point for first-time buyers and long-term investors alike.',
    highlights: [
      'Budget-friendly entry point',
      'Fast-developing corridor',
      'Easy payment guidance',
      'Ready-to-build plots',
    ],
    amenities: ['Internal roads', 'Water supply', 'Drainage', 'Street lights', 'Park'],
    images: [],
    layout: makeLayout(41, 6, 5, 0.25, 0.08),
  },
  {
    slug: 'golden-orchard-farms',
    name: 'Golden Orchard Farms',
    tagline: 'Farmhouse plots surrounded by greenery',
    location: 'Scenic Belt, Outer Ring',
    type: 'Farm Plots',
    status: 'Available',
    featured: false,
    sizeRange: '500 – 2000 sq. yd.',
    startingPrice: 'Price on request',
    hue: 'gold',
    description:
      'Spacious farm plots for weekend homes and green retreats. Open skies, fresh air and room to grow — within comfortable reach of the city.',
    highlights: [
      'Large open plots',
      'Peaceful, green surroundings',
      'Weekend-home friendly',
      'Within easy reach of the city',
    ],
    amenities: ['Approach road', 'Water source', 'Power line', 'Fencing options'],
    images: [],
    layout: makeLayout(53, 4, 3, 0.2, 0.1),
  },
  {
    slug: 'skyline-business-park',
    name: 'Skyline Business Park',
    tagline: 'Plots for offices, warehouses and light industry',
    location: 'Industrial Corridor',
    type: 'Commercial Plots',
    status: 'Sold Out',
    featured: false,
    sizeRange: '300 – 1000 sq. yd.',
    startingPrice: 'Sold out',
    hue: 'steel',
    description:
      'A completed business-park project on the industrial corridor. Ask us about upcoming launches in similar locations.',
    highlights: [
      'Industrial corridor location',
      'Wide approach roads',
      'Heavy-vehicle friendly',
      'Fully sold — new launches coming',
    ],
    amenities: ['Wide roads', 'Power supply', 'Drainage', 'Truck parking'],
    images: [],
    layout: makeLayout(67, 5, 4, 0.95, 0.05),
  },
];

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}

export function getFeatured() {
  return projects.filter((p) => p.featured);
}

export const projectTypes = ['All', ...Array.from(new Set(projects.map((p) => p.type)))];
