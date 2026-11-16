import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {content} from '../content';
import {colors, SNAP} from '../theme';

const FIRST = 10;
const STAGGER = 34;

export const Scene6Features: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const features = content.scene6.features;

  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: '0 90px'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 86}}>
        {features.map((text, i) => {
          const start = FIRST + i * STAGGER;
          const mark = spring({frame: frame - start, fps, config: SNAP, durationInFrames: 10});
          const line = spring({frame: frame - start - 4, fps, config: SNAP, durationInFrames: 14});
          // Earlier lines dim slightly once the next one arrives, so focus stays on the newest.
          const next = spring({frame: frame - start - STAGGER, fps, config: SNAP, durationInFrames: 14});
          const dim = i < features.length - 1 ? interpolate(next, [0, 1], [1, 0.55]) : 1;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: 30, opacity: dim}}>
              <span
                style={{
                  color: colors.yellow,
                  fontSize: 78,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.06em',
                  opacity: mark,
                  transform: `translateX(${(1 - mark) * -80}px)`,
                  flexShrink: 0,
                }}
              >
                //
              </span>
              <span style={{overflow: 'hidden', display: 'block', paddingBottom: 6}}>
                <span
                  style={{
                    display: 'block',
                    color: colors.white,
                    fontSize: 78,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: '-0.035em',
                    opacity: line,
                    transform: `translateX(${(1 - line) * -140}px)`,
                  }}
                >
                  {text}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
