import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut, mix, prog} from '../anim';
import {Phone} from '../components/Phone';
import {loadFonts} from '../fonts';
import {ChaosField} from './scenes/ChaosField';
import {FloatingWidgets} from './scenes/FloatingWidgets';
import {HeroText} from './scenes/Hero';
import {Stage} from './scenes/Stage';
import {Titles} from './scenes/Titles';
import {Day, PER_CHAR, RETURN_AT, TYPE_START, TYPED} from './screens/Day';
import {Home, HOME_TICKS} from './screens/Home';
import {BLOCK_TAP, NOTIFY, REPLAN_TAP, Timeline} from './screens/Timeline';
import {rowY, Week, weekData} from './screens/Week';
import {FPS} from '../theme';
import {L, LIGHT_THEME, theme, UI} from './theme';
import {darkAt, DARK_IN, glassAt, GLASS_IN} from './timeline';
import {VO_LINES} from './voTimeline';
import {Box} from './ui';

loadFonts();

const PHONE_W = 600;
const PHONE_X = (1080 - PHONE_W) / 2;
const PHONE_Y = 520;

// ---------- camera: keyframed phone poses ----------
type Pose = {y: number; x: number; s: number; rx: number; ry: number};
const P = (y: number, s: number, rx: number, ry: number, x = 0): Pose => ({y, x, s, rx, ry});
const KEYS: [number, Pose][] = [
  [122, P(1050, 0.86, 34, -24)],
  [184, P(0, 1, 7, -13)],
  [246, P(0, 1, 2, -5)],
  [266, P(70, 1.16, 0, 0)],
  [338, P(70, 1.16, 0, 0)],
  [358, P(0, 1, 4, 9)],
  [430, P(0, 1, 3, 6)],
  [452, P(30, 1.08, 3, -7)],
  [530, P(30, 1.08, 2, -4)],
  [548, P(10, 1.12, 2, 0)],
  [612, P(10, 1.1, 0, 2)],
  [632, P(40, 0.88, 0, 0)],
  [714, P(40, 0.88, 0, 0)],
  [734, P(0, 1, 6, -16)],
  [812, P(0, 1, 6, 14)],
  [850, P(175, 0.8, 10, -20)],
  [900, P(190, 0.8, 8, -8)],
  [975, P(196, 0.8, 7, -3)],
];
const poseAt = (frame: number): Pose => {
  if (frame <= KEYS[0][0]) return KEYS[0][1];
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [f0, a] = KEYS[i];
    const [f1, b] = KEYS[i + 1];
    if (frame <= f1) {
      const k = easeInOut((frame - f0) / (f1 - f0));
      return {y: mix(a.y, b.y, k), x: mix(a.x, b.x, k), s: mix(a.s, b.s, k), rx: mix(a.rx, b.rx, k), ry: mix(a.ry, b.ry, k)};
    }
  }
  return KEYS[KEYS.length - 1][1];
};

// ---------- screen flow ----------
const TYPE = L.type[0];
const DRAG = L.drag[0];
const TL_START = L.block[0] + 6; // timeline-local frame 0
const HOME = L.widgets[0] + 2;

const homeDone = (frame: number) => [1, 1, prog(frame - HOME, HOME_TICKS[2], 10), prog(frame - HOME, HOME_TICKS[3], 10)];

const weekAt = (frame: number) => {
  const days = weekData();
  if (frame >= TYPE + 88) days[4].total = 3; // dinner added to Friday
  const drop = prog(frame, DRAG + 56, 12, easeInOut);
  if (frame >= DRAG) {
    days[4].total = 3 - drop;
    days[5].total = 3 + drop;
  }
  if (frame >= L.widgets[0]) days[0].done = 2 + homeDone(frame)[2] + homeDone(frame)[3];
  if (frame >= L.hero[0]) {
    const k = prog(frame, L.hero[0] + 20, 40, easeInOut);
    days.forEach((d) => (d.done = mix(d.done, d.total, k)));
  }
  return days;
};

const DragCard: React.FC<{frame: number}> = ({frame}) => {
  const f = frame - DRAG;
  const lift = prog(f, 10, 10);
  const move = prog(f, 22, 34, easeInOut);
  const drop = prog(f, 52, 8);
  if (f < 10 || f > 60) return null;
  const y = mix(rowY(4) + 10, rowY(5) + 10, move);
  const x = 60 + Math.sin(move * Math.PI) * 30;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 270,
        height: 52,
        borderRadius: 15,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        boxSizing: 'border-box',
        fontFamily: UI,
        color: '#1C1B19',
        transform: `rotate(${Math.sin(move * Math.PI) * -4 - lift * 1.5 * (1 - drop)}deg) scale(${(0.86 + 0.14 * lift) * (1 - drop * 0.3)})`,
        boxShadow: `0 ${8 + lift * 16}px ${18 + lift * 30}px rgba(29,28,26,${0.14 + lift * 0.14}), 0 0 0 1.5px rgba(224,122,63,${0.65 * lift})`,
        opacity: lift * (1 - prog(f, 57, 4)),
        zIndex: 40,
      }}
    >
      <Box t={LIGHT_THEME} size={22} done={0} />
      <span style={{fontSize: 15.5}}>Dinner with Maya</span>
      <span style={{marginLeft: 'auto', fontSize: 14, color: '#8B857C'}}>19:00</span>
    </div>
  );
};

const PhoneScreen: React.FC<{frame: number}> = ({frame}) => {
  const lt = LIGHT_THEME;
  const tt = theme(darkAt(frame), glassAt(frame));
  const days = weekAt(frame);
  const layers: React.ReactNode[] = [];

  // reveal + typing + drag on the week view (with pushes to the day detail)
  if (frame < L.block[0] + 16) {
    const tf = frame - TYPE;
    const push = frame >= TYPE ? Math.min(prog(tf, 4, 14, easeInOut), 1 - prog(tf, 88, 14, easeInOut)) : 0;
    const pushTL = prog(frame, L.block[0], 14, easeInOut);
    const press = [0, 0, 0, 0, 0, 0, 0];
    if (tf >= 0 && tf < 8) press[0] = Math.sin((tf / 8) * Math.PI);
    const pf = frame - (DRAG + 80);
    if (pf >= 0 && pf < 8) press[1] = Math.sin((pf / 8) * Math.PI);
    const hl = [0, 0, 0, 0, 0, 0, 0];
    hl[4] = frame >= TYPE + 88 && frame < DRAG + 20 ? 1 - prog(frame, DRAG, 20) : 0;
    hl[5] = Math.min(prog(frame, DRAG + 36, 10), 1 - prog(frame, DRAG + 62, 16));
    const rf = frame - L.reveal[0];
    layers.push(
      <div key="week" style={{position: 'absolute', inset: 0, transform: `translateX(${-(push + pushTL) * 110}px)`}}>
        <Week
          t={lt}
          days={days}
          appear={Array.from({length: 7}, (_, i) => prog(rf, 34 + i * 4, 20))}
          ringScale={prog(rf, 56, 44, easeInOut)}
          highlight={hl}
          press={press}
        />
        <DragCard frame={frame} />
        <div style={{position: 'absolute', inset: 0, background: `rgba(20,18,16,${(push + pushTL) * 0.14})`}} />
      </div>,
    );
    if (push > 0.001) {
      layers.push(
        <div key="day" style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - push) * 393}px)`, boxShadow: '-12px 0 30px rgba(0,0,0,0.12)'}}>
          <Day t={lt} f={tf} />
        </div>,
      );
    }
    if (pushTL > 0.001) {
      layers.push(
        <div key="tl-in" style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - pushTL) * 393}px)`, boxShadow: '-12px 0 30px rgba(0,0,0,0.12)'}}>
          <Timeline t={lt} f={frame - TL_START} />
        </div>,
      );
    }
  } else if (frame < L.widgets[0] + 10) {
    layers.push(<Timeline key="tl" t={lt} f={frame - TL_START} />);
  }

  // widgets: home screen zooms in over the timeline
  const homeIn = prog(frame, L.widgets[0], 10, easeInOut);
  if (frame >= L.widgets[0] && frame < L.themes[0] + 12) {
    layers.push(
      <div key="home" style={{position: 'absolute', inset: 0, opacity: homeIn, transform: `scale(${1.08 - 0.08 * homeIn})`}}>
        <Home t={lt} f={frame - HOME} doneAmounts={homeDone(frame)} />
      </div>,
    );
  }

  // themes + hero: the week view morphing light → dark → glass
  const weekIn = prog(frame, L.themes[0], 12, easeInOut);
  if (frame >= L.themes[0]) {
    layers.push(
      <div key="themed" style={{position: 'absolute', inset: 0, opacity: weekIn, transform: `scale(${1.06 - 0.06 * weekIn})`}}>
        <Week t={tt} days={days} drift={Math.sin(frame / 40)} />
      </div>,
    );
  }

  // light sweep across the glass on reveal and on the hero shot
  const sweep = (start: number, dur: number) => {
    const k = (frame - start) / dur;
    if (k < 0 || k > 1) return null;
    return (
      <div
        key={`sweep${start}`}
        style={{
          position: 'absolute',
          inset: -200,
          background: 'linear-gradient(110deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 60%)',
          transform: `translateX(${interpolate(k, [0, 1], [-600, 600])}px)`,
          zIndex: 90,
        }}
      />
    );
  };
  layers.push(sweep(170, 40), sweep(L.hero[0] + 24, 46));
  return <>{layers}</>;
};

const PhoneRig: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 120) return null;
  const pose = poseAt(frame);
  const dark = darkAt(frame);
  const shadow = 0.35 + dark * 0.3;
  return (
    <AbsoluteFill style={{perspective: 2600}}>
      {/* soft contact shadow */}
      <div
        style={{
          position: 'absolute',
          left: PHONE_X + 40 + pose.x,
          top: PHONE_Y + 1240 * pose.s + pose.y - 40,
          width: PHONE_W - 80,
          height: 80,
          borderRadius: '50%',
          background: `rgba(60,35,15,${shadow * 0.5})`,
          filter: 'blur(40px)',
          transform: `scaleX(${pose.s})`,
          opacity: prog(frame, 160, 30),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: PHONE_X,
          top: PHONE_Y,
          transformOrigin: '50% 40%',
          transform: `translate(${pose.x}px, ${pose.y + Math.sin(frame / 45) * 6}px) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) scale(${pose.s})`,
        }}
      >
        <Phone width={PHONE_W}>
          <PhoneScreen frame={frame} />
        </Phone>
      </div>
    </AbsoluteFill>
  );
};

// ---------- sound ----------
const Sfx: React.FC<{at: number; src: string; volume: number; rate?: number}> = ({at, src, volume, rate = 1}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none">
    <Audio src={staticFile(src)} volume={volume} playbackRate={rate} />
  </Sequence>
);

/** Music ducks ~7 dB under each voice-over line, with short smooth ramps. */
const musicDuck = (frame: number) => {
  const s = frame / FPS;
  let under = 0;
  for (const l of VO_LINES) {
    const k = Math.min((s - (l.from - 0.25)) / 0.25, ((l.to + 0.35) - s) / 0.35);
    under = Math.max(under, Math.max(0, Math.min(1, k)));
  }
  return 1 - 0.5 * under;
};

const typingClicks = Array.from({length: Math.ceil(TYPED.length / 2)}, (_, i) => TYPE + TYPE_START + i * 2 * PER_CHAR);
const CHAOS_PINGS = [2, 6, 14, 16, 24, 30, 38, 40, 52];

const Sound: React.FC = () => (
  <>
    <Audio src={staticFile('launch/voiceover.wav')} volume={1} />
    <Audio src={staticFile('launch/music.wav')} volume={(f) => 0.7 * musicDuck(f)} />
    {CHAOS_PINGS.map((at, i) => (
      <Sfx key={`p${i}`} at={at} src="launch/ping.wav" volume={0.16 + i * 0.012} rate={[1, 1.12, 0.94, 1.25, 1.06][i % 5]} />
    ))}
    <Sfx at={104} src="launch/swoosh.wav" volume={0.5} />
    <Sfx at={134} src="launch/swoosh.wav" volume={0.28} rate={0.85} />
    {/* typing */}
    <Sfx at={TYPE} src="launch/tap.wav" volume={0.4} />
    <Sfx at={TYPE + 14} src="launch/tap.wav" volume={0.35} />
    {typingClicks.map((at, i) => (
      <Sfx key={`k${i}`} at={at} src="launch/key.wav" volume={0.22} rate={[1, 1.08, 0.95][i % 3]} />
    ))}
    <Sfx at={TYPE + TYPE_START + 23 * PER_CHAR} src="launch/pop.wav" volume={0.3} />
    <Sfx at={TYPE + TYPE_START + 27 * PER_CHAR} src="launch/pop.wav" volume={0.3} rate={1.15} />
    <Sfx at={TYPE + RETURN_AT} src="launch/tick.wav" volume={0.42} />
    {/* drag */}
    <Sfx at={DRAG + 10} src="launch/lift.wav" volume={0.35} />
    <Sfx at={DRAG + 56} src="launch/drop.wav" volume={0.45} />
    <Sfx at={DRAG + 80} src="launch/tap.wav" volume={0.35} />
    {/* block + replan */}
    <Sfx at={TL_START + BLOCK_TAP} src="launch/tap.wav" volume={0.4} />
    <Sfx at={TL_START + BLOCK_TAP + 4} src="launch/shimmer.wav" volume={0.22} />
    {[30, 38, 46].map((at, i) => (
      <Sfx key={`b${i}`} at={TL_START + at + 20} src="launch/drop.wav" volume={0.28} rate={1 + i * 0.08} />
    ))}
    <Sfx at={TL_START + NOTIFY + 2} src="launch/ding.wav" volume={0.32} />
    <Sfx at={TL_START + NOTIFY + 26} src="launch/thud.wav" volume={0.32} />
    <Sfx at={TL_START + REPLAN_TAP} src="launch/tap.wav" volume={0.4} />
    <Sfx at={TL_START + REPLAN_TAP + 4} src="launch/shimmer.wav" volume={0.26} />
    <Sfx at={TL_START + REPLAN_TAP + 22} src="launch/tick.wav" volume={0.38} />
    {/* widgets */}
    <Sfx at={L.widgets[0] - 2} src="launch/swoosh.wav" volume={0.25} />
    <Sfx at={HOME + HOME_TICKS[2]} src="launch/tick.wav" volume={0.42} />
    <Sfx at={HOME + HOME_TICKS[3]} src="launch/tick.wav" volume={0.42} rate={1.06} />
    {/* themes */}
    <Sfx at={L.themes[0] - 2} src="launch/swoosh.wav" volume={0.22} />
    <Sfx at={DARK_IN} src="launch/swoosh.wav" volume={0.26} rate={0.8} />
    <Sfx at={GLASS_IN} src="launch/shimmer.wav" volume={0.3} />
    <Sfx at={L.hero[0]} src="launch/swoosh.wav" volume={0.3} rate={0.75} />
  </>
);

export const Launch: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden', background: '#0B0A09'}}>
    <Stage />
    <ChaosField />
    <PhoneRig />
    <FloatingWidgets doneAmounts={homeDone(useCurrentFrame())} />
    <Titles />
    <HeroText />
    <Sound />
  </AbsoluteFill>
);
