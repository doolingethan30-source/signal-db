import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../theme';

/** Minimal cinematic text: fades up out of a soft blur. Optional exit. */
export const CineText: React.FC<{
  text: string;
  start: number;
  end?: number;
  size?: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({text, start, end, size = 72, weight = 700, color = colors.white, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame: frame - start, fps, config: {damping: 200, stiffness: 50}, durationInFrames: 34});
  const outP = end === undefined ? 0 : spring({frame: frame - end, fps, config: {damping: 200}, durationInFrames: 16});
  const p = inP * (1 - outP);
  return (
    <div
      style={{
        color,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.12,
        letterSpacing: `${interpolate(inP, [0, 1], [0.04, -0.025])}em`,
        opacity: p,
        filter: `blur(${(1 - p) * 12}px)`,
        transform: `translateY(${(1 - inP) * 26}px)`,
        textWrap: 'balance',
        textShadow: '0 4px 40px rgba(0,0,0,0.6)',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
