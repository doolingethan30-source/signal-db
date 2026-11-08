import {Composition} from 'remotion';
import {Family} from './family/Family';
import {FAMILY_FRAMES} from './family/theme';
import {Launch, LAUNCH_FRAMES} from './launch/Launch';
import {Reset} from './reset/Reset';
import {RESET_FRAMES} from './reset/theme';
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
  </>
);
