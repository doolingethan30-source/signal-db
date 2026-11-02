import {Check} from '../components/Icons';
import {Ring} from '../components/Ring';
import {Theme, UI} from './theme';

export const ThemedRing: React.FC<{t: Theme; size: number; stroke?: number; value: number; children?: React.ReactNode}> = ({
  t,
  size,
  stroke,
  value,
  children,
}) => (
  <Ring size={size} stroke={stroke} value={value} color={t.accent} track={t.track}>
    {children}
  </Ring>
);

export const Box: React.FC<{t: Theme; size?: number; done: number}> = ({t, size = 22, done}) => {
  const on = done > 0.05;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        border: on ? 'none' : `1.7px solid ${t.sub}`,
        background: on ? t.accent : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        transform: `scale(${1 + Math.sin(Math.min(done, 1) * Math.PI) * 0.22})`,
      }}
    >
      {on && <Check size={size * 0.68} progress={Math.min(1, done * 1.4)} />}
    </div>
  );
};

export const cardStyle = (t: Theme, radius = 18): React.CSSProperties => ({
  background: t.card,
  border: `1px solid ${t.cardBorder}`,
  boxShadow: t.shadow,
  backdropFilter: t.blur,
  WebkitBackdropFilter: t.blur,
  borderRadius: radius,
  boxSizing: 'border-box',
});

/** Soft colour fields behind the UI, revealed by the frosted-glass theme. */
export const Blobs: React.FC<{t: Theme; drift?: number}> = ({t, drift = 0}) => {
  if (t.blobs < 0.01) return null;
  const d = t.dark;
  return (
    <div style={{position: 'absolute', inset: -40, opacity: t.blobs, overflow: 'hidden'}}>
      {[
        {x: -40 + drift * 20, y: 40, s: 330, c: d > 0.5 ? '#8A3E1C' : '#F2A272'},
        {x: 200 - drift * 30, y: 300, s: 300, c: '#E07A3F'},
        {x: 0 + drift * 25, y: 560, s: 320, c: d > 0.5 ? '#4B356E' : '#C9A7E8'},
        {x: 230, y: -40 + drift * 20, s: 230, c: d > 0.5 ? '#6A3A20' : '#F6D2A6'},
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            borderRadius: '50%',
            background: b.c,
            filter: 'blur(48px)',
            opacity: i === 1 ? 0.8 : 0.9,
          }}
        />
      ))}
    </div>
  );
};

export const Status: React.FC<{t: Theme; color?: string}> = ({t, color}) => {
  const c = color ?? t.ink;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 34px 0 46px',
        boxSizing: 'border-box',
        color: c,
        fontFamily: UI,
        fontWeight: 600,
        fontSize: 16,
        zIndex: 20,
      }}
    >
      <span>9:41</span>
      <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
        <svg width="18" height="11" viewBox="0 0 18 11">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.8} y={8 - i * 2.6} width="3" height={3 + i * 2.6} rx="0.8" fill={c} />
          ))}
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 12">
          <path d="M8 11 L5.6 8.4 A3.4 3.4 0 0 1 10.4 8.4 Z" fill={c} />
          <path d="M3.6 6.4 A6.2 6.2 0 0 1 12.4 6.4 M1.2 3.9 A9.6 9.6 0 0 1 14.8 3.9" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" stroke={c} strokeOpacity="0.45" fill="none" />
          <rect x="2.2" y="2.2" width="16" height="7.6" rx="1.8" fill={c} />
        </svg>
      </div>
    </div>
  );
};

const TabIcon: React.FC<{name: string; color: string; bg: string}> = ({name, color, bg}) => {
  switch (name) {
    case 'Week':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" fill={color} />
          <path d="M3.5 10 H20.5" stroke={bg} strokeWidth="1.4" />
          <path d="M8 3 V6.5 M16 3 V6.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'Calendar':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" />
          <path d="M3.5 10 H20.5 M8 3 V6.5 M16 3 V6.5" strokeLinecap="round" />
        </svg>
      );
    case 'Stats':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" stroke={color} strokeWidth="1.9" strokeLinecap="round">
          <path d="M6 20 V13 M12 20 V5 M18 20 V10" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
          <circle cx="12" cy="12" r="3.2" />
          <circle cx="12" cy="12" r="8" strokeDasharray="3 2.2" />
        </svg>
      );
  }
};

export const Tabs: React.FC<{t: Theme; active?: string}> = ({t, active = 'Week'}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 90,
      background: t.glass > 0.3 ? 'rgba(255,255,255,0.0)' : t.bg,
      borderTop: `1px solid ${t.line}`,
      display: 'flex',
      justifyContent: 'space-around',
      paddingTop: 10,
      boxSizing: 'border-box',
      fontFamily: UI,
      zIndex: 10,
      backdropFilter: 'blur(20px)',
    }}
  >
    {['Week', 'Calendar', 'Stats', 'Settings'].map((name) => {
      const color = name === active ? t.accent : t.sub;
      return (
        <div key={name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 70}}>
          <TabIcon name={name} color={color} bg={t.bg} />
          <span style={{fontSize: 11, color, fontWeight: name === active ? 600 : 500}}>{name}</span>
        </div>
      );
    })}
  </div>
);

/** Subtle touch ripple (no hands): presses in, then releases outward. */
export const Touch: React.FC<{f: number; at: number; x: number; y: number; t: Theme}> = ({f, at, x, y, t}) => {
  const k = f - at;
  if (k < -5 || k > 18) return null;
  const down = Math.min(1, Math.max(0, (k + 5) / 5));
  const up = Math.max(0, k / 18);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 24,
        top: y - 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        background: t.dark > 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(224,122,63,0.20)',
        border: `1.5px solid ${t.dark > 0.5 ? 'rgba(255,255,255,0.5)' : 'rgba(224,122,63,0.5)'}`,
        transform: `scale(${0.6 + down * 0.4 + up * 0.5})`,
        opacity: down * (1 - up),
        zIndex: 50,
        pointerEvents: 'none',
      }}
    />
  );
};
