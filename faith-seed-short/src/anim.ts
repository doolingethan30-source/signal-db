import { Easing, interpolate, spring } from 'remotion';

export const FPS = 30;
export const TOTAL = 900; // exactly 30 s
export const LOOP_FADE = 18; // frames of seamless cross-fade back into frame 0

export type V3 = [number, number, number];

const inOut = Easing.bezier(0.45, 0, 0.55, 1);

/** Piecewise keyframes [[frame, value], ...] with ease-in-out between keys. */
export const kf = (f: number, keys: [number, number][], easing = inOut): number => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0] = keys[i];
    const [f1, v1] = keys[i + 1];
    if (f <= f1) {
      if (f1 === f0) return v1;
      return interpolate(f, [f0, f1], [v0, v1], { easing });
    }
  }
  return keys[keys.length - 1][1];
};

export const tween = (f: number, f0: number, f1: number, a = 0, b = 1, easing = inOut) =>
  interpolate(f, [f0, f1], [a, b], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Bouncy "pop" from 0 -> 1 starting at frame `start`. */
export const pop = (f: number, start: number, damping = 9, stiffness = 140) =>
  f < start ? 0 : spring({ frame: f - start, fps: FPS, config: { damping, stiffness, mass: 0.6 } });

/** Hop height while walking inside any of the given [start, end] intervals. */
export const walkHop = (f: number, intervals: [number, number][], height = 0.06, period = 10) => {
  for (const [a, b] of intervals) {
    if (f >= a && f <= b) return Math.abs(Math.sin(((f - a) / period) * Math.PI)) * height;
  }
  return 0;
};

/** A single jump arc between a and b. */
export const jump = (f: number, a: number, b: number, h = 0.25) =>
  f > a && f < b ? Math.sin(((f - a) / (b - a)) * Math.PI) * h : 0;

/** Several joyful jumps in a row. */
export const jumps = (f: number, a: number, count: number, len: number, h = 0.22) => {
  let y = 0;
  for (let i = 0; i < count; i++) y += jump(f, a + i * len, a + (i + 1) * len, h);
  return y;
};

/** Eye openness (1 open -> 0.08 closed) with quick blinks at given frames. */
export const blink = (f: number, times: number[]) => {
  let s = 1;
  for (const t of times) {
    const d = Math.abs(f - t);
    if (d < 3) s = Math.min(s, 0.08 + (d / 3) * 0.92);
  }
  return s;
};

/** Periodic over the whole 30 s loop, so ambient motion loops seamlessly. */
export const loopSin = (f: number, cyclesPerLoop: number, phase = 0) =>
  Math.sin((f / TOTAL) * cyclesPerLoop * Math.PI * 2 + phase);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Parabolic arc from a to b (t in 0..1). */
export const arc = (a: V3, b: V3, t: number, h: number): V3 => {
  const p = lerp3(a, b, t);
  p[1] += Math.sin(t * Math.PI) * h;
  return p;
};

/** Point in front of a character (rotY), at height y. */
export const inFront = (pos: V3, rotY: number, dist: number, y: number): V3 => [
  pos[0] + Math.sin(rotY) * dist,
  y,
  pos[2] + Math.cos(rotY) * dist,
];

/** Waving arm angle – period of 20 frames divides 900, so the wave loops. */
export const wave = (f: number) => 2.45 + 0.38 * Math.sin((f / 20) * Math.PI * 2);
