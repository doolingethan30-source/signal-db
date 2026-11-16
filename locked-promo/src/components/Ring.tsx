import React from 'react';
import {colors} from '../theme';

export const Ring: React.FC<{
  size: number;
  stroke: number;
  progress: number; // 0..1
  color?: string;
  children?: React.ReactNode;
}> = ({size, stroke, progress, color = colors.yellow, children}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(201,204,209,0.10)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, Math.max(0, progress)))}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const formatMinutes = (m: number) => {
  const mins = Math.round(m);
  const h = Math.floor(mins / 60);
  const mm = mins % 60;
  return h > 0 ? `${h}h ${String(mm).padStart(2, '0')}m` : `${mm}m`;
};
