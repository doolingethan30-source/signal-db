import {easeInOut, mix, pop, prog} from '../../anim';
import {Sparkle} from '../../components/Icons';
import {LIGHT_THEME, UI} from '../../launch/theme';
import {Status, Touch} from '../../launch/ui';
import {ACCENT, INK, member, STAR, SUB} from '../theme';
import {Avatar, RoundCheck, Star} from '../ui';

const T = LIGHT_THEME;
const AVA = member('ava');
const BG = 'linear-gradient(180deg, #F6F1FB 0%, #FBF8F3 45%)';

const StarBalance: React.FC<{n: number; bump: number}> = ({n, bump}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 18, background: '#FFF6E2', fontSize: 18, fontWeight: 700, color: '#8A5D0A', fontVariantNumeric: 'tabular-nums', transform: `scale(${1 + bump * 0.12})`, boxShadow: bump ? `0 0 ${24 * bump}px rgba(242,179,61,${0.6 * bump})` : 'none'}}>
    <Star size={20} />
    {Math.round(n)}
  </div>
);

/** Ava's day: the chore from Mum arrives instantly, she ticks it, stars fly to her balance. */
export const TASK_ARRIVE = 16;
export const TICK_AT = 40;
export const KidDay: React.FC<{f: number}> = ({f}) => {
  const arrive = pop(f, TASK_ARRIVE, 14);
  const done = prog(f, TICK_AT, 10);
  const landed = [0, 1, 2].filter((i) => f >= TICK_AT + 14 + i * 5).length;
  const bump = landed ? Math.max(0, 1 - (f - (TICK_AT + 14 + (landed - 1) * 5)) / 10) : 0;
  const tasks = [
    {t: 'Brush teeth', s: 1, d: 1},
    {t: 'Pack school bag', s: 1, d: 1},
    {t: 'Tidy your room', s: 3, d: done, isNew: true},
    {t: 'Practise piano', s: 2, d: 0},
  ];
  const doneCount = 2 + done;
  const TASK_Y = 262 + 2 * 78; // "Tidy your room" row
  return (
    <div style={{position: 'absolute', inset: 0, background: BG, fontFamily: UI, color: INK, overflow: 'hidden'}}>
      <Status t={T} />
      <div style={{position: 'absolute', left: 20, right: 18, top: 66, display: 'flex', alignItems: 'center', gap: 12}}>
        <Avatar m={AVA} size={50} />
        <div>
          <div style={{fontSize: 26, fontWeight: 700, letterSpacing: -0.4}}>Hi Ava!</div>
          <div style={{fontSize: 14, color: SUB}}>Thursday · 4 things today</div>
        </div>
        <div style={{marginLeft: 'auto'}}>
          <StarBalance n={12 + landed} bump={bump} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 20, right: 20, top: 150}}>
        <div style={{display: 'flex', fontSize: 14, fontWeight: 600, color: SUB}}>
          Today’s progress<span style={{marginLeft: 'auto', color: AVA.color}}>{Math.round(doneCount)} of 4</span>
        </div>
        <div style={{height: 12, borderRadius: 6, background: '#ECE4F6', marginTop: 10, overflow: 'hidden'}}>
          <div style={{width: `${(doneCount / 4) * 100}%`, height: '100%', borderRadius: 6, background: `linear-gradient(90deg, ${AVA.color}, #C29AF0)`}} />
        </div>
      </div>
      {tasks.map((x, i) => {
        const isNew = !!x.isNew;
        const k = isNew ? arrive : 1;
        const y = 262 + i * 78;
        return (
          <div
            key={x.t}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: isNew ? y : i > 2 ? mix(262 + 2 * 78, y, Math.min(1, arrive)) : y,
              height: 66,
              borderRadius: 20,
              background: '#fff',
              boxShadow: isNew && f < TICK_AT + 20 ? `0 0 0 ${2 * k}px rgba(155,107,223,${0.7 * k}), 0 12px 26px rgba(155,107,223,${0.2 * k})` : '0 1px 2px rgba(40,30,20,0.04), 0 8px 22px rgba(40,30,20,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 16px',
              opacity: isNew ? Math.min(1, k * 1.5) : 1,
              transform: isNew ? `translateX(${(1 - k) * 80}px) scale(${0.94 + 0.06 * k})` : 'none',
            }}
          >
            <RoundCheck size={28} done={x.d} color={AVA.color} />
            <div>
              <div style={{fontSize: 17, fontWeight: 600, color: x.d > 0.5 ? SUB : INK, textDecoration: x.d > 0.5 ? 'line-through' : 'none'}}>{x.t}</div>
              {isNew && <div style={{fontSize: 12.5, color: AVA.color, fontWeight: 600, marginTop: 2}}>New from Mum · due 6 PM</div>}
            </div>
            <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 15, fontWeight: 700, color: '#8A5D0A'}}>
              <Star size={17} /> {x.s}
            </div>
          </div>
        );
      })}
      {/* stars fly from the task to the balance */}
      {[0, 1, 2].map((i) => {
        const k = prog(f, TICK_AT + 4 + i * 5, 12, easeInOut);
        if (k <= 0 || k >= 1) return null;
        const x = mix(330, 318, k) + Math.sin(k * Math.PI) * -60;
        const y = mix(TASK_Y + 33, 88, k);
        return (
          <div key={i} style={{position: 'absolute', left: x - 14, top: y - 14, transform: `scale(${1.4 - 0.6 * k}) rotate(${k * 200}deg)`, filter: 'drop-shadow(0 0 8px rgba(242,179,61,0.8))', zIndex: 10}}>
            <Star size={28} />
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 600,
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 700,
          color: '#8A5D0A',
          opacity: Math.min(prog(f, TICK_AT + 26, 8), 1 - prog(f, TICK_AT + 46, 8)),
          transform: `translateY(${(1 - prog(f, TICK_AT + 26, 10)) * 12}px)`,
        }}
      >
        +3 stars · nice one, Ava!
      </div>
      <Touch f={f} at={TICK_AT} x={46} y={TASK_Y + 33} t={T} />
    </div>
  );
};

/** Ava's rewards: she redeems Movie night, it waits for a parent, then it's approved. */
export const REDEEM_AT = 10;
export const APPROVED_AT = 66;
export const Rewards: React.FC<{f: number}> = ({f}) => {
  const asking = f >= REDEEM_AT + 4;
  const approved = f >= APPROVED_AT;
  const spend = prog(f, APPROVED_AT + 4, 14, easeInOut);
  const celebrate = pop(f, APPROVED_AT, 12);
  const press = f >= REDEEM_AT && f < REDEEM_AT + 8 ? Math.sin(((f - REDEEM_AT) / 8) * Math.PI) : 0;
  const rewards = [
    {t: 'Movie night', s: 15, c: '#F7D9C8'},
    {t: 'Ice-cream trip', s: 10, c: '#D7ECF7'},
    {t: 'Extra screen time', s: 20, c: '#E6DAF6', locked: true},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, background: BG, fontFamily: UI, color: INK, overflow: 'hidden'}}>
      <Status t={T} />
      <div style={{position: 'absolute', left: 20, right: 18, top: 66, display: 'flex', alignItems: 'center'}}>
        <div>
          <div style={{fontSize: 13, letterSpacing: 2.2, color: SUB, fontWeight: 600}}>AVA’S</div>
          <div style={{fontSize: 30, fontWeight: 700, letterSpacing: -0.6}}>Rewards</div>
        </div>
        <div style={{marginLeft: 'auto'}}>
          <StarBalance n={mix(15, 0, spend)} bump={0} />
        </div>
      </div>
      {rewards.map((r, i) => {
        const main = i === 0;
        return (
          <div
            key={r.t}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: 156 + i * 168,
              height: 152,
              borderRadius: 24,
              background: '#fff',
              boxShadow: main && approved ? `0 0 0 ${2.5 * celebrate}px #3FAE6E, 0 16px 34px rgba(63,174,110,${0.25 * celebrate})` : '0 1px 2px rgba(40,30,20,0.04), 0 10px 26px rgba(40,30,20,0.06)',
              padding: 16,
              boxSizing: 'border-box',
              display: 'flex',
              gap: 16,
              opacity: r.locked ? 0.55 : 1,
            }}
          >
            <div style={{width: 120, borderRadius: 18, background: r.c, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Star size={46} color={r.locked ? '#C9C0D8' : STAR} />
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div>
                <div style={{fontSize: 19, fontWeight: 700}}>{r.t}</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 4, fontSize: 15, fontWeight: 600, color: '#8A5D0A', marginTop: 4}}>
                  <Star size={15} /> {r.s} stars
                </div>
              </div>
              {main ? (
                <div
                  style={{
                    height: 42,
                    borderRadius: 14,
                    background: approved ? '#3FAE6E' : asking ? '#EFE9E1' : ACCENT,
                    color: asking && !approved ? INK : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    fontSize: 15,
                    fontWeight: 600,
                    transform: `scale(${(1 - press * 0.05) * (1 + Math.sin(Math.min(1, celebrate) * Math.PI) * 0.06)})`,
                  }}
                >
                  {approved ? (
                    <>
                      <Sparkle size={13} color="#fff" /> Approved — enjoy!
                    </>
                  ) : asking ? (
                    'Asking Mum…'
                  ) : (
                    'Redeem'
                  )}
                </div>
              ) : (
                <div style={{height: 42, borderRadius: 14, background: '#F3EEE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: SUB, fontWeight: 600}}>
                  {r.locked ? 'Keep going!' : 'Redeem'}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <Touch f={f} at={REDEEM_AT} x={262} y={156 + 152 - 16 - 21} t={T} />
    </div>
  );
};
