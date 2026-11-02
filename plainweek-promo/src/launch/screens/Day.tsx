import {interpolate} from 'remotion';
import {easeInOut, pop, prog} from '../../anim';
import {CalendarIcon, Chevron, ClockIcon, Sparkle} from '../../components/Icons';
import {Keyboard} from '../../components/Keyboard';
import {Theme, UI} from '../theme';
import {Box, cardStyle, Status, ThemedRing, Touch} from '../ui';

export const TYPED = 'Dinner with Maya Friday 7pm';
const DAY_RANGE = [17, 23];
const TIME_RANGE = [24, 27];
export const TYPE_START = 26;
export const PER_CHAR = 1.45;
export const RETURN_AT = 72;

const TASKS = [
  {title: 'Morning run', time: '07:00', done: 1},
  {title: 'Plan the week', time: '08:30', done: 1},
  {title: 'Reply to Sam', time: '11:00', done: 0},
  {title: 'Send invoice', time: '16:00', done: 0},
];
const EVENTS = [
  {time: '10:00', title: 'Team stand-up', meta: '30 min • Zoom', color: '#5B8DEF'},
  {time: '12:30', title: 'Lunch with Ana', meta: '1h • Café Nord', color: '#3FAE6E'},
  {time: '15:00', title: 'Client call', meta: '45 min • Online', color: '#8E6CE8'},
];

/** Day detail with natural-language entry in the "Add a task…" field. `f` is local to the typing scene. */
export const Day: React.FC<{t: Theme; f: number}> = ({t, f}) => {
  const typedCount = Math.max(0, Math.min(TYPED.length, Math.floor((f - TYPE_START) / PER_CHAR)));
  const typed = TYPED.slice(0, typedCount);
  const focus = Math.min(prog(f, 16, 12), 1 - prog(f, RETURN_AT + 2, 12, easeInOut));
  const committed = f >= RETURN_AT;
  const caretOn = f > TYPE_START - 6 && !committed && (Math.floor(f / 8) % 2 === 0 || typedCount < TYPED.length);
  const active = typedCount > 0 && !committed ? TYPED[typedCount - 1] : undefined;
  const pressT = ((f - TYPE_START) % PER_CHAR) / PER_CHAR;
  const dayAt = TYPE_START + DAY_RANGE[1] * PER_CHAR;
  const timeAt = TYPE_START + TIME_RANGE[1] * PER_CHAR;
  const toast = Math.min(pop(f, RETURN_AT + 4, 14), 1 - prog(f, 100, 8));

  const seg = (from: number, to: number, hl: boolean) => {
    const text = typed.slice(from, Math.min(to, typed.length));
    if (!text) return null;
    return (
      <span key={from} style={hl ? {background: t.accentSoft, color: t.accent, borderRadius: 5, padding: '1px 3px', margin: '0 -3px'} : undefined}>
        {text}
      </span>
    );
  };
  const chip = (icon: React.ReactNode, label: string, at: number) => {
    if (f < at || committed) return null;
    const p = pop(f, at, 12);
    return (
      <div
        style={{
          ...cardStyle(t, 14),
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          fontSize: 14,
          fontWeight: 600,
          color: t.accent,
          transform: `scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 8}px)`,
          opacity: Math.min(1, p * 1.5),
        }}
      >
        {icon}
        {label}
      </div>
    );
  };

  return (
    <div style={{position: 'absolute', inset: 0, background: t.bg, fontFamily: UI, color: t.ink, overflow: 'hidden'}}>
      <Status t={t} />
      <div style={{position: 'absolute', left: 18, top: 66}}>
        <Chevron size={20} dir="left" color={t.ink} />
      </div>
      <div style={{position: 'absolute', left: 24, top: 108, fontSize: 13, letterSpacing: 3.2, color: t.sub, fontWeight: 500}}>MONDAY</div>
      <div style={{position: 'absolute', left: 24, top: 128, fontSize: 27, fontWeight: 700, letterSpacing: -0.5}}>2 November 2026</div>
      <div style={{position: 'absolute', right: 22, top: 124, display: 'flex', alignItems: 'center', gap: 10}}>
        <span style={{fontSize: 14}}>2 / 4</span>
        <ThemedRing t={t} size={38} stroke={4} value={0.5} />
      </div>
      <div style={{...cardStyle(t, 22), position: 'absolute', left: 14, right: 14, top: 186, height: 300, padding: '10px 18px'}}>
        {TASKS.map((x) => (
          <div key={x.title} style={{display: 'flex', alignItems: 'center', height: 50, gap: 16}}>
            <Box t={t} size={24} done={x.done} />
            <span style={{fontSize: 16, color: x.done ? t.sub : t.ink, textDecoration: x.done ? 'line-through' : 'none'}}>{x.title}</span>
            <span style={{marginLeft: 'auto', fontSize: 15, color: t.sub, fontVariantNumeric: 'tabular-nums'}}>{x.time}</span>
          </div>
        ))}
        <div
          style={{
            marginTop: 12,
            height: 54,
            borderRadius: 27,
            background: t.card2,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px 0 10px',
            gap: 12,
            boxShadow: focus > 0.01 ? `0 0 0 ${1.6 * focus}px rgba(224,122,63,${0.75 * focus})` : 'none',
          }}
        >
          <div style={{width: 32, height: 32, borderRadius: 16, background: t.line, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path d="M8 2 V14 M2 8 H14" stroke={t.ink} strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{fontSize: 16, flex: 1, whiteSpace: 'nowrap'}}>
            {typedCount === 0 || committed ? (
              <span style={{color: t.sub}}>Add a task…</span>
            ) : (
              <>
                {seg(0, DAY_RANGE[0], false)}
                {seg(DAY_RANGE[0], DAY_RANGE[1], typedCount >= DAY_RANGE[1])}
                {seg(DAY_RANGE[1], TIME_RANGE[0], false)}
                {seg(TIME_RANGE[0], TIME_RANGE[1], typedCount >= TIME_RANGE[1])}
              </>
            )}
            <span style={{display: 'inline-block', width: 2, height: 19, marginLeft: 1, verticalAlign: -4, background: t.accent, opacity: caretOn ? 1 : 0}} />
          </div>
          <ClockIcon size={22} color={t.ink} />
        </div>
      </div>
      <div style={{...cardStyle(t, 22), position: 'absolute', left: 14, right: 14, top: 500, height: 262, padding: '16px 20px', opacity: 1 - focus}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <CalendarIcon size={22} color={t.ink} />
          <span style={{fontSize: 15.5, fontWeight: 600}}>Today’s Calendar</span>
        </div>
        {EVENTS.map((e) => (
          <div key={e.title} style={{display: 'flex', gap: 16, marginTop: 18}}>
            <span style={{width: 46, fontSize: 15, fontVariantNumeric: 'tabular-nums', paddingTop: 2}}>{e.time}</span>
            <div style={{width: 3, borderRadius: 2, background: e.color}} />
            <div>
              <div style={{fontSize: 15.5}}>{e.title}</div>
              <div style={{fontSize: 14, color: t.sub, marginTop: 3}}>{e.meta}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 18, right: 18, top: 504, display: 'flex', gap: 8, zIndex: 3}}>
        {chip(<CalendarIcon size={14} color={t.accent} />, 'Fri, 6 Nov', dayAt)}
        {chip(<ClockIcon size={14} color={t.accent} />, '19:00', timeAt)}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 552,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: t.sub,
          zIndex: 3,
          opacity: committed ? 0 : interpolate(f, [dayAt, dayAt + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        <Sparkle size={12} color={t.accent} /> Understood: Friday, 7:00 PM
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 290, transform: `translateY(${(1 - focus) * 300}px)`, zIndex: 4}}>
        <Keyboard active={active} pressT={pressT} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 50,
          right: 50,
          bottom: 40,
          height: 46,
          borderRadius: 23,
          background: t.dark > 0.5 ? '#F5F2ED' : '#1C1B19',
          color: t.dark > 0.5 ? '#1C1B19' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 14.5,
          fontWeight: 600,
          opacity: Math.max(0, toast),
          transform: `translateY(${(1 - Math.max(0, toast)) * 24}px)`,
          zIndex: 5,
        }}
      >
        <Box t={t} size={17} done={1} /> Added to Friday · 19:00
      </div>
      <Touch f={f} at={14} x={200} y={438} t={t} />
      <Touch f={f} at={RETURN_AT} x={346} y={752} t={t} />
    </div>
  );
};
