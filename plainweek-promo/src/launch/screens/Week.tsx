import {Chevron} from '../../components/Icons';
import {Theme, UI} from '../theme';
import {Blobs, cardStyle, Status, Tabs, ThemedRing} from '../ui';

export type DayRow = {short: string; name: string; date: number; month: string; done: number; total: number};

export const W_ROW_TOP = 210;
export const W_ROW_H = 76;
export const rowY = (i: number) => W_ROW_TOP + i * W_ROW_H;

export const WEEK_DATA: DayRow[] = [
  {short: 'Mon', name: 'MONDAY', date: 2, month: 'November', done: 2, total: 4},
  {short: 'Tue', name: 'TUESDAY', date: 3, month: 'November', done: 0, total: 3},
  {short: 'Wed', name: 'WEDNESDAY', date: 4, month: 'November', done: 1, total: 5},
  {short: 'Thu', name: 'THURSDAY', date: 5, month: 'November', done: 0, total: 2},
  {short: 'Fri', name: 'FRIDAY', date: 6, month: 'November', done: 0, total: 2},
  {short: 'Sat', name: 'SATURDAY', date: 7, month: 'November', done: 0, total: 3},
  {short: 'Sun', name: 'SUNDAY', date: 8, month: 'November', done: 0, total: 2},
];
export const weekData = (): DayRow[] => WEEK_DATA.map((d) => ({...d}));

export const Week: React.FC<{
  t: Theme;
  days: DayRow[];
  appear?: number[];
  ringScale?: number;
  highlight?: number[];
  press?: number[];
  drift?: number;
}> = ({t, days, appear, ringScale = 1, highlight, press, drift = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: t.bg, fontFamily: UI, color: t.ink, overflow: 'hidden'}}>
    <Blobs t={t} drift={drift} />
    <Status t={t} />
    <div style={{position: 'absolute', left: 22, right: 20, top: 64, display: 'flex', alignItems: 'center'}}>
      <span style={{fontSize: 22, fontWeight: 700, letterSpacing: -0.4}}>November 2026</span>
      <span style={{marginLeft: 6, marginTop: 3}}>
        <Chevron size={12} dir="down" color={t.ink} />
      </span>
      <div style={{marginLeft: 'auto', display: 'flex', gap: 10}}>
        {(['left', 'right'] as const).map((d) => (
          <div key={d} style={{...cardStyle(t, 18), width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none'}}>
            <Chevron size={14} dir={d} color={t.ink} />
          </div>
        ))}
      </div>
    </div>
    <div style={{position: 'absolute', left: 14, right: 14, top: 122, display: 'flex', justifyContent: 'space-between'}}>
      {days.map((d, i) => (
        <div key={d.short} style={{width: 46, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <span style={{fontSize: 12.5, color: t.sub}}>{d.short}</span>
          <div
            style={{
              marginTop: 6,
              width: 34,
              height: 34,
              borderRadius: 17,
              background: i === 0 ? t.accent : 'transparent',
              color: i === 0 ? '#fff' : t.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15.5,
              fontWeight: i === 0 ? 600 : 500,
            }}
          >
            {d.date}
          </div>
          <div style={{width: 4, height: 4, borderRadius: 2, marginTop: 3, background: t.accent, opacity: i === 2 || i === 4 ? 1 : 0}} />
        </div>
      ))}
    </div>
    {days.map((day, i) => {
      const a = appear ? appear[i] : 1;
      const hl = highlight ? highlight[i] : 0;
      const pr = press ? press[i] : 0;
      const value = day.total ? (day.done / day.total) * ringScale : 0;
      return (
        <div
          key={day.short}
          style={{
            ...cardStyle(t, 18),
            position: 'absolute',
            left: 16,
            width: 361,
            top: rowY(i),
            height: W_ROW_H - 7,
            background: i === 0 && t.glass < 0.5 ? `linear-gradient(100deg, ${t.accentSoft} 0%, ${t.card} 75%)` : t.card,
            boxShadow: hl > 0.01 ? `0 0 0 ${1.5 + hl}px rgba(224,122,63,${hl * 0.9}), 0 10px 24px rgba(224,122,63,${hl * 0.18})` : t.shadow,
            opacity: a,
            transform: `translateY(${(1 - a) * 26}px) scale(${(1 + hl * 0.015) * (1 - pr * 0.025)})`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px 0 18px',
          }}
        >
          <div>
            <div style={{fontSize: 16.5, fontWeight: 700, letterSpacing: 0.2}}>{day.name}</div>
            <div style={{fontSize: 13, color: t.sub, marginTop: 3}}>
              {day.date} {day.month} 2026
            </div>
          </div>
          <span style={{marginLeft: 'auto', fontSize: 13.5, color: t.sub, fontVariantNumeric: 'tabular-nums', marginRight: 12}}>
            {Math.round(day.done)} / {Math.round(day.total)}
          </span>
          <ThemedRing t={t} size={30} stroke={3.4} value={value} />
          <span style={{marginLeft: 14}}>
            <Chevron size={13} color={t.sub} />
          </span>
        </div>
      );
    })}
    <Tabs t={t} active="Week" />
  </div>
);
