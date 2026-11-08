import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut, mix, pop, prog} from '../anim';
import {Phone} from '../components/Phone';
import {loadFonts} from '../fonts';
import {LogoMark} from '../launch/scenes/Hero';
import {DISPLAY} from '../launch/theme';
import {LIGHT_THEME} from '../launch/theme';
import {Touch} from '../launch/ui';
import {BALANCE_TAP, CarryStep, DumpStep, MonthView, NextWeek, ReviewStep, ThisWeek} from './screens/Screens';
import {C, CLOCK_START, CLOCK_STOP, FINAL_SECONDS, R, STEPS} from './theme';

loadFonts();

const PHONE_W = 600;
const BALANCE_AT = R.balance[0] + 8; // NextWeek local 0

// ---------- the stopwatch ----------
const elapsed = (frame: number) => {
  if (frame <= CLOCK_START) return 0;
  if (frame >= CLOCK_STOP) return FINAL_SECONDS;
  return ((frame - CLOCK_START) / (CLOCK_STOP - CLOCK_START)) * FINAL_SECONDS;
};
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const Stopwatch: React.FC = () => {
  const frame = useCurrentFrame();
  const show = prog(frame, 40, 14);
  if (show <= 0) return null;
  const s = elapsed(frame);
  const go = frame >= CLOCK_START - 2 && frame < CLOCK_START + 14 ? 1 - prog(frame, CLOCK_START, 14) : 0;
  const stopped = frame >= CLOCK_STOP;
  const stopPop = stopped ? pop(frame, CLOCK_STOP, 10) : 0;
  // in the finale the clock flies to the centre and grows
  const fin = prog(frame, R.cta[0], 34, easeInOut);
  const stepIdx = STEPS.filter((st) => frame >= st.at).length - 1;
  const step = stepIdx >= 0 ? STEPS[stepIdx] : null;
  const stepIn = step ? prog(frame, step.at, 12) : 0;
  const hud = 1 - prog(frame, R.cta[0], 16);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: DISPLAY, opacity: show, zIndex: 10}}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 18,
          transform: `translateY(${fin * 420}px) scale(${1 + fin * 0.62 + Math.sin(Math.min(1, stopPop) * Math.PI) * 0.06})`,
          transformOrigin: '50% 50%',
        }}
      >
        <span
          style={{
            fontSize: 210,
            fontWeight: 700,
            letterSpacing: -8,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            color: stopped || go > 0 ? C.orange : '#F6F1EA',
            textShadow: stopped ? '0 0 60px rgba(218,122,68,0.55)' : go ? `0 0 ${80 * go}px rgba(218,122,68,0.8)` : 'none',
          }}
        >
          {fmt(s)}
        </span>
        <span style={{fontSize: 56, fontWeight: 600, color: '#6F675E', letterSpacing: -1, opacity: hud}}>/ 3:00</span>
      </div>
      {/* progress against the 3-minute promise */}
      <div style={{margin: '18px auto 0', width: 820, height: 12, borderRadius: 6, background: '#2C2825', position: 'relative', opacity: hud}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(s / 180) * 100}%`, borderRadius: 6, background: 'linear-gradient(90deg, #C9642C, #F09A60)', boxShadow: '0 0 20px rgba(218,122,68,0.6)'}} />
      </div>
      <div style={{marginTop: 22, height: 50, opacity: hud * (frame < CLOCK_START ? 0 : 1)}}>
        {stopped ? (
          <span style={{fontSize: 40, fontWeight: 700, color: C.orange, letterSpacing: -0.6}}>Done — with 19 seconds to spare.</span>
        ) : step ? (
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 16, opacity: stepIn, transform: `translateY(${(1 - stepIn) * 14}px)`}}>
            <span style={{fontSize: 26, fontWeight: 700, letterSpacing: 2, color: C.stage, background: C.orange, padding: '7px 16px', borderRadius: 12}}>STEP {stepIdx + 1}/5</span>
            <span style={{fontSize: 40, fontWeight: 600, color: '#F6F1EA', letterSpacing: -0.6}}>{step.label}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
};

// ---------- hook ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > R.hook[1] + 14) return null;
  const out = prog(frame, R.hook[1] - 10, 18, easeInOut);
  const line = (at: number) => prog(frame, at, 12);
  const L = (text: React.ReactNode, at: number, color = '#F6F1EA') => (
    <div style={{overflow: 'hidden', paddingBottom: '0.06em'}}>
      <div style={{transform: `translateY(${(1 - line(at)) * 105}%)`, color}}>{text}</div>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 640, textAlign: 'center', fontFamily: DISPLAY, fontSize: 132, fontWeight: 700, letterSpacing: -5, lineHeight: 1.0, opacity: 1 - out, transform: `translateY(${-out * 120}px) scale(${1 - out * 0.1})`, filter: `blur(${out * 10}px)`, zIndex: 9}}>
      {L('Plan your', 0)}
      {L('whole week', 6)}
      {L('in 3 minutes.', 14, C.orange)}
      <div style={{marginTop: 34, fontSize: 44, fontWeight: 600, letterSpacing: -0.6, color: '#8E857A', opacity: prog(frame, 30, 12)}}>Start the clock.</div>
    </div>
  );
};

// ---------- phone ----------
const PhoneScreen: React.FC<{frame: number}> = ({frame}) => {
  const layers: React.ReactNode[] = [];
  const sheetUp = prog(frame, 98, 16, easeInOut);
  const sheetDown = prog(frame, R.balance[0] - 4, 16, easeInOut);
  if (frame < R.balance[0] - 4) {
    const press = frame >= 90 && frame < 98 ? Math.sin(((frame - 90) / 8) * Math.PI) : 0;
    layers.push(
      <div key="this" style={{position: 'absolute', inset: 0, transform: `scale(${1 - 0.06 * sheetUp * (1 - sheetDown)})`, filter: `brightness(${1 - 0.25 * sheetUp * (1 - sheetDown)})`}}>
        <ThisWeek press={press} />
      </div>,
    );
    layers.push(
      <div key="t1" style={{position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none'}}>
        <Touch f={frame} at={90} x={196} y={229} t={LIGHT_THEME} />
      </div>,
    );
  }
  if (frame >= R.balance[0] - 4) {
    layers.push(<NextWeek key="next" f={frame - BALANCE_AT} />);
  }
  if (frame >= 98 && sheetDown < 1) {
    const slide = (a: number) => prog(frame, a, 12, easeInOut);
    const steps: [number, number, React.ReactNode][] = [
      [R.review[0], R.carry[0], <ReviewStep f={frame - 100} />],
      [R.carry[0], R.dump[0], <CarryStep f={frame - R.carry[0]} />],
      [R.dump[0], R.balance[0] + 12, <DumpStep f={frame - R.dump[0]} />],
    ];
    layers.push(
      <div key="sheet" style={{position: 'absolute', inset: 0, top: 0, transform: `translateY(${(1 - sheetUp + sheetDown) * 860}px)`, borderRadius: '30px 30px 0 0', overflow: 'hidden', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)', zIndex: 30}}>
        {steps.map(([a, b, el], i) => {
          if (frame < a - 2 || frame > b + 12) return null;
          const inK = i === 0 ? 1 : slide(a - 2);
          const outK = i === steps.length - 1 ? 0 : slide(b - 2);
          return (
            <div key={i} style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - inK) * 393 - outK * 393}px)`}}>
              {el}
            </div>
          );
        })}
      </div>,
    );
  }
  if (frame >= R.lock[0] - 4) {
    const k = prog(frame, R.lock[0] - 4, 14, easeInOut);
    layers.push(
      <div key="month" style={{position: 'absolute', inset: 0, opacity: k, transform: `scale(${1.04 - 0.04 * k})`, zIndex: 50}}>
        <MonthView f={frame - R.lock[0]} />
      </div>,
    );
  }
  return <>{layers}</>;
};

const PhoneRig: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 58) return null;
  const enter = prog(frame, 58, 34, easeInOut);
  const exit = prog(frame, R.cta[0], 30, easeInOut);
  const push = frame < R.balance[0] ? prog(frame, R.carry[0], 200) * 0.05 : 0.05 * (1 - prog(frame, R.balance[0], 20, easeInOut));
  const s = 1 + push;
  return (
    <AbsoluteFill style={{perspective: 2400}}>
      <div
        style={{
          position: 'absolute',
          left: (1080 - PHONE_W) / 2,
          top: 452,
          transformOrigin: '50% 30%',
          transform: `translateY(${(1 - enter) * 1300 + exit * 1700}px) rotateX(${(1 - enter) * 24}deg) scale(${s * (1 - exit * 0.1)})`,
        }}
      >
        <Phone width={PHONE_W}>
          <PhoneScreen frame={frame} />
        </Phone>
      </div>
    </AbsoluteFill>
  );
};

// ---------- finale ----------
const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - R.cta[0];
  if (f < 0) return null;
  const top = prog(f, 14, 18);
  const sub = prog(f, 40, 16);
  const lock = pop(f, 62, 14);
  const cta = prog(f, 92, 18);
  const shine = ((f - 110) % 70) / 70;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: DISPLAY, textAlign: 'center', zIndex: 8}}>
      <div style={{position: 'absolute', left: 40, right: 40, top: 300, fontSize: 64, fontWeight: 700, letterSpacing: -2.2, color: '#F6F1EA', opacity: top, transform: `translateY(${(1 - top) * 24}px)`}}>
        Next week, fully planned in
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 856, fontSize: 42, fontWeight: 500, color: '#9A9187', letterSpacing: -0.5, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)`}}>
        Weekly reset. Every Sunday.
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1010, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, opacity: Math.min(1, lock * 1.4), transform: `scale(${0.85 + 0.15 * lock})`}}>
        <LogoMark size={120} ring={0.78 * prog(f, 66, 30, easeInOut)} />
        <span style={{fontSize: 128, fontWeight: 700, letterSpacing: -5, color: '#F6F1EA'}}>Plainweek</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex', justifyContent: 'center', opacity: cta, transform: `translateY(${(1 - cta) * 24}px)`}}>
        <div style={{position: 'relative', overflow: 'hidden', padding: '30px 64px', borderRadius: 999, background: 'linear-gradient(150deg, #EE9256 0%, #DA7A44 55%, #C9642C 100%)', color: '#fff', fontSize: 50, fontWeight: 700, letterSpacing: -1, boxShadow: '0 24px 60px -14px rgba(218,122,68,0.7)'}}>
          Download Plainweek free
          {f > 110 && <div style={{position: 'absolute', top: 0, bottom: 0, width: 180, left: -180 + shine * 1000, background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))'}} />}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1400, fontSize: 34, fontWeight: 500, color: '#8E857A', opacity: prog(f, 104, 16)}}>Available on the App Store</div>
    </div>
  );
};

// ---------- stage ----------
const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.35 + 0.15 * Math.sin(frame / 18) * (frame > CLOCK_START && frame < CLOCK_STOP ? 1 : 0.3);
  const fin = prog(frame, R.cta[0], 40);
  return (
    <AbsoluteFill style={{background: C.stage}}>
      <AbsoluteFill style={{background: `radial-gradient(55% 34% at 50% ${mix(68, 42, fin)}%, rgba(218,122,68,${glow}) 0%, rgba(218,122,68,0) 70%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(70% 30% at 50% 0%, rgba(255,240,225,0.08) 0%, rgba(255,240,225,0) 70%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)'}} />
    </AbsoluteFill>
  );
};

// ---------- sound: driving score, only three effects ----------
const Sfx: React.FC<{at: number; src: string; volume: number}> = ({at, src, volume}) => (
  <Sequence from={Math.round(at)} durationInFrames={60} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

export const Reset: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Stage />
    <PhoneRig />
    <Hook />
    <Finale />
    <Stopwatch />
    <Audio src={staticFile('reset/music.wav')} volume={0.9} />
    <Sfx at={BALANCE_AT + BALANCE_TAP + 6} src="reset/whoosh.wav" volume={0.25} />
    <Sfx at={CLOCK_STOP} src="reset/done.wav" volume={0.35} />
    <Sfx at={R.cta[0] + 64} src="reset/shimmer.wav" volume={0.22} />
  </AbsoluteFill>
);
