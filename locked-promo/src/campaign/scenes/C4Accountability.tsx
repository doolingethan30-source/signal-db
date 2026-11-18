import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Phone} from '../../components/Phone';
import {colors} from '../../theme';
import {CineText} from '../CineText';
import {campaign} from '../content';
import {CUES} from '../timing';
import {Avatar, UICard} from '../ui';

const ARRIVE = CUES.chime; // message lands on your phone
const TYPE_START = 14;
const BANNER_OUT = 150;
const CHECK_AT = 168;

export const C4Accountability: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = campaign.s4;
  const sp = (at: number, d = 16, stiffness = 110) =>
    spring({frame: frame - at, fps, config: {damping: 200, stiffness}, durationInFrames: d});

  const enter = sp(0, 30, 60);
  const push = interpolate(frame, [0, duration], [1, 1.04]);

  // Partner typing
  const typedChars = Math.max(0, Math.min(s.message.length, Math.floor((frame - TYPE_START) * 1.4)));
  const sent = sp(ARRIVE - 8, 10);
  // Banner on your phone
  const bannerIn = sp(ARRIVE, 14, 140);
  const bannerOut = sp(BANNER_OUT, 14, 140);
  const banner = bannerIn * (1 - bannerOut);
  // Check-in
  const press = interpolate(frame, [CHECK_AT - 4, CHECK_AT, CHECK_AT + 6], [1, 0.94, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const checked = frame >= CHECK_AT;
  const progress = sp(CHECK_AT + 4, 22, 70);
  const days = s.progressValue + (checked ? 1 : 0);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(70% 45% at 50% 62%, rgba(201,204,209,0.07), rgba(0,0,0,0) 70%)'}} />
      <AbsoluteFill style={{transform: `scale(${push})`, opacity: enter}}>
        {/* Partner's phone (behind, left) */}
        <div
          style={{
            position: 'absolute',
            top: 660,
            left: 40,
            width: 720,
            transformOrigin: 'top left',
            transform: `translateY(${(1 - enter) * 160}px) scale(0.5) rotate(-6deg)`,
            filter: 'brightness(0.78)',
          }}
        >
          <Phone>
            <div style={{position: 'absolute', inset: 0, padding: '130px 36px 0', display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                <Avatar letter={s.youLabel[0]} size={70} />
                <div style={{color: colors.white, fontSize: 40, fontWeight: 800}}>{s.youLabel}</div>
              </div>
              <div style={{flex: 1}} />
              {sent > 0.01 ? (
                <div
                  style={{
                    alignSelf: 'flex-end',
                    maxWidth: '82%',
                    background: colors.white,
                    color: colors.bg,
                    fontSize: 36,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    padding: '24px 30px',
                    borderRadius: '34px 34px 8px 34px',
                    opacity: sent,
                    transform: `translateY(${(1 - sent) * 40}px)`,
                    marginBottom: 30,
                  }}
                >
                  {s.message}
                </div>
              ) : null}
              <div
                style={{
                  marginBottom: 70,
                  minHeight: 90,
                  borderRadius: 45,
                  background: '#1C1D20',
                  color: colors.silver,
                  fontSize: 32,
                  padding: '24px 34px',
                  lineHeight: 1.3,
                }}
              >
                {sent > 0.01 ? '' : s.message.slice(0, typedChars)}
                {sent > 0.01 ? null : <span style={{display: 'inline-block', width: 3, height: 36, background: colors.white, marginLeft: 3, verticalAlign: 'middle'}} />}
              </div>
            </div>
          </Phone>
        </div>

        {/* Your phone (front, right) */}
        <div
          style={{
            position: 'absolute',
            top: 540,
            left: 330,
            width: 720,
            transformOrigin: 'top left',
            transform: `translateY(${(1 - enter) * 220}px) scale(0.66) rotate(3deg)`,
          }}
        >
          <Phone style={{boxShadow: '0 0 0 2px rgba(201,204,209,0.35), 0 80px 140px rgba(0,0,0,0.85)'}}>
            <div style={{position: 'absolute', inset: 0, padding: '140px 38px 0'}}>
              <UICard style={{padding: 32}}>
                <div style={{color: colors.grey, fontSize: 24, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase'}}>
                  {s.connectedLabel}
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginTop: 24}}>
                  <Avatar letter={s.youLabel[0]} size={88} />
                  <div style={{flex: 1, height: 3, background: 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.8), rgba(255,255,255,0.15))', margin: '0 18px'}} />
                  <Avatar letter={s.partnerName[0]} size={88} light />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20}}>
                  <span style={{color: colors.white, fontSize: 32, fontWeight: 700}}>{s.partnerName}</span>
                  <span style={{color: colors.silver, fontSize: 26, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10}}>
                    <span style={{width: 12, height: 12, borderRadius: 6, background: colors.white}} />
                    {s.connectedStatus}
                  </span>
                </div>
              </UICard>

              <UICard style={{marginTop: 22, padding: 32}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                  <span style={{color: colors.silver, fontSize: 28, fontWeight: 600}}>{s.progressLabel}</span>
                  <span style={{color: colors.white, fontSize: 56, fontWeight: 900, letterSpacing: '-0.03em'}}>
                    {days}
                    <span style={{color: colors.grey, fontSize: 30, fontWeight: 600}}> / {s.progressGoal}</span>
                  </span>
                </div>
                <div style={{display: 'flex', gap: 8, marginTop: 22}}>
                  {Array.from({length: s.progressGoal}).map((_, i) => {
                    const filled = i < s.progressValue || (i === s.progressValue && checked);
                    const fresh = i === s.progressValue;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 34,
                          borderRadius: 6,
                          background: filled ? colors.white : '#26272b',
                          opacity: fresh && checked ? progress : 1,
                        }}
                      />
                    );
                  })}
                </div>
              </UICard>

              <UICard style={{marginTop: 22, padding: 32}}>
                <div style={{color: colors.white, fontSize: 34, fontWeight: 800}}>{s.checkInTitle}</div>
                <div
                  style={{
                    marginTop: 22,
                    height: 96,
                    borderRadius: 48,
                    background: checked ? colors.white : 'transparent',
                    border: `2px solid ${checked ? colors.white : 'rgba(201,204,209,0.35)'}`,
                    color: checked ? colors.bg : colors.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 14,
                    fontSize: 30,
                    fontWeight: 700,
                    transform: `scale(${press})`,
                  }}
                >
                  {checked ? '✓  ' + s.checkInDone : s.checkInButton}
                </div>
              </UICard>
            </div>

            {/* Incoming message banner */}
            {banner > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  top: 26,
                  left: 22,
                  right: 22,
                  transform: `translateY(${(banner - 1) * 260}px)`,
                  opacity: banner,
                  background: 'rgba(42,43,47,0.97)',
                  borderRadius: 44,
                  padding: '26px 28px',
                  display: 'flex',
                  gap: 20,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                }}
              >
                <Avatar letter={s.partnerName[0]} size={76} light />
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{color: colors.white, fontSize: 30, fontWeight: 800}}>{s.partnerName}</span>
                    <span style={{color: colors.grey, fontSize: 24}}>now</span>
                  </div>
                  <div style={{color: colors.silver, fontSize: 30, fontWeight: 500, lineHeight: 1.3, marginTop: 6}}>{s.message}</div>
                </div>
              </div>
            ) : null}
          </Phone>
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 150, left: 80, right: 80, textAlign: 'center'}}>
        <CineText text={s.headline} start={8} size={86} weight={800} />
        <CineText text={s.subline} start={26} size={44} weight={500} color={colors.silver} style={{marginTop: 18}} />
      </div>
    </AbsoluteFill>
  );
};
