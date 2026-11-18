import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CineText} from '../CineText';
import {campaign} from '../content';
import {FOOTAGE, FootageSlot} from '../FootageSlot';
import {Bedroom} from '../Silhouettes';

export const C1Struggle: React.FC<{duration: number; footage: boolean}> = ({duration, footage}) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, duration], [1.0, 1.12]);
  // The screen's light flickers gently as content changes
  const glow = 0.82 + 0.12 * Math.sin(frame * 0.21) + 0.06 * Math.sin(frame * 0.53);
  return (
    <AbsoluteFill>
      <FootageSlot file={FOOTAGE.s1} use={footage}>
        <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '52% 52%'}}>
          <Bedroom phone={{x: 528, y: 1150, glow, angle: -28}} />
        </AbsoluteFill>
      </FootageSlot>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', padding: '0 90px 190px', textAlign: 'center'}}>
        <CineText text={campaign.s1.line} start={24} size={66} weight={600} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
