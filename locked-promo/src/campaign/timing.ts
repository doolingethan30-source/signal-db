/**
 * Campaign timeline (30fps). Every scene change is a smooth crossfade of
 * T frames, so each sequence is padded by T (half at the ends).
 *
 *  1 Struggle   0–5s     2 Reality   5–10s     3 Take control 10–17s
 *  4 Accountability 17–25s   5 Not alone 25–33s   6 Brand + launch 33–40s
 */
export const T = 16;
export const C = {
  c1: 150 + T / 2,
  c2: 150 + T,
  c3: 210 + T,
  c4: 240 + T,
  c5: 240 + T,
  c6: 210 + T / 2,
};
export const CAMPAIGN_TOTAL = Object.values(C).reduce((a, b) => a + b, 0) - 5 * T; // 1200 = 40s

/** Absolute start frame of each sequence */
export const START = (() => {
  const keys = Object.keys(C) as (keyof typeof C)[];
  const out = {} as Record<keyof typeof C, number>;
  let t = 0;
  for (const k of keys) {
    out[k] = t;
    t += C[k] - T;
  }
  return out;
})();

/** Local frames (within a scene) where sound effects land */
export const CUES = {
  lockClick: 100, // scene 2: screen locks
  chime: 66, // scene 4: partner's message arrives
  riser: 40, // scene 5: swell into the morning light
  logoHit: 110, // scene 6: logo reveal
  launch: 168, // scene 6: "Coming this December" line
};
