import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SlashMark} from '../components/LogoMark';
import {content} from '../content';
import {colors, SMOOTH, SNAP} from '../theme';

export const Scene7Logo: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 1) "//" draws in
  const draw = spring({frame: frame - 6, fps, config: SMOOTH, durationInFrames: 22});
  // 2) "L O C K E D" spaces out from tight to wide
  const word = spring({frame: frame - 24, fps, config: SNAP, durationInFrames: 22});
  const spacing = interpolate(word, [0, 1], [-0.08, 0.42]);
  // 3) tagline + CTA
  const tag = spring({frame: frame - 46, fps, config: SMOOTH, durationInFrames: 20});
  const cta = spring({frame: frame - 62, fps, config: SMOOTH, durationInFrames: 20});
  const push = interpolate(frame, [0, duration], [1.0, 1.04]);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{transform: `scale(${push})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <SlashMark size={108} progress={draw} />
          <span
            style={{
              color: colors.white,
              fontSize: 98,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: `${spacing}em`,
              marginRight: `${-spacing}em`,
              opacity: interpolate(word, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
              filter: `blur(${(1 - word) * 6}px)`,
            }}
          >
            {content.brand.wordmark}
          </span>
        </div>

        <div
          style={{
            marginTop: 90,
            color: colors.silver,
            fontSize: 44,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            opacity: tag,
            transform: `translateY(${(1 - tag) * 20}px)`,
          }}
        >
          {content.scene7.tagline}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 230,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          opacity: cta,
          transform: `translateY(${(1 - cta) * 16}px)`,
        }}
      >
        <span style={{width: 10, height: 10, borderRadius: 5, background: colors.yellow}} />
        <span style={{color: colors.grey, fontSize: 32, fontWeight: 600, letterSpacing: '0.02em'}}>
          {content.scene7.cta}
        </span>
      </div>
    </AbsoluteFill>
  );
};
