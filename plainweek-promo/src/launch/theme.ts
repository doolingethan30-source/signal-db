// Plainweek launch film: shared palette, theme morphing and timeline.

export const ACCENT = '#E07A3F';
export const DISPLAY = '"Inter Display", Inter, -apple-system, sans-serif';
export const UI = 'Inter, -apple-system, "Helvetica Neue", sans-serif';

// Scene boundaries in frames (30 fps, 900 frames = 30 s).
export const L = {
  chaos: [0, 140],
  reveal: [130, 246],
  type: [246, 348],
  drag: [348, 438],
  block: [438, 534],
  replan: [534, 620],
  widgets: [620, 722],
  themes: [722, 818],
  hero: [818, 900],
} as const;

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const mixRGB = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => v + (b[i] - v) * t) as RGB;
const rgba = (c: RGB, a = 1) => `rgba(${c.map((v) => Math.round(v)).join(',')},${a.toFixed(3)})`;

const LIGHT = {
  bg: '#F7F4EF', card: '#FFFFFF', card2: '#F1EDE7', ink: '#1C1B19', sub: '#8B857C',
  line: '#ECE7DF', track: '#E2DCD3', accentSoft: '#FBE7DA',
};
const DARK = {
  bg: '#0F0E0D', card: '#1C1A18', card2: '#272421', ink: '#F5F2ED', sub: '#9A938A',
  line: '#2C2825', track: '#3A3531', accentSoft: '#3A2518',
};

export type Theme = {
  dark: number;
  glass: number;
  bg: string;
  card: string;
  card2: string;
  ink: string;
  sub: string;
  line: string;
  track: string;
  accent: string;
  accentSoft: string;
  cardBorder: string;
  blur: string;
  blobs: number;
  shadow: string;
};

/** Theme for a given dark (0..1) and glass (0..1) amount; everything morphs smoothly. */
export const theme = (dark = 0, glass = 0): Theme => {
  const m = (k: keyof typeof LIGHT) => mixRGB(hex(LIGHT[k]), hex(DARK[k]), dark);
  const cardAlpha = 1 - glass * (0.58 - dark * 0.02);
  return {
    dark,
    glass,
    bg: rgba(m('bg')),
    card: rgba(m('card'), cardAlpha),
    card2: rgba(m('card2'), 1 - glass * 0.55),
    ink: rgba(m('ink')),
    sub: rgba(m('sub')),
    line: rgba(m('line'), 1 - glass * 0.5),
    track: rgba(m('track'), 1 - glass * 0.35),
    accent: ACCENT,
    accentSoft: rgba(m('accentSoft'), 1 - glass * 0.3),
    cardBorder: `rgba(255,255,255,${(glass * (0.7 - dark * 0.56)).toFixed(3)})`,
    blur: glass > 0.01 ? `blur(${(glass * 22).toFixed(1)}px) saturate(${(100 + glass * 70).toFixed(0)}%)` : 'none',
    blobs: glass,
    shadow: `0 1px 2px rgba(0,0,0,${0.04 + dark * 0.2}), 0 10px 28px rgba(${dark > 0.5 ? '0,0,0' : '40,30,20'},${0.05 + dark * 0.2})`,
  };
};

export const LIGHT_THEME = theme(0, 0);
