import {interpolate} from 'remotion';
import {easeInOut, mix, pop, prog} from '../../anim';
import {Check, Chevron, Sparkle} from '../../components/Icons';
import {Theme, UI} from '../theme';
import {cardStyle, Status, Touch} from '../ui';

const TOP = 222;
const HOUR_H = 46;
const START = 8;
const y = (h: number) => TOP + (h - START) * HOUR_H;
const X0 = 78;
const X1 = 362;

const MEETINGS = [
  {title: 'Team stand-up', meta: 'Zoom', from: 10, to: 10.5, color: '#5B8DEF'},
  {title: 'Lunch with Ana', meta: 'Café Nord', from: 12.5, to: 13.5, color: '#3FAE6E'},
];
const CLIENT = {title: 'Client call', meta: 'Online', from: 15, to: 15.75, color: '#8E6CE8', movedTo: 13.5};

const BLOCKS = [
  {title: 'Write proposal', meta: 'Focus · 2h', from: 10.5, dur: 2, chip: {x: 18, w: 112, label: 'Proposal · 2h'}, at: 30},
  {title: 'Review budget', meta: '45 min', from: 13.75, dur: 0.75, chip: {x: 138, w: 116, label: 'Budget · 45m'}, at: 38, replanTo: 15},
  {title: 'Gym', meta: '1h', from: 16.75, dur: 1, chip: {x: 262, w: 84, label: 'Gym · 1h'}, at: 46},
];
const FLIGHT = 20;
export const BLOCK_TAP = 8;
export const NOTIFY = 100;
export const REPLAN_TAP = 146;

/** Day timeline: AI time blocking (f 0–96) then one-tap re-planning (f 96–182). */
export const Timeline: React.FC<{t: Theme; f: number}> = ({t, f}) => {
  const thinking = Math.min(prog(f, BLOCK_TAP + 4, 6), 1 - prog(f, 56, 8));
  const planned = prog(f, 66, 10);
  const banner = Math.min(pop(f, NOTIFY, 16), 1 - prog(f, 150, 12, easeInOut));
  const clientMove = prog(f, NOTIFY + 12, 20, easeInOut);
  const clientFrom = mix(CLIENT.from, CLIENT.movedTo, clientMove);
  const replanMove = prog(f, REPLAN_TAP + 4, 20, easeInOut);
  const conflict = Math.min(prog(f, NOTIFY + 26, 8), 1 - replanMove);
  const replanBtn = prog(f, NOTIFY + 30, 10);
  const done = prog(f, REPLAN_TAP + 24, 10);
  const toast = Math.min(pop(f, REPLAN_TAP + 22, 14), 1 - prog(f, 200, 8));

  const ev = (from: number, to: number) => ({top: y(from) + 2, height: (to - from) * HOUR_H - 4});

  let label = 'Block my day';
  let btnBg = t.accent;
  let btnInk = '#fff';
  if (thinking > 0.2) label = 'Finding time around meetings…';
  if (planned > 0.5) {
    label = '3 tasks fitted around 3 meetings';
    btnBg = t.card2;
    btnInk = t.ink;
  }
  if (replanBtn > 0.5) {
    label = 'Re-plan day';
    btnBg = t.accent;
    btnInk = '#fff';
  }
  if (replanMove > 0.3) label = 'Re-planning…';
  if (done > 0.5) {
    label = 'Day re-planned';
    btnBg = t.card2;
    btnInk = t.ink;
  }
  const press = (at: number) => (f >= at && f < at + 10 ? Math.sin(((f - at) / 10) * Math.PI) : 0);
  const btnScale = 1 - 0.04 * (press(BLOCK_TAP) + press(REPLAN_TAP));

  return (
    <div style={{position: 'absolute', inset: 0, background: t.bg, fontFamily: UI, color: t.ink, overflow: 'hidden'}}>
      <Status t={t} />
      <div style={{position: 'absolute', left: 16, top: 62, display: 'flex', alignItems: 'center', gap: 4, color: t.accent, fontSize: 16, fontWeight: 500}}>
        <Chevron size={16} dir="left" color={t.accent} /> Week
      </div>
      <div style={{position: 'absolute', left: 22, top: 92, fontSize: 12.5, letterSpacing: 2.6, color: t.sub, fontWeight: 600}}>TUESDAY · 3 NOVEMBER</div>
      <div style={{position: 'absolute', left: 22, top: 110, fontSize: 28, fontWeight: 700, letterSpacing: -0.5}}>Your day</div>
      {/* timeline */}
      <div style={{...cardStyle(t, 22), position: 'absolute', left: 14, right: 14, top: 200, height: 496}} />
      {Array.from({length: 11}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 30, right: 30, top: y(START + i) - 7, display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: t.sub}}>
          <span style={{width: 36, fontVariantNumeric: 'tabular-nums'}}>{String(START + i).padStart(2, '0')}:00</span>
          <div style={{flex: 1, height: 1, background: t.line}} />
        </div>
      ))}
      {thinking > 0 && (
        <div
          style={{
            position: 'absolute',
            left: X0,
            width: X1 - X0,
            height: 60,
            top: TOP + ((f - BLOCK_TAP) / 44) * 460 - 30,
            background: `linear-gradient(180deg, rgba(224,122,63,0), rgba(224,122,63,${0.16 * thinking}), rgba(224,122,63,0))`,
            zIndex: 2,
          }}
        />
      )}
      {[...MEETINGS, {...CLIENT, from: clientFrom, to: clientFrom + 0.75}].map((m) => (
        <div
          key={m.title}
          style={{
            position: 'absolute',
            left: X0,
            width: X1 - X0,
            ...ev(m.from, m.to),
            borderRadius: 9,
            background: `${m.color}26`,
            borderLeft: `3px solid ${m.color}`,
            padding: '5px 10px',
            boxSizing: 'border-box',
            fontSize: 13,
            fontWeight: 600,
            overflow: 'hidden',
            zIndex: 3,
            boxShadow: m.title === CLIENT.title && clientMove > 0 && clientMove < 1 ? '0 10px 24px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          {m.title}
          <span style={{fontWeight: 400, color: t.sub, marginLeft: 8}}>{m.meta}</span>
        </div>
      ))}
      {BLOCKS.map((b) => {
        const k = prog(f, b.at, FLIGHT, easeInOut);
        const from = b.replanTo ? mix(b.from, b.replanTo, replanMove) : b.from;
        const target = {x: X0, y: y(from) + 2, w: X1 - X0, h: b.dur * HOUR_H - 4};
        const chipY = 158;
        const x = mix(b.chip.x, target.x, k);
        const yy = mix(chipY, target.y, k) - Math.sin(k * Math.PI) * 30;
        const w = mix(b.chip.w, target.w, k);
        const h = mix(32, target.h, k);
        const landed = f >= b.at + FLIGHT ? pop(f, b.at + FLIGHT, 12) : 0;
        const isConflict = !!b.replanTo && conflict > 0;
        const shake = isConflict ? Math.sin(f * 1.6) * 2.2 * conflict * (1 - prog(f, NOTIFY + 44, 10)) : 0;
        const solid = k > 0.5;
        return (
          <div
            key={b.title}
            style={{
              position: 'absolute',
              left: x + shake,
              top: yy,
              width: w,
              height: h,
              borderRadius: mix(16, 9, k),
              background: solid ? t.accent : t.card2,
              color: solid ? '#fff' : t.ink,
              border: solid ? 'none' : `1px solid ${t.line}`,
              boxShadow: isConflict
                ? `0 0 0 ${2 * conflict}px rgba(214,69,69,${conflict}), 0 8px 20px rgba(214,69,69,${0.25 * conflict})`
                : k > 0 && k < 1
                  ? '0 12px 26px rgba(0,0,0,0.18)'
                  : solid
                    ? '0 6px 16px rgba(224,122,63,0.28)'
                    : 'none',
              padding: solid ? '5px 10px' : 0,
              display: 'flex',
              flexDirection: solid ? 'column' : 'row',
              alignItems: solid ? 'flex-start' : 'center',
              justifyContent: solid ? 'flex-start' : 'center',
              boxSizing: 'border-box',
              fontSize: 13,
              fontWeight: 600,
              overflow: 'hidden',
              zIndex: k > 0 && k < 1 ? 6 : 4,
              transform: `scale(${1 + Math.sin(Math.min(1, landed) * Math.PI) * 0.05})`,
            }}
          >
            <span style={{opacity: interpolate(Math.abs(k - 0.5), [0, 0.2], [0, 1], {extrapolateRight: 'clamp'}), whiteSpace: 'nowrap'}}>
              {solid ? b.title : b.chip.label}
            </span>
            {solid && b.dur >= 0.75 && <span style={{fontWeight: 400, fontSize: 11.5, opacity: 0.85}}>{b.meta}</span>}
          </div>
        );
      })}
      {/* conflict tag */}
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: y(14.5) + 4,
          fontSize: 11.5,
          fontWeight: 700,
          color: '#D64545',
          background: t.dark > 0.5 ? '#3A1C1C' : '#FCE4E4',
          padding: '3px 8px',
          borderRadius: 8,
          opacity: conflict,
          zIndex: 7,
        }}
      >
        Conflict
      </div>
      {/* action button */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: 712,
          height: 56,
          borderRadius: 18,
          background: btnBg,
          color: btnInk,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 16.5,
          fontWeight: 600,
          transform: `scale(${btnScale})`,
          overflow: 'hidden',
          boxShadow: btnBg === t.accent ? '0 10px 24px rgba(224,122,63,0.3)' : 'none',
        }}
      >
        {thinking > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 140,
              left: -140 + (((f - BLOCK_TAP) / 26) % 1) * 560,
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0))',
            }}
          />
        )}
        {btnBg === t.accent ? <Sparkle size={15} color="#fff" /> : <Check size={15} color={t.accent} />}
        <span style={{position: 'relative'}}>{label}</span>
      </div>
      {/* iOS notification banner */}
      <div
        style={{
          position: 'absolute',
          left: 10,
          right: 10,
          top: 56,
          height: 74,
          borderRadius: 24,
          background: t.dark > 0.5 ? 'rgba(48,45,42,0.92)' : 'rgba(250,248,245,0.94)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 16px',
          transform: `translateY(${(banner - 1) * 120}px)`,
          opacity: Math.max(0, banner),
          zIndex: 30,
        }}
      >
        <div style={{width: 38, height: 38, borderRadius: 10, background: '#fff', border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#D64545'}}>3</div>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', fontSize: 14, fontWeight: 600}}>
            Calendar<span style={{marginLeft: 'auto', fontWeight: 400, color: t.sub, fontSize: 12.5}}>now</span>
          </div>
          <div style={{fontSize: 13.5, color: t.sub, marginTop: 2}}>Client call moved to 13:30</div>
        </div>
      </div>
      {/* toast */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 640,
          height: 44,
          borderRadius: 22,
          background: t.dark > 0.5 ? '#F5F2ED' : '#1C1B19',
          color: t.dark > 0.5 ? '#1C1B19' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 600,
          opacity: Math.max(0, toast),
          transform: `translateY(${(1 - Math.max(0, toast)) * 18}px)`,
          zIndex: 31,
        }}
      >
        <Sparkle size={12} color={t.accent} /> Re-planned in one tap
      </div>
      <Touch f={f} at={BLOCK_TAP} x={196} y={740} t={t} />
      <Touch f={f} at={REPLAN_TAP} x={196} y={740} t={t} />
    </div>
  );
};
