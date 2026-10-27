import {Chevron} from '../components/Icons';
import {StatusBar} from '../components/Phone';
import {Ring} from '../components/Ring';
import {TabBar} from '../components/TabBar';
import {A, SANS} from '../theme';

export type Day = {
  short: string;
  name: string;
  date: number;
  month: string;
  /** done/total may be fractional while animating so rings glide */
  done: number;
  total: number;
};

export const ROW_TOP = 208;
export const ROW_H = 76;
export const ROW_GAP = 6;

/** Centre-left anchor of a day card (iOS points), used by the drag overlay. */
export const rowPos = (day: number) => ({x: 16, y: ROW_TOP + day * ROW_H, w: 361, h: ROW_H - ROW_GAP});

export const WEEK: Day[] = [
  {short: 'Mon', name: 'MONDAY', date: 26, month: 'October', done: 2, total: 4},
  {short: 'Tue', name: 'TUESDAY', date: 27, month: 'October', done: 0, total: 3},
  {short: 'Wed', name: 'WEDNESDAY', date: 28, month: 'October', done: 1, total: 5},
  {short: 'Thu', name: 'THURSDAY', date: 29, month: 'October', done: 0, total: 2},
  {short: 'Fri', name: 'FRIDAY', date: 30, month: 'October', done: 0, total: 4},
  {short: 'Sat', name: 'SATURDAY', date: 31, month: 'October', done: 0, total: 3},
  {short: 'Sun', name: 'SUNDAY', date: 1, month: 'November', done: 0, total: 2},
];

export const cloneWeek = (): Day[] => WEEK.map((d) => ({...d}));

const fmt = (n: number) => Math.round(n);

export const WeekView: React.FC<{
  days: Day[];
  /** per-row entrance 0..1 */
  appear?: number[];
  /** multiplies ring fill (for the draw-on animation) */
  ringScale?: number;
  /** per-row orange outline (drop zone / just-updated) 0..1 */
  highlight?: number[];
  /** per-row press feedback 0..1 */
  press?: number[];
  today?: number;
}> = ({days, appear, ringScale = 1, highlight, press, today = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: A.bg, fontFamily: SANS, color: A.ink}}>
    <StatusBar color={A.ink} />
    {/* month header */}
    <div style={{position: 'absolute', left: 22, right: 20, top: 64, display: 'flex', alignItems: 'center'}}>
      <span style={{fontSize: 21, fontWeight: 600, letterSpacing: -0.3}}>October 2026</span>
      <span style={{marginLeft: 6, marginTop: 3}}>
        <Chevron size={12} dir="down" color={A.ink} />
      </span>
      <div style={{marginLeft: 'auto', display: 'flex', gap: 10}}>
        {(['left', 'right'] as const).map((d) => (
          <div
            key={d}
            style={{width: 36, height: 36, borderRadius: 18, background: A.card, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          >
            <Chevron size={14} dir={d} color={A.ink} />
          </div>
        ))}
      </div>
    </div>
    {/* week strip */}
    <div style={{position: 'absolute', left: 14, right: 14, top: 122, display: 'flex', justifyContent: 'space-between'}}>
      {days.map((d, i) => (
        <div key={d.short} style={{width: 46, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <span style={{fontSize: 12.5, color: A.sub}}>{d.short}</span>
          <div
            style={{
              marginTop: 6,
              width: 34,
              height: 34,
              borderRadius: 17,
              background: i === today ? A.orange : 'transparent',
              color: i === today ? '#fff' : A.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15.5,
              fontWeight: i === today ? 600 : 500,
            }}
          >
            {d.date}
          </div>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              marginTop: 3,
              background: A.orange,
              opacity: (i === 2 || i === 5) && i !== today ? 1 : 0,
            }}
          />
        </div>
      ))}
    </div>
    {days.map((day, i) => {
      const a = appear ? appear[i] : 1;
      const hl = highlight ? highlight[i] : 0;
      const pr = press ? press[i] : 0;
      const isToday = i === today;
      const value = day.total ? (day.done / day.total) * ringScale : 0;
      const pos = rowPos(i);
      return (
        <div
          key={day.short}
          style={{
            position: 'absolute',
            left: pos.x,
            width: pos.w,
            top: pos.y,
            height: pos.h,
            borderRadius: 16,
            background: isToday ? A.todayCard : A.card,
            boxShadow: hl > 0.01 ? `0 0 0 ${1.5 + hl}px rgba(255,90,31,${hl * 0.85}), 0 8px 20px rgba(255,90,31,${hl * 0.14})` : 'none',
            opacity: a,
            transform: `translateY(${(1 - a) * 24}px) scale(${(1 + hl * 0.015) * (1 - pr * 0.025)})`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px 0 18px',
            boxSizing: 'border-box',
          }}
        >
          <div>
            <div style={{fontSize: 17, fontWeight: 700, letterSpacing: 0.1}}>{day.name}</div>
            <div style={{fontSize: 13, color: A.sub, marginTop: 3}}>
              {day.date} {day.month} 2026
            </div>
          </div>
          <span style={{marginLeft: 'auto', fontSize: 13.5, color: A.sub, fontVariantNumeric: 'tabular-nums', marginRight: 12}}>
            {fmt(day.done)} / {fmt(day.total)}
          </span>
          <Ring size={30} stroke={3.4} value={value} />
          <span style={{marginLeft: 14}}>
            <Chevron size={13} />
          </span>
        </div>
      );
    })}
    <TabBar active="Week" />
  </div>
);
