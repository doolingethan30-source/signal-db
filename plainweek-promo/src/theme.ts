export const FPS = 30;
export const DURATION = 900; // 30s
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  bg: '#F4F1EA',
  paper: '#FBFAF6',
  card: '#FFFFFF',
  ink: '#2A2927',
  inkSoft: '#5E5B55',
  mute: '#9C978D',
  line: '#E8E3D9',
  sage: '#8BA285',
  sageDeep: '#677F61',
  sageSoft: '#DDE6D7',
  sageMist: '#EEF2EA',
  sand: '#E9E1D2',
  alert: '#C9776A',
};

export const SERIF = '"Instrument Serif", Georgia, serif';
export const SANS = 'Inter, -apple-system, "Helvetica Neue", sans-serif';

// Scene boundaries (frames), aligned to the pauses in the voiceover.
export const T = {
  chaos: [0, 112],
  intro: [108, 222],
  type: [222, 333],
  drag: [333, 458],
  widget: [458, 560],
  ai: [560, 652],
  habits: [652, 725],
  review: [725, 805],
  final: [805, 900],
} as const;
