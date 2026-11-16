import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Inter is bundled in public/fonts (SIL Open Font License) so renders look
// identical on any machine. If it fails to load, the FONT stack in theme.ts
// falls back to SF Pro Display / system sans.
const weights: [string, string][] = [
  ['400', 'Inter-Regular.otf'],
  ['500', 'Inter-Medium.otf'],
  ['600', 'Inter-SemiBold.otf'],
  ['700', 'Inter-Bold.otf'],
  ['800', 'Inter-ExtraBold.otf'],
  ['900', 'Inter-Black.otf'],
];

let loaded = false;
export const ensureFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const [weight, file] of weights) {
    loadFont({family: 'Inter', url: staticFile(`fonts/${file}`), weight}).catch(() => {
      // Non-fatal: fallback fonts will be used.
    });
  }
};
