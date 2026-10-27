import {useCurrentFrame} from 'remotion';
import {easeInOut, prog} from '../anim';
import {C, SANS, SERIF} from '../theme';

type Caption = {from: number; to: number; eyebrow?: string; lines: string[]};

// *word* renders as sage italic.
export const CAPTIONS: Caption[] = [
  {from: 4, to: 94, lines: ['Your week,', '*everywhere* at once.']},
  {from: 104, to: 170, eyebrow: 'INTRODUCING', lines: ['Meet *Plainweek.*']},
  {from: 170, to: 224, lines: ['Seven days.', 'One *calm* view.']},
  {from: 226, to: 333, eyebrow: 'NATURAL-LANGUAGE ENTRY', lines: ['Just type it.', 'We’ll *sort* it.']},
  {from: 335, to: 456, eyebrow: 'DRAG & DROP', lines: ['Plans change.', 'Just *move* them.']},
  {from: 458, to: 558, eyebrow: 'HOME SCREEN WIDGET', lines: ['Tick it off,', 'right from *home.*']},
  {from: 560, to: 650, eyebrow: 'PLAINWEEK PRO · AI SCHEDULING', lines: ['Let AI find', 'the *time* for you.']},
  {from: 652, to: 723, eyebrow: 'PLAINWEEK PRO · HABIT STREAKS', lines: ['Build streaks', 'that *stick.*']},
  {from: 725, to: 803, eyebrow: 'PLAINWEEK PRO · SUNDAY REVIEW', lines: ['Reflect, reset,', '*begin again.*']},
  {from: 805, to: 848, lines: ['A beautifully', '*organised* week.']},
];

const renderLine = (line: string) =>
  line.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith('*') ? (
      <span key={i} style={{fontStyle: 'italic', color: C.sageDeep}}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {CAPTIONS.map((c, ci) => {
        if (frame < c.from - 2 || frame > c.to + 2) return null;
        const out = prog(frame, c.to - 9, 9, easeInOut);
        return (
          <div
            key={ci}
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              top: 118,
              textAlign: 'center',
              color: C.ink,
              opacity: 1 - out,
              transform: `translateY(${-out * 18}px)`,
              filter: `blur(${out * 6}px)`,
            }}
          >
            {c.eyebrow && (
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 22,
                  letterSpacing: 5,
                  fontWeight: 600,
                  color: C.sageDeep,
                  marginBottom: 18,
                  opacity: prog(frame, c.from, 12),
                }}
              >
                {c.eyebrow}
              </div>
            )}
            {c.lines.map((line, li) => {
              const a = prog(frame, c.from + 3 + li * 5, 16);
              return (
                <div
                  key={li}
                  style={{
                    fontFamily: SERIF,
                    fontSize: 96,
                    lineHeight: '100px',
                    letterSpacing: -1,
                    opacity: a,
                    transform: `translateY(${(1 - a) * 28}px)`,
                    filter: `blur(${(1 - a) * 8}px)`,
                  }}
                >
                  {renderLine(line)}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
