import React from 'react';
import {AbsoluteFill} from 'remotion';
import {fade} from '@remotion/transitions/fade';
import {springTiming, TransitionSeries} from '@remotion/transitions';
import {AudioLayer, AudioProps} from './components/AudioLayer';
import {Grain, MatteBackground} from './components/Background';
import {ensureFonts} from './fonts';
import {BUZZ_FRAME, Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Notifications} from './scenes/Scene2Notifications';
import {Scene3Headline} from './scenes/Scene3Headline';
import {Scene4Home} from './scenes/Scene4Home';
import {Scene5Lockout} from './scenes/Scene5Lockout';
import {Scene5bAdultBlock} from './scenes/Scene5bAdultBlock';
import {Scene6Features} from './scenes/Scene6Features';
import {Scene7Logo} from './scenes/Scene7Logo';
import {colors, FONT, FULL, SHORT, SHORT_LOCKOUT_CUT, TRANSITION} from './theme';

ensureFonts();

// Called as a function (not <Smooth/>) because TransitionSeries only accepts its own child types.
const smooth = (key: string) => (
  <TransitionSeries.Transition
    key={key}
    presentation={fade()}
    timing={springTiming({config: {damping: 200}, durationInFrames: TRANSITION})}
  />
);

const Frame: React.FC<{children: React.ReactNode} & AudioProps> = ({children, hasMusic, hasBuzz, hasVoiceover}) => (
  <AbsoluteFill style={{backgroundColor: colors.bg, fontFamily: FONT}}>
    <MatteBackground />
    {children}
    <Grain />
    <AudioLayer hasMusic={hasMusic} hasBuzz={hasBuzz} hasVoiceover={hasVoiceover} buzzAt={BUZZ_FRAME} />
  </AbsoluteFill>
);

/** Full 30s cut. Hard cuts 1→2→3, smooth crossfades 3→4→5→5B→6→7. */
export const LockedPromo: React.FC<AudioProps> = (props) => (
  <Frame {...props}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={FULL.s1} name="1 Hook">
        <Scene1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence durationInFrames={FULL.s2} name="2 Notifications">
        <Scene2Notifications />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence durationInFrames={FULL.s3} name="3 Headline">
        <Scene3Headline duration={FULL.s3} />
      </TransitionSeries.Sequence>
      {smooth('t1')}
      <TransitionSeries.Sequence durationInFrames={FULL.s4} name="4 Home screen">
        <Scene4Home duration={FULL.s4} />
      </TransitionSeries.Sequence>
      {smooth('t2')}
      <TransitionSeries.Sequence durationInFrames={FULL.s5} name="5 Lockout">
        <Scene5Lockout duration={FULL.s5} />
      </TransitionSeries.Sequence>
      {smooth('t3b')}
      <TransitionSeries.Sequence durationInFrames={FULL.s5b} name="5B Adult content block">
        <Scene5bAdultBlock duration={FULL.s5b} />
      </TransitionSeries.Sequence>
      {smooth('t3')}
      <TransitionSeries.Sequence durationInFrames={FULL.s6} name="6 Features">
        <Scene6Features />
      </TransitionSeries.Sequence>
      {smooth('t4')}
      <TransitionSeries.Sequence durationInFrames={FULL.s7} name="7 Logo">
        <Scene7Logo duration={FULL.s7} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </Frame>
);

/** 15s cut: scenes 1, 3, 5, 5B (adult content), 7. */
export const LockedPromo15: React.FC<AudioProps> = (props) => (
  <Frame {...props}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SHORT.s1} name="1 Hook">
        <Scene1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence durationInFrames={SHORT.s3} name="3 Headline">
        <Scene3Headline duration={SHORT.s3} />
      </TransitionSeries.Sequence>
      {smooth('t5')}
      <TransitionSeries.Sequence durationInFrames={SHORT.s5} name="5 Lockout">
        <Scene5Lockout duration={SHORT.s5} cut={SHORT_LOCKOUT_CUT} />
      </TransitionSeries.Sequence>
      {smooth('t5b')}
      <TransitionSeries.Sequence durationInFrames={SHORT.s5b} name="5B Adult content block">
        <Scene5bAdultBlock duration={SHORT.s5b} />
      </TransitionSeries.Sequence>
      {smooth('t6')}
      <TransitionSeries.Sequence durationInFrames={SHORT.s7} name="7 Logo">
        <Scene7Logo duration={SHORT.s7} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </Frame>
);
