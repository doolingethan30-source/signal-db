import {useCurrentFrame} from 'remotion';
import {easeInOut, prog} from '../../anim';
import {DISPLAY, L} from '../theme';
import {darkAt, DARK_IN, GLASS_IN} from '../timeline';

type Title = {from: number; to: number; title: string; sub?: string};

// *word* renders in the accent colour.
export const TITLES: Title[] = [
  {from: 140, to: 244, title: 'Meet *Plainweek.*', sub: 'Your whole week, finally calm.'},
  {from: L.type[0] + 4, to: L.type[1] - 2, title: 'Just *type* it.', sub: 'Natural language, instantly organised.'},
  {from: L.drag[0] + 4, to: L.drag[1] - 2, title: 'Drag. Drop. *Done.*', sub: 'Rearrange your week in a gesture.'},
  {from: L.block[0] + 4, to: L.block[1] - 2, title: 'AI *time blocking.*', sub: 'Tasks fitted around your meetings.'},
  {from: L.replan[0] + 2, to: L.replan[1] - 2, title: 'Re-plan in *one tap.*', sub: 'When your day shifts, Plainweek adapts.'},
  {from: L.widgets[0] + 4, to: L.widgets[1] - 2, title: '*Beautiful* widgets.', sub: 'Your week, right on your Home Screen.'},
];

const ACCENT = '#E07A3F';

/** Each word slides up out of a mask, staggered; *word* is accented. */
const Words: React.FC<{text: string; frame: number; from: number; color: string; stagger?: number}> = ({text, frame, from, color, stagger = 3}) => (
  <>
    {text.split(' ').map((w, i) => {
      const accent = w.startsWith('*') || w.endsWith('*');
      const clean = w.replace(/\*/g, '');
      const k = prog(frame, from + i * stagger, 14);
      return (
        <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginRight: '0.24em'}}>
          <span style={{display: 'inline-block', transform: `translateY(${(1 - k) * 105}%)`, color: accent ? ACCENT : color}}>{clean}</span>
        </span>
      );
    })}
  </>
);

/** Opening hook, timed to the voice-over: "Your week / shouldn't feel / this loud." */
const HOOK: [string, number][] = [['Your', 12], ['week', 19], ["shouldn't", 29], ['feel', 41], ['this', 50], ['loud.', 57]];
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 118) return null;
  const out = prog(frame, 102, 12, easeInOut);
  const word = ([w, at]: [string, number]) => {
    const k = prog(frame, at, 9);
    const loud = w === 'loud.';
    const punch = loud ? 1 + Math.sin(Math.min(1, prog(frame, at, 8)) * Math.PI) * 0.14 : 1;
    const shake = loud && frame > at + 4 ? Math.sin(frame * 2.3) * 3 * (1 - prog(frame, at + 4, 30)) : 0;
    return (
      <span key={w} style={{display: 'inline-block', marginRight: '0.22em', opacity: k, transform: `translate(${shake}px, ${(1 - k) * 40}px) scale(${(0.9 + 0.1 * k) * punch})`, filter: `blur(${(1 - k) * 10}px)`, color: loud ? '#FF6B4A' : '#F4F0EA'}}>
        {w}
      </span>
    );
  };
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 690, textAlign: 'center', fontFamily: DISPLAY, fontSize: 138, fontWeight: 700, letterSpacing: -4.5, lineHeight: 1.02, opacity: 1 - out, filter: `blur(${out * 10}px)`, transform: `scale(${1 + out * 0.08})`}}>
      <div>{HOOK.slice(0, 2).map(word)}</div>
      <div>{HOOK.slice(2, 4).map(word)}</div>
      <div>{HOOK.slice(4).map(word)}</div>
    </div>
  );
};

export const Titles: React.FC = () => {
  const frame = useCurrentFrame();
  const dark = darkAt(frame);
  const ink = `rgb(${28 + dark * 217},${27 + dark * 215},${25 + dark * 212})`;
  const sub = dark > 0.5 ? '#A39C92' : '#7D766D';
  return (
    <>
      <Hook />
      {TITLES.map((c, i) => {
        if (frame < c.from - 1 || frame > c.to + 1) return null;
        const s = prog(frame, c.from + 7, 18);
        const out = prog(frame, c.to - 10, 10, easeInOut);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              top: 150,
              textAlign: 'center',
              fontFamily: DISPLAY,
              opacity: 1 - out,
              transform: `translateY(${-out * 16}px)`,
              filter: `blur(${out * 8}px)`,
            }}
          >
            <div style={{fontSize: 92, lineHeight: 1.05, fontWeight: 700, letterSpacing: -3, color: ink}}>
              <Words text={c.title} frame={frame} from={c.from} color={ink} />
            </div>
            {c.sub && (
              <div
                style={{
                  marginTop: 18,
                  fontSize: 36,
                  fontWeight: 500,
                  letterSpacing: -0.6,
                  color: sub,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 18}px)`,
                }}
              >
                {c.sub}
              </div>
            )}
          </div>
        );
      })}
      <ThemeWords />
    </>
  );
};

/** "Light. Dark. Glass." — each word lights up as the interface morphs. */
const ThemeWords: React.FC = () => {
  const frame = useCurrentFrame();
  const [from, to] = L.themes;
  if (frame < from || frame > to + 1) return null;
  const inA = prog(frame, from + 2, 18);
  const out = prog(frame, to - 10, 10, easeInOut);
  const dark = darkAt(frame);
  const active = [
    1 - prog(frame, DARK_IN, 10),
    Math.min(prog(frame, DARK_IN, 10), 1 - prog(frame, GLASS_IN, 10)),
    prog(frame, GLASS_IN, 10),
  ];
  const base = dark > 0.5 ? [245, 242, 237] : [28, 27, 25];
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: 150,
        textAlign: 'center',
        fontFamily: DISPLAY,
        opacity: inA * (1 - out),
        filter: `blur(${(1 - inA) * 10 + out * 8}px)`,
      }}
    >
      <div style={{fontSize: 88, fontWeight: 600, letterSpacing: -2.6, lineHeight: 1.05}}>
        {['Light.', 'Dark.', 'Glass.'].map((w, i) => (
          <span key={w} style={{color: `rgba(${base.join(',')},${0.22 + active[i] * 0.78})`, marginRight: i < 2 ? 22 : 0}}>
            {w}
          </span>
        ))}
      </div>
      <div style={{marginTop: 18, fontSize: 38, fontWeight: 500, letterSpacing: -0.6, color: dark > 0.5 ? '#A39C92' : '#8B857C'}}>
        Seamless themes. Make it yours.
      </div>
    </div>
  );
};
