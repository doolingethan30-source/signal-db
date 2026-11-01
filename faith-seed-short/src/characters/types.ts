import type { V3 } from '../anim';

export type Pose = {
  pos: V3; // feet on ground
  lift: number; // jump height
  rotY: number;
  tilt: number; // lean forward
  squash: number; // 1 = normal
  headNod: number; // + looks down
  headTurn: number;
  headTilt: number;
  armA: number; // raise of the arm on local -x side (outward/up +)
  armB: number; // raise of the arm on local +x side
  fwdA: number; // forward swing (+ forward)
  fwdB: number;
  eyes: number; // 0 closed .. 1 open
  smile: number; // mouth open amount 0..1
  tail: number;
  visible: boolean;
};

export const basePose = (pos: V3, rotY = 0): Pose => ({
  pos,
  lift: 0,
  rotY,
  tilt: 0,
  squash: 1,
  headNod: 0,
  headTurn: 0,
  headTilt: 0,
  armA: 0.15,
  armB: 0.15,
  fwdA: 0,
  fwdB: 0,
  eyes: 1,
  smile: 0,
  tail: 0,
  visible: true,
});
