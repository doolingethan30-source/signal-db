import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, string, string][] = [
  ['Inter', 'inter-latin-400-normal.woff2', '400', 'normal'],
  ['Inter', 'inter-latin-500-normal.woff2', '500', 'normal'],
  ['Inter', 'inter-latin-600-normal.woff2', '600', 'normal'],
  ['Inter', 'inter-latin-700-normal.woff2', '700', 'normal'],
  ['Instrument Serif', 'instrument-serif-latin-400-normal.woff2', '400', 'normal'],
  ['Instrument Serif', 'instrument-serif-latin-400-italic.woff2', '400', 'italic'],
];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading fonts');
  Promise.all(
    faces.map(([family, file, weight, style]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {weight, style});
      return face.load().then((f) => document.fonts.add(f));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
