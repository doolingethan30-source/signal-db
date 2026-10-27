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

// In-app palette, matched to the Plainweek UI mockups.
export const A = {
  bg: '#FAF8F5',
  card: '#F2EFEA',
  todayCard: 'linear-gradient(100deg, #FCE6D8 0%, #F7EEE7 55%, #F4F0EB 100%)',
  ink: '#1D1C1A',
  sub: '#8C877F',
  track: '#DAD6D0',
  line: '#E9E5DF',
  orange: '#FF5A1F',
  orangeSoft: '#FFE6D8',
  blue: '#4A90E2',
  green: '#34B36A',
  purple: '#8B5CF6',
};
