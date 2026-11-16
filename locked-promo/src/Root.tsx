import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {AudioProps, BUZZ_FILE, MUSIC_FILE, publicFileExists} from './components/AudioLayer';
import {LockedPromo, LockedPromo15} from './LockedPromo';
import {FPS, FULL_TOTAL, HEIGHT, SHORT_TOTAL, WIDTH} from './theme';

// Detect optional audio files before rendering. Missing files → silent render, no crash.
const detectAudio: CalculateMetadataFunction<AudioProps> = async ({props}) => {
  const [hasMusic, hasBuzz] = await Promise.all([publicFileExists(MUSIC_FILE), publicFileExists(BUZZ_FILE)]);
  return {props: {...props, hasMusic, hasBuzz}};
};

const defaults: AudioProps = {hasMusic: false, hasBuzz: false};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LockedPromo"
      component={LockedPromo}
      durationInFrames={FULL_TOTAL}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={defaults}
      calculateMetadata={detectAudio}
    />
    <Composition
      id="LockedPromo15"
      component={LockedPromo15}
      durationInFrames={SHORT_TOTAL}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={defaults}
      calculateMetadata={detectAudio}
    />
  </>
);
