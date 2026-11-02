import {useCurrentFrame} from 'remotion';
import {easeInOut, pop, prog} from '../../anim';
import {DISPLAY, L} from '../theme';

export const LogoMark: React.FC<{size: number; ring: number}> = ({size, ring}) => {
  const r = 32;
  const c = 2 * Math.PI * r;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: 'linear-gradient(150deg, #EE9256 0%, #E07A3F 55%, #C9632B 100%)',
        boxShadow: `0 ${size * 0.18}px ${size * 0.4}px -${size * 0.12}px rgba(201,99,43,0.6), inset 0 1.5px 0 rgba(255,255,255,0.35)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="11" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ring)}
          transform="rotate(-90 48 48)"
        />
      </svg>
    </div>
  );
};

/** End lock-up: logo, wordmark and tagline above the hero iPhone. */
export const HeroText: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - L.hero[0];
  if (f < 0) return null;
  const m = pop(f, 6, 14);
  const word = prog(f, 10, 22);
  // tagline lines appear as the voice-over says them
  const tag1 = prog(f, 36, 22);
  const tag2 = prog(f, 84, 22);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: DISPLAY}}>
      <div style={{transform: `scale(${0.7 + 0.3 * m})`, opacity: Math.min(1, m * 1.4)}}>
        <LogoMark size={128} ring={0.78 * prog(f, 12, 30, easeInOut)} />
      </div>
      <div
        style={{
          marginTop: 34,
          fontSize: 132,
          fontWeight: 700,
          letterSpacing: -5,
          lineHeight: 1,
          color: '#1C1B19',
          opacity: word,
          transform: `translateY(${(1 - word) * 30}px)`,
          filter: `blur(${(1 - word) * 12}px)`,
        }}
      >
        Plainweek
      </div>
      <div style={{marginTop: 26, textAlign: 'center', fontSize: 42, fontWeight: 500, letterSpacing: -0.8, lineHeight: 1.25, color: '#6F685F'}}>
        <div style={{opacity: tag1, transform: `translateY(${(1 - tag1) * 18}px)`}}>Spend less time planning.</div>
        <div style={{opacity: tag2, transform: `translateY(${(1 - tag2) * 18}px)`, color: '#1C1B19'}}>More time doing what matters.</div>
      </div>
    </div>
  );
};
