import {interpolate} from 'remotion';
import {pop, prog} from '../anim';
import {Check, Leaf} from '../components/Icons';
import {StatusBar} from '../components/Phone';
import {ProBadge} from '../components/ProBadge';
import {A, SANS} from '../theme';

const HABITS = [
  {name: 'Walk 8,000 steps', streak: 12, days: [1, 1, 1, 1, 1, 0, 0]},
  {name: 'Read 20 minutes', streak: 9, days: [1, 1, 1, 1, 0, 0, 0]},
  {name: 'Drink water', streak: 30, days: [1, 1, 1, 1, 1, 0, 0]},
  {name: 'Phone off by 10', streak: 5, days: [1, 1, 0, 1, 1, 0, 0]},
];
const LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const Habits: React.FC<{f: number}> = ({f}) => {
  const count = Math.round(interpolate(f, [8, 40], [14, 21], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const bump = f >= 40 ? pop(f, 40, 10) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: A.bg, fontFamily: SANS}}>
      <StatusBar />
      <div style={{position: 'absolute', left: 24, top: 62, right: 24}}>
        <ProBadge />
        <div style={{fontSize: 28, fontWeight: 700, letterSpacing: -0.5, lineHeight: '36px', marginTop: 8}}>Habits</div>
        <div style={{fontSize: 13, color: A.sub, marginTop: 2}}>Small things, every day.</div>
      </div>
      {/* hero streak card */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 180,
          height: 196,
          borderRadius: 24,
          background: A.ink,
          color: A.bg,
          padding: '20px 22px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: -40,
            width: 200,
            height: 200,
            borderRadius: 100,
            background: 'radial-gradient(circle, rgba(255,90,31,0.35), rgba(255,90,31,0) 70%)',
          }}
        />
        <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#C9C4BC', fontWeight: 600, letterSpacing: 1}}>
          <Leaf size={13} color={A.orange} /> MORNING PAGES
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6}}>
          <span
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: '84px',
              fontVariantNumeric: 'tabular-nums',
              display: 'inline-block',
              transform: `scale(${1 + Math.sin(Math.min(1, bump) * Math.PI) * 0.06})`,
              transformOrigin: 'left bottom',
            }}
          >
            {count}
          </span>
          <span style={{fontSize: 16, color: '#D8D4CC'}}>day streak</span>
        </div>
        <div style={{display: 'flex', gap: 6, marginTop: 14}}>
          {Array.from({length: 21}).map((_, i) => {
            const on = i < count;
            return (
              <div
                key={i}
                style={{
                  width: 9,
                  height: 18,
                  borderRadius: 4,
                  background: on ? A.orange : 'rgba(255,255,255,0.12)',
                  opacity: on ? 0.55 + (i / 21) * 0.45 : 1,
                }}
              />
            );
          })}
        </div>
      </div>
      {/* habit rows */}
      {HABITS.map((h, i) => {
        const rowIn = prog(f, 4 + i * 4, 12);
        return (
          <div
            key={h.name}
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              top: 394 + i * 96,
              height: 84,
              borderRadius: 18,
              background: '#FBFAF8',
              border: `1px solid ${A.line}`,
              padding: '14px 16px',
              boxSizing: 'border-box',
              opacity: rowIn,
              transform: `translateY(${(1 - rowIn) * 20}px)`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span style={{fontSize: 15, fontWeight: 600}}>{h.name}</span>
              <span style={{marginLeft: 'auto', fontSize: 12, color: A.orange, fontWeight: 600, display: 'flex', gap: 4, alignItems: 'center'}}>
                <Leaf size={11} /> {h.streak + (f > 30 + i * 5 ? 1 : 0)} days
              </span>
            </div>
            <div style={{display: 'flex', gap: 9, marginTop: 12}}>
              {LETTERS.map((l, d) => {
                const isToday = d === 5;
                const fillAt = 12 + i * 5 + d * 2;
                const fill = h.days[d] ? prog(f, fillAt, 8) : isToday ? prog(f, 30 + i * 5, 8) : 0;
                return (
                  <div
                    key={d}
                    style={{
                      width: 34,
                      height: 24,
                      borderRadius: 8,
                      background: fill > 0.05 ? `rgba(255,90,31,${0.25 + fill * 0.75})` : '#F1EEE7',
                      border: isToday ? `1.5px solid ${A.orange}` : 'none',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 600,
                      color: fill > 0.5 ? '#fff' : A.sub,
                    }}
                  >
                    {fill > 0.6 ? <Check size={11} progress={Math.min(1, (fill - 0.6) * 3)} /> : l}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
