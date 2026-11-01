# Plainweek — 20s screen-recorded promo

Real screen recording of a clickable prototype, without AI video generation.

| Output | Spec |
| --- | --- |
| `out/plainweek-promo.mp4` | 1080×1920, 30 fps, H.264 High / yuv420p, AAC 48 kHz, +faststart, 20.0 s |
| `out/plainweek-promo-landscape.mp4` | 1920×1080, same specs |
| `out/plainweek-full-glass.gif` | 540×960, 15 fps, 3 s loop of the Full Glass switch |
| `out/check/` | QA frames at 2, 7, 12, 16 and 19 s (both orientations) |

## Pipeline (`./build.sh [prototype.html]`)
1. **`scripts/record.js`**: Playwright opens the prototype at a 390×844 iPhone viewport (2× device pixels) and records it with Chrome's screencast. Every interaction runs on a fixed timeline that matches the storyboard. Taps are slow and deliberate, with a visible accent tap highlight. Tap and tick times are logged to `timeline.json`.
2. **`scripts/to_cfr.py`**: converts the variable-rate screencast into a constant 30 fps image sequence with ffmpeg.
3. **`scripts/make_audio.py`**: builds the soundtrack entirely from ffmpeg `aevalsrc` synthesis: a soft lo-fi piano arpeggio over a warm pad at 72 bpm, with low-pass filtering, tape wobble, room echo and faint noise. Quiet tap and tick sounds sit at the logged times, plus a small chime under the end card. There is no voice-over.
4. **`scripts/render_wrapper.js`** + **`wrapper/wrapper.html`**: render the cream-to-ember wrapper frame by frame, with the phone centred, large rounded corners, a soft shadow, eased captions and the end card. Rendering is deterministic, so motion is smooth and free of jitter.
5. **`scripts/encode.sh`**: encodes H.264 (yuv420p) with AAC audio and +faststart, then makes the GIF and the QA frames.

## Storyboard
| Time | Footage | Caption |
| --- | --- | --- |
| 0–4 s | The week view loads | Your whole week. One calm view. |
| 4–9 s | Two tasks are ticked and the ring completes; Tuesday opens, then Block my day → Apply | Tasks fitted around your meetings. |
| 9–14 s | Inbox → a messy brain dump is typed → Organise → Add 5 to my week | Empty your head. Plainweek sorts it out. |
| 14–18 s | Settings → Pro on → Full Glass → Dark mode → back to the week | Soft. Rounded. Yours. |
| 18–20 s | Cream end card | Plainweek: Spend less time planning. Get more done. |

## Using a different prototype
`record.js` drives elements by id: `#check-2`, `#check-3`, `#day-0`, `#block-btn`, `#plan-apply`, `#tab-inbox`, `#dump`, `#organise`, `#add-all`, `#tab-settings`, `#pro-switch`, `#style-full`, `#dark-switch`, `#tab-week`. It calls `window.playIntro()` at the start of the recording. Give another prototype the same hooks and run `./build.sh path/to/plainweek-prototype.html`.

Requires Node with Playwright and Chromium (preinstalled here), ffmpeg, and Python 3 with Pillow (only used for QA contact sheets).
