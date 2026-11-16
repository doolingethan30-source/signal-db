import React from 'react';
import {Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';

/**
 * ─── MUSIC ──────────────────────────────────────────────────────
 * Drop a royalty-free track at:   public/music.mp3
 * (e.g. from YouTube Audio Library, Pixabay Music, Artlist, Epidemic
 * Sound; pick something dark, minimal and percussive, ~100–130 BPM).
 *
 * The file is detected automatically in calculateMetadata (Root.tsx).
 * If public/music.mp3 is missing the video renders silently. No crash.
 * ────────────────────────────────────────────────────────────────
 */
export const MUSIC_FILE = 'music.mp3';
export const BUZZ_FILE = 'sfx/buzz.wav';

/** Returns true if a file exists in /public. Never throws. */
export const publicFileExists = async (file: string): Promise<boolean> => {
  try {
    const res = await fetch(staticFile(file), {method: 'HEAD'});
    if (!res.ok) return false;
    const type = res.headers.get('content-type') ?? '';
    // Some dev servers answer unknown paths with index.html; guard against that.
    return !type.includes('text/html');
  } catch {
    return false;
  }
};

export type AudioProps = {hasMusic: boolean; hasBuzz: boolean};

export const AudioLayer: React.FC<AudioProps & {buzzAt: number}> = ({hasMusic, hasBuzz, buzzAt}) => {
  const {durationInFrames, fps} = useVideoConfig();
  return (
    <>
      {hasMusic ? (
        <Audio
          src={staticFile(MUSIC_FILE)}
          volume={(f) =>
            interpolate(f, [0, fps * 0.5, durationInFrames - fps * 1.2, durationInFrames], [0, 0.8, 0.8, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      ) : null}
      {/* SFX CUE: phone buzz (scene 1). Replace public/sfx/buzz.wav to change the sound. */}
      {hasBuzz ? (
        <Sequence from={buzzAt} name="SFX: phone buzz" durationInFrames={fps}>
          <Audio src={staticFile(BUZZ_FILE)} volume={0.9} />
        </Sequence>
      ) : null}
    </>
  );
};
