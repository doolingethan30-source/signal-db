import {easeInOut, pop, prog} from '../../anim';
import {Check} from '../../components/Icons';
import {Ring} from '../../components/Ring';
import {LIGHT_THEME} from '../../launch/theme';
import {Touch} from '../../launch/ui';
import {C} from '../../reset/theme';
import {CircleBtn, IconReset, IconSearch, PhoneStatus, TabBar, ui} from '../../reset/ui';
import {HOUSEHOLD, Mate, mate, MATES} from '../theme';

const T = LIGHT_THEME;
const card: React.CSSProperties = {background: '#fff', borderRadius: 26, boxShadow: '0 1px 2px rgba(0,0,0,0.03)'};
const press = (f: number, at: number) => (f >= at && f < at + 8 ? Math.sin(((f - at) / 8) * Math.PI) : 0);

export const MateAvatar: React.FC<{m: Mate; size?: number; ring?: number}> = ({m, size = 34, ring}) => {
  const a = (
    <div style={{width: size, height: size, borderRadius: size / 2, background: m.color, color: '#fff', fontFamily: ui, fontWeight: 700, fontSize: size * 0.42, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
      {m.initial}
    </div>
  );
  if (ring === undefined) return a;
  return (
    <Ring size={size + 12} stroke={3.4} value={ring} color={m.color} track={C.track}>
      {a}
    </Ring>
  );
};

const HouseIcon: React.FC<{size?: number}> = ({size = 44}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: 'linear-gradient(160deg,#E58C58,#D46F37)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
      <path d="M4 11 12 4l8 7v9H4Z" />
      <path d="M10 20v-5h4v5" />
    </svg>
  </div>
);

const Title: React.FC<{eyebrow: string; title: string; right?: React.ReactNode}> = ({eyebrow, title, right}) => (
  <div style={{position: 'absolute', left: 20, right: 16, top: 66, display: 'flex', alignItems: 'flex-end', fontFamily: ui, color: C.ink}}>
    <div>
      <div style={{fontSize: 12.5, letterSpacing: 2.2, color: C.label, fontWeight: 600}}>{eyebrow}</div>
      <div style={{fontSize: 24, fontWeight: 600, letterSpacing: -0.6, marginTop: 2}}>{title}</div>
    </div>
    <div style={{marginLeft: 'auto'}}>{right}</div>
  </div>
);

const MatesRow: React.FC<{n?: number}> = ({n = 4}) => (
  <div style={{display: 'flex'}}>
    {MATES.slice(0, n).map((m, i) => (
      <div key={m.id} style={{marginLeft: i ? -8 : 0, border: '2.5px solid #F8F6F3', borderRadius: '50%'}}>
        <MateAvatar m={m} size={28} />
      </div>
    ))}
  </div>
);

const Screen: React.FC<{children: React.ReactNode; tab: 'week' | 'month' | 'family'}> = ({children, tab}) => (
  <div style={{position: 'absolute', inset: 0, background: C.paper, fontFamily: ui, color: C.ink, overflow: 'hidden'}}>
    <PhoneStatus />
    {children}
    <TabBar active={tab} />
  </div>
);

/** 1 — create the household, then invite roommates. f is local. */
export const HH_CREATE_TAP = 34;
export const HH_INVITE_TAP = 52;
export const HH_JOINS = [62, 72, 82];
export const Household: React.FC<{f: number}> = ({f}) => {
  const typed = HOUSEHOLD.slice(0, Math.max(0, Math.min(HOUSEHOLD.length, Math.floor((f - 6) / 1.6))));
  const created = prog(f, HH_CREATE_TAP + 4, 12, easeInOut);
  const members = 1 + HH_JOINS.filter((a) => f >= a).length;
  return (
    <Screen tab="family">
      <Title eyebrow="FAMILY MODE" title={created > 0.5 ? HOUSEHOLD : 'Your household'} right={<CircleBtn><IconSearch /></CircleBtn>} />
      {/* create card */}
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 140, padding: 18, opacity: 1 - created, transform: `translateY(${-created * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <HouseIcon />
          <div>
            <div style={{fontSize: 18, fontWeight: 700}}>Create a household</div>
            <div style={{fontSize: 13.5, color: C.sub, marginTop: 2}}>Share chores, lists and plans</div>
          </div>
        </div>
        <div style={{fontSize: 12, letterSpacing: 2, color: C.label, fontWeight: 600, marginTop: 20}}>NAME</div>
        <div style={{marginTop: 8, height: 54, borderRadius: 27, background: '#F3F0EC', display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: 17, boxShadow: f > 4 && f < HH_CREATE_TAP ? '0 0 0 1.6px rgba(218,122,68,0.7)' : 'none'}}>
          {typed || <span style={{color: C.sub}}>e.g. Apartment 4B</span>}
          {f < HH_CREATE_TAP && <span style={{display: 'inline-block', width: 2, height: 20, background: C.orange, marginLeft: 1}} />}
        </div>
        <div style={{marginTop: 16, height: 54, borderRadius: 27, background: C.orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16.5, fontWeight: 600, transform: `scale(${1 - press(f, HH_CREATE_TAP) * 0.04})`}}>
          Create household
        </div>
      </div>
      {/* the household */}
      {created > 0 && (
        <div style={{...card, position: 'absolute', left: 14, right: 14, top: 140, padding: '18px 18px 10px', opacity: created, transform: `translateY(${(1 - created) * 30}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <HouseIcon />
            <div>
              <div style={{fontSize: 19, fontWeight: 700}}>{HOUSEHOLD}</div>
              <div style={{fontSize: 13.5, color: C.sub, marginTop: 2}}>
                {members} {members === 1 ? 'member' : 'members'}
              </div>
            </div>
          </div>
          {MATES.map((m, i) => {
            const at = i === 0 ? 0 : HH_JOINS[i - 1];
            if (i > 0 && f < at) return null;
            const k = i === 0 ? 1 : pop(f, at, 13);
            return (
              <div key={m.id} style={{display: 'flex', alignItems: 'center', gap: 12, height: 62, borderTop: `1px solid ${C.line}`, marginTop: i === 0 ? 14 : 0, opacity: Math.min(1, k * 1.4), transform: `translateX(${(1 - k) * 40}px)`}}>
                <MateAvatar m={m} size={38} />
                <div>
                  <div style={{fontSize: 16, fontWeight: 600}}>
                    {m.name}
                    {i === 0 && <span style={{color: C.sub, fontWeight: 500}}> (you)</span>}
                  </div>
                  <div style={{fontSize: 12.5, color: C.sub}}>{m.course}</div>
                </div>
                {i > 0 && <span style={{marginLeft: 'auto', fontSize: 12.5, fontWeight: 700, color: '#2F8A57', background: '#E5F3EA', padding: '4px 10px', borderRadius: 10}}>Joined</span>}
              </div>
            );
          })}
        </div>
      )}
      {created > 0 && (
        <div style={{position: 'absolute', left: 14, right: 14, top: 640, height: 54, borderRadius: 27, background: C.orangeSoft, color: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16.5, fontWeight: 600, opacity: created, transform: `scale(${1 - press(f, HH_INVITE_TAP) * 0.04})`}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2" strokeLinecap="round">
            <circle cx="10" cy="8" r="3.5" />
            <path d="M3.5 19c.7-3.5 3.2-5.5 6.5-5.5s5.8 2 6.5 5.5M19 8v6M16 11h6" />
          </svg>
          Invite roommates
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none'}}>
        <Touch f={f} at={HH_CREATE_TAP} x={196} y={140 + 18 + 44 + 20 + 15 + 8 + 54 + 16 + 27} t={T} />
        <Touch f={f} at={HH_INVITE_TAP} x={196} y={667} t={T} />
      </div>
    </Screen>
  );
};

/** 2 — chores assigned, then weekly rotation switched on and previewed. f is local. */
const CHORES = [
  {t: 'Dishes', sub: 'Daily'},
  {t: 'Take out the bins', sub: 'Weekly · Tuesday'},
  {t: 'Clean the bathroom', sub: 'Weekly · Saturday'},
  {t: 'Hoover the lounge', sub: 'Weekly · Sunday'},
];
export const CH_ROTATE_TAP = 44;
export const CH_NEXT_TAP = 86;
export const Chores: React.FC<{f: number}> = ({f}) => {
  const rotateOn = f >= CH_ROTATE_TAP + 2;
  const nextK = prog(f, CH_NEXT_TAP + 4, 18, easeInOut);
  return (
    <Screen tab="family">
      <Title eyebrow={HOUSEHOLD.toUpperCase()} title="Chores" right={<MatesRow />} />
      <div style={{position: 'absolute', left: 14, right: 14, top: 136, display: 'flex', alignItems: 'center', gap: 8}}>
        <span style={{fontSize: 14, fontWeight: 600, padding: '8px 14px', borderRadius: 16, background: '#fff'}}>{nextK > 0.5 ? 'Next week · 16–22 Nov' : 'This week · 9–15 Nov'}</span>
        <span style={{marginLeft: 'auto', fontSize: 14, fontWeight: 600, color: C.orange, padding: '8px 14px', borderRadius: 16, background: C.orangeSoft, transform: `scale(${1 - press(f, CH_NEXT_TAP) * 0.06})`, opacity: rotateOn ? 1 : 0.4}}>{nextK > 0.5 ? '‹ This week' : 'Next week ›'}</span>
      </div>
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 190, height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px'}}>
        <IconReset />
        <div>
          <div style={{fontSize: 16, fontWeight: 600}}>Rotate weekly</div>
          <div style={{fontSize: 12.5, color: C.sub}}>Everyone takes a turn</div>
        </div>
        <div style={{marginLeft: 'auto', width: 52, height: 32, borderRadius: 16, background: rotateOn ? C.orange : C.track, position: 'relative'}}>
          <div style={{position: 'absolute', top: 3, left: 3, width: 26, height: 26, borderRadius: 13, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.18)', transform: `translateX(${prog(f, CH_ROTATE_TAP, 8) * 20}px)`}} />
        </div>
      </div>
      {CHORES.map((c, i) => {
        const assignAt = 6 + i * 6;
        const k = pop(f, assignAt, 12);
        const from = MATES[i];
        const to = MATES[(i + 1) % 4];
        return (
          <div key={c.t} style={{...card, position: 'absolute', left: 14, right: 14, top: 268 + i * 82, height: 72, display: 'flex', alignItems: 'center', padding: '0 18px', overflow: 'hidden'}}>
            <div>
              <div style={{fontSize: 16.5, fontWeight: 600}}>{c.t}</div>
              <div style={{fontSize: 12.5, color: C.sub, marginTop: 2}}>{c.sub}</div>
            </div>
            <div style={{marginLeft: 'auto', position: 'relative', width: 120, height: 40}}>
              {[from, to].map((m, j) => {
                const y = j === 0 ? -nextK * 46 : (1 - nextK) * 46;
                return (
                  <div key={m.id} style={{position: 'absolute', right: 0, top: 3 + y, display: 'flex', alignItems: 'center', gap: 8, opacity: j === 0 ? Math.min(1, k * 1.5) * (1 - nextK) : nextK, transform: j === 0 ? `scale(${0.5 + 0.5 * k})` : 'none'}}>
                    <span style={{fontSize: 14, fontWeight: 600}}>{m.name}</span>
                    <MateAvatar m={m} size={34} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none'}}>
        <Touch f={f} at={CH_ROTATE_TAP} x={334} y={222} t={T} />
        <Touch f={f} at={CH_NEXT_TAP} x={318} y={154} t={T} />
      </div>
    </Screen>
  );
};

/** 3 — everyone's progress this week, plus who did what. f is local. */
const PROGRESS = [
  {id: 'maya', done: 3, total: 3},
  {id: 'jordan', done: 2, total: 3},
  {id: 'sam', done: 3, total: 4},
  {id: 'priya', done: 2, total: 2},
];
const ACTIVITY = [
  {id: 'jordan', t: 'Take out the bins', at: 30},
  {id: 'priya', t: 'Hoover the lounge', at: 52},
  {id: 'sam', t: 'Dishes', at: 74},
];
export const PROGRESS_TICKS = ACTIVITY.map((a) => a.at);
export const Progress: React.FC<{f: number}> = ({f}) => (
  <Screen tab="family">
    <Title eyebrow={HOUSEHOLD.toUpperCase()} title="This week" right={<MatesRow />} />
    <div style={{...card, position: 'absolute', left: 14, right: 14, top: 140, padding: '6px 18px'}}>
      {PROGRESS.map((p, i) => {
        const m = mate(p.id);
        const k = prog(f, 4 + i * 6, 40, easeInOut);
        const v = (p.done / p.total) * k;
        return (
          <div key={p.id} style={{display: 'flex', alignItems: 'center', gap: 14, height: 68, borderTop: i ? `1px solid ${C.line}` : 'none'}}>
            <MateAvatar m={m} size={40} ring={v} />
            <div>
              <div style={{fontSize: 16.5, fontWeight: 600}}>{m.name}</div>
              <div style={{fontSize: 13, color: C.sub, marginTop: 2}}>
                {Math.round(p.done * k)} of {p.total} chores done
              </div>
            </div>
            {v > 0.99 && <span style={{marginLeft: 'auto', fontSize: 12.5, fontWeight: 700, color: '#2F8A57', background: '#E5F3EA', padding: '4px 10px', borderRadius: 10}}>All done</span>}
          </div>
        );
      })}
    </div>
    <div style={{position: 'absolute', left: 22, top: 448, fontSize: 12.5, letterSpacing: 2.2, color: C.label, fontWeight: 600}}>COMPLETED</div>
    {ACTIVITY.map((a, i) => {
      if (f < a.at) return null;
      const k = pop(f, a.at, 13);
      const m = mate(a.id);
      return (
        <div key={a.t} style={{...card, position: 'absolute', left: 14, right: 14, top: 474 + (ACTIVITY.filter((b) => f >= b.at).length - 1 - i) * 74, height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', opacity: Math.min(1, k * 1.5), transform: `scale(${0.94 + 0.06 * k})`}}>
          <div style={{width: 26, height: 26, borderRadius: 8, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Check size={16} progress={Math.min(1, k * 1.3)} />
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 15.5, fontWeight: 600}}>{a.t}</div>
            <div style={{fontSize: 12.5, color: C.sub}}>{m.name} · just now</div>
          </div>
          <MateAvatar m={m} size={30} />
        </div>
      );
    })}
  </Screen>
);

/** 4 — the shared shopping list. f is local. */
const ITEMS = [
  {t: 'Milk', by: 'maya', got: 'sam', at: 62},
  {t: 'Pasta', by: 'jordan', got: 'jordan', at: 80},
  {t: 'Washing-up liquid', by: 'sam'},
  {t: 'Bread', by: 'priya'},
  {t: 'Eggs', by: 'maya'},
];
const NEW_ITEM = 'Toilet roll';
export const Shopping: React.FC<{f: number}> = ({f}) => {
  const typedN = Math.max(0, Math.min(NEW_ITEM.length, Math.floor((f - 8) / 1.4)));
  const added = f >= 34;
  const addK = pop(f, 34, 13);
  const rows = added ? [{t: NEW_ITEM, by: 'priya', isNew: true}, ...ITEMS] : ITEMS;
  return (
    <Screen tab="family">
      <Title eyebrow={HOUSEHOLD.toUpperCase()} title="Shopping list" right={<MatesRow />} />
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 140, padding: 12}}>
        <div style={{height: 52, borderRadius: 26, background: '#F3F0EC', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontSize: 16, boxShadow: f > 6 && !added ? '0 0 0 1.6px rgba(218,122,68,0.7)' : 'none'}}>
          <span style={{fontSize: 22, fontWeight: 300}}>+</span>
          {!added && typedN > 0 ? (
            <span>
              {NEW_ITEM.slice(0, typedN)}
              <span style={{display: 'inline-block', width: 2, height: 18, background: C.orange, marginLeft: 1, verticalAlign: -3}} />
            </span>
          ) : (
            <span style={{color: C.sub}}>Add an item…</span>
          )}
        </div>
      </div>
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 228, padding: '4px 18px'}}>
        {rows.map((it, i) => {
          const isNew = 'isNew' in it;
          const d = 'at' in it && it.at !== undefined ? prog(f, it.at, 10) : 0;
          const who = mate(d > 0.5 && 'got' in it && it.got ? it.got : it.by);
          const k = isNew ? addK : 1;
          return (
            <div key={it.t} style={{display: 'flex', alignItems: 'center', gap: 14, height: 64 * (isNew ? Math.min(1, k) : 1), overflow: 'hidden', borderTop: i ? `1px solid ${C.line}` : 'none', opacity: isNew ? Math.min(1, k * 1.4) : 1, background: isNew ? `rgba(218,122,68,${0.08 * (1 - prog(f, 50, 30))})` : 'none', margin: '0 -18px', padding: '0 18px'}}>
              <div style={{width: 26, height: 26, borderRadius: 13, border: d > 0.05 ? 'none' : '1.8px solid #C9C1B6', background: d > 0.05 ? who.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', flexShrink: 0}}>
                {d > 0.05 && <Check size={15} progress={Math.min(1, d * 1.4)} />}
              </div>
              <div>
                <div style={{fontSize: 16.5, color: d > 0.5 ? C.sub : C.ink, textDecoration: d > 0.5 ? 'line-through' : 'none'}}>{it.t}</div>
                <div style={{fontSize: 12.5, color: d > 0.5 ? who.color : C.sub, fontWeight: d > 0.5 || isNew ? 600 : 400}}>{d > 0.5 ? `Got it · ${who.name}` : `Added by ${who.name}${isNew ? ' · just now' : ''}`}</div>
              </div>
              <div style={{marginLeft: 'auto'}}>
                <MateAvatar m={who} size={28} />
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
};

/** 5 — everyone's schedule for the day, colour-coded by roommate. f is local. */
const EVENTS = [
  {time: '09:00', t: 'Contract Law lecture', id: 'maya', at: 6},
  {time: '11:00', t: 'Anatomy lab', id: 'sam', at: 12},
  {time: '14:00', t: 'Design studio', id: 'priya', at: 18},
  {time: '17:30', t: 'Football training', id: 'jordan', at: 24},
  {time: '19:30', t: 'Apartment dinner', id: '', at: 34},
];
export const Schedule: React.FC<{f: number}> = ({f}) => (
  <Screen tab="week">
    <div style={{position: 'absolute', left: 18, right: 14, top: 70, display: 'flex', alignItems: 'center'}}>
      <span style={{fontSize: 22, fontWeight: 600, letterSpacing: -0.6}}>November 2026</span>
      <div style={{marginLeft: 'auto'}}>
        <MatesRow />
      </div>
    </div>
    <div style={{position: 'absolute', left: 10, right: 10, top: 126, display: 'flex', justifyContent: 'space-between'}}>
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
        <div key={d} style={{width: 50, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <span style={{fontSize: 13, color: C.sub}}>{d}</span>
          <div style={{marginTop: 8, width: 40, height: 40, borderRadius: 20, background: i === 3 ? C.orange : 'transparent', color: i === 3 ? '#fff' : C.ink, fontSize: 17, fontWeight: i === 3 ? 600 : 500, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{9 + i}</div>
          <div style={{display: 'flex', gap: 2, marginTop: 4}}>
            {MATES.filter((_, j) => (i + j) % 3 !== 0).map((m) => (
              <div key={m.id} style={{width: 4, height: 4, borderRadius: 2, background: m.color}} />
            ))}
          </div>
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 22, right: 22, top: 214, display: 'flex', alignItems: 'flex-end'}}>
      <div>
        <div style={{fontSize: 12.5, letterSpacing: 2.2, color: C.label, fontWeight: 600}}>THURSDAY</div>
        <div style={{fontSize: 19, fontWeight: 600, marginTop: 2}}>12 November 2026</div>
      </div>
      <span style={{marginLeft: 'auto', color: C.orange, fontSize: 15, fontWeight: 500}}>Everyone</span>
    </div>
    <div style={{...card, position: 'absolute', left: 14, right: 14, top: 276, padding: '8px 18px'}}>
      {EVENTS.map((e, i) => {
        const k = pop(f, e.at, 12);
        if (f < e.at) return <div key={e.t} style={{height: 74}} />;
        const m = e.id ? mate(e.id) : null;
        return (
          <div key={e.t} style={{display: 'flex', alignItems: 'center', gap: 14, height: 74, borderTop: i ? `1px solid ${C.line}` : 'none', opacity: Math.min(1, k * 1.4), transform: `translateX(${(1 - k) * 30}px)`}}>
            <span style={{width: 48, fontSize: 15, fontVariantNumeric: 'tabular-nums'}}>{e.time}</span>
            <div style={{width: 4, height: 40, borderRadius: 2, background: m ? m.color : C.orange}} />
            <div style={{flex: 1}}>
              <div style={{fontSize: 16, fontWeight: 600}}>{e.t}</div>
              <div style={{fontSize: 12.5, color: m ? C.sub : C.orange, fontWeight: m ? 400 : 600}}>{m ? m.name : 'Everyone'}</div>
            </div>
            {m && <MateAvatar m={m} size={30} />}
          </div>
        );
      })}
    </div>
  </Screen>
);
