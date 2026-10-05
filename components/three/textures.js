/**
 * Tiny procedural textures (generated on a canvas) so the 3D scenes need no
 * extra image downloads. Client-only — these modules are loaded with ssr:false.
 */
import * as THREE from 'three';

/** Soft round gold dot for particles / glows. */
export function makeGlowTexture(size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, 'rgba(255,240,190,1)');
  grd.addColorStop(0.25, 'rgba(255,212,103,0.75)');
  grd.addColorStop(0.6, 'rgba(242,169,0,0.18)');
  grd.addColorStop(1, 'rgba(242,169,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Vertical fade used for soft light rays (bright at the top, fading down). */
export function makeRayTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 256;
  const g = c.getContext('2d');
  const v = g.createLinearGradient(0, 0, 0, 256);
  v.addColorStop(0, 'rgba(255,225,150,0.95)');
  v.addColorStop(0.5, 'rgba(255,200,80,0.28)');
  v.addColorStop(1, 'rgba(255,200,80,0)');
  g.fillStyle = v;
  g.fillRect(0, 0, 64, 256);
  // soften the horizontal edges
  g.globalCompositeOperation = 'destination-in';
  const h = g.createLinearGradient(0, 0, 64, 0);
  h.addColorStop(0, 'rgba(0,0,0,0)');
  h.addColorStop(0.5, 'rgba(0,0,0,1)');
  h.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = h;
  g.fillRect(0, 0, 64, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Deterministic PRNG (so scenes look the same every load). */
export function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
