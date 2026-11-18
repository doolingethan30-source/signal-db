import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShieldBlock} from '../../components/Icons';
import {Phone} from '../../components/Phone';
import {colors} from '../../theme';
import {CineText} from '../CineText';
import {campaign} from '../content';
import {ShieldCheck, Toggle, UICard} from '../ui';

const ROW_START = 34;
const ROW_EVERY = 12;
const BLOCK_AT = 118;

export const C3Control: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = campaign.s3;
  const sp = (at: number, d = 14) => spring({frame: frame - at, fps, config: {damping: 200, stiffness: 120}, durationInFrames: d});

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 30});
  const push = interpolate(frame, [0, duration], [0.74, 0.79]);
  const block = sp(BLOCK_AT, 18);
  const allOn = sp(ROW_START + s.rows.length * ROW_EVERY, 14);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(60% 45% at 50% 60%, rgba(201,204,209,0.07), rgba(0,0,0,0) 70%)'}} />
      <div
        style={{
          position: 'absolute',
          top: 470,
          left: '50%',
          width: 720,
          marginLeft: -360,
          transformOrigin: 'top center',
          transform: `translateY(${(1 - enter) * 200}px) scale(${push})`,
          opacity: enter,
        }}
      >
        <Phone>
          <div style={{position: 'absolute', inset: 0, padding: '130px 40px 0'}}>
            <div style={{color: colors.white, fontSize: 60, fontWeight: 800, letterSpacing: '-0.03em'}}>{s.screenTitle}</div>
            <UICard style={{marginTop: 30, padding: 32, display: 'flex', alignItems: 'center', gap: 26}}>
              <div style={{opacity: 0.35 + 0.65 * allOn}}>
                <ShieldCheck size={78} color={colors.white} accent="#16171A" />
              </div>
              <div style={{flex: 1}}>
                <div style={{color: colors.white, fontSize: 42, fontWeight: 800}}>{s.statusLabel}</div>
                <div style={{color: colors.grey, fontSize: 24, fontWeight: 500, marginTop: 6}}>{s.statusSub}</div>
              </div>
            </UICard>
            <UICard style={{marginTop: 22, padding: '6px 30px'}}>
              {s.rows.map((r, i) => {
                const on = sp(ROW_START + i * ROW_EVERY, 10);
                return (
                  <div
                    key={r.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      padding: '26px 0',
                      borderBottom: i < s.rows.length - 1 ? '1.5px solid rgba(201,204,209,0.08)' : 'none',
                    }}
                  >
                    <div style={{flex: 1}}>
                      <div style={{color: colors.white, fontSize: 31, fontWeight: 700}}>{r.label}</div>
                      <div style={{color: colors.grey, fontSize: 23, fontWeight: 500, marginTop: 4}}>{r.sub}</div>
                    </div>
                    <Toggle on={on} />
                  </div>
                );
              })}
            </UICard>
          </div>

          {/* Blocked access screen slides up */}
          {frame >= BLOCK_AT ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#0A0A0B',
                transform: `translateY(${(1 - block) * 100}%)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 60px',
                textAlign: 'center',
              }}
            >
              <ShieldBlock size={200} slash={sp(BLOCK_AT + 10, 10)} color={colors.white} accent="#0A0A0B" />
              <div style={{marginTop: 50, color: colors.white, fontSize: 72, fontWeight: 900, letterSpacing: '-0.03em'}}>
                {s.blockedTitle}
              </div>
              <div style={{marginTop: 26, color: colors.silver, fontSize: 40, fontWeight: 600, lineHeight: 1.3, textWrap: 'balance'}}>
                {s.blockedMessage}
              </div>
              <div style={{marginTop: 18, color: colors.grey, fontSize: 32, fontWeight: 500, opacity: sp(BLOCK_AT + 20, 18)}}>
                {s.blockedSub}
              </div>
            </div>
          ) : null}
        </Phone>
      </div>

      <div style={{position: 'absolute', top: 150, left: 90, right: 90, textAlign: 'center'}}>
        <CineText text={s.headline} start={8} size={86} weight={800} />
        <CineText text={s.subline} start={BLOCK_AT + 6} size={44} weight={500} color={colors.silver} style={{marginTop: 18}} />
      </div>
    </AbsoluteFill>
  );
};
