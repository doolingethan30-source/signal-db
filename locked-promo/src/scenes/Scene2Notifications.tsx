import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Glyph} from '../components/Icons';
import {content} from '../content';
import {colors, SNAP} from '../theme';

const INTERVAL = 5; // a new notification every 5 frames (6 per second)
const CARD_H = 156;
const GAP = 18;
const FREEZE = 80;

export const Scene2Notifications: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const list = content.scene2.notifications;

  // After FREEZE everything stops dead.
  const f = Math.min(frame, FREEZE);
  const frozen = interpolate(frame, [FREEZE, FREEZE + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const enter = (i: number) =>
    spring({frame: f - i * INTERVAL, fps, config: SNAP, durationInFrames: 10});

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `grayscale(${frozen}) brightness(${1 - frozen * 0.45})`,
          paddingTop: 200,
        }}
      >
        {list.map((n, i) => {
          const e = enter(i);
          if (e <= 0) return null;
          // Every newer card pushes this one down by one slot.
          let slots = 0;
          for (let j = i + 1; j < list.length; j++) slots += enter(j);
          const y = slots * (CARD_H + GAP) - (1 - e) * 120;
          const jitter = ((i * 37) % 7) - 3; // tiny, deterministic per-card offset
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 200,
                left: 60 + jitter,
                right: 60 - jitter,
                height: CARD_H,
                transform: `translateY(${y}px) scale(${0.94 + e * 0.06})`,
                opacity: e,
                borderRadius: 44,
                background: 'rgba(38,39,42,0.92)',
                border: '1.5px solid rgba(201,204,209,0.12)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 32px',
                gap: 26,
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 24,
                  background: n.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Glyph name={n.icon} size={52} />
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: colors.silver, fontSize: 26, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase'}}>
                    {n.app}
                  </span>
                  <span style={{color: colors.grey, fontSize: 24, fontWeight: 500}}>{n.time}</span>
                </div>
                <div
                  style={{
                    color: colors.white,
                    fontSize: 34,
                    fontWeight: 600,
                    marginTop: 8,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {n.title}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Freeze: counter + caption */}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 220}}>
        <div
          style={{
            opacity: frozen,
            transform: `translateY(${(1 - frozen) * 20}px)`,
            textAlign: 'center',
            background: 'rgba(11,11,12,0.85)',
            padding: '28px 44px',
            borderRadius: 24,
          }}
        >
          <div style={{color: colors.white, fontSize: 50, fontWeight: 800, letterSpacing: '-0.02em'}}>
            {content.scene2.freezeCaption}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
