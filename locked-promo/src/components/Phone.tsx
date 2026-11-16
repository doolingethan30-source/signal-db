import React from 'react';
import {content} from '../content';
import {colors} from '../theme';
import {Lockup} from './LogoMark';
import {formatMinutes, Ring} from './Ring';

export const PHONE_W = 720;
export const PHONE_H = 1480;
const BEZEL = 16;
const RADIUS = 118;

/** CSS iPhone: rounded body, silver rim, dynamic-island notch, status bar. */
export const Phone: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      width: PHONE_W,
      height: PHONE_H,
      borderRadius: RADIUS,
      padding: BEZEL,
      background: 'linear-gradient(145deg, #3a3c40 0%, #1a1b1d 30%, #0e0e10 60%, #2c2e31 100%)',
      boxShadow:
        '0 0 0 2px rgba(201,204,209,0.35), 0 60px 120px rgba(0,0,0,0.75), 0 0 140px rgba(245,217,10,0.04)',
      position: 'relative',
      ...style,
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: RADIUS - BEZEL,
        background: '#0A0A0B',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {children}
      {/* Dynamic island */}
      <div
        style={{
          position: 'absolute',
          top: 26,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 58,
          borderRadius: 30,
          background: '#000',
        }}
      />
      {/* Status bar */}
      <div
        style={{
          position: 'absolute',
          top: 38,
          left: 64,
          right: 64,
          display: 'flex',
          justifyContent: 'space-between',
          color: colors.white,
          fontWeight: 600,
          fontSize: 28,
        }}
      >
        <span>{content.homeScreen.statusTime}</span>
        <span style={{display: 'flex', gap: 10, alignItems: 'center'}}>
          <span style={{display: 'flex', gap: 4, alignItems: 'flex-end'}}>
            {[10, 14, 18, 22].map((h) => (
              <span key={h} style={{width: 6, height: h, background: colors.white, borderRadius: 2}} />
            ))}
          </span>
          <span
            style={{
              width: 46,
              height: 22,
              border: `2px solid ${colors.silver}`,
              borderRadius: 7,
              padding: 2,
              display: 'inline-block',
            }}
          >
            <span style={{display: 'block', width: '70%', height: '100%', background: colors.white, borderRadius: 3}} />
          </span>
        </span>
      </div>
      {/* Home indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 230,
          height: 9,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.75)',
        }}
      />
    </div>
  </div>
);

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: colors.card,
      border: `1.5px solid ${colors.cardBorder}`,
      borderRadius: 40,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * LOCKED home screen.
 * @param usedMinutes  minutes shown in the ring (animated by the scene)
 * @param reveal       0→1 staggered entrance of the UI blocks
 */
export const HomeScreen: React.FC<{usedMinutes: number; reveal?: number; limitHit?: number}> = ({
  usedMinutes,
  reveal = 1,
  limitHit = 0,
}) => {
  const hs = content.homeScreen;
  const progress = usedMinutes / hs.limitMinutes;
  const left = Math.max(0, hs.limitMinutes - usedMinutes);
  const block = (i: number): React.CSSProperties => {
    const p = Math.min(1, Math.max(0, reveal * 4 - i * 0.7));
    return {opacity: p, transform: `translateY(${(1 - p) * 40}px)`};
  };

  return (
    <div style={{position: 'absolute', inset: 0, padding: '130px 44px 0', display: 'flex', flexDirection: 'column'}}>
      <div style={{...block(0), display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Lockup size={30} wordmark={content.brand.wordmark} spacing={0.36} />
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: colors.bgRaised,
            border: `1.5px solid ${colors.cardBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.silver,
            fontWeight: 700,
            fontSize: 26,
          }}
        >
          A
        </div>
      </div>

      <div style={{...block(0.5), marginTop: 46}}>
        <div style={{color: colors.grey, fontSize: 28, fontWeight: 500}}>{hs.greeting}</div>
        <div style={{color: colors.white, fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 4}}>
          {hs.title}
        </div>
      </div>

      <Card style={{...block(1), marginTop: 32, padding: '36px 36px 40px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{color: colors.silver, fontSize: 30, fontWeight: 600}}>{hs.allowanceLabel}</span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: limitHit > 0.5 ? colors.bg : colors.yellow,
              background: limitHit > 0.5 ? colors.yellow : 'rgba(245,217,10,0.10)',
              padding: '8px 16px',
              borderRadius: 999,
            }}
          >
            {limitHit > 0.5 ? content.lockout.limitReached : 'Active'}
          </span>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 34}}>
          <Ring size={400} stroke={34} progress={progress}>
            <div style={{color: colors.white, fontSize: 84, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1}}>
              {formatMinutes(usedMinutes)}
            </div>
            <div style={{color: colors.grey, fontSize: 30, fontWeight: 500, marginTop: 14}}>
              {hs.ofLabel} {formatMinutes(hs.limitMinutes)}
            </div>
          </Ring>
        </div>
        <div style={{textAlign: 'center', color: colors.silver, fontSize: 28, fontWeight: 600, marginTop: 28}}>
          <span style={{color: left === 0 ? colors.yellow : colors.white}}>{formatMinutes(left)}</span> {hs.leftLabel}
        </div>
      </Card>

      <div style={{...block(1.6), display: 'flex', gap: 18, marginTop: 22}}>
        {hs.tiles.map((t) => (
          <Card key={t.label} style={{flex: 1, padding: '26px 22px'}}>
            <div style={{color: colors.grey, fontSize: 22, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase'}}>
              {t.label}
            </div>
            <div style={{color: colors.white, fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 12, whiteSpace: 'nowrap'}}>
              {t.value}
            </div>
            <div style={{color: colors.grey, fontSize: 20, fontWeight: 500, marginTop: 6}}>{t.sub}</div>
          </Card>
        ))}
      </div>

      <div
        style={{
          ...block(2.2),
          marginTop: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          color: colors.silver,
          fontSize: 24,
          fontWeight: 500,
          padding: '0 8px',
        }}
      >
        <span style={{width: 12, height: 12, borderRadius: 6, background: colors.yellow}} />
        {hs.partnerLine}
      </div>
    </div>
  );
};
