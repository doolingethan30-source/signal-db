import React from 'react';
import { Composition } from 'remotion';
import { FPS, TOTAL } from './anim';
import { FaithSeed } from './FaithSeed';

export const RemotionRoot: React.FC = () => (
  <Composition id="FaithSeed" component={FaithSeed} durationInFrames={TOTAL} fps={FPS} width={1440} height={2560} />
);
