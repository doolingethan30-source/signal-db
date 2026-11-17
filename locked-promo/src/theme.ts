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
 * Timeline. Scenes 1→2→3 are hard cuts. From scene 3 on, scenes use a
 * TRANSITION-frame crossfade, so those scenes are a little longer than
 * their on-screen slot (the overlap is subtracted from the total).
 *
 *   Full 30s:  1(0-3s) 2(3-6.5s) 3(6.5-10s) 4(10-14.5s) 5(14.5-19s)
 *              5B adult-content block(19-23s) 6(23-26.5s) 7(26.5-30s)
 */
export const TRANSITION = 12;

export const FULL = {
  s1: 90,
  s2: 105,
  s3: 105 + TRANSITION / 2,
  s4: 135 + TRANSITION,
  s5: 135 + TRANSITION,
  s5b: 120 + TRANSITION,
  s6: 105 + TRANSITION,
  s7: 105 + TRANSITION / 2,
};
export const FULL_TOTAL =
  Object.values(FULL).reduce((a, b) => a + b, 0) - 5 * TRANSITION; // = 900 (30s)

/**
 * 15s cut: scenes 1, 3, 5, 5B (adult content), 7, timed to the voice-over
 * (public/voiceover-15s.mp3). Scene start times on screen:
 *   1 → 0.0s   3 → 2.9s ("What if…")   5 → 4.9s (lockout lands on "locked")
 *   5B → 8.4s ("Adult content?" / shield on "Blocked")   7 → 12.0s ("LOCKED")
 */
export const SHORT = {
  s1: 88,
  s3: 71,
  s5: 117,
  s5b: 120,
  s7: 90,
};
/** In the 15s cut the lockout hits earlier, on the word "locked". */
export const SHORT_LOCKOUT_CUT = 45;
export const SHORT_TOTAL =
  Object.values(SHORT).reduce((a, b) => a + b, 0) - 3 * TRANSITION; // = 450 (15s)
