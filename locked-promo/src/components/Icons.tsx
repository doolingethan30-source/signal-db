import React from 'react';
import type {IconName} from '../content';

/** Generic glyphs, deliberately NOT any real app's logo. */
export const Glyph: React.FC<{name: IconName; size: number; color?: string}> = ({name, size, color = '#fff'}) => {
  const common = {width: size, height: size, viewBox: '0 0 24 24', fill: color};
  switch (name) {
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 20.5s-7.5-4.6-7.5-10.2C4.5 7.4 6.6 5.5 9 5.5c1.4 0 2.4.7 3 1.6.6-.9 1.6-1.6 3-1.6 2.4 0 4.5 1.9 4.5 4.8 0 5.6-7.5 10.2-7.5 10.2z" />
        </svg>
      );
    case 'play':
      return (
        <svg {...common}>
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...common}>
          <path d="M4 5h16v11H9l-5 4z" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm-2 15a2 2 0 0 0 4 0z" />
        </svg>
      );
    case 'camera':
      return (
        <svg {...common}>
          <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
          <circle cx="12" cy="13" r="3.4" fill="rgba(0,0,0,0.35)" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 5 14h6l-1 8 8-12h-6z" />
        </svg>
      );
  }
};

/** Padlock. `closed` 0→1 drops the shackle into place. */
export const Padlock: React.FC<{size: number; closed?: number; color?: string; accent?: string}> = ({
  size,
  closed = 1,
  color = '#FFFFFF',
  accent = '#0B0B0C',
}) => {
  const lift = (1 - closed) * 26;
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{overflow: 'visible'}}>
      <path
        d="M27 56V36a23 23 0 0 1 46 0v20"
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="butt"
        transform={`translate(0 ${-lift})`}
      />
      <rect x={12} y={52} width={76} height={62} rx={12} fill={color} />
      <circle cx={50} cy={78} r={8} fill={accent} />
      <rect x={46} y={80} width={8} height={18} rx={3} fill={accent} />
    </svg>
  );
};
