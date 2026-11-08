import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut, mix, pop, prog} from '../anim';
import {Phone} from '../components/Phone';
import {loadFonts} from '../fonts';
import {LogoMark} from '../launch/scenes/Hero';
import {DISPLAY, UI} from '../launch/theme';
import {C} from '../reset/theme';
import {Apartment, SCENE_H, SCENE_W} from './scenes/Apartment';
import {Chores, Household, HH_JOINS, MateAvatar, Progress, PROGRESS_TICKS, Schedule, Shopping} from './screens/Screens';
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

// ---------- the group chat argument ----------
const CHAT = [
  {id: 'maya', t: 'who left the pan in the sink AGAIN', at: 6},
  {id: 'jordan', t: 'not me, I did the dishes monday', at: 18},
  {id: 'sam', t: "it's literally not my turn", at: 30},
  {id: 'priya', t: 'do we even have a rota??', at: 42},
  {id: 'maya', t: 'we made one in september', at: 54},
];
const GroupChat: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - Q.chat[0];
  if (f < -4 || f > Q.chat[1] - Q.chat[0] + 12) return null;
  const k = Math.min(prog(f, -4, 14, easeInOut), 1 - prog(f, Q.chat[1] - Q.chat[0] - 4, 14, easeInOut));
  return (
    <div style={{position: 'absolute', left: 240, top: 520, transform: `translateY(${(1 - k) * 600}px) rotate(${(1 - k) * 8 - 2}deg)`, opacity: k, filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.45))', zIndex: 5}}>
      <Phone width={600}>
        <div style={{position: 'absolute', inset: 0, background: '#F2F2F4', fontFamily: UI}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 128, background: 'rgba(250,250,252,0.95)', borderBottom: '1px solid #E2E2E6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10, gap: 4}}>
            <div style={{display: 'flex'}}>
              {MATES.map((m, i) => (
                <div key={m.id} style={{marginLeft: i ? -10 : 0, border: '2px solid #fff', borderRadius: '50%'}}>
                  <MateAvatar m={m} size={30} />
                </div>
              ))}
            </div>
            <div style={{fontSize: 13, fontWeight: 600, color: '#1F1D1A'}}>Apt 4B group chat</div>
          </div>
          <div style={{position: 'absolute', left: 12, right: 12, top: 148}}>
            {CHAT.map((c) => {
              if (f < c.at) return null;
              const p = pop(f, c.at, 13);
              const mine = c.id === 'maya';
              const m = mate(c.id);
              return (
                <div key={c.at} style={{display: 'flex', flexDirection: mine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12, opacity: Math.min(1, p * 1.5), transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: mine ? 'right bottom' : 'left bottom'}}>
                  {!mine && <MateAvatar m={m} size={28} />}
                  <div style={{maxWidth: 250}}>
                    {!mine && <div style={{fontSize: 11.5, color: '#8E8E93', margin: '0 0 2px 12px'}}>{m.name}</div>}
                    <div style={{padding: '10px 14px', borderRadius: 20, background: mine ? '#2F7CF6' : '#E5E5EA', color: mine ? '#fff' : '#1C1C1E', fontSize: 16, lineHeight: '21px'}}>{c.t}</div>
                  </div>
                </div>
              );
            })}
            {f > 60 && (
              <div style={{display: 'inline-flex', gap: 5, padding: '12px 16px', borderRadius: 20, background: '#E5E5EA', marginLeft: 36}}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{width: 8, height: 8, borderRadius: 4, background: '#8E8E93', opacity: 0.4 + 0.6 * Math.abs(Math.sin((f + i * 5) / 6))}} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Phone>
    </div>
  );
};

// ---------- Plainweek phone (use-case act) ----------
const SHOTS: [number, number, (f: number) => React.ReactNode, number][] = [
  [Q.household[0], Q.household[1], (f) => <Household f={f} />, -2],
  [Q.chores[0], Q.chores[1], (f) => <Chores f={f} />, 2],
  [Q.progress[0], Q.progress[1], (f) => <Progress f={f} />, -2],
  [Q.shopping[0], Q.shopping[1], (f) => <Shopping f={f} />, 2],
  [Q.schedule[0], Q.schedule[1], (f) => <Schedule f={f} />, -1],
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
          {frame < Q.household[0] + 6 && <Household f={-20} />}
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
    <Callout from={Q.household[0] + HH_JOINS[2] + 4} to={Q.household[1] + 2} side="left" y={1755}>
      <Avatars /> 4 roommates, 1 household
    </Callout>
    <Callout from={Q.chores[0] + 92} to={Q.chores[1] + 2} side="right" y={1755}>
      <span style={{color: C.orange}}>↻</span> Everyone takes a turn
    </Callout>
    <Callout from={Q.progress[0] + PROGRESS_TICKS[2] + 6} to={Q.progress[1] + 2} side="left" y={1755}>
      <span style={{width: 34, height: 34, borderRadius: 10, background: C.orange, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>✓</span>3 chores done today
    </Callout>
    <Callout from={Q.shopping[0] + 40} to={Q.shopping[1] + 2} side="right" y={1755}>
      <MateAvatar m={mate('priya')} size={44} /> Priya added Toilet roll
    </Callout>
    <Callout from={Q.schedule[0] + 40} to={Q.schedule[1] + 2} side="left" y={1755}>
      <Avatars size={40} /> 4 schedules, 1 view
    </Callout>
  </>
);

// ---------- titles ----------
type Title = {from: number; to: number; lines: string[]; sub?: string; eyebrow?: string; dark?: boolean; top?: number; size?: number};
const TITLES: Title[] = [
  {from: Q.dishes[0] + 4, to: Q.dishes[1] - 2, lines: ['Dishes', '*piling up.*'], dark: true},
  {from: Q.lounge[0] + 4, to: Q.lounge[1] - 2, lines: ['Shared spaces.', '*Nobody’s job.*'], dark: true},
  {from: Q.chat[0] + 2, to: Q.chat[1] - 2, lines: ['“It’s not', '*my turn.*”'], dark: true, top: 150},
  {from: Q.rota[0] + 4, to: Q.rota[1] + 4, lines: ['Chores', '*forgotten.*'], dark: true},
  {from: Q.intro[0] + 10, to: Q.intro[1] + 2, eyebrow: 'INTRODUCING', lines: ['Plainweek', '*Family Mode.*'], sub: 'One shared home, for roommates too.'},
  {from: Q.household[0] + 4, to: Q.household[1] - 2, eyebrow: '01', lines: ['Create your', '*household.*'], sub: 'Then invite your roommates.'},
  {from: Q.chores[0] + 4, to: Q.chores[1] - 2, eyebrow: '02', lines: ['Chores that', '*rotate.*'], sub: 'Assign once. Everyone takes a turn.'},
  {from: Q.progress[0] + 4, to: Q.progress[1] - 2, eyebrow: '03', lines: ['See who’s', '*done what.*'], sub: 'Every completed chore, tracked.'},
  {from: Q.shopping[0] + 4, to: Q.shopping[1] - 2, eyebrow: '04', lines: ['One shared', '*shopping list.*'], sub: 'Added by anyone. Ticked by whoever’s out.'},
  {from: Q.schedule[0] + 4, to: Q.schedule[1] - 2, eyebrow: '05', lines: ['Everyone’s week,', '*together.*'], sub: 'Lectures, training and dinners in one view.'},
  {from: Q.clean[0] + 10, to: Q.clean[1] + 2, lines: ['Clean apartment.', '*Happy roommates.*'], dark: true},
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
    <GroupChat />
    <Hook />
    <Titles />
    <EndCard />
    <Audio src={staticFile('roommates/music.wav')} volume={0.9} />
    <Sfx at={Q.household[0] + HH_JOINS[0]} src="roommates/join.wav" volume={0.28} />
    <Sfx at={Q.progress[0] + PROGRESS_TICKS[0]} src="roommates/tick.wav" volume={0.3} />
    <Sfx at={Q.end[0] + 40} src="roommates/shimmer.wav" volume={0.24} />
  </AbsoluteFill>
);
