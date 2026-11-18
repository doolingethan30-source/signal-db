/**
 * ─── CAMPAIGN VOICE-OVER ────────────────────────────────────────
 * Source read (ElevenLabs, "Emma"): audio-src/voiceover-campaign-emma-v2.mp3
 * Loudness-normalised and split into one clip per line in
 * public/vo-campaign/NN.mp3, so each line lands exactly on its scene.
 * (Previous Lara clips are kept in audio-src/old-vo-lara/.)
 *
 * To nudge a line earlier/later, change its `at` (seconds into the film).
 * If public/vo-campaign/ is missing, the film renders without voice-over.
 * ────────────────────────────────────────────────────────────────
 */
export const VO_DIR = 'vo-campaign';

export type VoLine = {file: string; at: number; text: string};

export const VO_LINES: VoLine[] = [
  // Scene 1: the struggle
  {file: '01.mp3', at: 0.4, text: "Some battles happen in silence. Late at night, when no one's watching."},
  // Scene 2: the reality
  {file: '02.mp3', at: 5.05, text: 'One scroll turns into another.'},
  // 7.17s: screen locks (click)
  {file: '03.mp3', at: 7.4, text: 'But what you let in… matters.'},
  // Scene 3: take control
  {file: '04.mp3', at: 9.5, text: 'LOCKED blocks adult websites, explicit search results, and the risky apps you choose.'},
  {file: '05.mp3', at: 14.7, text: 'Right on your iPhone.'},
  // Scene 4: partner = gatekeeper
  {file: '06.mp3', at: 16.0, text: "And it's built around someone you trust."},
  {file: '07.mp3', at: 18.15, text: 'Make protection stronger, and it happens instantly.'},
  {file: '08.mp3', at: 21.35, text: 'To weaken it, your partner gets a one-time code.'},
  {file: '09.mp3', at: 24.1, text: 'No code? Nothing changes.'},
  // Scene 5: not alone
  {file: '10.mp3', at: 27.3, text: 'So put the phone down. Let the light in.'},
  {file: '11.mp3', at: 30.4, text: "You don't have to fight this alone."},
  // Scene 6: brand + launch
  {file: '12.mp3', at: 32.9, text: 'Take control.'},
  {file: '13.mp3', at: 33.9, text: 'Stay accountable.'},
  {file: '14.mp3', at: 35.05, text: 'Keep growing.'},
  // 36.4s: logo hit
  {file: '15.mp3', at: 36.55, text: 'LOCKED.'},
  {file: '16.mp3', at: 37.35, text: 'Coming to the App Store this December.'},
];
