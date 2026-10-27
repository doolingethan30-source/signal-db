# Plainweek — 30s promo (Remotion)

Vertical 1080×1920, 30 fps, 30 s promo for TikTok / Instagram Reels.
Rendered file: `out/plainweek-promo.mp4`. It is loudness-normalised to -14 LUFS for social platforms.

## Storyboard (synced to the pauses in the voiceover)
| Time | Scene |
| --- | --- |
| 0.0–3.0s | Chaos: notifications, sticky notes, overdue tasks and clashing events pile up, then collapse |
| 3.0–7.4s | iPhone rises: Plainweek's seven-day view, with progress rings drawing on |
| 7.4–11.1s | Natural-language entry: "Pick up flowers Thursday 6pm" is parsed into date/time chips and lands on Thursday |
| 11.1–15.3s | Drag & drop: "Write proposal" moves from Tuesday to Wednesday, and the rings update |
| 15.3–18.7s | Home Screen widget: tasks ticked off and the ring completes |
| 18.7–21.7s | Pro: AI scheduling fits tasks into free calendar slots |
| 21.7–24.2s | Pro: habit streaks |
| 24.2–26.8s | Pro: Sunday review |
| 26.8–30.0s | The whole week completes, then the logo and "A simpler way to stay on track." |

## Audio
- `public/voiceover.mp3`: the supplied ElevenLabs voiceover
- `public/music.wav`, `tick.wav`, `pop.wav`, `whoosh.wav`: an ambient pad and UI sound effects, synthesised by `scripts/make_audio.py` (royalty-free)

## Commands
```bash
npm install
npx remotion studio                 # preview and edit
npx remotion render PlainweekPromo out/plainweek-promo.mp4
python3 scripts/make_audio.py       # regenerate the music and SFX (needs numpy)
```
Scene timings are defined in `src/theme.ts` (`T`), and the headline copy is in `src/scenes/Captions.tsx`.
