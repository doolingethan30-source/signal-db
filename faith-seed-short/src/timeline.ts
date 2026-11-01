/**
 * Story timeline (30 fps, 900 frames = exactly 30 s)
 *
 *   0 – 135  1. Finn waves, spots a twinkling seed and picks it up
 * 135 – 240  2. Daisy trots in, digs a little hole, Finn drops the seed in, Daisy pats the soil
 * 240 – 345  3. Peep hops in and waters the soil with a little watering can
 * 345 – 445  4. Everyone waits patiently… a green sprout pops up!
 * 445 – 565  5. The sprout grows into an apple tree with bright red apples
 * 565 – 705  6. Apples are shared with a bunny, a squirrel and a hedgehog
 * 705 – 900  7. Finn and friends smile and wave beside the swaying tree (+ ending text)
 *              Last 22 frames cross-fade into frame 0 (Finn waving in the meadow) → seamless loop
 */
import { arc, blink, inFront, jump, jumps, kf, lerp3, tween, walkHop, wave, type V3 } from './anim';
import { basePose, type Pose } from './characters/types';

export const PLANT: V3 = [0, 0, 0];

// ------------------------------------------------------------------ camera
const CAM_WIDE = { pos: [0, 2.15, 9.6] as V3, look: [0, 1.9, 0] as V3 };
const CAM_CLOSE = { pos: [-0.05, 1.7, 5.7] as V3, look: [0.0, 0.62, 0.35] as V3 };

export const camera = (f: number, raw: number) => {
  const t = kf(f, [
    [0, 0],
    [18, 0],
    [78, 1],
    [446, 1],
    [528, 0],
  ]);
  const pos = lerp3(CAM_WIDE.pos, CAM_CLOSE.pos, t);
  const look = lerp3(CAM_WIDE.look, CAM_CLOSE.look, t);
  // tiny breathing drift, periodic over the loop
  pos[0] += 0.1 * Math.sin((raw / 900) * Math.PI * 2);
  pos[1] += 0.04 * Math.sin((raw / 900) * Math.PI * 4);
  return { pos, look };
};

// helper: arm blend between a value and the periodic wave
const waving = (f: number, raw: number, rest: number, inA: number, inB: number, outA: number, outB: number) => {
  const w = Math.max(1 - tween(f, inA, inB), tween(f, outA, outB));
  return rest * (1 - w) + wave(raw) * w;
};

// ------------------------------------------------------------------ Finn
const FINN_WALK: [number, number][] = [
  [58, 80],
  [137, 165],
  [447, 475],
  [635, 655],
  [672, 692],
];

export const finn = (f: number, raw: number): Pose => {
  const x = kf(f, [[0, -0.75], [58, -0.75], [80, -0.58], [135, -0.58], [165, -0.45], [445, -0.45], [475, -0.75], [635, -0.75], [655, -1.1], [672, -1.1], [692, -0.75]]);
  const z = kf(f, [[0, 0.9], [58, 0.9], [80, 1.02], [135, 1.02], [165, 0.38], [445, 0.38], [475, 0.9], [635, 0.9], [655, 0.8], [672, 0.8], [692, 0.9]]);
  const p = basePose([x, 0, z]);
  p.rotY = kf(f, [[0, 0.2], [40, 0.2], [52, 0.5], [60, 0.5], [80, 0.3], [135, 0.3], [145, 0.6], [165, 1.0], [300, 1.0], [345, 0.85], [445, 0.85], [462, 0.3], [478, 0.15], [565, 0.15], [580, -0.4], [600, -0.15], [632, -0.15], [645, -1.15], [674, -1.15], [692, 0.2]]);
  p.lift =
    walkHop(f, FINN_WALK, 0.06) + jump(f, 46, 58, 0.14) + jump(f, 108, 120, 0.1) + jumps(f, 416, 2, 12, 0.2) + jumps(f, 540, 2, 12, 0.2) + jump(f, 668, 680, 0.08);
  p.tilt = kf(f, [[0, 0], [84, 0], [93, 0.6], [100, 0.6], [108, 0], [188, 0], [195, 0.45], [205, 0.45], [213, 0]]);
  p.squash = 1 - 0.08 * Math.sin(tween(f, 84, 100) * Math.PI) - 0.06 * Math.sin(tween(f, 40, 47) * Math.PI);
  // arms: forward reach / hold, joy, waving
  const fwd = kf(f, [[0, 0], [84, 0], [93, -0.25], [100, -0.25], [110, 1.75], [130, 1.75], [140, 1.2], [188, 1.2], [196, 0.6], [205, 0.4], [214, 0], [598, 0], [606, 1.25], [640, 1.25], [656, 1.55], [666, 1.55], [676, 0]]);
  const holdIn = kf(f, [[0, 0.15], [100, 0.15], [110, -0.3], [205, -0.3], [214, 0.15], [598, 0.15], [606, -0.3], [666, -0.3], [676, 0.15]]);
  const joy = Math.max(Math.sin(tween(f, 414, 442) * Math.PI), Math.sin(tween(f, 538, 566) * Math.PI));
  p.fwdA = p.fwdB = fwd;
  p.armA = waving(f, raw, holdIn, 24, 36, 700, 714) + joy * 2.2;
  p.armB = holdIn + joy * 2.2;
  p.fwdA = fwd * tween(f, 24, 36) * (1 - tween(f, 700, 714));
  // head
  p.headNod = kf(f, [[0, 0], [40, 0], [50, 0.3], [84, 0.35], [104, 0.1], [130, 0.1], [140, 0.15], [170, 0.25], [240, 0.2], [270, 0.25], [345, 0.3], [412, 0.25], [420, -0.05], [445, 0], [470, -0.32], [560, -0.32], [575, 0], [700, 0]]);
  p.headTurn = kf(f, [[0, 0], [40, 0], [50, 0.3], [84, 0.1], [140, 0], [250, 0], [270, 0.35], [330, 0.35], [345, 0], [700, 0]]);
  p.headTilt =
    (f > 350 && f < 405 ? 0.16 * Math.sin(((f - 350) / 55) * Math.PI * 2) : 0) + kf(f, [[0, 0], [100, 0], [110, 0.15], [130, 0.15], [140, 0]]);
  p.eyes = blink(f, [70, 150, 228, 300, 362, 392, 488, 590, 645, 745, 812, 858]);
  p.smile = Math.max(kf(f, [[0, 0.5], [40, 0.5], [50, 0.9], [60, 0.4], [104, 0.9], [135, 0.5], [345, 0.2], [410, 0.2], [418, 1], [445, 0.6], [535, 0.6], [545, 1], [600, 0.6], [700, 0.6], [712, 0.8]]), 0);
  p.tail = 0.3 * Math.sin((raw / 30) * Math.PI * 2) + joy * 0.3 * Math.sin((raw / 6) * Math.PI * 2);
  return p;
};

// ------------------------------------------------------------------ Daisy
const DAISY_WALK: [number, number][] = [
  [137, 165],
  [237, 256],
  [447, 475],
  [635, 655],
  [672, 692],
];

export const daisy = (f: number, raw: number): Pose => {
  const x = kf(f, [[0, 2.7], [135, 2.7], [165, 0.5], [236, 0.5], [256, 1.0], [445, 1.0], [475, 0.88], [635, 0.88], [655, 1.2], [672, 1.2], [692, 0.88]]);
  const z = kf(f, [[0, 0.2], [165, 0.2], [236, 0.2], [256, -0.45], [445, -0.45], [475, 0.72], [635, 0.72], [655, 0.62], [672, 0.62], [692, 0.72]]);
  const p = basePose([x, 0, z]);
  p.visible = f >= 130;
  p.rotY = kf(f, [[0, -1.5], [160, -1.5], [170, -1.3], [236, -1.3], [245, 0.4], [256, -0.6], [445, -0.6], [462, -0.25], [565, -0.25], [580, 0.45], [600, 0.15], [632, 0.15], [645, 1.15], [674, 1.15], [692, -0.2]]);
  const dig = f > 170 && f < 192 ? Math.sin(((f - 170) / 7) * Math.PI * 2) : 0;
  const pat = f > 206 && f < 234 ? Math.abs(Math.sin(((f - 206) / 7) * Math.PI)) : 0;
  p.tilt = kf(f, [[0, 0], [166, 0], [172, 0.35], [191, 0.35], [198, 0.1], [204, 0.35], [234, 0.35], [240, 0]]);
  p.lift = walkHop(f, DAISY_WALK, 0.07) + jumps(f, 418, 2, 12, 0.2) + jumps(f, 542, 2, 12, 0.2) + jump(f, 671, 683, 0.08);
  const joy = Math.max(Math.sin(tween(f, 416, 444) * Math.PI), Math.sin(tween(f, 540, 568) * Math.PI));
  const give = kf(f, [[0, 0], [598, 0], [608, 1.25], [640, 1.25], [656, 1.55], [668, 1.55], [678, 0]]);
  const giveIn = kf(f, [[0, 0.15], [598, 0.15], [608, -0.3], [668, -0.3], [678, 0.15]]);
  p.fwdB = (f > 170 && f < 192 ? 0.9 + 0.35 * dig : 0) + (f > 206 && f < 234 ? 1.0 - 0.5 * pat : 0) + give;
  p.fwdA = (f > 206 && f < 234 ? 1.0 - 0.5 * (1 - pat) : 0) + give;
  p.armA = giveIn + joy * 2.2;
  p.armB = giveIn + joy * 2.2;
  // waving with outer (+x) arm at the end
  const w = tween(f, 702, 716);
  p.armB = p.armB * (1 - w) + wave(raw + 5) * w;
  p.fwdB *= 1 - w;
  p.headNod = kf(f, [[0, 0], [166, 0], [172, 0.3], [234, 0.3], [242, 0.1], [270, 0.25], [345, 0.3], [412, 0.25], [420, 0], [445, 0], [470, -0.32], [560, -0.32], [575, 0]]);
  p.headTurn = kf(f, [[0, 0], [205, 0], [212, 0.25], [232, 0.25], [240, -0.4], [270, -0.2], [345, 0], [700, 0]]);
  p.headTilt = f > 355 && f < 410 ? -0.16 * Math.sin(((f - 355) / 55) * Math.PI * 2) : 0;
  p.eyes = blink(f, [160, 252, 318, 370, 400, 500, 612, 690, 760, 835]);
  p.smile = kf(f, [[0, 0.4], [215, 0.4], [225, 0.9], [240, 0.4], [410, 0.2], [418, 1], [445, 0.6], [538, 0.6], [548, 1], [600, 0.6], [705, 0.6], [715, 0.85]]);
  p.tail = 0.25 * Math.sin((raw / 15) * Math.PI * 2);
  return p;
};

// ------------------------------------------------------------------ Peep
const PEEP_WALK: [number, number][] = [
  [240, 272],
  [447, 472],
  [637, 655],
  [672, 692],
];

export const peep = (f: number, raw: number): Pose => {
  const x = kf(f, [[0, 1.9], [240, 1.9], [272, 0.5], [445, 0.5], [472, 0.12], [637, 0.12], [655, -0.55], [672, -0.55], [692, 0.12]]);
  const z = kf(f, [[0, 2.1], [240, 2.1], [272, -0.05], [445, -0.05], [472, 1.45], [637, 1.45], [655, 1.6], [672, 1.6], [692, 1.45]]);
  const p = basePose([x, 0, z]);
  p.visible = f >= 236;
  p.rotY = kf(f, [[0, -0.8], [262, -0.8], [276, -1.45], [334, -1.45], [342, 0.6], [356, 0.6], [366, -0.9], [445, -0.9], [462, 0], [565, 0], [580, -0.4], [600, -0.1], [634, -0.1], [645, -1.35], [674, -1.35], [692, 0]]);
  p.lift = walkHop(f, PEEP_WALK, 0.1, 7) + jumps(f, 414, 3, 9, 0.18) + jumps(f, 538, 3, 9, 0.18) + jump(f, 670, 680, 0.1);
  const joy = Math.max(Math.sin(tween(f, 412, 442) * Math.PI), Math.sin(tween(f, 536, 566) * Math.PI));
  const flap = joy * (1.6 + 0.6 * Math.sin((raw / 5) * Math.PI * 2));
  const hold = f < 345 ? 1.1 : kf(f, [[345, 1.1], [355, 0], [598, 0], [608, 1.2], [668, 1.3], [678, 0]]);
  p.fwdA = p.fwdB = hold;
  p.armA = 0.1 + flap - (f > 598 && f < 676 ? 0.3 : 0);
  p.armB = 0.1 + flap - (f > 598 && f < 676 ? 0.3 : 0);
  const w = tween(f, 704, 718);
  p.armB = p.armB * (1 - w) + (wave(raw + 10) - 0.4) * w;
  p.fwdB *= 1 - w;
  p.headNod = kf(f, [[0, 0], [276, 0], [284, 0.35], [330, 0.35], [345, 0.3], [412, 0.25], [420, -0.1], [445, 0], [470, -0.35], [560, -0.35], [575, 0]]);
  p.headTilt = f > 345 && f < 408 ? 0.2 * Math.sin(((f - 345) / 42) * Math.PI * 2) : 0;
  p.eyes = blink(f, [300, 358, 384, 470, 625, 700, 778, 850]);
  p.smile = kf(f, [[0, 0.4], [410, 0.4], [418, 1], [445, 0.6], [536, 0.6], [546, 1], [600, 0.6], [705, 0.6], [715, 0.9]]);
  return p;
};

export const canTilt = (f: number) => kf(f, [[0, 0], [276, 0], [286, 0.7], [326, 0.7], [336, 0]]);

/** Watering can resting on the ground after Peep puts it down */
export const CAN_REST: V3 = [1.38, 0, 0.12];

/** Peep holds the can until frame 348, then sets it aside (arc) by 360. */
export const canState = (f: number, p: Pose) => {
  if (f < 348) return { held: true, pos: CAN_REST };
  const from = inFront(p.pos, kf(348, [[334, -1.45], [342, 0.6]]), 0.3, 0.27);
  const t = tween(f, 348, 360);
  return { held: false, pos: arc(from, [CAN_REST[0], 0.075, CAN_REST[2]], t, 0.15), rotY: 0.6 * (1 - t) - 0.6 * t };
};

// ------------------------------------------------------------------ woodland friends
const critter = (
  f: number,
  raw: number,
  from: V3,
  to: V3,
  enter: [number, number],
  rotIn: number,
  rotRest: number,
  rotGive: number,
  receive: number,
  phase: number,
): Pose => {
  const t = tween(f, enter[0], enter[1]);
  const p = basePose(lerp3(from, to, t));
  p.visible = f >= enter[0] - 2;
  p.rotY = kf(f, [[0, rotIn], [enter[1] - 4, rotIn], [enter[1] + 6, rotRest], [receive - 22, rotRest], [receive - 12, rotGive], [receive + 22, rotGive], [receive + 34, rotRest * 0.6]]);
  p.lift = walkHop(f, [enter], 0.09, 6) + (f > receive + 6 ? Math.abs(Math.sin(((raw + phase) / 15) * Math.PI)) * 0.07 : 0);
  p.fwdA = p.fwdB = kf(f, [[0, 0], [receive - 12, 0], [receive - 4, 1.3], [900, 1.3]]);
  p.armA = p.armB = kf(f, [[0, 0.2], [receive - 12, 0.2], [receive - 4, -0.25], [900, -0.25]]);
  p.smile = kf(f, [[0, 0.3], [receive, 0.3], [receive + 6, 1], [900, 0.9]]);
  p.eyes = blink(f, [enter[1] + 20 + phase, receive + 40 + phase, receive + 120 + phase, receive + 190 + phase]);
  p.tail = Math.sin(((raw + phase) / 15) * Math.PI * 2) * 0.5;
  p.headTilt = f > receive + 6 ? 0.1 * Math.sin(((raw + phase) / 30) * Math.PI * 2) : 0;
  return p;
};

export const BUNNY_POS: V3 = [-1.72, 0, 0.55];
export const SQUIRREL_POS: V3 = [1.78, 0, 0.45];
export const HEDGEHOG_POS: V3 = [-0.98, 0, 1.95];

export const bunny = (f: number, raw: number) => critter(f, raw, [-3.4, 0, 0.6], BUNNY_POS, [565, 598], 1.5, 0.45, 1.1, 664, 0);
export const squirrel = (f: number, raw: number) => critter(f, raw, [3.4, 0, 0.4], SQUIRREL_POS, [570, 602], -1.5, -0.45, -1.15, 667, 4);
export const hedgehog = (f: number, raw: number) => critter(f, raw, [-3.0, 0, 2.0], HEDGEHOG_POS, [575, 606], 1.4, 0.4, 1.25, 670, 8);

// ------------------------------------------------------------------ held-item positions
/** Point between a character's paws (ignores lean; good enough for chibi arms). */
const pawPoint = (p: Pose, shoulderY: number, arm: number, extra = 0.07): V3 => {
  const fwd = (p.fwdA + p.fwdB) / 2;
  const y = shoulderY - Math.cos(fwd) * arm + p.lift;
  const d = 0.02 + Math.sin(fwd) * arm + extra;
  return inFront(p.pos, p.rotY, d, y);
};

export const finnPaws = (p: Pose) => pawPoint(p, 0.58, 0.27);
export const daisyPaws = (p: Pose) => pawPoint(p, 0.6, 0.28);
export const peepPaws = (p: Pose) => pawPoint(p, 0.37, 0.16, 0.12);
export const critterPaws = (p: Pose) => pawPoint(p, 0.27, 0.1, 0.12);

// ------------------------------------------------------------------ seed
export const seed = (f: number, finnPose: Pose): { pos: V3; visible: boolean } => {
  const ground: V3 = [-0.49, 0.035, 1.3];
  if (f < 98) return { pos: ground, visible: true };
  const paws = finnPaws(finnPose);
  if (f < 110) return { pos: lerp3(ground, paws, tween(f, 98, 110)), visible: true };
  if (f < 196) return { pos: paws, visible: true };
  if (f < 206) return { pos: arc(paws, [PLANT[0], 0.02, PLANT[2]], tween(f, 196, 206), 0.06), visible: true };
  return { pos: [PLANT[0], 0.02, PLANT[2]], visible: f < 212 };
};

// ------------------------------------------------------------------ soil
export const soil = (f: number) => ({
  hole: tween(f, 171, 188) * (1 - tween(f, 206, 222)),
  pile: tween(f, 171, 190) * (1 - tween(f, 206, 224)),
  mound: tween(f, 206, 226),
  wet: tween(f, 288, 330),
  wiggle: f > 392 && f < 410 ? Math.sin(((f - 392) / 3) * Math.PI) * 0.06 : 0,
});

export const sprout = (f: number, pop: (f: number, s: number) => number) => {
  const s = pop(f, 408) * (1 + 0.6 * tween(f, 440, 470)) * (1 - tween(f, 492, 508));
  const y = 0.06 + 2.05 * tween(f, 452, 512, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  return { s, y };
};

// ------------------------------------------------------------------ shared apples
import { APPLES } from './Tree';

type Holder = 'finn' | 'daisy' | 'peep';
const SHARE: { apple: number; to: Holder; drop: number; give: number; animal: 'bunny' | 'squirrel' | 'hedgehog' }[] = [
  { apple: 0, to: 'finn', drop: 604, give: 652, animal: 'bunny' },
  { apple: 1, to: 'daisy', drop: 610, give: 655, animal: 'squirrel' },
  { apple: 2, to: 'peep', drop: 616, give: 658, animal: 'hedgehog' },
];

export const sharedApples = (
  f: number,
  poses: Record<Holder | 'bunny' | 'squirrel' | 'hedgehog', Pose>,
  treeSway: number,
): { pos: V3; detached: boolean }[] =>
  SHARE.map((s) => {
    const onTree: V3 = [APPLES[s.apple][0] + treeSway * APPLES[s.apple][1], APPLES[s.apple][1], APPLES[s.apple][2]];
    if (f < s.drop) return { pos: onTree, detached: false };
    const holder = poses[s.to];
    const paws = s.to === 'finn' ? finnPaws(holder) : s.to === 'daisy' ? daisyPaws(holder) : peepPaws(holder);
    const animalPaws = critterPaws(poses[s.animal]);
    if (f < s.drop + 14) return { pos: arc(onTree, paws, tween(f, s.drop, s.drop + 14), 0.25), detached: true };
    if (f < s.give) return { pos: paws, detached: true };
    if (f < s.give + 14) return { pos: arc(paws, animalPaws, tween(f, s.give, s.give + 14), 0.2), detached: true };
    return { pos: animalPaws, detached: true };
  });
