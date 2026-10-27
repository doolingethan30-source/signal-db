import {useCurrentFrame} from 'remotion';
import {pop, prog} from '../anim';
import {LogoMark} from '../components/Icons';
import {C, SANS, SERIF} from '../theme';

export const END_START = 846;

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < END_START) return null;
  const f = frame - END_START;
  const mark = pop(f, 0, 13);
  const bars = prog(f, 4, 22);
  const word = prog(f, 8, 18);
  const tag = prog(f, 18, 18);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60,
      }}
    >
      <div
        style={{
          transform: `scale(${0.6 + 0.4 * mark}) translateY(${(1 - mark) * 30}px)`,
          opacity: Math.min(1, mark * 1.5),
          filter: 'drop-shadow(0 24px 40px rgba(42,41,39,0.22))',
        }}
      >
        <LogoMark size={190} fill={bars} />
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 168,
          lineHeight: '170px',
          letterSpacing: -2,
          color: C.ink,
          marginTop: 44,
          opacity: word,
          transform: `translateY(${(1 - word) * 30}px)`,
          filter: `blur(${(1 - word) * 10}px)`,
        }}
      >
        Plainweek
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 40,
          color: C.inkSoft,
          marginTop: 20,
          letterSpacing: -0.2,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 20}px)`,
        }}
      >
        A simpler way to stay on track.
      </div>
      <div
        style={{
          width: 120 * tag,
          height: 2,
          borderRadius: 1,
          background: C.sage,
          marginTop: 40,
          opacity: tag,
        }}
      />
    </div>
  );
};
