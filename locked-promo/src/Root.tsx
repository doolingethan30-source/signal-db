import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {AudioProps, BUZZ_FILE, MUSIC_FILE, publicFileExists, VOICEOVER_FILE} from './components/AudioLayer';
import {LockedPromo, LockedPromo15} from './LockedPromo';
import {Campaign, CampaignProps} from './campaign/Campaign';
import {FOOTAGE} from './campaign/FootageSlot';
import {CAMPAIGN_TOTAL} from './campaign/timing';
import {VO_DIR, VO_LINES} from './campaign/voiceover';
import {FPS, FULL_TOTAL, HEIGHT, SHORT_TOTAL, WIDTH} from './theme';

// Detect optional audio files before rendering. Missing files → silent render, no crash.
const detectAudio: CalculateMetadataFunction<AudioProps> = async ({props}) => {
  const [hasMusic, hasBuzz] = await Promise.all([publicFileExists(MUSIC_FILE), publicFileExists(BUZZ_FILE)]);
  return {props: {...props, hasMusic, hasBuzz}};
};

const detectAudioWithVoiceover: CalculateMetadataFunction<AudioProps> = async (args) => {
  const base = await detectAudio(args);
  const hasVoiceover = await publicFileExists(VOICEOVER_FILE);
  return {props: {...args.props, ...base.props, hasVoiceover}};
};

const detectCampaign: CalculateMetadataFunction<CampaignProps> = async ({props}) => {
  const [hasMusic, hasBed, s1, s2, s5, hasVoiceover, hasPartnerVo] = await Promise.all([
    publicFileExists(MUSIC_FILE),
    publicFileExists('sfx/ambient-bed.mp3'),
    publicFileExists(FOOTAGE.s1),
    publicFileExists(FOOTAGE.s2),
    publicFileExists(FOOTAGE.s5),
    publicFileExists(`${VO_DIR}/${VO_LINES[0].file}`),
    publicFileExists(`${VO_DIR}/p1.mp3`),
  ]);
  return {props: {...props, hasMusic, hasBed, hasVoiceover, hasPartnerVo, footage: {s1, s2, s5}}};
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
      calculateMetadata={detectAudioWithVoiceover}
    />
    <Composition
      id="LockedCampaign"
      component={Campaign}
      durationInFrames={CAMPAIGN_TOTAL}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{hasMusic: false, hasBed: false, footage: {s1: false, s2: false, s5: false}}}
      calculateMetadata={detectCampaign}
    />
  </>
);
