import React from 'react';
import {Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {CUES, START} from './timing';
import {VO_DIR, VO_LINES} from './voiceover';

/**
 * Music: public/music.mp3 (royalty-free) is used if present.
 * Otherwise a generated ambient bed plays (public/sfx/ambient-bed.mp3):
 * a minor pad that resolves to major when the morning light arrives.
 * SFX are generated in-house (public/sfx/*), so no licensing issues.
 */
export type CampaignAudioProps = {hasMusic: boolean; hasBed: boolean; hasVoiceover?: boolean; hasPartnerVo?: boolean};

const Sfx: React.FC<{at: number; file: string; volume: number; frames: number; name: string}> = ({at, file, volume, frames, name}) => (
  <Sequence from={at} durationInFrames={frames} name={name}>
    <Audio src={staticFile(file)} volume={volume} />
  </Sequence>
);

export const CampaignAudio: React.FC<CampaignAudioProps> = ({hasMusic, hasBed, hasVoiceover, hasPartnerVo}) => {
  const {durationInFrames, fps} = useVideoConfig();
  const duck = hasVoiceover ? 0.55 : 1; // sit music/bed under the voice
  const fade = (f: number, level: number) =>
    interpolate(f, [0, fps * 1.5, durationInFrames - fps * 2.5, durationInFrames], [0, level, level, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  return (
    <>
      {hasMusic ? (
        <Audio src={staticFile('music.mp3')} volume={(f) => fade(f, 0.75 * duck)} />
      ) : hasBed ? (
        <Audio src={staticFile('sfx/ambient-bed.mp3')} volume={(f) => fade(f, 0.9 * duck)} />
      ) : null}
      <Sfx at={START.c2 + CUES.lockClick} file="sfx/lock-click.wav" volume={0.7} frames={10} name="SFX: lock click" />
      <Sfx at={START.c4 + CUES.chime} file="sfx/chime.wav" volume={0.5} frames={40} name="SFX: 'stronger' email chime" />
      <Sfx at={START.c4 + CUES.codeChime} file="sfx/chime.wav" volume={0.6} frames={40} name="SFX: one-time code email chime" />
      <Sfx at={START.c5 + CUES.riser} file="sfx/riser.wav" volume={hasVoiceover ? 0.35 : 0.55} frames={90} name="SFX: light riser" />
      <Sfx at={START.c6 + CUES.logoHit} file="sfx/logo-hit.wav" volume={0.85} frames={105} name="SFX: logo hit" />
      {hasVoiceover
        ? VO_LINES.filter((l) => !l.partner || hasPartnerVo).map((l) => (
            <Sequence key={l.file} from={Math.round(l.at * fps)} name={`VO: ${l.text}`}>
              <Audio src={staticFile(`${VO_DIR}/${l.file}`)} volume={1} />
            </Sequence>
          ))
        : null}
    </>
  );
};
