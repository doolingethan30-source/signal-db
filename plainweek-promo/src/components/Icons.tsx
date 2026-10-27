import {C} from '../theme';

export const Check: React.FC<{size?: number; color?: string; progress?: number}> = ({
  size = 12,
  color = '#fff',
  progress = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 12 12">
    <path
      d="M2.5 6.4 L5 8.8 L9.6 3.6"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={12}
      strokeDashoffset={12 * (1 - progress)}
    />
  </svg>
);

/** iOS-style round checkbox; `done` 0..1 animates the fill and tick. */
export const CheckCircle: React.FC<{size?: number; done: number; color?: string}> = ({
  size = 16,
  done,
  color = C.sage,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      border: `1.5px solid ${done > 0.05 ? color : '#CFC9BE'}`,
      background: done > 0.05 ? color : 'transparent',
      opacity: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transform: `scale(${1 + Math.sin(Math.min(done, 1) * Math.PI) * 0.18})`,
      boxSizing: 'border-box',
    }}
  >
    {done > 0.05 && <Check size={size * 0.72} progress={Math.min(1, done * 1.4)} />}
  </div>
);

export const Sparkle: React.FC<{size?: number; color?: string}> = ({size = 14, color = C.sageDeep}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2 C13 8 16 11 22 12 C16 13 13 16 12 22 C11 16 8 13 2 12 C8 11 11 8 12 2 Z"
      fill={color}
    />
  </svg>
);

export const CalendarIcon: React.FC<{size?: number; color?: string}> = ({size = 12, color = C.sageDeep}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={1.5}>
    <rect x="2" y="3" width="12" height="11" rx="2.5" />
    <path d="M2 6.5 H14 M5.5 1.5 V4 M10.5 1.5 V4" strokeLinecap="round" />
  </svg>
);

export const ClockIcon: React.FC<{size?: number; color?: string}> = ({size = 12, color = C.sageDeep}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={1.5}>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 4.8 V8 L10.2 9.4" strokeLinecap="round" />
  </svg>
);

export const TagIcon: React.FC<{size?: number; color?: string}> = ({size = 12, color = C.sageDeep}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={1.5}>
    <path d="M2 2.5 H8 L14 8.5 L8.5 14 L2.5 8 Z" strokeLinejoin="round" />
    <circle cx="5.3" cy="5.6" r="1" fill={color} />
  </svg>
);

export const Leaf: React.FC<{size?: number; color?: string}> = ({size = 14, color = C.sageDeep}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M20 4 C9 4 4 9 4 17 C4 18.5 4.3 19.6 4.6 20 C6 14 10 10.5 15 9 C11 11.5 8 15 7 20 C16 20 20 14 20 4 Z" fill={color} />
  </svg>
);

/** The Plainweek mark: a rounded square holding seven day-bars, the last one done. */
export const LogoMark: React.FC<{size?: number; fill?: number}> = ({size = 64, fill = 1}) => {
  const bars = [0.55, 0.8, 0.45, 0.9, 0.65, 0.35, 0.75];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect x="0" y="0" width="64" height="64" rx="16" fill={C.ink} />
      {bars.map((h, i) => {
        const bh = 30 * h * fill + 4;
        return (
          <rect
            key={i}
            x={11 + i * 6.3}
            y={47 - bh}
            width={3.6}
            height={bh}
            rx={1.8}
            fill={i === 3 ? '#FF5A1F' : '#F4F1EA'}
            opacity={i === 3 ? 1 : 0.9}
          />
        );
      })}
    </svg>
  );
};

/** Square, rounded checkbox used throughout the Plainweek app. */
export const CheckBox: React.FC<{size?: number; done: number}> = ({size = 24, done}) => {
  const on = done > 0.05;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        border: on ? 'none' : `1.6px solid #2A2927`,
        background: on ? '#FF5A1F' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        transform: `scale(${1 + Math.sin(Math.min(done, 1) * Math.PI) * 0.2})`,
      }}
    >
      {on && <Check size={size * 0.7} progress={Math.min(1, done * 1.4)} />}
    </div>
  );
};

export const Chevron: React.FC<{size?: number; color?: string; dir?: 'left' | 'right' | 'down'}> = ({
  size = 14,
  color = '#8C877F',
  dir = 'right',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    style={{transform: dir === 'left' ? 'rotate(180deg)' : dir === 'down' ? 'rotate(90deg)' : undefined}}
  >
    <path d="M6 3 L11 8 L6 13" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
