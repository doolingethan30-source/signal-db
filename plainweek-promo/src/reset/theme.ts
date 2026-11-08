// "The 3-minute week" – a Weekly reset speedrun. Palette from the current
// Plainweek UI screenshots, timeline in frames (30 fps).

export const RESET_FRAMES = 900; // 30 s

export const R = {
  hook: [0, 78], // 0–2.6 s   "Plan your whole week in 3 minutes."
  review: [78, 195], // 2.6–6.5   step 1: review last week
  carry: [195, 300], // 6.5–10    step 2: carry over unfinished
  dump: [300, 450], // 10–15     step 3: brain dump in plain English
  balance: [450, 585], // 15–19.5 step 4: balance the week
  lock: [585, 702], // 19.5–23.4 step 5: lock it in
  cta: [702, 900], // 23.4–30   result + call to action
} as const;

// The stopwatch runs from GO to STOP and lands on 2:41.
export const CLOCK_START = R.hook[1];
export const CLOCK_STOP = 690;
export const FINAL_SECONDS = 161;

export const C = {
  stage: '#141210',
  orange: '#DA7A44',
  orangeSoft: '#F7E6DA',
  paper: '#F8F6F3',
  card: '#F1EEEA',
  white: '#FFFFFF',
  ink: '#1F1D1A',
  label: '#6E6862',
  sub: '#8C867E',
  track: '#DCD6CE',
  line: '#ECE8E2',
  heavy: '#D9534F',
};

export const STEPS = [
  {at: R.review[0], label: 'Review last week'},
  {at: R.carry[0], label: 'Carry over the unfinished'},
  {at: R.dump[0], label: 'Brain dump in plain English'},
  {at: R.balance[0], label: 'Balance the week'},
  {at: R.lock[0], label: 'Lock it in'},
];
