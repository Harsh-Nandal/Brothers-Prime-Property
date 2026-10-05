'use client';

/**
 * StoryScene — scroll-driven 3D "scrollytelling".
 * A low-poly version of the logo (three gold-roofed houses + three towers) is
 * assembled on a plot as the visitor scrolls, while the camera swoops from a
 * top-down plan view, around the build, to a final hero shot.
 *
 * `progress` is a framer-motion MotionValue (0 → 1) read inside useFrame, so
 * scrolling never triggers React re-renders.
 */
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { makeGlowTexture, seeded } from '@/components/three/textures';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ---- house -------------------------------------------------------------- */
function House({ progress, start = 0.28, scale = 1, position = [0, 0, 0], rotY = 0, windowsGlow = true }) {
  const walls = useRef();
  const roof = useRef();
  const glowMat = useRef();

  const gable = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.2, 0);
    s.lineTo(1.2, 0);
    s.lineTo(0, 0.94);
    s.closePath();
    return s;
  }, []);

  useFrame(() => {
    const p = progress.get();
    if (walls.current) walls.current.scale.y = Math.max(0.0001, sm(start, start + 0.16, p));
    if (roof.current) roof.current.position.y = (1 - sm(start + 0.12, start + 0.3, p)) * 3.2;
    if (glowMat.current) glowMat.current.emissiveIntensity = windowsGlow ? 0.15 + sm(0.78, 0.95, p) * 2.2 : 0.2;
  });

  const goldRoof = (
    <meshStandardMaterial color="#f2a900" metalness={0.85} roughness={0.28} envMapIntensity={1.8} emissive="#c98400" emissiveIntensity={0.18} />
  );

  return (
    <group position={position} rotation={[0, rotY, 0]} scale={scale}>
      <group ref={walls}>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[2.4, 1.3, 1.8]} />
          <meshStandardMaterial color="#faf7f0" roughness={0.7} />
        </mesh>
        {/* door */}
        <mesh position={[0, 0.45, 0.91]}>
          <boxGeometry args={[0.42, 0.9, 0.04]} />
          <meshStandardMaterial color="#0b1f36" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* windows */}
        {[-0.8, 0.8].map((x) => (
          <mesh key={x} position={[x, 0.78, 0.915]}>
            <planeGeometry args={[0.55, 0.55]} />
            <meshStandardMaterial ref={x < 0 ? glowMat : undefined} color="#ffd467" emissive="#f2a900" emissiveIntensity={0.2} />
          </mesh>
        ))}
      </group>

      <group ref={roof} position={[0, 3.2, 0]}>
        {/* front & back gable triangles */}
        {[0.9, -0.9].map((z) => (
          <mesh key={z} position={[0, 1.3, z]} rotation={[0, z < 0 ? Math.PI : 0, 0]}>
            <shapeGeometry args={[gable]} />
            <meshStandardMaterial color="#faf7f0" side={THREE.DoubleSide} roughness={0.7} />
          </mesh>
        ))}
        {/* roof slabs */}
        <mesh position={[-0.63, 1.77, 0]} rotation={[0, 0, 0.62]}>
          <boxGeometry args={[1.62, 0.09, 2.15]} />
          {goldRoof}
        </mesh>
        <mesh position={[0.63, 1.77, 0]} rotation={[0, 0, -0.62]}>
          <boxGeometry args={[1.62, 0.09, 2.15]} />
          {goldRoof}
        </mesh>
        {/* navy fascia under the slabs */}
        <mesh position={[-0.63, 1.7, 0]} rotation={[0, 0, 0.62]}>
          <boxGeometry args={[1.64, 0.05, 2.17]} />
          <meshStandardMaterial color="#0b1f36" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0.63, 1.7, 0]} rotation={[0, 0, -0.62]}>
          <boxGeometry args={[1.64, 0.05, 2.17]} />
          <meshStandardMaterial color="#0b1f36" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/* ---- towers ------------------------------------------------------------- */
function Tower({ progress, x, h, w = 1, d = 1, start = 0.48 }) {
  const ref = useRef();
  const geo = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
  useFrame(() => {
    if (ref.current) ref.current.scale.y = Math.max(0.0001, sm(start, start + 0.2, progress.get()));
  });
  return (
    <group position={[x, 0, -3.2]} ref={ref}>
      <group position={[0, h / 2, 0]}>
        <mesh geometry={geo}>
          <meshStandardMaterial color="#12304f" metalness={0.75} roughness={0.28} envMapIntensity={1.4} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[geo]} />
          <lineBasicMaterial color="#f2a900" transparent opacity={0.7} />
        </lineSegments>
        {/* glass strip */}
        <mesh position={[w * 0.18, 0, d / 2 + 0.01]}>
          <planeGeometry args={[w * 0.4, h * 0.92]} />
          <meshStandardMaterial color="#4d6280" metalness={0.9} roughness={0.15} envMapIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}

/* ---- plot ground + outline ---------------------------------------------- */
function Ground({ progress }) {
  const sides = useRef([]);
  useFrame(() => {
    const p = progress.get();
    sides.current.forEach((m, i) => {
      if (m) m.scale.x = Math.max(0.0001, sm(i * 0.045, i * 0.045 + 0.14, p));
    });
  });
  const W = 7;
  const D = 4.6;
  const baseGeo = useMemo(() => new THREE.CylinderGeometry(8.4, 8.7, 0.35, 10), []);
  const rim = [
    { pos: [0, 0.04, D / 2], size: [W, 0.06, 0.08] },
    { pos: [W / 2, 0.04, 0], size: [0.08, 0.06, D] },
    { pos: [0, 0.04, -D / 2], size: [W, 0.06, 0.08] },
    { pos: [-W / 2, 0.04, 0], size: [0.08, 0.06, D] },
  ];
  return (
    <group>
      <mesh geometry={baseGeo} position={[0, -0.18, 0]}>
        <meshStandardMaterial color="#0b1f36" metalness={0.65} roughness={0.4} envMapIntensity={1} />
      </mesh>
      <lineSegments position={[0, -0.18, 0]}>
        <edgesGeometry args={[baseGeo]} />
        <lineBasicMaterial color="#f2a900" transparent opacity={0.6} />
      </lineSegments>
      <gridHelper args={[14, 14, '#f2a900', '#c98400']} position={[0, 0.005, 0]} material-transparent material-opacity={0.22} />
      {rim.map((r, i) => (
        <mesh key={i} position={r.pos} ref={(el) => (sides.current[i] = el)}>
          <boxGeometry args={r.size} />
          <meshStandardMaterial color="#ffd467" emissive="#f2a900" emissiveIntensity={1.4} />
        </mesh>
      ))}
      {/* corner posts */}
      {[
        [W / 2, D / 2],
        [-W / 2, D / 2],
        [W / 2, -D / 2],
        [-W / 2, -D / 2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.18, z]}>
          <boxGeometry args={[0.14, 0.36, 0.14]} />
          <meshStandardMaterial color="#ffd467" metalness={1} roughness={0.2} emissive="#f2a900" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position, scale = 1, progress }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.scale.setScalar(Math.max(0.0001, sm(0.8, 0.96, progress.get()) * scale));
  });
  const cone = useMemo(() => new THREE.ConeGeometry(0.45, 1.1, 5), []);
  return (
    <group position={position} ref={ref}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 5]} />
        <meshStandardMaterial color="#0b1f36" />
      </mesh>
      <mesh geometry={cone} position={[0, 0.85, 0]}>
        <meshStandardMaterial color="#1b3a5e" metalness={0.5} roughness={0.5} />
      </mesh>
      <lineSegments position={[0, 0.85, 0]}>
        <edgesGeometry args={[cone]} />
        <lineBasicMaterial color="#ffd467" transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}

function Stars() {
  const tex = useMemo(() => makeGlowTexture(32), []);
  const pos = useMemo(() => {
    const r = seeded(5);
    const a = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      a[i * 3] = (r() - 0.5) * 50;
      a[i * 3 + 1] = r() * 18 + 2;
      a[i * 3 + 2] = -r() * 22 - 6;
    }
    return a;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={0.22} color="#ffe9a8" transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ---- camera + choreography --------------------------------------------- */
const KEYS = [
  new THREE.Vector3(0.0, 10.5, 3.2),
  new THREE.Vector3(6.5, 4.8, 7.5),
  new THREE.Vector3(-7.0, 3.4, 6.5),
  new THREE.Vector3(0.0, 2.6, 11.5),
];
const LOOK = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(0, 1.0, 0), new THREE.Vector3(0, 1.4, 0)];

function Rig({ progress }) {
  const { camera } = useThree();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const cur = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const lamp = useRef();
  const glow = useRef();
  const glowTex = useMemo(() => makeGlowTexture(256), []);

  useFrame((state, dt) => {
    const p = progress.get();
    pos.copy(KEYS[0]).lerp(KEYS[1], sm(0, 0.33, p)).lerp(KEYS[2], sm(0.33, 0.66, p)).lerp(KEYS[3], sm(0.66, 1, p));
    look.copy(LOOK[0]).lerp(LOOK[1], sm(0, 0.33, p)).lerp(LOOK[2], sm(0.33, 0.66, p)).lerp(LOOK[3], sm(0.66, 1, p));

    // gentle idle drift so it never feels frozen
    const t = state.clock.elapsedTime;
    pos.x += Math.sin(t * 0.35) * 0.25;
    pos.y += Math.sin(t * 0.5) * 0.08;

    const k = 1 - Math.exp(-dt * 4.5);
    camera.position.lerp(pos, k);
    cur.lerp(look, k);
    camera.lookAt(cur);

    if (lamp.current) lamp.current.intensity = sm(0.6, 1, p) * 18;
    if (glow.current) glow.current.material.opacity = sm(0.55, 1, p) * 0.7;
  });

  return (
    <>
      <pointLight ref={lamp} position={[0, 2.2, 1.2]} color="#ffd467" distance={9} decay={2} intensity={0} />
      <mesh ref={glow} position={[0, 2.4, -5]}>
        <planeGeometry args={[18, 10]} />
        <meshBasicMaterial map={glowTex} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

function World({ progress }) {
  const world = useRef();
  useFrame((s) => {
    if (world.current) world.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.12) * 0.06;
  });
  return (
    <group ref={world}>
      <Ground progress={progress} />
      <Tower progress={progress} x={-2.3} h={3.4} w={1.1} d={1.1} start={0.46} />
      <Tower progress={progress} x={0} h={5} w={1.25} d={1.2} start={0.5} />
      <Tower progress={progress} x={2.4} h={2.8} w={1} d={1} start={0.54} />
      <House progress={progress} start={0.24} scale={1.05} position={[0, 0, 0.4]} />
      <House progress={progress} start={0.36} scale={0.74} position={[-3.3, 0, -0.3]} rotY={0.25} />
      <House progress={progress} start={0.4} scale={0.74} position={[3.3, 0, -0.3]} rotY={-0.25} />
      <Tree progress={progress} position={[-5.2, 0, 1.5]} scale={1.2} />
      <Tree progress={progress} position={[5.4, 0, 1.2]} scale={1.1} />
      <Tree progress={progress} position={[-2.2, 0, 2.6]} scale={0.8} />
      <Tree progress={progress} position={[2.3, 0, 2.7]} scale={0.85} />
      <Tree progress={progress} position={[-6.2, 0, -1.2]} scale={0.9} />
      <Tree progress={progress} position={[6.3, 0, -1.4]} scale={0.95} />
    </group>
  );
}

export default function StoryScene({ progress, active = true }) {
  return (
    <Canvas
      className="canvas-fill"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 10.5, 3.2], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <fog attach="fog" args={['#071526', 14, 38]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[-5, 9, 6]} intensity={2.4} color="#ffe2a0" />
      <directionalLight position={[6, 4, -4]} intensity={0.8} color="#7fa0d0" />
      <Suspense fallback={null}>
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={4} color="#ffd467" position={[-4, 4, 5]} scale={[7, 2, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[6, 2, 3]} scale={[2, 6, 1]} target={[0, 0, 0]} />
          <Lightformer form="ring" intensity={1.5} color="#f2a900" position={[0, 3, -6]} scale={7} target={[0, 0, 0]} />
        </Environment>
        <Stars />
        <Rig progress={progress} />
        <World progress={progress} />
      </Suspense>
    </Canvas>
  );
}
