// Plainweek Family Mode for roommates: four students, one apartment. 43 s @ 30 fps.

export const ROOM_FRAMES = 1350; // 45 s

// Timed to the voice-over (Liam): the problem act follows his delivery, and
// each feature shot is long enough for its animation to finish.
export const Q = {
  hook: [0, 100], // 0–3.3 s     "This is what happens when four roommates share one kitchen."
  dishes: [100, 162], // 3.3–5.4  "The dishes pile up for days…"
  lounge: [162, 228], // 5.4–7.6  "shared spaces become nobody's job…"
  chat: [228, 300], // 7.6–10     "and every chore turns into an argument."
  rota: [300, 380], // 10–12.7    "The paper rota? Forgotten by week two."
  intro: [380, 445], // 12.7–14.8 "So they tried Plainweek Family Mode."
  setup: [445, 552], // 01 family, colours, roles, invite code / link
  chores: [552, 660], // 02 quick add + taking turns
  today: [660, 764], // 03 Today, templates, "Plan our week"
  proof: [764, 866], // 04 photo proof, comments, nudges
  shopping: [866, 968], // 05 shopping list sorted into aisles
  events: [968, 1062], // 06 calendar + who's going / who's driving
  fairness: [1062, 1132], // 07 fairness view + weekly wins
  widgets: [1132, 1202], // 08 Home Screen + Lock Screen widgets
  clean: [1202, 1264], // the clean apartment
  end: [1264, 1350], // logo + COMING SOON TO THE APP STORE
} as const;

export type Mate = {id: string; name: string; initial: string; color: string; course: string};
export const MATES: Mate[] = [
  {id: 'maya', name: 'Maya', initial: 'M', color: '#E8735A', course: 'Law'},
  {id: 'jordan', name: 'Jordan', initial: 'J', color: '#4A7FD4', course: 'Engineering'},
  {id: 'sam', name: 'Sam', initial: 'S', color: '#3FAE6E', course: 'Medicine'},
  {id: 'priya', name: 'Priya', initial: 'P', color: '#9B6BDF', course: 'Design'},
];
export const mate = (id: string) => MATES.find((m) => m.id === id)!;
export const HOUSEHOLD = 'Apartment 4B';
