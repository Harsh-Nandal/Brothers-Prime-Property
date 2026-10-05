/**
 * Motion & 3D settings — one place to tune (or switch off) the heavy effects.
 *
 * Quick switches (can also be set with env vars in .env.local):
 *   NEXT_PUBLIC_ENABLE_3D=true        -> turn the WebGL 3D scenes ON (default is OFF)
 *   NEXT_PUBLIC_DISABLE_3D=true       -> force 3D off even if enabled
 *   NEXT_PUBLIC_DISABLE_SMOOTH=true   -> native scrolling (no Lenis)
 *   NEXT_PUBLIC_DISABLE_CURSOR=true   -> no custom gold cursor
 *   NEXT_PUBLIC_DISABLE_PRELOADER=true-> no intro preloader
 */

const flag = (v) => String(v || '').toLowerCase() === 'true';

export const settings = {
  // 3D is OFF by default for now (clean static premium look). Turn on with NEXT_PUBLIC_ENABLE_3D=true
  enable3D: flag(process.env.NEXT_PUBLIC_ENABLE_3D) && !flag(process.env.NEXT_PUBLIC_DISABLE_3D),
  enableSmoothScroll: !flag(process.env.NEXT_PUBLIC_DISABLE_SMOOTH),
  enableCursor: !flag(process.env.NEXT_PUBLIC_DISABLE_CURSOR),
  enablePreloader: !flag(process.env.NEXT_PUBLIC_DISABLE_PRELOADER),

  // Below this viewport width a device counts as "phone": heavy hero/scroll 3D
  // is replaced by a static fallback to protect battery and Lighthouse score.
  phoneMaxWidth: 767,

  hero: {
    particlesHigh: 650, // desktop / laptop
    skylineBuildings: 26,
    dprMax: 1.75,
  },
  plotLayout: {
    dprMax: 1.5,
    autoRotateSpeed: 0.8,
  },
  gallery: {
    autoplayMs: 5500,
  },
};
