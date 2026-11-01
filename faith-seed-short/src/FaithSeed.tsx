import React from 'react';
import { loadFont } from '@remotion/fonts';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { LOOP_FADE, TOTAL, loopSin, pop, tween } from './anim';
import { Scene } from './Scene';

loadFont({ family: 'Fredoka', url: staticFile('fredoka-latin-600-normal.woff2'), weight: '600' });
loadFont({ family: 'Fredoka', url: staticFile('fredoka-latin-500-normal.woff2'), weight: '500' });

const Sky: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #6FC3F0 0%, #A6DCF7 32%, #D6F0F6 52%, #F4F6E2 64%, #DCEFEA 100%)',
      }}
    >
      {/* warm sun glow, periodic shimmer so it loops */}
      <div
        style={{
          position: 'absolute',
          left: 1040,
          top: 180,
          width: 520,
          height: 520,
          marginLeft: -260,
          marginTop: -260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,250,215,1) 0%, rgba(255,240,170,0.75) 22%, rgba(255,236,170,0.25) 48%, rgba(255,236,170,0) 70%)',
          transform: `scale(${1 + 0.04 * loopSin(f, 6)})`,
        }}
      />
    </AbsoluteFill>
  );
};

const World: React.FC<{ raw: number }> = ({ raw }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 50, near: 0.1, far: 200, position: [0, 2, 9] }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.0;
        gl.setClearColor(0x000000, 0);
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene raw={raw} />
    </ThreeCanvas>
  );
};

const SproutIcon: React.FC<{ size: number }> = ({ size }) => (
  <span style={{ fontFamily: '"Noto Color Emoji", sans-serif', fontSize: size, lineHeight: 1, display: 'inline-block', verticalAlign: '-0.12em' }}>🌱</span>
);

const EndText: React.FC = () => {
  const f = useCurrentFrame();
  const a = pop(f, 712, 11, 110);
  const b = pop(f, 742, 12, 100);
  const out = 1 - tween(f, 860, 878);
  if (f < 708 || out <= 0) return null;
  const bob = 6 * Math.sin((f / 45) * Math.PI * 2);
  return (
    <AbsoluteFill style={{ alignItems: 'center', fontFamily: 'Fredoka, sans-serif', opacity: out }}>
      <div
        style={{
          marginTop: 150,
          width: 1260,
          textAlign: 'center',
          transform: `translateY(${(1 - a) * -60 + bob}px) scale(${0.6 + 0.4 * a})`,
          opacity: Math.min(1, a * 1.4),
          fontWeight: 600,
          fontSize: 92,
          lineHeight: 1.13,
          color: '#FFFFFF',
          WebkitTextStroke: '14px #2F7D3B',
          paintOrder: 'stroke fill',
          textShadow: '0 10px 0 rgba(31, 84, 40, 0.35), 0 18px 40px rgba(0,0,0,0.18)',
          letterSpacing: 0.5,
        }}
      >
        <SproutIcon size={96} /> Even small faith can do amazing things with Jesus.
      </div>
      <div
        style={{
          marginTop: 40,
          width: 1180,
          padding: '34px 54px 30px',
          borderRadius: 56,
          background: 'rgba(255, 252, 238, 0.9)',
          boxShadow: '0 16px 40px rgba(40, 80, 40, 0.22), inset 0 0 0 6px rgba(255, 210, 63, 0.75)',
          textAlign: 'center',
          transform: `translateY(${(1 - b) * 70}px) scale(${0.85 + 0.15 * b})`,
          opacity: Math.min(1, b * 1.3),
        }}
      >
        <div style={{ fontWeight: 500, fontSize: 58, lineHeight: 1.28, color: '#4A3221' }}>
          “If you have faith as small as a mustard seed… nothing will be impossible for you.”
        </div>
        <div style={{ marginTop: 18, fontWeight: 600, fontSize: 52, color: '#2F7D3B' }}>— Matthew 17:20</div>
      </div>
    </AbsoluteFill>
  );
};

/** Soft warm vignette for a cinematic, cosy feel */
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 60%, rgba(40,60,20,0.18) 100%)',
      pointerEvents: 'none',
    }}
  />
);

export const FaithSeed: React.FC = () => {
  const frame = useCurrentFrame();
  const loopStart = TOTAL - LOOP_FADE;
  const fadeIn = tween(frame, loopStart, TOTAL, 0, 1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#A6DCF7' }}>
      <Sky />
      <World raw={frame} />
      {/* Seamless loop: the opening shot (Finn waving in the meadow) fades in over the
          last frames, so frame 899 flows straight into frame 0. Finn, camera and ambient
          motion are identical in both layers, only the tree & friends dissolve. */}
      {frame >= loopStart && (
        <AbsoluteFill style={{ opacity: fadeIn }}>
          <Sky />
          <World raw={frame - TOTAL} />
        </AbsoluteFill>
      )}
      <Vignette />
      <EndText />
      <Audio src={staticFile('music.wav')} volume={0.9} />
    </AbsoluteFill>
  );
};
