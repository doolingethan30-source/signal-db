import React from 'react';
import { loopSin, pop, tween, type V3 } from './anim';
import { Ball, Cyl, M, SparkleBurst } from './parts';

const TRUNK = '#8A5A36';
const LEAF = ['#4CAF50', '#5DBB4C', '#45A049', '#66C254', '#3F9E46'];

export const CANOPY: { p: V3; r: number }[] = [
  { p: [0, 2.55, -0.3], r: 1.0 },
  { p: [-0.78, 2.3, 0.0], r: 0.72 },
  { p: [0.8, 2.32, -0.05], r: 0.74 },
  { p: [-0.42, 3.05, -0.05], r: 0.7 },
  { p: [0.45, 3.0, -0.15], r: 0.72 },
  { p: [0.0, 2.1, 0.35], r: 0.66 },
  { p: [0.0, 3.25, -0.35], r: 0.6 },
  { p: [-1.15, 2.6, -0.4], r: 0.5 },
  { p: [1.15, 2.65, -0.45], r: 0.5 },
];

/** Apples on the tree. The first three are the ones that get shared. */
export const APPLES: V3[] = [
  [-0.55, 1.78, 0.62],
  [0.62, 1.84, 0.58],
  [0.18, 1.62, 0.92],
  [-0.95, 2.35, 0.58],
  [1.0, 2.5, 0.55],
  [-0.35, 2.75, 0.62],
  [0.42, 2.62, 0.75],
  [-0.62, 3.25, 0.5],
  [0.62, 3.25, 0.45],
  [0.05, 3.55, 0.25],
  [-1.3, 2.85, 0.15],
  [1.32, 2.95, 0.1],
  [0.0, 2.45, 0.98],
];

export const Apple: React.FC<{ p: V3; s?: number; rot?: number }> = ({ p, s = 1, rot = 0 }) =>
  s <= 0.001 ? null : (
    <group position={p} scale={s} rotation={[0, 0, rot]}>
      <Ball rad={0.13} s={[1.05, 0.95, 1.05]} c="#E8302B" r={0.28} />
      <Ball rad={0.035} p={[0.045, 0.06, 0.1]} c="#FFB3A6" r={0.2} seg={12} e="#FFFFFF" ei={0.25} />
      <Cyl rt={0.012} rb={0.016} h={0.08} p={[0, 0.14, 0]} rot={[0, 0, 0.2]} c="#5B3A21" seg={8} />
      <mesh position={[0.05, 0.16, 0]} rotation={[0, 0, -0.7]} scale={[1, 0.45, 0.25]}>
        <sphereGeometry args={[0.055, 14, 10]} />
        <M c="#4CAF50" r={0.6} />
      </mesh>
    </group>
  );

/** The little sprout (two round leaves) */
export const Sprout: React.FC<{ s: number; y?: number }> = ({ s, y = 0.06 }) =>
  s <= 0.001 ? null : (
    <group position={[0, y, 0]} scale={s}>
      <Cyl rt={0.018} rb={0.024} h={0.22} p={[0, 0.11, 0]} c="#6CC04A" seg={10} />
      {[-1, 1].map((k) => (
        <mesh key={k} position={[0.09 * k, 0.22, 0]} rotation={[0, 0, -0.55 * k]} scale={[1.6, 0.55, 1]}>
          <sphereGeometry args={[0.065, 16, 12]} />
          <M c="#7ED957" r={0.5} />
        </mesh>
      ))}
    </group>
  );

/** Apple tree that grows from the planted seed. `f` is the story frame. */
export const Tree: React.FC<{ f: number; shared: boolean[] }> = ({ f, shared }) => {
  const trunk = tween(f, 452, 512, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  if (trunk <= 0) return null;
  const branch = tween(f, 478, 515, 0, 1);
  const swayAmt = tween(f, 500, 560);
  const sway = 0.03 * loopSin(f, 10) * swayAmt; // 3 s period -> loops
  const sway2 = 0.02 * loopSin(f, 10, 0.9) * swayAmt;

  return (
    <group rotation={[sway2 * 0.4, 0, sway]}>
      {/* trunk */}
      <group scale={[0.4 + 0.6 * trunk, trunk, 0.4 + 0.6 * trunk]}>
        <Cyl rt={0.14} rb={0.22} h={2.1} p={[0, 1.05, 0]} c={TRUNK} r={0.85} />
        {/* roots */}
        {[0, 1.3, 2.6, 3.9, 5.2].map((a, i) => (
          <Cyl key={i} rt={0.03} rb={0.09} h={0.3} p={[Math.sin(a) * 0.17, 0.08, Math.cos(a) * 0.17]} rot={[Math.cos(a) * 1.0, 0, -Math.sin(a) * 1.0]} c={TRUNK} r={0.85} seg={10} />
        ))}
      </group>
      {/* branches */}
      {branch > 0 &&
        [
          { p: [-0.32, 1.85, 0] as V3, rz: 0.75 },
          { p: [0.34, 1.95, 0] as V3, rz: -0.7 },
          { p: [0.05, 2.05, 0.15] as V3, rz: 0.1 },
        ].map((b, i) => (
          <group key={i} position={[b.p[0] * branch, b.p[1] * trunk, b.p[2]]} rotation={[0, 0, b.rz]} scale={branch}>
            <Cyl rt={0.05} rb={0.09} h={0.7} p={[0, 0.2, 0]} c={TRUNK} r={0.85} seg={12} />
          </group>
        ))}
      {/* canopy (wobbles gently with its own sway) */}
      <group position={[0, 2.0, 0]} rotation={[0, 0, sway * 0.6]}>
        <group position={[0, -2.0, 0]}>
          {CANOPY.map((c, i) => {
            const s = pop(f, 490 + i * 4, 8, 120);
            if (s <= 0.001) return null;
            const breathe = 1 + 0.012 * loopSin(f, 10, i);
            return <Ball key={i} rad={c.r} p={c.p} s={s * breathe} c={LEAF[i % LEAF.length]} r={0.78} seg={40} />;
          })}
          {/* little leaf bumps on the canopy for texture */}
          {CANOPY.slice(0, 6).map((c, i) => {
            const s = pop(f, 500 + i * 4, 8, 120);
            if (s <= 0.001) return null;
            return (
              <Ball
                key={`b${i}`}
                rad={c.r * 0.38}
                p={[c.p[0] + c.r * 0.45 * Math.sin(i * 2.1), c.p[1] + c.r * 0.55, c.p[2] + c.r * 0.55]}
                s={s}
                c={LEAF[(i + 2) % LEAF.length]}
                r={0.78}
              />
            );
          })}
          {APPLES.map((a, i) => {
            if (shared[i]) return null;
            const s = pop(f, 524 + i * 2.5, 7, 160);
            return <Apple key={i} p={a} s={s} rot={0.2 * Math.sin(i * 1.7)} />;
          })}
          <SparkleBurst p={[0, 2.6, 1.1]} t={tween(f, 548, 590)} radius={1.4} count={9} size={0.14} />
        </group>
      </group>
    </group>
  );
};
