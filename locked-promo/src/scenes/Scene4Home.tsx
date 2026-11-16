import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HomeScreen, Phone} from '../components/Phone';
import {content} from '../content';
import {SMOOTH, SNAP} from '../theme';

/** Camera push-in range shared with scene 5 so the move feels continuous. */
export const PUSH_START = 0.9;
export const PUSH_END = 1.0;

export const Scene4Home: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: SMOOTH, durationInFrames: 30});
  const reveal = spring({frame: frame - 8, fps, config: SMOOTH, durationInFrames: 40});
  const ring = spring({frame: frame - 16, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 50});
  const used = ring * content.homeScreen.usedMinutes;

  // Subtle, constant camera push-in
  const push = interpolate(frame, [0, duration], [PUSH_START, PUSH_END]);
  const lift = interpolate(enter, [0, 1], [700, 0]);
  const tilt = interpolate(spring({frame, fps, config: SNAP, durationInFrames: 30}), [0, 1], [8, 0]);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', perspective: 2400}}>
      <div style={{transform: `translateY(${lift}px) scale(${push}) rotateX(${tilt}deg)`}}>
        <Phone>
          <HomeScreen usedMinutes={used} reveal={reveal} />
        </Phone>
      </div>
    </AbsoluteFill>
  );
};
