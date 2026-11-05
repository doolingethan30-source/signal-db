import {Check} from '../components/Icons';
import {ACCENT, FAMILY, Member, STAR} from './theme';

export const Avatar: React.FC<{m: Member; size?: number; ring?: number; glow?: number}> = ({m, size = 40, ring, glow = 0}) => {
  const inner = (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: `linear-gradient(145deg, ${m.color}DD, ${m.color})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: glow ? `0 0 ${24 * glow}px ${8 * glow}px ${m.color}55` : 'none',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {m.initial}
    </div>
  );
  if (ring === undefined) return inner;
  const s = size + 12;
  const r = (s - 4) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{position: 'relative', width: s, height: s, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={s} height={s} style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}>
        <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke="#E8E2D9" strokeWidth={3.5} />
        <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke={m.color} strokeWidth={3.5} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, ring))} />
      </svg>
      {inner}
    </div>
  );
};

export const Star: React.FC<{size?: number; color?: string}> = ({size = 16, color = STAR}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2.6l2.8 6.1 6.6.7-5 4.5 1.4 6.5L12 17.1l-5.8 3.3 1.4-6.5-5-4.5 6.6-.7z" fill={color} strokeLinejoin="round" />
  </svg>
);

export const RoundCheck: React.FC<{size?: number; done: number; color?: string}> = ({size = 24, done, color = ACCENT}) => {
  const on = done > 0.05;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        border: on ? 'none' : '1.8px solid #C9C1B6',
        background: on ? color : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        transform: `scale(${1 + Math.sin(Math.min(done, 1) * Math.PI) * 0.25})`,
      }}
    >
      {on && <Check size={size * 0.62} progress={Math.min(1, done * 1.4)} />}
    </div>
  );
};

export const ProPill: React.FC = () => (
  <span style={{fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, color: ACCENT, background: '#FBE7DA', padding: '3px 8px', borderRadius: 8}}>PRO</span>
);

export const FamilyRow: React.FC<{size?: number; gap?: number}> = ({size = 30, gap = -8}) => (
  <div style={{display: 'flex'}}>
    {FAMILY.map((m, i) => (
      <div key={m.id} style={{marginLeft: i ? gap : 0, border: '2.5px solid #fff', borderRadius: '50%'}}>
        <Avatar m={m} size={size} />
      </div>
    ))}
  </div>
);
