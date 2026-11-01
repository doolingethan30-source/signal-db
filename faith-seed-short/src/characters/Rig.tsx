import React from 'react';
import { Shadow } from '../parts';
import type { Pose } from './types';

/**
 * Shared rig: places the character, its contact shadow, applies jump / squash /
 * lean, and exposes head + arm pivots to the specific character.
 */
export const Rig: React.FC<{
  p: Pose;
  shadow: number;
  shoulder: [number, number, number]; // +x shoulder position (mirrored for -x)
  neck: [number, number, number];
  body: React.ReactNode;
  head: React.ReactNode;
  arm: (side: -1 | 1) => React.ReactNode;
  children?: React.ReactNode; // extra items attached to body (props held etc.)
}> = ({ p, shadow, shoulder, neck, body, head, arm, children }) => {
  if (!p.visible) return null;
  const sq = p.squash;
  const sx = 1 / Math.sqrt(sq);
  return (
    <>
      <Shadow p={p.pos} r={shadow * (1 - p.lift * 0.8)} o={1 - p.lift * 1.2} />
      <group position={[p.pos[0], p.pos[1] + p.lift, p.pos[2]]} rotation={[0, p.rotY, 0]}>
        <group rotation={[p.tilt, 0, 0]} scale={[sx, sq, sx]}>
          {body}
          {([-1, 1] as const).map((side) => (
            <group
              key={side}
              position={[shoulder[0] * side, shoulder[1], shoulder[2]]}
              rotation={[-(side === -1 ? p.fwdA : p.fwdB), 0, side * (side === -1 ? p.armA : p.armB)]}
            >
              {arm(side)}
            </group>
          ))}
          <group position={neck} rotation={[p.headNod, p.headTurn, p.headTilt]}>
            {head}
          </group>
          {children}
        </group>
      </group>
    </>
  );
};
