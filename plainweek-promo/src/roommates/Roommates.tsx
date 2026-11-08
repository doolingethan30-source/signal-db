import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut, mix, pop, prog} from '../anim';
import {Phone} from '../components/Phone';
import {loadFonts} from '../fonts';
import {LogoMark} from '../launch/scenes/Hero';
import {DISPLAY, UI} from '../launch/theme';
import {C} from '../reset/theme';
import {Apartment, SCENE_H, SCENE_W} from './scenes/Apartment';
import {
  ChoresScreen,
  EventsScreen,
  FairnessScreen,
  LockWidget,
  MateAvatar,
  PROOF_PHOTO,
  ProofScreen,
  Setup,
  SETUP_JOINS,
  ShoppingScreen,
  TodayScreen,
  WidgetsScreen,
} from './screens/Screens';
import {HOUSEHOLD, mate, MATES, Q} from './theme';

loadFonts();

// ---------- the apartment camera ----------
type Cam = {cx: number; cy: number; s: number; blur: number};
const K = (cx: number, cy: number, s: number, blur = 0): Cam => ({cx, cy, s, blur});
const CAM: [number, Cam][] = [
  [0, K(1320, 960, 1.0)],
  [Q.dishes[0] - 6, K(1180, 960, 1.0)],
  [Q.dishes[0] + 12, K(430, 1150, 1.35)],
  [Q.lounge[0] - 6, K(450, 1150, 1.42)],
  [Q.lounge[0] + 12, K(1880, 1120, 1.2)],
  [Q.chat[0], K(1880, 1120, 1.24)],
  [Q.chat[0] + 12, K(1880, 1120, 1.3, 14)],
  [Q.rota[0] - 8, K(1880, 1120, 1.32, 14)],
  [Q.rota[0] + 12, K(880, 1060, 2.3)],
  [Q.rota[1], K(880, 1060, 2.5)],
];
const CAM_END: [number, Cam][] = [
  [Q.clean[0], K(1880, 1120, 1.25)],
  [Q.clean[1], K(1880, 1120, 1.06)],
];
const camAt = (keys: [number, Cam][], frame: number): Cam => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, a] = keys[i];
    const [f1, b] = keys[i + 1];
    if (frame <= f1) {
      const k = easeInOut((frame - f0) / (f1 - f0));
      return {cx: mix(a.cx, b.cx, k), cy: mix(a.cy, b.cy, k), s: mix(a.s, b.s, k), blur: mix(a.blur, b.blur, k)};
    }
  }
  return keys[keys.length - 1][1];
};

const ApartmentShot: React.FC<{cam: Cam; mess: number; day: number; avatars?: number; frame: number}> = ({cam, mess, day, avatars, frame}) => {
  const s = cam.s;
  const x = Math.min(0, Math.max(1080 - SCENE_W * s, 540 - cam.cx * s));
  const y = Math.min(0, Math.max(1920 - SCENE_H * s, 960 - cam.cy * s));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#2A2420'}}>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${x}px, ${y}px) scale(${s})`, filter: cam.blur ? `blur(${cam.blur}px)` : undefined}}>
        <Apartment mess={mess} day={day} avatarsIn={avatars} frame={frame} />
      </div>
      {/* cinematic grade: top scrim for titles, gentle vignette */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,16,12,0.55) 0%, rgba(20,16,12,0) 30%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)'}} />
    </AbsoluteFill>
  );
};

const ProblemFilm: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > Q.intro[0] + 16) return null;
  const out = prog(frame, Q.intro[0], 16, easeInOut);
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <ApartmentShot cam={camAt(CAM, frame)} mess={1} day={0.12} frame={frame} />
    </AbsoluteFill>
  );
};

const CleanFilm: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < Q.clean[0] - 12 || frame > Q.end[0] + 18) return null;
  const inK = prog(frame, Q.clean[0] - 12, 16, easeInOut);
  const out = prog(frame, Q.end[0], 18, easeInOut);
  return (
    <AbsoluteFill style={{opacity: inK * (1 - out)}}>
      <ApartmentShot cam={camAt(CAM_END, frame)} mess={0} day={1} avatars={prog(frame, Q.clean[0] + 6, 30)} frame={frame} />
    </AbsoluteFill>
  );
};

// ---------- the argument: quotes floating over the messy lounge (no app UI) ----------
const QUOTES = [
  {t: 'Who left the pan in the sink?', who: 'Maya', at: 4, x: 70, y: 700, r: -3},
  {t: 'I did the dishes on Monday!', who: 'Jordan', at: 18, x: 230, y: 980, r: 2},
  {t: 'Whose turn is the bathroom?', who: 'Priya', at: 32, x: 90, y: 1260, r: -2},
];
const Argument: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - Q.chat[0];
  const len = Q.chat[1] - Q.chat[0];
  if (f < 0 || f > len + 10) return null;
  const out = prog(f, len - 6, 12, easeInOut);
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 5, opacity: 1 - out}}>
      {QUOTES.map((q) => {
        if (f < q.at) return null;
        const k = pop(f, q.at, 12);
        return (
          <div
            key={q.t}
            style={{
              position: 'absolute',
              left: q.x,
              top: q.y,
              transform: `rotate(${q.r}deg) scale(${0.85 + 0.15 * k}) translateY(${(1 - k) * 30}px)`,
              opacity: Math.min(1, k * 1.5),
              fontFamily: '"Instrument Serif", serif',
              fontStyle: 'italic',
              color: '#FFF8F0',
              textShadow: '0 6px 30px rgba(0,0,0,0.55)',
            }}
          >
            <div style={{fontSize: 92, lineHeight: 1.0, letterSpacing: -1}}>“{q.t}”</div>
            <div style={{fontFamily: UI, fontStyle: 'normal', fontSize: 30, fontWeight: 700, color: '#F4A26C', marginTop: 10}}>— {q.who}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- Plainweek phone (use-case act) ----------
const SHOTS: [number, number, (f: number) => React.ReactNode, number][] = [
  [Q.setup[0], Q.setup[1], (f) => <Setup f={f} />, -2],
  [Q.chores[0], Q.chores[1], (f) => <ChoresScreen f={f} />, 2],
  [Q.today[0], Q.today[1], (f) => <TodayScreen f={f} />, -2],
  [Q.proof[0], Q.proof[1], (f) => <ProofScreen f={f} />, 2],
  [Q.shopping[0], Q.shopping[1], (f) => <ShoppingScreen f={f} />, -2],
  [Q.events[0], Q.events[1], (f) => <EventsScreen f={f} />, 2],
  [Q.fairness[0], Q.fairness[1], (f) => <FairnessScreen f={f} />, -1],
  [Q.widgets[0], Q.widgets[1], (f) => <WidgetsScreen f={f} />, 1],
];
const PhoneAct: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < Q.intro[0] + 20 || frame > Q.clean[0] + 4) return null;
  const enter = prog(frame, Q.intro[0] + 20, 36, easeInOut);
  const exit = prog(frame, Q.clean[0] - 16, 20, easeInOut);
  let rot = 0;
  SHOTS.forEach(([a, , , r], i) => {
    const prev = i ? SHOTS[i - 1][3] : 0;
    rot = frame >= a - 10 ? mix(prev, r, prog(frame, a - 10, 18, easeInOut)) : rot;
  });
  return (
    <AbsoluteFill style={{perspective: 2400}}>
      <div
        style={{
          position: 'absolute',
          left: 240,
          top: 470,
          transformOrigin: '50% 40%',
          transform: `translateY(${(1 - enter) * 1300 + exit * 200}px) rotateX(${(1 - enter) * 26}deg) rotate(${rot}deg) scale(${1 - exit * 0.1})`,
          opacity: 1 - exit,
          filter: 'drop-shadow(0 50px 70px rgba(90,50,20,0.28))',
        }}
      >
        <Phone width={600}>
          {frame < Q.setup[0] + 6 && <Setup f={-20} />}
          {SHOTS.map(([a, b, el], i) => {
            if (frame < a - 6 || frame > b + 8) return null;
            const inK = i === 0 ? 1 : prog(frame, a - 6, 12, easeInOut);
            return (
              <div key={i} style={{position: 'absolute', inset: 0, opacity: inK, transform: `translateX(${(1 - inK) * 60}px)`}}>
                {el(frame - a)}
              </div>
            );
          })}
        </Phone>
      </div>
    </AbsoluteFill>
  );
};

// small motion-graphics callouts beside the phone
const Callout: React.FC<{from: number; to: number; side: 'left' | 'right'; y: number; children: React.ReactNode}> = ({from, to, side, y, children}) => {
  const frame = useCurrentFrame();
  const k = Math.min(pop(frame, from, 14), 1 - prog(frame, to - 10, 10));
  if (frame < from || frame > to) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        [side]: 40,
        padding: '18px 26px',
        borderRadius: 28,
        background: 'rgba(255,255,255,0.94)',
        boxShadow: '0 20px 44px rgba(90,50,20,0.22)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontFamily: UI,
        fontSize: 30,
        fontWeight: 700,
        color: '#1F1D1A',
        transform: `translateX(${(1 - Math.min(1, k)) * (side === 'left' ? -80 : 80)}px) scale(${0.9 + 0.1 * Math.min(1, k)})`,
        opacity: Math.min(1, k * 1.4),
        zIndex: 8,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
const Avatars: React.FC<{size?: number}> = ({size = 44}) => (
  <div style={{display: 'flex'}}>
    {MATES.map((m, i) => (
      <div key={m.id} style={{marginLeft: i ? -12 : 0, border: '3px solid #fff', borderRadius: '50%'}}>
        <MateAvatar m={m} size={size} />
      </div>
    ))}
  </div>
);
const Callouts: React.FC = () => (
  <>
    <Callout from={Q.setup[0] + SETUP_JOINS[2] + 2} to={Q.setup[1] + 2} side="left" y={1755}>
      <Avatars size={40} /> Roommates join free on the Organiser’s Pro
    </Callout>
    <Callout from={Q.chores[0] + 40} to={Q.chores[1] + 2} side="right" y={1755}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: '#3FAE6E', boxShadow: '0 0 0 6px rgba(63,174,110,0.2)'}} /> Live sync: everyone sees it in seconds
    </Callout>
    <Callout from={Q.today[0] + 84} to={Q.today[1] + 2} side="left" y={1755}>
      <Avatars size={40} /> Spread fairly across the apartment
    </Callout>
    <Callout from={Q.proof[0] + 76} to={Q.proof[1] + 2} side="right" y={1730}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <LogoMark size={46} ring={0.78} />
        <div style={{fontSize: 24, lineHeight: 1.25}}>
          <div style={{color: '#8C867E', fontWeight: 600, fontSize: 20}}>ON SAM’S IPHONE</div>
          Maya nudged you: Take out the bins
        </div>
      </div>
    </Callout>
    <Callout from={Q.shopping[0] + 40} to={Q.shopping[1] + 2} side="left" y={1755}>
      <span style={{color: C.orange}}>✦</span> Sorted into aisles automatically
    </Callout>
    <Callout from={Q.events[0] + 56} to={Q.events[1] + 2} side="right" y={1755}>
      <MateAvatar m={mate('jordan')} size={42} /> Jordan’s driving. 3 going.
    </Callout>
    <Callout from={Q.fairness[0] + 40} to={Q.fairness[1] + 2} side="left" y={1755}>
      <MateAvatar m={mate('priya')} size={42} /> Top helper this week: Priya
    </Callout>
    <LockCallout />
  </>
);

const LockCallout: React.FC = () => {
  const frame = useCurrentFrame();
  const from = Q.widgets[0] + 30;
  const to = Q.widgets[1] + 2;
  if (frame < from || frame > to) return null;
  const k = Math.min(pop(frame, from, 14), 1 - prog(frame, to - 10, 10));
  return (
    <div style={{position: 'absolute', right: 40, top: 1700, zIndex: 8, opacity: Math.min(1, k * 1.4), transform: `translateX(${(1 - Math.min(1, k)) * 80}px)`}}>
      <div style={{fontFamily: UI, fontSize: 22, fontWeight: 700, letterSpacing: 3, color: '#8C867E', marginBottom: 8, textAlign: 'right'}}>LOCK SCREEN</div>
      <LockWidget />
    </div>
  );
};

// ---------- titles ----------
type Title = {from: number; to: number; lines: string[]; sub?: string; eyebrow?: string; dark?: boolean; top?: number; size?: number};
const TITLES: Title[] = [
  {from: Q.dishes[0] + 4, to: Q.dishes[1] - 2, lines: ['Dishes', '*piling up.*'], dark: true},
  {from: Q.lounge[0] + 2, to: Q.lounge[1] - 2, lines: ['Shared spaces.', '*Nobody’s job.*'], dark: true},
  {from: Q.chat[0] + 2, to: Q.chat[1] - 2, lines: ['“It’s not', '*my turn.*”'], dark: true, top: 150},
  {from: Q.rota[0] + 2, to: Q.rota[1] + 4, lines: ['Chores', '*forgotten.*'], dark: true},
  {from: Q.intro[0] + 8, to: Q.intro[1] + 2, eyebrow: 'INTRODUCING', lines: ['Plainweek', '*Family Mode.*'], sub: 'One shared home, for roommates too.'},
  {from: Q.setup[0] + 4, to: Q.setup[1] - 2, eyebrow: '01', lines: ['Set up', '*your apartment.*'], sub: 'Invite roommates with a code or a link.'},
  {from: Q.chores[0] + 4, to: Q.chores[1] - 2, eyebrow: '02', lines: ['Type it.', '*Take turns.*'], sub: '“Bins @Sam every tue” just works.'},
  {from: Q.today[0] + 4, to: Q.today[1] - 2, eyebrow: '03', lines: ['One tap.', '*A fair week.*'], sub: 'Templates and “Plan our week”.'},
  {from: Q.proof[0] + 4, to: Q.proof[1] - 2, eyebrow: '04', lines: ['Photo proof.', '*Friendly nudges.*'], sub: 'Plus comments on every chore.'},
  {from: Q.shopping[0] + 4, to: Q.shopping[1] - 2, eyebrow: '05', lines: ['Shopping,', '*sorted by aisle.*'], sub: 'Type “2x milk, bread, bananas”.'},
  {from: Q.events[0] + 4, to: Q.events[1] - 2, eyebrow: '06', lines: ['Who’s going?', '*Who’s driving?*'], sub: 'Shared events, colour-coded by roommate.'},
  {from: Q.fairness[0] + 4, to: Q.fairness[1] - 2, eyebrow: '07', lines: ['Fair,', '*finally.*'], sub: 'Who’s done what, over four weeks.'},
  {from: Q.widgets[0] + 4, to: Q.widgets[1] - 2, eyebrow: '08', lines: ['Tick it off', '*from your Home Screen.*'], sub: 'Widgets for Home and Lock Screen.'},
  {from: Q.clean[0] + 8, to: Q.clean[1] + 2, lines: ['Clean apartment.', '*Happy roommates.*'], dark: true},
];
const Line: React.FC<{text: string; k: number; accent: string}> = ({text, k, accent}) => (
  <div style={{overflow: 'hidden', paddingBottom: '0.06em'}}>
    <div style={{transform: `translateY(${(1 - k) * 105}%)`}}>
      {text.split(/(\*[^*]+\*)/).map((p, i) => (p.startsWith('*') ? <span key={i} style={{color: accent}}>{p.slice(1, -1)}</span> : <span key={i}>{p}</span>))}
    </div>
  </div>
);
const Titles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {TITLES.map((c) => {
        if (frame < c.from - 1 || frame > c.to + 1) return null;
        const out = prog(frame, c.to - 8, 8, easeInOut);
        const ink = c.dark ? '#FFF8F0' : '#1F1D1A';
        return (
          <div key={c.from} style={{position: 'absolute', left: 50, right: 50, top: c.top ?? 120, textAlign: 'center', fontFamily: DISPLAY, color: ink, opacity: 1 - out, filter: `blur(${out * 8}px)`, zIndex: 9, textShadow: c.dark ? '0 4px 30px rgba(0,0,0,0.45)' : 'none'}}>
            {c.eyebrow && <div style={{fontSize: 26, fontWeight: 700, letterSpacing: 6, color: C.orange, marginBottom: 10, opacity: prog(frame, c.from, 10)}}>{c.eyebrow}</div>}
            <div style={{fontSize: c.size ?? 92, fontWeight: 700, letterSpacing: -3.4, lineHeight: 1.0}}>
              {c.lines.map((l, i) => (
                <Line key={i} text={l} k={prog(frame, c.from + i * 5, 15)} accent={c.dark ? '#F4A26C' : C.orange} />
              ))}
            </div>
            {c.sub && <div style={{marginTop: 14, fontSize: 34, fontWeight: 500, letterSpacing: -0.5, color: '#6F685F', opacity: prog(frame, c.from + 10, 14)}}>{c.sub}</div>}
          </div>
        );
      })}
    </>
  );
};

// ---------- hook ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > Q.hook[1] + 4) return null;
  const out = prog(frame, Q.hook[1] - 10, 12, easeInOut);
  const words: [string, string, number][] = [
    ['4', 'roommates.', 2],
    ['1', 'kitchen.', 14],
    ['0', 'clean plates.', 26],
  ];
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 150, fontFamily: DISPLAY, color: '#FFF8F0', opacity: 1 - out, filter: `blur(${out * 8}px)`, zIndex: 9, textShadow: '0 4px 30px rgba(0,0,0,0.5)'}}>
      {words.map(([n, w, at]) => {
        const k = prog(frame, at, 12);
        return (
          <div key={w} style={{display: 'flex', alignItems: 'baseline', gap: 22, opacity: k, transform: `translateX(${(1 - k) * -40}px)`, lineHeight: 1.0, marginBottom: 6}}>
            <span style={{fontSize: 150, fontWeight: 700, letterSpacing: -6, color: n === '0' ? '#F4A26C' : '#FFF8F0', width: 110, textAlign: 'right'}}>{n}</span>
            <span style={{fontSize: 96, fontWeight: 700, letterSpacing: -3.6}}>{w}</span>
          </div>
        );
      })}
      <div style={{display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap'}}>
        {MATES.map((m, i) => {
          const k = pop(frame, 40 + i * 5, 13);
          return (
            <div key={m.id} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px 8px 8px', borderRadius: 30, background: 'rgba(255,255,255,0.92)', color: '#1F1D1A', fontFamily: UI, fontSize: 26, fontWeight: 700, textShadow: 'none', opacity: Math.min(1, k * 1.4), transform: `scale(${0.6 + 0.4 * k})`}}>
              <MateAvatar m={m} size={44} />
              {m.name}
              <span style={{fontWeight: 500, color: '#8C867E', fontSize: 22}}>{m.course}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- end card ----------
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - Q.end[0];
  if (f < 0) return null;
  const bg = prog(f, 0, 18, easeInOut);
  const logo = pop(f, 10, 14);
  const word = prog(f, 18, 18);
  const soon = prog(f, 40, 18);
  const mates = prog(f, 60, 18);
  return (
    <AbsoluteFill style={{opacity: bg, zIndex: 20, fontFamily: DISPLAY, alignItems: 'center', justifyContent: 'center'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF8F3 0%, #F4E9DC 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(55% 32% at 50% 50%, rgba(218,122,68,0.26) 0%, rgba(218,122,68,0) 70%)'}} />
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -80}}>
        <div style={{transform: `scale(${0.6 + 0.4 * logo})`, opacity: Math.min(1, logo * 1.4)}}>
          <LogoMark size={190} ring={0.78 * prog(f, 14, 30, easeInOut)} />
        </div>
        <div style={{marginTop: 40, fontSize: 150, fontWeight: 700, letterSpacing: -6, color: '#1F1D1A', lineHeight: 1, opacity: word, transform: `translateY(${(1 - word) * 30}px)`}}>Plainweek</div>
        <div style={{marginTop: 18, fontSize: 32, fontWeight: 700, letterSpacing: 8, color: '#8C867E', opacity: word}}>FAMILY MODE</div>
        <div style={{marginTop: 60, padding: '22px 40px', borderRadius: 999, border: `3px solid ${C.orange}`, color: C.orange, fontSize: 38, fontWeight: 700, letterSpacing: 5, opacity: soon, transform: `translateY(${(1 - soon) * 20}px) scale(${0.94 + 0.06 * soon})`, boxShadow: `0 0 ${50 * soon}px rgba(218,122,68,0.25)`}}>
          COMING SOON TO THE APP STORE
        </div>
        <div style={{marginTop: 70, opacity: mates, transform: `translateY(${(1 - mates) * 16}px)`, display: 'flex', alignItems: 'center', gap: 16, fontFamily: UI, fontSize: 28, color: '#6F685F', fontWeight: 600}}>
          <Avatars size={48} /> {HOUSEHOLD}, sorted.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- stage + sound ----------
const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 70);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF8F3 0%, #F6ECE0 60%, #F0DCC6 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(55% 30% at ${50 + drift * 6}% 4%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(60% 34% at ${52 - drift * 8}% 100%, rgba(218,122,68,0.26) 0%, rgba(218,122,68,0) 70%)`}} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{at: number; src: string; volume: number}> = ({at, src, volume}) => (
  <Sequence from={Math.round(at)} durationInFrames={60} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

export const Roommates: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Stage />
    <CleanFilm />
    <PhoneAct />
    <Callouts />
    <ProblemFilm />
    <Argument />
    <Hook />
    <Titles />
    <EndCard />
    <Audio src={staticFile('roommates/music.wav')} volume={0.9} />
    <Sfx at={Q.setup[0] + SETUP_JOINS[0]} src="roommates/join.wav" volume={0.28} />
    <Sfx at={Q.proof[0] + PROOF_PHOTO + 10} src="roommates/tick.wav" volume={0.3} />
    <Sfx at={Q.end[0] + 40} src="roommates/shimmer.wav" volume={0.24} />
  </AbsoluteFill>
);
