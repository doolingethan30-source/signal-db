import {Check} from '../../components/Icons';
import {Theme, UI} from '../theme';
import {Box, cardStyle, ThemedRing} from '../ui';

const TODAY = [
  {title: 'Morning run', time: '07:00'},
  {title: 'Plan the week', time: '08:30'},
  {title: 'Reply to Sam', time: '11:00'},
  {title: 'Send invoice', time: '16:00'},
];

const widgetBase = (t: Theme): React.CSSProperties => ({
  ...cardStyle(t, 26),
  fontFamily: UI,
  color: t.ink,
  boxShadow: '0 18px 40px rgba(40,25,15,0.16)',
});

export const SmallWidget: React.FC<{t: Theme; done: number}> = ({t, done}) => (
  <div style={{...widgetBase(t), width: 164, height: 164, padding: 16, position: 'relative'}}>
    <div style={{fontSize: 17, lineHeight: '20px'}}>MON</div>
    <div style={{fontSize: 38, fontWeight: 700, lineHeight: '42px', letterSpacing: -1}}>2</div>
    <div style={{fontSize: 9.5, letterSpacing: 1.3, color: t.sub}}>NOVEMBER</div>
    <div style={{fontSize: 20, fontWeight: 700, marginTop: 12, fontVariantNumeric: 'tabular-nums'}}>{Math.round(done)} / 4</div>
    <div style={{fontSize: 12, color: t.sub}}>Today</div>
    <div style={{position: 'absolute', right: 14, top: 14}}>
      <ThemedRing t={t} size={52} stroke={5.5} value={done / 4} />
    </div>
  </div>
);

export const MediumWidget: React.FC<{t: Theme; doneAmounts: number[]}> = ({t, doneAmounts}) => {
  const done = doneAmounts.reduce((a, b) => a + b, 0);
  return (
    <div style={{...widgetBase(t), width: 345, height: 196, padding: '16px 20px'}}>
      <div style={{display: 'flex', alignItems: 'flex-start'}}>
        <div>
          <div style={{fontSize: 22, fontWeight: 700, lineHeight: '26px'}}>Today</div>
          <div style={{fontSize: 13, color: t.sub, marginTop: 2}}>Mon, 2 November</div>
        </div>
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{fontSize: 14, fontWeight: 500, fontVariantNumeric: 'tabular-nums'}}>{Math.round(done)} / 4</span>
          <ThemedRing t={t} size={36} stroke={4} value={done / 4} />
        </div>
      </div>
      <div style={{marginTop: 8}}>
        {TODAY.map((x, i) => (
          <div key={x.title} style={{display: 'flex', alignItems: 'center', gap: 12, height: 30}}>
            <Box t={t} size={20} done={doneAmounts[i]} />
            <span style={{fontSize: 14, color: doneAmounts[i] > 0.5 ? t.sub : t.ink}}>{x.title}</span>
            <span style={{marginLeft: 'auto', fontSize: 13.5, color: t.sub, fontVariantNumeric: 'tabular-nums'}}>{x.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MONTH = Array.from({length: 35}, (_, i) => i - 6); // Nov 2026 starts on a Sunday (Mon-first grid)

export const LargeWidget: React.FC<{t: Theme; doneAmounts: number[]}> = ({t, doneAmounts}) => {
  const done = doneAmounts.reduce((a, b) => a + b, 0);
  return (
    <div style={{...widgetBase(t), width: 345, height: 345, padding: '18px 20px'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span style={{fontSize: 19, fontWeight: 700}}>November 2026</span>
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8}}>
          <span style={{fontSize: 13.5, fontVariantNumeric: 'tabular-nums'}}>{Math.round(done)} / 4</span>
          <ThemedRing t={t} size={30} stroke={3.6} value={done / 4} />
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginTop: 12, rowGap: 6, textAlign: 'center'}}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} style={{fontSize: 11.5, color: t.sub, fontWeight: 600}}>{d}</span>
        ))}
        {MONTH.map((n) => {
          const valid = n >= 1 && n <= 30;
          const today = n === 2;
          return (
            <div key={n} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: 30}}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: today ? t.accent : 'transparent',
                  color: today ? '#fff' : t.ink,
                  fontSize: 13,
                  fontWeight: today ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: valid ? 1 : 0,
                }}
              >
                {valid ? n : ''}
              </div>
              <div style={{width: 4, height: 4, borderRadius: 2, background: t.accent, opacity: [4, 6, 12, 19, 25].includes(n) ? 1 : 0, marginTop: 1}} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Week-at-a-glance strip widget used in the floating 3D shot. */
export const WeekStripWidget: React.FC<{t: Theme; fill: number}> = ({t, fill}) => {
  const vals = [1, 0.66, 0.8, 0.5, 0.75, 0.33, 0.5];
  return (
    <div style={{...widgetBase(t), width: 345, height: 164, padding: '16px 20px'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span style={{fontSize: 17, fontWeight: 700}}>This week</span>
        <span style={{marginLeft: 'auto', fontSize: 13, color: t.sub}}>14 of 22 done</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16}}>
        {vals.map((v, i) => (
          <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <ThemedRing t={t} size={34} stroke={4} value={v * fill}>
              {v * fill > 0.99 ? <Check size={12} color={t.accent} /> : null}
            </ThemedRing>
            <span style={{fontSize: 11.5, color: i === 0 ? t.accent : t.sub, fontWeight: 600}}>{'MTWTFSS'[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
