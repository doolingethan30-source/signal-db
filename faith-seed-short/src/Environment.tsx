import React, { useMemo } from 'react';
import * as THREE from 'three';
import { loopSin } from './anim';
import { Ball, Cone, Cyl, M } from './parts';

const groundTex = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(256, 256, 0, 256, 256, 256);
  grd.addColorStop(0, '#9BDB6E');
  grd.addColorStop(0.12, '#8ED164');
  grd.addColorStop(0.45, '#7BC555');
  grd.addColorStop(1, '#69B84A');
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const RoundTree: React.FC<{ p: [number, number, number]; s?: number; f: number; tint?: number }> = ({ p, s = 1, f, tint = 0 }) => {
  const leaf = ['#5AAE4E', '#4FA346', '#63B957'][tint % 3];
  return (
    <group position={p} scale={s} rotation={[0, 0, 0.012 * loopSin(f, 10, p[0])]}>
      <Cyl rt={0.16} rb={0.24} h={1.8} p={[0, 0.9, 0]} c="#7E5232" r={0.9} />
      <Ball rad={1.15} p={[0, 2.3, 0]} c={leaf} r={0.85} />
      <Ball rad={0.8} p={[-0.75, 1.95, 0.2]} c={leaf} r={0.85} />
      <Ball rad={0.8} p={[0.75, 2.0, 0.1]} c={leaf} r={0.85} />
      <Ball rad={0.7} p={[0, 3.1, 0]} c={leaf} r={0.85} />
    </group>
  );
};

const PineTree: React.FC<{ p: [number, number, number]; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <Cyl rt={0.12} rb={0.18} h={0.9} p={[0, 0.45, 0]} c="#6E4A2E" r={0.9} />
    <Cone rad={1.0} h={1.5} p={[0, 1.4, 0]} c="#3E9A57" r={0.85} />
    <Cone rad={0.8} h={1.3} p={[0, 2.1, 0]} c="#46A55F" r={0.85} />
    <Cone rad={0.55} h={1.1} p={[0, 2.75, 0]} c="#4FAF66" r={0.85} />
  </group>
);

const Bush: React.FC<{ p: [number, number, number]; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <Ball rad={0.45} p={[0, 0.25, 0]} c="#58B04A" r={0.85} />
    <Ball rad={0.35} p={[-0.42, 0.18, 0.05]} c="#4FA544" r={0.85} />
    <Ball rad={0.35} p={[0.42, 0.18, 0.0]} c="#62BA52" r={0.85} />
  </group>
);

const Flower: React.FC<{ p: [number, number, number]; color: string; f: number; s?: number }> = ({ p, color, f, s = 1 }) => (
  <group position={p} scale={s} rotation={[0, 0, 0.08 * loopSin(f, 15, p[0] * 3 + p[2])]}>
    <Cyl rt={0.01} rb={0.014} h={0.22} p={[0, 0.11, 0]} c="#4E9E3C" seg={6} />
    <group position={[0, 0.23, 0]} rotation={[0.5, 0, 0]}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return <Ball key={i} rad={0.035} p={[Math.cos(a) * 0.04, Math.sin(a) * 0.04, 0]} s={[1, 1, 0.5]} c={color} r={0.6} seg={10} />;
      })}
      <Ball rad={0.025} p={[0, 0, 0.012]} c="#FFC93C" r={0.5} seg={10} />
    </group>
  </group>
);

const Mushroom: React.FC<{ p: [number, number, number]; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <Cyl rt={0.05} rb={0.065} h={0.14} p={[0, 0.07, 0]} c="#FFF3DD" seg={12} />
    <mesh position={[0, 0.13, 0]} scale={[1, 0.7, 1]}>
      <sphereGeometry args={[0.12, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <M c="#E84B3C" r={0.45} />
    </mesh>
    {[0.5, 2.2, 3.9, 5.3].map((a, i) => (
      <Ball key={i} rad={0.018} p={[Math.cos(a) * 0.075, 0.19, Math.sin(a) * 0.075]} c="#FFFFFF" seg={8} />
    ))}
  </group>
);

const GrassTuft: React.FC<{ p: [number, number, number]; f: number }> = ({ p, f }) => (
  <group position={p} rotation={[0, p[0], 0.1 * loopSin(f, 10, p[0] + p[2])]}>
    {[-0.04, 0, 0.04].map((x, i) => (
      <Cone key={i} rad={0.022} h={0.16 + i * 0.03} p={[x, 0.08, 0]} rot={[0, 0, -x * 4]} c={i === 1 ? '#5FB548' : '#6CC152'} r={0.8} seg={6} />
    ))}
  </group>
);

const Cloud: React.FC<{ p: [number, number, number]; s: number; f: number; drift: number }> = ({ p, s, f, drift }) => (
  <group position={[p[0] + drift * loopSin(f, 1, p[1]), p[1], p[2]]} scale={s}>
    {[
      [0, 0, 0, 1],
      [-1.1, -0.25, 0.1, 0.75],
      [1.1, -0.2, 0, 0.8],
      [0.5, 0.45, -0.1, 0.7],
      [-0.5, 0.35, 0, 0.65],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[r, 24, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.45} roughness={1} fog={false} />
      </mesh>
    ))}
  </group>
);

const Butterfly: React.FC<{ f: number; center: [number, number, number]; rx: number; rz: number; color: string; phase: number }> = ({
  f,
  center,
  rx,
  rz,
  color,
  phase,
}) => {
  const a = (f / 900) * Math.PI * 2 * 3 + phase; // 3 laps per 30 s
  const x = center[0] + Math.cos(a) * rx;
  const z = center[2] + Math.sin(a) * rz;
  const y = center[1] + 0.15 * Math.sin(a * 4);
  const flap = Math.sin((f / 6) * Math.PI * 2 + phase) * 0.9; // period 6 frames divides 900
  const heading = Math.atan2(-Math.sin(a) * rx, Math.cos(a) * rz);
  return (
    <group position={[x, y, z]} rotation={[0, heading, 0]} scale={0.9}>
      <Ball rad={0.018} s={[1, 1, 4]} c="#3B2A20" seg={8} />
      {[-1, 1].map((k) => (
        <group key={k} rotation={[0, 0, k * flap]}>
          <mesh position={[0.07 * k, 0, 0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]}>
            <circleGeometry args={[0.06, 16]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.6} />
          </mesh>
          <mesh position={[0.055 * k, 0, -0.06]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.04, 14]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const FLOWERS: { p: [number, number, number]; c: string; s?: number }[] = [
  { p: [-1.35, 0, 1.25], c: '#FFFFFF' },
  { p: [-1.6, 0, 0.9], c: '#FFB3C7' },
  { p: [-1.1, 0, 2.1], c: '#FFFFFF' },
  { p: [1.45, 0, 1.15], c: '#FFB3C7' },
  { p: [1.15, 0, 1.6], c: '#FFFFFF' },
  { p: [1.85, 0, 0.95], c: '#FFFFFF' },
  { p: [-2.1, 0, -0.4], c: '#FFB3C7', s: 1.2 },
  { p: [2.2, 0, -0.6], c: '#FFFFFF', s: 1.2 },
  { p: [-0.9, 0, -1.3], c: '#FFFFFF' },
  { p: [1.0, 0, -1.5], c: '#FFB3C7' },
  { p: [-2.6, 0, 1.6], c: '#FFFFFF', s: 1.1 },
  { p: [2.5, 0, 1.9], c: '#FFB3C7', s: 1.1 },
  { p: [0.55, 0, 2.3], c: '#FFFFFF' },
  { p: [-0.35, 0, 2.5], c: '#FFB3C7' },
  { p: [-1.7, 0, -1.8], c: '#FFFFFF', s: 1.2 },
  { p: [1.9, 0, -2.0], c: '#FFFFFF', s: 1.2 },
];

const TUFTS: [number, number, number][] = [
  [-0.95, 0, 1.55], [0.9, 0, 1.25], [-1.95, 0, 0.3], [2.05, 0, 0.2], [-0.6, 0, -0.9], [0.7, 0, -0.8],
  [-2.3, 0, 2.4], [2.3, 0, 2.6], [0.2, 0, 2.9], [-1.4, 0, -0.6], [1.5, 0, -0.3], [-0.2, 0, -1.6],
];

export const Environment: React.FC<{ f: number }> = ({ f }) => {
  const tex = useMemo(groundTex, []);
  return (
    <>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[70, 64]} />
        <meshStandardMaterial map={tex} roughness={0.95} />
      </mesh>
      {/* rolling hills */}
      <Ball rad={14} p={[-16, -9.5, -34]} s={[1, 0.85, 0.6]} c="#78C25A" r={0.95} seg={48} />
      <Ball rad={16} p={[15, -11, -40]} s={[1, 0.85, 0.6]} c="#82C863" r={0.95} seg={48} />
      <Ball rad={12} p={[0, -9.2, -48]} s={[1.6, 0.85, 0.6]} c="#8DCF6C" r={0.95} seg={48} />
      {/* woodland edge */}
      <RoundTree p={[-4.3, 0, -4.8]} s={1.15} f={f} tint={0} />
      <PineTree p={[-6.2, 0, -8.5]} s={1.5} />
      <RoundTree p={[-2.6, 0, -10.5]} s={1.1} f={f} tint={1} />
      <PineTree p={[-9.5, 0, -14]} s={1.8} />
      <RoundTree p={[4.5, 0, -5.6]} s={1.2} f={f} tint={2} />
      <PineTree p={[6.4, 0, -9.5]} s={1.6} />
      <RoundTree p={[2.9, 0, -12.5]} s={1.1} f={f} tint={0} />
      <PineTree p={[9.8, 0, -15]} s={1.9} />
      <PineTree p={[-0.6, 0, -17]} s={1.5} />
      <Bush p={[-2.6, 0, -2.3]} s={1.0} />
      <Bush p={[2.8, 0, -2.6]} s={1.1} />
      <Bush p={[-3.4, 0, 0.8]} s={0.9} />
      <Bush p={[3.5, 0, 0.6]} s={0.9} />
      {/* little details */}
      <Mushroom p={[-1.85, 0, -0.9]} s={1.2} />
      <Mushroom p={[-1.62, 0, -1.05]} s={0.8} />
      <Mushroom p={[2.05, 0, -1.3]} s={1.0} />
      <Ball rad={0.18} p={[2.4, 0.05, 1.4]} s={[1.3, 0.6, 1]} c="#B9B4AC" r={0.9} />
      <Ball rad={0.12} p={[-2.35, 0.03, 1.9]} s={[1.3, 0.6, 1]} c="#C4BFB7" r={0.9} />
      {FLOWERS.map((fl, i) => (
        <Flower key={i} p={fl.p} color={fl.c} f={f} s={fl.s} />
      ))}
      {TUFTS.map((t, i) => (
        <GrassTuft key={i} p={t} f={f} />
      ))}
      {/* sky */}
      <Cloud p={[-6, 13, -38]} s={2.2} f={f} drift={1.5} />
      <Cloud p={[7, 16, -42]} s={2.6} f={f} drift={-1.8} />
      <Cloud p={[1, 19.5, -46]} s={2.0} f={f} drift={1.2} />
      <Cloud p={[-9, 18, -44]} s={1.6} f={f} drift={-1.0} />
      <Butterfly f={f} center={[-1.2, 1.6, 0.2]} rx={0.9} rz={0.6} color="#8FD3FF" phase={0} />
      <Butterfly f={f} center={[1.3, 1.9, -0.4]} rx={0.8} rz={0.7} color="#FFB3D1" phase={2.4} />
    </>
  );
};
