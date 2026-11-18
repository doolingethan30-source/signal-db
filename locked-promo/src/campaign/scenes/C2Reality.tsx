import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Phone} from '../../components/Phone';
import {CineText} from '../CineText';
import {campaign} from '../content';
import {FOOTAGE, FootageSlot} from '../FootageSlot';
import {CUES} from '../timing';

const LOCK = CUES.lockClick;
const CARD_H = 560;
// Neutral, blurred "feed" tiles: never shows actual content
const TILE_TONES = [
  ['#2b3442', '#1a1f28'],
  ['#3a3f4a', '#22252c'],
  ['#2f3a3a', '#1c2323'],
  ['#3b3540', '#232027'],
  ['#2c3646', '#1b212b'],
  ['#3a3a3a', '#222222'],
  ['#2e3440', '#1c2028'],
  ['#353a45', '#20232a'],
];

const Feed: React.FC<{offset: number}> = ({offset}) => (
  <div style={{position: 'absolute', inset: 0, paddingTop: 120, overflow: 'hidden'}}>
    <div style={{transform: `translateY(${offset}px)`}}>
      {Array.from({length: 12}).map((_, i) => {
        const [a, b] = TILE_TONES[i % TILE_TONES.length];
        return (
          <div key={i} style={{height: CARD_H, padding: '18px 28px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16}}>
              <div style={{width: 52, height: 52, borderRadius: 26, background: '#2a2b2f'}} />
              <div style={{width: 180, height: 18, borderRadius: 9, background: '#2a2b2f'}} />
            </div>
            <div
              style={{
                height: 380,
                borderRadius: 26,
                background: `linear-gradient(160deg, ${a}, ${b})`,
                filter: 'blur(10px)',
              }}
            />
            <div style={{width: '70%', height: 16, borderRadius: 8, background: '#25262a', marginTop: 20}} />
          </div>
        );
      })}
    </div>
  </div>
);

const finger = (style: React.CSSProperties): React.CSSProperties => ({
  position: 'absolute',
  background: 'linear-gradient(90deg, #070606 0%, #100e0d 55%, #080707 100%)',
  boxShadow: 'inset 0 6px 14px rgba(150,170,210,0.10)',
  filter: 'blur(2px)',
  ...style,
});

export const C2Reality: React.FC<{duration: number; footage: boolean}> = ({duration, footage}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Fast scroll that slows… then a pause (hesitation)… a small drift back… lock.
  const scroll = spring({frame: frame - 4, fps, config: {damping: 200, stiffness: 40}, durationInFrames: 62});
  const drift = spring({frame: frame - 74, fps, config: {damping: 200}, durationInFrames: 18});
  const offset = -scroll * 2600 + drift * 70;

  const locked = frame >= LOCK;
  const press = interpolate(frame, [LOCK - 6, LOCK - 1, LOCK + 4], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const glow = locked ? 0 : 1;
  const dim = interpolate(frame, [LOCK, LOCK + 18], [1, 0.32], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const push = interpolate(frame, [0, duration], [1.0, 1.07]);

  return (
    <AbsoluteFill style={{background: '#060607'}}>
      <FootageSlot file={FOOTAGE.s2} use={footage}>
        <AbsoluteFill style={{opacity: dim, transform: `scale(${push})`}}>
          {/* Screen light on the surroundings */}
          <AbsoluteFill
            style={{
              background: 'radial-gradient(50% 40% at 50% 50%, rgba(170,190,235,0.18) 0%, rgba(0,0,0,0) 70%)',
              opacity: glow,
            }}
          />
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <div style={{position: 'relative', transform: 'rotate(-5deg) scale(0.8) translateY(120px)'}}>
              <Phone>
                <Feed offset={offset} />
                <div style={{position: 'absolute', inset: 0, background: '#000', opacity: locked ? 1 : 0}} />
              </Phone>
              {/* Fingers wrapping the left edge */}
              {[0, 1, 2].map((i) => (
                <div key={i} style={finger({left: -34, top: 760 + i * 150, width: 72, height: 132, borderRadius: 36})} />
              ))}
              {/* Thumb on the right, presses the side button to lock */}
              <div style={finger({right: -30 + press * 14, top: 600, width: 66, height: 230, borderRadius: 33})} />
              {/* Palm, mostly lost in shadow */}
              <div style={finger({left: -120, right: -120, bottom: -420, height: 560, borderRadius: 280, background: 'radial-gradient(60% 50% at 50% 30%, #0e0c0b, #040404)'})} />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </FootageSlot>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 90px', textAlign: 'center'}}>
        <CineText text={campaign.s2.line} start={LOCK + 10} size={78} weight={700} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
