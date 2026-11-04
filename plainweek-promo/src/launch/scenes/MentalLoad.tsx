import {useCurrentFrame} from 'remotion';
import {easeInOut, prog} from '../../anim';
import {DISPLAY, UI} from '../theme';

// Act 1 opener (4 s): everything life asks you to remember piles up faster than
// you can keep track of, and things start slipping.
export const INTRO_FRAMES = 120;

type Item = {text: string; tag?: 'Missed' | 'Overdue' | 'Forgot'};
const ITEMS: Item[] = [
  {text: 'Call Mum back'},
  {text: 'Pay rent', tag: 'Overdue'},
  {text: 'Dentist — Thursday 2:30'},
  {text: "Sam's birthday", tag: 'Missed'},
  {text: 'Pick up the kids at 3'},
  {text: 'Finish the Q4 deck'},
  {text: 'Renew passport', tag: 'Overdue'},
  {text: 'Reply to Jess'},
  {text: 'Gym (again)', tag: 'Missed'},
  {text: 'Book flights for June'},
  {text: 'Car service'},
  {text: 'Cancel the free trial', tag: 'Forgot'},
  {text: 'Parent–teacher evening', tag: 'Missed'},
  {text: 'Buy milk'},
  {text: 'Send invoice #204', tag: 'Overdue'},
  {text: 'Water the plants'},
  {text: 'Vet appointment', tag: 'Missed'},
  {text: 'Return the parcel'},
  {text: 'Text the landlord'},
  {text: 'Fix the leaking tap'},
  {text: 'Plan Ana’s surprise'},
  {text: 'Doctor’s referral', tag: 'Forgot'},
  {text: 'Pay the credit card', tag: 'Overdue'},
  {text: 'Read chapter 6'},
];

// Items arrive faster and faster: the list outruns you.
const ARRIVALS = (() => {
  const out: number[] = [];
  let t = -14; // a few items are already there on frame 0
  let gap = 9;
  for (let i = 0; i < ITEMS.length; i++) {
    out.push(t);
    t += gap;
    gap = Math.max(2.2, gap * 0.84);
  }
  return out;
})();

const ROW = 78;
const BASE_Y = 1560; // newest item sits here

const Headline: React.FC<{frame: number; from: number; to: number; words: [string, boolean][]}> = ({frame, from, to, words}) => {
  if (frame < from || frame > to) return null;
  const out = prog(frame, to - 8, 8, easeInOut);
  return (
    <div style={{fontSize: 108, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02, opacity: 1 - out, filter: `blur(${out * 8}px)`}}>
      {words.map(([w, accent], i) => {
        const k = prog(frame, from + i * 4, 12);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginRight: '0.22em'}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - k) * 105}%)`, color: accent ? '#FF6B4A' : '#F4F0EA'}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

export const MentalLoad: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > INTRO_FRAMES + 2) return null;
  const arrived = ARRIVALS.filter((a) => frame >= a).length;
  // continuous scroll position (fractional item count) so the list glides up
  let scroll = 0;
  ARRIVALS.forEach((a) => (scroll += prog(frame, a, 7, easeInOut)));
  // exit: the whole list rushes toward the camera into the noise of the next shot
  const rush = prog(frame, 100, 20, easeInOut);
  const counter = arrived;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#0B0A09', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 40% at 50% 0%, rgba(120,80,50,0.3) 0%, rgba(11,10,9,0) 70%)'}} />
      {/* the list */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${1 + rush * 1.6})`,
          transformOrigin: '50% 72%',
          filter: `blur(${rush * 14}px)`,
          opacity: 1 - prog(frame, 110, 10),
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, transparent 34%, black 52%, black 86%, transparent 96%)',
          maskImage: 'linear-gradient(180deg, transparent 0%, transparent 34%, black 52%, black 86%, transparent 96%)',
        }}
      >
        {ITEMS.map((it, i) => {
          const a = ARRIVALS[i];
          if (frame < a) return null;
          const k = prog(frame, a, 8);
          const y = BASE_Y + (i - scroll + 1) * ROW;
          const tagAt = a + 14;
          const t = it.tag ? prog(frame, tagAt, 8) : 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 120,
                right: 100,
                top: y,
                height: ROW,
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                fontFamily: UI,
                fontSize: 44,
                color: t > 0.5 ? '#9A7B74' : '#EDE8E1',
                opacity: k,
                transform: `translateX(${(1 - k) * 40}px)`,
              }}
            >
              <div style={{width: 36, height: 36, borderRadius: 18, border: `3px solid ${t > 0.5 ? '#FF6B4A' : '#5E5852'}`, flexShrink: 0, boxSizing: 'border-box'}} />
              <span style={{whiteSpace: 'nowrap', textDecoration: t > 0.5 ? 'line-through' : 'none', textDecorationColor: 'rgba(255,107,74,0.7)'}}>{it.text}</span>
              {it.tag && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#fff',
                    background: '#E5484D',
                    padding: '6px 16px',
                    borderRadius: 14,
                    opacity: t,
                    transform: `scale(${0.6 + 0.4 * t})`,
                  }}
                >
                  {it.tag}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* headlines + counter */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 230, textAlign: 'center', fontFamily: DISPLAY}}>
        <Headline frame={frame} from={2} to={56} words={[['So', false], ['much', false], ['to', false], ['remember.', false]]} />
        <Headline frame={frame} from={54} to={112} words={[['So', false], ['easy', false], ['to', false], ['forget.', true]]} />
        <div
          style={{
            marginTop: 22,
            fontSize: 40,
            fontWeight: 500,
            letterSpacing: -0.5,
            color: '#A39C92',
            fontVariantNumeric: 'tabular-nums',
            opacity: prog(frame, 8, 10) * (1 - prog(frame, 104, 8)),
          }}
        >
          {counter} {counter === 1 ? 'thing' : 'things'} on your mind
        </div>
      </div>
    </div>
  );
};
