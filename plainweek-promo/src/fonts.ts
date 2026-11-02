import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, string, string][] = [
  ['Inter', 'inter-latin-400-normal.woff2', '400', 'normal'],
  ['Inter', 'inter-latin-500-normal.woff2', '500', 'normal'],
  ['Inter', 'inter-latin-600-normal.woff2', '600', 'normal'],
  ['Inter', 'inter-latin-700-normal.woff2', '700', 'normal'],
  ['Instrument Serif', 'instrument-serif-latin-400-normal.woff2', '400', 'normal'],
  ['Instrument Serif', 'instrument-serif-latin-400-italic.woff2', '400', 'italic'],
  ['Inter Display', 'InterDisplay-Light.otf', '300', 'normal'],
  ['Inter Display', 'InterDisplay-Medium.otf', '500', 'normal'],
  ['Inter Display', 'InterDisplay-SemiBold.otf', '600', 'normal'],
  ['Inter Display', 'InterDisplay-Bold.otf', '700', 'normal'],
];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading fonts');
  Promise.all(
    faces.map(([family, file, weight, style]) => {
      const format = file.endsWith('.otf') ? 'opentype' : 'woff2';
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('${format}')`, {weight, style});
      return face.load().then((f) => document.fonts.add(f));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
