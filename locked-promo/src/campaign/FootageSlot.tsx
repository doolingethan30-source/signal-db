import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';

/**
 * ─── OPTIONAL REAL FOOTAGE ──────────────────────────────────────
 * The people scenes are illustrated silhouettes by default. To use real
 * (licensed/stock) vertical footage instead, drop clips here:
 *
 *   public/footage/campaign-scene1.mp4   person alone in a dark bedroom, on phone
 *   public/footage/campaign-scene2.mp4   close-up hand scrolling, then locking phone
 *   public/footage/campaign-scene5.mp4   phone down, curtains open, morning light
 *
 * 9:16, ≥5–8s each. They're detected automatically at render time and
 * graded darker to match. Text and sound stay in place. Missing = silhouette.
 * ────────────────────────────────────────────────────────────────
 */
export const FOOTAGE = {
  s1: 'footage/campaign-scene1.mp4',
  s2: 'footage/campaign-scene2.mp4',
  s5: 'footage/campaign-scene5.mp4',
} as const;

export type FootageFlags = {s1: boolean; s2: boolean; s5: boolean};

export const FootageSlot: React.FC<{file: string; use: boolean; children: React.ReactNode}> = ({file, use, children}) =>
  use ? (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(file)}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72) contrast(1.06) saturate(0.82)'}}
      />
    </AbsoluteFill>
  ) : (
    <>{children}</>
  );
