'use client';

/**
 * Hero3DLoader — mounts the WebGL hero only when the device can handle it.
 *   tier 'high' (desktop)           -> lazy-loaded 3D scene (next/dynamic, ssr:false)
 *   tier 'low' | 'off' (phones, reduced motion, low power, no WebGL)
 *                                   -> lightweight static emblem with a CSS float
 * The static emblem is also what the server renders, so SEO / LCP are unaffected,
 * and it fades out once the 3D scene is ready.
 */
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCapabilities, useInView } from '@/lib/useCapabilities';

const Hero3D = dynamic(() => import('@/components/three/Hero3D'), { ssr: false });

export default function Hero3DLoader() {
  const caps = useCapabilities();
  const ref = useRef(null);
  const inView = useInView(ref, '100px');
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  const use3D = caps.ready && caps.tier === 'high';

  // global pointer position (-1..1) for the parallax — canvas sits behind the copy
  useEffect(() => {
    if (!use3D) return;
    const move = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [use3D]);

  return (
    <div ref={ref} className="hero__stage" aria-hidden="true">
      <div className="hero-fallback" style={{ opacity: use3D && ready ? 0 : 1, transition: 'opacity 1s ease' }}>
        <Image src="/logo-icon-on-dark.png" alt="" fill priority sizes="(max-width: 980px) 120vw, 54vw" />
      </div>
      {use3D && <Hero3D pointer={pointer} active={inView} onReady={() => setReady(true)} />}
    </div>
  );
}
