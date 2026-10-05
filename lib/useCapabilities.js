'use client';

/**
 * useCapabilities — decides, on the client, how much motion / 3D this device
 * should get. Returns `ready: false` on the server and first render so the
 * markup always matches during hydration (static fallbacks render first).
 *
 *   tier: 'high' -> full desktop experience
 *         'low'  -> phones: static hero / scroll scene, light interactive 3D
 *         'off'  -> reduced motion, low-power, no WebGL or 3D disabled
 */
import { useEffect, useState } from 'react';
import { settings } from '@/lib/settings';

const DEFAULT = {
  ready: false,
  tier: 'off',
  reducedMotion: false,
  isTouch: false,
  isPhone: false,
};

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

function detect() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isPhone = window.innerWidth <= settings.phoneMaxWidth;
  const nav = navigator;
  const lowPower =
    (nav.deviceMemory && nav.deviceMemory <= 2) ||
    (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) ||
    (nav.connection && nav.connection.saveData);

  let tier = 'high';
  if (!settings.enable3D || reducedMotion || lowPower || !hasWebGL()) tier = 'off';
  else if (isPhone) tier = 'low';

  return { ready: true, tier, reducedMotion, isTouch, isPhone };
}

export function useCapabilities() {
  const [caps, setCaps] = useState(DEFAULT);

  useEffect(() => {
    const update = () => setCaps(detect());
    update();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener?.('change', update);
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(update, 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      mq.removeEventListener?.('change', update);
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
    };
  }, []);

  return caps;
}

/** Returns true while the element is (nearly) in the viewport. */
export function useInView(ref, rootMargin = '200px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
