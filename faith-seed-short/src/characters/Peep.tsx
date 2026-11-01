import React from 'react';
import { Ball, Cone, Cyl, Eye, M, Smile } from '../parts';
import { Rig } from './Rig';
import type { Pose } from './types';

const GOLD = '#FFC83A';
const GOLD2 = '#FFB21E';
const BEAK = '#FF8A1F';
const BLUSH = '#FF9C8A';

export const CAN_BLUE = '#58B9E6';

/** Little watering can. Spout points +z. */
export const WateringCan: React.FC<{ tilt?: number }> = ({ tilt = 0 }) => (
  <group rotation={[tilt, 0, 0]}>
    <Cyl rt={0.095} rb={0.105} h={0.15} c={CAN_BLUE} r={0.35} />
    <mesh position={[0, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.093, 0.012, 8, 28]} />
      <M c="#3D9CCB" r={0.35} />
    </mesh>
    <mesh position={[0, 0.06, -0.1]} rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[0.065, 0.015, 8, 20, Math.PI]} />
      <M c="#3D9CCB" r={0.35} />
    </mesh>
    <Cyl rt={0.017} rb={0.022} h={0.2} p={[0, 0.03, 0.15]} rot={[1.05, 0, 0]} c={CAN_BLUE} r={0.35} />
    <Cone rad={0.04} h={0.05} p={[0, 0.085, 0.24]} rot={[-2.1, 0, 0]} c="#3D9CCB" r={0.35} />
    <Ball rad={0.03} p={[0.06, 0.02, 0.095]} s={[1, 1, 0.3]} c="#FFFFFF" r={0.5} seg={12} />
  </group>
);

/** Peep – fluffy golden chick. */
export const Peep: React.FC<{ p: Pose; can?: boolean; canTilt?: number }> = ({ p, can, canTilt = 0 }) => {
  const body = (
    <>
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.06} p={[0.09 * s, 0.025, 0.07]} s={[1, 0.45, 1.4]} c={BEAK} />
      ))}
      <Ball rad={0.27} p={[0, 0.29, 0]} s={[1, 0.95, 1]} c={GOLD} r={0.75} />
      {/* fluffy bumps */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <Ball key={i} rad={0.07} p={[Math.sin(a) * 0.25, 0.2 + (i % 2) * 0.05, Math.cos(a) * 0.25]} c={GOLD} r={0.8} seg={14} />;
      })}
      <Ball rad={0.16} p={[0, 0.25, 0.13]} s={[1, 1.1, 0.65]} c="#FFE07A" r={0.8} />
      <Ball rad={0.06} p={[0, 0.3, -0.27]} s={[1.2, 0.7, 1]} c={GOLD2} r={0.8} seg={16} />
    </>
  );

  const head = (
    <>
      <Ball rad={0.21} c={GOLD} r={0.75} />
      <Ball rad={0.05} p={[0, 0.21, 0]} s={[0.8, 1.3, 0.8]} c={GOLD2} r={0.8} seg={14} />
      <Ball rad={0.042} p={[-0.045, 0.19, -0.03]} rot={[0, 0, 0.5]} s={[0.8, 1.3, 0.8]} c={GOLD2} r={0.8} seg={14} />
      <Ball rad={0.042} p={[0.045, 0.19, -0.03]} rot={[0, 0, -0.5]} s={[0.8, 1.3, 0.8]} c={GOLD2} r={0.8} seg={14} />
      <Cone rad={0.048} h={0.1} p={[0, -0.03, 0.22]} rot={[Math.PI / 2, 0, 0]} s={[1.2, 1, 0.75]} c={BEAK} r={0.4} />
      <Eye p={[-0.085, 0.035, 0.165]} rad={0.055} open={p.eyes} />
      <Eye p={[0.085, 0.035, 0.165]} rad={0.055} open={p.eyes} />
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.035} p={[0.14 * s, -0.035, 0.15]} s={[1, 0.6, 0.4]} c={BLUSH} r={0.8} seg={14} />
      ))}
      {p.smile > 0.3 && <Smile p={[0, -0.095, 0.205]} w={0.025} open={p.smile} rotX={-0.3} />}
    </>
  );

  const arm = (side: -1 | 1) => (
    <Ball rad={0.11} p={[0.02 * side, -0.07, 0]} s={[0.45, 1, 0.85]} c={GOLD2} r={0.8} />
  );

  return (
    <Rig p={p} shadow={0.34} shoulder={[0.25, 0.37, 0]} neck={[0, 0.6, 0.02]} body={body} head={head} arm={arm}>
      {can && (
        <group position={[0, 0.27, 0.3]}>
          <WateringCan tilt={canTilt} />
        </group>
      )}
    </Rig>
  );
};
