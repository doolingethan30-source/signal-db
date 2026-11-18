import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SlashMark} from '../../components/LogoMark';
import {colors} from '../../theme';
import {CineText} from '../CineText';
import {campaign} from '../content';
import {CUES} from '../timing';

const LOGO = CUES.logoHit;
const LAUNCH = CUES.launch;

export const C6Brand: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = campaign.s6;

  const draw = spring({frame: frame - LOGO, fps, config: {damping: 200, stiffness: 70}, durationInFrames: 22});
  const word = spring({frame: frame - LOGO - 12, fps, config: {damping: 200, stiffness: 90}, durationInFrames: 26});
  const spacing = interpolate(word, [0, 1], [-0.06, 0.42]);
  const push = interpolate(frame, [0, duration], [1, 1.04]);
  const launch = spring({frame: frame - LAUNCH, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 26});
  // Warm morning light lingers at the top, then settles into black
  const warm = interpolate(frame, [0, 90], [0.28, 0.08], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{background: `radial-gradient(90% 50% at 50% 0%, rgba(255,214,150,${warm}) 0%, rgba(0,0,0,0) 70%)`}}
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${push})`}}>
        {/* Main lines */}
        <div style={{position: 'absolute', textAlign: 'center'}}>
          {s.main.map((line, i) => (
            <CineText key={line} text={line} start={6 + i * 30} end={LOGO - 14} size={92} weight={800} style={{marginTop: i ? 10 : 0}} />
          ))}
        </div>

        {/* Logo + supporting line */}
        <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 34, opacity: frame >= LOGO ? 1 : 0}}>
            <SlashMark size={104} progress={draw} />
            <span
              style={{
                color: colors.white,
                fontSize: 96,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: `${spacing}em`,
                marginRight: `${-spacing}em`,
                opacity: interpolate(word, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
                filter: `blur(${(1 - word) * 6}px)`,
              }}
            >
              {s.wordmark}
            </span>
          </div>
          <div style={{marginTop: 70, maxWidth: 820, textAlign: 'center'}}>
            <CineText text={s.supporting} start={LOGO + 30} size={40} weight={500} color={colors.silver} />
          </div>
        </div>
      </AbsoluteFill>

      {/* Launch line */}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 250}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            opacity: launch,
            filter: `blur(${(1 - launch) * 8}px)`,
            transform: `translateY(${(1 - launch) * 18}px)`,
          }}
        >
          <span style={{width: 12, height: 12, borderRadius: 6, background: colors.yellow}} />
          <span style={{color: colors.white, fontSize: 40, fontWeight: 600, letterSpacing: '-0.01em'}}>{s.launch}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
