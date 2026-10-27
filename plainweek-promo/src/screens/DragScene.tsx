import {interpolate} from 'remotion';
import {easeInOut, prog} from '../anim';
import {C} from '../theme';
import {cloneWeek, slotPos, TaskLine, WeekView} from './WeekView';

const LIFT = 10;
const MOVE = 24;
const DROP = 66;

export const dragWeek = (f: number) => {
  const week = cloneWeek();
  week[3].tasks.push({id: 'h3', title: 'Pick up flowers', meta: '6:00 PM', done: 0});
  const lifted = f >= LIFT;
  const collapse = 1 - prog(f, DROP + 2, 14, easeInOut);
  if (lifted) {
    week[1].tasks[0] = {...week[1].tasks[0], ghost: 1, size: collapse};
  }
  const hover = prog(f, 40, 16, easeInOut);
  if (f >= 40) {
    if (f < DROP) {
      week[2].tasks.push({id: 'w3', title: '', done: 0, ghost: 1, size: hover});
    } else {
      week[2].tasks.push({
        id: 'w3',
        title: 'Write proposal',
        done: 0,
        glow: 1 - prog(f, DROP + 10, 30),
      });
    }
  }
  return week;
};

export const DragScene: React.FC<{f: number}> = ({f}) => {
  const lift = prog(f, LIFT, 10);
  const move = prog(f, MOVE, DROP - MOVE, easeInOut);
  const drop = prog(f, DROP - 4, 8);
  const from = slotPos(1, 0);
  const to = slotPos(2, 2);
  const x = interpolate(move, [0, 1], [from.x, to.x]) + Math.sin(move * Math.PI) * 26;
  const y = interpolate(move, [0, 1], [from.y, to.y]);
  const rot = Math.sin(move * Math.PI) * -3 + lift * -1.5 * (1 - drop);
  const scale = 1 + lift * 0.08 * (1 - drop);
  const zone = Math.min(prog(f, 36, 10), 1 - prog(f, DROP + 2, 14));
  const dropZone = [0, 0, zone, 0, 0, 0, 0];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <WeekView days={dragWeek(f)} dropZone={dropZone} />
      {f >= LIFT && f < DROP + 4 && (
        <div
          style={{
            position: 'absolute',
            left: x - 10,
            top: y - 7,
            padding: '4px 14px 4px 10px',
            borderRadius: 12,
            background: C.card,
            transform: `rotate(${rot}deg) scale(${scale})`,
            transformOrigin: '30% 50%',
            boxShadow: `0 ${4 + lift * 14}px ${10 + lift * 26}px rgba(42,41,39,${0.1 + lift * 0.14}), 0 0 0 1px rgba(103,127,97,${0.35 * lift})`,
            opacity: 1 - prog(f, DROP, 4),
          }}
        >
          <TaskLine task={{id: 'drag', title: 'Write proposal', done: 0}} fontSize={13} />
        </div>
      )}
    </div>
  );
};
