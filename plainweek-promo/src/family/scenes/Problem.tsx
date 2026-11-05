import {useCurrentFrame} from 'remotion';
import {easeInOut, pop, prog} from '../../anim';
import {DISPLAY} from '../../launch/theme';
import {ACCENT, F, INK} from '../theme';

// Act 2 (5–10 s): the fridge door is the family's "system" – notes pile up and
// fall off, while one parent's phone fills with everyone's reminders (the phone
// itself is drawn by the phone rig in Family.tsx).

type Note = {x: number; y: number; r: number; at: number; fall?: number; kind: 'note' | 'list' | 'chart'; text?: string; color?: string};
const NOTES: Note[] = [
  {kind: 'chart', x: 120, y: 640, r: -2, at: 4},
  {kind: 'note', x: 360, y: 610, r: 6, at: 10, text: 'Feed Biscuit!!', color: '#F6E39A', fall: 92},
  {kind: 'list', x: 130, y: 1030, r: 3, at: 16},
  {kind: 'note', x: 380, y: 900, r: -7, at: 22, text: 'Bins out — whose turn??', color: '#F7C6C0'},
  {kind: 'note', x: 340, y: 1300, r: 5, at: 30, text: 'Ava piano 4 pm', color: '#C9DDF5', fall: 108},
  {kind: 'note', x: 110, y: 1430, r: -5, at: 38, text: 'Leo — football kit?', color: '#F6E39A'},
  {kind: 'note', x: 370, y: 1530, r: 8, at: 46, text: 'Permission slip!', color: '#CFE6C4', fall: 120},
];

const NoteBody: React.FC<{n: Note}> = ({n}) => {
  const pin = <div style={{position: 'absolute', left: '50%', top: -12, width: 26, height: 26, marginLeft: -13, borderRadius: 13, background: ACCENT, boxShadow: '0 3px 6px rgba(0,0,0,0.25)'}} />;
  if (n.kind === 'note')
    return (
      <div style={{position: 'relative', width: 230, minHeight: 190, padding: '30px 24px 20px', background: n.color, boxShadow: '0 14px 26px rgba(80,60,30,0.18)', fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 40, lineHeight: '44px', color: '#3E352B', boxSizing: 'border-box'}}>
        {pin}
        {n.text}
      </div>
    );
  if (n.kind === 'list')
    return (
      <div style={{position: 'relative', width: 230, padding: '30px 24px 22px', background: '#fff', boxShadow: '0 14px 26px rgba(80,60,30,0.16)', fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 34, lineHeight: '42px', color: '#3E352B', backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 41px, #E7DED2 41px 42px)'}}>
        {pin}
        <div style={{fontWeight: 700, fontStyle: 'normal', fontFamily: 'Inter', fontSize: 22, letterSpacing: 2, marginBottom: 4}}>GROCERIES</div>
        milk · eggs
        <br />
        bread?? apples
        <br />
        <s>cereal</s> pasta
        <br />
        dog food!!
      </div>
    );
  return (
    <div style={{position: 'relative', width: 230, padding: '26px 20px 18px', background: '#FFFDF8', boxShadow: '0 14px 26px rgba(80,60,30,0.16)', fontFamily: 'Inter, sans-serif', color: '#3E352B'}}>
      {pin}
      <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 2}}>CHORES</div>
      {['Tidy room', 'Dishes', 'Walk dog', 'Bins'].map((c, i) => (
        <div key={c} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, marginTop: 10}}>
          <div style={{width: 22, height: 22, border: '2.5px solid #B9AE9F', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#C9573E'}}>{i === 2 ? '✓' : ''}</div>
          {c}
        </div>
      ))}
    </div>
  );
};

const TITLES: [number, number, string, string][] = [
  [F.problem[0] + 6, F.problem[0] + 50, 'Chores', 'forgotten.'],
  [F.problem[0] + 50, F.problem[0] + 96, 'Lists', 'everywhere.'],
  [F.problem[0] + 96, F.problem[0] + 146, 'One parent,', 'holding it all.'],
];

export const ProblemTitles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {TITLES.map(([from, to, a, b]) => {
        if (frame < from - 1 || frame > to + 1) return null;
        const out = prog(frame, to - 8, 8, easeInOut);
        const k1 = prog(frame, from, 14);
        const k2 = prog(frame, from + 5, 14);
        return (
          <div key={from} style={{position: 'absolute', left: 60, right: 60, top: 170, textAlign: 'center', fontFamily: DISPLAY, fontSize: 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1.04, color: INK, opacity: 1 - out, filter: `blur(${out * 8}px)`}}>
            <div style={{opacity: k1, transform: `translateY(${(1 - k1) * 30}px)`}}>{a}</div>
            <div style={{opacity: k2, transform: `translateY(${(1 - k2) * 30}px)`, color: '#C9573E'}}>{b}</div>
          </div>
        );
      })}
    </>
  );
};

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const [from, to] = F.problem;
  if (frame < from || frame > to + 2) return null;
  const f = frame - from;
  const enter = prog(f, 0, 14, easeInOut);
  // exit: the fridge slides away as the phone takes centre stage
  const exit = prog(f, 132, 18, easeInOut);
  const dim = prog(f, 96, 14); // focus on the parent's phone for "One parent"
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #F7EFE5 0%, #F1E4D4 100%)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,236,205,0) 30%, rgba(255,236,205,0.6) 45%, rgba(255,236,205,0) 60%)'}} />
      <div style={{position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateX(${-exit * 260}px) scale(${1.04 - 0.04 * enter})`, filter: `blur(${exit * 8}px) saturate(${1 - dim * 0.4})`}}>
        {/* fridge */}
        <div style={{position: 'absolute', left: 70, top: 540, width: 560, height: 1500, borderRadius: 44, background: 'linear-gradient(100deg, #FDFCFA 0%, #ECE8E2 100%)', boxShadow: '0 40px 80px rgba(90,70,40,0.18), inset 0 0 0 2px rgba(255,255,255,0.8)'}}>
          <div style={{position: 'absolute', right: 30, top: 160, width: 18, height: 520, borderRadius: 9, background: 'linear-gradient(90deg,#D8D2C8,#BFB7AA)'}} />
        </div>
        {NOTES.map((n, i) => {
          const p = pop(f, n.at, 13);
          if (f < n.at) return null;
          const fall = n.fall !== undefined ? prog(f, n.fall, 26, easeInOut) : 0;
          const sway = Math.sin(f / 9 + i) * 1.2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: n.x,
                top: n.y,
                transform: `translateY(${(1 - p) * -30 + fall * 520}px) rotate(${n.r + sway + fall * (i % 2 ? 40 : -35)}deg) scale(${0.85 + 0.15 * p})`,
                opacity: Math.min(1, p * 1.5) * (1 - fall * 0.9),
              }}
            >
              <NoteBody n={n} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', inset: 0, background: '#FBF3E8', opacity: 1 - prog(f, 0, 12)}} />
    </div>
  );
};
