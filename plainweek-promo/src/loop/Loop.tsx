import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut, mix, pop, prog} from '../anim';
import {Phone} from '../components/Phone';
import {FamilyHub, HubState} from '../family/screens/Parent';
import {loadFonts} from '../fonts';
import {LogoMark} from '../launch/scenes/Hero';
import {DISPLAY, LIGHT_THEME, UI} from '../launch/theme';
import {Touch} from '../launch/ui';
import {NextWeek} from '../reset/screens/Screens';
import {C} from '../reset/theme';
import {DayCard, Header, PhoneStatus, TabBar} from '../reset/ui';

loadFonts();

// A 15-second launch ad that loops seamlessly. Every animation is a function of
// cyclic time (frame % LOOP), and the CTA → chaos transition straddles the loop
// point, so frame LOOP is identical to frame 0.
export const LOOP = 450;

// Beats (frames within the cycle)
const B = {
  chaosOut: 75, // chaos collapses into the phone
  week: 108, // calm week view
  type: 150, // natural-language entry
  reset: 215, // weekly reset balances the week
  family: 275, // Family Mode
  cta: 335, // FREE TO DOWNLOAD NOW ON THE APP STORE
  chaosIn: 425, // chaos floods back in → loops into frame 0
};

const TAU = Math.PI * 2;
const cyc = (f: number, n: number, phase = 0) => Math.sin((f / LOOP) * TAU * n + phase);

// ---------- chaos ----------
type Card = {kind: 'banner' | 'badge' | 'task'; x: number; y: number; r: number; a: string; b?: string; c?: string; d: number};
const CARDS: Card[] = [
  {kind: 'banner', x: -250, y: -640, r: -5, a: 'Mail', b: '48 unread messages', c: '#5B8DEF', d: 0.9},
  {kind: 'badge', x: 380, y: -560, r: 0, a: '99+', d: 1.1},
  {kind: 'task', x: 250, y: -330, r: 6, a: 'Q4 deck', b: 'Overdue · 3 days', d: 1.0},
  {kind: 'banner', x: -300, y: -150, r: 4, a: 'Reminder', b: 'Dentist — 15 min ago', c: '#E5484D', d: 1.15},
  {kind: 'task', x: -330, y: 420, r: -7, a: 'Renew passport', b: 'Due tomorrow', d: 0.85},
  {kind: 'badge', x: -420, y: 200, r: 0, a: '12', d: 0.8},
  {kind: 'banner', x: 230, y: 330, r: -3, a: 'Calendar', b: '3 events overlap at 2 PM', c: '#F7B32B', d: 1.05},
  {kind: 'task', x: 300, y: 640, r: 5, a: 'Call the plumber', b: 'Overdue · 1 week', d: 0.9},
  {kind: 'banner', x: -220, y: 760, r: 3, a: 'Team chat', b: '23 new messages', c: '#8E6CE8', d: 1.0},
  {kind: 'badge', x: 420, y: 60, r: 0, a: '7', d: 0.95},
  {kind: 'banner', x: 60, y: -830, r: 2, a: 'Bank', b: 'Rent is due tomorrow', c: '#3FAE6E', d: 0.8},
  {kind: 'task', x: -60, y: 990, r: -4, a: 'Pick up the kids', b: 'Today · 3:00', d: 0.75},
];

const CardBody: React.FC<{c: Card}> = ({c}) => {
  const glass: React.CSSProperties = {background: 'rgba(40,37,34,0.82)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', color: '#F2EEE8', fontFamily: UI};
  if (c.kind === 'badge')
    return (
      <div style={{minWidth: 96, height: 96, padding: '0 22px', borderRadius: 48, background: '#E5484D', color: '#fff', fontSize: 42, fontWeight: 700, fontFamily: UI, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: '0 16px 40px rgba(229,72,77,0.45)'}}>{c.a}</div>
    );
  if (c.kind === 'task')
    return (
      <div style={{...glass, width: 420, padding: '22px 26px', borderRadius: 26, display: 'flex', gap: 18, alignItems: 'center'}}>
        <div style={{width: 34, height: 34, borderRadius: 10, border: '3px solid #6E6860', flexShrink: 0}} />
        <div>
          <div style={{fontSize: 30, fontWeight: 600}}>{c.a}</div>
          <div style={{fontSize: 23, color: '#F07A6E', fontWeight: 600, marginTop: 4}}>{c.b}</div>
        </div>
      </div>
    );
  return (
    <div style={{...glass, width: 560, padding: '22px 26px', borderRadius: 36, display: 'flex', gap: 18, alignItems: 'center'}}>
      <div style={{width: 62, height: 62, borderRadius: 16, background: c.c, flexShrink: 0}} />
      <div style={{flex: 1}}>
        <div style={{display: 'flex', fontSize: 26, fontWeight: 600}}>
          {c.a}
          <span style={{marginLeft: 'auto', fontWeight: 400, color: '#9A938A', fontSize: 21}}>now</span>
        </div>
        <div style={{fontSize: 25, color: '#BDB6AC', marginTop: 3}}>{c.b}</div>
      </div>
    </div>
  );
};

const Chaos: React.FC<{f: number}> = ({f}) => {
  const entering = f >= B.chaosIn;
  if (!entering && f > B.chaosOut + 34) return null;
  const collapse = entering ? 0 : prog(f, B.chaosOut, 30, easeInOut);
  return (
    <AbsoluteFill>
      {CARDS.map((c, i) => {
        // cards fly in from beyond the frame edges at the end of the loop
        const enter = entering ? prog(f, B.chaosIn + (i % 4) * 2, 18) : 1;
        const far = 1 + (1 - enter) * 1.6;
        const jx = cyc(f, 3 + (i % 3), i * 1.7) * 16 + cyc(f, 11, i) * 5;
        const jy = cyc(f, 2 + (i % 4), i * 2.3) * 14 + cyc(f, 13, i * 0.7) * 5;
        const x = 540 + (c.x * far + jx) * (1 - collapse);
        const y = 960 + (c.y * far + jy) * (1 - collapse) + collapse * 140;
        const s = c.d * (1 - collapse * 0.92);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${c.r + cyc(f, 5, i) * 2 + collapse * (i % 2 ? 40 : -40)}deg) scale(${s})`,
              opacity: entering ? Math.min(1, enter * 1.6) : 1 - prog(f, B.chaosOut + 14, 16),
              filter: `blur(${Math.abs(c.d - 1) * 8 + collapse * 12}px)`,
            }}
          >
            <CardBody c={c} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- phone screens ----------
const T = LIGHT_THEME;
const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const COUNTS: [number, number][] = [[3, 3], [2, 3], [1, 4], [2, 2], [0, 2], [1, 2], [0, 1]];
const TYPED = 'Call Josh fri 3pm';

/** The week view: rings draw on, then a task is typed in plain English and lands on Friday. */
const WeekScreen: React.FC<{f: number}> = ({f}) => {
  const ring = prog(f, 0, 34, easeInOut);
  const tf = f - (B.type - B.week); // local frame for typing
  const n = Math.max(0, Math.min(TYPED.length, Math.floor((tf - 6) / 1.5)));
  const committed = tf >= 40;
  const fly = prog(tf, 40, 16, easeInOut);
  const landed = prog(tf, 54, 8);
  const cardTop = (i: number) => 276 + i * 68;
  const seg = (a: number, b: number, hl: boolean) => {
    const t = TYPED.slice(a, Math.min(b, n));
    if (!t) return null;
    return <span style={hl ? {background: C.orangeSoft, color: C.orange, borderRadius: 5, padding: '1px 3px', margin: '0 -3px'} : undefined}>{t}</span>;
  };
  return (
    <div style={{position: 'absolute', inset: 0, background: C.paper, fontFamily: UI, color: C.ink, overflow: 'hidden'}}>
      <PhoneStatus />
      <Header />
      <div style={{position: 'absolute', left: 10, right: 10, top: 126, display: 'flex', justifyContent: 'space-between'}}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
          <div key={d} style={{width: 50, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <span style={{fontSize: 13, color: C.sub}}>{d}</span>
            <div style={{marginTop: 8, width: 40, height: 40, borderRadius: 20, background: i === 2 ? C.orange : 'transparent', color: i === 2 ? '#fff' : C.ink, fontSize: 17, fontWeight: i === 2 ? 600 : 500, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{9 + i}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 14, right: 14, top: 206, height: 58, borderRadius: 29, background: '#fff', padding: 6, boxSizing: 'border-box', boxShadow: tf > 2 && !committed ? '0 0 0 1.6px rgba(218,122,68,0.7)' : 'none'}}>
        <div style={{height: 46, borderRadius: 23, background: '#F3F0EC', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', fontSize: 15.5}}>
          <span style={{fontSize: 22, fontWeight: 300}}>+</span>
          {n > 0 && !committed ? (
            <span>
              {seg(0, 10, false)}
              {seg(10, 13, n >= 13)}
              {seg(13, 14, false)}
              {seg(14, 17, n >= 17)}
              <span style={{display: 'inline-block', width: 2, height: 18, background: C.orange, marginLeft: 1, verticalAlign: -3}} />
            </span>
          ) : (
            <span style={{color: C.sub}}>Add a task… try “Call Josh fri 3pm”</span>
          )}
        </div>
      </div>
      {DAYS.map((d, i) => (
        <DayCard key={d} name={d} date={`${9 + i} November 2026`} done={COUNTS[i][0] * ring} total={COUNTS[i][1] + (i === 4 ? landed : 0)} today={i === 2} glow={i === 4 ? Math.min(prog(tf, 50, 6), 1 - prog(tf, 66, 14)) : 0} style={{position: 'absolute', left: 14, right: 14, top: cardTop(i)}} />
      ))}
      {committed && fly < 1 && (
        <div style={{position: 'absolute', left: mix(60, 150, fly), top: mix(220, cardTop(4) + 14, fly), padding: '8px 14px', borderRadius: 16, background: '#fff', boxShadow: '0 12px 26px rgba(0,0,0,0.18), 0 0 0 1.5px rgba(218,122,68,0.7)', fontSize: 14, fontWeight: 600, zIndex: 30, transform: `scale(${1 - fly * 0.15})`}}>
          Call Josh <span style={{color: C.orange}}>· Fri 15:00</span>
        </div>
      )}
      <TabBar active="week" />
    </div>
  );
};

const hub = (f: number): HubState => {
  const k = prog(f, 4, 36, easeInOut);
  const tk = Math.min(prog(f, 22, 10), 1 - prog(f, 52, 8));
  return {
    rings: {mum: mix(0.3, 5 / 6, k), dad: mix(0.2, 0.75, k), ava: mix(0.25, 1, k), leo: mix(0.1, 2 / 3, k)},
    stars: {mum: 0, dad: 0, ava: mix(12, 15, k), leo: mix(6, 9, k)},
    toast: tk > 0 ? {k: tk, text: 'Ava finished Tidy your room'} : undefined,
  };
};

const SCREENS: [number, number, (f: number) => React.ReactNode][] = [
  [B.week, B.reset, (f) => <WeekScreen f={f} />],
  [B.reset, B.family, (f) => <NextWeek f={f + 18} />],
  [B.family, B.chaosIn + 20, (f) => <FamilyHub s={hub(f)} />],
];

const PhoneRig: React.FC<{f: number}> = ({f}) => {
  if (f < B.chaosOut + 4 || f > B.chaosIn + 22) return null;
  const enter = prog(f, B.chaosOut + 4, 28, easeInOut);
  const toCta = prog(f, B.cta - 8, 24, easeInOut);
  const exit = prog(f, B.chaosIn - 4, 22, easeInOut);
  const push = 0.04 * prog(f, B.week, B.cta - B.week);
  const s = mix(mix(0.55, 1.12 + push, enter), 0.7, toCta) * (1 - exit * 0.25);
  const top = mix(mix(700, 452, enter), 930, toCta) + exit * 260;
  return (
    <AbsoluteFill style={{perspective: 2400}}>
      <div
        style={{
          position: 'absolute',
          left: 240,
          top,
          transformOrigin: '50% 0%',
          transform: `rotateX(${(1 - enter) * 20}deg) rotateY(${toCta * (1 - exit) * -10 + cyc(f, 2) * 1.5}deg) scale(${s})`,
          opacity: Math.min(1, enter * 1.6) * (1 - exit),
          filter: 'drop-shadow(0 50px 70px rgba(90,50,20,0.3))',
        }}
      >
        <Phone width={600}>
          {SCREENS.map(([a, b, el], i) => {
            // the week view is on the phone from the moment it appears
            if ((i > 0 && f < a - 8) || f > b + 8) return null;
            const inK = i === 0 ? 1 : prog(f, a - 6, 12, easeInOut);
            return (
              <div key={i} style={{position: 'absolute', inset: 0, opacity: inK, transform: `translateX(${(1 - inK) * 60}px)`}}>
                {el(f - a)}
              </div>
            );
          })}
          {/* light sweep for the hero shot */}
          {f > B.cta + 20 && f < B.cta + 66 && (
            <div style={{position: 'absolute', inset: -200, background: 'linear-gradient(110deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 60%)', transform: `translateX(${mix(-600, 600, (f - B.cta - 20) / 46)}px)`, zIndex: 60}} />
          )}
          <div style={{position: 'absolute', inset: 0, zIndex: 70, pointerEvents: 'none'}}>
            <Touch f={f} at={B.type + 2} x={196} y={235} t={T} />
          </div>
        </Phone>
      </div>
    </AbsoluteFill>
  );
};

// ---------- titles ----------
const Line: React.FC<{text: string; k: number; accent?: string}> = ({text, k, accent = C.orange}) => (
  <div style={{overflow: 'hidden', paddingBottom: '0.06em'}}>
    <div style={{transform: `translateY(${(1 - k) * 105}%)`}}>
      {text.split(/(\*[^*]+\*)/).map((p, i) => (p.startsWith('*') ? <span key={i} style={{color: accent}}>{p.slice(1, -1)}</span> : <span key={i}>{p}</span>))}
    </div>
  </div>
);

const FEATURE_TITLES: [number, number, string[], string][] = [
  [B.week + 2, B.type - 2, ['Your whole week.', '*Finally calm.*'], 'Everything in one simple view.'],
  [B.type + 2, B.reset - 2, ['Just', '*type it.*'], 'Plainweek understands dates and times.'],
  [B.reset + 2, B.family - 2, ['Too much on one day?', '*Balanced in a tap.*'], 'Weekly reset plans your week in minutes.'],
  [B.family + 2, B.cta - 4, ['Share the load', '*with family.*'], 'Chores, stars and progress for everyone.'],
];

const Titles: React.FC<{f: number}> = ({f}) => {
  // chaos headline: present at frame 0, so it fades in at the very end of the loop
  const chaosK = f >= B.chaosIn + 8 ? prog(f, B.chaosIn + 8, 16) : 1 - prog(f, B.chaosOut - 12, 12, easeInOut);
  return (
    <>
      {chaosK > 0 && (
        <div style={{position: 'absolute', left: 40, right: 40, top: 760, textAlign: 'center', fontFamily: DISPLAY, fontSize: 132, fontWeight: 700, letterSpacing: -5, lineHeight: 1.0, color: '#F6F1EA', opacity: chaosK, transform: `scale(${0.94 + 0.06 * chaosK})`, filter: `blur(${(1 - chaosK) * 10}px)`, textShadow: '0 10px 60px rgba(0,0,0,0.8)', zIndex: 6}}>
          Your week
          <br />
          feels like <span style={{color: '#FF6B4A'}}>this?</span>
        </div>
      )}
      {FEATURE_TITLES.map(([a, b, lines, sub]) => {
        if (f < a - 1 || f > b + 1) return null;
        const out = prog(f, b - 8, 8, easeInOut);
        return (
          <div key={a} style={{position: 'absolute', left: 40, right: 40, top: 122, textAlign: 'center', fontFamily: DISPLAY, color: '#1F1D1A', opacity: 1 - out, filter: `blur(${out * 8}px)`, zIndex: 6}}>
            <div style={{fontSize: 88, fontWeight: 700, letterSpacing: -3.4, lineHeight: 1.0}}>
              {lines.map((l, i) => (
                <Line key={i} text={l} k={prog(f, a + i * 4, 13)} />
              ))}
            </div>
            <div style={{marginTop: 14, fontSize: 34, fontWeight: 500, letterSpacing: -0.5, color: '#6F685F', opacity: prog(f, a + 8, 12)}}>{sub}</div>
          </div>
        );
      })}
    </>
  );
};

// ---------- call to action ----------
const CTA: React.FC<{f: number}> = ({f}) => {
  if (f < B.cta - 4 || f > B.chaosIn + 22) return null;
  const out = prog(f, B.chaosIn - 2, 18, easeInOut);
  const logo = pop(f, B.cta, 13);
  const word = prog(f, B.cta + 6, 16);
  const btn = pop(f, B.cta + 20, 13);
  const store = prog(f, B.cta + 30, 14);
  const shine = (f - B.cta - 40) / 40;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: DISPLAY, opacity: 1 - out, transform: `translateY(${-out * 60}px)`, filter: `blur(${out * 10}px)`, zIndex: 6}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{transform: `scale(${0.6 + 0.4 * Math.min(1, logo)})`, opacity: Math.min(1, logo * 1.4)}}>
          <LogoMark size={112} ring={0.78 * prog(f, B.cta + 4, 26, easeInOut)} />
        </div>
        <span style={{fontSize: 124, fontWeight: 700, letterSpacing: -5, color: '#1F1D1A', opacity: word, transform: `translateX(${(1 - word) * 30}px)`}}>Plainweek</span>
      </div>
      <div style={{marginTop: 56, position: 'relative', overflow: 'hidden', padding: '34px 60px', borderRadius: 999, background: 'linear-gradient(150deg, #EE9256 0%, #DA7A44 55%, #C9642C 100%)', color: '#fff', fontSize: 60, fontWeight: 800, letterSpacing: -1, boxShadow: '0 30px 70px -18px rgba(218,122,68,0.75)', opacity: Math.min(1, btn * 1.4), transform: `scale(${(0.7 + 0.3 * Math.min(1.04, btn)) * (1 + cyc(f, 6) * 0.012)})`}}>
        FREE TO DOWNLOAD NOW
        {shine > 0 && shine < 1 && <div style={{position: 'absolute', top: 0, bottom: 0, width: 200, left: -200 + shine * 1100, background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0))'}} />}
      </div>
      <div style={{marginTop: 30, fontSize: 44, fontWeight: 700, letterSpacing: 9, color: '#1F1D1A', opacity: store, transform: `translateY(${(1 - store) * 16}px)`}}>ON THE APP STORE</div>
    </div>
  );
};

// ---------- stage ----------
const Stage: React.FC<{f: number}> = ({f}) => {
  const dark = f >= B.chaosIn ? prog(f, B.chaosIn, 25, easeInOut) : 1 - prog(f, B.chaosOut + 4, 28, easeInOut);
  const bloom = Math.min(prog(f, B.chaosOut + 2, 12), 1 - prog(f, B.chaosOut + 16, 22));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF8F3 0%, #F6ECE0 60%, #F0DCC6 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(55% 30% at ${50 + cyc(f, 1) * 6}% 4%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(60% 34% at ${52 - cyc(f, 1) * 8}% 100%, rgba(218,122,68,0.28) 0%, rgba(218,122,68,0) 70%)`}} />
      <AbsoluteFill style={{opacity: dark}}>
        <AbsoluteFill style={{background: '#0B0A09'}} />
        <AbsoluteFill style={{background: 'radial-gradient(70% 40% at 50% 0%, rgba(120,80,50,0.35) 0%, rgba(11,10,9,0) 70%)'}} />
        <AbsoluteFill style={{background: `radial-gradient(50% 30% at 50% 55%, rgba(229,72,77,${0.12 + cyc(f, 8) * 0.04}) 0%, rgba(229,72,77,0) 70%)`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 56%, rgba(255,246,236,1) 0%, rgba(255,246,236,0) 60%)', opacity: bloom, transform: `scale(${0.4 + prog(f, B.chaosOut + 2, 30) * 2})`}} />
    </AbsoluteFill>
  );
};

const Film: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Stage f={f} />
    <PhoneRig f={f} />
    <CTA f={f} />
    <Chaos f={f} />
    <Titles f={f} />
  </AbsoluteFill>
);

/** The 15 s loop. Audio is one seamless 8-bar loop at 128 bpm. */
export const LoopAd: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Film f={frame % LOOP} />
      <Audio src={staticFile('loop/music.wav')} volume={0.9} />
      <Sequence from={B.type + 40} durationInFrames={40} layout="none">
        <Audio src={staticFile('loop/tick.wav')} volume={0.3} />
      </Sequence>
      <Sequence from={B.cta + 20} durationInFrames={60} layout="none">
        <Audio src={staticFile('loop/shimmer.wav')} volume={0.24} />
      </Sequence>
    </>
  );
};

/** Two loops back to back, used only to verify the seam (frame LOOP must equal frame 0). */
export const LoopSeamTest: React.FC = () => {
  const frame = useCurrentFrame();
  return <Film f={frame % LOOP} />;
};
