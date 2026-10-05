/** Small inline SVG icon set (stroke icons use currentColor). */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

export const ArrowRight = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const Pin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const Phone = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const Mail = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const Clock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const Doc = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5M10 13h6M10 17h6" />
  </svg>
);
export const Shield = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const Key = (p) => (
  <svg {...base} {...p}>
    <circle cx="8" cy="14" r="4" />
    <path d="m11 11 9-8M16 6l3 3M14 8l2 2" />
  </svg>
);
export const Check = (p) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const Leaf = (p) => (
  <svg {...base} {...p}>
    <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" />
    <path d="M5 19c2-4 5-7 9-9" />
  </svg>
);
export const Spark = (p) => (
  <svg {...base} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
  </svg>
);
export const Diamond = (p) => (
  <svg {...base} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M12 2 22 12 12 22 2 12z" />
  </svg>
);
export const WhatsApp = (p) => (
  <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.19 1.6 6.01L4 28l7.1-1.86a12 12 0 0 0 4.94 1.06h.01C22.66 27.2 28 21.8 28 15.16 28 8.5 22.7 3 16.04 3Zm0 21.9h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-4.21 1.1 1.12-4.1-.24-.38a9.85 9.85 0 0 1-1.52-5.3c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 0 1 2.9 6.99c0 5.45-4.44 9.26-9.52 9.26Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
  </svg>
);
export const Layers = (p) => (
  <svg {...base} {...p}>
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5M3 17.5 12 22l9-4.5" />
  </svg>
);

/** Map from the string icon names used in lib/site.js */
export const iconMap = { doc: Doc, pin: Pin, shield: Shield, key: Key };
