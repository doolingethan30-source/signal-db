import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut, mix, prog} from '../anim';
import {Phone} from '../components/Phone';
import {loadFonts} from '../fonts';
import {LogoMark} from '../launch/scenes/Hero';
import {DISPLAY} from '../launch/theme';
import {HomeIntro} from './scenes/HomeIntro';
import {Problem, ProblemTitles} from './scenes/Problem';
import {APPROVED_AT, KidDay, REDEEM_AT, Rewards, TICK_AT} from './screens/Kid';
import {ApproveCard, AssignSheet, FamilyHub, HubState, MumLock} from './screens/Parent';
import {FamilyCalendar, FamilyProgress, Shopping} from './screens/Shared';
import {ACCENT, F, INK} from './theme';

loadFonts();

// ---------- timing of the cross-phone moments (global frames) ----------
const KID0 = F.tick[0]; // KidDay local 0
const ASSIGN_SENT = F.assign[0] + 58; // "Assign to Ava" tapped (the task reaches Ava's phone at KID0 + 16)
const TICKED = KID0 + TICK_AT; // Ava ticks her chore
const REWARD0 = F.reward[0]; // Rewards local 0
const APPROVE0 = REWARD0 + REDEEM_AT + 18; // approval card lands on the parent's phone
const APPROVED = REWARD0 + APPROVED_AT; // Ava's phone shows "Approved"

// ---------- phone rig ----------
type Pose = {cx: number; top: number; s: number; rot: number; op: number};
const P = (cx: number, top: number, s: number, rot = 0, op = 1): Pose => ({cx, top, s, rot, op});
const lerpPose = (keys: [number, Pose][], frame: number): Pose => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, a] = keys[i];
    const [f1, b] = keys[i + 1];
    if (frame <= f1) {
      const k = easeInOut((frame - f0) / (f1 - f0));
      return {cx: mix(a.cx, b.cx, k), top: mix(a.top, b.top, k), s: mix(a.s, b.s, k), rot: mix(a.rot, b.rot, k), op: mix(a.op, b.op, k)};
    }
  }
  return keys[keys.length - 1][1];
};

const MAIN: [number, Pose][] = [
  [F.problem[0] + 8, P(800, 700, 0.6, 7, 0)],
  [F.problem[0] + 24, P(800, 660, 0.6, 7)],
  [F.problem[1] - 18, P(800, 660, 0.6, 7)],
  [F.assign[0] + 4, P(540, 430, 1.0, 0)],
  [F.assign[1] - 6, P(540, 430, 1.0, 0)],
  [F.tick[0] + 10, P(292, 545, 0.78, -2)],
  [F.sync[0] - 8, P(292, 545, 0.78, -2)],
  [F.sync[0] + 10, P(540, 560, 0.7, 0)],
  [F.sync[1] - 6, P(540, 560, 0.7, 0)],
  [F.cta[0] + 22, P(540, 680, 0.8, 0)],
  [F.cta[1], P(540, 670, 0.81, 0)],
];
const KID: [number, Pose][] = [
  [F.tick[0] - 4, P(1420, 545, 0.78, 10)],
  [F.tick[0] + 12, P(788, 545, 0.78, 2)],
  [F.sync[0] - 8, P(788, 545, 0.78, 2)],
  [F.sync[0] + 12, P(888, 640, 0.6, 7)],
  [F.sync[1] - 6, P(888, 640, 0.6, 7)],
  [F.cta[0] + 20, P(600, 700, 0.72, 0, 0)],
];
const LIST: [number, Pose][] = [
  [F.sync[0] - 4, P(-340, 640, 0.6, -7)],
  [F.sync[0] + 14, P(192, 640, 0.6, -7)],
  [F.sync[1] - 6, P(192, 640, 0.6, -7)],
  [F.cta[0] + 20, P(480, 700, 0.72, 0, 0)],
];

const PHONE_W = 600;
const PHONE_H = 1259;

const Rig: React.FC<{pose: Pose; children: React.ReactNode; z: number}> = ({pose, children, z}) => (
  <div
    style={{
      position: 'absolute',
      left: pose.cx - PHONE_W / 2,
      top: pose.top,
      transformOrigin: '50% 0%',
      transform: `rotate(${pose.rot}deg) scale(${pose.s})`,
      opacity: pose.op,
      zIndex: z,
    }}
  >
    <Phone width={PHONE_W}>{children}</Phone>
  </div>
);

const fade = (frame: number, a: number, d = 10) => prog(frame, a, d, easeInOut);

const hubState = (frame: number): HubState => {
  const ticked = prog(frame, TICKED + 26, 14, easeInOut); // after it syncs back
  const allDone = prog(frame, F.cta[0] + 30, 50, easeInOut);
  const rings = {
    mum: mix(4 / 6, 1, allDone),
    dad: mix(3 / 4, 1, allDone),
    ava: mix(mix(2 / 4, 3 / 4, ticked), 1, allDone),
    leo: mix(1 / 3, 1, allDone),
  };
  const stars = {mum: 0, dad: 0, ava: mix(12, 15, ticked) - (frame >= APPROVED ? 15 * prog(frame, APPROVED, 14) : 0), leo: mix(6, 9, allDone)};
  const arrived = prog(frame, ASSIGN_SENT + 14, 10);
  const s: HubState = {rings, stars};
  if (frame >= ASSIGN_SENT + 10 && frame < F.reward[0]) {
    s.highlight = {id: 'ava', k: Math.min(arrived, 1 - prog(frame, TICKED + 50, 14)), text: ticked > 0.5 ? 'Tidy your room ✓ +3 stars' : 'New: Tidy your room · ★3'};
  }
  const tk = Math.min(prog(frame, TICKED + 26, 12), 1 - prog(frame, TICKED + 60, 10));
  if (tk > 0) s.toast = {k: tk, text: 'Ava finished Tidy your room'};
  return s;
};

const MainScreen: React.FC<{frame: number}> = ({frame}) => {
  const layers: React.ReactNode[] = [];
  if (frame < F.assign[0] + 6) layers.push(<MumLock key="lock" f={frame - F.problem[0]} />);
  const hubIn = fade(frame, F.assign[0] - 6, 12);
  if (frame >= F.assign[0] - 6 && frame < F.sync[0] + 12) {
    layers.push(
      <div key="hub" style={{position: 'absolute', inset: 0, opacity: hubIn}}>
        <FamilyHub s={hubState(frame)}>
          {frame >= F.assign[0] && frame < F.tick[0] + 10 && <AssignSheet f={frame - F.assign[0]} />}
          {frame >= APPROVE0 && frame < F.sync[0] && <ApproveCard f={frame - APPROVE0} />}
        </FamilyHub>
      </div>,
    );
  }
  if (frame >= F.sync[0]) {
    layers.push(
      <div key="cal" style={{position: 'absolute', inset: 0, opacity: fade(frame, F.sync[0], 12) * (1 - fade(frame, F.cta[0] + 4, 14))}}>
        <FamilyCalendar f={frame - F.sync[0] - 8} />
      </div>,
    );
  }
  if (frame >= F.cta[0] + 4) {
    layers.push(
      <div key="hub-end" style={{position: 'absolute', inset: 0, opacity: fade(frame, F.cta[0] + 4, 14)}}>
        <FamilyHub s={hubState(frame)} />
      </div>,
    );
    // light sweep across the glass for the product shot
    const k = (frame - (F.cta[0] + 70)) / 50;
    if (k > 0 && k < 1)
      layers.push(
        <div key="sweep" style={{position: 'absolute', inset: -200, background: 'linear-gradient(110deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 60%)', transform: `translateX(${mix(-600, 600, k)}px)`, zIndex: 50}} />,
      );
  }
  return <>{layers}</>;
};

const KidScreen: React.FC<{frame: number}> = ({frame}) => {
  const layers: React.ReactNode[] = [];
  if (frame < F.reward[0] + 8) layers.push(<KidDay key="day" f={frame - KID0} />);
  if (frame >= F.reward[0] - 4 && frame < F.sync[0] + 12)
    layers.push(
      <div key="rw" style={{position: 'absolute', inset: 0, opacity: fade(frame, F.reward[0] - 4, 12)}}>
        <Rewards f={frame - REWARD0} />
      </div>,
    );
  if (frame >= F.sync[0])
    layers.push(
      <div key="pr" style={{position: 'absolute', inset: 0, opacity: fade(frame, F.sync[0], 12)}}>
        <FamilyProgress f={frame - F.sync[0] - 8} />
      </div>,
    );
  return <>{layers}</>;
};

const Phones: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < F.problem[0] + 8) return null;
  return (
    <AbsoluteFill>
      {frame >= F.sync[0] - 4 && (
        <Rig pose={lerpPose(LIST, frame)} z={1}>
          <Shopping f={frame - F.sync[0] - 8} />
        </Rig>
      )}
      {frame >= F.tick[0] - 4 && (
        <Rig pose={lerpPose(KID, frame)} z={frame >= F.sync[0] ? 1 : 3}>
          <KidScreen frame={frame} />
        </Rig>
      )}
      <Rig pose={lerpPose(MAIN, frame)} z={2}>
        <MainScreen frame={frame} />
      </Rig>
    </AbsoluteFill>
  );
};

// ---------- instant sync: a glowing pulse travels between iPhones ----------
const Beam: React.FC<{from: [number, number]; to: [number, number]; at: number; label?: string; dur?: number}> = ({from, to, at, label, dur = 14}) => {
  const frame = useCurrentFrame();
  const k = prog(frame, at, dur, easeInOut);
  const vis = Math.min(prog(frame, at - 4, 6), 1 - prog(frame, at + dur + 6, 10));
  if (vis <= 0) return null;
  const [x0, y0] = from;
  const [x1, y1] = to;
  const cx = (x0 + x1) / 2;
  const cy = Math.min(y0, y1) - 130;
  const bx = (1 - k) ** 2 * x0 + 2 * (1 - k) * k * cx + k ** 2 * x1;
  const by = (1 - k) ** 2 * y0 + 2 * (1 - k) * k * cy + k ** 2 * y1;
  return (
    <AbsoluteFill style={{zIndex: 6, pointerEvents: 'none', opacity: vis}}>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <path d={`M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`} fill="none" stroke={ACCENT} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" opacity={0.6} />
      </svg>
      <div style={{position: 'absolute', left: bx - 19, top: by - 19, width: 38, height: 38, borderRadius: 19, background: '#fff', boxShadow: `0 0 0 8px ${ACCENT}55, 0 0 36px 14px ${ACCENT}88`}} />
      {label && (
        <div style={{position: 'absolute', left: cx - 220, width: 440, top: cy - 28, textAlign: 'center'}}>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 26px', borderRadius: 30, background: '#fff', boxShadow: '0 12px 28px rgba(40,25,15,0.16)', fontFamily: 'Inter, sans-serif', fontSize: 32, fontWeight: 700, color: INK}}>
            <span style={{width: 13, height: 13, borderRadius: 7, background: '#3FAE6E'}} />
            {label}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Beams: React.FC = () => {
  const L: [number, number] = [380, 560];
  const R: [number, number] = [700, 560];
  return (
    <>
      <Beam from={L} to={R} at={KID0 + 2} label="Sent instantly" />
      <Beam from={R} to={L} at={TICKED + 10} label="Synced" />
      <Beam from={R} to={L} at={REWARD0 + REDEEM_AT + 4} />
      <Beam from={L} to={R} at={APPROVE0 + 26} label="Approved" />
      {/* sync shot: live updates flowing between all three iPhones */}
      {[0, 1, 2].map((i) => (
        <Beam key={i} from={i % 2 ? [740, 640] : [330, 650]} to={[540, 575]} at={F.sync[0] + 24 + i * 26} dur={12} label={i === 0 ? 'Live on every iPhone' : undefined} />
      ))}
    </>
  );
};

// ---------- titles ----------
type Title = {from: number; to: number; lines: string[]; sub: string};
const TITLES: Title[] = [
  {from: F.assign[0] + 4, to: F.assign[1] - 2, lines: ['Assign chores', '*in a tap.*'], sub: 'Choose who, how many stars, and when.'},
  {from: F.tick[0] + 4, to: F.tick[1] - 2, lines: ['Kids tick.', '*Stars* add up.'], sub: 'Every iPhone updates instantly.'},
  {from: F.reward[0] + 4, to: F.reward[1] - 2, lines: ['Rewards,', '*approved.*'], sub: 'Kids ask. Parents say yes. Done.'},
  {from: F.sync[0] + 4, to: F.sync[1] - 2, lines: ['One family.', '*Always in sync.*'], sub: 'Shared lists, calendar and progress.'},
];
const Line: React.FC<{text: string; k: number}> = ({text, k}) => {
  const parts = text.split(/(\*[^*]+\*)/);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.06em'}}>
      <div style={{transform: `translateY(${(1 - k) * 105}%)`}}>
        {parts.map((p, i) => (p.startsWith('*') ? <span key={i} style={{color: ACCENT}}>{p.slice(1, -1)}</span> : <span key={i}>{p}</span>))}
      </div>
    </div>
  );
};
const Titles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {TITLES.map((c) => {
        if (frame < c.from - 1 || frame > c.to + 1) return null;
        const out = prog(frame, c.to - 9, 9, easeInOut);
        return (
          <div key={c.from} style={{position: 'absolute', left: 50, right: 50, top: 132, textAlign: 'center', fontFamily: DISPLAY, color: INK, opacity: 1 - out, filter: `blur(${out * 8}px)`, zIndex: 8}}>
            <div style={{fontSize: 86, fontWeight: 700, letterSpacing: -3.2, lineHeight: 1.0}}>
              {c.lines.map((l, i) => (
                <Line key={i} text={l} k={prog(frame, c.from + i * 5, 15)} />
              ))}
            </div>
            <div style={{marginTop: 14, fontSize: 34, fontWeight: 500, letterSpacing: -0.5, color: '#6F685F', opacity: prog(frame, c.from + 10, 14)}}>{c.sub}</div>
          </div>
        );
      })}
    </>
  );
};

// ---------- call to action ----------
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - F.cta[0];
  if (f < 0) return null;
  const line = (i: number) => prog(f, 10 + i * 12, 16);
  const disc = prog(f, 72, 16);
  const lock = prog(f, 82, 18);
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 120, textAlign: 'center', fontFamily: DISPLAY, color: INK, zIndex: 8}}>
      <div style={{fontSize: 92, fontWeight: 700, letterSpacing: -3.6, lineHeight: 1.0}}>
        <Line text="One home." k={line(0)} />
        <Line text="One plan." k={line(1)} />
        <Line text="A happier *family.*" k={line(2)} />
      </div>
      <div style={{marginTop: 34, fontSize: 36, fontWeight: 500, letterSpacing: -0.5, color: '#6F685F', opacity: disc, transform: `translateY(${(1 - disc) * 14}px)`}}>Discover Family Mode with</div>
      <div style={{marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 18, opacity: lock, transform: `translateY(${(1 - lock) * 18}px) scale(${0.95 + 0.05 * lock})`}}>
        <LogoMark size={70} ring={0.78 * prog(f, 86, 30, easeInOut)} />
        <span style={{fontSize: 64, fontWeight: 700, letterSpacing: -2.4}}>Plainweek</span>
        <span style={{fontSize: 30, fontWeight: 700, letterSpacing: 2, color: '#fff', background: ACCENT, padding: '6px 16px', borderRadius: 14, marginLeft: 2}}>PRO</span>
      </div>
    </div>
  );
};

// ---------- stage ----------
const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 70);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF8F3 0%, #F7EEE3 60%, #F2E0CC 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(55% 30% at ${50 + drift * 6}% 6%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(60% 34% at ${52 - drift * 8}% 100%, rgba(224,122,63,0.24) 0%, rgba(224,122,63,0) 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(40% 25% at ${12 + drift * 4}% 60%, rgba(155,107,223,0.10) 0%, rgba(155,107,223,0) 70%)`}} />
    </AbsoluteFill>
  );
};

// ---------- sound: an upbeat score and only five small UI sounds ----------
const Sfx: React.FC<{at: number; src: string; volume: number}> = ({at, src, volume}) => (
  <Sequence from={Math.round(at)} durationInFrames={60} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);
const Sound: React.FC = () => (
  <>
    <Audio src={staticFile('family/music.wav')} volume={0.85} />
    <Sfx at={KID0 + 2} src="family/sync.wav" volume={0.3} />
    <Sfx at={TICKED} src="family/tick.wav" volume={0.35} />
    <Sfx at={TICKED + 16} src="family/stars.wav" volume={0.3} />
    <Sfx at={APPROVE0 + 26} src="family/approve.wav" volume={0.3} />
    <Sfx at={F.cta[0] + 82} src="family/shimmer.wav" volume={0.25} />
  </>
);

export const Family: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Stage />
    <Problem />
    <Phones />
    <Beams />
    <Titles />
    <ProblemTitles />
    <CTA />
    <HomeIntro />
    <Sound />
  </AbsoluteFill>
);
