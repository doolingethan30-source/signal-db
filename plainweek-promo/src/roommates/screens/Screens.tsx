import {easeInOut, pop, prog} from '../../anim';
import {Check, Chevron, Sparkle} from '../../components/Icons';
import {Ring} from '../../components/Ring';
import {LIGHT_THEME} from '../../launch/theme';
import {Touch} from '../../launch/ui';
import {C} from '../../reset/theme';
import {CircleBtn, IconReset, IconSearch, PhoneStatus, TabBar, ui} from '../../reset/ui';
import {HOUSEHOLD, Mate, mate, MATES} from '../theme';

// Family Mode screens for the roommates film. Every behaviour shown here is a
// Family Mode feature; layouts reuse the current app's components and palette.

const T = LIGHT_THEME;
const card: React.CSSProperties = {background: '#fff', borderRadius: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.03)'};
const press = (f: number, at: number, d = 8) => (f >= at && f < at + d ? Math.sin(((f - at) / d) * Math.PI) : 0);
const GREEN = '#2F8A57';
const GREEN_BG = '#E5F3EA';

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

export const MatesRow: React.FC<{size?: number}> = ({size = 28}) => (
  <div style={{display: 'flex'}}>
    {MATES.map((m, i) => (
      <div key={m.id} style={{marginLeft: i ? -8 : 0, border: '2.5px solid #F8F6F3', borderRadius: '50%'}}>
        <MateAvatar m={m} size={size} />
      </div>
    ))}
  </div>
);

const Screen: React.FC<{children: React.ReactNode; tab?: 'week' | 'month' | 'family'}> = ({children, tab = 'family'}) => (
  <div style={{position: 'absolute', inset: 0, background: C.paper, fontFamily: ui, color: C.ink, overflow: 'hidden'}}>
    <PhoneStatus />
    {children}
    <TabBar active={tab} />
  </div>
);

const Chip: React.FC<{children: React.ReactNode; tone?: 'orange' | 'green' | 'grey'; k?: number}> = ({children, tone = 'orange', k = 1}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 12.5,
      fontWeight: 700,
      padding: '5px 10px',
      borderRadius: 11,
      color: tone === 'green' ? GREEN : tone === 'grey' ? C.label : C.orange,
      background: tone === 'green' ? GREEN_BG : tone === 'grey' ? '#EFEBE6' : C.orangeSoft,
      transform: `scale(${0.7 + 0.3 * k})`,
      opacity: Math.min(1, k * 1.4),
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

const QuickField: React.FC<{text: string; n: number; placeholder: string; active: boolean}> = ({text, n, placeholder, active}) => (
  <div style={{height: 52, borderRadius: 26, background: '#F3F0EC', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontSize: 16, boxShadow: active ? '0 0 0 1.6px rgba(218,122,68,0.7)' : 'none', whiteSpace: 'nowrap', overflow: 'hidden'}}>
    <span style={{fontSize: 22, fontWeight: 300}}>+</span>
    {n > 0 ? (
      <span>
        {text.slice(0, n)}
        {active && <span style={{display: 'inline-block', width: 2, height: 18, background: C.orange, marginLeft: 1, verticalAlign: -3}} />}
      </span>
    ) : (
      <span style={{color: C.sub}}>{placeholder}</span>
    )}
  </div>
);

const Circle: React.FC<{done?: number; color?: string}> = ({done = 0, color = C.orange}) => (
  <div style={{width: 24, height: 24, borderRadius: 12, border: done > 0.05 ? 'none' : '1.8px solid #C9C1B6', background: done > 0.05 ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box'}}>
    {done > 0.05 && <Check size={14} progress={Math.min(1, done * 1.4)} />}
  </div>
);

// ---------------------------------------------------------------------------
/** 01 — create the family, colours + roles, invite with an 8-character code or a link. */
export const SETUP_CREATE = 30;
export const SETUP_SHARE = 44;
export const SETUP_JOINS = [54, 64, 74];
const ROLE: Record<string, string> = {maya: 'Organiser', jordan: 'Member', sam: 'Member', priya: 'Member'};
export const Setup: React.FC<{f: number}> = ({f}) => {
  const typed = Math.max(0, Math.min(HOUSEHOLD.length, Math.floor((f - 4) / 1.5)));
  const created = prog(f, SETUP_CREATE + 2, 12, easeInOut);
  const members = 1 + SETUP_JOINS.filter((a) => f >= a).length;
  const code = 'K7Q2M9XP';
  return (
    <Screen>
      <Title eyebrow="FAMILY MODE" title={created > 0.5 ? HOUSEHOLD : 'New family'} right={<CircleBtn><IconSearch /></CircleBtn>} />
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 140, padding: 18, opacity: 1 - created, transform: `translateY(${-created * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <HouseIcon />
          <div style={{fontSize: 18, fontWeight: 700}}>Create a family</div>
        </div>
        <div style={{marginTop: 16}}>
          <QuickField text={HOUSEHOLD} n={typed} placeholder="Family name" active={f < SETUP_CREATE} />
        </div>
        <div style={{display: 'flex', gap: 10, marginTop: 14, alignItems: 'center'}}>
          <span style={{fontSize: 13.5, color: C.sub, marginRight: 4}}>Your colour</span>
          {MATES.map((m, i) => (
            <div key={m.id} style={{width: 26, height: 26, borderRadius: 13, background: m.color, boxShadow: i === 0 ? `0 0 0 3px #fff, 0 0 0 5px ${m.color}` : 'none'}} />
          ))}
        </div>
        <div style={{marginTop: 16, height: 52, borderRadius: 26, background: C.orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16.5, fontWeight: 600, transform: `scale(${1 - press(f, SETUP_CREATE) * 0.04})`}}>Create family</div>
      </div>
      {created > 0 && (
        <>
          <div style={{...card, position: 'absolute', left: 14, right: 14, top: 140, padding: '14px 18px 4px', opacity: created, transform: `translateY(${(1 - created) * 30}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 600, color: C.label, letterSpacing: 1.6}}>
              MEMBERS<span style={{marginLeft: 'auto', letterSpacing: 0}}>{members}</span>
            </div>
            {MATES.map((m, i) => {
              const at = i === 0 ? 0 : SETUP_JOINS[i - 1];
              if (i > 0 && f < at) return null;
              const k = i === 0 ? 1 : pop(f, at, 13);
              return (
                <div key={m.id} style={{display: 'flex', alignItems: 'center', gap: 12, height: 56, borderTop: i ? `1px solid ${C.line}` : 'none', opacity: Math.min(1, k * 1.4), transform: `translateX(${(1 - k) * 40}px)`}}>
                  <MateAvatar m={m} size={34} />
                  <span style={{fontSize: 16, fontWeight: 600}}>{m.name}</span>
                  <span style={{marginLeft: 'auto'}}>
                    <Chip tone={i === 0 ? 'orange' : 'grey'}>{ROLE[m.id]}</Chip>
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{...card, position: 'absolute', left: 14, right: 14, top: 432, padding: 18, opacity: created, transform: `translateY(${(1 - created) * 30}px)`}}>
            <div style={{fontSize: 13, fontWeight: 600, color: C.label, letterSpacing: 1.6}}>INVITE ROOMMATES</div>
            <div style={{display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14}}>
              {code.split('').map((ch, i) => (
                <div key={i} style={{width: 36, height: 48, borderRadius: 10, background: '#F3F0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, marginLeft: i === 4 ? 8 : 0}}>
                  {ch}
                </div>
              ))}
            </div>
            <div style={{display: 'flex', gap: 10, marginTop: 14}}>
              <div style={{flex: 1, height: 46, borderRadius: 23, background: C.orangeSoft, color: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600}}>Copy code</div>
              <div style={{flex: 1, height: 46, borderRadius: 23, background: C.orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, transform: `scale(${1 - press(f, SETUP_SHARE) * 0.05})`}}>Share link</div>
            </div>
          </div>
        </>
      )}
      <div style={{position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none'}}>
        <Touch f={f} at={SETUP_CREATE} x={196} y={378} t={T} />
        <Touch f={f} at={SETUP_SHARE} x={282} y={587} t={T} />
      </div>
    </Screen>
  );
};

// ---------------------------------------------------------------------------
/** 02 — quick add ("Bins @Sam every tue") and a chore that takes turns each week. */
const QUICK = 'Bins @Sam every tue';
export const CHORES_ADD = 32;
const ROTATION = ['maya', 'jordan', 'sam', 'priya'];
export const ChoresScreen: React.FC<{f: number}> = ({f}) => {
  const n = Math.max(0, Math.min(QUICK.length, Math.floor((f - 4) / 1.2)));
  const added = f >= CHORES_ADD;
  const addK = pop(f, CHORES_ADD, 13);
  const turn = Math.min(3, Math.max(0, Math.floor((f - 58) / 15)));
  const rows = [
    {t: 'Dishes', who: ROTATION[turn], sub: 'Daily · taking turns each week', rot: true},
    {t: 'Clean the bathroom', who: 'priya', sub: 'Weekly · Saturday'},
  ];
  return (
    <Screen>
      <Title eyebrow={HOUSEHOLD.toUpperCase()} title="Chores" right={<MatesRow />} />
      <div style={{position: 'absolute', left: 14, right: 14, top: 134, display: 'flex', gap: 8}}>
        <Chip tone="grey">Everyone</Chip>
        <Chip tone="grey">To do</Chip>
        <Chip tone="grey">Group by person</Chip>
      </div>
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 172, padding: 12, minHeight: 76}}>
        <QuickField text={QUICK} n={added ? 0 : n} placeholder="Add a chore…" active={!added && f > 2} />
        {!added && f >= 18 && (
          <div style={{display: 'flex', gap: 8, marginTop: 10, paddingLeft: 6}}>
            <Chip k={pop(f, 18, 10)}>
              <MateAvatar m={mate('sam')} size={16} /> Sam
            </Chip>
            {f >= 25 && (
              <Chip k={pop(f, 25, 10)}>
                <IconReset size={14} /> Every Tuesday
              </Chip>
            )}
          </div>
        )}
      </div>
      <div style={{position: 'absolute', left: 14, right: 14, top: added ? 266 : 290}}>
        {added && (
          <div style={{...card, height: 70, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', marginBottom: 10, opacity: Math.min(1, addK * 1.4), transform: `translateY(${(1 - addK) * -20}px)`, boxShadow: `0 0 0 ${1.6 * (1 - prog(f, CHORES_ADD + 12, 20))}px rgba(218,122,68,0.7)`}}>
            <Circle />
            <div>
              <div style={{fontSize: 16.5, fontWeight: 600}}>Take out the bins</div>
              <div style={{fontSize: 12.5, color: C.sub, marginTop: 2}}>Every Tuesday</div>
            </div>
            <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600}}>
              Sam <MateAvatar m={mate('sam')} size={30} />
            </span>
          </div>
        )}
        {rows.map((r) => {
          const m = mate(r.who);
          return (
            <div key={r.t} style={{...card, padding: '14px 16px', marginBottom: 10}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <Circle />
                <div>
                  <div style={{fontSize: 16.5, fontWeight: 600}}>{r.t}</div>
                  <div style={{fontSize: 12.5, color: r.rot ? C.orange : C.sub, fontWeight: r.rot ? 600 : 400, marginTop: 2}}>{r.sub}</div>
                </div>
                <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600}}>
                  {m.name} <MateAvatar m={m} size={30} />
                </span>
              </div>
              {r.rot && (
                <div style={{display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, paddingLeft: 36}}>
                  {ROTATION.map((id, i) => {
                    const on = i === turn;
                    return (
                      <div key={id} style={{display: 'flex', alignItems: 'center', gap: 6}}>
                        <div style={{borderRadius: '50%', boxShadow: on ? `0 0 0 3px #fff, 0 0 0 5px ${mate(id).color}` : 'none', opacity: on ? 1 : 0.45}}>
                          <MateAvatar m={mate(id)} size={28} />
                        </div>
                        {i < 3 && <Chevron size={10} color={C.sub} />}
                      </div>
                    );
                  })}
                  <span style={{marginLeft: 'auto', fontSize: 12, color: C.sub, fontWeight: 600}}>Week {turn + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Screen>
  );
};

// ---------------------------------------------------------------------------
/** 03 — Today: rings per person, quick actions, a template, and "Plan our week". */
export const TODAY_TEMPLATES = 10;
export const TODAY_KITCHEN = 26;
export const TODAY_PLAN = 54;
const TEMPLATES = ['Morning routine', 'Kitchen duty', 'Sunday clean-up', 'School nights', 'Pet care', 'Garden'];
const GRABS = [
  {t: 'Wipe down the hob', to: 'priya', day: 'Mon'},
  {t: 'Clean the fridge', to: 'sam', day: 'Wed'},
  {t: 'Empty the dishwasher', to: 'jordan', day: 'Thu'},
  {t: 'Descale the kettle', to: 'maya', day: 'Sat'},
];
export const TodayScreen: React.FC<{f: number}> = ({f}) => {
  const sheet = Math.min(prog(f, TODAY_TEMPLATES + 2, 10, easeInOut), 1 - prog(f, TODAY_KITCHEN + 4, 10, easeInOut));
  const toast = Math.min(pop(f, TODAY_KITCHEN + 8, 12), 1 - prog(f, TODAY_PLAN - 6, 8));
  const rings = [0.67, 0.5, 0.25, 0.75];
  return (
    <Screen>
      <Title eyebrow={HOUSEHOLD.toUpperCase()} title="Today" right={<CircleBtn><IconSearch /></CircleBtn>} />
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 136, height: 96, display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
        {MATES.map((m, i) => (
          <div key={m.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
            <MateAvatar m={m} size={38} ring={rings[i]} />
            <span style={{fontSize: 12, fontWeight: 600}}>{m.name}</span>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 14, right: 0, top: 246, display: 'flex', gap: 7}}>
        {['Chore', 'Event', 'Shopping', 'Plan week', 'Templates'].map((a) => {
          const p = (a === 'Templates' ? press(f, TODAY_TEMPLATES) : 0) + (a === 'Plan week' ? press(f, TODAY_PLAN) : 0);
          const hot = (a === 'Templates' && f >= TODAY_TEMPLATES && f < TODAY_KITCHEN + 10) || (a === 'Plan week' && f >= TODAY_PLAN);
          return (
            <span key={a} style={{display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, padding: '10px 11px', borderRadius: 18, background: hot ? C.orange : '#fff', color: hot ? '#fff' : C.ink, transform: `scale(${1 - p * 0.08})`, whiteSpace: 'nowrap'}}>
              {a}
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 22, top: 308, fontSize: 12.5, letterSpacing: 2.2, color: C.label, fontWeight: 600, opacity: prog(f, TODAY_KITCHEN + 8, 10)}}>UP FOR GRABS</div>
      {GRABS.map((g, i) => {
        const k = prog(f, TODAY_KITCHEN + 10 + i * 3, 12);
        const plan = prog(f, TODAY_PLAN + 6 + i * 5, 14, easeInOut);
        const m = mate(g.to);
        return (
          <div key={g.t} style={{...card, position: 'absolute', left: 14, right: 14, top: 334 + i * 72, height: 62, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', opacity: k, transform: `translateX(${(1 - k) * 30}px)`}}>
            <Circle />
            <div>
              <div style={{fontSize: 15.5, fontWeight: 600}}>{g.t}</div>
              <div style={{fontSize: 12, color: C.sub}}>Kitchen duty</div>
            </div>
            <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8}}>
              {plan < 0.5 ? (
                <Chip tone="grey">Anyone</Chip>
              ) : (
                <>
                  <Chip k={plan}>{g.day}</Chip>
                  <span style={{transform: `scale(${0.5 + 0.5 * plan})`}}>
                    <MateAvatar m={m} size={30} />
                  </span>
                </>
              )}
            </span>
          </div>
        );
      })}
      {sheet > 0 && (
        <>
          <div style={{position: 'absolute', inset: 0, background: `rgba(20,16,12,${0.25 * sheet})`, zIndex: 20}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 470, borderRadius: '28px 28px 0 0', background: C.paper, transform: `translateY(${(1 - sheet) * 480}px)`, zIndex: 21, padding: '14px 16px'}}>
            <div style={{width: 40, height: 5, borderRadius: 3, background: '#DCD5CB', margin: '0 auto 14px'}} />
            <div style={{fontSize: 20, fontWeight: 700, marginBottom: 12}}>Templates</div>
            {TEMPLATES.map((t) => (
              <div key={t} style={{...card, height: 52, display: 'flex', alignItems: 'center', padding: '0 16px', marginBottom: 8, fontSize: 15.5, fontWeight: 600, boxShadow: t === 'Kitchen duty' && f >= TODAY_KITCHEN ? '0 0 0 2px rgba(218,122,68,0.8)' : 'none', transform: `scale(${t === 'Kitchen duty' ? 1 - press(f, TODAY_KITCHEN) * 0.04 : 1})`}}>
                {t}
                <span style={{marginLeft: 'auto', color: C.orange, fontSize: 14}}>Add</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{position: 'absolute', left: 40, right: 40, top: 640, height: 48, borderRadius: 24, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14.5, fontWeight: 600, opacity: Math.max(0, toast), transform: `translateY(${(1 - Math.max(0, toast)) * 16}px)`, zIndex: 25}}>
        <Check size={15} color={C.orange} /> Kitchen duty added · 4 chores
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 640, height: 48, borderRadius: 24, background: GREEN_BG, color: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14.5, fontWeight: 700, opacity: prog(f, TODAY_PLAN + 30, 10), zIndex: 25}}>
        <Sparkle size={13} color={GREEN} /> Planned · spread fairly
      </div>
      <div style={{position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none'}}>
        <Touch f={f} at={TODAY_TEMPLATES} x={345} y={264} t={T} />
        <Touch f={f} at={TODAY_KITCHEN} x={196} y={533} t={T} />
        <Touch f={f} at={TODAY_PLAN} x={262} y={264} t={T} />
      </div>
    </Screen>
  );
};

// ---------------------------------------------------------------------------
/** 04 — photo proof on a chore, a comment, then a long-press nudge. */
export const PROOF_PHOTO = 14;
export const PROOF_NUDGE = 60;
export const ProofScreen: React.FC<{f: number}> = ({f}) => {
  const photo = pop(f, PROOF_PHOTO, 13);
  const done = f >= PROOF_PHOTO + 10;
  const comment = pop(f, 34, 13);
  const hold = f >= PROOF_NUDGE && f < PROOF_NUDGE + 16 ? Math.min(1, (f - PROOF_NUDGE) / 10) : 0;
  const menu = f >= PROOF_NUDGE + 8 && f < PROOF_NUDGE + 18;
  const nudged = pop(f, PROOF_NUDGE + 18, 12);
  return (
    <Screen>
      <Title eyebrow={HOUSEHOLD.toUpperCase()} title="Chores" right={<MatesRow />} />
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 136, padding: 16}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <Circle done={done ? 1 : 0} color={mate('jordan').color} />
          <div>
            <div style={{fontSize: 17, fontWeight: 600, textDecoration: done ? 'line-through' : 'none', color: done ? C.sub : C.ink}}>Clean the kitchen</div>
            <div style={{fontSize: 12.5, color: C.sub, marginTop: 2}}>Jordan · Today · High priority</div>
          </div>
          <span style={{marginLeft: 'auto'}}>
            <MateAvatar m={mate('jordan')} size={30} />
          </span>
        </div>
        <div style={{display: 'flex', gap: 8, marginTop: 12}}>
          <Chip>Photo proof</Chip>
          {done && (
            <Chip tone="green" k={pop(f, PROOF_PHOTO + 10, 10)}>
              <Check size={12} color={GREEN} /> Done · photo added
            </Chip>
          )}
        </div>
        <div style={{marginTop: 14, height: 150, borderRadius: 18, overflow: 'hidden', position: 'relative', background: '#EFE6DA', opacity: Math.min(1, photo * 1.4), transform: `scale(${0.9 + 0.1 * photo})`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 60, background: '#E9E3DA'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 88, height: 14, background: '#D8CFC3'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 102, bottom: 0, background: '#E9E3DA'}} />
          <div style={{position: 'absolute', left: 120, top: 84, width: 110, height: 8, borderRadius: 4, background: '#9FA3A6'}} />
          <div style={{position: 'absolute', left: 40, top: 30, width: 60, height: 60, borderRadius: '50%', background: '#7FA36E'}} />
          <div style={{position: 'absolute', right: 30, top: 20, width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.8)', boxShadow: '0 0 30px 14px rgba(255,255,255,0.7)'}} />
          <div style={{position: 'absolute', left: 10, bottom: 10, fontSize: 11.5, color: '#fff', background: 'rgba(0,0,0,0.4)', padding: '3px 8px', borderRadius: 8}}>Stored privately</div>
        </div>
        {f >= 34 && (
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, opacity: Math.min(1, comment * 1.4), transform: `translateY(${(1 - comment) * 10}px)`}}>
            <MateAvatar m={mate('sam')} size={26} />
            <div style={{fontSize: 14, background: '#F3F0EC', padding: '8px 12px', borderRadius: 14}}>
              <b>Sam</b> looks amazing, thank you!
            </div>
          </div>
        )}
      </div>
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 512, height: 70, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', transform: `scale(${1 - hold * 0.03})`, boxShadow: hold ? `0 0 0 ${2 * hold}px rgba(218,122,68,0.7)` : 'none'}}>
        <Circle />
        <div>
          <div style={{fontSize: 16, fontWeight: 600}}>Take out the bins</div>
          <div style={{fontSize: 12.5, color: '#D9534F', fontWeight: 600, marginTop: 2}}>Sam · Overdue</div>
        </div>
        <span style={{marginLeft: 'auto'}}>
          <MateAvatar m={mate('sam')} size={30} />
        </span>
      </div>
      {menu && (
        <div style={{...card, position: 'absolute', right: 30, top: 590, padding: '12px 18px', fontSize: 15, fontWeight: 600, boxShadow: '0 12px 28px rgba(0,0,0,0.18)', zIndex: 10}}>Nudge Sam</div>
      )}
      <div style={{position: 'absolute', left: 40, right: 40, top: 610, height: 48, borderRadius: 24, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14.5, fontWeight: 600, opacity: Math.min(1, nudged), transform: `translateY(${(1 - Math.min(1, nudged)) * 14}px)`, zIndex: 11}}>
        <Sparkle size={13} color={C.orange} /> Nudge sent to Sam
      </div>
      <div style={{position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none'}}>
        <Touch f={f} at={PROOF_PHOTO - 2} x={196} y={330} t={T} />
        <Touch f={f} at={PROOF_NUDGE} x={180} y={547} t={T} />
      </div>
    </Screen>
  );
};

// ---------------------------------------------------------------------------
/** 05 — shopping: "2x milk, bread, bananas" splits into items, sorted into aisles. */
const SHOP_TEXT = '2x milk, bread, bananas';
export const SHOP_ADD = 32;
export const SHOP_CLEAR = 84;
type Item = {t: string; qty?: string; by: string; isNew?: boolean; tickAt?: number};
const AISLES: {name: string; items: Item[]}[] = [
  {name: 'DAIRY', items: [{t: 'Milk', qty: '×2', by: 'maya', isNew: true, tickAt: 58}]},
  {name: 'BAKERY', items: [{t: 'Bread', by: 'maya', isNew: true, tickAt: 68}]},
  {name: 'FRUIT & VEG', items: [{t: 'Bananas', by: 'maya', isNew: true}]},
  {name: 'HOUSEHOLD', items: [{t: 'Toilet roll', qty: '×9', by: 'priya'}, {t: 'Washing-up liquid', by: 'sam'}]},
];
export const ShoppingScreen: React.FC<{f: number}> = ({f}) => {
  const n = Math.max(0, Math.min(SHOP_TEXT.length, Math.floor((f - 6) / 1.05)));
  const added = f >= SHOP_ADD;
  const cleared = prog(f, SHOP_CLEAR + 2, 12, easeInOut);
  let y = 230;
  return (
    <Screen>
      <Title eyebrow={HOUSEHOLD.toUpperCase()} title="Shopping" right={<MatesRow />} />
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 140, padding: 12}}>
        <QuickField text={SHOP_TEXT} n={added ? 0 : n} placeholder="Add items…" active={!added && f > 4} />
      </div>
      {AISLES.map((a, ai) => {
        const visible = a.items.filter((it) => !it.isNew || added);
        if (!visible.length) return null;
        const hs = visible.map((it) => (it.tickAt !== undefined ? 1 - cleared : 1));
        const blockH = hs.reduce((s, h) => s + h * 52, 0);
        const top = y;
        y += (26 + blockH + 10) * (hs.some((h) => h > 0.01) ? 1 : 0);
        const hdr = hs.some((h) => h > 0.01) ? Math.max(...hs) : 0;
        return (
          <div key={a.name} style={{position: 'absolute', left: 14, right: 14, top, opacity: hdr}}>
            <div style={{fontSize: 12, letterSpacing: 2, color: C.label, fontWeight: 700, margin: '0 0 6px 8px'}}>{a.name}</div>
            <div style={{...card, overflow: 'hidden'}}>
              {visible.map((it, i) => {
                const k = it.isNew ? pop(f, SHOP_ADD + ai * 4, 12) : 1;
                const d = it.tickAt !== undefined ? prog(f, it.tickAt, 8) : 0;
                return (
                  <div key={it.t} style={{height: 52 * hs[i], overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderTop: i ? `1px solid ${C.line}` : 'none', opacity: Math.min(1, k * 1.4), background: it.isNew ? `rgba(218,122,68,${0.08 * (1 - prog(f, SHOP_ADD + 20, 20))})` : 'none'}}>
                    <Circle done={d} />
                    <span style={{fontSize: 16, color: d > 0.5 ? C.sub : C.ink, textDecoration: d > 0.5 ? 'line-through' : 'none'}}>{it.t}</span>
                    {it.qty && <span style={{fontSize: 14, fontWeight: 700, color: C.orange}}>{it.qty}</span>}
                    <span style={{marginLeft: 'auto'}}>
                      <MateAvatar m={mate(it.by)} size={24} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 14, right: 14, top: 676, height: 50, borderRadius: 25, background: f >= 68 ? C.orange : '#EFEBE6', color: f >= 68 ? '#fff' : C.sub, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15.5, fontWeight: 600, transform: `scale(${1 - press(f, SHOP_CLEAR) * 0.05})`, opacity: 1 - prog(f, SHOP_CLEAR + 14, 8)}}>
        Clear bought items{f >= 68 ? ' (2)' : ''}
      </div>
      <div style={{position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none'}}>
        <Touch f={f} at={SHOP_CLEAR} x={196} y={701} t={T} />
      </div>
    </Screen>
  );
};

// ---------------------------------------------------------------------------
/** 06 — the family month calendar, and an event with who's going / who's driving. */
const DOTS: Record<number, string[]> = {9: ['maya', 'sam'], 10: ['jordan'], 11: ['priya', 'maya'], 12: ['sam', 'jordan'], 13: ['priya'], 14: ['maya', 'jordan', 'sam', 'priya'], 16: ['sam'], 18: ['jordan', 'priya'], 20: ['maya'], 23: ['priya'], 25: ['jordan', 'sam']};
export const EVENT_TAP = 22;
export const EventsScreen: React.FC<{f: number}> = ({f}) => {
  const sheet = prog(f, EVENT_TAP + 2, 14, easeInOut);
  const cells = Array.from({length: 35}, (_, i) => i - 5);
  return (
    <Screen tab="month">
      <Title eyebrow={HOUSEHOLD.toUpperCase()} title="November 2026" right={<MatesRow />} />
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 134, padding: '14px 8px 6px'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: 12, color: C.sub}}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 2, marginTop: 8}}>
          {cells.map((n) => {
            const label = n < 1 ? 31 + n : n > 30 ? n - 30 : n;
            const ids = DOTS[n] ?? [];
            const sel = n === 14 && f >= EVENT_TAP;
            return (
              <div key={n} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: 50}}>
                <div style={{width: 36, height: 36, borderRadius: 18, background: sel ? C.orange : 'transparent', color: sel ? '#fff' : n >= 1 && n <= 30 ? C.ink : '#B8B1A8', fontSize: 15, fontWeight: sel ? 700 : 500, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${n === 14 ? 1 - press(f, EVENT_TAP) * 0.15 : 1})`}}>{label}</div>
                <div style={{display: 'flex', gap: 2, marginTop: 2}}>
                  {ids.map((id, j) => (
                    <div key={id} style={{width: 5, height: 5, borderRadius: 3, background: mate(id).color, opacity: prog(f, 2 + ((n + 5) % 7) * 2 + j, 8)}} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 420, borderRadius: '28px 28px 0 0', background: '#fff', boxShadow: '0 -14px 40px rgba(0,0,0,0.14)', transform: `translateY(${(1 - sheet) * 440}px)`, zIndex: 30, padding: '14px 20px'}}>
        <div style={{width: 40, height: 5, borderRadius: 3, background: '#DCD5CB', margin: '0 auto 16px'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 6, height: 46, borderRadius: 3, background: C.orange}} />
          <div>
            <div style={{fontSize: 21, fontWeight: 700}}>Big grocery run</div>
            <div style={{fontSize: 14, color: C.sub, marginTop: 2}}>Saturday 14 Nov · 11:00 · Repeats weekly</div>
          </div>
        </div>
        {(
          [
            ['Place', <span key="p">Riverside Superstore</span>],
            [
              'Going',
              <span key="g" style={{display: 'flex', alignItems: 'center', gap: 6}}>
                {['maya', 'sam', 'priya'].map((id) => (
                  <MateAvatar key={id} m={mate(id)} size={26} />
                ))}
                <span style={{fontSize: 14, marginLeft: 4}}>Maya, Sam, Priya</span>
              </span>,
            ],
            [
              'Driving',
              <span key="d" style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <MateAvatar m={mate('jordan')} size={26} />
                <b>Jordan</b>
              </span>,
            ],
            ['Notes', <span key="n" style={{color: C.sub}}>Bring the big bags</span>],
          ] as [string, React.ReactNode][]
        ).map(([k, v], i) => (
          <div key={k} style={{display: 'flex', alignItems: 'center', height: 54, borderTop: i ? `1px solid ${C.line}` : 'none', marginTop: i ? 0 : 18, fontSize: 15, opacity: prog(f, EVENT_TAP + 10 + i * 5, 10)}}>
            <span style={{width: 80, color: C.label, fontWeight: 600}}>{k}</span>
            {v}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none'}}>
        <Touch f={f} at={EVENT_TAP} x={330} y={346} t={T} />
      </div>
    </Screen>
  );
};

// ---------------------------------------------------------------------------
/** 07 — Insights: the fairness view over four weeks, plus weekly wins. */
const FAIR = [
  {id: 'maya', n: 18},
  {id: 'jordan', n: 16},
  {id: 'priya', n: 17},
  {id: 'sam', n: 8},
];
export const FairnessScreen: React.FC<{f: number}> = ({f}) => {
  const k = prog(f, 4, 26, easeInOut);
  return (
    <Screen>
      <Title eyebrow={HOUSEHOLD.toUpperCase()} title="Insights" right={<MatesRow />} />
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 136, padding: 18}}>
        <div style={{fontSize: 13, letterSpacing: 1.8, color: C.label, fontWeight: 700}}>WEEKLY WINS</div>
        <div style={{display: 'flex', gap: 10, marginTop: 12}}>
          {(
            [
              [23, 'chores done'],
              [3, 'perfect days'],
            ] as [number, string][]
          ).map(([v, l]) => (
            <div key={l} style={{flex: 1, borderRadius: 18, background: '#F6F2ED', padding: '12px 14px'}}>
              <div style={{fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{Math.round(v * k)}</div>
              <div style={{fontSize: 12.5, color: C.sub}}>{l}</div>
            </div>
          ))}
          <div style={{flex: 1.2, borderRadius: 18, background: C.orangeSoft, padding: '12px 14px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <MateAvatar m={mate('priya')} size={30} />
              <span style={{fontSize: 17, fontWeight: 700}}>Priya</span>
            </div>
            <div style={{fontSize: 12.5, color: C.orange, fontWeight: 700, marginTop: 6}}>Top helper</div>
          </div>
        </div>
      </div>
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 316, padding: 18}}>
        <div style={{display: 'flex', fontSize: 13, letterSpacing: 1.8, color: C.label, fontWeight: 700}}>
          FAIRNESS<span style={{marginLeft: 'auto', letterSpacing: 0, fontWeight: 600}}>Last 4 weeks</span>
        </div>
        {FAIR.map((r, i) => {
          const m = mate(r.id);
          return (
            <div key={r.id} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 16}}>
              <MateAvatar m={m} size={30} />
              <div style={{flex: 1, height: 16, borderRadius: 8, background: '#F1EDE7', overflow: 'hidden'}}>
                <div style={{width: `${(r.n / 20) * 100 * prog(f, 6 + i * 4, 22, easeInOut)}%`, height: '100%', borderRadius: 8, background: m.color}} />
              </div>
              <span style={{width: 26, textAlign: 'right', fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{Math.round(r.n * k)}</span>
            </div>
          );
        })}
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, padding: '12px 14px', borderRadius: 16, background: '#FBEFE6', fontSize: 14, fontWeight: 600, color: '#A4552A', opacity: prog(f, 36, 10)}}>
          <Sparkle size={13} color={C.orange} /> The load looks uneven this month.
        </div>
      </div>
    </Screen>
  );
};

// ---------------------------------------------------------------------------
/** 08 — Home Screen widget: today's family chores; tick off your own. */
export const WIDGET_TICK = 18;
export const WidgetsScreen: React.FC<{f: number}> = ({f}) => {
  const d = prog(f, WIDGET_TICK, 8);
  const rows = [
    {t: 'Dishes', id: 'maya', mine: true},
    {t: 'Take out the bins', id: 'sam'},
    {t: 'Clean the bathroom', id: 'priya'},
    {t: 'Hoover the lounge', id: 'jordan', done: true},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: ui, color: C.ink, background: 'radial-gradient(90% 45% at 70% 100%, rgba(232,128,72,0.85) 0%, rgba(232,128,72,0) 70%), linear-gradient(180deg, #9C9590 0%, #B7A79B 45%, #CFA88C 72%, #D88E62 100%)'}}>
      <PhoneStatus />
      <div style={{position: 'absolute', left: 22, right: 22, top: 74, borderRadius: 26, background: 'rgba(250,248,245,0.97)', padding: '16px 18px', boxShadow: '0 14px 30px rgba(40,25,15,0.2)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <HouseIcon size={28} />
          <span style={{fontSize: 16, fontWeight: 700}}>{HOUSEHOLD} · Today</span>
          <span style={{marginLeft: 'auto', fontSize: 13, color: C.sub, fontWeight: 600}}>{1 + Math.round(d)}/4</span>
        </div>
        {rows.map((r, i) => {
          const m = mate(r.id);
          const done = r.mine ? d : r.done ? 1 : 0;
          return (
            <div key={r.t} style={{display: 'flex', alignItems: 'center', gap: 12, height: 46, borderTop: `1px solid ${C.line}`, marginTop: i ? 0 : 10}}>
              <div style={{width: 26, height: 26, borderRadius: 13, border: done > 0.05 ? 'none' : `1.8px solid ${r.mine ? C.orange : '#C9C1B6'}`, background: done > 0.05 ? m.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transform: `scale(${r.mine ? 1 + Math.sin(Math.min(1, d) * Math.PI) * 0.25 : 1})`}}>
                {done > 0.05 && <Check size={15} progress={Math.min(1, done * 1.4)} />}
              </div>
              <span style={{fontSize: 15, color: done > 0.5 ? C.sub : C.ink, textDecoration: done > 0.5 ? 'line-through' : 'none'}}>{r.t}</span>
              <span style={{marginLeft: 'auto'}}>
                <MateAvatar m={m} size={24} />
              </span>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 380, display: 'grid', gridTemplateColumns: 'repeat(4, 62px)', justifyContent: 'space-between', rowGap: 22}}>
        {['#FFFFFF', '#7FA6CF', '#F3D776', '#1D1C1A', '#BFDDB2', '#F26A7E', '#FBF8F4', '#B8B4AD'].map((bg, i) => (
          <div key={i} style={{width: 62, height: 62, borderRadius: 15, background: bg, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {i === 6 && <Ring size={34} stroke={5} value={0.75} color={C.orange} track="#EADFD3" />}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 14, right: 14, bottom: 22, height: 92, borderRadius: 32, background: 'rgba(255,255,255,0.28)'}} />
      <div style={{position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none'}}>
        <Touch f={f} at={WIDGET_TICK} x={53} y={151} t={T} />
      </div>
    </div>
  );
};

/** Lock Screen widget: your next chore and your star count. */
export const LockWidget: React.FC = () => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 26px 18px 18px', borderRadius: 34, background: 'rgba(30,26,22,0.82)', color: '#fff', fontFamily: ui}}>
    <Ring size={60} stroke={6} value={0.6} color="#fff" track="rgba(255,255,255,0.25)">
      <span style={{fontSize: 19, fontWeight: 700}}>12</span>
    </Ring>
    <div>
      <div style={{fontSize: 20, opacity: 0.7}}>Next chore · 12 stars</div>
      <div style={{fontSize: 28, fontWeight: 700}}>Descale the kettle</div>
    </div>
  </div>
);
