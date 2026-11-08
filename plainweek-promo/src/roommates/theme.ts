// Plainweek Family Mode for roommates: four students, one apartment. 43 s @ 30 fps.

export const ROOM_FRAMES = 1290;

export const Q = {
  hook: [0, 90], // 0–3 s        "4 roommates. 1 kitchen. 0 clean plates."
  dishes: [90, 165], // 3–5.5    dishes piling up
  lounge: [165, 228], // 5.5–7.6 messy shared space
  chat: [228, 300], // 7.6–10    the group-chat argument
  rota: [300, 348], // 10–11.6   the forgotten paper rota
  intro: [348, 420], // 11.6–14  Plainweek Family Mode
  household: [420, 540], // 14–18   create the household, invite roommates
  chores: [540, 690], // 18–23   assign chores, rotate weekly
  progress: [690, 810], // 23–27  track what's done
  shopping: [810, 930], // 27–31  shared shopping list
  schedule: [930, 1050], // 31–35 everyone's schedules
  clean: [1050, 1146], // 35–38.2 the clean apartment
  end: [1146, 1290], // 38.2–43 logo + COMING SOON TO THE APP STORE
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
