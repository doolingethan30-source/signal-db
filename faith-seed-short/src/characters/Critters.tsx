import React from 'react';
import { Ball, Cap, Cone, Eye, Smile } from '../parts';
import { Rig } from './Rig';
import type { Pose } from './types';

const BLUSH = '#FF9FA8';

/** Bunny friend */
export const Bunny: React.FC<{ p: Pose }> = ({ p }) => {
  const C = '#DCD6CF';
  const W = '#FBF8F3';
  const PINK = '#F6A9BA';
  const body = (
    <>
      <Ball rad={0.2} p={[0, 0.21, 0]} s={[1, 1.05, 1]} c={C} r={0.8} />
      <Ball rad={0.14} p={[0, 0.2, 0.09]} s={[1, 1.1, 0.7]} c={W} r={0.8} />
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.075} p={[0.1 * s, 0.035, 0.08]} s={[0.9, 0.5, 1.5]} c={W} r={0.8} />
      ))}
      <Ball rad={0.075} p={[0, 0.2, -0.2]} c={W} r={0.9} />
    </>
  );
  const head = (
    <>
      <Ball rad={0.18} s={[1.1, 0.95, 1]} c={C} r={0.8} />
      <Ball rad={0.085} p={[0, -0.05, 0.13]} s={[1.3, 0.85, 0.9]} c={W} r={0.8} />
      <Ball rad={0.026} p={[0, -0.015, 0.205]} c={PINK} r={0.4} seg={12} />
      <Eye p={[-0.07, 0.03, 0.15]} rad={0.042} open={p.eyes} />
      <Eye p={[0.07, 0.03, 0.15]} rad={0.042} open={p.eyes} />
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.03} p={[0.12 * s, -0.04, 0.13]} s={[1, 0.6, 0.4]} c={BLUSH} r={0.8} seg={12} />
      ))}
      <Smile p={[0, -0.085, 0.19]} w={0.022} open={p.smile} rotX={-0.3} />
      {[-1, 1].map((s) => (
        <group key={s} position={[0.07 * s, 0.13, -0.02]} rotation={[-0.15, 0, -0.18 * s + p.tail * 0.3 * s]}>
          <Cap rad={0.05} len={0.2} p={[0, 0.13, 0]} s={[1, 1, 0.6]} c={C} r={0.8} />
          <Cap rad={0.03} len={0.17} p={[0, 0.13, 0.022]} s={[1, 1, 0.4]} c={PINK} r={0.8} />
        </group>
      ))}
    </>
  );
  const arm = () => <Cap rad={0.04} len={0.06} p={[0, -0.06, 0]} c={W} r={0.8} />;
  return <Rig p={p} shadow={0.28} shoulder={[0.14, 0.28, 0.08]} neck={[0, 0.47, 0.02]} body={body} head={head} arm={arm} />;
};

/** Squirrel friend */
export const Squirrel: React.FC<{ p: Pose }> = ({ p }) => {
  const C = '#B8642C';
  const C2 = '#A0531F';
  const W = '#F8E3C4';
  const body = (
    <>
      <Ball rad={0.18} p={[0, 0.2, 0]} s={[1, 1.1, 1]} c={C} r={0.75} />
      <Ball rad={0.12} p={[0, 0.19, 0.09]} s={[1, 1.15, 0.65]} c={W} r={0.8} />
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.065} p={[0.09 * s, 0.03, 0.06]} s={[0.9, 0.5, 1.4]} c={C2} r={0.8} />
      ))}
      {/* big curly tail */}
      <group position={[0, 0.18, -0.15]} rotation={[0.1 + p.tail * 0.2, 0, p.tail * 0.15]}>
        <Ball rad={0.11} p={[0, 0.05, -0.08]} c={C} r={0.85} />
        <Ball rad={0.13} p={[0, 0.2, -0.17]} c={C} r={0.85} />
        <Ball rad={0.14} p={[0, 0.38, -0.17]} c={C} r={0.85} />
        <Ball rad={0.12} p={[0, 0.52, -0.08]} c={C} r={0.85} />
        <Ball rad={0.08} p={[0, 0.56, 0.03]} c={W} r={0.85} />
      </group>
    </>
  );
  const head = (
    <>
      <Ball rad={0.16} s={[1.1, 0.95, 1]} c={C} r={0.75} />
      <Ball rad={0.08} p={[0, -0.05, 0.11]} s={[1.25, 0.85, 0.9]} c={W} r={0.8} />
      <Ball rad={0.024} p={[0, -0.02, 0.185]} c="#3A2217" r={0.3} seg={12} />
      <Eye p={[-0.065, 0.03, 0.13]} rad={0.04} open={p.eyes} />
      <Eye p={[0.065, 0.03, 0.13]} rad={0.04} open={p.eyes} />
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.028} p={[0.11 * s, -0.04, 0.12]} s={[1, 0.6, 0.4]} c={BLUSH} r={0.8} seg={12} />
      ))}
      <Smile p={[0, -0.08, 0.17]} w={0.02} open={p.smile} rotX={-0.3} />
      {[-1, 1].map((s) => (
        <Cone key={s} rad={0.05} h={0.11} p={[0.09 * s, 0.15, -0.01]} rot={[0, 0, -0.25 * s]} s={[1, 1, 0.6]} c={C} r={0.8} />
      ))}
    </>
  );
  const arm = () => <Cap rad={0.035} len={0.06} p={[0, -0.055, 0]} c={C2} r={0.8} />;
  return <Rig p={p} shadow={0.27} shoulder={[0.13, 0.27, 0.08]} neck={[0, 0.43, 0.02]} body={body} head={head} arm={arm} />;
};

/** Hedgehog friend */
const spikes: [number, number][] = [];
for (let row = 0; row < 4; row++) {
  const th = 0.35 + row * 0.33;
  const n = 7 + row * 2;
  for (let i = 0; i < n; i++) {
    const ph = Math.PI * 0.42 + (i / (n - 1)) * Math.PI * 1.16 + (row % 2) * 0.08;
    spikes.push([th, ph]);
  }
}

export const Hedgehog: React.FC<{ p: Pose }> = ({ p }) => {
  const SP = '#7A5238';
  const FACE = '#F2D7B3';
  const body = (
    <>
      <Ball rad={0.2} p={[0, 0.2, 0]} s={[1.1, 0.95, 1.15]} c={SP} r={0.8} />
      {spikes.map(([th, ph], i) => {
        const dir: [number, number, number] = [Math.sin(th) * Math.sin(ph), Math.cos(th), Math.sin(th) * Math.cos(ph)];
        const pos: [number, number, number] = [dir[0] * 0.21, 0.2 + dir[1] * 0.2, dir[2] * 0.23];
        // orient cone (+y) along dir
        const rx = Math.atan2(dir[2], dir[1]);
        const rz = -Math.asin(Math.max(-1, Math.min(1, dir[0])));
        return <Cone key={i} rad={0.035} h={0.12} p={pos} rot={[rx, 0, rz]} c={i % 3 === 0 ? '#5E3E2A' : SP} r={0.8} seg={8} />;
      })}
      <Ball rad={0.15} p={[0, 0.17, 0.1]} s={[1, 0.95, 0.8]} c={FACE} r={0.8} />
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.05} p={[0.09 * s, 0.025, 0.08]} s={[1, 0.5, 1.3]} c={FACE} r={0.8} seg={14} />
      ))}
    </>
  );
  const head = (
    <>
      <Ball rad={0.13} s={[1.05, 0.95, 1]} c={FACE} r={0.8} />
      <Ball rad={0.07} p={[0, -0.03, 0.12]} s={[0.9, 0.8, 1.2]} c={FACE} r={0.8} />
      <Ball rad={0.028} p={[0, -0.01, 0.205]} c="#2A1A12" r={0.25} seg={12} />
      <Eye p={[-0.055, 0.035, 0.105]} rad={0.035} open={p.eyes} />
      <Eye p={[0.055, 0.035, 0.105]} rad={0.035} open={p.eyes} />
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.025} p={[0.09 * s, -0.025, 0.1]} s={[1, 0.6, 0.4]} c={BLUSH} r={0.8} seg={12} />
      ))}
      <Smile p={[0, -0.07, 0.15]} w={0.018} open={p.smile} rotX={-0.3} />
      <Ball rad={0.035} p={[-0.08, 0.1, 0]} c={SP} seg={12} />
      <Ball rad={0.035} p={[0.08, 0.1, 0]} c={SP} seg={12} />
    </>
  );
  const arm = () => <Cap rad={0.032} len={0.05} p={[0, -0.05, 0]} c={FACE} r={0.8} />;
  return <Rig p={p} shadow={0.3} shoulder={[0.13, 0.22, 0.12]} neck={[0, 0.3, 0.12]} body={body} head={head} arm={arm} />;
};
