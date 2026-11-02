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

---

# Plainweek — 30s launch film (`PlainweekLaunch`)

A cinematic, Apple-style 1080×1920, 30 fps product film with ambient music and UI sounds, and no voice-over.
Rendered file: `out/plainweek-launch.mp4` (H.264 High, yuv420p, AAC, +faststart, -14 LUFS).

| Time | Shot | Title |
| --- | --- | --- |
| 0–4.1s | Dark, layered 3D field of notifications, clashing events and overdue tasks; slow dolly-in, then the clutter collapses into a warm bloom | Too many apps. / Too many pings. / Not enough week. |
| 4.1–8.2s | The iPhone rises into soft light, the week view builds, and the rings draw on | Meet Plainweek. |
| 8.2–11.6s | Tap into Monday and type "Dinner with Maya Friday 7pm"; it's parsed into date and time chips and added to Friday | Just type it. |
| 11.6–14.6s | The task is lifted and dragged from Friday to Saturday | Drag. Drop. Done. |
| 14.6–17.8s | Tuesday: Block my day → tasks fly into the free slots around meetings | AI time blocking. |
| 17.8–20.7s | A calendar notification moves a meeting, a conflict appears, and Re-plan day fixes it in one tap | Plans changed? |
| 20.7–24.1s | Home Screen with small and medium widgets being ticked, plus frosted widgets floating in front | Beautiful widgets. |
| 24.1–27.3s | The week view morphs from light to dark to frosted glass | Light. Dark. Glass. |
| 27.3–30s | iPhone hero shot with a light sweep; logo and lock-up | Plainweek: Spend less time planning. More time doing what matters. |

- Source: `src/launch/`. The theme morphing is in `theme.ts`, the timeline in `timeline.ts`, camera keyframes in `Launch.tsx`, the screens in `screens/` and the scenes in `scenes/`.
- Audio: `python3 scripts/make_launch_audio.py` writes `public/launch/*.wav`. That covers the tension → release → ambient pad, piano, pulse → hero chord score, plus the tap, key, tick, drop, ding and shimmer sounds.
- Render:
  ```bash
  npx remotion render PlainweekLaunch out/raw.mp4
  ffmpeg -i out/raw.mp4 -t 30 -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -crf 16 \
    -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -movflags +faststart out/plainweek-launch.mp4
  ```

### Voice-over version — `out/plainweek-launch-vo.mp4` (32.5 s)
- Source: `public/launch/voiceover-source.mp3` (ElevenLabs).
- `python3 scripts/place_voiceover.py` cuts it into its 13 lines at the natural pauses and places each line on its shot. It writes `public/launch/voiceover.wav` and `src/launch/voTimeline.ts`.
- The music ducks about 6 dB under each line, with smooth 0.25 s ramps.
- The hero shot holds 2.5 s longer, so the full tagline isn't rushed, and each tagline line appears as it's spoken.
- The original 30 s cut with no voice-over is still at `out/plainweek-launch.mp4`.
