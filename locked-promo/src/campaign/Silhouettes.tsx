import React from 'react';

/**
 * Cinematic, low-light silhouette illustrations (1080×1920 SVG space).
 * Deliberately dark and soft: shapes read through light, not detail.
 * Replaceable by real footage, see FootageSlot.tsx.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => lerp(v, b[i], t));
const rgba = (c: number[], a: number) => `rgba(${c.map(Math.round).join(',')},${a})`;

const MOON = [150, 168, 200];
const SUN = [255, 214, 150];

/**
 * Bedroom at night → morning.
 * @param open     curtains 0 (closed, slit of moonlight) → 1 (open)
 * @param warmth   0 night (cool moonlight) → 1 morning (warm sun)
 * @param phone    phone screen position + glow strength
 * @param armEnd   where the figure's hands are
 */
export const Bedroom: React.FC<{
  open?: number;
  warmth?: number;
  phone?: {x: number; y: number; glow: number; angle?: number};
  armEnd?: {x: number; y: number};
  headDrop?: number;
  showFigure?: boolean;
}> = ({open = 0, warmth = 0, phone = {x: 540, y: 1150, glow: 1, angle: -25}, armEnd, headDrop = 1, showFigure = true}) => {
  const light = mix(MOON, SUN, warmth);
  const winA = lerp(0.22, 0.95, warmth);
  const curtainW = lerp(232, 64, open);
  const slitL = 140 + 210 - lerp(20, 210, open);
  const slitR = 140 + 210 + lerp(20, 210, open);
  // Light beam on the floor/bed, from the window opening
  const beam = [
    [slitL, 1000],
    [slitR, 1000],
    [lerp(640, 1040, open), 1760],
    [lerp(520, 200, open), 1760],
  ];
  const hand = armEnd ?? {x: phone.x + 20, y: phone.y + 30};
  const head = {x: 600 - 18 * headDrop, y: 895 + 22 * headDrop};

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(mix([14, 15, 18], [58, 46, 34], warmth), 1)} />
          <stop offset="1" stopColor={rgba(mix([7, 7, 9], [30, 24, 19], warmth), 1)} />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={rgba(mix(light, [255, 245, 225], warmth), winA)} />
          <stop offset="1" stopColor={rgba(light, winA * 0.6)} />
        </linearGradient>
        <radialGradient id="phoneGlow">
          <stop offset="0" stopColor="rgba(200,220,255,0.55)" />
          <stop offset="0.35" stopColor="rgba(160,185,235,0.18)" />
          <stop offset="1" stopColor="rgba(120,150,210,0)" />
        </radialGradient>
        <radialGradient id="sunBloom">
          <stop offset="0" stopColor={rgba([255, 236, 200], 0.9)} />
          <stop offset="0.5" stopColor={rgba(SUN, 0.25)} />
          <stop offset="1" stopColor={rgba(SUN, 0)} />
        </radialGradient>
        <linearGradient id="faceLit" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={`rgba(150,170,210,${0.55 * phone.glow})`} />
          <stop offset="0.55" stopColor="rgba(10,10,12,1)" />
        </linearGradient>
        <linearGradient id="curtain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b0b0d" />
          <stop offset="0.3" stopColor="#141417" />
          <stop offset="0.5" stopColor="#0a0a0c" />
          <stop offset="0.75" stopColor="#151518" />
          <stop offset="1" stopColor="#0b0b0d" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="edge">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <rect width="1080" height="1920" fill="url(#wall)" />

      {/* Window */}
      <rect x={140} y={360} width={420} height={640} fill="url(#glass)" />
      <rect x={346} y={360} width={8} height={640} fill="#0a0a0b" />
      <rect x={140} y={672} width={420} height={8} fill="#0a0a0b" />
      <rect x={128} y={348} width={444} height={664} fill="none" stroke="#0c0c0e" strokeWidth={14} />
      {warmth > 0 ? <circle cx={350} cy={640} r={520} fill="url(#sunBloom)" opacity={warmth * open} /> : null}

      {/* Light beam */}
      <polygon
        points={beam.map((p) => p.join(',')).join(' ')}
        fill={rgba(light, lerp(0.07, 0.22, warmth))}
        filter="url(#soft)"
      />

      {/* Curtains */}
      <rect x={100} y={320} width={curtainW} height={760} fill="url(#curtain)" />
      <rect x={600 - curtainW} y={320} width={curtainW} height={760} fill="url(#curtain)" />
      <rect x={90} y={312} width={520} height={14} rx={7} fill="#121215" />

      {/* Nightstand */}
      <rect x={210} y={1320} width={200} height={300} fill="#0d0d0f" />
      <rect x={210} y={1320} width={200} height={6} fill={rgba(light, 0.12 + 0.2 * warmth)} />

      {/* Bed */}
      <rect x={560} y={1335} width={560} height={250} rx={18} fill="#101113" />
      <rect x={560} y={1335} width={560} height={5} fill={rgba(light, 0.1 + 0.2 * warmth)} />
      <rect x={860} y={1250} width={240} height={95} rx={40} fill="#131417" />
      {/* Floor */}
      <rect x={0} y={1620} width={1080} height={300} fill={rgba(mix([6, 6, 8], [26, 20, 16], warmth), 1)} />

      {/* Phone glow (lights the room) */}
      {phone.glow > 0.01 ? (
        <circle cx={phone.x} cy={phone.y} r={330} fill="url(#phoneGlow)" opacity={phone.glow} />
      ) : null}

      {showFigure ? (
        <g filter="url(#edge)">
          {/* Lower leg + foot */}
          <path d="M478 1300 L436 1606 L398 1618 L398 1632 L478 1632 L516 1330 Z" fill="#070708" />
          {/* Thigh */}
          <path d="M610 1286 L482 1296 C452 1300 452 1352 482 1354 L712 1350 Z" fill="#070708" />
          {/* Torso: hunched */}
          <path
            d={`M${652 - 8 * headDrop} ${968} C722 1004 764 1124 748 1334 L604 1342 C594 1250 586 1124 578 1014 C575 990 ${604 - 10 * headDrop} 968 ${652 - 8 * headDrop} 968 Z`}
            fill="url(#faceLit)"
          />
          {/* Head */}
          <circle cx={head.x} cy={head.y} r={60} fill="url(#faceLit)" />
          {/* Arm (shoulder → elbow → hands) */}
          <path
            d={`M640 1010 L${lerp(612, 650, 0)} 1172 L${hand.x} ${hand.y}`}
            fill="none"
            stroke="#08080a"
            strokeWidth={44}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}

      {/* Phone */}
      <g transform={`translate(${phone.x} ${phone.y}) rotate(${phone.angle ?? -25})`}>
        <rect x={-22} y={-38} width={44} height={76} rx={8} fill="#050506" />
        <rect
          x={-18}
          y={-34}
          width={36}
          height={68}
          rx={6}
          fill={`rgba(215,228,255,${0.15 + 0.85 * phone.glow})`}
        />
      </g>
    </svg>
  );
};

/**
 * Back view of a person standing at a bright window, walking into the light.
 * @param walk 0→1 moves the figure away from camera (toward the light)
 */
export const MorningWindow: React.FC<{walk: number; bloom: number; frame: number}> = ({walk, bloom, frame}) => {
  const scale = lerp(1, 0.82, walk);
  const bob = Math.sin(frame * 0.32) * 5 * Math.min(1, walk * 6);
  const sway = Math.sin(frame * 0.16) * 1.4 * Math.min(1, walk * 6);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="mwWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2e22" />
          <stop offset="1" stopColor="#1a1410" />
        </linearGradient>
        <linearGradient id="mwGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF6E6" />
          <stop offset="0.6" stopColor="#FFE2AE" />
          <stop offset="1" stopColor="#F7C982" />
        </linearGradient>
        <radialGradient id="mwBloom">
          <stop offset="0" stopColor="rgba(255,240,210,0.95)" />
          <stop offset="0.45" stopColor="rgba(255,214,150,0.35)" />
          <stop offset="1" stopColor="rgba(255,200,130,0)" />
        </radialGradient>
        <linearGradient id="mwFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,214,150,0.35)" />
          <stop offset="1" stopColor="rgba(255,214,150,0)" />
        </linearGradient>
        <filter id="mwSoft">
          <feGaussianBlur stdDeviation="24" />
        </filter>
        <filter id="mwRim">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="mwHalo" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <rect width="1080" height="1920" fill="url(#mwWall)" />
      {/* Big window */}
      <rect x={250} y={280} width={580} height={1060} fill="url(#mwGlass)" />
      <rect x={534} y={280} width={12} height={1060} fill="#2a1f16" opacity={0.7} />
      <rect x={250} y={760} width={580} height={12} fill="#2a1f16" opacity={0.7} />
      {/* Curtains pulled to the sides */}
      <rect x={170} y={240} width={100} height={1160} fill="#2b2119" />
      <rect x={810} y={240} width={100} height={1160} fill="#2b2119" />
      {/* Floor + light pool */}
      <rect x={0} y={1340} width={1080} height={580} fill="#140f0c" />
      <polygon points="250,1340 830,1340 1080,1920 0,1920" fill="url(#mwFloor)" />
      {/* God rays */}
      {[0, 1, 2].map((i) => (
        <polygon
          key={i}
          points={`${300 + i * 170},300 ${380 + i * 170},300 ${520 + i * 260},1920 ${360 + i * 230},1920`}
          fill="rgba(255,225,170,0.07)"
          filter="url(#mwSoft)"
        />
      ))}
      <circle cx={540} cy={760} r={700} fill="url(#mwBloom)" opacity={bloom} />

      {/* Figure, back view */}
      <g
        transform={`translate(540 1900) scale(${scale}) translate(-540 -1900) translate(0 ${bob}) rotate(${sway} 540 1400)`}
      >
        <g fill="rgba(255,226,180,0.7)" stroke="rgba(255,226,180,0.7)" filter="url(#mwHalo)">
          <use href="#mwFigure" />
        </g>
        <g fill="#0b0806" stroke="#0b0806" filter="url(#mwRim)">
        <g id="mwFigure">
        <circle cx={540} cy={968} r={58} />
        <path d="M518 1010 L562 1010 L566 1064 L514 1064 Z" />
        <path d="M430 1112 C432 1074 476 1058 540 1058 C604 1058 648 1074 650 1112 L668 1300 L636 1312 L628 1470 L452 1470 L444 1312 L412 1300 Z" />
        {/* Arms */}
        <path d="M434 1110 L404 1300 L414 1440" fill="none" strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M646 1110 L676 1300 L666 1440" fill="none" strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
        {/* Legs */}
        <path d="M454 1460 L470 1890 L530 1890 L540 1500 L550 1890 L610 1890 L626 1460 Z" />
        </g>
        </g>
      </g>
    </svg>
  );
};
