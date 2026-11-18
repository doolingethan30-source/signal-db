// Renders both cuts:  npm run render
//   out/locked-promo.mp4      (30s, scenes 1–7)
//   out/locked-promo-15s.mp4  (15s cut, with voice-over)
//   out/locked-campaign.mp4   (39s campaign film)
//   npm run render:campaign   → campaign only
//
// Optional: set CHROME_PATH to use an existing Chrome/Chromium binary
// instead of letting Remotion download its own headless browser.
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, renameSync} from 'node:fs';

mkdirSync('out', {recursive: true});
if (!existsSync('public/music.mp3')) {
  console.log('ℹ No public/music.mp3 found: rendering without music.');
}

const extra = process.env.CHROME_PATH ? [`--browser-executable=${process.env.CHROME_PATH}`] : [];
const ALL = [
  ['LockedPromo', 'out/locked-promo.mp4'],
  ['LockedPromo15', 'out/locked-promo-15s.mp4'],
  ['LockedCampaign', 'out/locked-campaign.mp4'],
];
// `node render.mjs campaign` renders only the campaign film; no args renders everything.
const only = process.argv[2];
const jobs = only === 'campaign' ? ALL.slice(2) : only === 'promo' ? ALL.slice(0, 2) : ALL;

for (const [id, file] of jobs) {
  console.log(`\n▶ Rendering ${id} → ${file}`);
  execFileSync('npx', ['remotion', 'render', 'src/index.ts', id, file, '--codec=h264', ...extra], {
    stdio: 'inherit',
  });
  // Re-encode to a phone/QuickTime-friendly MP4: standard-range yuv420p,
  // High@4.1, moov atom up front, ~20 MB instead of ~90 MB.
  console.log(`▶ Optimising ${file} for iPhone / social upload`);
  const tmp = file.replace('.mp4', '.tmp.mp4');
  execFileSync('npx', ['remotion', 'ffmpeg', '-y', '-loglevel', 'error', '-i', file,
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-vf', 'scale=in_range=full:out_range=tv', '-color_range', 'tv', '-colorspace', 'bt709',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-crf', '21', '-preset', 'slow',
    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', tmp], {stdio: 'inherit'});
  renameSync(tmp, file);
}
console.log(`\n✔ Done: ${jobs.map((j) => j[1]).join(', ')}`);
