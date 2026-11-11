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

### Punchier cut (current `out/plainweek-launch-vo.mp4`)
- **Hook:** the screen is full of clutter from frame 0. "Your week / shouldn't feel / this loud." lands word by word with the voice-over, with a punch on "loud."
- **Bigger phone:** the phone runs at 1.2–1.5× with a fast snap move into each feature shot, a slow push-in while the feature plays, and motion blur on the snaps.
- **Titles:** each word slides up out of a mask, with the key word in the accent colour.
- **Score:** a soft kick from the reveal, shakers and snaps building through the features, and a gentle pad pump. It drops out for "Light. Dark. Glass." before the hero chord.
- **Sound effects:** only five remain (the typed-task confirmation, the drop, two widget ticks and the re-plan shimmer).

### Three-act cut (current `out/plainweek-launch-vo.mp4`, 39 s)
1. **Problem (0–8 s):** first the mental load (`scenes/MentalLoad.tsx`). Life's to-dos pile up faster and faster, the counter reads "24 things on your mind", and items get "Missed", "Overdue" and "Forgot" tags under "So much to remember. / So easy to forget." Then the noisy chaos field and the voice-over hook "Your week shouldn't feel this loud."
2. **Use case (8–31 s):** the Plainweek feature shots.
3. **Call to action (31–39 s):** the logo and tagline, then a "Download Plainweek free" button ("Available on the App Store") that holds for the last ~4 s.

`Launch` plays the 4 s intro (with `public/launch/intro.wav`, made by `make_launch_audio.py`), then `LaunchCore` (acts 2–3) in a `<Sequence>` offset by 120 frames. The core film's own timings, music and voice-over shift with it automatically.

---

# Plainweek Pro – Family Mode (`PlainweekFamily`, 30 s)

Rendered file: `out/plainweek-family-mode.mp4` (1080×1920, 30 fps, H.264/yuv420p, AAC, +faststart, -14 LUFS).

| Time | Act | What happens |
| --- | --- | --- |
| 0–5 s | Intro | A modern home at sunrise. Each window lights up with a family member (Mum, Dad, Ava, Leo), then they all link to one Plainweek hub. "PLAINWEEK PRO · Family Mode. One shared home for the whole household." |
| 5–10 s | Problem | A fridge door fills with sticky notes, a grocery list and an empty chore chart, and some slip off. Mum's lock screen fills with everyone's reminders. "Chores forgotten." / "Lists everywhere." / "One parent, holding it all." |
| 10–13 s | Use case | Mum assigns "Tidy your room" to Ava for 3 stars, due 6 PM. |
| 13–16 s | Use case | The chore reaches Ava's iPhone instantly. She ticks it, three stars fly to her balance, and it syncs back to Mum. |
| 16–19 s | Use case | Ava redeems "Movie night"; Mum approves it on her phone, and Ava's phone says "Approved". |
| 19–23 s | Use case | Three iPhones show the live shared grocery list, the colour-coded family calendar and everyone's progress, with sync pulses between them. |
| 23–30 s | Call to action | A product shot of the Family hub with a light sweep, then "One home. One plan. A happier family." and "Discover Family Mode with Plainweek Pro". |

- Source: `src/family/`. Timing is in `theme.ts`, the phone rig, sync beams, titles and call to action are in `Family.tsx`, and the app screens are in `screens/`.
- Audio: `python3 scripts/make_family_audio.py` writes `public/family/*.wav`. It's an upbeat 104 bpm score in D major (quiet morning, muted problem, the groove arriving with Family Mode, then a resolving finale) plus just five UI sounds: sync, tick, stars, approve and the logo shimmer.
- Render:
  ```bash
  npx remotion render PlainweekFamily out/raw.mp4
  ffmpeg -i out/raw.mp4 -t 30 -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -crf 16 \
    -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -movflags +faststart out/plainweek-family-mode.mp4
  ```

### Voice-over version: `out/plainweek-family-mode-vo.mp4` (30 s)
- Source: `public/family/voiceover-source.mp3` (ElevenLabs, Lucy).
- `python3 scripts/place_family_voiceover.py` cuts it into its 12 lines at the natural pauses and places each line on its shot. It writes `public/family/voiceover.wav` and `src/family/voTimeline.ts`.
- The music ducks about 6 dB under each line. The "Family Mode." title and each call-to-action line appear as they're spoken.
- The cut without voice-over is still at `out/plainweek-family-mode.mp4`. That file was rendered before these changes, so re-rendering now gives the new text timing.

---

# "The 3-minute week" (`PlainweekReset`, 30 s)

A Weekly reset speedrun. A stopwatch runs live while Plainweek plans the whole of next week, and it stops at **2:41**.
Rendered file: `out/plainweek-3-minute-week.mp4` (1080×1920, 30 fps, H.264/yuv420p, AAC, +faststart, -14 LUFS).

| Time | Beat | On the phone |
| --- | --- | --- |
| 0–2.6 s | Hook: "Plan your whole week in 3 minutes. Start the clock." | The phone rises with this week's view |
| 2.6–6.5 s | Step 1/5: Review last week | Tap *Weekly reset · set up next week in 3 min*; the ring fills to 12/15, with best day, streak and focus time |
| 6.5–10 s | Step 2/5: Carry over the unfinished | Three leftover tasks, each with a suggested day, then "Move all to next week" |
| 10–15 s | Step 3/5: Brain dump in plain English | "Call Josh fri 3pm", "Gym mon wed fri 7am", "Dentist thu 10am" and "Book flights by sunday" each become a scheduled task |
| 15–19.5 s | Step 4/5: Balance the week | Wednesday is marked "Heavy" (7 tasks); "Balance week" moves tasks to lighter days, giving 3/3/3/3/3/1/1 |
| 19.5–23.4 s | Step 5/5: Lock it in | The month view fills with dots across 9–15 Nov, then "Week ready · reminders set" |
| 23 s | The clock stops at **2:41** | "Done — with 19 seconds to spare." |
| 23.4–30 s | Finale | "Next week, fully planned in 2:41", "Weekly reset. Every Sunday.", the Plainweek logo, "Download Plainweek free" and "Available on the App Store" |

- Source: `src/reset/`. The timeline and palette are in `theme.ts`, the stopwatch, hook, phone and finale in `Reset.tsx`, and the screens rebuilt from the current app UI in `screens/Screens.tsx` and `ui.tsx`.
- Audio: `python3 scripts/make_reset_audio.py` writes `public/reset/*.wav`. It's a 124 bpm score on a ticking-clock motif that adds a layer per step and hard-stops with the clock, followed by a warm C major finale. There are only three effects (balance whoosh, done chime, logo shimmer).

---

# Instagram posts (1080×1350, 4:5)
- `out/posts/plainweek-post-2-41.png` (`PostSpeedrun`): the "Next week, fully planned in 2:41" poster on the dark stage, with the balanced week on the phone.
- `out/posts/plainweek-post-calm.png` (`PostCalm`): "Your week, finally calm." with the real week view and the plain-English "Call Josh fri 3pm" entry card.

- `out/posts/plainweek-post-family.png` (`PostFamily`): Family Mode on full-bleed orange, "One home. One plan. A happier family.", with Mum's and Ava's iPhones and a "Synced instantly" pill.
- `out/posts/plainweek-post-before-after.png` (`PostBeforeAfter`): a split screen. On the left, sticky notes and a lock screen full of reminders; on the right, the balanced week, with "Same week. Less chaos."

Re-render with `npx remotion still <PostSpeedrun|PostCalm|PostFamily|PostBeforeAfter> out/posts/<name>.png --image-format=png`. The source is `src/posts/Posts.tsx`.

---

# Family Mode for roommates (`PlainweekRoommates`, 45 s)

Rendered file: `out/plainweek-roommates.mp4` (1080×1920, 30 fps, H.264/yuv420p, AAC, +faststart, -14 LUFS).

Every behaviour shown is a Family Mode feature. The parent and child features (Kid mode, parent approval, rewards) are left out because they don't fit roommates.

| Time | Beat | Family Mode features shown |
| --- | --- | --- |
| 0–3 s | "4 roommates. 1 kitchen. 0 clean plates." | |
| 3–10.3 s | Dishes, a messy lounge, the "whose turn is it?" argument told in floating quotes (no app UI), the forgotten paper rota | |
| 10.3–12.5 s | Introducing Plainweek Family Mode | |
| 12.5–16.3 s | 01 Set up your apartment | Family name, a colour per person, the Organiser and Member roles, an 8-character code or link, roommates joining free on the Organiser's Pro |
| 16.3–20.3 s | 02 Type it. Take turns. | Quick add of "Bins @Sam every tue", a repeating chore that takes turns each week, filters (person, status, group by), live sync |
| 20.3–24 s | 03 One tap. A fair week. | Today's progress rings and quick actions, the Kitchen duty template, Up for grabs, "Plan our week" spreading chores fairly |
| 24–27.6 s | 04 Photo proof. Friendly nudges. | A photo-proof chore (stored privately), a comment, and a long-press nudge that arrives as a push on Sam's iPhone |
| 27.6–31.2 s | 05 Shopping, sorted by aisle. | "2x milk, bread, bananas" split into items with quantities, sorted into aisles, ticked off and cleared |
| 31.2–34.8 s | 06 Who's going? Who's driving? | The colour-coded month calendar, and an event with time, place, notes, a weekly repeat, who's going and who's driving |
| 34.8–37.2 s | 07 Fair, finally. | Weekly wins (chores done, perfect days, top helper) and the 4-week fairness view with its uneven-load hint |
| 37.2–39.6 s | 08 Tick it off from your Home Screen. | The Home Screen widget (tick off your own chore) and the Lock Screen widget (next chore and star count) |
| 39.6–42 s | "Clean apartment. Happy roommates." | |
| 42–45 s | Plainweek logo, FAMILY MODE, **COMING SOON TO THE APP STORE** | |

- Source: `src/roommates/`. The apartment illustration is in `scenes/Apartment.tsx`, the Family Mode screens built from the current app components and palette are in `screens/Screens.tsx`, and the film is assembled in `Roommates.tsx`.
- Audio: `python3 -B scripts/make_roommates_audio.py` writes `public/roommates/*.wav`. It's a 116 bpm indie-pop score that drops into the major groove at 10.3 s, with three effects (a roommate-join chime, the photo-proof tick and the logo shimmer).
- Screen layouts follow the app's design language. Swap in real screen components or screenshots to match the shipped Family Mode UI exactly.

### Zack D Films–style cut: `out/plainweek-roommates-zackd.mp4` (`PlainweekRoommatesZD`, 45 s)
Same story and Family Mode screens, re-edited in the Zack D Films short-form style:
- A curiosity-gap hook ("This is what happens when four roommates share one kitchen.").
- Narration captions in bold white with heavy outlines and yellow keywords, in place of the title cards.
- A snap punch-in zoom on every cut, screen shakes on the problem beats, and white flashes into and out of the solution.
- A punchier grade with vignette and film grain.
- Three extra effects (an impact on the hook and two whooshes).

The editing layer is in `src/roommates/ZackD.tsx`, and the caption text in `ZD_CAPTIONS` doubles as a voice-over script.

### Zack D cut with voice-over: `out/plainweek-roommates-zackd-vo.mp4` (45 s)
- Source: `public/roommates/voiceover-source.mp3` (ElevenLabs, Liam).
- `python3 scripts/place_roommates_voiceover.py` cuts it into 25 phrases at the natural pauses and places each on its shot. It writes `public/roommates/voiceover.wav` and `src/roommates/voTimeline.ts`.
- The roommates timeline (`Q` in `theme.ts`) is timed to the narration. The Zack D captions are generated from the VO phrases, the music ducks about 6 dB under the voice, and the score drops on "So they tried Plainweek Family Mode".
- The earlier Zack D cut without voice-over (`plainweek-roommates-zackd.mp4`) and the clean cut (`plainweek-roommates.mp4`) were rendered on the previous timing. Re-rendering them now uses the new one.

---

# Seamless 15 s launch loop (`PlainweekLoop`)

Rendered file: `out/plainweek-loop-15s.mp4` (1080×1920, 30 fps, exactly 450 frames, H.264/yuv420p, AAC, +faststart).

| Time | Beat |
| --- | --- |
| 0–2.5 s | Chaos: notifications, overdue tasks and badges swirl around "Your week feels like this?" |
| 2.5–3.6 s | Everything collapses into the iPhone and the stage turns warm and light |
| 3.6–5 s | "Your whole week. Finally calm.": the week view, with rings drawing on |
| 5–7.2 s | "Just type it.": "Call Josh fri 3pm" is parsed and lands on Friday |
| 7.2–9.2 s | "Too much on one day? Balanced in a tap.": the Weekly reset spreads a heavy Wednesday |
| 9.2–11.2 s | "Share the load with family.": Family Mode progress rings and stars |
| 11.2–14.2 s | Plainweek · **FREE TO DOWNLOAD NOW · ON THE APP STORE** |
| 14.2–15 s | The chaos floods back in over the call to action, straight into frame 0 |

**How the loop is seamless**
- Every animation is a function of cyclic time (`frame % 450`), and all drift uses whole-number sine cycles over the loop.
- The CTA → chaos transition is part of the cycle, so the last frame leads into the first.
- Music: 128 bpm, so 15 s is exactly 8 bars. Every note is written into two passes and the second is exported, so reverb tails and the riser wrap around the loop point (`scripts/make_loop_audio.py`).
- The final encode uses a fixed gain (no dynamic loudness normalisation), so the audio level is identical at both ends.
- Verified: in `PlainweekLoopSeamTest` (two loops back to back) frame 450 is pixel-identical to frame 0, and in the encoded file the frame step across the seam matches its neighbours.
