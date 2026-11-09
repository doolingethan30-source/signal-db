import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {easeInOut, pop, prog} from '../anim';
import {DISPLAY} from '../launch/theme';
import {Q} from './theme';
import {VO_LINES} from './voTimeline';

// Zack D Films–style editing layer for the roommates film: a curiosity-gap hook,
// word-by-word narration captions, punch-in zooms on every cut, screen shake on
// the problem beats, flash transitions and a punchier grade with film grain.

type Cap = {from: number; to: number; text: string; pos: 'mid' | 'top'};
// Captions follow the voice-over phrase by phrase (*word* = highlighted keyword).
export const ZD_CAPTIONS: Cap[] = VO_LINES.map((l, i) => {
  const next = VO_LINES[i + 1];
  const from = Math.round(l.from * 30);
  // hold each caption until the next phrase starts (max 0.6 s after it ends)
  const to = Math.round(Math.min(next ? next.from : l.to + 0.6, l.to + 0.6) * 30);
  return {from, to, text: l.text, pos: from < Q.intro[0] ? 'mid' : 'top'};
});

const YELLOW = '#FFD23F';
const CHUNK = 3;

/** Word-by-word captions: a 2–3 word phrase on screen, the spoken word pops on its beat. */
export const ZDCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const cap = ZD_CAPTIONS.find((c) => frame >= c.from && frame < c.to);
  if (!cap) return null;
  const words = cap.text.split(' ');
  const spoken = VO_LINES.find((l) => Math.round(l.from * 30) === cap.from);
  const span = Math.max(6, (spoken ? spoken.to * 30 : cap.to) - cap.from - 4);
  const per = span / words.length;
  const idx = Math.min(words.length - 1, Math.floor((frame - cap.from) / per));
  const chunkStart = Math.floor(idx / CHUNK) * CHUNK;
  const chunk = words.slice(chunkStart, chunkStart + CHUNK);
  return (
    <div
      style={{
        position: 'absolute',
        left: 50,
        right: 50,
        top: cap.pos === 'mid' ? 840 : 180,
        textAlign: 'center',
        fontFamily: DISPLAY,
        fontSize: 112,
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: -2,
        zIndex: 15,
      }}
    >
      {chunk.map((w, i) => {
        const wi = chunkStart + i;
        const at = cap.from + wi * per;
        const chunkIn = pop(frame, cap.from + chunkStart * per, 8);
        const active = wi === idx;
        const k = active ? pop(frame, at, 8) : 1;
        const hl = w.startsWith('*');
        const clean = w.replace(/\*/g, '');
        return (
          <span
            key={wi}
            style={{
              display: 'inline-block',
              margin: '0 14px',
              color: hl ? YELLOW : '#FFFFFF',
              WebkitTextStroke: '14px #0B0A09',
              paintOrder: 'stroke fill',
              textShadow: '0 10px 30px rgba(0,0,0,0.45)',
              transform: `scale(${(0.7 + 0.3 * Math.min(1, chunkIn)) * (active ? 1 + 0.12 * Math.sin(Math.min(1, k) * Math.PI) : 1)}) rotate(${hl ? -2 : 0}deg)`,
              opacity: Math.min(1, chunkIn * 2),
            }}
          >
            {clean}
          </span>
        );
      })}
    </div>
  );
};

// cuts that get a punch-in zoom, and beats that get a screen shake
const CUTS: number[] = [Q.dishes[0], Q.lounge[0], Q.chat[0], Q.rota[0], Q.intro[0], Q.setup[0], Q.chores[0], Q.today[0], Q.proof[0], Q.shopping[0], Q.events[0], Q.fairness[0], Q.widgets[0], Q.clean[0]];
const SHAKES: number[] = [Q.dishes[0] + 2, Q.chat[0] + 4, Q.chat[0] + 32, Q.rota[0] + 4];

/** Camera language: snap zoom on each cut, slow push within the shot, shake on impact beats. */
export const CameraFX: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  let last = 0;
  CUTS.forEach((c) => {
    if (frame >= c) last = c;
  });
  const snap = last ? 0.12 * (1 - prog(frame, last, 9, easeInOut)) : 0;
  const push = 0.035 * prog(frame, last, 110);
  let sx = 0;
  let sy = 0;
  SHAKES.forEach((s) => {
    const t = frame - s;
    if (t >= 0 && t < 12) {
      const a = 16 * (1 - t / 12);
      sx += Math.sin(t * 2.7) * a;
      sy += Math.cos(t * 3.3) * a * 0.7;
    }
  });
  const end = frame >= Q.end[0] ? 0 : 1;
  return (
    <AbsoluteFill style={{transform: end ? `translate(${sx}px, ${sy}px) scale(${1 + snap + push})` : undefined, transformOrigin: '50% 45%'}}>
      {children}
    </AbsoluteFill>
  );
};

/** White flash on the big turns: problem → Plainweek, and Plainweek → clean apartment. */
export const Flashes: React.FC = () => {
  const frame = useCurrentFrame();
  const at = [Q.intro[0], Q.clean[0]];
  const k = Math.max(...at.map((a) => (frame >= a - 2 && frame < a + 8 ? 1 - Math.abs(frame - a) / 8 : 0)));
  if (k <= 0) return null;
  return <AbsoluteFill style={{background: '#fff', opacity: k * 0.9, zIndex: 18}} />;
};

/** Punchier grade: contrast + warmth, heavy vignette, animated film grain. */
export const Grade: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{backdropFilter: 'contrast(1.12) saturate(1.15)', zIndex: 12, pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'radial-gradient(110% 75% at 50% 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)', zIndex: 13, pointerEvents: 'none'}} />
      <AbsoluteFill style={{zIndex: 14, opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
        <svg width="1080" height="1920">
          <filter id="zdgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 12} />
          </filter>
          <rect width="1080" height="1920" filter="url(#zdgrain)" />
        </svg>
      </AbsoluteFill>
    </>
  );
};
