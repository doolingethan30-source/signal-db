// Plainweek Family Mode for roommates: four students, one apartment. 43 s @ 30 fps.

export const ROOM_FRAMES = 1350; // 45 s

export const Q = {
  hook: [0, 90], // 0–3 s        "4 roommates. 1 kitchen. 0 clean plates."
  dishes: [90, 150], // 3–5      dishes piling up
  lounge: [150, 200], // 5–6.7   messy shared space
  chat: [200, 270], // 6.7–9     the group-chat argument
  rota: [270, 310], // 9–10.3    the forgotten paper rota
  intro: [310, 375], // 10.3–12.5 Plainweek Family Mode
  setup: [375, 490], // 01 family, colours, roles, invite code / link
  chores: [490, 610], // 02 quick add + taking turns
  today: [610, 720], // 03 Today, templates, "Plan our week"
  proof: [720, 828], // 04 photo proof, comments, nudges
  shopping: [828, 936], // 05 shopping list sorted into aisles
  events: [936, 1044], // 06 calendar + who's going / who's driving
  fairness: [1044, 1116], // 07 fairness view + weekly wins
  widgets: [1116, 1188], // 08 Home Screen + Lock Screen widgets
  clean: [1188, 1260], // the clean apartment
  end: [1260, 1350], // logo + COMING SOON TO THE APP STORE
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
