import React from 'react';
import { Ball, Cap, Cyl, Eye, Smile } from '../parts';
import { Rig } from './Rig';
import type { Pose } from './types';

const FAWN = '#C98A55';
const FAWN2 = '#B57844';
const LIGHT = '#F7E4C8';
const SPOT = '#FFFBF2';
const DARK = '#3D2619';
const HOOF = '#5B3B28';
const BOW = '#FFD23F';
const BOW2 = '#F5B800';
const BLUSH = '#FF9FA8';

/** point on an ellipsoid surface (theta from +y, phi around, 0 = +z) */
const surf = (r: number, sc: [number, number, number], th: number, ph: number, c: [number, number, number]) =>
  [
    c[0] + Math.sin(th) * Math.sin(ph) * r * sc[0],
    c[1] + Math.cos(th) * r * sc[1],
    c[2] + Math.sin(th) * Math.cos(ph) * r * sc[2],
  ] as [number, number, number];

const bodySpots: [number, number][] = [
  [0.8, 2.2], [1.1, 2.6], [0.75, 3.1], [1.2, 3.5], [0.85, 3.9], [1.05, 4.3], [0.6, 2.75], [0.65, 3.6], [1.25, 1.85], [1.3, 4.45],
];
const headSpots: [number, number][] = [
  [0.35, 2.6], [0.45, 3.4], [0.3, 4.0],
];

/** Daisy – baby deer with white spots and a yellow bow. */
export const Daisy: React.FC<{ p: Pose }> = ({ p }) => {
  const body = (
    <>
      {[-1, 1].map((s) => (
        <group key={s}>
          <Cap rad={0.062} len={0.14} p={[0.11 * s, 0.14, 0]} c={FAWN2} />
          <Cyl rt={0.06} rb={0.07} h={0.07} p={[0.11 * s, 0.035, 0.01]} c={HOOF} />
        </group>
      ))}
      <Ball rad={0.27} p={[0, 0.44, 0]} s={[1, 1.1, 0.96]} c={FAWN} />
      <Ball rad={0.19} p={[0, 0.41, 0.14]} s={[1, 1.15, 0.6]} c={LIGHT} />
      {bodySpots.map(([th, ph], i) => (
        <Ball key={i} rad={0.034} p={surf(0.272, [1, 1.1, 0.96], th, ph, [0, 0.44, 0])} s={[1, 1, 0.5]} c={SPOT} r={0.6} seg={12} />
      ))}
      <Ball rad={0.07} p={[0, 0.5, -0.26]} s={[1, 1.2, 0.8]} c={SPOT} />
    </>
  );

  const head = (
    <>
      <Ball rad={0.32} s={[1.05, 0.98, 1]} c={FAWN} />
      <Ball rad={0.15} p={[0, -0.1, 0.23]} s={[1.05, 0.8, 0.95]} c={LIGHT} />
      <Ball rad={0.046} p={[0, -0.055, 0.37]} s={[1.25, 0.9, 1]} c={DARK} r={0.25} />
      {headSpots.map(([th, ph], i) => (
        <Ball key={i} rad={0.03} p={surf(0.322, [1.05, 0.98, 1], th, ph, [0, 0, 0])} s={[1, 1, 0.5]} c={SPOT} r={0.6} seg={12} />
      ))}
      <Eye p={[-0.12, 0.03, 0.265]} rad={0.072} open={p.eyes} lashes side={-1} />
      <Eye p={[0.12, 0.03, 0.265]} rad={0.072} open={p.eyes} lashes side={1} />
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.045} p={[0.2 * s, -0.07, 0.24]} s={[1, 0.6, 0.4]} c={BLUSH} r={0.8} seg={16} />
      ))}
      <Smile p={[0, -0.14, 0.33]} w={0.042} open={p.smile} rotX={-0.25} />
      {/* big soft ears */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0.3 * s, 0.1, -0.03]} rotation={[0, 0, 0.35 * s]}>
          <Ball rad={0.1} p={[0.07 * s, 0, 0]} s={[1.75, 0.75, 0.38]} c={FAWN} />
          <Ball rad={0.075} p={[0.08 * s, 0, 0.022]} s={[1.6, 0.62, 0.25]} c="#F4B7A8" />
        </group>
      ))}
      {/* tiny antler nubs */}
      <Ball rad={0.04} p={[-0.1, 0.3, 0]} c={FAWN2} seg={16} />
      <Ball rad={0.04} p={[0.1, 0.3, 0]} c={FAWN2} seg={16} />
      {/* yellow bow */}
      <group position={[0.15, 0.27, 0.06]} rotation={[0.2, 0, -0.45]}>
        <Ball rad={0.085} p={[-0.085, 0, 0]} s={[1.25, 0.85, 0.45]} c={BOW} r={0.4} />
        <Ball rad={0.085} p={[0.085, 0, 0]} s={[1.25, 0.85, 0.45]} c={BOW} r={0.4} />
        <Ball rad={0.042} p={[0, 0, 0.012]} c={BOW2} r={0.4} seg={16} />
      </group>
    </>
  );

  const arm = () => (
    <>
      <Cap rad={0.056} len={0.16} p={[0, -0.12, 0]} c={FAWN} />
      <Cyl rt={0.058} rb={0.062} h={0.06} p={[0, -0.235, 0]} c={HOOF} />
    </>
  );

  return <Rig p={p} shadow={0.4} shoulder={[0.235, 0.6, 0.02]} neck={[0, 0.93, 0.03]} body={body} head={head} arm={arm} />;
};
