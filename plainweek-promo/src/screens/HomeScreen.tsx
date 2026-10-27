import {interpolate} from 'remotion';
import {pop, prog} from '../anim';
import {CheckBox} from '../components/Icons';
import {StatusBar} from '../components/Phone';
import {Ring} from '../components/Ring';
import {A, SANS} from '../theme';
import {MONDAY_TASKS} from './TypeScene';

const TICKS = [-100, -100, 24, 46];

type App = {name: string; bg: string; glyph: React.ReactNode};
const APPS: App[] = [
  {name: 'Calendar', bg: '#FFFFFF', glyph: <div style={{fontSize: 26, fontWeight: 300, color: A.ink}}>26</div>},
  {name: 'Weather', bg: 'linear-gradient(180deg,#7FA6CF,#BBD0E2)', glyph: <div style={{width: 24, height: 24, borderRadius: 12, background: '#F8E3A8'}} />},
  {name: 'Notes', bg: 'linear-gradient(180deg,#F3D776 28%,#FFFDF6 28%)', glyph: null},
  {name: 'Camera', bg: 'linear-gradient(180deg,#D9D6D0,#A9A59E)', glyph: <div style={{width: 24, height: 24, borderRadius: 12, border: '4px solid #55524D', boxSizing: 'border-box'}} />},
  {name: 'Maps', bg: 'linear-gradient(135deg,#BFDDB2,#EFE7D2)', glyph: <div style={{width: 6, height: 34, background: '#F7F4EE', transform: 'rotate(35deg)'}} />},
  {name: 'Music', bg: 'linear-gradient(180deg,#F26A7E,#E2475D)', glyph: <div style={{width: 14, height: 14, borderRadius: 7, background: '#fff'}} />},
  {name: 'Clock', bg: '#1D1C1A', glyph: <div style={{width: 30, height: 30, borderRadius: 15, background: '#F4F1EA'}} />},
  {name: 'Settings', bg: 'linear-gradient(180deg,#B8B4AD,#8F8B84)', glyph: <div style={{width: 22, height: 22, borderRadius: 11, border: '5px solid #E9E6E0', boxSizing: 'border-box'}} />},
];
const PLAINWEEK: App = {
  name: 'Plainweek',
  bg: '#FAF8F5',
  glyph: (
    <div style={{position: 'relative', width: 34, height: 34}}>
      <Ring size={34} stroke={4.5} value={0.72} />
    </div>
  ),
};

const AppIcon: React.FC<{app: App; label?: boolean}> = ({app, label = true}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 64}}>
    <div
      style={{
        width: 62,
        height: 62,
        borderRadius: 15,
        background: app.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      {app.glyph}
    </div>
    {label && <div style={{fontSize: 11.5, color: '#fff', fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.25)'}}>{app.name}</div>}
  </div>
);

const widget: React.CSSProperties = {
  position: 'absolute',
  borderRadius: 24,
  background: 'rgba(250,248,245,0.97)',
  boxShadow: '0 10px 30px rgba(40,28,20,0.18)',
  boxSizing: 'border-box',
  color: A.ink,
};

export const HomeScreen: React.FC<{f: number}> = ({f}) => {
  const doneAmounts = MONDAY_TASKS.map((t, i) => (t.done ? 1 : prog(f, TICKS[i], 10)));
  const done = doneAmounts.reduce((a, b) => a + b, 0);
  const smallIn = pop(f, 0, 16);
  const medIn = pop(f, 4, 16);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(90% 45% at 70% 100%, rgba(232,128,72,0.85) 0%, rgba(232,128,72,0) 70%), radial-gradient(80% 40% at 10% 85%, rgba(196,120,96,0.55) 0%, rgba(196,120,96,0) 70%), linear-gradient(180deg, #8F8B8D 0%, #A59C99 45%, #BFA591 70%, #C98E6C 100%)',
        fontFamily: SANS,
      }}
    >
      <StatusBar color="#fff" />
      {/* small widget */}
      <div
        style={{
          ...widget,
          left: 24,
          top: 70,
          width: 160,
          height: 160,
          padding: '16px 16px',
          transform: `scale(${0.9 + 0.1 * smallIn})`,
          opacity: Math.min(1, smallIn * 1.4),
        }}
      >
        <div style={{fontSize: 17, fontWeight: 400, lineHeight: '20px'}}>MON</div>
        <div style={{fontSize: 36, fontWeight: 700, lineHeight: '40px', letterSpacing: -1}}>26</div>
        <div style={{fontSize: 9.5, letterSpacing: 1.2, color: A.sub, marginTop: 1}}>OCTOBER</div>
        <div style={{fontSize: 19, fontWeight: 700, marginTop: 12, fontVariantNumeric: 'tabular-nums'}}>{Math.round(done)} / 4</div>
        <div style={{fontSize: 12, color: A.sub}}>Today</div>
        <div style={{position: 'absolute', right: 14, top: 14}}>
          <Ring size={50} stroke={5} value={done / 4} />
        </div>
      </div>
      {/* 2x2 icons */}
      <div
        style={{
          position: 'absolute',
          left: 206,
          top: 70,
          width: 164,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 64px)',
          justifyContent: 'space-between',
          rowGap: 10,
          opacity: interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'}),
        }}
      >
        {[APPS[0], APPS[1], PLAINWEEK, APPS[2]].map((a) => (
          <AppIcon key={a.name} app={a} />
        ))}
      </div>
      {/* medium widget */}
      <div
        style={{
          ...widget,
          left: 24,
          right: 24,
          top: 252,
          height: 196,
          padding: '16px 20px',
          transform: `scale(${0.9 + 0.1 * medIn})`,
          opacity: Math.min(1, medIn * 1.4),
        }}
      >
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
          <div>
            <div style={{fontSize: 22, fontWeight: 700, lineHeight: '26px'}}>Today</div>
            <div style={{fontSize: 13, color: A.sub, marginTop: 2}}>Mon, 26 October</div>
          </div>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10}}>
            <span style={{fontSize: 14, fontWeight: 500, fontVariantNumeric: 'tabular-nums'}}>{Math.round(done)} / 4</span>
            <Ring size={36} stroke={4} value={done / 4} />
          </div>
        </div>
        <div style={{marginTop: 8}}>
          {MONDAY_TASKS.map((t, i) => {
            const at = TICKS[i];
            const press = f >= at && f < at + 10 ? Math.sin(((f - at) / 10) * Math.PI) : 0;
            return (
              <div
                key={t.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 30,
                  padding: '0 8px',
                  margin: '0 -8px',
                  borderRadius: 10,
                  background: `rgba(255,90,31,${press * 0.1})`,
                  transform: `scale(${1 - press * 0.02})`,
                }}
              >
                <CheckBox size={20} done={doneAmounts[i]} />
                <span style={{fontSize: 14}}>{t.title}</span>
                <span style={{marginLeft: 'auto', fontSize: 13.5, color: A.sub, fontVariantNumeric: 'tabular-nums'}}>{t.time}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* app row */}
      <div
        style={{
          position: 'absolute',
          left: 30,
          right: 30,
          top: 474,
          display: 'flex',
          justifyContent: 'space-between',
          opacity: interpolate(f, [4, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        {[APPS[3], APPS[4], APPS[5], APPS[7]].map((a) => (
          <AppIcon key={a.name} app={a} />
        ))}
      </div>
      <div style={{position: 'absolute', top: 690, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 7}}>
        {[1, 0.4, 0.4].map((o, i) => (
          <div key={i} style={{width: 7, height: 7, borderRadius: 4, background: `rgba(255,255,255,${o})`}} />
        ))}
      </div>
      {/* dock */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 22,
          height: 92,
          borderRadius: 32,
          background: 'rgba(255,255,255,0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 12px',
        }}
      >
        {[APPS[6], APPS[2], APPS[5], APPS[4]].map((a) => (
          <AppIcon key={a.name} app={a} label={false} />
        ))}
      </div>
    </div>
  );
};

export const WIDGET_TICKS = TICKS.filter((t) => t > 0);
