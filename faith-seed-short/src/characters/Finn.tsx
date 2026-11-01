import React from 'react';
import * as THREE from 'three';
import { Ball, Cap, Cone, Eye, M, Smile } from '../parts';
import { Rig } from './Rig';
import type { Pose } from './types';

const OR = '#F2832C';
const OR2 = '#E06F1F';
const CREAM = '#FFF4E4';
const DARK = '#3B2418';
const VEST = '#3E9E4E';
const BLUSH = '#FF9C9C';

/** Finn – baby orange fox in a green vest. */
export const Finn: React.FC<{ p: Pose }> = ({ p }) => {
  const body = (
    <>
      {/* legs + feet */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Cap rad={0.085} len={0.1} p={[0.12 * s, 0.13, 0.0]} c={OR2} />
          <Ball rad={0.095} p={[0.12 * s, 0.05, 0.05]} s={[1, 0.62, 1.3]} c={DARK} r={0.6} />
        </group>
      ))}
      {/* body + belly */}
      <Ball rad={0.29} p={[0, 0.43, 0]} s={[1, 1.08, 0.92]} c={OR} />
      <Ball rad={0.2} p={[0, 0.4, 0.15]} s={[1, 1.15, 0.62]} c={CREAM} />
      {/* green vest: a band of a sphere, open at the front */}
      <mesh position={[0, 0.43, 0]} scale={[1.05, 1.13, 0.97]}>
        <sphereGeometry args={[0.296, 40, 24, Math.PI / 2 + 0.62, Math.PI * 2 - 1.24, 0.72, 1.32]} />
        <M c={VEST} r={0.7} side={THREE.DoubleSide} />
      </mesh>
      <Ball rad={0.026} p={[0.177, 0.52, 0.215]} c="#FFD54A" r={0.3} seg={12} />
      <Ball rad={0.026} p={[0.19, 0.41, 0.215]} c="#FFD54A" r={0.3} seg={12} />
      {/* fluffy tail */}
      <group position={[0, 0.3, -0.22]} rotation={[-0.5, p.tail, 0]}>
        <Ball rad={0.14} p={[0, 0.02, -0.1]} s={[0.9, 0.9, 1.35]} c={OR} />
        <Ball rad={0.135} p={[0, 0.12, -0.27]} c={OR} />
        <Ball rad={0.11} p={[0, 0.2, -0.39]} c={CREAM} />
      </group>
    </>
  );

  const head = (
    <>
      <Ball rad={0.34} s={[1.12, 0.95, 1]} c={OR} />
      {/* white cheek fluff + muzzle */}
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.15} p={[0.2 * s, -0.11, 0.16]} s={[1.15, 0.8, 0.85]} c={CREAM} />
      ))}
      <Ball rad={0.14} p={[0, -0.09, 0.26]} s={[1.1, 0.8, 0.9]} c={CREAM} />
      <Ball rad={0.046} p={[0, -0.04, 0.39]} s={[1.2, 0.9, 1]} c={DARK} r={0.25} />
      {/* eyes, blush, smile */}
      <Eye p={[-0.125, 0.04, 0.285]} rad={0.068} open={p.eyes} />
      <Eye p={[0.125, 0.04, 0.285]} rad={0.068} open={p.eyes} />
      {[-1, 1].map((s) => (
        <Ball key={s} rad={0.045} p={[0.215 * s, -0.06, 0.255]} s={[1, 0.6, 0.4]} c={BLUSH} r={0.8} seg={16} />
      ))}
      <Smile p={[0, -0.135, 0.345]} w={0.045} open={p.smile} rotX={-0.25} />
      {/* ears */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0.19 * s, 0.24, -0.03]} rotation={[0, 0, -0.32 * s]}>
          <Cone rad={0.12} h={0.28} p={[0, 0.11, 0]} s={[1, 1, 0.55]} c={OR} />
          <Cone rad={0.075} h={0.18} p={[0, 0.08, 0.04]} s={[1, 1, 0.3]} c={CREAM} />
          <Cone rad={0.052} h={0.1} p={[0, 0.215, 0]} s={[1, 1, 0.6]} c={DARK} />
        </group>
      ))}
      {/* little head tuft */}
      <Ball rad={0.06} p={[0, 0.31, 0.04]} s={[1, 0.7, 1]} c={OR} />
    </>
  );

  const arm = () => (
    <>
      <Cap rad={0.07} len={0.15} p={[0, -0.12, 0]} c={OR} />
      <Ball rad={0.072} p={[0, -0.24, 0]} c={DARK} r={0.6} />
    </>
  );

  return <Rig p={p} shadow={0.42} shoulder={[0.25, 0.58, 0.02]} neck={[0, 0.94, 0.02]} body={body} head={head} arm={arm} />;
};
