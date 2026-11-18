import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CineText} from '../CineText';
import {campaign} from '../content';
import {FOOTAGE, FootageSlot} from '../FootageSlot';
import {Bedroom, MorningWindow} from '../Silhouettes';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SWAP = 80; // night bedroom → standing at the morning window

export const C5NotAlone: React.FC<{duration: number; footage: boolean}> = ({duration, footage}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 1) Phone goes down on the nightstand
  const putDown = spring({frame: frame - 2, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 30});
  const phoneX = interpolate(putDown, [0, 1], [528, 330]);
  const phoneY = interpolate(putDown, [0, 1], [1150, 1308]) - Math.sin(putDown * Math.PI) * 60;
  const phoneAngle = interpolate(putDown, [0, 1], [-28, -90]);
  const armBack = spring({frame: frame - 30, fps, config: {damping: 200}, durationInFrames: 16});
  const arm = {
    x: interpolate(armBack, [0, 1], [phoneX + 20, 560]),
    y: interpolate(armBack, [0, 1], [phoneY + 30, 1260]),
  };
  const glow = interpolate(frame, [30, 40], [0.9, 0], clamp);
  // 2) Head lifts, curtains open, light warms the room
  const headDrop = interpolate(spring({frame: frame - 34, fps, config: {damping: 200}, durationInFrames: 24}), [0, 1], [1, 0]);
  const open = spring({frame: frame - 40, fps, config: {damping: 200, stiffness: 40}, durationInFrames: 40});
  const warmth = interpolate(frame, [44, 84], [0, 1], clamp);
  // 3) Standing at the window, walking into the light
  const swap = interpolate(frame, [SWAP, SWAP + 18], [0, 1], clamp);
  const walk = interpolate(frame, [SWAP, duration], [0, 1], clamp);
  const bloom = interpolate(frame, [SWAP, SWAP + 40, duration], [0.65, 0.85, 1], clamp);
  const push = interpolate(frame, [0, SWAP], [1.12, 1.04], clamp);

  return (
    <AbsoluteFill>
      <FootageSlot file={FOOTAGE.s5} use={footage}>
        <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '52% 52%'}}>
          <Bedroom open={open} warmth={warmth} phone={{x: phoneX, y: phoneY, glow, angle: phoneAngle}} armEnd={arm} headDrop={headDrop} />
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: swap}}>
          <MorningWindow walk={walk} bloom={bloom} frame={frame} />
        </AbsoluteFill>
      </FootageSlot>
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '0 90px 200px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 70%, rgba(10,7,5,0.55) 100%)',
        }}
      >
        <CineText text={campaign.s5.line} start={SWAP + 12} size={74} weight={700} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
