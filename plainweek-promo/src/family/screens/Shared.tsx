import {pop, prog} from '../../anim';
import {LIGHT_THEME, UI} from '../../launch/theme';
import {Status} from '../../launch/ui';
import {FAMILY, INK, member, Member, SUB} from '../theme';
import {Avatar, FamilyRow, RoundCheck, Star} from '../ui';

const T = LIGHT_THEME;
const card: React.CSSProperties = {background: '#fff', borderRadius: 20, boxShadow: '0 1px 2px rgba(40,30,20,0.04), 0 8px 22px rgba(40,30,20,0.06)'};

const Header: React.FC<{eyebrow: string; title: string}> = ({eyebrow, title}) => (
  <div style={{position: 'absolute', left: 20, right: 18, top: 64, display: 'flex', alignItems: 'flex-end'}}>
    <div>
      <div style={{fontSize: 12.5, letterSpacing: 2.2, color: SUB, fontWeight: 600}}>{eyebrow}</div>
      <div style={{fontSize: 30, fontWeight: 700, letterSpacing: -0.6}}>{title}</div>
    </div>
    <div style={{marginLeft: 'auto', marginBottom: 4}}>
      <FamilyRow size={26} />
    </div>
  </div>
);

/** Shared grocery list: different family members tick and add items live. */
export const Shopping: React.FC<{f: number}> = ({f}) => {
  const items: {t: string; by: Member; tick?: number; tickBy?: Member; newAt?: number}[] = [
    {t: 'Milk', by: member('mum'), tick: 22, tickBy: member('dad')},
    {t: 'Bananas', by: member('ava'), tick: 46, tickBy: member('mum')},
    {t: 'Pasta', by: member('dad')},
    {t: 'Apples', by: member('mum')},
    {t: 'Dog food', by: member('leo')},
    {t: 'Oat milk', by: member('dad'), newAt: 64},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, background: '#FAF7F2', fontFamily: UI, color: INK, overflow: 'hidden'}}>
      <Status t={T} />
      <Header eyebrow="SHARED LIST" title="Groceries" />
      <div style={{...card, position: 'absolute', left: 14, right: 14, top: 150, padding: '6px 16px'}}>
        {items.map((x, i) => {
          if (x.newAt !== undefined && f < x.newAt) return null;
          const k = x.newAt !== undefined ? pop(f, x.newAt, 13) : 1;
          const d = x.tick !== undefined ? prog(f, x.tick, 10) : 0;
          const who = d > 0.5 && x.tickBy ? x.tickBy : x.by;
          return (
            <div
              key={x.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                height: 62,
                borderTop: i ? '1px solid #EFEAE2' : 'none',
                opacity: Math.min(1, k * 1.4),
                transform: `translateY(${(1 - k) * -14}px)`,
                background: x.newAt !== undefined ? `rgba(74,127,212,${0.1 * (1 - prog(f, x.newAt + 20, 30))})` : 'none',
                margin: '0 -16px',
                padding: '0 16px',
              }}
            >
              <RoundCheck size={26} done={d} color={x.tickBy?.color} />
              <div>
                <div style={{fontSize: 17, color: d > 0.5 ? SUB : INK, textDecoration: d > 0.5 ? 'line-through' : 'none'}}>{x.t}</div>
                {x.newAt !== undefined && <div style={{fontSize: 12.5, color: '#4A7FD4', fontWeight: 600}}>Dad added · just now</div>}
                {d > 0.5 && <div style={{fontSize: 12.5, color: who.color, fontWeight: 600}}>Got it · {who.name}</div>}
              </div>
              <div style={{marginLeft: 'auto'}}>
                <Avatar m={who} size={26} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Family calendar: everyone's week, colour-coded by person. */
const EVENTS: {d: number; h: number; dur: number; m: Member['id']; t: string; at: number}[] = [
  {d: 0, h: 9, dur: 1.5, m: 'mum', t: 'Yoga', at: 4},
  {d: 0, h: 16, dur: 1, m: 'leo', t: 'Swim', at: 8},
  {d: 1, h: 16, dur: 1, m: 'ava', t: 'Piano', at: 12},
  {d: 2, h: 11, dur: 1.5, m: 'dad', t: 'Dentist', at: 16},
  {d: 2, h: 17, dur: 1.5, m: 'leo', t: 'Football', at: 20},
  {d: 3, h: 16, dur: 1, m: 'ava', t: 'Piano', at: 24},
  {d: 3, h: 19, dur: 1.5, m: 'mum', t: 'Dinner', at: 28},
  {d: 4, h: 18, dur: 2, m: 'dad', t: 'Date night', at: 32},
  {d: 5, h: 10, dur: 2, m: 'leo', t: 'Match', at: 36},
  {d: 5, h: 15, dur: 1.5, m: 'ava', t: 'Party', at: 40},
  {d: 6, h: 12, dur: 2, m: 'mum', t: 'Grandma', at: 44},
];
export const FamilyCalendar: React.FC<{f: number}> = ({f}) => {
  const X0 = 40;
  const CW = 48;
  const Y0 = 196;
  const HH = 34;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#FAF7F2', fontFamily: UI, color: INK, overflow: 'hidden'}}>
      <Status t={T} />
      <Header eyebrow="FAMILY CALENDAR" title="This week" />
      <div style={{...card, position: 'absolute', left: 10, right: 10, top: 144, bottom: 30}} />
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
        <div key={i} style={{position: 'absolute', left: X0 + i * CW, width: CW, top: 158, textAlign: 'center'}}>
          <div style={{fontSize: 11.5, color: SUB, fontWeight: 600}}>{d}</div>
          <div style={{margin: '4px auto 0', width: 28, height: 28, borderRadius: 14, background: i === 3 ? '#E07A3F' : 'transparent', color: i === 3 ? '#fff' : INK, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{3 + i}</div>
        </div>
      ))}
      <div style={{position: 'absolute', left: X0 + 3 * CW, width: CW, top: Y0 + 20, height: 13 * HH, background: 'rgba(224,122,63,0.06)', borderRadius: 10}} />
      {Array.from({length: 7}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 16, right: 16, top: Y0 + 26 + i * 2 * HH, display: 'flex', alignItems: 'center', gap: 4, fontSize: 9.5, color: SUB}}>
          <span style={{width: 20}}>{8 + i * 2}</span>
          <div style={{flex: 1, height: 1, background: '#F0EBE4'}} />
        </div>
      ))}
      {EVENTS.map((e, i) => {
        const k = pop(f, e.at, 12);
        if (f < e.at) return null;
        const m = member(e.m);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: X0 + e.d * CW + 3,
              width: CW - 6,
              top: Y0 + 26 + (e.h - 8) * HH,
              height: e.dur * HH - 4,
              borderRadius: 8,
              background: `${m.color}2E`,
              borderLeft: `3px solid ${m.color}`,
              padding: '3px 4px',
              boxSizing: 'border-box',
              fontSize: 9.5,
              fontWeight: 700,
              color: m.color,
              overflow: 'hidden',
              transform: `scale(${0.6 + 0.4 * k})`,
              opacity: Math.min(1, k * 1.5),
            }}
          >
            {e.t}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 20, right: 20, bottom: 46, display: 'flex', justifyContent: 'space-around'}}>
        {FAMILY.map((m) => (
          <div key={m.id} style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600}}>
            <div style={{width: 10, height: 10, borderRadius: 5, background: m.color}} />
            {m.name}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Everyone's progress today, filling live. */
const TARGETS: Record<string, {done: number; total: number; stars: number}> = {
  mum: {done: 5, total: 6, stars: 0},
  dad: {done: 3, total: 4, stars: 0},
  ava: {done: 4, total: 4, stars: 15},
  leo: {done: 3, total: 3, stars: 9},
};
export const FamilyProgress: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, background: '#FAF7F2', fontFamily: UI, color: INK, overflow: 'hidden'}}>
    <Status t={T} />
    <Header eyebrow="EVERYONE TODAY" title="Progress" />
    {FAMILY.map((m, i) => {
      const t = TARGETS[m.id];
      const k = prog(f, 6 + i * 8, 40);
      const v = (t.done / t.total) * k;
      return (
        <div key={m.id} style={{...card, position: 'absolute', left: 14, right: 14, top: 150 + i * 132, height: 118, display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px'}}>
          <Avatar m={m} size={58} ring={v} />
          <div>
            <div style={{fontSize: 19, fontWeight: 700}}>{m.name}</div>
            <div style={{fontSize: 14, color: SUB, marginTop: 3}}>
              {Math.round(t.done * k)} of {t.total} done{v > 0.99 ? ' · all done!' : ''}
            </div>
          </div>
          {t.stars > 0 && (
            <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 17, fontWeight: 700, color: '#8A5D0A'}}>
              <Star size={19} /> {Math.round(t.stars * k)}
            </div>
          )}
        </div>
      );
    })}
    <div style={{position: 'absolute', left: 14, right: 14, top: 690, height: 56, borderRadius: 18, background: '#FFF3E9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#A4552A'}}>
      <Star size={16} color="#E07A3F" /> Family streak · 12 days
    </div>
  </div>
);
