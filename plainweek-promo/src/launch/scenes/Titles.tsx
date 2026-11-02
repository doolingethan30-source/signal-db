import {useCurrentFrame} from 'remotion';
import {easeInOut, prog} from '../../anim';
import {DISPLAY, L} from '../theme';
import {darkAt, DARK_IN, GLASS_IN} from '../timeline';

type Title = {from: number; to: number; title: string; sub?: string; center?: boolean};

export const TITLES: Title[] = [
  {from: 8, to: 50, title: 'Too many apps.', center: true},
  {from: 48, to: 88, title: 'Too many pings.', center: true},
  {from: 86, to: 120, title: 'Not enough week.', center: true},
  {from: 140, to: 244, title: 'Meet Plainweek.', sub: 'Your whole week, finally calm.'},
  {from: L.type[0] + 4, to: L.type[1] - 2, title: 'Just type it.', sub: 'Natural language, instantly organised.'},
  {from: L.drag[0] + 4, to: L.drag[1] - 2, title: 'Drag. Drop. Done.', sub: 'Rearrange your week in a gesture.'},
  {from: L.block[0] + 4, to: L.block[1] - 2, title: 'AI time blocking.', sub: 'Tasks fitted around your meetings.'},
  {from: L.replan[0] + 2, to: L.replan[1] - 2, title: 'Plans changed?', sub: 'Re-plan your day in one tap.'},
  {from: L.widgets[0] + 4, to: L.widgets[1] - 2, title: 'Beautiful widgets.', sub: 'Your week, right on your Home Screen.'},
];

export const Titles: React.FC = () => {
  const frame = useCurrentFrame();
  const dark = darkAt(frame);
  const ink = frame < 125 ? '#F4F0EA' : `rgb(${28 + dark * 217},${27 + dark * 215},${25 + dark * 212})`;
  const sub = frame < 125 ? '#A39C92' : dark > 0.5 ? '#A39C92' : '#8B857C';
  return (
    <>
      {TITLES.map((c, i) => {
        if (frame < c.from - 1 || frame > c.to + 1) return null;
        const a = prog(frame, c.from, 18);
        const s = prog(frame, c.from + 7, 18);
        const out = prog(frame, c.to - 10, 10, easeInOut);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              top: c.center ? 880 : 168,
              textAlign: 'center',
              fontFamily: DISPLAY,
              opacity: 1 - out,
              transform: `translateY(${-out * 16}px)`,
              filter: `blur(${out * 8}px)`,
            }}
          >
            <div
              style={{
                fontSize: c.center ? 104 : 88,
                lineHeight: 1.05,
                fontWeight: 600,
                letterSpacing: -2.6,
                color: ink,
                opacity: a,
                transform: `translateY(${(1 - a) * 30}px) scale(${0.97 + 0.03 * a})`,
                filter: `blur(${(1 - a) * 12}px)`,
              }}
            >
              {c.title}
            </div>
            {c.sub && (
              <div
                style={{
                  marginTop: 18,
                  fontSize: 38,
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
        top: 168,
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
