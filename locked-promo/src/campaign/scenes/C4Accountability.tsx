import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Padlock} from '../../components/Icons';
import {Phone} from '../../components/Phone';
import {colors} from '../../theme';
import {CineText} from '../CineText';
import {campaign} from '../content';
import {CUES} from '../timing';
import {Toggle, UICard} from '../ui';

/**
 * Scene 4: your partner is the gatekeeper.
 *  A  Stronger → applies instantly, partner is emailed.
 *  B  Weaker   → "Ask Sam" → partner gets a one-time code (48h) → no code, no change.
 *  C  Partner is also emailed automatically on tamper events.
 */
const STRICT_ON = 140;
const TOAST = 150;
const STRONGER_MAIL = CUES.chime; // 52
const B_START = 196;
const SHEET = 204;
const ASK = 222;
const CODE_SCREEN = 230;
const CODE_MAIL = CUES.codeChime; // 186
const AGREE = 262;
const NOTHING = 290;
const C_START = 322;

const PHONE_SCALE = 0.62;
const PHONE_TOP = 520;

const Label: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      color: colors.grey,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      textAlign: 'center',
      marginBottom: 18,
    }}
  >
    {text}
  </div>
);

export const C4Accountability: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = campaign.s4;
  const sp = (at: number, d = 14, stiffness = 120) =>
    spring({frame: frame - at, fps, config: {damping: 200, stiffness}, durationInFrames: d});
  const between = (a: number, b: number) => sp(a, 12) * (1 - sp(b, 12));

  const enter = sp(0, 28, 60);
  const push = interpolate(frame, [0, duration], [1, 1.03]);

  // ── Your phone state ──
  const strict = sp(STRICT_ON, 10);
  const toast = between(TOAST, B_START - 6);
  const protTap = interpolate(frame, [SHEET - 8, SHEET - 2], [1, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sheet = sp(SHEET, 16);
  const askPress = interpolate(frame, [ASK - 4, ASK, ASK + 5], [1, 0.94, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const codeScreen = sp(CODE_SCREEN, 16);
  const cursorOn = Math.floor(frame / 9) % 2 === 0;
  const dimYou = interpolate(frame, [C_START, C_START + 14], [1, 0.45], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // ── Partner phone state ──
  const mail1 = sp(STRONGER_MAIL, 14, 140);
  const mail2 = sp(CODE_MAIL, 16, 140);
  const alerts = sp(C_START, 16);

  // ── Captions ──
  const cap = s.captions;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(70% 40% at 50% 52%, rgba(201,204,209,0.06), rgba(0,0,0,0) 70%)'}} />

      <AbsoluteFill style={{transform: `scale(${push})`, opacity: enter}}>
        {/* YOU */}
        <div style={{position: 'absolute', top: PHONE_TOP - 50, left: 76, width: 720 * PHONE_SCALE, opacity: dimYou}}>
          <Label text={s.youLabel} />
          <div style={{width: 720, transformOrigin: 'top left', transform: `translateY(${(1 - enter) * 160}px) scale(${PHONE_SCALE})`}}>
            <Phone>
              <div style={{position: 'absolute', inset: 0, padding: '140px 40px 0'}}>
                <div style={{color: colors.white, fontSize: 62, fontWeight: 800, letterSpacing: '-0.03em'}}>{s.screenTitle}</div>
                <UICard style={{marginTop: 34, padding: '8px 32px'}}>
                  {[
                    {label: s.protectionLabel, on: protTap},
                    {label: s.strictLabel, on: strict},
                    {label: s.safeSearchLabel, on: 1},
                  ].map((r, i) => (
                    <div
                      key={r.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '34px 0',
                        borderBottom: i < 2 ? '1.5px solid rgba(201,204,209,0.08)' : 'none',
                      }}
                    >
                      <div style={{flex: 1, color: colors.white, fontSize: 40, fontWeight: 700}}>{r.label}</div>
                      <div style={{transform: 'scale(1.25)', transformOrigin: 'right center'}}>
                        <Toggle on={r.on} />
                      </div>
                    </div>
                  ))}
                </UICard>
              </div>

              {/* Toast: applied instantly */}
              {toast > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 36,
                    right: 36,
                    bottom: 90,
                    background: colors.white,
                    color: colors.bg,
                    borderRadius: 32,
                    padding: '30px 34px',
                    fontSize: 36,
                    fontWeight: 700,
                    lineHeight: 1.25,
                    opacity: toast,
                    transform: `translateY(${(1 - toast) * 60}px)`,
                  }}
                >
                  ✓ {s.appliedToast}
                </div>
              ) : null}

              {/* Sheet: this needs Sam */}
              {frame >= SHEET ? (
                <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.55 * sheet})`}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: '#1A1B1E',
                      borderRadius: '56px 56px 0 0',
                      padding: '48px 44px 90px',
                      transform: `translateY(${(1 - sheet) * 100}%)`,
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <Padlock size={80} color={colors.white} accent="#1A1B1E" />
                    </div>
                    <div style={{color: colors.white, fontSize: 52, fontWeight: 800, textAlign: 'center', marginTop: 26}}>{s.sheetTitle}</div>
                    <div style={{color: colors.silver, fontSize: 34, fontWeight: 500, textAlign: 'center', marginTop: 16, lineHeight: 1.35}}>
                      {s.sheetBody}
                    </div>
                    <div
                      style={{
                        marginTop: 40,
                        height: 110,
                        borderRadius: 55,
                        background: colors.white,
                        color: colors.bg,
                        fontSize: 40,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: `scale(${askPress})`,
                      }}
                    >
                      {s.askButton}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Code entry: stays empty */}
              {frame >= CODE_SCREEN ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#0A0A0B',
                    opacity: codeScreen,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 40px',
                    textAlign: 'center',
                  }}
                >
                  <Padlock size={150} color={colors.white} accent="#0A0A0B" />
                  <div style={{color: colors.white, fontSize: 56, fontWeight: 800, marginTop: 44}}>{s.codeTitle}</div>
                  <div style={{display: 'flex', gap: 14, marginTop: 44}}>
                    {Array.from({length: 6}).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 88,
                          height: 116,
                          borderRadius: 20,
                          background: '#161719',
                          border: `2px solid ${i === 0 ? colors.white : 'rgba(201,204,209,0.18)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {i === 0 ? <span style={{width: 4, height: 54, background: colors.white, opacity: cursorOn ? 1 : 0}} /> : null}
                      </div>
                    ))}
                  </div>
                  <div style={{color: colors.grey, fontSize: 30, fontWeight: 500, marginTop: 34, lineHeight: 1.35}}>{s.codeNote}</div>
                </div>
              ) : null}
            </Phone>
          </div>
        </div>

        {/* PARTNER */}
        <div style={{position: 'absolute', top: PHONE_TOP - 50, right: 76, width: 720 * PHONE_SCALE}}>
          <Label text={s.partnerLabel} />
          <div
            style={{
              width: 720,
              transformOrigin: 'top left',
              transform: `translateY(${(1 - sp(6, 28, 60)) * 200}px) scale(${PHONE_SCALE})`,
            }}
          >
            <Phone>
              <div style={{position: 'absolute', inset: 0, padding: '140px 36px 0'}}>
                <div style={{color: colors.white, fontSize: 62, fontWeight: 800, letterSpacing: '-0.03em'}}>{s.inboxTitle}</div>

                {/* Code email (newest, on top) */}
                {mail2 > 0.01 ? (
                  <UICard
                    style={{
                      marginTop: 30,
                      padding: 32,
                      border: '2px solid rgba(255,255,255,0.35)',
                      opacity: mail2 * (1 - alerts),
                      transform: `translateY(${(1 - mail2) * -50}px)`,
                    }}
                  >
                    <div style={{color: colors.grey, fontSize: 26, fontWeight: 700}}>{s.emailFrom} · now</div>
                    <div style={{color: colors.white, fontSize: 36, fontWeight: 800, marginTop: 10, lineHeight: 1.25}}>{s.weakerSubject}</div>
                    <div
                      style={{
                        marginTop: 22,
                        color: colors.white,
                        fontSize: 92,
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        textAlign: 'center',
                        background: '#0F1012',
                        borderRadius: 22,
                        padding: '18px 0',
                      }}
                    >
                      {s.weakerCode}
                    </div>
                    <div style={{color: colors.silver, fontSize: 28, fontWeight: 500, marginTop: 18, lineHeight: 1.35}}>{s.weakerBody}</div>
                  </UICard>
                ) : null}

                {/* Stronger email */}
                {mail1 > 0.01 ? (
                  <UICard
                    style={{
                      marginTop: 24,
                      padding: 32,
                      opacity: mail1 * (1 - alerts) * (mail2 > 0.5 ? 0.6 : 1),
                      transform: `translateY(${(1 - mail1) * -50}px)`,
                    }}
                  >
                    <div style={{color: colors.grey, fontSize: 26, fontWeight: 700}}>{s.emailFrom} · {mail2 > 0.5 ? '2m' : 'now'}</div>
                    <div style={{color: colors.white, fontSize: 36, fontWeight: 800, marginTop: 10, lineHeight: 1.25}}>{s.strongerSubject}</div>
                    <div style={{color: colors.silver, fontSize: 28, fontWeight: 500, marginTop: 10, lineHeight: 1.35}}>{s.strongerBody}</div>
                  </UICard>
                ) : null}

                {/* Automatic alerts */}
                {alerts > 0.01 ? (
                  <div style={{position: 'absolute', left: 36, right: 36, top: 250, opacity: alerts}}>
                    <div style={{color: colors.white, fontSize: 42, fontWeight: 800, marginBottom: 24}}>{s.alertsTitle}</div>
                    {s.alerts.map((a, i) => {
                      const p = sp(C_START + 6 + i * 7, 12);
                      return (
                        <UICard
                          key={a}
                          style={{
                            padding: '28px 30px',
                            marginBottom: 18,
                            display: 'flex',
                            gap: 20,
                            alignItems: 'center',
                            opacity: p,
                            transform: `translateX(${(1 - p) * 60}px)`,
                          }}
                        >
                          <span style={{width: 14, height: 14, borderRadius: 7, background: colors.white, flexShrink: 0}} />
                          <span style={{color: colors.white, fontSize: 32, fontWeight: 600, lineHeight: 1.3}}>{a}</span>
                        </UICard>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </Phone>
          </div>
        </div>
      </AbsoluteFill>

      {/* Headline */}
      <div style={{position: 'absolute', top: 140, left: 70, right: 70, textAlign: 'center'}}>
        <CineText text={s.headline} start={6} size={82} weight={800} />
        <CineText text={s.subline} start={20} size={44} weight={500} color={colors.silver} style={{marginTop: 18}} />
      </div>

      {/* Step captions under the phones */}
      <div style={{position: 'absolute', top: PHONE_TOP + 1480 * PHONE_SCALE + 70, left: 80, right: 80, textAlign: 'center'}}>
        <div style={{position: 'absolute', left: 0, right: 0}}>
          <CineText text={cap.stronger} start={STRICT_ON} end={B_START - 8} size={46} weight={700} />
          <CineText text={cap.strongerSub} start={TOAST + 6} end={B_START - 8} size={36} weight={500} color={colors.silver} style={{marginTop: 12}} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0}}>
          <CineText text={cap.weaker} start={B_START} end={AGREE - 6} size={46} weight={700} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0}}>
          <CineText text={cap.agree} start={AGREE} end={C_START - 8} size={46} weight={700} />
          <CineText
            text={cap.nothing}
            start={NOTHING}
            end={C_START - 8}
            size={50}
            weight={800}
            style={{marginTop: 14, textDecoration: `underline ${colors.yellow} 5px`, textUnderlineOffset: 14}}
          />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0}}>
          <CineText text={cap.alerts} start={C_START + 4} size={46} weight={700} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
