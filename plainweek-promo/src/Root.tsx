import {Composition} from 'remotion';
import {Launch} from './launch/Launch';
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
      durationInFrames={900}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
