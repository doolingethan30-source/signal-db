/**
 * ─── CAMPAIGN VOICE-OVER ────────────────────────────────────────
 * Source read (ElevenLabs, "Lara"): audio-src/voiceover-campaign-elevenlabs.mp3
 * Loudness-normalised and split into one clip per line in
 * public/vo-campaign/NN.mp3, so each line lands exactly on its scene.
 *
 * Partner lines (p1–p3) are a separate ElevenLabs read; they're used only
 * once public/vo-campaign/p1.mp3 exists.
 *
 * To nudge a line earlier/later, change its `at` (seconds into the film).
 * ────────────────────────────────────────────────────────────────
 */
export const VO_DIR = 'vo-campaign';

export type VoLine = {file: string; at: number; text: string; partner?: boolean};

export const VO_LINES: VoLine[] = [
  {file: '01.mp3', at: 0.5, text: 'Some battles happen in silence.'},
  {file: '02.mp3', at: 4.5, text: "Late at night. When no one's watching."},
  // 7.17s: screen locks (click)
  {file: '03.mp3', at: 7.6, text: 'What you let in… matters.'},
  {file: '04.mp3', at: 9.8, text: 'LOCKED blocks adult content before it reaches you. Across every app and browser.'},
  {file: '05.mp3', at: 15.0, text: "But real change isn't built alone."},
  // Partner = gatekeeper (scene 4, 14.7–26s)
  {file: 'p1.mp3', at: 17.3, text: 'You can always make protection stronger.', partner: true},
  {file: 'p2.mp3', at: 19.5, text: 'But to weaken it, your partner gets a one-time code.', partner: true},
  {file: 'p3.mp3', at: 22.4, text: 'If they agree, they share it. Without it, nothing changes.', partner: true},
  {file: '07.mp3', at: 26.3, text: 'Put the phone down. Let the light in.'},
  {file: '08.mp3', at: 30.7, text: "You don't have to fight alone."},
  {file: '09.mp3', at: 32.9, text: 'Take control.'},
  {file: '10.mp3', at: 33.9, text: 'Stay accountable.'},
  {file: '11.mp3', at: 34.95, text: 'Keep growing.'},
  // 36.4s: logo hit
  {file: '12.mp3', at: 36.55, text: 'LOCKED.'},
  {file: '13.mp3', at: 38.3, text: 'Coming this December.'},
];
