'use client';

/**
 * PlotScene — interactive 3D plot-layout / block diagram.
 * Each plot is a raised block coloured by status (gold = available, steel = on
 * hold, navy = sold). Drag to rotate, hover to highlight, click to select.
 * Zoom is disabled on purpose so the page can still scroll over the canvas.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { settings } from '@/lib/settings';

const CELL = 1;
const GAP = 0.16;
const ROAD = 0.55; // extra width for the central road

export const STATUS = {
  available: { color: '#f2a900', emissive: '#c98400', height: 0.3, label: 'Available' },
  hold: { color: '#8fa3bf', emissive: '#4d6280', height: 0.2, label: 'On Hold' },
  sold: { color: '#1b3a5e', emissive: '#000000', height: 0.1, label: 'Sold' },
};

function Plot({ plot, x, z, index, selected, hovered, onHover, onSelect }) {
  const mesh = useRef();
  const st = STATUS[plot.status] || STATUS.available;
  const geo = useMemo(() => new THREE.BoxGeometry(CELL, 1, CELL), []);

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    // entrance: plots grow in one after another
    const appear = Math.min(1, Math.max(0, (t - 0.15 - index * 0.025) / 0.7));
    const ease = 1 - Math.pow(1 - appear, 3);
    const lift = selected ? 0.32 : hovered ? 0.16 : 0;
    const target = Math.max(0.001, (st.height + lift) * ease);
    m.scale.y = THREE.MathUtils.damp(m.scale.y, target, 8, dt);
    m.position.y = m.scale.y / 2;
  });

  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={mesh}
        geometry={geo}
        scale={[1, 0.001, 1]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(plot.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(plot.id);
        }}
      >
        <meshStandardMaterial
          color={selected ? '#ffe9a8' : st.color}
          emissive={selected ? '#ffd467' : st.emissive}
          emissiveIntensity={selected ? 0.9 : hovered ? 0.6 : plot.status === 'available' ? 0.25 : 0.1}
          metalness={plot.status === 'sold' ? 0.5 : 0.8}
          roughness={0.35}
          envMapIntensity={1.3}
        />
      </mesh>
      {(selected || hovered) && (
        <Html position={[0, st.height + 0.75, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(7,21,38,.88)',
              color: '#ffd467',
              border: '1px solid rgba(255,212,103,.6)',
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              letterSpacing: '.08em',
            }}
          >
            {plot.id} · {st.label}
          </div>
        </Html>
      )}
    </group>
  );
}

function Tree({ position, s = 1 }) {
  const cone = useMemo(() => new THREE.ConeGeometry(0.34, 0.9, 5), []);
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.3, 5]} />
        <meshStandardMaterial color="#0b1f36" />
      </mesh>
      <mesh geometry={cone} position={[0, 0.65, 0]}>
        <meshStandardMaterial color="#1b3a5e" metalness={0.4} roughness={0.5} />
      </mesh>
      <lineSegments position={[0, 0.65, 0]}>
        <edgesGeometry args={[cone]} />
        <lineBasicMaterial color="#ffd467" transparent opacity={0.5} />
      </lineSegments>
    </group>
  );
}

function Layout({ layout, selectedId, onSelect }) {
  const [hoverId, setHoverId] = useState(null);
  const { cols, rows, plots } = layout;

  const { cells, W, D } = useMemo(() => {
    const roadAt = Math.floor(cols / 2);
    const width = cols * CELL + (cols - 1) * GAP + ROAD;
    const depth = rows * CELL + (rows - 1) * GAP;
    const cells = plots.map((p) => ({
      plot: p,
      x: -width / 2 + CELL / 2 + p.col * (CELL + GAP) + (p.col >= roadAt ? ROAD : 0),
      z: -depth / 2 + CELL / 2 + p.row * (CELL + GAP),
    }));
    return { cells, W: width, D: depth };
  }, [cols, rows, plots]);

  const pad = 1.1;
  return (
    <group>
      {/* platform + gold edge */}
      <mesh position={[0, -0.14, 0]}>
        <boxGeometry args={[W + pad * 2, 0.28, D + pad * 2]} />
        <meshStandardMaterial color="#0b1f36" metalness={0.6} roughness={0.45} envMapIntensity={0.9} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[W + pad * 2 + 0.14, 0.06, D + pad * 2 + 0.14]} />
        <meshStandardMaterial color="#ffd467" metalness={1} roughness={0.25} emissive="#f2a900" emissiveIntensity={0.5} />
      </mesh>
      {/* road surface */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W + 0.5, D + 0.5]} />
        <meshStandardMaterial color="#12304f" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* dashed centre line on the main road */}
      {Array.from({ length: Math.floor(D / 0.6) }, (_, i) => (
        <mesh key={i} position={[(ROAD / 2) * 0 + (-W / 2 + (Math.floor(cols / 2)) * (CELL + GAP) + ROAD / 2 - GAP / 2 + 0.0), 0.012, -D / 2 + 0.3 + i * 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, 0.3]} />
          <meshBasicMaterial color="#ffd467" />
        </mesh>
      ))}

      {cells.map((c, i) => (
        <Plot
          key={c.plot.id}
          plot={c.plot}
          x={c.x}
          z={c.z}
          index={i}
          selected={selectedId === c.plot.id}
          hovered={hoverId === c.plot.id}
          onHover={setHoverId}
          onSelect={onSelect}
        />
      ))}

      {/* greenery on the platform edge */}
      {[
        [-W / 2 - 0.55, -D / 2 - 0.5],
        [W / 2 + 0.55, -D / 2 - 0.5],
        [-W / 2 - 0.55, D / 2 + 0.5],
        [W / 2 + 0.55, D / 2 + 0.5],
        [0, D / 2 + 0.6],
        [0, -D / 2 - 0.6],
      ].map(([x, z], i) => (
        <Tree key={i} position={[x, 0, z]} s={0.9 + (i % 3) * 0.15} />
      ))}
    </group>
  );
}

function Controls({ size }) {
  const ref = useRef();
  const timer = useRef();
  const [auto, setAuto] = useState(true);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      autoRotate={auto}
      autoRotateSpeed={settings.plotLayout.autoRotateSpeed}
      minPolarAngle={0.35}
      maxPolarAngle={1.32}
      target={[0, 0, 0]}
      onStart={() => {
        clearTimeout(timer.current);
        setAuto(false);
      }}
      onEnd={() => {
        timer.current = setTimeout(() => setAuto(true), 3500);
      }}
    />
  );
}

export default function PlotScene({ layout, selectedId, onSelect, active = true }) {
  const size = Math.max(layout.cols * (CELL + GAP) + ROAD, layout.rows * (CELL + GAP)) + 2.2;
  const dist = size * 1.15 + 3;
  return (
    <Canvas
      className="canvas-fill"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, settings.plotLayout.dprMax]}
      camera={{ position: [dist * 0.55, dist * 0.7, dist * 0.8], fov: 36, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      onPointerMissed={() => onSelect(null)}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[-6, 9, 5]} intensity={2.2} color="#ffe2a0" />
      <directionalLight position={[7, 5, -5]} intensity={0.7} color="#8fb0e0" />
      <Suspense fallback={null}>
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={4} color="#ffd467" position={[-4, 5, 4]} scale={[7, 2, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[6, 3, 3]} scale={[2, 6, 1]} target={[0, 0, 0]} />
          <Lightformer form="ring" intensity={1.5} color="#f2a900" position={[0, 4, -6]} scale={7} target={[0, 0, 0]} />
        </Environment>
        <Layout layout={layout} selectedId={selectedId} onSelect={onSelect} />
      </Suspense>
      <Controls size={size} />
    </Canvas>
  );
}
