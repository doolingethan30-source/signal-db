import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './theme';

export const ease = Easing.bezier(0.22, 1, 0.36, 1); // easeOutQuint-ish
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 over [start, start+dur] with a smooth ease. */
export const prog = (frame: number, start: number, dur: number, fn = ease) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: fn,
  });

/** Opacity for an element visible in [start, end], fading in/out over `fade` frames. */
export const windowFade = (frame: number, start: number, end: number, fade = 10) =>
  Math.min(prog(frame, start, fade, easeInOut), 1 - prog(frame, end - fade, fade, easeInOut));

export const pop = (frame: number, start: number, damping = 14) =>
  spring({frame: frame - start, fps: FPS, config: {damping, stiffness: 160, mass: 0.7}});

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
