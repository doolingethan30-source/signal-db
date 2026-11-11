import {Composition, Still} from 'remotion';
import {Family} from './family/Family';
import {FAMILY_FRAMES} from './family/theme';
import {Launch, LAUNCH_FRAMES} from './launch/Launch';
import {LOOP, LoopAd, LoopSeamTest} from './loop/Loop';
import {Reset} from './reset/Reset';
import {Roommates, RoommatesZD} from './roommates/Roommates';
import {ROOM_FRAMES} from './roommates/theme';
import {RESET_FRAMES} from './reset/theme';
import {PostBeforeAfter, PostCalm, PostFamily, PostSpeedrun} from './posts/Posts';
import {Promo} from './Promo';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="PlainweekPromo"
      component={Promo}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="PlainweekLaunch"
      component={Launch}
      durationInFrames={LAUNCH_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="PlainweekFamily"
      component={Family}
      durationInFrames={FAMILY_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="PlainweekReset"
      component={Reset}
      durationInFrames={RESET_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="PlainweekRoommates"
      component={Roommates}
      durationInFrames={ROOM_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="PlainweekRoommatesZD"
      component={RoommatesZD}
      durationInFrames={ROOM_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition id="PlainweekLoop" component={LoopAd} durationInFrames={LOOP} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="PlainweekLoopSeamTest" component={LoopSeamTest} durationInFrames={LOOP * 2} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="PostSpeedrun" component={PostSpeedrun} width={1080} height={1350} />
    <Still id="PostCalm" component={PostCalm} width={1080} height={1350} />
    <Still id="PostFamily" component={PostFamily} width={1080} height={1350} />
    <Still id="PostBeforeAfter" component={PostBeforeAfter} width={1080} height={1350} />
  </>
);
