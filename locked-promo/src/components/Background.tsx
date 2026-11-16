import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

/** Matte black with a soft top light and a vignette. */
export const MatteBackground: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.bg,
      backgroundImage:
        'radial-gradient(120% 70% at 50% 35%, rgba(201,204,209,0.06) 0%, rgba(11,11,12,0) 60%)',
    }}
  />
);

/** Animated film grain + vignette, laid over everything. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => {
  const frame = useCurrentFrame();
  // New grain pattern every 2 frames reads like real film noise.
  const seed = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" style={{position: 'absolute', opacity, mixBlendMode: 'screen'}}>
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
