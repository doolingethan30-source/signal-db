import {interpolate} from 'remotion';
import {easeInOut, pop, prog} from '../anim';
import {CalendarIcon, CheckBox, Chevron, ClockIcon, Sparkle} from '../components/Icons';
import {Keyboard} from '../components/Keyboard';
import {StatusBar} from '../components/Phone';
import {Ring} from '../components/Ring';
import {A, SANS} from '../theme';
import {cloneWeek, WeekView} from './WeekView';

export const TYPED = 'Finish slides Thursday 4pm';
const TYPE_START = 30;
const PER_CHAR = 1.5;
const DAY_RANGE = [14, 22];
const TIME_RANGE = [23, 26];
const RETURN_AT = 74;
const PUSH_IN = 6;
const POP_OUT = 94;

export const MONDAY_TASKS = [
  {title: 'Morning devotion', time: '07:00', done: 1},
  {title: 'Plan my week', time: '08:00', done: 1},
  {title: 'Finish project', time: '14:00', done: 0},
  {title: 'Evening workout', time: '18:00', done: 0},
];

export const EVENTS = [
  {time: '10:00', title: 'Team Meeting', meta: '1h • Zoom', color: A.blue},
  {time: '12:30', title: 'Lunch with Josh', meta: '1h • Kimberley', color: A.green},
  {time: '15:30', title: 'Client Call', meta: '30 min • Online', color: A.purple},
];

const DetailScreen: React.FC<{f: number}> = ({f}) => {
  const typedCount = Math.max(0, Math.min(TYPED.length, Math.floor((f - TYPE_START) / PER_CHAR)));
  const typed = TYPED.slice(0, typedCount);
  const focus = Math.min(prog(f, 22, 12), 1 - prog(f, RETURN_AT + 2, 12, easeInOut));
  const committed = f >= RETURN_AT;
  const caretOn = f > TYPE_START && f < RETURN_AT && (Math.floor(f / 8) % 2 === 0 || typedCount < TYPED.length);
  const active = typedCount > 0 && f < RETURN_AT ? TYPED[typedCount - 1] : undefined;
  const pressT = ((f - TYPE_START) % PER_CHAR) / PER_CHAR;
  const dayParsed = typedCount >= DAY_RANGE[1];
  const timeParsed = typedCount >= TIME_RANGE[1];
  const dayAt = TYPE_START + DAY_RANGE[1] * PER_CHAR;
  const timeAt = TYPE_START + TIME_RANGE[1] * PER_CHAR;
  const toast = Math.min(pop(f, RETURN_AT + 4, 14), 1 - prog(f, POP_OUT - 2, 8));

  const seg = (from: number, to: number, hl: boolean) => {
    const text = typed.slice(from, Math.min(to, typed.length));
    if (!text) return null;
    return (
      <span
        key={from}
        style={hl ? {background: A.orangeSoft, color: A.orange, borderRadius: 5, padding: '1px 3px', margin: '0 -3px'} : undefined}
      >
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
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 11px',
          borderRadius: 14,
          background: '#fff',
          border: `1px solid ${A.orangeSoft}`,
          boxShadow: '0 4px 10px rgba(29,28,26,0.06)',
          fontSize: 13,
          fontWeight: 600,
          color: A.orange,
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
    <div style={{position: 'absolute', inset: 0, background: '#F4F1ED', fontFamily: SANS, color: A.ink}}>
      <StatusBar color={A.ink} />
      <div style={{position: 'absolute', left: 18, top: 66}}>
        <Chevron size={20} dir="left" color={A.ink} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 18,
          top: 58,
          width: 36,
          height: 36,
          borderRadius: 18,
          background: '#EAE6E0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 4, height: 4, borderRadius: 2, background: A.ink}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 24, top: 112, fontSize: 13, letterSpacing: 3.2, color: A.sub, fontWeight: 500}}>MONDAY</div>
      <div style={{position: 'absolute', left: 24, top: 132, fontSize: 26, fontWeight: 700, letterSpacing: -0.4}}>26 October 2026</div>
      <div style={{position: 'absolute', right: 22, top: 128, display: 'flex', alignItems: 'center', gap: 10}}>
        <span style={{fontSize: 14, color: A.ink}}>2 / 4</span>
        <Ring size={38} stroke={4} value={0.5} />
      </div>
      {/* tasks card */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          top: 190,
          height: 296,
          borderRadius: 22,
          background: '#FBFAF8',
          padding: '10px 18px',
          boxSizing: 'border-box',
        }}
      >
        {MONDAY_TASKS.map((t) => (
          <div key={t.title} style={{display: 'flex', alignItems: 'center', height: 50, gap: 16}}>
            <CheckBox size={25} done={t.done} />
            <span style={{fontSize: 15.5}}>{t.title}</span>
            <span style={{marginLeft: 'auto', fontSize: 15, color: A.sub, fontVariantNumeric: 'tabular-nums'}}>{t.time}</span>
          </div>
        ))}
        <div
          style={{
            marginTop: 10,
            height: 52,
            borderRadius: 26,
            background: '#EFECE7',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px 0 10px',
            gap: 12,
            boxShadow: focus > 0.01 ? `0 0 0 ${1.5 * focus}px rgba(255,90,31,${0.7 * focus})` : 'none',
          }}
        >
          <div style={{width: 32, height: 32, borderRadius: 16, background: '#E2DED7', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path d="M8 2 V14 M2 8 H14" stroke={A.ink} strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{fontSize: 15.5, flex: 1, whiteSpace: 'nowrap'}}>
            {typedCount === 0 || committed ? (
              <span style={{color: A.sub}}>Add a task…</span>
            ) : (
              <>
                {seg(0, DAY_RANGE[0], false)}
                {seg(DAY_RANGE[0], DAY_RANGE[1], dayParsed)}
                {seg(DAY_RANGE[1], TIME_RANGE[0], false)}
                {seg(TIME_RANGE[0], TIME_RANGE[1], timeParsed)}
              </>
            )}
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: 19,
                marginLeft: 1,
                verticalAlign: -4,
                background: A.orange,
                opacity: caretOn ? 1 : 0,
              }}
            />
          </div>
          <ClockIcon size={22} color={A.ink} />
        </div>
      </div>
      {/* today's calendar */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          top: 500,
          height: 262,
          borderRadius: 22,
          background: '#FBFAF8',
          padding: '16px 20px',
          boxSizing: 'border-box',
          opacity: 1 - focus,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <CalendarIcon size={22} color={A.ink} />
          <span style={{fontSize: 15, fontWeight: 600}}>Today’s Calendar</span>
          <span style={{marginLeft: 'auto', fontSize: 13, padding: '5px 12px', borderRadius: 14, background: '#EFECE7', color: '#5A5650'}}>View</span>
        </div>
        {EVENTS.map((e) => (
          <div key={e.title} style={{display: 'flex', gap: 16, marginTop: 18}}>
            <span style={{width: 46, fontSize: 15, fontVariantNumeric: 'tabular-nums', paddingTop: 2}}>{e.time}</span>
            <div style={{width: 3, borderRadius: 2, background: e.color}} />
            <div>
              <div style={{fontSize: 15}}>{e.title}</div>
              <div style={{fontSize: 14, color: A.sub, marginTop: 3}}>{e.meta}</div>
            </div>
          </div>
        ))}
      </div>
      {/* parsed chips */}
      <div style={{position: 'absolute', left: 18, right: 18, top: 504, display: 'flex', gap: 8, zIndex: 3}}>
        {chip(<CalendarIcon size={13} color={A.orange} />, 'Thu, 29 Oct', dayAt)}
        {chip(<ClockIcon size={13} color={A.orange} />, '16:00', timeAt)}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 548,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12.5,
          color: A.sub,
          opacity: committed ? 0 : interpolate(f, [dayAt, dayAt + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          zIndex: 3,
        }}
      >
        <Sparkle size={11} color={A.orange} /> Plainweek understood your date and time
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 290, transform: `translateY(${(1 - focus) * 300}px)`, zIndex: 4}}>
        <Keyboard active={active} pressT={pressT} />
      </div>
      {/* toast */}
      <div
        style={{
          position: 'absolute',
          left: 46,
          right: 46,
          bottom: 40,
          height: 44,
          borderRadius: 22,
          background: A.ink,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 500,
          opacity: Math.max(0, toast),
          transform: `translateY(${(1 - Math.max(0, toast)) * 24}px)`,
          zIndex: 5,
        }}
      >
        <CheckBox size={16} done={1} /> Added to Thursday · 16:00
      </div>
    </div>
  );
};

export const TypeScene: React.FC<{f: number}> = ({f}) => {
  const push = Math.min(prog(f, PUSH_IN, 16, easeInOut), 1 - prog(f, POP_OUT, 16, easeInOut));
  const tap = f < PUSH_IN + 6 ? Math.sin(Math.min(1, f / (PUSH_IN + 6)) * Math.PI) : 0;
  const week = cloneWeek();
  if (f >= POP_OUT) week[3].total = 3;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${-push * 110}px)`}}>
        <WeekView days={week} press={[tap, 0, 0, 0, 0, 0, 0]} highlight={[0, 0, 0, f >= POP_OUT ? 1 : 0, 0, 0, 0]} />
        <div style={{position: 'absolute', inset: 0, background: `rgba(29,28,26,${push * 0.12})`}} />
      </div>
      {push > 0.001 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${(1 - push) * 393}px)`,
            boxShadow: '-12px 0 30px rgba(29,28,26,0.12)',
          }}
        >
          <DetailScreen f={f} />
        </div>
      )}
    </div>
  );
};
