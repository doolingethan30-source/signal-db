import {pop, prog} from '../../anim';
import {Chevron, Sparkle} from '../../components/Icons';
import {LIGHT_THEME, UI} from '../../launch/theme';
import {Status, Touch} from '../../launch/ui';
import {ACCENT, FAMILY, INK, member, STAR, SUB} from '../theme';
import {Avatar, FamilyRow, ProPill, Star} from '../ui';

const T = LIGHT_THEME;
const card: React.CSSProperties = {background: '#fff', borderRadius: 22, boxShadow: '0 1px 2px rgba(40,30,20,0.04), 0 10px 26px rgba(40,30,20,0.06)'};

/** Mum's lock screen in the problem act: everyone's reminders land on one phone. */
type Notif = {from?: 'mum' | 'dad' | 'ava' | 'leo'; app?: string; text: string; at: number};
const NOTIFS: Notif[] = [
  {from: 'leo', text: "Where's my football kit?", at: 8},
  {from: 'ava', text: 'Can you sign my form??', at: 24},
  {from: 'dad', text: 'Did we get milk?', at: 40},
  {app: 'Reminders', text: 'Bins out tonight', at: 56},
  {app: 'School', text: 'Permission slip due tomorrow', at: 70},
  {app: 'Vet', text: "Biscuit's booster — book now", at: 84},
];

export const MumLock: React.FC<{f: number}> = ({f}) => {
  const shown = NOTIFS.filter((n) => f >= n.at);
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #CDB8A6 0%, #A9887A 60%, #8E6E66 100%)', fontFamily: UI, color: '#fff'}}>
      <Status t={T} color="#fff" />
      <div style={{position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontSize: 17, fontWeight: 600, opacity: 0.9}}>Thursday 6 November</div>
        <div style={{fontSize: 86, fontWeight: 600, letterSpacing: -2, lineHeight: '92px'}}>7:42</div>
      </div>
      <div style={{position: 'absolute', left: 12, right: 12, top: 268}}>
        {shown
          .slice()
          .reverse()
          .map((n, i) => {
            const k = pop(f, n.at, 13);
            const who = n.from ? member(n.from) : null;
            return (
              <div
                key={n.at}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  marginBottom: 8,
                  borderRadius: 20,
                  background: 'rgba(250,246,242,0.82)',
                  backdropFilter: 'blur(16px)',
                  color: INK,
                  transform: `translateY(${(1 - k) * -40}px) scale(${0.92 + 0.08 * k})`,
                  opacity: Math.min(1, k * 1.4) * (i > 4 ? 0.5 : 1),
                }}
              >
                {who ? (
                  <Avatar m={who} size={38} />
                ) : (
                  <div style={{width: 38, height: 38, borderRadius: 10, background: n.app === 'School' ? '#4A7FD4' : n.app === 'Vet' ? '#3FAE6E' : '#E8735A'}} />
                )}
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{display: 'flex', fontSize: 14, fontWeight: 600}}>
                    {who ? who.name : n.app}
                    <span style={{marginLeft: 'auto', fontWeight: 400, color: SUB, fontSize: 12.5}}>now</span>
                  </div>
                  <div style={{fontSize: 14, color: '#4F4943', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{n.text}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export type HubState = {
  rings: Record<string, number>;
  stars: Record<string, number>;
  highlight?: {id: string; k: number; text: string};
  toast?: {k: number; text: string};
};

/** The Family hub: everyone's progress and stars at a glance. */
export const FamilyHub: React.FC<{s: HubState; children?: React.ReactNode}> = ({s, children}) => (
  <div style={{position: 'absolute', inset: 0, background: '#FAF7F2', fontFamily: UI, color: INK, overflow: 'hidden'}}>
    <Status t={T} />
    <div style={{position: 'absolute', left: 22, right: 20, top: 62, display: 'flex', alignItems: 'flex-end'}}>
      <div>
        <div style={{fontSize: 12, letterSpacing: 2.4, color: SUB, fontWeight: 600}}>THE PARKERS</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 2}}>
          <span style={{fontSize: 30, fontWeight: 700, letterSpacing: -0.6}}>Family</span>
          <ProPill />
        </div>
      </div>
      <div style={{marginLeft: 'auto', marginBottom: 4}}>
        <FamilyRow size={28} />
      </div>
    </div>
    <div style={{...card, position: 'absolute', left: 14, right: 14, top: 140, padding: '10px 16px'}}>
      <div style={{fontSize: 13, fontWeight: 600, color: SUB, letterSpacing: 1.4, margin: '4px 0 2px'}}>TODAY</div>
      {FAMILY.map((m) => {
        const hl = s.highlight?.id === m.id ? s.highlight.k : 0;
        const total = m.id === 'mum' ? 6 : m.id === 'leo' ? 3 : 4;
        return (
          <div key={m.id} style={{display: 'flex', alignItems: 'center', gap: 12, height: 66, borderTop: m.id === 'mum' ? 'none' : '1px solid #EFEAE2', position: 'relative'}}>
            {hl > 0 && <div style={{position: 'absolute', inset: '4px -8px', borderRadius: 14, background: `rgba(155,107,223,${0.12 * hl})`, boxShadow: `inset 0 0 0 1.5px rgba(155,107,223,${0.6 * hl})`}} />}
            <Avatar m={m} size={40} ring={s.rings[m.id]} />
            <div style={{position: 'relative'}}>
              <div style={{fontSize: 16, fontWeight: 600}}>{m.name}</div>
              <div style={{fontSize: 13, color: SUB, marginTop: 2}}>
                {hl > 0.3 && s.highlight ? <span style={{color: '#9B6BDF', fontWeight: 600}}>{s.highlight.text}</span> : `${Math.round(s.rings[m.id] * total)} of ${total} done`}
              </div>
            </div>
            <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums', position: 'relative'}}>
              <Star size={16} />
              {Math.round(s.stars[m.id])}
            </div>
            <Chevron size={12} color={SUB} />
          </div>
        );
      })}
    </div>
    <div style={{...card, position: 'absolute', left: 14, right: 14, top: 448, padding: '14px 16px'}}>
      <div style={{fontSize: 13, fontWeight: 600, color: SUB, letterSpacing: 1.4}}>UP NEXT</div>
      {[
        {m: member('ava'), t: 'Piano lesson', time: '16:00'},
        {m: member('leo'), t: 'Football practice', time: '17:00'},
        {m: null, t: 'Family dinner', time: '19:00'},
      ].map((e) => (
        <div key={e.t} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 12}}>
          <div style={{width: 4, height: 30, borderRadius: 2, background: e.m ? e.m.color : ACCENT}} />
          <div style={{fontSize: 15}}>
            {e.t}
            <span style={{color: SUB}}>{e.m ? ` · ${e.m.name}` : ' · Everyone'}</span>
          </div>
          <span style={{marginLeft: 'auto', fontSize: 14, color: SUB, fontVariantNumeric: 'tabular-nums'}}>{e.time}</span>
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 14, right: 14, top: 646, height: 54, borderRadius: 18, background: ACCENT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16.5, fontWeight: 600, boxShadow: '0 10px 22px rgba(224,122,63,0.3)'}}>
      <svg width="14" height="14" viewBox="0 0 16 16">
        <path d="M8 2 V14 M2 8 H14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
      Assign a chore
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 92, background: '#FAF7F2', borderTop: '1px solid #EEE8DF', display: 'flex', justifyContent: 'space-around', paddingTop: 12, boxSizing: 'border-box'}}>
      {['Today', 'Family', 'Lists', 'Rewards'].map((n) => (
        <div key={n} style={{fontSize: 11.5, fontWeight: n === 'Family' ? 700 : 500, color: n === 'Family' ? ACCENT : SUB, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
          <div style={{width: 22, height: 22, borderRadius: 7, background: n === 'Family' ? ACCENT : '#D9D2C8', opacity: n === 'Family' ? 1 : 0.7}} />
          {n}
        </div>
      ))}
    </div>
    {s.toast && (
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 60,
          padding: '12px 16px',
          borderRadius: 20,
          background: 'rgba(250,248,245,0.96)',
          boxShadow: '0 14px 30px rgba(0,0,0,0.16)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 14,
          fontWeight: 600,
          transform: `translateY(${(s.toast.k - 1) * 110}px)`,
          opacity: s.toast.k,
          zIndex: 30,
        }}
      >
        <Avatar m={member('ava')} size={34} />
        <span style={{flex: 1}}>{s.toast.text}</span>
        <Star size={16} />
      </div>
    )}
    {children}
  </div>
);

/** "New chore" sheet: pick who, how many stars and when, then assign. f is local. */
export const AssignSheet: React.FC<{f: number}> = ({f}) => {
  const open = Math.min(prog(f, 2, 14), 1 - prog(f, 72, 12));
  const title = 'Tidy your room';
  const typed = title.slice(0, Math.max(0, Math.min(title.length, Math.floor((f - 10) / 1.1))));
  const avaOn = f >= 26;
  const stars = f >= 42 ? 3 : f >= 38 ? 2 : f >= 34 ? 1 : 0;
  const sent = f >= 58;
  const press = f >= 54 && f < 62 ? Math.sin(((f - 54) / 8) * Math.PI) : 0;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: `rgba(20,16,12,${0.25 * open})`, zIndex: 20}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, borderRadius: '28px 28px 0 0', background: '#FAF7F2', transform: `translateY(${(1 - open) * 600}px)`, zIndex: 21, padding: '12px 20px', boxSizing: 'border-box', fontFamily: UI, color: INK}}>
        <div style={{width: 40, height: 5, borderRadius: 3, background: '#DCD5CB', margin: '0 auto 14px'}} />
        <div style={{fontSize: 22, fontWeight: 700}}>New chore</div>
        <div style={{...card, marginTop: 14, padding: '16px 18px', fontSize: 19}}>
          {typed}
          <span style={{display: 'inline-block', width: 2, height: 21, background: ACCENT, marginLeft: 1, verticalAlign: -4, opacity: f < 26 && Math.floor(f / 7) % 2 === 0 ? 1 : 0}} />
        </div>
        <div style={{fontSize: 13, fontWeight: 600, color: SUB, letterSpacing: 1.4, marginTop: 20}}>ASSIGN TO</div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12}}>
          {FAMILY.map((m) => {
            const on = m.id === 'ava' && avaOn;
            const k = on ? pop(f, 26, 12) : 0;
            return (
              <div key={m.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 76, opacity: avaOn && !on ? 0.45 : 1}}>
                <div style={{borderRadius: '50%', padding: 3, boxShadow: on ? `0 0 0 3px ${m.color}` : 'none', transform: `scale(${1 + Math.sin(Math.min(1, k) * Math.PI) * 0.12})`}}>
                  <Avatar m={m} size={52} />
                </div>
                <span style={{fontSize: 14, fontWeight: on ? 700 : 500}}>{m.name}</span>
              </div>
            );
          })}
        </div>
        <div style={{...card, marginTop: 20, padding: '14px 18px', display: 'flex', alignItems: 'center'}}>
          <span style={{fontSize: 16, fontWeight: 600}}>Reward</span>
          <div style={{marginLeft: 'auto', display: 'flex', gap: 6}}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{transform: `scale(${i < stars ? 1 + Math.sin(Math.min(1, prog(f, 34 + i * 4, 8)) * Math.PI) * 0.3 : 1})`}}>
                <Star size={26} color={i < stars ? STAR : '#E4DED5'} />
              </div>
            ))}
          </div>
        </div>
        <div style={{...card, marginTop: 10, padding: '14px 18px', display: 'flex', fontSize: 16}}>
          <span style={{fontWeight: 600}}>Due</span>
          <span style={{marginLeft: 'auto', color: SUB}}>Today · 6:00 PM</span>
        </div>
        <div
          style={{
            marginTop: 18,
            height: 56,
            borderRadius: 18,
            background: sent ? '#EFE9E1' : ACCENT,
            color: sent ? INK : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 17,
            fontWeight: 600,
            transform: `scale(${1 - press * 0.04})`,
          }}
        >
          {sent ? (
            <>
              <Sparkle size={14} color={ACCENT} /> Sent to Ava
            </>
          ) : avaOn ? (
            'Assign to Ava'
          ) : (
            'Assign'
          )}
        </div>
      </div>
      <div style={{position: 'absolute', inset: 0, zIndex: 22, pointerEvents: 'none'}}>
        <Touch f={f} at={26} x={252} y={852 - 560 + 12 + 5 + 14 + 26 + 14 + 55 + 20 + 16 + 12 + 30} t={T} />
        <Touch f={f} at={54} x={196} y={852 - 560 + 12 + 5 + 14 + 26 + 14 + 55 + 20 + 16 + 12 + 82 + 20 + 52 + 10 + 50 + 18 + 28} t={T} />
      </div>
    </>
  );
};

/** Approval card that drops into the parent's hub when a child redeems a reward. */
export const ApproveCard: React.FC<{f: number}> = ({f}) => {
  const k = pop(f, 0, 14);
  const approved = f >= 26;
  const press = f >= 22 && f < 30 ? Math.sin(((f - 22) / 8) * Math.PI) : 0;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: `rgba(20,16,12,${0.18 * Math.min(1, k)})`, zIndex: 24}} />
      <div style={{position: 'absolute', left: 16, right: 16, top: 220, padding: '20px 20px 18px', borderRadius: 26, background: '#FFFDFB', boxShadow: '0 30px 60px rgba(40,25,15,0.25)', zIndex: 25, fontFamily: UI, color: INK, transform: `translateY(${(1 - k) * -80}px) scale(${0.9 + 0.1 * k})`, opacity: Math.min(1, k * 1.4)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <Avatar m={member('ava')} size={44} />
          <div>
            <div style={{fontSize: 14, color: SUB}}>Ava wants to redeem</div>
            <div style={{fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6}}>
              Movie night · <Star size={18} /> 15
            </div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 10, marginTop: 18}}>
          {!approved && <div style={{flex: 1, height: 50, borderRadius: 16, background: '#EFE9E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600}}>Not now</div>}
          <div style={{flex: 1, height: 50, borderRadius: 16, background: approved ? '#3FAE6E' : ACCENT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16, fontWeight: 600, transform: `scale(${1 - press * 0.05})`}}>
            {approved ? (
              <>
                <Sparkle size={14} color="#fff" /> Approved
              </>
            ) : (
              'Approve'
            )}
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', inset: 0, zIndex: 26, pointerEvents: 'none'}}>
        <Touch f={f} at={22} x={286} y={330} t={T} />
      </div>
    </>
  );
};
