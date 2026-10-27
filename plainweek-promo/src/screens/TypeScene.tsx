import {interpolate} from 'remotion';
import {easeInOut, pop, prog} from '../anim';
import {CalendarIcon, ClockIcon, Sparkle, TagIcon} from '../components/Icons';
import {Keyboard} from '../components/Keyboard';
import {C, SANS} from '../theme';
import {cloneWeek, WeekView} from './WeekView';

export const TYPED = 'Pick up flowers Thursday 6pm';
const TYPE_START = 14;
const PER_CHAR = 1.65;
const DAY_RANGE = [16, 24];
const TIME_RANGE = [25, 28];
const ADD_AT = 70;

export const typeWeek = (f: number) => {
  const week = cloneWeek();
  const added = prog(f, ADD_AT + 14, 16);
  week[3].tasks.push({
    id: 'h3',
    title: 'Pick up flowers',
    meta: '6:00 PM',
    done: 0,
    size: added,
    glow: added * (1 - prog(f, ADD_AT + 20, 20)),
  });
  return week;
};

export const TypeScene: React.FC<{f: number}> = ({f}) => {
  const typedCount = Math.max(0, Math.min(TYPED.length, Math.floor((f - TYPE_START) / PER_CHAR)));
  const typed = TYPED.slice(0, typedCount);
  const sheetIn = prog(f, 0, 16);
  const sheetOut = prog(f, ADD_AT + 4, 14, easeInOut);
  const sheetY = (1 - sheetIn) * 620 + sheetOut * 640;
  const dim = 0.28 * sheetIn * (1 - sheetOut);
  const dayParsed = typedCount >= DAY_RANGE[1];
  const timeParsed = typedCount >= TIME_RANGE[1];
  const caretOn = Math.floor(f / 8) % 2 === 0 || (f > TYPE_START && typedCount < TYPED.length);
  const active = typedCount > 0 && typedCount < TYPED.length + 1 ? TYPED[typedCount - 1] : undefined;
  const pressT = ((f - TYPE_START) % PER_CHAR) / PER_CHAR;
  const addPress = pop(f, ADD_AT);
  const addScale = f >= ADD_AT ? 1 - 0.1 * Math.sin(Math.min(1, addPress) * Math.PI) : 1;

  const renderTyped = () => {
    const parts: React.ReactNode[] = [];
    const seg = (from: number, to: number, hl: boolean, key: string) => {
      const text = typed.slice(from, Math.min(to, typed.length));
      if (!text) return;
      parts.push(
        <span
          key={key}
          style={
            hl
              ? {
                  background: C.sageSoft,
                  color: C.sageDeep,
                  borderRadius: 6,
                  padding: '0 3px',
                  margin: '0 -3px',
                }
              : undefined
          }
        >
          {text}
        </span>,
      );
    };
    seg(0, DAY_RANGE[0], false, 'a');
    seg(DAY_RANGE[0], DAY_RANGE[1], dayParsed, 'b');
    seg(DAY_RANGE[1], TIME_RANGE[0], false, 'c');
    seg(TIME_RANGE[0], TIME_RANGE[1], timeParsed, 'd');
    return parts;
  };

  const chip = (icon: React.ReactNode, label: string, at: number) => {
    const p = pop(f, at, 12);
    if (f < at) return null;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 11px',
          borderRadius: 14,
          background: C.sageMist,
          border: `1px solid ${C.sageSoft}`,
          fontSize: 13,
          fontWeight: 500,
          color: C.sageDeep,
          transform: `scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 8}px)`,
          opacity: Math.min(1, p * 1.5),
        }}
      >
        {icon}
        {label}
      </div>
    );
  };
  const dayAt = TYPE_START + DAY_RANGE[1] * PER_CHAR;
  const timeAt = TYPE_START + TIME_RANGE[1] * PER_CHAR;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <WeekView days={typeWeek(f)} />
      <div style={{position: 'absolute', inset: 0, background: `rgba(30,28,25,${dim})`}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 560,
          transform: `translateY(${sheetY}px)`,
          background: C.paper,
          borderRadius: '26px 26px 0 0',
          boxShadow: '0 -10px 40px rgba(42,41,39,0.14)',
          overflow: 'hidden',
          fontFamily: SANS,
        }}
      >
        <div style={{width: 38, height: 5, borderRadius: 3, background: '#D6D1C7', margin: '8px auto 0'}} />
        <div style={{display: 'flex', alignItems: 'center', padding: '12px 20px 0'}}>
          <span style={{fontSize: 15, color: C.mute}}>Cancel</span>
          <span style={{flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600}}>New task</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.paper,
              background: typedCount > 0 ? C.ink : '#BDB8AE',
              padding: '6px 14px',
              borderRadius: 14,
              transform: `scale(${addScale})`,
            }}
          >
            Add
          </span>
        </div>
        <div
          style={{
            margin: '18px 20px 0',
            fontSize: 23,
            lineHeight: '32px',
            letterSpacing: -0.3,
            minHeight: 64,
            color: C.ink,
          }}
        >
          {typedCount === 0 ? <span style={{color: '#B9B3A8'}}>Try “Gym every Monday 7am”</span> : renderTyped()}
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 26,
              marginLeft: 2,
              verticalAlign: -5,
              background: C.sage,
              opacity: caretOn ? 1 : 0,
            }}
          />
        </div>
        <div style={{display: 'flex', gap: 8, padding: '14px 20px 0', minHeight: 36}}>
          {chip(<CalendarIcon />, 'Thu, Oct 29', dayAt)}
          {chip(<ClockIcon />, '6:00 PM', timeAt)}
          {chip(<TagIcon />, 'Errands', timeAt + 6)}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '16px 20px 0',
            fontSize: 12,
            color: C.mute,
            opacity: interpolate(f, [dayAt, dayAt + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}
        >
          <Sparkle size={11} color={C.sage} />
          Understood — added to Thursday evening
        </div>
        <Keyboard active={active} pressT={pressT} />
      </div>
    </div>
  );
};
