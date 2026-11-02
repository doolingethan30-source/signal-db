import {interpolate} from 'remotion';
import {pop} from '../../anim';
import {Theme, UI} from '../theme';
import {Status, ThemedRing, Touch} from '../ui';
import {MediumWidget, SmallWidget} from './Widgets';

type App = {name: string; bg: string; glyph?: React.ReactNode};
const APPS: App[] = [
  {name: 'Calendar', bg: '#FFFFFF', glyph: <div style={{fontSize: 26, fontWeight: 300, color: '#1C1B19'}}>2</div>},
  {name: 'Weather', bg: 'linear-gradient(180deg,#7FA6CF,#BBD0E2)', glyph: <div style={{width: 24, height: 24, borderRadius: 12, background: '#F8E3A8'}} />},
  {name: 'Notes', bg: 'linear-gradient(180deg,#F3D776 28%,#FFFDF6 28%)'},
  {name: 'Camera', bg: 'linear-gradient(180deg,#D9D6D0,#A9A59E)', glyph: <div style={{width: 24, height: 24, borderRadius: 12, border: '4px solid #55524D', boxSizing: 'border-box'}} />},
  {name: 'Maps', bg: 'linear-gradient(135deg,#BFDDB2,#EFE7D2)'},
  {name: 'Music', bg: 'linear-gradient(180deg,#F26A7E,#E2475D)', glyph: <div style={{width: 14, height: 14, borderRadius: 7, background: '#fff'}} />},
  {name: 'Photos', bg: '#FFFFFF', glyph: <div style={{width: 26, height: 26, borderRadius: 13, background: 'conic-gradient(#F7B32B,#E2475D,#8E6CE8,#5B8DEF,#3FAE6E,#F7B32B)'}} />},
  {name: 'Settings', bg: 'linear-gradient(180deg,#B8B4AD,#8F8B84)', glyph: <div style={{width: 22, height: 22, borderRadius: 11, border: '5px solid #E9E6E0', boxSizing: 'border-box'}} />},
];

const Icon: React.FC<{app: App; label?: boolean; t: Theme}> = ({app, label = true}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 64}}>
    <div style={{width: 62, height: 62, borderRadius: 15, background: app.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', overflow: 'hidden'}}>
      {app.glyph}
    </div>
    {label && <div style={{fontSize: 11.5, color: '#fff', fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>{app.name}</div>}
  </div>
);

export const HOME_TICKS = [-100, -100, 26, 44];

export const Home: React.FC<{t: Theme; f: number; doneAmounts: number[]}> = ({t, f, doneAmounts}) => {
  const done = doneAmounts.reduce((a, b) => a + b, 0);
  const sIn = pop(f, 0, 16);
  const mIn = pop(f, 4, 16);
  const plainweek: App = {
    name: 'Plainweek',
    bg: '#FBF8F4',
    glyph: <ThemedRing t={{...t, track: '#EADFD3'}} size={34} stroke={5} value={0.75} />,
  };
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        fontFamily: UI,
        background:
          'radial-gradient(90% 45% at 70% 100%, rgba(232,128,72,0.9) 0%, rgba(232,128,72,0) 70%), radial-gradient(80% 40% at 10% 80%, rgba(201,167,232,0.55) 0%, rgba(201,167,232,0) 70%), linear-gradient(180deg, #9C9590 0%, #B7A79B 45%, #CFA88C 72%, #D88E62 100%)',
      }}
    >
      <Status t={t} color="#fff" />
      <div style={{position: 'absolute', left: 24, top: 70, transform: `scale(${0.9 + 0.1 * sIn})`, opacity: Math.min(1, sIn * 1.4)}}>
        <SmallWidget t={t} done={done} />
      </div>
      <div style={{position: 'absolute', left: 206, top: 70, width: 164, display: 'grid', gridTemplateColumns: 'repeat(2, 64px)', justifyContent: 'space-between', rowGap: 10}}>
        {[APPS[0], APPS[1], plainweek, APPS[2]].map((a) => (
          <Icon key={a.name} app={a} t={t} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 24, top: 254, transform: `scale(${0.9 + 0.1 * mIn})`, opacity: Math.min(1, mIn * 1.4)}}>
        <MediumWidget t={t} doneAmounts={doneAmounts} />
      </div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 476, display: 'flex', justifyContent: 'space-between', opacity: interpolate(f, [4, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {[APPS[3], APPS[4], APPS[5], APPS[6]].map((a) => (
          <Icon key={a.name} app={a} t={t} />
        ))}
      </div>
      <div style={{position: 'absolute', top: 690, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 7}}>
        {[1, 0.4, 0.4].map((o, i) => (
          <div key={i} style={{width: 7, height: 7, borderRadius: 4, background: `rgba(255,255,255,${o})`}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 14, right: 14, bottom: 22, height: 92, borderRadius: 32, background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        {[APPS[7], APPS[2], APPS[5], APPS[6]].map((a) => (
          <Icon key={a.name} app={a} label={false} t={t} />
        ))}
      </div>
      <Touch f={f} at={HOME_TICKS[2]} x={58} y={254 + 16 + 44 + 8 + 2 * 30 + 15} t={t} />
      <Touch f={f} at={HOME_TICKS[3]} x={58} y={254 + 16 + 44 + 8 + 3 * 30 + 15} t={t} />
    </div>
  );
};
