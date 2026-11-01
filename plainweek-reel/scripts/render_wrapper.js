// Renders the wrapper page frame by frame (deterministic, 30 fps) to JPEGs.
// Usage: node scripts/render_wrapper.js <portrait|landscape> <outDir> [seconds] [onlyTimes,comma,separated]
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');

const layout = process.argv[2] || 'portrait';
const outDir = path.resolve(process.argv[3] || `out/frames-${layout}`);
const seconds = +(process.argv[4] || 20);
const only = process.argv[5] ? process.argv[5].split(',').map(Number) : null;
const FPS = 30;
const [W, H] = layout === 'landscape' ? [1920, 1080] : [1080, 1920];
const recFrames = fs.readdirSync(path.resolve('out/rec/cfr')).length;

(async () => {
  fs.rmSync(outDir, {recursive: true, force: true});
  fs.mkdirSync(outDir, {recursive: true});
  const browser = await chromium.launch();
  const page = await browser.newPage({viewport: {width: W, height: H}, deviceScaleFactor: 1});
  await page.goto(`file://${path.resolve('wrapper/wrapper.html')}?layout=${layout}&frames=${recFrames}`);
  await page.evaluate(() => window.ready);
  const times = only || Array.from({length: Math.round(seconds * FPS)}, (_, i) => i / FPS);
  for (let i = 0; i < times.length; i++) {
    await page.evaluate((t) => window.renderAt(t), times[i]);
    const name = only ? `t${times[i]}.jpg` : `w${String(i).padStart(4, '0')}.jpg`;
    await page.screenshot({path: path.join(outDir, name), type: 'jpeg', quality: 94});
    if (!only && i % 100 === 0) console.log(layout, i, '/', times.length);
  }
  await browser.close();
})();
