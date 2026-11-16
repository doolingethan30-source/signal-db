import React from 'react';
import {colors} from '../theme';

/**
 * The yellow "//" mark, drawn as two heavy slashes.
 * `progress` 0→1 draws the strokes in (first slash, then second).
 */
export const SlashMark: React.FC<{size?: number; progress?: number; color?: string}> = ({
  size = 120,
  progress = 1,
  color = colors.yellow,
}) => {
  const p1 = Math.min(1, Math.max(0, progress * 2));
  const p2 = Math.min(1, Math.max(0, progress * 2 - 1));
  const len = 112; // approx line length in viewBox units
  const line = (x: number, p: number) => (
    <line
      x1={x}
      y1={100}
      x2={x + 40}
      y2={0}
      stroke={color}
      strokeWidth={22}
      strokeLinecap="butt"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - p)}
    />
  );
  return (
    <svg width={size * 1.1} height={size} viewBox="-4 -2 112 104" style={{overflow: 'visible'}}>
      {line(6, p1)}
      {line(52, p2)}
    </svg>
  );
};

/** Static lockup: "//" + "L O C K E D" */
export const Lockup: React.FC<{size?: number; wordmark: string; spacing?: number}> = ({
  size = 40,
  wordmark,
  spacing = 0.42,
}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.45}}>
    <SlashMark size={size} />
    <span
      style={{
        color: colors.white,
        fontWeight: 900,
        fontSize: size * 0.95,
        letterSpacing: `${spacing}em`,
        marginRight: `-${spacing}em`,
        lineHeight: 1,
      }}
    >
      {wordmark}
    </span>
  </div>
);
