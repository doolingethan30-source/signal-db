import React, { useMemo } from 'react';
import * as THREE from 'three';

/** Soft, slightly glossy "toy" material – the look of the whole film. */
export const M: React.FC<{ c: string; r?: number; e?: string; ei?: number; side?: THREE.Side }> = ({
  c,
  r = 0.55,
  e,
  ei = 0,
  side,
}) => <meshStandardMaterial color={c} roughness={r} metalness={0} emissive={e ?? '#000000'} emissiveIntensity={ei} side={side} />;

type MeshProps = {
  p?: [number, number, number];
  s?: number | [number, number, number];
  rot?: [number, number, number];
  c: string;
  r?: number;
  e?: string;
  ei?: number;
};

export const Ball: React.FC<MeshProps & { rad: number; seg?: number }> = ({ p, s, rot, c, r, e, ei, rad, seg = 32 }) => (
  <mesh position={p} scale={s} rotation={rot}>
    <sphereGeometry args={[rad, seg, Math.round(seg * 0.75)]} />
    <M c={c} r={r} e={e} ei={ei} />
  </mesh>
);

export const Cap: React.FC<MeshProps & { rad: number; len: number }> = ({ p, s, rot, c, r, rad, len }) => (
  <mesh position={p} scale={s} rotation={rot}>
    <capsuleGeometry args={[rad, len, 8, 20]} />
    <M c={c} r={r} />
  </mesh>
);

export const Cone: React.FC<MeshProps & { rad: number; h: number; seg?: number }> = ({ p, s, rot, c, r, rad, h, seg = 24 }) => (
  <mesh position={p} scale={s} rotation={rot}>
    <coneGeometry args={[rad, h, seg]} />
    <M c={c} r={r} />
  </mesh>
);

export const Cyl: React.FC<MeshProps & { rt: number; rb: number; h: number; seg?: number }> = ({ p, s, rot, c, r, rt, rb, h, seg = 24 }) => (
  <mesh position={p} scale={s} rotation={rot}>
    <cylinderGeometry args={[rt, rb, h, seg]} />
    <M c={c} r={r} />
  </mesh>
);

/** Big glossy cartoon eye with a sparkle highlight; `open` 0..1 for blinking. */
export const Eye: React.FC<{ p: [number, number, number]; rad: number; open: number; lashes?: boolean; side?: number }> = ({
  p,
  rad,
  open,
  lashes,
  side = 1,
}) => (
  <group position={p} scale={[1, Math.max(open, 0.06), 1]}>
    <Ball rad={rad} c="#1E1410" r={0.18} s={[1, 1.12, 0.7]} />
    <Ball rad={rad * 0.62} p={[0, -rad * 0.08, rad * 0.32]} c="#4B2F22" r={0.2} s={[1, 1.1, 0.6]} />
    <Ball rad={rad * 0.34} p={[rad * 0.32, rad * 0.4, rad * 0.62]} c="#FFFFFF" e="#FFFFFF" ei={1.2} seg={16} />
    <Ball rad={rad * 0.14} p={[-rad * 0.3, -rad * 0.32, rad * 0.64]} c="#FFFFFF" e="#FFFFFF" ei={1} seg={12} />
    {lashes && (
      <mesh position={[side * rad * 0.85, rad * 0.75, rad * 0.1]} rotation={[0, 0, side * -0.9]}>
        <capsuleGeometry args={[rad * 0.1, rad * 0.45, 4, 8]} />
        <M c="#1E1410" />
      </mesh>
    )}
  </group>
);

/** Cheerful smile arc. */
export const Smile: React.FC<{ p: [number, number, number]; w: number; open?: number; rotX?: number }> = ({ p, w, open = 0, rotX = 0 }) => (
  <group position={p} rotation={[rotX, 0, 0]}>
    <mesh rotation={[0, 0, Math.PI]}>
      <torusGeometry args={[w, w * 0.22, 8, 24, Math.PI]} />
      <M c="#3A1F16" r={0.4} />
    </mesh>
    {open > 0.01 && (
      <mesh position={[0, -w * 0.25, -0.005]} scale={[1, open, 0.5]}>
        <sphereGeometry args={[w * 0.85, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <M c="#B8424B" r={0.5} />
      </mesh>
    )}
  </group>
);

/** Soft contact shadow (radial gradient decal on the ground). */
let shadowTex: THREE.Texture | null = null;
const getShadowTex = () => {
  if (shadowTex) return shadowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(30,60,20,0.55)');
  grd.addColorStop(0.55, 'rgba(30,60,20,0.25)');
  grd.addColorStop(1, 'rgba(30,60,20,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  shadowTex = new THREE.CanvasTexture(c);
  return shadowTex;
};

export const Shadow: React.FC<{ p: [number, number, number]; r: number; o?: number }> = ({ p, r, o = 1 }) => {
  const tex = useMemo(getShadowTex, []);
  return (
    <mesh position={[p[0], 0.004, p[2]]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <circleGeometry args={[r, 32]} />
      <meshBasicMaterial map={tex} transparent opacity={o} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

/** 4-point twinkle star, faces the camera (camera looks roughly down -z). */
const starShape = (() => {
  const s = new THREE.Shape();
  const pts = 8;
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2 + Math.PI / 2;
    const rr = i % 2 === 0 ? 1 : 0.28;
    const x = Math.cos(a) * rr;
    const y = Math.sin(a) * rr;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  return s;
})();

export const Twinkle: React.FC<{ p: [number, number, number]; size: number; rot?: number; color?: string; o?: number }> = ({
  p,
  size,
  rot = 0,
  color = '#FFF3A8',
  o = 1,
}) =>
  size <= 0.001 ? null : (
    <mesh position={p} scale={size} rotation={[0, 0, rot]} renderOrder={5}>
      <shapeGeometry args={[starShape]} />
      <meshBasicMaterial color={color} transparent opacity={o} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );

/** A burst of twinkles around a point, driven by local time t (0..1). */
export const SparkleBurst: React.FC<{ p: [number, number, number]; t: number; radius?: number; count?: number; size?: number }> = ({
  p,
  t,
  radius = 0.35,
  count = 6,
  size = 0.07,
}) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <group position={p}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + i * 0.7;
        const d = radius * (0.4 + 0.6 * t) * (0.7 + 0.3 * ((i * 37) % 10) / 10);
        const sz = size * Math.sin(Math.min(1, t * 1.2) * Math.PI) * (0.6 + 0.4 * ((i * 53) % 10) / 10);
        return <Twinkle key={i} p={[Math.cos(a) * d, Math.sin(a) * d, 0.05]} size={sz} rot={t * 2 + i} />;
      })}
    </group>
  );
};
