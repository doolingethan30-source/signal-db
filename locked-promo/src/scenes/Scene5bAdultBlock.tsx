import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShieldBlock} from '../components/Icons';
import {Lockup} from '../components/LogoMark';
import {Phone, PHONE_H, PHONE_W} from '../components/Phone';
import {content} from '../content';
import {colors, SLAM, SMOOTH, SNAP} from '../theme';

/**
 * Scene 5B: adult content blocking.
 * A hidden URL is typed in a browser → LOCKED block page slams in →
 * headline "Blocks all adult content." The URL is shown only as blurred
 * masked blocks, so nothing explicit is ever on screen.
 */
const PHONE_SCALE = 0.72;
const TYPE_START = 6;
const TYPE_EVERY = 3;
const MASK = [34, 22, 40, 28, 18, 36, 26, 30, 20]; // widths of the masked "characters"
const LOAD_START = TYPE_START + MASK.length * TYPE_EVERY + 2; // ≈ 35
const BLOCK_AT = LOAD_START + 9; // ≈ 44
const HEAD_AT = BLOCK_AT + 14;

export const Scene5bAdultBlock: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ab = content.adultBlock;

  const enter = spring({frame, fps, config: SMOOTH, durationInFrames: 24});
  const push = interpolate(frame, [0, duration], [1, 1.035]);
  const typed = Math.max(0, Math.min(MASK.length, Math.floor((frame - TYPE_START) / TYPE_EVERY) + 1));
  const load = interpolate(frame, [LOAD_START, BLOCK_AT], [0, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const block = spring({frame: frame - BLOCK_AT, fps, config: SNAP, durationInFrames: 10});
  const slash = spring({frame: frame - BLOCK_AT - 6, fps, config: SLAM, durationInFrames: 8});
  const sinceHit = frame - BLOCK_AT - 12;
  const thud = sinceHit >= 0 && sinceHit < 9 ? Math.sin(sinceHit * 3) * 9 * (1 - sinceHit / 9) : 0;
  const blockText = spring({frame: frame - BLOCK_AT - 10, fps, config: SMOOTH, durationInFrames: 16});

  const words = ab.headline.split(' ');
  const accentWords = ab.accentWord.split(' ');
  const sub = spring({frame: frame - HEAD_AT - 14, fps, config: SMOOTH, durationInFrames: 18});

  return (
    <AbsoluteFill>
      {/* Phone */}
      <div
        style={{
          position: 'absolute',
          top: 110,
          left: '50%',
          width: PHONE_W,
          height: PHONE_H,
          marginLeft: -PHONE_W / 2,
          transformOrigin: 'top center',
          transform: `translateY(${(1 - enter) * 120 + thud}px) scale(${PHONE_SCALE * push})`,
        }}
      >
        <Phone>
          {/* Browser */}
          <div style={{position: 'absolute', inset: 0, padding: '120px 32px 0'}}>
            <div
              style={{
                height: 92,
                borderRadius: 26,
                background: '#1C1D20',
                display: 'flex',
                alignItems: 'center',
                padding: '0 30px',
                gap: 10,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {typed === 0 ? (
                <span style={{color: colors.grey, fontSize: 30, fontWeight: 500}}>{ab.browserPlaceholder}</span>
              ) : (
                MASK.slice(0, typed).map((w, i) => (
                  <span
                    key={i}
                    style={{width: w, height: 30, borderRadius: 7, background: colors.silver, filter: 'blur(3px)', opacity: 0.85}}
                  />
                ))
              )}
              {typed > 0 && typed < MASK.length ? (
                <span style={{width: 4, height: 42, background: colors.yellow, marginLeft: 4}} />
              ) : null}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: 5,
                  width: `${load * 100}%`,
                  background: colors.silver,
                  opacity: load > 0 ? 1 : 0,
                }}
              />
            </div>
            {/* Blurred page skeleton */}
            <div style={{marginTop: 40, filter: 'blur(14px)', opacity: 0.5}}>
              {[1, 0.7, 0.85, 0.6].map((w, i) => (
                <div
                  key={i}
                  style={{height: i === 0 ? 420 : 46, width: `${w * 100}%`, borderRadius: 24, background: '#2A2B2F', marginBottom: 26}}
                />
              ))}
            </div>
          </div>

          {/* Block page */}
          {frame >= BLOCK_AT ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#0A0A0B',
                opacity: block,
                transform: `scale(${interpolate(block, [0, 1], [1.08, 1])})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 60px',
                textAlign: 'center',
              }}
            >
              <div style={{filter: `drop-shadow(0 0 60px rgba(245,217,10,${0.25 * slash}))`}}>
                <ShieldBlock size={220} slash={slash} color={colors.white} accent="#0A0A0B" />
              </div>
              <div
                style={{
                  marginTop: 50,
                  color: colors.white,
                  fontSize: 96,
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                {ab.blockedTitle}
              </div>
              <div style={{opacity: blockText, transform: `translateY(${(1 - blockText) * 16}px)`}}>
                <div style={{marginTop: 30, color: colors.silver, fontSize: 46, fontWeight: 600, lineHeight: 1.3, textWrap: 'balance'}}>
                  {ab.blockedMessage}
                </div>
                <div style={{marginTop: 20, color: colors.grey, fontSize: 36, fontWeight: 500}}>{ab.blockedSub}</div>
              </div>
              <div style={{position: 'absolute', bottom: 90, opacity: blockText}}>
                <Lockup size={30} wordmark={content.brand.wordmark} spacing={0.36} />
              </div>
            </div>
          ) : null}
        </Phone>
      </div>

      {/* Headline under the phone */}
      <div style={{position: 'absolute', top: 110 + PHONE_H * PHONE_SCALE + 70, left: 90, right: 90}}>
        <div style={{display: 'flex', flexWrap: 'wrap', columnGap: 24, rowGap: 0}}>
          {words.map((w, i) => {
            const s = spring({frame: frame - HEAD_AT - i * 3, fps, config: SLAM, durationInFrames: 8});
            const isAccent = accentWords.includes(w);
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  color: isAccent ? colors.yellow : colors.white,
                  fontSize: 104,
                  fontWeight: 900,
                  lineHeight: 1.02,
                  letterSpacing: '-0.045em',
                  opacity: s > 0.01 ? 1 : 0,
                  transform: `scale(${interpolate(s, [0, 1], [1.7, 1])})`,
                  transformOrigin: 'left bottom',
                  filter: `blur(${interpolate(s, [0, 1], [8, 0])}px)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 26,
            color: colors.silver,
            fontSize: 46,
            fontWeight: 600,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 18}px)`,
          }}
        >
          {ab.subline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
