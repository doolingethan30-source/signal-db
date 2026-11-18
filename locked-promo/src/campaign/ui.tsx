import React from 'react';
import {colors} from '../theme';

export const Toggle: React.FC<{on: number}> = ({on}) => (
  <div
    style={{
      width: 96,
      height: 56,
      borderRadius: 28,
      background: on > 0.5 ? colors.white : '#2a2b2f',
      position: 'relative',
      flexShrink: 0,
      transition: 'none',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 5,
        left: 5 + on * 40,
        width: 46,
        height: 46,
        borderRadius: 23,
        background: on > 0.5 ? colors.bg : colors.grey,
      }}
    />
  </div>
);

export const ShieldCheck: React.FC<{size: number; color?: string; accent?: string}> = ({size, color = '#fff', accent = '#0B0B0C'}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
    <path d="M50 4 92 18v36c0 28-18 48-42 57C26 102 8 82 8 54V18z" fill={color} />
    <path d="M32 57 45 70 70 42" fill="none" stroke={accent} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Avatar: React.FC<{letter: string; size: number; light?: boolean}> = ({letter, size, light}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: light ? colors.white : '#24252a',
      color: light ? colors.bg : colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: size * 0.42,
      flexShrink: 0,
      border: light ? 'none' : '2px solid rgba(201,204,209,0.18)',
    }}
  >
    {letter}
  </div>
);

export const UICard: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: '#16171A', border: '1.5px solid rgba(201,204,209,0.10)', borderRadius: 36, ...style}}>{children}</div>
);
