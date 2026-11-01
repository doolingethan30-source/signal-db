# The Little Seed of Faith: 30s YouTube Short (Remotion + three.js)

A vertical (9:16) 1440×2560 ("2K") 30 fps, **exactly 30.000 s (900 frames)** 3D animated Short for ages 4–8.
It's built in [Remotion](https://remotion.dev) with `@remotion/three` (React Three Fiber). All characters are original toy-like 3D models made from simple shapes, and every frame is driven by `useCurrentFrame()`.

## Characters
- **Finn**: baby orange fox in a green vest
- **Daisy**: baby deer with white spots and a yellow bow
- **Peep**: fluffy golden chick with a little blue watering can
- Woodland friends: bunny, squirrel, hedgehog

## Story timeline (frames @ 30 fps)
| Frames | Time | Beat |
|---|---|---|
| 0–135 | 0.0–4.5s | Finn waves, spots a twinkling seed, picks it up |
| 135–240 | 4.5–8.0s | Daisy digs a hole, Finn drops the seed in, Daisy pats the soil |
| 240–345 | 8.0–11.5s | Peep waters the seed |
| 345–445 | 11.5–14.8s | Friends wait patiently… a sprout pops up |
| 445–565 | 14.8–18.8s | Sprout grows into an apple tree with red apples |
| 565–705 | 18.8–23.5s | Apples are shared with bunny, squirrel and hedgehog |
| 705–900 | 23.5–30.0s | Friends smile and wave beside the swaying tree, with the ending text |

**Seamless loop:** the video opens on Finn waving in the meadow, standing exactly where he stands at the end. Over the last 18 frames the opening shot cross-fades in. Finn, the camera, the wave cycle and all ambient motion (clouds, butterflies, grass, tree sway) repeat every 30 s, so frame 899 → frame 0 is continuous.

## Audio
`public/music.wav` is synthesised by `scripts/make_music.py` (numpy). It is gentle orchestral-style music (strings, pizzicato bass, harp, celesta, flute) at 96 BPM, 12 bars, exactly 30 s. It adds birdsong and soft story sound effects that match the frames, and uses a circular reverb so the loop point is seamless. There is no dialogue.

## Commands
```bash
npm install
npm run music      # regenerate public/music.wav
npm run studio     # preview in Remotion Studio
npx remotion render FaithSeed out/faith-seed-short.mp4 --concurrency=4
```
`remotion.config.ts` uses software WebGL (`swangle`) and a local headless Chromium. Set `REMOTION_BROWSER` to point to a different Chrome binary, or remove that line to let Remotion download its own.

## Files
- `src/timeline.ts`: all story timing, poses, camera and prop paths
- `src/characters/`: Finn, Daisy, Peep, the critters, and the shared rig
- `src/Tree.tsx`: sprout and growing apple tree
- `src/Environment.tsx`: meadow, woodland, flowers, clouds, butterflies
- `src/FaithSeed.tsx`: composition (sky, 3D canvas, loop cross-fade, ending text, audio)
