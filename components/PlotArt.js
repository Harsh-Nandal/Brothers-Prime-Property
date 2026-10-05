/**
 * PlotArt — premium illustrated placeholder used while a project has no photos.
 * A dusk skyline with lit windows, a gold sun-glow, and a perspective plot grid
 * with trees. `seed` varies the skyline, `hue` ('gold' | 'steel') the mood.
 * Pure SVG, server-renderable, scales to any container.
 */
import { useId } from 'react';

function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function PlotArt({ seed = 1, hue = 'gold', label, className = '', rounded = false }) {
  const uid = useId().replace(/:/g, '');
  const r = rng(seed + 3);
  const gold = hue === 'gold';

  // skyline towers
  const towers = Array.from({ length: 9 }, (_, i) => {
    const w = 38 + r() * 34;
    const h = 90 + r() * 170;
    return { x: 90 + i * 66 + r() * 12, w, h };
  });
  // lit windows
  const windows = [];
  towers.forEach((t, ti) => {
    for (let k = 0; k < 9; k++) {
      if (r() > 0.45) {
        windows.push({ x: t.x + 6 + (k % 3) * (t.w / 3.4), y: 330 - t.h + 14 + Math.floor(k / 3) * 22, d: (ti + k) % 5 });
      }
    }
  });
  // trees
  const trees = [90, 170, 640, 720, 560].map((x, i) => ({ x: x + r() * 16, y: 440 + (i % 2) * 12, s: 0.8 + r() * 0.5 }));

  return (
    <svg
      className={className}
      viewBox="0 0 800 550"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label || 'Illustration of a planned plot development'}
      style={{ display: 'block', width: '100%', height: '100%', borderRadius: rounded ? 22 : 0 }}
    >
      <defs>
        <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={gold ? '#071526' : '#0a1c33'} />
          <stop offset="0.55" stopColor={gold ? '#12304f' : '#1c3f66'} />
          <stop offset="1" stopColor={gold ? '#c98400' : '#4d6280'} stopOpacity={gold ? 0.75 : 0.9} />
        </linearGradient>
        <radialGradient id={`${uid}sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffd467" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f2a900" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f2a47" />
          <stop offset="1" stopColor="#040d19" />
        </linearGradient>
        <linearGradient id={`${uid}tower`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b1f36" />
          <stop offset="0.6" stopColor="#1b3a5e" />
          <stop offset="1" stopColor="#4d6280" />
        </linearGradient>
        <linearGradient id={`${uid}plot`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd467" stopOpacity="0.9" />
          <stop offset="1" stopColor="#c98400" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect width="800" height="550" fill={`url(#${uid}sky)`} />
      <circle cx={gold ? 560 : 250} cy="250" r="230" fill={`url(#${uid}sun)`} />
      <circle cx={gold ? 560 : 250} cy="262" r="46" fill="#ffe9a8" opacity="0.9" />

      {/* stars */}
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={(i * 97 + seed * 31) % 800} cy={(i * 53) % 150} r={i % 3 ? 1 : 1.6} fill="#fff" opacity={0.5 + (i % 4) * 0.12} />
      ))}

      {/* skyline */}
      {towers.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={330 - t.h} width={t.w} height={t.h + 20} fill={`url(#${uid}tower)`} />
          <rect x={t.x} y={330 - t.h} width={t.w} height="3" fill="#ffd467" opacity="0.8" />
        </g>
      ))}
      {windows.map((w, i) => (
        <rect key={i} className={`pa-win pa-win--${w.d}`} x={w.x} y={w.y} width="7" height="10" rx="1" fill="#ffd467" />
      ))}

      {/* ground */}
      <path d="M0 340 L800 340 L800 550 L0 550 Z" fill={`url(#${uid}ground)`} />
      <rect x="0" y="338" width="800" height="3" fill="#ffd467" opacity="0.85" />

      {/* perspective plot grid */}
      <g transform="translate(0,0)">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x1 = 120 + i * 90;
          const x2 = 400 + (i - 3) * 200;
          return <line key={`v${i}`} x1={x1} y1="345" x2={x2} y2="550" stroke="#ffd467" strokeOpacity="0.45" strokeWidth="1.2" />;
        })}
        {[360, 385, 420, 470, 540].map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="800" y2={y} stroke="#ffd467" strokeOpacity={0.18 + i * 0.07} strokeWidth="1.2" />
        ))}
        {/* highlighted plots */}
        <polygon points="300,385 400,385 428,420 282,420" fill={`url(#${uid}plot)`} opacity="0.85" />
        <polygon points="410,385 500,385 540,420 438,420" fill="#ffd467" opacity="0.22" />
        <polygon points="240,420 282,420 262,470 190,470" fill="#ffd467" opacity="0.18" />
      </g>

      {/* low-poly trees */}
      {trees.map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y}) scale(${t.s})`}>
          <rect x="-3" y="0" width="6" height="22" fill="#0b1f36" />
          <polygon points="0,-48 24,-8 -24,-8" fill="#12304f" stroke="#ffd467" strokeOpacity="0.6" />
          <polygon points="0,-30 28,12 -28,12" fill="#1b3a5e" stroke="#ffd467" strokeOpacity="0.5" />
        </g>
      ))}

      {/* subtle vignette */}
      <rect width="800" height="550" fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="40" />
    </svg>
  );
}
