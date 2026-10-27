import {interpolate} from 'remotion';
import {easeInOut, prog} from '../anim';
import {CheckBox} from '../components/Icons';
import {A, SANS} from '../theme';
import {cloneWeek, rowPos, WeekView} from './WeekView';

const PRESS = 8;
const LIFT = 14;
const MOVE = 26;
const DROP = 66;

export const dragWeek = (f: number) => {
  const week = cloneWeek();
  week[3].total = 3; // the task typed in the previous scene
  const settle = prog(f, DROP, 12, easeInOut);
  week[1].total = 3 - settle;
  week[4].total = 4 + settle;
  return week;
};

export const DragScene: React.FC<{f: number}> = ({f}) => {
  const press = f >= PRESS && f < LIFT + 4 ? Math.sin(((f - PRESS) / 10) * Math.PI) : 0;
  const lift = prog(f, LIFT, 10);
  const move = prog(f, MOVE, DROP - MOVE, easeInOut);
  const drop = prog(f, DROP - 4, 10);
  const from = rowPos(1);
  const to = rowPos(4);
  const x = from.x + 40 + Math.sin(move * Math.PI) * 30;
  const y = interpolate(move, [0, 1], [from.y + 10, to.y + 10]);
  const rot = Math.sin(move * Math.PI) * -3 + lift * -1.5 * (1 - drop);
  const scale = (0.85 + 0.15 * lift) * (1 - drop * 0.3);
  const zone = Math.min(prog(f, 44, 10), 1 - prog(f, DROP + 6, 16));
  const thursFlash = 1 - prog(f, 0, 24);
  const highlight = [0, 0, 0, thursFlash, zone, 0, 0];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <WeekView days={dragWeek(f)} highlight={highlight} press={[0, press, 0, 0, 0, 0, 0]} />
      {f >= LIFT && f < DROP + 6 && (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 260,
            height: 50,
            borderRadius: 14,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 14px',
            boxSizing: 'border-box',
            fontFamily: SANS,
            transform: `rotate(${rot}deg) scale(${scale})`,
            boxShadow: `0 ${6 + lift * 14}px ${14 + lift * 26}px rgba(29,28,26,${0.12 + lift * 0.12}), 0 0 0 1.5px rgba(255,90,31,${0.6 * lift})`,
            opacity: lift * (1 - prog(f, DROP + 1, 5)),
            zIndex: 6,
          }}
        >
          <CheckBox size={22} done={0} />
          <span style={{fontSize: 15, color: A.ink}}>Review budget</span>
          <span style={{marginLeft: 'auto', fontSize: 14, color: A.sub}}>11:00</span>
        </div>
      )}
    </div>
  );
};
