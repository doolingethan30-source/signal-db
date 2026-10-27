import {interpolate} from 'remotion';
import {pop, prog} from '../anim';
import {CheckCircle, LogoMark} from '../components/Icons';
import {StatusBar} from '../components/Phone';
import {Ring} from '../components/Ring';
import {C, SANS, SERIF} from '../theme';

const TASKS = [
  {title: 'Morning walk', meta: '7:00', at: -100},
  {title: 'Call the bank', meta: '10:30', at: 22},
  {title: 'Inbox zero', meta: '1:00', at: 42},
  {title: 'Prep slides for Thu', meta: '4:00', at: 62},
];

const APPS: {name: string; bg: string; glyph: React.ReactNode}[] = [
  {name: 'Calendar', bg: '#FFFFFF', glyph: <div style={{fontSize: 26, fontWeight: 300, color: C.ink}}>27</div>},
  {name: 'Weather', bg: 'linear-gradient(180deg,#9DB6C9,#C8D6DF)', glyph: <div style={{width: 24, height: 24, borderRadius: 12, background: '#F6E7B8'}} />},
  {name: 'Notes', bg: 'linear-gradient(180deg,#F3E6BE 30%,#FFFDF6 30%)', glyph: null},
  {name: 'Camera', bg: 'linear-gradient(180deg,#D9D6D0,#B9B5AE)', glyph: <div style={{width: 24, height: 24, borderRadius: 12, border: '4px solid #6F6B65', boxSizing: 'border-box'}} />},
  {name: 'Maps', bg: 'linear-gradient(135deg,#CFE0C7,#EDE6D4)', glyph: <div style={{width: 6, height: 34, background: '#F7F4EE', transform: 'rotate(35deg)'}} />},
  {name: 'Music', bg: 'linear-gradient(180deg,#D99A8E,#C7786B)', glyph: <div style={{width: 14, height: 14, borderRadius: 7, background: '#fff'}} />},
  {name: 'Clock', bg: '#2A2927', glyph: <div style={{width: 30, height: 30, borderRadius: 15, background: '#F4F1EA'}} />},
  {name: 'Settings', bg: 'linear-gradient(180deg,#B8B4AD,#8F8B84)', glyph: <div style={{width: 22, height: 22, borderRadius: 11, border: '5px solid #E9E6E0', boxSizing: 'border-box'}} />},
];

const AppIcon: React.FC<{app: (typeof APPS)[number]; label?: boolean}> = ({app, label = true}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 64}}>
    <div
      style={{
        width: 62,
        height: 62,
        borderRadius: 15,
        background: app.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(42,41,39,0.12)',
        overflow: 'hidden',
      }}
    >
      {app.glyph}
    </div>
    {label && <div style={{fontSize: 11.5, color: C.ink, fontWeight: 500}}>{app.name}</div>}
  </div>
);

export const HomeScreen: React.FC<{f: number}> = ({f}) => {
  const doneAmounts = TASKS.map((t) => prog(f, t.at, 10));
  const done = doneAmounts.reduce((a, b) => a + b, 0);
  const allDone = prog(f, 72, 14);
  const widgetIn = pop(f, 2, 16);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(120% 70% at 20% 0%, #E7EDE1 0%, #EFEAE0 55%, #E6DED0 100%)',
        fontFamily: SANS,
      }}
    >
      <StatusBar />
      {/* large widget */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 72,
          height: 330,
          borderRadius: 26,
          background: 'rgba(251,250,246,0.94)',
          boxShadow: '0 10px 30px rgba(60,52,40,0.12)',
          padding: '18px 20px',
          boxSizing: 'border-box',
          transform: `scale(${0.9 + 0.1 * widgetIn})`,
          opacity: Math.min(1, widgetIn * 1.4),
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 7}}>
          <LogoMark size={18} />
          <span style={{fontSize: 12, fontWeight: 600, color: C.mute, letterSpacing: 0.3}}>Plainweek</span>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', marginTop: 8}}>
          <div>
            <div style={{fontFamily: SERIF, fontSize: 32, lineHeight: '34px'}}>Today</div>
            <div style={{fontSize: 13, color: C.inkSoft, marginTop: 2}}>
              {allDone > 0.5 ? 'All done. Enjoy your evening.' : `Tuesday, Oct 27 · ${TASKS.length - Math.round(done)} left`}
            </div>
          </div>
          <div style={{marginLeft: 'auto'}}>
            <Ring size={58} stroke={5} value={done / TASKS.length}>
              <span style={{fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>
                {Math.round(done)}/{TASKS.length}
              </span>
            </Ring>
          </div>
        </div>
        <div style={{height: 1, background: C.line, margin: '14px 0 6px'}} />
        {TASKS.map((t, i) => {
          const d = doneAmounts[i];
          const press = f >= t.at && f < t.at + 10 ? Math.sin(((f - t.at) / 10) * Math.PI) : 0;
          return (
            <div
              key={t.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                height: 44,
                padding: '0 8px',
                margin: '0 -8px',
                borderRadius: 12,
                background: `rgba(139,162,133,${press * 0.16})`,
                transform: `scale(${1 - press * 0.02})`,
              }}
            >
              <CheckCircle size={22} done={d} />
              <span
                style={{
                  fontSize: 16,
                  color: d > 0.5 ? C.mute : C.ink,
                  textDecoration: d > 0.5 ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(156,151,141,0.7)',
                }}
              >
                {t.title}
              </span>
              <span style={{marginLeft: 'auto', fontSize: 12, color: C.mute, fontVariantNumeric: 'tabular-nums'}}>{t.meta}</span>
            </div>
          );
        })}
      </div>
      {/* app grid */}
      <div
        style={{
          position: 'absolute',
          left: 30,
          right: 30,
          top: 432,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 64px)',
          justifyContent: 'space-between',
          rowGap: 22,
          opacity: interpolate(f, [0, 12], [0, 1], {extrapolateRight: 'clamp'}),
        }}
      >
        {APPS.map((a) => (
          <AppIcon key={a.name} app={a} />
        ))}
      </div>
      {/* page dots */}
      <div style={{position: 'absolute', top: 690, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 7}}>
        {[1, 0.35, 0.35].map((o, i) => (
          <div key={i} style={{width: 7, height: 7, borderRadius: 4, background: `rgba(42,41,39,${o * 0.6})`}} />
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
          background: 'rgba(255,255,255,0.45)',
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

export const WIDGET_TICKS = TASKS.filter((t) => t.at > 0).map((t) => t.at);
