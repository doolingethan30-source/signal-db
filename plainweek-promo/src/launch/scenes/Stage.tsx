import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {easeInOut, prog} from '../../anim';
import {darkAt, glassAt} from '../timeline';

/** Film background: dark chaos → warm light → dark mode → frosted glass, with soft lighting. */
export const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const light = prog(frame, 104, 40, easeInOut);
  const dark = darkAt(frame);
  const glass = glassAt(frame);
  const drift = Math.sin(frame / 80);
  return (
    <AbsoluteFill style={{background: '#0B0A09'}}>
      {/* chaos: dim with a single warm top light */}
      <AbsoluteFill style={{background: 'radial-gradient(70% 40% at 50% 0%, rgba(120,80,50,0.35) 0%, rgba(11,10,9,0) 70%)'}} />
      {/* calm light stage */}
      <AbsoluteFill style={{opacity: light * (1 - dark)}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF8F3 0%, #F6F0E8 55%, #F0E2D3 100%)'}} />
        <AbsoluteFill
          style={{
            background: `radial-gradient(55% 30% at ${50 + drift * 6}% 8%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(60% 35% at ${55 - drift * 8}% 100%, rgba(224,122,63,0.22) 0%, rgba(224,122,63,0) 70%)`,
          }}
        />
      </AbsoluteFill>
      {/* dark mode stage */}
      <AbsoluteFill style={{opacity: dark}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, #141210 0%, #0C0B0A 100%)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(50% 32% at 50% 62%, rgba(224,122,63,0.26) 0%, rgba(224,122,63,0) 70%)'}} />
      </AbsoluteFill>
      {/* frosted glass stage: soft colour fields */}
      <AbsoluteFill style={{opacity: glass * (1 - dark)}}>
        {[
          {x: 8 + drift * 4, y: 22, s: 760, c: 'rgba(242,162,114,0.55)'},
          {x: 78 - drift * 5, y: 52, s: 700, c: 'rgba(224,122,63,0.42)'},
          {x: 22, y: 86 + drift * 3, s: 760, c: 'rgba(201,167,232,0.45)'},
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.s,
              height: b.s,
              marginLeft: -b.s / 2,
              marginTop: -b.s / 2,
              borderRadius: '50%',
              background: b.c,
              filter: 'blur(110px)',
            }}
          />
        ))}
      </AbsoluteFill>
      {/* bloom that turns chaos into calm */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,246,236,1) 0%, rgba(255,246,236,0) 60%)',
          opacity: Math.min(prog(frame, 110, 14), 1 - prog(frame, 128, 22)),
          transform: `scale(${0.4 + prog(frame, 110, 30) * 2})`,
        }}
      />
      {/* gentle vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 60%, rgba(40,25,10,0.10) 100%)'}} />
    </AbsoluteFill>
  );
};
