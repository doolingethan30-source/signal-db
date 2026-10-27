import {interpolate} from 'remotion';
import {easeInOut, mix, pop, prog} from '../anim';
import {Check, Sparkle} from '../components/Icons';
import {StatusBar} from '../components/Phone';
import {ProBadge} from '../components/ProBadge';
import {A, SANS} from '../theme';

const GRID_TOP = 352;
const HOUR_H = 34;
const COL_X = 48;
const COL_W = 47;
const START_H = 8;

const block = (day: number, start: number, dur: number) => ({
  x: COL_X + day * COL_W + 2,
  y: GRID_TOP + 22 + (start - START_H) * HOUR_H + 1,
  w: COL_W - 4,
  h: dur * HOUR_H - 2,
});

const BUSY = [
  [0, 9, 1], [0, 13, 1], [1, 10, 1.5], [2, 14.5, 1], [3, 10, 1], [3, 18, 1],
  [4, 12, 1], [4, 19.5, 0.5], [5, 9, 1.5], [6, 17, 1], [1, 16, 0.75], [5, 12, 1],
] as const;

const EVENT_COLORS = [A.blue, A.green, A.purple, '#A39E96'];

const PLAN = [
  {label: 'Deep work · 2h', short: 'Deep work', chip: {x: 32, y: 192, w: 150, h: 32}, to: block(2, 9, 2), at: 34},
  {label: 'Gym · 1h', short: 'Gym', chip: {x: 190, y: 192, w: 96, h: 32}, to: block(4, 17, 1), at: 42},
  {label: 'Call the bank · 15m', short: 'Bank', chip: {x: 32, y: 230, w: 172, h: 32}, to: block(1, 14, 0.75), at: 50},
  {label: 'Read · 30m', short: 'Read', chip: {x: 212, y: 230, w: 104, h: 32}, to: block(5, 15, 1), at: 58},
];
const FLIGHT = 18;

export const AiSchedule: React.FC<{f: number}> = ({f}) => {
  const press = f >= 12 && f < 22 ? Math.sin(((f - 12) / 10) * Math.PI) : 0;
  const thinking = Math.min(prog(f, 16, 6), 1 - prog(f, 64, 8));
  const sweep = ((f - 16) / 28) % 1;
  const finished = prog(f, 72, 10);
  const placed = PLAN.filter((p) => f >= p.at + FLIGHT).length;
  return (
    <div style={{position: 'absolute', inset: 0, background: A.bg, fontFamily: SANS}}>
      <StatusBar />
      <div style={{position: 'absolute', left: 24, top: 62, right: 24}}>
        <ProBadge />
        <div style={{fontSize: 28, fontWeight: 700, letterSpacing: -0.5, lineHeight: '36px', marginTop: 8}}>Plan my week</div>
        <div style={{fontSize: 13, color: A.sub, marginTop: 2}}>
          {placed === 0 ? '4 tasks to fit in · 11h free this week' : `${placed} of 4 placed around your calendar`}
        </div>
      </div>
      {/* tray */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 180,
          height: 94,
          borderRadius: 18,
          border: `1px dashed ${A.line}`,
          background: '#F7F5EF',
        }}
      />
      {/* auto-schedule button */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 286,
          height: 46,
          borderRadius: 16,
          background: A.orange,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 15,
          fontWeight: 600,
          transform: `scale(${1 - press * 0.04})`,
          overflow: 'hidden',
        }}
      >
        {thinking > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 120,
              left: -120 + sweep * 520,
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))',
              opacity: thinking,
            }}
          />
        )}
        {finished > 0.5 ? <Check size={14} color="#fff" /> : <Sparkle size={14} color="#fff" />}
        <span style={{position: 'relative'}}>
          {finished > 0.5 ? 'Week planned' : thinking > 0.2 ? 'Finding the best times…' : 'Auto-schedule'}
        </span>
      </div>
      {/* grid */}
      <div style={{position: 'absolute', left: 0, right: 0, top: GRID_TOP}}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: COL_X + i * COL_W,
              width: COL_W,
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: i === 1 ? A.orange : A.sub,
            }}
          >
            {d}
          </div>
        ))}
        {Array.from({length: 13}).map((_, h) => (
          <div key={h} style={{position: 'absolute', top: 22 + h * HOUR_H, left: 10, right: 16, display: 'flex', alignItems: 'center'}}>
            <span style={{width: 34, fontSize: 9, color: A.sub, transform: 'translateY(-1px)'}}>
              {h % 2 === 0 ? `${((START_H + h - 1) % 12) + 1}${START_H + h < 12 ? 'a' : 'p'}` : ''}
            </span>
            <div style={{flex: 1, height: 1, background: A.line, opacity: 0.8}} />
          </div>
        ))}
      </div>
      {BUSY.map(([d, s, dur], i) => {
        const b = block(d, s, dur);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              borderRadius: 6,
              background: `${EVENT_COLORS[i % EVENT_COLORS.length]}22`,
              borderLeft: `3px solid ${EVENT_COLORS[i % EVENT_COLORS.length]}`,
              boxSizing: 'border-box',
            }}
          />
        );
      })}
      {/* scanning column highlight while thinking */}
      {thinking > 0 && (
        <div
          style={{
            position: 'absolute',
            top: GRID_TOP + 22,
            height: 12 * HOUR_H,
            left: COL_X + Math.floor(((f - 16) / 5) % 7) * COL_W,
            width: COL_W,
            background: 'rgba(255,90,31,0.10)',
            opacity: thinking * (1 - placed / 4),
          }}
        />
      )}
      {PLAN.map((p) => {
        const t = prog(f, p.at, FLIGHT, easeInOut);
        const landed = pop(f, p.at + FLIGHT, 12);
        const x = mix(p.chip.x, p.to.x, t);
        const y = mix(p.chip.y, p.to.y, t) - Math.sin(t * Math.PI) * 40;
        const w = mix(p.chip.w, p.to.w, t);
        const h = mix(p.chip.h, p.to.h, t);
        const bg = t > 0.5 ? A.orange : '#FBFAF8';
        const s = f >= p.at + FLIGHT ? 1 + Math.sin(Math.min(1, landed) * Math.PI) * 0.08 : 1;
        return (
          <div
            key={p.label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              borderRadius: mix(16, 7, t),
              background: bg,
              border: t > 0.5 ? 'none' : `1px solid ${A.line}`,
              boxShadow: t > 0 && t < 1 ? '0 10px 24px rgba(42,41,39,0.18)' : '0 1px 2px rgba(42,41,39,0.05)',
              display: 'flex',
              alignItems: t > 0.5 ? 'flex-start' : 'center',
              justifyContent: t > 0.5 ? 'flex-start' : 'center',
              padding: t > 0.5 ? '3px 4px' : 0,
              boxSizing: 'border-box',
              transform: `scale(${s})`,
              overflow: 'hidden',
              zIndex: t > 0 && t < 1 ? 3 : 2,
            }}
          >
            <span
              style={{
                fontSize: t > 0.5 ? 8.5 : 13,
                fontWeight: t > 0.5 ? 600 : 500,
                color: t > 0.5 ? '#fff' : A.ink,
                whiteSpace: 'nowrap',
                opacity: interpolate(Math.abs(t - 0.5), [0, 0.2], [0, 1], {extrapolateRight: 'clamp'}),
              }}
            >
              {t > 0.5 ? p.short : p.label}
            </span>
          </div>
        );
      })}
      {/* toast */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          bottom: 30 + (1 - finished) * -10,
          height: 40,
          borderRadius: 20,
          background: A.ink,
          color: A.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 500,
          opacity: finished,
          transform: `translateY(${(1 - finished) * 20}px)`,
          boxShadow: '0 10px 24px rgba(42,41,39,0.2)',
        }}
      >
        <Sparkle size={12} color={A.orange} /> 4 tasks scheduled in free time
      </div>
    </div>
  );
};
