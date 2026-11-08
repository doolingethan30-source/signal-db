"""Score + 3 effects for the roommates film (PlainweekRoommates, 45 s, no voice-over).

Synthesised with numpy (royalty-free), reusing helpers from make_family_audio.py.
Writes WAVs to public/roommates/. Run: python3 scripts/make_roommates_audio.py

Music map (seconds), 116 bpm:
  0–3      hook: punchy plucked riff + kick in A minor
  3–10.3   problem: playful, slightly off-kilter staccato (Am – Em – F – G);
           thins out for the group-chat argument, breakdown + riser at 10 s
  10.3     Family Mode: drops into a bright major groove (C – G – Am – F) with
           claps, shaker, bass and strummed plucks; a bell hook from 16 s
  39.6–42  clean apartment: full and warm
  42–45    end card: final hit and a wide sustained chord
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import make_family_audio as fa  # noqa: E402

fa.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "roommates")
os.makedirs(fa.OUT, exist_ok=True)
SR, tt, hz, place, reverb, fft_filter = fa.SR, fa.tt, fa.hz, fa.place, fa.reverb, fa.fft_filter
rng = np.random.default_rng(41)

DUR = 45.0
N = int(SR * DUR)
BEAT = 60 / 116
BAR = BEAT * 4
DROP = 10.33
END = 42.0


def strum(notes, at, buf, gain=0.05, spread=0.018, d=0.5):
    for i, m in enumerate(notes):
        place(buf, fa.pluck(hz(m), d, 0.8), at + i * spread, gain)


def kick(g):
    k = tt(0.3)
    return (np.sin(2 * np.pi * (50 + 85 * np.exp(-k * 30)) * k) * np.exp(-k * 10) + 0.1 * rng.normal(0, 1, len(k)) * np.exp(-k * 240)) * g


def music():
    pad = np.zeros(N)
    keys = np.zeros(N)
    drums = np.zeros(N)
    bass = np.zeros(N)
    pump = np.ones(N)

    def groove(start, end, chords, *, full, claps=True, hats=True, bass_on=True, strums=True, kick_g=0.32):
        b = 0
        while start + b * BAR < end - 0.01:
            s = start + b * BAR
            ch = chords[b % len(chords)]
            if full:
                for m in ch[1:4]:
                    place(pad, fa.pad_tone(hz(m), BAR + 0.4, attack=0.2, release=0.4), s, 0.08)
            for beat in range(4):
                bt = s + beat * BEAT
                if bt >= end:
                    break
                place(drums, kick(kick_g), bt)
                i0 = int(bt * SR)
                seg = tt(0.28)
                pump[i0 : i0 + len(seg)] = np.minimum(pump[i0 : i0 + len(seg)], 1 - 0.35 * np.exp(-seg * 11))
                if claps and beat % 2 == 1:
                    place(drums, reverb(fa.clap(), 0.5, 0.22, 3), bt, 0.15)
                if hats:
                    for e in range(2):
                        place(drums, fa.shaker(), bt + e * BEAT / 2, 0.035 if e else 0.025)
                if bass_on:
                    for e in range(2):
                        place(bass, fa.pluck(hz(ch[0] + (12 if beat == 3 and e == 1 else 0)), 0.3, 1.0), bt + e * BEAT / 2, 0.22)
                if strums:  # "guitar" strums on the off-beats
                    strum([n + 12 for n in ch[1:]], bt + BEAT / 2, keys, 0.03 if full else 0.025)
            b += 1

    minor = [[45, 57, 60, 64], [40, 55, 59, 64], [41, 57, 60, 65], [43, 55, 59, 62]]
    major = [[48, 55, 60, 64, 67], [43, 55, 59, 62, 67], [45, 57, 60, 64, 69], [41, 57, 60, 65, 69]]

    # hook + problem (0–10 s): minor, a little off-balance
    groove(0.0, 6.67, minor, full=False, claps=False, hats=True, kick_g=0.26)
    # staccato "tiptoe" piano over the problem
    t0 = 0.0
    motif = [76, 72, 74, 71, 72, 69, 71, 67]
    i = 0
    while t0 < 6.6:
        place(keys, fa.piano(hz(motif[i % 8]), 0.4, 0.8), t0, 0.05)
        t0 += BEAT / 2 if i % 4 != 3 else BEAT
        i += 1
    # the group chat (7.6–10): drums thin out, just bass + plucks
    groove(6.67, 9.0, minor[2:] + minor[:2], full=False, claps=False, hats=False, kick_g=0.0)
    # breakdown + riser into the drop (10–11.6)
    r = tt(1.6)
    place(drums, fft_filter(rng.normal(0, 1, len(r)), lo=700, hi=10000) * (r / 1.6) ** 3 * 0.14, DROP - 1.6)
    for k_ in range(8):
        place(drums, kick(0.06 + 0.03 * k_), DROP - 1.6 + k_ * 0.2)

    # Family Mode: the major groove (11.6–38.2)
    sub = tt(1.8)
    place(drums, np.sin(2 * np.pi * (40 + 30 * np.exp(-sub * 7)) * sub) * np.exp(-sub * 2), DROP, 0.3)
    for j, m in enumerate((72, 76, 79, 84)):
        place(keys, fa.bell(hz(m), 2.0, 0.8), DROP + j * 0.04, 0.06)
    groove(DROP, END, major, full=True)
    hook = [(0, 76), (0.5, 79), (1, 81), (1.5, 79), (2, 76), (3, 74), (3.5, 76), (4, 72), (6, 74), (6.5, 76), (7, 79)]
    hs = 16.0
    while hs < END - 1:
        for off, m in hook:
            when = hs + off * BEAT
            if when < END - 0.2:
                place(keys, fa.bell(hz(m), 1.3, 0.8), when, 0.045)
        hs += 2 * BAR

    # end card (38.2–43): final hit + wide chord
    place(drums, np.sin(2 * np.pi * (38 + 34 * np.exp(-sub * 7)) * sub) * np.exp(-sub * 1.6), END, 0.34)
    for k_, m in enumerate([36, 48, 55, 60, 64, 67, 71, 74]):
        place(pad, fa.pad_tone(hz(m), DUR - END + 1.0, attack=0.5, release=2.4), END, 0.16 if k_ == 0 else 0.07)
    for j, m in enumerate((72, 76, 79, 83, 86)):
        place(keys, fa.bell(hz(m), 3.0, 0.8), END + 0.02 + j * 0.07, 0.07)
    strum([60, 64, 67, 72, 76], END + 1.6, keys, 0.05, 0.03, 1.4)

    pad = reverb(fft_filter(pad, hi=3200) * pump, 2.6, 0.3, 2)
    keys = reverb(keys, 2.0, 0.3, 1)
    bass = fft_filter(bass, hi=900) * pump
    left = pad * 0.95 + keys * 1.1 + drums + bass
    right = pad * 1.05 + keys * 0.9 + drums + bass
    st = np.stack([left, right], axis=1)
    t = np.arange(N) / SR
    st *= (np.minimum(1, t / 0.05) * np.clip((DUR - t) / 2.0, 0, 1))[:, None]
    st /= np.max(np.abs(st)) + 1e-9
    fa.write("music.wav", st * 0.85)


def sfx():
    jn = np.zeros(int(SR * 1.0))
    for j, m in enumerate((79, 84)):
        place(jn, fa.bell(hz(m), 0.8, 1.0), j * 0.08, 0.25)
    fa.write("join.wav", reverb(jn, 0.8, 0.3, 4))
    t = tt(0.4)
    tick = (np.sin(2 * np.pi * 1568 * t) * np.exp(-t * 22) + 0.55 * np.sin(2 * np.pi * 2349.3 * t) * np.exp(-t * 30)) * np.minimum(1, t / 0.001)
    fa.write("tick.wav", reverb(tick * 0.45, 0.6, 0.2, 5))
    sh = np.zeros(int(SR * 1.6))
    for j, m in enumerate((84, 88, 91, 95, 96)):
        place(sh, fa.bell(hz(m), 1.1, 1.0), j * 0.05, 0.14)
    fa.write("shimmer.wav", reverb(sh, 1.2, 0.35, 6))


if __name__ == "__main__":
    music()
    sfx()
    print("wrote", sorted(os.listdir(fa.OUT)))
