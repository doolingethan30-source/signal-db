// Plainweek Pro – Family Mode film: palette, family members and timeline.

export const FAMILY_FRAMES = 900; // 30 s @ 30 fps

// Act boundaries in frames.
export const F = {
  intro: [0, 150], // 0–5 s   a modern home wakes up
  problem: [150, 300], // 5–10 s  forgotten chores, lists everywhere
  assign: [300, 390], // 10–13 s parent assigns a chore
  tick: [390, 480], // 13–16 s child ticks it off, earns stars
  reward: [480, 570], // 16–19 s reward requested and approved
  sync: [570, 690], // 19–23 s lists, calendar, progress – all in sync
  cta: [690, 900], // 23–30 s product shot + call to action
} as const;

export const ACCENT = '#E07A3F';
export const STAR = '#F2B33D';
export const INK = '#1C1B19';
export const SUB = '#8B857C';
export const CREAM = '#FBF8F3';

export type Member = {id: 'mum' | 'dad' | 'ava' | 'leo'; name: string; initial: string; color: string; role: string};
export const FAMILY: Member[] = [
  {id: 'mum', name: 'Mum', initial: 'M', color: '#E8735A', role: 'Parent'},
  {id: 'dad', name: 'Dad', initial: 'D', color: '#4A7FD4', role: 'Parent'},
  {id: 'ava', name: 'Ava', initial: 'A', color: '#9B6BDF', role: '9'},
  {id: 'leo', name: 'Leo', initial: 'L', color: '#3FAE6E', role: '6'},
];
export const member = (id: Member['id']) => FAMILY.find((m) => m.id === id)!;
