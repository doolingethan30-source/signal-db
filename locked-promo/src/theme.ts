import {spring, SpringConfig} from 'remotion';

export const colors = {
  bg: '#0B0B0C',
  bgRaised: '#141416',
  card: '#17181A',
  cardBorder: 'rgba(201,204,209,0.10)',
  white: '#FFFFFF',
  silver: '#C9CCD1',
  grey: '#6B6F76',
  yellow: '#F5D90A',
};

export const FONT = '"Inter", "SF Pro Display", -apple-system, "Helvetica Neue", Arial, sans-serif';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Snappy, no-overshoot springs. Nike-training precision, not cartoon bounce. */
export const SNAP: Partial<SpringConfig> = {damping: 200, stiffness: 260, mass: 0.7};
export const SLAM: Partial<SpringConfig> = {damping: 30, stiffness: 420, mass: 0.8, overshootClamping: true};
export const SMOOTH: Partial<SpringConfig> = {damping: 200, stiffness: 90, mass: 1};

export const snap = (frame: number, fps: number, delay = 0, config = SNAP, durationInFrames?: number) =>
  spring({frame: frame - delay, fps, config, durationInFrames});

/**
 * Timeline. Scenes 1→2→3 are hard cuts. Scenes 3→4→5→6→7 use a
 * TRANSITION-frame crossfade, so those scenes are a little longer than
 * their on-screen slot (the overlap is subtracted from the total).
 *
 *   Full 30s:  1(0-3s) 2(3-7s) 3(7-11s) 4(11-16s) 5(16-21s) 6(21-26s) 7(26-30s)
 */
export const TRANSITION = 12;

export const FULL = {
  s1: 90,
  s2: 120,
  s3: 120 + TRANSITION / 2,
  s4: 150 + TRANSITION,
  s5: 150 + TRANSITION,
  s6: 150 + TRANSITION,
  s7: 120 + TRANSITION / 2,
};
export const FULL_TOTAL =
  Object.values(FULL).reduce((a, b) => a + b, 0) - 4 * TRANSITION; // = 900 (30s)

/** 15s cut: scenes 1, 3, 5, 7 */
export const SHORT = {
  s1: 90,
  s3: 105 + TRANSITION / 2,
  s5: 135 + TRANSITION,
  s7: 120 + TRANSITION / 2,
};
export const SHORT_TOTAL =
  Object.values(SHORT).reduce((a, b) => a + b, 0) - 2 * TRANSITION; // = 450 (15s)
