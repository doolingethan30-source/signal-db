import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {content} from '../content';
import {colors} from '../theme';

/** Frame (within scene 1) where the phone-buzz SFX cue fires. */
export const BUZZ_FRAME = 58;

const TYPE_START = 6;
const CHARS_PER_FRAME = 0.95;

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {line, accent} = content.scene1;

  const typed = Math.max(0, Math.min(line.length, Math.floor((frame - TYPE_START) * CHARS_PER_FRAME)));
  const doneTyping = typed >= line.length;
  const cursorOn = !doneTyping || Math.floor(frame / 8) % 2 === 0;

  // Buzz: short, tight horizontal shake (phone vibrating on a desk).
  const b = frame - BUZZ_FRAME;
  const buzzing = (b >= 0 && b < 7) || (b >= 13 && b < 20);
  const shakeX = buzzing ? Math.sin(frame * 2.7) * 7 : 0;
  const buzzRing = interpolate(b, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const aStart = line.indexOf(accent);
  const aEnd = aStart + accent.length;
  const chars = line.slice(0, typed).split('');

  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: '0 96px'}}>
      <div
        style={{
          color: colors.white,
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {chars.map((c, i) => (
          <span key={i} style={{color: aStart >= 0 && i >= aStart && i < aEnd ? colors.yellow : colors.white}}>
            {c}
          </span>
        ))}
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 84,
            marginLeft: 8,
            transform: 'translateY(12px)',
            background: colors.yellow,
            opacity: cursorOn ? 1 : 0,
          }}
        />
      </div>

      {/* Visual buzz cue: subtle haptic marks + label */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          bottom: 300,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: b >= 0 ? interpolate(b, [0, 4, 26, 32], [0, 1, 1, 0.55], {extrapolateRight: 'clamp'}) : 0,
          transform: `translateX(${shakeX * 0.6}px)`,
        }}
      >
        <span style={{display: 'flex', gap: 6}}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 5,
                height: 26 + i * 10,
                borderRadius: 3,
                background: colors.grey,
                opacity: interpolate(buzzRing, [i * 0.2, i * 0.2 + 0.3], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            />
          ))}
        </span>
        <span style={{color: colors.grey, fontSize: 30, fontWeight: 600, letterSpacing: '0.24em'}}>BZZZ</span>
      </div>
    </AbsoluteFill>
  );
};
