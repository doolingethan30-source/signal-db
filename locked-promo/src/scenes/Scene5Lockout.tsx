import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Padlock} from '../components/Icons';
import {HomeScreen, Phone} from '../components/Phone';
import {content} from '../content';
import {colors, SLAM, SMOOTH, SNAP} from '../theme';
import {PUSH_END} from './Scene4Home';

const FILL_START = 4;
const DEFAULT_CUT = 60; // phone → full-screen lockout

export const Scene5Lockout: React.FC<{duration: number; cut?: number}> = ({duration, cut = DEFAULT_CUT}) => {
  const CUT = cut;
  const FILL_FRAMES = CUT - 16;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hs = content.homeScreen;
  const lk = content.lockout;

  // Ring fills the rest of the way to 100%
  const fill = spring({frame: frame - FILL_START, fps, config: {damping: 200, stiffness: 70}, durationInFrames: FILL_FRAMES});
  const used = interpolate(fill, [0, 1], [hs.usedMinutes, hs.limitMinutes]);
  const hit = frame >= FILL_START + FILL_FRAMES - 4 ? 1 : 0;

  // Continue the push-in, then a fast zoom "into" the screen
  const push = interpolate(frame, [0, CUT], [PUSH_END, PUSH_END + 0.04], {extrapolateRight: 'clamp'});
  const dive = spring({frame: frame - CUT, fps, config: SNAP, durationInFrames: 12});
  const phoneScale = push * interpolate(dive, [0, 1], [1, 2.6]);
  const phoneOpacity = interpolate(dive, [0, 0.7], [1, 0], {extrapolateRight: 'clamp'});
  const glow = interpolate(frame, [FILL_START + FILL_FRAMES - 4, CUT], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Lockout screen
  const lockIn = spring({frame: frame - CUT - 2, fps, config: SNAP, durationInFrames: 14});
  const shackle = spring({frame: frame - CUT - 12, fps, config: SLAM, durationInFrames: 7});
  const shackleHit = frame - CUT - 19;
  const thud = shackleHit >= 0 && shackleHit < 8 ? Math.sin(shackleHit * 3) * 8 * (1 - shackleHit / 8) : 0;
  const title = spring({frame: frame - CUT - 20, fps, config: SLAM, durationInFrames: 8});
  const msg = spring({frame: frame - CUT - 30, fps, config: SMOOTH, durationInFrames: 20});
  const code = spring({frame: frame - CUT - 40, fps, config: SMOOTH, durationInFrames: 20});
  const cursorOn = Math.floor(frame / 9) % 2 === 0;
  const settle = interpolate(frame, [CUT, duration], [1.08, 1.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      {/* Phone (pre-cut) */}
      {phoneOpacity > 0 ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: phoneOpacity}}>
          <div style={{transform: `scale(${phoneScale})`, filter: `drop-shadow(0 0 ${glow * 80}px rgba(245,217,10,${glow * 0.35}))`}}>
            <Phone>
              <HomeScreen usedMinutes={used} limitHit={hit} />
            </Phone>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Full-screen lockout */}
      {frame >= CUT ? (
        <AbsoluteFill
          style={{
            opacity: lockIn,
            transform: `scale(${interpolate(lockIn, [0, 1], [1.12, 1]) * settle}) translateY(${thud}px)`,
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(60% 40% at 50% 38%, rgba(245,217,10,0.08) 0%, rgba(11,11,12,0) 70%)',
          }}
        >
          <Padlock size={220} closed={shackle} color={colors.white} accent={colors.bg} />
          <div
            style={{
              marginTop: 70,
              color: colors.white,
              fontSize: 168,
              fontWeight: 900,
              letterSpacing: '0.16em',
              marginRight: '-0.16em',
              lineHeight: 1,
              opacity: title > 0.01 ? 1 : 0,
              transform: `scale(${interpolate(title, [0, 1], [1.5, 1])})`,
            }}
          >
            {lk.title}
          </div>
          <div
            style={{
              marginTop: 48,
              color: colors.silver,
              fontSize: 46,
              fontWeight: 600,
              lineHeight: 1.3,
              textAlign: 'center',
              maxWidth: 860,
              textWrap: 'balance',
              opacity: msg,
              transform: `translateY(${(1 - msg) * 24}px)`,
            }}
          >
            {lk.message}
          </div>

          <div style={{marginTop: 90, opacity: code, transform: `translateY(${(1 - code) * 24}px)`, textAlign: 'center'}}>
            <div style={{color: colors.grey, fontSize: 26, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase'}}>
              {lk.codeLabel}
            </div>
            <div style={{display: 'flex', gap: 20, marginTop: 28}}>
              {Array.from({length: lk.codeLength}).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 116,
                    height: 148,
                    borderRadius: 24,
                    background: colors.bgRaised,
                    border: `2px solid ${i === 0 ? colors.yellow : 'rgba(201,204,209,0.18)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {i === 0 ? (
                    <span style={{width: 5, height: 64, background: colors.yellow, opacity: cursorOn ? 1 : 0}} />
                  ) : (
                    <span style={{width: 18, height: 18, borderRadius: 9, background: 'rgba(107,111,118,0.5)'}} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
