import {AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut, prog} from './anim';
import {Phone} from './components/Phone';
import {loadFonts} from './fonts';
import {Captions} from './scenes/Captions';
import {Chaos, CHAOS_PINGS} from './scenes/Chaos';
import {EndCard} from './scenes/EndCard';
import {AiSchedule} from './screens/AiSchedule';
import {DragScene, dragWeek} from './screens/DragScene';
import {Habits} from './screens/Habits';
import {HomeScreen, WIDGET_TICKS} from './screens/HomeScreen';
import {Review} from './screens/Review';
import {TypeScene, typeWeek} from './screens/TypeScene';
import {WeekView} from './screens/WeekView';
import {C, FPS, T} from './theme';

loadFonts();

const PHONE_W = 640;
const PHONE_IN = 90;
const PHONE_OUT = 834;

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 40;
  const calm = prog(frame, 80, 40);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 40% at ${30 + drift / 20}% ${20 + drift / 30}%, rgba(139,162,133,${0.12 + calm * 0.1}) 0%, rgba(139,162,133,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 45% at ${75 - drift / 25}% 85%, rgba(214,197,168,0.35) 0%, rgba(214,197,168,0) 70%)`,
        }}
      />
      {/* slightly warmer, busier tone during the chaos */}
      <AbsoluteFill style={{background: 'rgba(214,190,170,0.18)', opacity: 1 - calm}} />
    </AbsoluteFill>
  );
};

type Layer = {from: number; to: number; slide?: boolean; zoom?: boolean; render: (frame: number) => React.ReactNode};

const XF = 10; // crossfade length between phone screens

const LAYERS: Layer[] = [
  {
    from: PHONE_IN,
    to: T.type[0],
    render: (frame) => {
      const f = frame - T.intro[0];
      return (
        <WeekView
          days={typeWeek(0)}
          appear={Array.from({length: 7}, (_, i) => prog(f, 10 + i * 4, 18))}
          ringScale={prog(f, 34, 40, easeInOut)}
        />
      );
    },
  },
  {from: T.type[0], to: T.drag[0], render: (frame) => <TypeScene f={frame - T.type[0]} />},
  {from: T.drag[0], to: T.widget[0] + XF / 2, render: (frame) => <DragScene f={frame - T.drag[0]} />},
  {from: T.widget[0] - XF / 2, to: T.ai[0] + XF / 2, zoom: true, render: (frame) => <HomeScreen f={frame - T.widget[0]} />},
  {from: T.ai[0] - XF / 2, to: T.habits[0] + XF / 2, slide: true, render: (frame) => <AiSchedule f={frame - T.ai[0]} />},
  {from: T.habits[0] - XF / 2, to: T.review[0] + XF / 2, slide: true, render: (frame) => <Habits f={frame - T.habits[0]} />},
  {from: T.review[0] - XF / 2, to: T.final[0] + XF / 2, slide: true, render: (frame) => <Review f={frame - T.review[0]} />},
  {
    from: T.final[0] - XF / 2,
    to: 900,
    zoom: true,
    render: (frame) => {
      const f = frame - T.final[0];
      const week = dragWeek(200).map((d, i) => ({
        ...d,
        tasks: d.tasks.map((t, j) => ({...t, done: Math.max(t.done, prog(f, 4 + i * 3 + j * 1.5, 10))})),
      }));
      return <WeekView days={week} />;
    },
  },
];

const PhoneStage: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < PHONE_IN) return null;
  const enter = spring({frame: frame - PHONE_IN, fps: FPS, config: {damping: 20, stiffness: 70, mass: 1}});
  const exit = prog(frame, PHONE_OUT, 22, easeInOut);
  const floatY = Math.sin(frame / 38) * 8;
  const rotY = Math.sin(frame / 70) * 3;
  const rotX = (1 - enter) * 24 + Math.cos(frame / 55) * 1.5;
  return (
    <AbsoluteFill style={{perspective: 2400}}>
      <div
        style={{
          position: 'absolute',
          left: (1080 - PHONE_W) / 2,
          top: 452,
          transform: `translateY(${(1 - enter) * 1150 + floatY + exit * 260}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${(0.9 + 0.1 * enter) * (1 - exit * 0.18)})`,
          opacity: 1 - exit,
          filter: `blur(${exit * 8}px)`,
        }}
      >
        <Phone width={PHONE_W}>
          {LAYERS.map((layer, i) => {
            if (frame < layer.from || frame >= layer.to) return null;
            const fadeIn = i === 0 || (!layer.slide && !layer.zoom) ? 1 : prog(frame, layer.from, XF, easeInOut);
            const next = LAYERS[i + 1];
            const fadeOut = next && (next.slide || next.zoom) ? prog(frame, layer.to - XF, XF, easeInOut) : 0;
            let transform = '';
            if (layer.slide) transform += `translateX(${(1 - fadeIn) * 60 - fadeOut * 60}px)`;
            if (layer.zoom) transform += ` scale(${1 + (1 - fadeIn) * 0.08})`;
            if (next?.zoom) transform += ` scale(${1 - fadeOut * 0.06})`;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: i === 0 ? 1 : fadeIn * (next?.slide ? 1 : 1),
                  transform,
                  zIndex: i,
                }}
              >
                {layer.render(frame)}
              </div>
            );
          })}
        </Phone>
      </div>
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{at: number; src: string; volume: number; rate?: number}> = ({at, src, volume, rate = 1}) => (
  <Sequence from={Math.round(at)} durationInFrames={40} layout="none">
    <Audio src={staticFile(src)} volume={volume} playbackRate={rate} />
  </Sequence>
);

const SoundDesign: React.FC = () => (
  <>
    <Audio src={staticFile('voiceover.mp3')} volume={1} />
    <Audio src={staticFile('music.wav')} volume={0.22} />
    {CHAOS_PINGS.map((at, i) => (
      <Sfx key={`ping${i}`} at={at} src="pop.wav" volume={0.18} rate={[1, 1.25, 0.9, 1.4, 1.1][i % 5]} />
    ))}
    <Sfx at={84} src="whoosh.wav" volume={0.55} />
    <Sfx at={T.type[0] + 2} src="pop.wav" volume={0.22} />
    <Sfx at={276} src="pop.wav" volume={0.25} rate={1.2} />
    <Sfx at={282} src="pop.wav" volume={0.25} rate={1.3} />
    <Sfx at={292} src="tick.wav" volume={0.35} />
    <Sfx at={T.drag[0] + 10} src="pop.wav" volume={0.22} rate={0.9} />
    <Sfx at={T.drag[0] + 66} src="tick.wav" volume={0.35} />
    <Sfx at={T.widget[0] - 6} src="whoosh.wav" volume={0.3} />
    {WIDGET_TICKS.map((at, i) => (
      <Sfx key={`w${i}`} at={T.widget[0] + at} src="tick.wav" volume={0.45} rate={1 + i * 0.06} />
    ))}
    <Sfx at={T.ai[0] + 12} src="pop.wav" volume={0.22} />
    {[34, 42, 50, 58].map((at, i) => (
      <Sfx key={`ai${i}`} at={T.ai[0] + at + 18} src="tick.wav" volume={0.22} rate={0.9 + i * 0.08} />
    ))}
    <Sfx at={T.habits[0] + 40} src="tick.wav" volume={0.3} />
    <Sfx at={T.final[0] + 20} src="tick.wav" volume={0.25} rate={1.1} />
    <Sfx at={PHONE_OUT} src="whoosh.wav" volume={0.35} />
  </>
);

export const Promo: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    <Background />
    <Sequence from={0} durationInFrames={T.chaos[1]} layout="none">
      <Chaos />
    </Sequence>
    <PhoneStage />
    <Captions />
    <EndCard />
    <SoundDesign />
  </AbsoluteFill>
);
