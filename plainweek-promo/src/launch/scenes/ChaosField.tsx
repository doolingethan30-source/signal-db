import {useCurrentFrame} from 'remotion';
import {easeInOut, pop, prog} from '../../anim';
import {UI} from '../theme';

type Kind = 'banner' | 'badge' | 'event' | 'task' | 'bubble';
type Item = {kind: Kind; x: number; y: number; d: number; r: number; at: number; a?: string; b?: string; c?: string};

// x/y are offsets from frame centre at depth 1; d is depth (bigger = nearer).
const ITEMS: Item[] = [
  {kind: 'banner', x: -380, y: -620, d: 0.7, r: -4, at: 2, a: 'Mail', b: '48 unread messages', c: '#5B8DEF'},
  {kind: 'event', x: 160, y: -700, d: 0.55, r: 5, at: 4, a: 'Stand-up', b: '9:00 – 9:30', c: '#8E6CE8'},
  {kind: 'badge', x: 420, y: -520, d: 1.05, r: 0, at: 6, a: '99+'},
  {kind: 'task', x: -470, y: -260, d: 1.15, r: -6, at: 8, a: 'Q4 deck', b: 'Overdue · 3 days'},
  {kind: 'event', x: 300, y: -330, d: 0.8, r: -3, at: 10, a: 'Design review', b: '9:15 · Conflict', c: '#E2475D'},
  {kind: 'bubble', x: -150, y: -460, d: 0.5, r: 2, at: 12, a: '“are we still on for 3?”'},
  {kind: 'banner', x: 260, y: 430, d: 1.25, r: 3, at: 14, a: 'Reminder', b: 'Dentist — 15 min ago', c: '#E2475D'},
  {kind: 'badge', x: -520, y: 120, d: 0.75, r: 0, at: 16, a: '12'},
  {kind: 'task', x: -300, y: 330, d: 0.6, r: 4, at: 18, a: 'Renew passport', b: 'Due tomorrow'},
  {kind: 'event', x: 420, y: 330, d: 0.65, r: -5, at: 22, a: 'Gym?', b: '18:00 · Maybe', c: '#3FAE6E'},
  {kind: 'banner', x: -360, y: 600, d: 1.1, r: -3, at: 24, a: 'Team chat', b: '23 new messages in #launch', c: '#8E6CE8'},
  {kind: 'bubble', x: 350, y: 640, d: 0.9, r: -2, at: 28, a: '“can you send it tonight?”'},
  {kind: 'badge', x: 120, y: 520, d: 1.2, r: 0, at: 30, a: '7'},
  {kind: 'task', x: 240, y: 860, d: 0.7, r: 6, at: 32, a: 'File taxes', b: 'Overdue'},
  {kind: 'event', x: -430, y: 860, d: 0.85, r: 3, at: 36, a: 'Dinner', b: '19:30 · Clash', c: '#F7B32B'},
  {kind: 'banner', x: 60, y: -880, d: 0.95, r: 2, at: 38, a: 'Bank', b: 'Rent is due tomorrow', c: '#3FAE6E'},
  {kind: 'badge', x: -80, y: 780, d: 0.6, r: 0, at: 40, a: '31'},
  {kind: 'task', x: 470, y: -80, d: 0.55, r: -8, at: 42, a: 'Call plumber', b: 'Overdue · 1 week'},
  {kind: 'bubble', x: -520, y: -720, d: 0.65, r: -3, at: 46, a: '“did you see my email?”'},
  {kind: 'event', x: 40, y: -230, d: 0.5, r: -2, at: 48, a: 'Client call', b: '15:00 · Moved', c: '#5B8DEF'},
  {kind: 'banner', x: 330, y: 960, d: 0.6, r: 4, at: 52, a: 'Calendar', b: '3 events overlap at 2 PM', c: '#F7B32B'},
];

const COLLAPSE = 108;

const Body: React.FC<{it: Item}> = ({it}) => {
  const glass: React.CSSProperties = {
    background: 'rgba(40,37,34,0.78)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
    color: '#F2EEE8',
    fontFamily: UI,
  };
  switch (it.kind) {
    case 'banner':
      return (
        <div style={{...glass, width: 560, padding: '22px 26px', borderRadius: 36, display: 'flex', gap: 18, alignItems: 'center'}}>
          <div style={{width: 62, height: 62, borderRadius: 16, background: it.c, flexShrink: 0}} />
          <div style={{flex: 1}}>
            <div style={{display: 'flex', fontSize: 25, fontWeight: 600}}>
              {it.a}
              <span style={{marginLeft: 'auto', fontWeight: 400, color: '#9A938A', fontSize: 21}}>now</span>
            </div>
            <div style={{fontSize: 24, color: '#BDB6AC', marginTop: 3}}>{it.b}</div>
          </div>
        </div>
      );
    case 'badge':
      return (
        <div style={{minWidth: 92, height: 92, padding: '0 22px', borderRadius: 46, background: '#E5484D', color: '#fff', fontSize: 40, fontWeight: 700, fontFamily: UI, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: '0 16px 40px rgba(229,72,77,0.45)'}}>
          {it.a}
        </div>
      );
    case 'event':
      return (
        <div style={{...glass, width: 330, padding: '20px 24px', borderRadius: 22, background: `${it.c}40`, borderLeft: `8px solid ${it.c}`}}>
          <div style={{fontSize: 28, fontWeight: 600}}>{it.a}</div>
          <div style={{fontSize: 22, color: '#D6CFC5', marginTop: 6}}>{it.b}</div>
        </div>
      );
    case 'task':
      return (
        <div style={{...glass, width: 400, padding: '22px 26px', borderRadius: 24, display: 'flex', gap: 18, alignItems: 'center'}}>
          <div style={{width: 32, height: 32, borderRadius: 9, border: '3px solid #6E6860', flexShrink: 0}} />
          <div>
            <div style={{fontSize: 28, fontWeight: 600}}>{it.a}</div>
            <div style={{fontSize: 22, color: '#F07A6E', fontWeight: 600, marginTop: 4}}>{it.b}</div>
          </div>
        </div>
      );
    case 'bubble':
      return (
        <div style={{...glass, padding: '20px 28px', borderRadius: 30, borderBottomLeftRadius: 8, fontSize: 26, color: '#E9E4DC', whiteSpace: 'nowrap'}}>{it.a}</div>
      );
  }
};

export const ChaosField: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 146) return null;
  const dolly = 1.04 + (frame / 140) * 0.42;
  const collapse = prog(frame, COLLAPSE, 30, easeInOut);
  const cx = 540;
  const cy = 960;
  const tension = prog(frame, 20, 80);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {/* keep the kinetic titles legible over the clutter */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 560,
          height: 720,
          background: 'radial-gradient(60% 50% at 50% 50%, rgba(11,10,9,0.85) 0%, rgba(11,10,9,0) 100%)',
          zIndex: 5,
          opacity: 1 - collapse,
        }}
      />
      {[...ITEMS]
        .sort((a, b) => a.d - b.d)
        .map((it, i) => {
          // everything lands within the first ~20 frames so frame 0 already hooks
          const at = it.at * 0.35 - 12;
          if (frame < at) return null;
          const p = pop(frame, at, 11);
          const s = it.d * dolly * (1 - collapse * 0.9);
          const drift = Math.sin(frame * 0.05 + i) * 14 * it.d;
          const jitter = Math.sin(frame * 0.9 + i * 2.1) * 3 * tension * it.d;
          const x = cx + (it.x * dolly + drift) * (1 - collapse) + jitter;
          const y = cy + (it.y * dolly + drift * 0.6) * (1 - collapse) + jitter;
          const focus = Math.abs(it.d - 0.95);
          const blur = focus * 9 + collapse * 14;
          const rot = it.r * (1 + tension * 0.3) + collapse * (i % 2 ? 30 : -30);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * (0.7 + 0.3 * p)})`,
                opacity: Math.min(1, p * 1.5) * (0.55 + 0.45 * Math.min(1, it.d)) * (1 - prog(frame, COLLAPSE + 12, 16)),
                filter: `blur(${blur.toFixed(1)}px)`,
              }}
            >
              <Body it={it} />
            </div>
          );
        })}
    </div>
  );
};
