import {interpolateColors, useCurrentFrame} from 'remotion';
import {easeInOut, pop, prog} from '../../anim';
import {DISPLAY} from '../../launch/theme';
import {LogoMark} from '../../launch/scenes/Hero';
import {ACCENT, F, INK, Member, member} from '../theme';
import {Avatar} from '../ui';

// Act 1 (0–5 s): a modern home wakes up at sunrise; each window lights up with a
// family member, then everyone links to one shared Plainweek home.

type Win = {x: number; y: number; w: number; h: number; m: Member; at: number};
const WINDOWS: Win[] = [
  {x: 222, y: 1160, w: 300, h: 196, m: member('mum'), at: 20},
  {x: 676, y: 1160, w: 182, h: 196, m: member('dad'), at: 32},
  {x: 222, y: 905, w: 250, h: 170, m: member('ava'), at: 46},
  {x: 608, y: 905, w: 250, h: 170, m: member('leo'), at: 58},
];
const HUB = {x: 590, y: 1120};

const Window: React.FC<{w: Win; f: number}> = ({w, f}) => {
  const lit = prog(f, w.at, 14);
  const a = pop(f, w.at + 6, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: w.x,
        top: w.y,
        width: w.w,
        height: w.h,
        borderRadius: 10,
        border: '6px solid #2E2B28',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: interpolateColors(lit, [0, 1], ['#3A3B58', '#FFE3B8']),
        boxShadow: `0 0 ${60 * lit}px ${10 * lit}px rgba(255,210,150,${0.35 * lit})`,
      }}
    >
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(80% 90% at 50% 100%, rgba(255,190,120,${0.55 * lit}), rgba(255,190,120,0))`}} />
      {/* mullion */}
      <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, marginLeft: -2, background: '#2E2B28', opacity: 0.7}} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -54%) scale(${0.5 + 0.5 * a})`,
          opacity: Math.min(1, a * 1.4),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Avatar m={w.m} size={66} glow={0.6} />
        <span style={{fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 700, color: '#5A4632', background: 'rgba(255,255,255,0.7)', padding: '2px 12px', borderRadius: 12}}>{w.m.name}</span>
      </div>
    </div>
  );
};

export const HomeIntro: React.FC = () => {
  const f = useCurrentFrame();
  if (f > F.intro[1] + 2) return null;
  const sun = prog(f, 0, 100, easeInOut);
  const sky = (stops: string[]) => interpolateColors(sun, [0, 0.5, 1], stops);
  const push = 1 + prog(f, 0, 150, easeInOut) * 0.06;
  // final beat: dive into the kitchen window
  const dive = prog(f, 132, 18, easeInOut);
  const link = prog(f, 84, 26, easeInOut);
  const hub = pop(f, 80, 12);
  const title = (at: number) => prog(f, at, 16);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '372px 1258px',
          transform: `scale(${push * (1 + dive * 2.6)})`,
        }}
      >
        {/* sky */}
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${sky(['#2B2A4C', '#9C8FB5', '#FBEFE2'])} 0%, ${sky(['#5A4E78', '#F2C3A6', '#FAE0C8'])} 50%, ${sky(['#C98B78', '#F8C79A', '#F7D6B4'])} 72%)`}} />
        {/* sun */}
        <div
          style={{
            position: 'absolute',
            left: 690,
            top: 1240 - sun * 520,
            width: 230,
            height: 230,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFF4DC 0%, #FFD9A0 55%, rgba(255,200,140,0) 72%)',
            boxShadow: '0 0 200px 120px rgba(255,205,150,0.45)',
            opacity: 0.4 + 0.6 * sun,
          }}
        />
        {/* soft clouds */}
        {[{x: 80, y: 520, w: 360}, {x: 600, y: 420, w: 300}].map((c, i) => (
          <div key={i} style={{position: 'absolute', left: c.x + f * (i ? -0.3 : 0.4), top: c.y, width: c.w, height: 70, borderRadius: 40, background: 'rgba(255,255,255,0.55)', filter: 'blur(14px)', opacity: 0.3 + 0.5 * sun}} />
        ))}
        {/* hills + lawn */}
        <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={interpolateColors(sun, [0, 1], ['#55604A', '#C6D3AE'])} />
              <stop offset="1" stopColor={interpolateColors(sun, [0, 1], ['#3B4434', '#9FB58A'])} />
            </linearGradient>
            <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={interpolateColors(sun, [0, 1], ['#4A4B60', '#D9C3A9'])} />
              <stop offset="1" stopColor={interpolateColors(sun, [0, 1], ['#3E4152', '#CDB59A'])} />
            </linearGradient>
          </defs>
          <path d="M0 1330 C 240 1250 420 1300 600 1270 C 800 1240 940 1290 1080 1260 L1080 1920 L0 1920 Z" fill="url(#hill)" />
          <path d="M0 1420 C 300 1385 760 1385 1080 1410 L1080 1920 L0 1920 Z" fill="url(#lawn)" />
          {/* path to the door */}
          <path d="M560 1420 L622 1420 L700 1920 L470 1920 Z" fill={interpolateColors(sun, [0, 1], ['#57524C', '#EADBC6'])} />
        </svg>
        {/* trees */}
        {[{x: 40, s: 1}, {x: 900, s: 0.85}].map((t, i) => (
          <div key={i} style={{position: 'absolute', left: t.x, top: 1150 + (1 - t.s) * 120, transform: `scale(${t.s})`, transformOrigin: 'bottom center'}}>
            <div style={{width: 150, height: 210, borderRadius: '50% 50% 46% 46%', background: interpolateColors(sun, [0, 1], ['#3F4A3A', '#9DB283'])}} />
            <div style={{width: 12, height: 70, background: '#5C4A3A', margin: '-10px auto 0'}} />
          </div>
        ))}
        {/* house */}
        <div style={{position: 'absolute', left: 180, top: 1110, width: 720, height: 312, background: interpolateColors(sun, [0, 1], ['#5B4A3C', '#B98A5E']), borderRadius: '0 0 6px 6px'}}>
          {Array.from({length: 24}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 14 + i * 30, top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,0.12)'}} />
          ))}
        </div>
        <div style={{position: 'absolute', left: 180, top: 862, width: 720, height: 250, background: interpolateColors(sun, [0, 1], ['#6D6A73', '#F4EFE8'])}} />
        <div style={{position: 'absolute', left: 150, top: 830, width: 780, height: 36, background: '#2E2B28', borderRadius: 6, boxShadow: '0 12px 24px rgba(0,0,0,0.18)'}} />
        <div style={{position: 'absolute', left: 166, top: 1098, width: 748, height: 16, background: '#2E2B28', borderRadius: 4}} />
        {/* door */}
        <div style={{position: 'absolute', left: 546, top: 1196, width: 96, height: 226, background: '#4A3A2C', borderRadius: '6px 6px 0 0', border: '5px solid #2E2B28', boxSizing: 'border-box'}}>
          <div style={{position: 'absolute', right: 12, top: 108, width: 6, height: 34, borderRadius: 3, background: '#E8C38A'}} />
        </div>
        {WINDOWS.map((w) => (
          <Window key={w.m.id} w={w} f={f} />
        ))}
        {/* one shared home: everyone links to the Plainweek hub */}
        <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          {WINDOWS.map((w, i) => {
            const cx = w.x + w.w / 2;
            const cy = w.y + w.h / 2 - 12;
            const len = Math.hypot(HUB.x - cx, HUB.y - cy);
            const k = prog(f, 84 + i * 4, 22, easeInOut);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={HUB.x}
                y2={HUB.y}
                stroke={w.m.color}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={`${len * k} ${len}`}
                opacity={0.85 * link}
              />
            );
          })}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: HUB.x - 44,
            top: HUB.y - 44,
            transform: `scale(${0.4 + 0.6 * hub})`,
            opacity: Math.min(1, hub * 1.4),
            filter: `drop-shadow(0 0 ${30 * link}px rgba(224,122,63,0.7))`,
          }}
        >
          <LogoMark size={88} ring={0.78 * link} />
        </div>
      </div>
      {/* warm flash into the kitchen */}
      <div style={{position: 'absolute', inset: 0, background: '#FBF3E8', opacity: prog(f, 138, 12)}} />
      {/* titles */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 190, textAlign: 'center', fontFamily: DISPLAY, opacity: 1 - prog(f, 126, 12)}}>
        <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 8, color: ACCENT, opacity: title(24), transform: `translateY(${(1 - title(24)) * 16}px)`}}>PLAINWEEK PRO</div>
        <div style={{fontSize: 118, fontWeight: 700, letterSpacing: -4.5, lineHeight: 1.05, color: INK, marginTop: 16, opacity: title(28), transform: `translateY(${(1 - title(28)) * 30}px)`, filter: `blur(${(1 - title(28)) * 10}px)`}}>
          Family Mode.
        </div>
        <div style={{fontSize: 40, fontWeight: 500, letterSpacing: -0.6, color: '#5E574E', marginTop: 18, opacity: title(70), transform: `translateY(${(1 - title(70)) * 16}px)`}}>
          One shared home for the whole household.
        </div>
      </div>
    </div>
  );
};
