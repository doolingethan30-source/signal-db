import {easeInOut, mix, pop, prog} from '../../anim';
import {Check, Chevron, Sparkle} from '../../components/Icons';
import {Ring} from '../../components/Ring';
import {LIGHT_THEME} from '../../launch/theme';
import {Touch} from '../../launch/ui';
import {C} from '../theme';
import {DayCard, Header, IconCarry, IconReset, PhoneStatus, TabBar, ui} from '../ui';

const T = LIGHT_THEME;
const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Strip: React.FC<{start: number; selected: number; dots?: number[]}> = ({start, selected, dots = []}) => (
  <div style={{position: 'absolute', left: 10, right: 10, top: 126, display: 'flex', justifyContent: 'space-between', fontFamily: ui}}>
    {SHORT.map((d, i) => (
      <div key={d} style={{width: 50, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <span style={{fontSize: 13, color: C.sub}}>{d}</span>
        <div style={{marginTop: 8, width: 40, height: 40, borderRadius: 20, background: i === selected ? C.orange : 'transparent', color: i === selected ? '#fff' : C.ink, fontSize: 17, fontWeight: i === selected ? 600 : 500, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{start + i}</div>
        <div style={{width: 5, height: 5, borderRadius: 3, marginTop: 4, background: C.orange, opacity: dots.includes(i) ? 1 : 0}} />
      </div>
    ))}
  </div>
);

/** This week (Nov 2–8), as in the app on a Sunday evening. */
export const ThisWeek: React.FC<{press?: number}> = ({press = 0}) => {
  const counts: [number, number][] = [[0, 0], [0, 0], [0, 0], [2, 2], [0, 1], [0, 0], [0, 0]];
  return (
    <div style={{position: 'absolute', inset: 0, background: C.paper, fontFamily: ui, color: C.ink, overflow: 'hidden'}}>
      <PhoneStatus />
      <Header />
      <Strip start={2} selected={6} dots={[4]} />
      <div style={{position: 'absolute', left: 14, right: 14, top: 206, height: 46, borderRadius: 23, background: '#fff', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', fontSize: 13.5, whiteSpace: 'nowrap', transform: `scale(${1 - press * 0.03})`, boxShadow: press ? `0 0 0 ${2 * press}px rgba(218,122,68,0.6)` : 'none'}}>
        <IconReset />
        <span>
          <b style={{fontWeight: 600}}>Weekly reset</b> · set up next week in 3 min
        </span>
        <span style={{marginLeft: 'auto'}}>
          <Chevron size={12} color={C.sub} />
        </span>
      </div>
      <div style={{position: 'absolute', left: 14, right: 14, top: 262, height: 42, borderRadius: 21, background: C.orangeSoft, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', fontSize: 14, color: C.orange, fontWeight: 500}}>
        <IconCarry />1 unfinished from earlier · Move to today
      </div>
      {DAYS.map((d, i) => (
        <DayCard key={d} name={d} date={`${2 + i} November 2026`} done={counts[i][0]} total={counts[i][1]} today={i === 6} style={{position: 'absolute', left: 14, right: 14, top: 316 + i * 68}} />
      ))}
      <TabBar active="week" />
    </div>
  );
};

/** Next week (Nov 9–15): Wednesday is overloaded until "Balance week" spreads it out. f is local. */
const BEFORE = [3, 2, 7, 2, 3, 0, 0];
const AFTER = [3, 3, 3, 3, 3, 1, 1];
export const BALANCE_TAP = 30;
const MOVES = [
  {to: 1, at: 0},
  {to: 3, at: 5},
  {to: 5, at: 10},
  {to: 6, at: 15},
];
const cardTop = (i: number) => 262 + i * 68;
export const NextWeek: React.FC<{f: number}> = ({f}) => {
  const heavyK = Math.min(prog(f, 4, 10), 1 - prog(f, BALANCE_TAP + 26, 12));
  const counts = BEFORE.map((b, i) => {
    let v = b;
    MOVES.forEach((m) => {
      const k = prog(f, BALANCE_TAP + 8 + m.at + 14, 6);
      if (i === 2) v -= k;
      if (i === m.to) v += k;
    });
    return v;
  });
  const balanced = f >= BALANCE_TAP + 44;
  const press = f >= BALANCE_TAP && f < BALANCE_TAP + 8 ? Math.sin(((f - BALANCE_TAP) / 8) * Math.PI) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.paper, fontFamily: ui, color: C.ink, overflow: 'hidden'}}>
      <PhoneStatus />
      <Header />
      <Strip start={9} selected={0} dots={[0, 1, 2, 3, 4]} />
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          top: 206,
          height: 44,
          borderRadius: 22,
          background: balanced ? '#E5F3EA' : C.orangeSoft,
          color: balanced ? '#2F8A57' : C.orange,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          fontSize: 14,
          fontWeight: 600,
          transform: `scale(${1 - press * 0.03})`,
        }}
      >
        {balanced ? <Check size={16} color="#2F8A57" /> : <Sparkle size={14} color={C.orange} />}
        {balanced ? 'Balanced · 17 tasks across 7 days' : 'Wednesday looks heavy'}
        {!balanced && <span style={{marginLeft: 'auto', background: C.orange, color: '#fff', padding: '5px 12px', borderRadius: 14, fontSize: 13}}>Balance week</span>}
      </div>
      {DAYS.map((d, i) => (
        <DayCard
          key={d}
          name={d}
          date={`${9 + i} November 2026`}
          done={0}
          total={counts[i]}
          heavy={i === 2 ? heavyK : 0}
          glow={MOVES.some((m) => m.to === i) ? Math.min(prog(f, BALANCE_TAP + 22, 6), 1 - prog(f, BALANCE_TAP + 50, 14)) : 0}
          style={{position: 'absolute', left: 14, right: 14, top: cardTop(i)}}
        />
      ))}
      {/* tasks flying out of Wednesday into lighter days */}
      {MOVES.map((m, j) => {
        const k = prog(f, BALANCE_TAP + 8 + m.at, 16, easeInOut);
        if (k <= 0 || k >= 1) return null;
        const y = mix(cardTop(2) + 14, cardTop(m.to) + 14, k);
        const x = 150 + Math.sin(k * Math.PI) * (m.to > 2 ? 90 : -60);
        return (
          <div key={j} style={{position: 'absolute', left: x, top: y, padding: '6px 12px', borderRadius: 14, background: '#fff', boxShadow: '0 10px 22px rgba(0,0,0,0.16), 0 0 0 1.5px rgba(218,122,68,0.6)', fontSize: 12.5, fontWeight: 600, zIndex: 30}}>
            {['Write report', 'Groceries', 'Laundry', 'Plan dinner'][j]}
          </div>
        );
      })}
      <TabBar active="week" />
      <Touch f={f} at={BALANCE_TAP} x={330} y={228} t={T} />
    </div>
  );
};

/** Month view (Nov 2026), dots fill in across next week as it locks in. f is local. */
export const MonthView: React.FC<{f: number}> = ({f}) => {
  const first = -5; // grid starts Mon 26 Oct (n = day of November)
  const cells = Array.from({length: 42}, (_, i) => first + i);
  const ready = pop(f, 64, 14);
  return (
    <div style={{position: 'absolute', inset: 0, background: C.paper, fontFamily: ui, color: C.ink, overflow: 'hidden'}}>
      <PhoneStatus />
      <Header icons={false} />
      <div style={{position: 'absolute', left: 14, right: 14, top: 130, height: 400, borderRadius: 30, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', padding: '18px 10px 0'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: 12.5, color: C.sub}}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 6, marginTop: 10}}>
          {cells.map((n) => {
            const inMonth = n >= 1 && n <= 30;
            const label = n < 1 ? 31 + n : n > 30 ? n - 30 : n;
            const next = n >= 9 && n <= 15;
            const dot = next ? prog(f, 6 + (n - 9) * 5, 8) : n === 5 || n === 6 ? 1 : 0;
            const sel = n === 8;
            return (
              <div key={n} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: 50}}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: sel ? C.orange : next ? `rgba(218,122,68,${0.12 * dot})` : 'transparent',
                    color: sel ? '#fff' : inMonth ? C.ink : '#B8B1A8',
                    fontSize: 16,
                    fontWeight: sel ? 600 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {label}
                </div>
                <div style={{width: 5, height: 5, borderRadius: 3, marginTop: 2, background: n === 5 ? '#B8B1A8' : C.orange, opacity: dot, transform: `scale(${0.4 + 0.6 * dot})`}} />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 22, right: 22, top: 552, display: 'flex', alignItems: 'flex-end'}}>
        <div>
          <div style={{fontSize: 12.5, letterSpacing: 2.2, color: C.label, fontWeight: 600}}>NEXT WEEK</div>
          <div style={{fontSize: 19, fontWeight: 600, marginTop: 2}}>9 – 15 November 2026</div>
        </div>
        <span style={{marginLeft: 'auto', color: C.orange, fontSize: 15, fontWeight: 500}}>Open week</span>
      </div>
      <div style={{position: 'absolute', left: 14, right: 14, top: 616, borderRadius: 28, background: '#fff', padding: 14}}>
        <div style={{height: 54, borderRadius: 27, background: '#F3F0EC', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', fontSize: 15.5, color: C.sub}}>
          <span style={{fontSize: 24, fontWeight: 300, color: C.ink}}>+</span>Add a task… try “Call Josh fri 3pm”
        </div>
      </div>
      {/* "Week ready" toast */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          top: 470,
          height: 58,
          borderRadius: 29,
          background: C.ink,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontSize: 16,
          fontWeight: 600,
          opacity: Math.min(1, ready * 1.4),
          transform: `translateY(${(1 - ready) * 20}px) scale(${0.9 + 0.1 * ready})`,
          boxShadow: '0 16px 36px rgba(0,0,0,0.25)',
          zIndex: 25,
        }}
      >
        <Check size={17} color={C.orange} /> Week ready · reminders set
      </div>
      <TabBar active="month" />
    </div>
  );
};

// ---------- the Weekly reset flow (a sheet over the week) ----------
const SheetFrame: React.FC<{step: number; children: React.ReactNode; button: string; buttonDone?: boolean; press?: number}> = ({step, children, button, buttonDone, press = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: C.paper, fontFamily: ui, color: C.ink}}>
    <div style={{position: 'absolute', left: 20, right: 20, top: 66, display: 'flex', alignItems: 'center', gap: 10}}>
      <IconReset size={24} />
      <span style={{fontSize: 18, fontWeight: 700}}>Weekly reset</span>
      <span style={{marginLeft: 'auto', fontSize: 14, color: C.sub}}>{step} of 3</span>
    </div>
    <div style={{position: 'absolute', left: 20, right: 20, top: 106, display: 'flex', gap: 6}}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{flex: 1, height: 5, borderRadius: 3, background: i <= step ? C.orange : C.track}} />
      ))}
    </div>
    {children}
    <div
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 34,
        height: 58,
        borderRadius: 20,
        background: buttonDone ? '#E5F3EA' : C.orange,
        color: buttonDone ? '#2F8A57' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontSize: 17,
        fontWeight: 600,
        transform: `scale(${1 - press * 0.04})`,
        boxShadow: buttonDone ? 'none' : '0 10px 22px rgba(218,122,68,0.3)',
      }}
    >
      {buttonDone && <Check size={16} color="#2F8A57" />}
      {button}
    </div>
  </div>
);

const pressAt = (f: number, at: number) => (f >= at && f < at + 8 ? Math.sin(((f - at) / 8) * Math.PI) : 0);

/** Step 1: last week at a glance. */
export const ReviewStep: React.FC<{f: number}> = ({f}) => {
  const r = prog(f, 4, 40, easeInOut);
  const tiles = [
    ['Best day', 'Thursday'],
    ['Streak', '6 weeks'],
    ['Focus time', '9h 40m'],
  ];
  return (
    <SheetFrame step={1} button="Next" press={pressAt(f, 92)}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center'}}>
        <div style={{fontSize: 13, letterSpacing: 2.4, color: C.label, fontWeight: 600}}>LAST WEEK</div>
        <div style={{fontSize: 30, fontWeight: 700, letterSpacing: -0.6, marginTop: 4}}>A strong week.</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 236, display: 'flex', justifyContent: 'center'}}>
        <Ring size={210} stroke={16} value={0.8 * r} color={C.orange} track={C.track}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 54, fontWeight: 700, letterSpacing: -2, fontVariantNumeric: 'tabular-nums'}}>
              {Math.round(12 * r)}
              <span style={{color: C.sub, fontWeight: 500, fontSize: 34}}>/15</span>
            </div>
            <div style={{fontSize: 13, color: C.sub, fontWeight: 600}}>tasks done</div>
          </div>
        </Ring>
      </div>
      <div style={{position: 'absolute', left: 16, right: 16, top: 484, display: 'flex', gap: 10}}>
        {tiles.map(([k, v], i) => {
          const a = prog(f, 26 + i * 8, 12);
          return (
            <div key={k} style={{flex: 1, borderRadius: 20, background: '#fff', padding: '16px 12px', textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 14}px)`}}>
              <div style={{fontSize: 12.5, color: C.sub, fontWeight: 600}}>{k}</div>
              <div style={{fontSize: 17, fontWeight: 700, marginTop: 4}}>{v}</div>
            </div>
          );
        })}
      </div>
      <Touch f={f} at={92} x={196} y={789} t={T} />
    </SheetFrame>
  );
};

/** Step 2: carry over what didn't get done, each with a suggested day. */
export const CARRY_TAP = 40;
export const CarryStep: React.FC<{f: number}> = ({f}) => {
  const items = [
    ['Send invoice #204', 'Mon 9'],
    ['Call the bank', 'Tue 10'],
    ['Return the parcel', 'Thu 12'],
  ];
  const moved = f >= CARRY_TAP + 4;
  return (
    <SheetFrame step={2} button={f >= CARRY_TAP + 34 ? 'Moved · Next' : 'Move all to next week'} buttonDone={f >= CARRY_TAP + 34} press={pressAt(f, CARRY_TAP) + pressAt(f, 92)}>
      <div style={{position: 'absolute', left: 22, right: 22, top: 140}}>
        <div style={{fontSize: 13, letterSpacing: 2.4, color: C.label, fontWeight: 600}}>CARRY OVER</div>
        <div style={{fontSize: 30, fontWeight: 700, letterSpacing: -0.6, marginTop: 4}}>3 left unfinished.</div>
        <div style={{fontSize: 15, color: C.sub, marginTop: 4}}>Plainweek suggests the best day for each.</div>
      </div>
      {items.map(([t, d], i) => {
        const a = prog(f, 6 + i * 6, 12);
        const go = prog(f, CARRY_TAP + 6 + i * 6, 14, easeInOut);
        return (
          <div
            key={t}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: 270 + i * 82,
              height: 70,
              borderRadius: 22,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 18px',
              opacity: a * (1 - go * 0.25),
              transform: `translateX(${(1 - a) * 40 + go * 0}px)`,
            }}
          >
            <div style={{width: 24, height: 24, borderRadius: 7, border: `1.8px solid ${moved && go > 0.5 ? C.orange : '#C9C1B6'}`, background: moved && go > 0.5 ? C.orange : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {go > 0.5 && <Check size={15} />}
            </div>
            <span style={{fontSize: 16.5, fontWeight: 500}}>{t}</span>
            <span style={{marginLeft: 'auto', fontSize: 13.5, fontWeight: 700, color: go > 0.5 ? '#2F8A57' : C.orange, background: go > 0.5 ? '#E5F3EA' : C.orangeSoft, padding: '6px 11px', borderRadius: 12}}>
              {go > 0.5 ? `Moved → ${d}` : `→ ${d}`}
            </span>
          </div>
        );
      })}
      <Touch f={f} at={CARRY_TAP} x={196} y={789} t={T} />
    </SheetFrame>
  );
};

/** Step 3: brain dump in plain English; each line becomes a scheduled task. */
const ENTRIES = [
  {typed: 'Call Josh fri 3pm', title: 'Call Josh', chips: ['Fri 13', '15:00']},
  {typed: 'Gym mon wed fri 7am', title: 'Gym', chips: ['Mon · Wed · Fri', '07:00', 'Repeats']},
  {typed: 'Dentist thu 10am', title: 'Dentist', chips: ['Thu 12', '10:00']},
  {typed: 'Book flights by sunday', title: 'Book flights', chips: ['Due Sun 15']},
];
export const ENTRY_GAP = 32;
export const DumpStep: React.FC<{f: number}> = ({f}) => {
  const active = Math.min(ENTRIES.length - 1, Math.max(0, Math.floor((f - 8) / ENTRY_GAP)));
  const lf = f - 8 - active * ENTRY_GAP;
  const e = ENTRIES[active];
  const typedN = Math.max(0, Math.min(e.typed.length, Math.floor(lf * 1.15)));
  const committedAll = f >= 8 + ENTRIES.length * ENTRY_GAP - 6;
  const added = ENTRIES.filter((_, i) => f >= 8 + i * ENTRY_GAP + 22).length;
  return (
    <SheetFrame step={3} button={committedAll ? `${added} tasks scheduled · Next` : 'Add to next week'} buttonDone={committedAll} press={pressAt(f, 140)}>
      <div style={{position: 'absolute', left: 22, right: 22, top: 140}}>
        <div style={{fontSize: 13, letterSpacing: 2.4, color: C.label, fontWeight: 600}}>BRAIN DUMP</div>
        <div style={{fontSize: 30, fontWeight: 700, letterSpacing: -0.6, marginTop: 4}}>What’s on next week?</div>
      </div>
      <div style={{position: 'absolute', left: 16, right: 16, top: 236, height: 58, borderRadius: 29, background: '#fff', boxShadow: '0 0 0 1.6px rgba(218,122,68,0.7)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', fontSize: 17}}>
        <span style={{fontSize: 24, fontWeight: 300}}>+</span>
        {committedAll ? (
          <span style={{color: C.sub}}>Add a task… try “Call Josh fri 3pm”</span>
        ) : (
          <span>
            {e.typed.slice(0, lf < 22 ? typedN : 0)}
            <span style={{display: 'inline-block', width: 2, height: 20, background: C.orange, marginLeft: 1, verticalAlign: -4}} />
          </span>
        )}
      </div>
      {ENTRIES.map((x, i) => {
        const at = 8 + i * ENTRY_GAP + 22;
        if (f < at) return null;
        const k = pop(f, at, 13);
        return (
          <div
            key={x.title}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: 312 + i * 92,
              height: 80,
              borderRadius: 22,
              background: '#fff',
              padding: '12px 18px',
              boxSizing: 'border-box',
              opacity: Math.min(1, k * 1.5),
              transform: `translateY(${(1 - k) * -30}px) scale(${0.94 + 0.06 * k})`,
              boxShadow: `0 0 0 ${1.5 * (1 - prog(f, at + 10, 16))}px rgba(218,122,68,0.7)`,
            }}
          >
            <div style={{fontSize: 17, fontWeight: 600}}>{x.title}</div>
            <div style={{display: 'flex', gap: 6, marginTop: 8}}>
              {x.chips.map((c) => (
                <span key={c} style={{fontSize: 12.5, fontWeight: 700, color: C.orange, background: C.orangeSoft, padding: '4px 9px', borderRadius: 10}}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </SheetFrame>
  );
};
