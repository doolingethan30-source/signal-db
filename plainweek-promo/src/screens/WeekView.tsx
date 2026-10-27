import {CheckCircle} from '../components/Icons';
import {StatusBar} from '../components/Phone';
import {Ring} from '../components/Ring';
import {C, SANS, SERIF} from '../theme';

export type Task = {
  id: string;
  title: string;
  done: number; // 0..1 (animated)
  meta?: string;
  /** 0..1 sage glow for freshly added tasks */
  glow?: number;
  /** render an empty, dashed placeholder instead of the task (drag source) */
  ghost?: number;
  /** collapse height 1 = full, 0 = gone */
  size?: number;
};

export type Day = {short: string; name: string; date: number; tasks: Task[]};

export const ROW_TOP = 160;
export const ROW_H = 90;
export const LINE_H = 17.5;
export const TEXT_X = 80;

/** Top-left point of a task line inside the week list (iOS points). */
export const slotPos = (day: number, slot: number) => ({
  x: 16 + TEXT_X - 2,
  y: ROW_TOP + day * ROW_H + 33 + slot * LINE_H,
});

export const WEEK: Day[] = [
  {short: 'Mon', name: 'Monday', date: 26, tasks: [
    {id: 'm1', title: 'Team stand-up', done: 1},
    {id: 'm2', title: 'Grocery run', done: 1},
    {id: 'm3', title: 'Reply to emails', done: 1},
  ]},
  {short: 'Tue', name: 'Tuesday', date: 27, tasks: [
    {id: 't1', title: 'Write proposal', done: 0},
    {id: 't2', title: 'Yoga class', done: 1},
    {id: 't3', title: 'Pay rent', done: 1},
  ]},
  {short: 'Wed', name: 'Wednesday', date: 28, tasks: [
    {id: 'w1', title: 'Dentist', meta: '2:30 PM', done: 0},
    {id: 'w2', title: 'Read 20 pages', done: 1},
  ]},
  {short: 'Thu', name: 'Thursday', date: 29, tasks: [
    {id: 'h1', title: 'Design review', done: 0},
    {id: 'h2', title: 'Water the plants', done: 0},
  ]},
  {short: 'Fri', name: 'Friday', date: 30, tasks: [
    {id: 'f1', title: 'Ship v2.1', done: 0},
    {id: 'f2', title: 'Dinner reservation', meta: '7:30 PM', done: 0},
  ]},
  {short: 'Sat', name: 'Saturday', date: 31, tasks: [
    {id: 's1', title: 'Farmers market', done: 0},
    {id: 's2', title: 'Long run · 10k', done: 0},
  ]},
  {short: 'Sun', name: 'Sunday', date: 1, tasks: [
    {id: 'u1', title: 'Sunday review', done: 0},
    {id: 'u2', title: 'Meal prep', done: 0},
  ]},
];

export const cloneWeek = (): Day[] => WEEK.map((d) => ({...d, tasks: d.tasks.map((t) => ({...t}))}));

export const WeekView: React.FC<{
  days: Day[];
  /** per-row entrance 0..1 */
  appear?: number[];
  /** multiplies ring fill (for the draw-on animation) */
  ringScale?: number;
  /** per-row drop-zone highlight 0..1 */
  dropZone?: number[];
  today?: number;
  subtitle?: string;
}> = ({days, appear, ringScale = 1, dropZone, today = 1, subtitle}) => {
  const total = days.reduce((a, d) => a + d.tasks.filter((t) => !t.ghost).length, 0);
  const done = days.reduce((a, d) => a + d.tasks.filter((t) => !t.ghost && t.done > 0.5).length, 0);
  return (
    <div style={{position: 'absolute', inset: 0, background: C.paper}}>
      <StatusBar />
      <div style={{position: 'absolute', left: 24, top: 62, right: 24}}>
        <div style={{fontSize: 11, letterSpacing: 2.2, fontWeight: 600, color: C.mute}}>OCT 26 – NOV 1</div>
        <div style={{fontFamily: SERIF, fontSize: 40, lineHeight: '46px', marginTop: 2, letterSpacing: -0.3}}>This week</div>
        <div style={{fontSize: 13, color: C.inkSoft, marginTop: 4}}>
          {subtitle ?? `${done} of ${total} done · you're on track`}
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 18,
            width: 42,
            height: 42,
            borderRadius: 21,
            background: C.ink,
            color: C.paper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 300,
            boxShadow: '0 6px 14px rgba(42,41,39,0.18)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 2 V14 M2 8 H14" stroke={C.paper} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {days.map((day, i) => {
        const a = appear ? appear[i] : 1;
        const visible = day.tasks.filter((t) => !t.ghost || t.ghost > 0);
        // weights let rings glide when tasks are added, removed or dragged
        const count = day.tasks.reduce((s, t) => s + (t.size ?? 1), 0);
        const doneCount = day.tasks.filter((t) => !t.ghost).reduce((s, t) => s + Math.min(1, t.done) * (t.size ?? 1), 0);
        const value = count ? (doneCount / count) * ringScale : 0;
        const isToday = i === today;
        const dz = dropZone ? dropZone[i] : 0;
        return (
          <div
            key={day.short}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: ROW_TOP + i * ROW_H,
              height: ROW_H - 8,
              borderRadius: 18,
              background: isToday ? C.sageMist : C.card,
              border: `1px solid ${dz > 0.01 ? `rgba(103,127,97,${0.25 + dz * 0.6})` : isToday ? C.sageSoft : 'rgba(232,227,217,0.9)'}`,
              boxShadow: '0 1px 2px rgba(42,41,39,0.04), 0 6px 18px rgba(42,41,39,0.04)',
              opacity: a,
              transform: `translateY(${(1 - a) * 26}px) scale(${1 + dz * 0.012})`,
              boxSizing: 'border-box',
            }}
          >
            <div style={{position: 'absolute', left: 14, top: 17}}>
              <Ring size={46} stroke={3.6} value={value} track={isToday ? '#D4DDCD' : C.line}>
                <div style={{textAlign: 'center', lineHeight: 1}}>
                  <div style={{fontSize: 8.5, letterSpacing: 0.8, color: C.mute, fontWeight: 600}}>{day.short.toUpperCase()}</div>
                  <div style={{fontSize: 15, fontWeight: 600, marginTop: 2}}>{day.date}</div>
                </div>
              </Ring>
            </div>
            <div style={{position: 'absolute', left: TEXT_X, top: 11, right: 14, display: 'flex', alignItems: 'center'}}>
              <span style={{fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1}}>{day.name}</span>
              {isToday && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 10,
                    fontWeight: 600,
                    color: C.sageDeep,
                    background: C.sageSoft,
                    padding: '2px 7px',
                    borderRadius: 10,
                  }}
                >
                  Today
                </span>
              )}
              <span style={{marginLeft: 'auto', fontSize: 11.5, color: C.mute, fontVariantNumeric: 'tabular-nums'}}>
                {Math.round(doneCount)}/{Math.round(count)}
              </span>
            </div>
            <div style={{position: 'absolute', left: TEXT_X - 2, top: 33, right: 12}}>
              {visible.map((t) => {
                const size = t.size ?? 1;
                if (t.ghost) {
                  return (
                    <div key={t.id} style={{height: LINE_H * size, opacity: t.ghost * size, overflow: 'hidden'}}>
                      <div
                        style={{
                          height: LINE_H - 3,
                          marginTop: 1,
                          width: 150,
                          borderRadius: 6,
                          border: `1.2px dashed ${C.sage}`,
                          background: 'rgba(139,162,133,0.08)',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  );
                }
                return (
                  <div
                    key={t.id}
                    style={{
                      height: LINE_H * size,
                      opacity: size,
                      overflow: 'visible',
                      position: 'relative',
                    }}
                  >
                    <TaskLine task={t} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const TaskLine: React.FC<{task: Task; fontSize?: number}> = ({task, fontSize = 12.5}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      height: LINE_H,
      position: 'relative',
      fontFamily: SANS,
    }}
  >
    {task.glow ? (
      <div
        style={{
          position: 'absolute',
          left: -6,
          right: 40,
          top: 0,
          bottom: 0,
          borderRadius: 8,
          background: `rgba(139,162,133,${0.28 * task.glow})`,
        }}
      />
    ) : null}
    <CheckCircle size={12} done={task.done} />
    <span
      style={{
        fontSize,
        color: task.done > 0.5 ? C.mute : C.ink,
        textDecoration: task.done > 0.5 ? 'line-through' : 'none',
        textDecorationColor: 'rgba(156,151,141,0.7)',
        whiteSpace: 'nowrap',
        position: 'relative',
      }}
    >
      {task.title}
    </span>
    {task.meta && (
      <span style={{fontSize: 10.5, color: C.sageDeep, fontWeight: 500, position: 'relative'}}>{task.meta}</span>
    )}
  </div>
);
