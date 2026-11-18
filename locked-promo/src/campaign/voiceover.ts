/**
 * ─── CAMPAIGN VOICE-OVER ────────────────────────────────────────
 * Source read (ElevenLabs, "Lara"): audio-src/voiceover-campaign-elevenlabs.mp3
 * It was loudness-normalised and split into one clip per line in
 * public/vo-campaign/NN.mp3, so each line can land exactly on its scene.
 *
 * To nudge a line earlier/later, change its `at` (seconds into the film).
 * If public/vo-campaign/ is missing, the film renders without voice-over.
 * ────────────────────────────────────────────────────────────────
 */
export const VO_DIR = 'vo-campaign';

export const VO_LINES: {file: string; at: number; text: string}[] = [
  {file: '01.mp3', at: 0.5, text: 'Some battles happen in silence.'},
  {file: '02.mp3', at: 5.0, text: "Late at night. When no one's watching."},
  // 8.07s: screen locks (click)
  {file: '03.mp3', at: 8.6, text: 'What you let in… matters.'},
  {file: '04.mp3', at: 10.75, text: 'LOCKED blocks adult content before it reaches you. Across every app and browser.'},
  {file: '05.mp3', at: 16.9, text: "But real change isn't built alone."},
  // 18.9s: partner's message chime
  {file: '06.mp3', at: 19.5, text: 'Your accountability partner checks in, encourages you, and keeps you on track.'},
  {file: '07.mp3', at: 25.6, text: 'Put the phone down. Let the light in.'},
  {file: '08.mp3', at: 29.7, text: "You don't have to fight alone."},
  {file: '09.mp3', at: 32.9, text: 'Take control.'},
  {file: '10.mp3', at: 33.9, text: 'Stay accountable.'},
  {file: '11.mp3', at: 34.95, text: 'Keep growing.'},
  // 36.4s: logo hit
  {file: '12.mp3', at: 36.55, text: 'LOCKED.'},
  {file: '13.mp3', at: 38.3, text: 'Coming this December.'},
];
