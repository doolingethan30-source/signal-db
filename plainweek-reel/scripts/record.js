// Screen-records the clickable prototype at an iPhone viewport (390x844) with
// Playwright, driving every interaction on a fixed timeline so the footage lines
// up with the storyboard. Frames come from Chrome's screencast at 2x device
// pixels (780x1688) for a crisp final video; tap/tick times are logged for the
// sound design.
//
// Usage: node scripts/record.js <prototype.html> <outDir>
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');

const proto = path.resolve(process.argv[2] || 'prototype/plainweek-prototype.html');
const outDir = path.resolve(process.argv[3] || 'out/rec');
const framesDir = path.join(outDir, 'raw');
fs.rmSync(outDir, {recursive: true, force: true});
fs.mkdirSync(framesDir, {recursive: true});

const BRAIN_DUMP = 'call mum sun, dentist thurs 3pm?? finish deck by fri, gym tue + thu, milk';
const END = 18.4;

// Visible tap highlight: a soft accent disc that presses in, then releases.
const TAP_CSS = `
.__tap { position: fixed; width: 54px; height: 54px; margin: -27px 0 0 -27px; border-radius: 50%;
  background: rgba(224,122,63,.22); border: 2px solid rgba(224,122,63,.55); pointer-events: none;
  z-index: 99999; transform: scale(.55); opacity: 0;
  transition: transform .16s cubic-bezier(.22,1,.36,1), opacity .16s ease; }
.__tap.down { transform: scale(1); opacity: 1; }
.__tap.up { transform: scale(1.55); opacity: 0; transition: transform .55s cubic-bezier(.22,1,.36,1), opacity .55s ease; }`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 2});
  await page.goto('file://' + proto + '?record');
  await page.addStyleTag({content: TAP_CSS});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  let n = 0;
  cdp.on('Page.screencastFrame', async ({data, metadata, sessionId}) => {
    const file = `f${String(n++).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(framesDir, file), Buffer.from(data, 'base64'));
    frames.push({file, ts: metadata.timestamp});
    cdp.send('Page.screencastFrameAck', {sessionId}).catch(() => {});
  });
  await cdp.send('Page.startScreencast', {format: 'jpeg', quality: 95, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1});
  // wait for the first frame to anchor the timeline
  while (!frames.length) await page.waitForTimeout(10);
  const t0 = frames[0].ts;
  const now = () => Date.now() / 1000 - t0;
  const until = async (t) => {
    const ms = (t - now()) * 1000;
    if (ms > 0) await page.waitForTimeout(ms);
  };
  const events = [];

  // Slow, deliberate tap: highlight presses in, short hold, click, release.
  async function tap(selector, at, kind = 'tap') {
    await until(at);
    const box = await page.locator(selector).boundingBox();
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.evaluate(([x, y]) => {
      const d = document.createElement('div');
      d.className = '__tap';
      d.style.left = x + 'px';
      d.style.top = y + 'px';
      document.body.appendChild(d);
      requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('down')));
      window.__lastTap = d;
    }, [x, y]);
    await page.waitForTimeout(170);
    await page.mouse.move(x, y);
    await page.mouse.down();
    events.push({kind, t: now()});
    await page.waitForTimeout(90);
    await page.mouse.up();
    await page.evaluate(() => {
      const d = window.__lastTap;
      d.classList.add('up');
      setTimeout(() => d.remove(), 700);
    });
  }

  // 0–4s: week view loads
  await until(0.15);
  await page.evaluate(() => window.playIntro());

  // 4–9s: tick two tasks, open a day, block it
  await tap('#check-2', 4.1, 'tick');
  await tap('#check-3', 4.9, 'tick');
  await tap('#day-0', 6.0);
  await tap('#block-btn', 6.95);
  await tap('#plan-apply', 7.85, 'tick');

  // 9–14s: brain dump
  await tap('#tab-inbox', 9.0);
  await tap('#dump', 9.55);
  await until(9.95);
  events.push({kind: 'typeStart', t: now()});
  for (const ch of BRAIN_DUMP) {
    await page.keyboard.type(ch);
    await page.waitForTimeout(ch === ' ' ? 34 : ch === ',' || ch === '?' ? 70 : 16 + Math.random() * 10);
  }
  events.push({kind: 'typeEnd', t: now()});
  await tap('#organise', 12.05);
  await tap('#add-all', 13.35, 'tick');

  // 14–18s: Pro, Full Glass, dark mode
  await tap('#tab-settings', 14.0);
  await tap('#pro-switch', 14.55);
  await tap('#style-full', 15.25, 'glass');
  await tap('#dark-switch', 16.35);
  await tap('#tab-week', 17.25);
  await until(END);

  await cdp.send('Page.stopScreencast');
  await page.waitForTimeout(200);
  const end = now();
  fs.writeFileSync(
    path.join(outDir, 'timeline.json'),
    JSON.stringify({frames: frames.map((f) => ({file: f.file, t: f.ts - t0})), events, end}, null, 1),
  );
  console.log(`recorded ${frames.length} frames over ${end.toFixed(2)}s`);
  console.log(events.map((e) => `${e.kind}@${e.t.toFixed(2)}`).join(' '));
  await browser.close();
})();
