import {useCurrentFrame} from 'remotion';
import {easeInOut, pop, prog} from '../../anim';
import {L, theme} from '../theme';
import {SmallWidget, WeekStripWidget} from '../screens/Widgets';

/** Frosted widgets floating in front of the phone during the widgets shot. */
export const FloatingWidgets: React.FC<{doneAmounts: number[]}> = ({doneAmounts}) => {
  const frame = useCurrentFrame();
  const [from, to] = L.widgets;
  if (frame < from || frame > to + 2) return null;
  const f = frame - from;
  const t = theme(0, 0.8);
  const out = prog(frame, to - 14, 14, easeInOut);
  const done = doneAmounts.reduce((a, b) => a + b, 0);
  const items = [
    {el: <SmallWidget t={t} done={done} />, x: 700, y: 520, s: 1.5, at: 12, ry: -14, dir: 1},
    {el: <WeekStripWidget t={t} fill={prog(f, 30, 40, easeInOut)} />, x: 24, y: 1440, s: 1.5, at: 22, ry: 12, dir: -1},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, perspective: 1800}}>
      {items.map((it, i) => {
        const p = pop(f, it.at, 16);
        const bob = Math.sin((frame + i * 40) / 28) * 10;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: it.x,
              top: it.y,
              transformOrigin: 'top left',
              transform: `translate(${(1 - p) * 160 * it.dir}px, ${bob + (1 - p) * 80 - out * 60}px) rotateY(${it.ry * (1 - p * 0.5)}deg) rotateX(6deg) scale(${it.s * (0.85 + 0.15 * p)})`,
              opacity: Math.min(1, p * 1.4) * (1 - out),
              filter: `blur(${out * 8}px)`,
            }}
          >
            {it.el}
          </div>
        );
      })}
    </div>
  );
};
