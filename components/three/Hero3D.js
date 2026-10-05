'use client';

/**
 * Hero3D — the cinematic hero scene (WebGL, loaded with next/dynamic ssr:false).
 *
 *  - Floating emblem built from logo-icon-on-dark.png: a front textured plane with
 *    metallic reflections + a stack of gold-tinted layers behind it (fake extrusion)
 *  - Gold dust particles drifting upward (additive glow sprites)
 *  - Soft light rays fanning from above
 *  - Low-poly skyline with gold edge lines in the distance
 *  - Two thin gold orbit rings
 *  - Mouse parallax + gentle float; environment reflections come from procedural
 *    Lightformers (no HDR downloads)
 *
 * Tuning knobs live in lib/settings.js (particle count, skyline size, max DPR).
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { settings } from '@/lib/settings';
import { makeGlowTexture, makeRayTexture, seeded } from '@/components/three/textures';

const ASPECT = 488 / 1144;
const EMBLEM_W = 5.2;

/** Where the emblem sits depends on the viewport shape. */
function useLayout() {
  const { viewport } = useThree();
  const wide = viewport.width / viewport.height > 1.25;
  const scale = wide ? Math.min(viewport.width * 0.4, 8.5) / EMBLEM_W : Math.min(viewport.width * 0.92, 6.2) / EMBLEM_W;
  return {
    wide,
    scale,
    x: wide ? viewport.width * 0.22 : 0,
    y: wide ? viewport.height * 0.17 : viewport.height * 0.2,
    vw: viewport.width,
    vh: viewport.height,
  };
}

function Emblem({ pointer, layout }) {
  const tex = useLoader(THREE.TextureLoader, '/logo-icon-on-dark.png');
  const glow = useMemo(() => makeGlowTexture(256), []);
  const group = useRef();

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = pointer.current;
    g.position.x = THREE.MathUtils.damp(g.position.x, layout.x + p.x * 0.25, 3, dt);
    g.position.y = layout.y + Math.sin(t * 0.9) * 0.12;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, Math.sin(t * 0.45) * 0.32 + p.x * 0.4, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -p.y * 0.2 + Math.sin(t * 0.6) * 0.04, 4, dt);
  });

  const LAYERS = 8;
  const H = EMBLEM_W * ASPECT;
  return (
    <group ref={group} position={[layout.x, layout.y, 0]} scale={layout.scale}>
      {/* warm glow behind the emblem */}
      <mesh position={[0, 0, -0.9]}>
        <planeGeometry args={[EMBLEM_W * 1.9, H * 3.4]} />
        <meshBasicMaterial map={glow} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* gold-tinted back layers → depth / fake extrusion */}
      {Array.from({ length: LAYERS - 1 }, (_, i) => (
        <mesh key={i} position={[0, 0, -(i + 1) * 0.05]} renderOrder={-i}>
          <planeGeometry args={[EMBLEM_W, H]} />
          <meshStandardMaterial
            map={tex}
            transparent
            color="#c98400"
            metalness={0.9}
            roughness={0.3}
            envMapIntensity={2}
            emissive="#f2a900"
            emissiveIntensity={0.28}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* front face: natural colours + metallic sheen */}
      <mesh position={[0, 0, 0.02]} renderOrder={2}>
        <planeGeometry args={[EMBLEM_W, H]} />
        <meshStandardMaterial map={tex} transparent metalness={0.35} roughness={0.38} envMapIntensity={1.5} />
      </mesh>
    </group>
  );
}

function Particles({ count, layout }) {
  const ref = useRef();
  const tex = useMemo(() => makeGlowTexture(64), []);
  const { positions, speeds, phases } = useMemo(() => {
    const r = seeded(7);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (r() - 0.5) * 16;
      positions[i * 3 + 1] = (r() - 0.5) * 9;
      positions[i * 3 + 2] = r() * 8 - 4;
      speeds[i] = 0.08 + r() * 0.28;
      phases[i] = r() * Math.PI * 2;
    }
    return { positions, speeds, phases };
  }, [count]);

  useFrame((state, dt) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes.position.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt;
      arr[i * 3] += Math.sin(t * 0.4 + phases[i]) * dt * 0.05;
      if (arr[i * 3 + 1] > 4.8) arr[i * 3 + 1] = -4.8;
    }
    geo.attributes.position.needsUpdate = true;
    ref.current.rotation.y = Math.sin(t * 0.1) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={0.11}
        color="#ffd467"
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Rays({ layout }) {
  const group = useRef();
  const tex = useMemo(() => makeRayTexture(), []);
  const rays = useMemo(() => {
    const r = seeded(21);
    return Array.from({ length: 6 }, (_, i) => ({
      angle: (i - 2.5) * 0.19 + (r() - 0.5) * 0.06,
      w: 0.9 + r() * 1.3,
      o: 0.1 + r() * 0.12,
    }));
  }, []);
  useFrame((s) => {
    if (group.current) group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.18) * 0.1;
  });
  return (
    <group ref={group} position={[layout.x, layout.vh * 0.62, -3]}>
      {rays.map((r, i) => (
        // the group pivots at the top; the plane hangs below it
        <group key={i} rotation={[0, 0, r.angle]} position={[0, 0, -i * 0.01]}>
          <mesh position={[0, -6.5, 0]}>
            <planeGeometry args={[r.w, 13]} />
            <meshBasicMaterial map={tex} transparent opacity={r.o} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Skyline({ layout, pointer, count }) {
  const group = useRef();
  const buildings = useMemo(() => {
    const r = seeded(99);
    return Array.from({ length: count }, (_, i) => {
      const w = 0.7 + r() * 0.9;
      const h = 1.4 + r() * 4;
      const d = 0.8 + r() * 0.8;
      const span = 15;
      return {
        w,
        h,
        d,
        x: ((i + r() * 0.6) / count - 0.5) * span * 1.5,
        z: -6 - r() * 4,
        geo: new THREE.BoxGeometry(w, h, d),
      };
    });
  }, [count]);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, -pointer.current.x * 0.5, 2.5, dt);
  });

  const baseY = -layout.vh * 0.62;
  return (
    <group ref={group} position={[0, baseY, 0]}>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          <mesh geometry={b.geo}>
            <meshStandardMaterial color="#0b1f36" metalness={0.7} roughness={0.35} envMapIntensity={0.9} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[b.geo]} />
            <lineBasicMaterial color="#f2a900" transparent opacity={0.55} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

function Rings({ layout }) {
  const a = useRef();
  const b = useRef();
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (a.current) a.current.rotation.z = t * 0.12;
    if (b.current) b.current.rotation.z = -t * 0.09;
  });
  return (
    <group position={[layout.x, layout.y, -0.6]} scale={layout.scale}>
      <mesh ref={a} rotation={[1.2, 0.2, 0]}>
        <torusGeometry args={[3.5, 0.012, 8, 160]} />
        <meshStandardMaterial color="#ffd467" metalness={1} roughness={0.2} emissive="#f2a900" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={b} rotation={[1.35, -0.3, 0.4]}>
        <torusGeometry args={[4.1, 0.008, 8, 180]} />
        <meshStandardMaterial color="#ffd467" metalness={1} roughness={0.2} emissive="#f2a900" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function Lights({ pointer, layout }) {
  const spot = useRef();
  useFrame(() => {
    if (!spot.current) return;
    spot.current.position.set(pointer.current.x * layout.vw * 0.5, pointer.current.y * layout.vh * 0.5, 3.5);
  });
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[-4, 5, 5]} intensity={2.2} color="#ffe2a0" />
      <pointLight ref={spot} intensity={14} color="#ffd467" distance={9} decay={2} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} color="#ffd467" position={[-4, 3, 4]} scale={[6, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[5, -1, 3]} scale={[2, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2} color="#f2a900" position={[0, 0, -4]} scale={6} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#4d6280" position={[0, 5, -2]} scale={[10, 1, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

function Scene({ pointer, onReady }) {
  const layout = useLayout();
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return (
    <>
      <fog attach="fog" args={['#071526', 9, 24]} />
      <Lights pointer={pointer} layout={layout} />
      <Rays layout={layout} />
      <Skyline layout={layout} pointer={pointer} count={settings.hero.skylineBuildings} />
      <Rings layout={layout} />
      <Emblem pointer={pointer} layout={layout} />
      <Particles count={settings.hero.particlesHigh} layout={layout} />
    </>
  );
}

export default function Hero3D({ pointer, active = true, onReady }) {
  const [dpr, setDpr] = useState(Math.min(settings.hero.dprMax, 1.5));
  return (
    <Canvas
      className="canvas-fill"
      frameloop={active ? 'always' : 'never'}
      dpr={dpr}
      camera={{ position: [0, 0, 8], fov: 40, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(settings.hero.dprMax)} />
      <Suspense fallback={null}>
        <Scene pointer={pointer} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
