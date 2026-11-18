import React from 'react';
import {AbsoluteFill} from 'remotion';
import {fade} from '@remotion/transitions/fade';
import {springTiming, TransitionSeries} from '@remotion/transitions';
import {Grain} from '../components/Background';
import {ensureFonts} from '../fonts';
import {colors, FONT} from '../theme';
import {CampaignAudio, CampaignAudioProps} from './CampaignAudio';
import {FootageFlags} from './FootageSlot';
import {C1Struggle} from './scenes/C1Struggle';
import {C2Reality} from './scenes/C2Reality';
import {C3Control} from './scenes/C3Control';
import {C4Accountability} from './scenes/C4Accountability';
import {C5NotAlone} from './scenes/C5NotAlone';
import {C6Brand} from './scenes/C6Brand';
import {C, T} from './timing';

ensureFonts();

export type CampaignProps = CampaignAudioProps & {footage: FootageFlags};

const cross = (key: string) => (
  <TransitionSeries.Transition key={key} presentation={fade()} timing={springTiming({config: {damping: 200}, durationInFrames: T})} />
);

/** "Don't fight alone": 40s cinematic campaign film. */
export const Campaign: React.FC<CampaignProps> = ({hasMusic, hasBed, hasVoiceover, hasPartnerVo, footage}) => (
  <AbsoluteFill style={{backgroundColor: colors.bg, fontFamily: FONT}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={C.c1} name="1 The struggle">
        <C1Struggle duration={C.c1} footage={footage.s1} />
      </TransitionSeries.Sequence>
      {cross('x1')}
      <TransitionSeries.Sequence durationInFrames={C.c2} name="2 The reality">
        <C2Reality duration={C.c2} footage={footage.s2} />
      </TransitionSeries.Sequence>
      {cross('x2')}
      <TransitionSeries.Sequence durationInFrames={C.c3} name="3 Take control">
        <C3Control duration={C.c3} />
      </TransitionSeries.Sequence>
      {cross('x3')}
      <TransitionSeries.Sequence durationInFrames={C.c4} name="4 Partner = gatekeeper">
        <C4Accountability duration={C.c4} />
      </TransitionSeries.Sequence>
      {cross('x4')}
      <TransitionSeries.Sequence durationInFrames={C.c5} name="5 You are not alone">
        <C5NotAlone duration={C.c5} footage={footage.s5} />
      </TransitionSeries.Sequence>
      {cross('x5')}
      <TransitionSeries.Sequence durationInFrames={C.c6} name="6 Brand">
        <C6Brand duration={C.c6} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Grain opacity={0.08} />
    <CampaignAudio hasMusic={hasMusic} hasBed={hasBed} hasVoiceover={hasVoiceover} hasPartnerVo={hasPartnerVo} />
  </AbsoluteFill>
);
