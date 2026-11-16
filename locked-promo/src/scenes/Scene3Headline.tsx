import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {content} from '../content';
import {colors, SLAM} from '../theme';

const STAGGER = 4;

export const Scene3Headline: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = content.scene3.headline.split(' ');
  const lastHit = (words.length - 1) * STAGGER + 2;

  // Impact shake when the final (accent) word lands. Decays fast.
  const sinceHit = frame - lastHit;
  const shake = sinceHit >= 0 && sinceHit < 10 ? Math.sin(sinceHit * 3.1) * 14 * (1 - sinceHit / 10) : 0;
  const push = interpolate(frame, [0, duration], [1, 1.05]);

  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: '0 90px'}}>
      <div
        style={{
          transform: `translate(${shake}px, ${shake * 0.4}px) scale(${push})`,
          transformOrigin: 'left center',
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: 30,
          rowGap: 4,
        }}
      >
        {words.map((w, i) => {
          const s = spring({frame: frame - i * STAGGER, fps, config: SLAM, durationInFrames: 8});
          const isAccent = w === content.scene3.accentWord;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: isAccent ? colors.yellow : colors.white,
                fontSize: 138,
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: '-0.05em',
                opacity: s > 0.01 ? 1 : 0,
                transform: `scale(${interpolate(s, [0, 1], [1.9, 1])})`,
                transformOrigin: 'left bottom',
                filter: `blur(${interpolate(s, [0, 1], [10, 0])}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 90,
          bottom: 360,
          height: 6,
          width: interpolate(frame, [lastHit + 4, lastHit + 18], [0, 180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          background: colors.yellow,
        }}
      />
    </AbsoluteFill>
  );
};
