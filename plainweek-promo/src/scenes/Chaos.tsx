import {interpolate, useCurrentFrame} from 'remotion';
import {easeInOut, pop, prog} from '../anim';
import {C, SANS, SERIF} from '../theme';

type Item = {
  kind: 'banner' | 'sticky' | 'task' | 'badge' | 'event';
  x: number;
  y: number;
  r: number;
  at: number;
  title?: string;
  body?: string;
  color?: string;
};

const ITEMS: Item[] = [
  {kind: 'event', x: 90, y: 560, r: -6, at: 2, title: 'Stand-up', body: '9:00 – 9:30', color: '#D9C9E6'},
  {kind: 'event', x: 330, y: 610, r: 4, at: 4, title: 'Design review', body: '9:15 – 10:00 · conflict', color: '#F2C9BF'},
  {kind: 'sticky', x: 780, y: 560, r: 7, at: 6, title: 'call plumber!!'},
  {kind: 'task', x: 120, y: 900, r: -3, at: 10, title: 'Q4 deck', body: 'Overdue · 3 days'},
  {kind: 'banner', x: 60, y: 420, r: -2, at: 12, title: 'Mail', body: '47 unread messages', color: '#8FB0D6'},
  {kind: 'badge', x: 880, y: 430, r: 0, at: 14, title: '99+'},
  {kind: 'sticky', x: 120, y: 1240, r: -9, at: 16, title: 'gym?? tues or thurs'},
  {kind: 'task', x: 640, y: 980, r: 5, at: 20, title: 'Renew passport', body: 'Due tomorrow'},
  {kind: 'banner', x: 380, y: 760, r: 3, at: 22, title: 'Reminder', body: 'Dentist at 2:30 — 15 min ago', color: '#E5A39A'},
  {kind: 'event', x: 720, y: 1620, r: -5, at: 26, title: 'Dinner?', body: '7:30 – ??', color: '#CFE0C7'},
  {kind: 'badge', x: 120, y: 760, r: 0, at: 28, title: '12'},
  {kind: 'sticky', x: 800, y: 1300, r: 6, at: 30, title: 'buy milk + eggs'},
  {kind: 'banner', x: 100, y: 1460, r: -4, at: 34, title: 'Calendar', body: '3 events overlap this afternoon', color: '#E3B87F'},
  {kind: 'task', x: 300, y: 1680, r: 2, at: 38, title: 'File taxes', body: 'Overdue'},
  {kind: 'badge', x: 960, y: 1180, r: 0, at: 40, title: '7'},
  {kind: 'banner', x: 480, y: 1180, r: 5, at: 44, title: 'Team chat', body: '23 new messages in #launch', color: '#B6A6D3'},
  {kind: 'sticky', x: 40, y: 1040, r: 10, at: 48, title: 'mum bday sat!!'},
  {kind: 'banner', x: 440, y: 1420, r: -3, at: 52, title: 'Bank', body: 'Rent is due tomorrow', color: '#9DC2A6'},
  {kind: 'task', x: 660, y: 800, r: -7, at: 56, title: 'Reply to landlord', body: 'Overdue · 1 week'},
  {kind: 'badge', x: 960, y: 1500, r: 0, at: 58, title: '31'},
  {kind: 'banner', x: 380, y: 1780, r: 2, at: 62, title: 'Reminder', body: 'You missed: Water plants', color: '#E5A39A'},
];

const CENTER = {x: 540, y: 1130};
const COLLAPSE = 76;

const Body: React.FC<{item: Item}> = ({item}) => {
  switch (item.kind) {
    case 'banner':
      return (
        <div
          style={{
            width: 560,
            padding: '20px 24px',
            borderRadius: 34,
            background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 18px 40px rgba(42,41,39,0.16)',
            display: 'flex',
            gap: 18,
            alignItems: 'center',
          }}
        >
          <div style={{width: 64, height: 64, borderRadius: 16, background: item.color, flexShrink: 0}} />
          <div style={{flex: 1}}>
            <div style={{display: 'flex', fontSize: 24, fontWeight: 600}}>
              {item.title}
              <span style={{marginLeft: 'auto', fontWeight: 400, color: C.mute, fontSize: 21}}>now</span>
            </div>
            <div style={{fontSize: 24, color: C.inkSoft, marginTop: 2}}>{item.body}</div>
          </div>
        </div>
      );
    case 'sticky':
      return (
        <div
          style={{
            width: 240,
            height: 230,
            background: '#F3E6B4',
            boxShadow: '0 16px 30px rgba(80,64,20,0.18)',
            padding: 26,
            boxSizing: 'border-box',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 42,
            lineHeight: '46px',
            color: '#4A4338',
          }}
        >
          {item.title}
        </div>
      );
    case 'task':
      return (
        <div
          style={{
            width: 380,
            padding: '22px 24px',
            borderRadius: 22,
            background: '#fff',
            boxShadow: '0 14px 30px rgba(42,41,39,0.14)',
            display: 'flex',
            gap: 18,
            alignItems: 'center',
          }}
        >
          <div style={{width: 32, height: 32, borderRadius: 16, border: '3px solid #D0C9BD', flexShrink: 0}} />
          <div>
            <div style={{fontSize: 28, fontWeight: 600}}>{item.title}</div>
            <div style={{fontSize: 21, color: C.alert, fontWeight: 600, marginTop: 4}}>{item.body}</div>
          </div>
        </div>
      );
    case 'badge':
      return (
        <div
          style={{
            minWidth: 86,
            height: 86,
            padding: '0 20px',
            borderRadius: 43,
            background: C.alert,
            color: '#fff',
            fontSize: 38,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            boxShadow: '0 10px 24px rgba(201,119,106,0.4)',
          }}
        >
          {item.title}
        </div>
      );
    case 'event':
      return (
        <div
          style={{
            width: 300,
            height: 150,
            borderRadius: 20,
            background: item.color,
            borderLeft: '8px solid rgba(42,41,39,0.25)',
            padding: '18px 22px',
            boxSizing: 'border-box',
            boxShadow: '0 12px 26px rgba(42,41,39,0.12)',
          }}
        >
          <div style={{fontSize: 28, fontWeight: 600}}>{item.title}</div>
          <div style={{fontSize: 22, color: C.inkSoft, marginTop: 6}}>{item.body}</div>
        </div>
      );
  }
};

export const Chaos: React.FC = () => {
  const frame = useCurrentFrame();
  const collapse = prog(frame, COLLAPSE, 26, easeInOut);
  const shake = interpolate(frame, [20, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: C.ink}}>
      {ITEMS.map((item, i) => {
        const p = pop(frame, item.at, 11);
        if (frame < item.at) return null;
        const jx = Math.sin(frame * 0.9 + i * 1.7) * 5 * shake + Math.sin(frame * 0.13 + i) * 12;
        const jy = Math.cos(frame * 1.1 + i * 2.3) * 4 * shake + Math.cos(frame * 0.11 + i) * 10;
        const dx = (CENTER.x - item.x - 150) * collapse;
        const dy = (CENTER.y - item.y - 60) * collapse;
        const s = (0.55 + 0.45 * p) * (1 - collapse * 0.85);
        const rot = item.r * (1 + shake * 0.4) + Math.sin(frame * 0.7 + i) * 1.5 * shake + collapse * (i % 2 ? 40 : -40);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              transform: `translate(${jx + dx}px, ${jy + dy}px) rotate(${rot}deg) scale(${s})`,
              transformOrigin: 'center',
              opacity: Math.min(1, p * 1.6) * (1 - prog(frame, COLLAPSE + 10, 16)),
              filter: `blur(${collapse * 10}px)`,
            }}
          >
            <Body item={item} />
          </div>
        );
      })}
    </div>
  );
};

/** Frames at which a chaos item lands — used for the notification ping SFX. */
export const CHAOS_PINGS = ITEMS.filter((i) => i.kind === 'banner' || i.kind === 'badge').map((i) => i.at);
