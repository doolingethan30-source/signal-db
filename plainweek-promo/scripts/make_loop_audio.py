"""Seamless 15 s music loop + 2 effects for the PlainweekLoop ad.

128 bpm, so 15 s is exactly 8 bars. Every event is written twice (at t and
t + 15 s) into a 30 s buffer and the SECOND half is exported, so reverb tails
and the riser wrap around the loop point: the end flows into the start.

Bars: 1–2 tense (chaos, then the collapse) · 3–6 bright groove (features) ·
7 the call-to-action hit · 8 riser back into the chaos downbeat.
Run: python3 -B scripts/make_loop_audio.py
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import make_family_audio as fa  # noqa: E402

fa.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "loop")
os.makedirs(fa.OUT, exist_ok=True)
SR, tt, hz, reverb, fft_filter = fa.SR, fa.tt, fa.hz, fa.reverb, fa.fft_filter
rng = np.random.default_rng(51)

LOOP = 15.0
N = int(SR * LOOP * 2)
BEAT = 60 / 128
BAR = BEAT * 4


def place(buf, sig, t, gain=1.0):
    for off in (0.0, LOOP):  # write every event into both passes
        fa.place(buf, sig, t + off, gain)


def kick(g):
    k = tt(0.3)
    return (np.sin(2 * np.pi * (50 + 85 * np.exp(-k * 30)) * k) * np.exp(-k * 10)) * g


def tick(p):
    c = tt(0.03)
    return np.sin(2 * np.pi * p * c) * np.exp(-c * 190)


def music():
    pad, keys, drums, bass = (np.zeros(N) for _ in range(4))
    minor = [[45, 57, 60, 64], [41, 57, 60, 65]]
    major = [[48, 55, 60, 64, 67], [43, 55, 59, 62, 67], [45, 57, 60, 64, 69], [41, 57, 60, 65, 69]]

    for bar in range(8):
        s = bar * BAR
        tense = bar < 2
        cta = bar == 6
        outro = bar == 7
        ch = minor[bar] if tense else major[(bar - 2) % 4] if bar < 6 else major[0] if cta else minor[0]
        for m in ch[1:]:
            place(pad, fa.pad_tone(hz(m), BAR + 0.5, attack=0.15, release=0.5), s, 0.07 if tense or outro else 0.1)
        for beat in range(4):
            bt = s + beat * BEAT
            if not (bar == 1 and beat >= 2) and not (outro and beat >= 2):
                place(drums, kick(0.3 if not tense else 0.24), bt)
            if tense or outro:  # nervous 16th ticking
                for q in range(4):
                    place(drums, tick(3300 if q % 2 == 0 else 2500), bt + q * BEAT / 4, 0.05)
            else:
                if beat % 2 == 1:
                    place(drums, reverb(fa.clap(), 0.5, 0.22, 3), bt, 0.14)
                for e in range(2):
                    place(drums, fa.shaker(), bt + e * BEAT / 2, 0.03)
                for q in range(4):  # bright arp
                    m = ch[[1, 2, 3, 4, 3, 2, 4, 3][(beat * 4 + q) % 8]] + 12
                    place(keys, fa.pluck(hz(m), 0.26, 0.6 + 0.4 * (q == 0)), bt + q * BEAT / 4, 0.05)
            for e in range(2):
                place(bass, fa.pluck(hz(ch[0]), 0.28, 1.0), bt + e * BEAT / 2, 0.2)
        if tense:  # dissonant stabs
            for off in (0, 1.5, 2.5):
                for m in (76, 77):
                    place(keys, fa.piano(hz(m), 0.3, 0.8), s + off * BEAT, 0.03)
    # collapse suck + drop into bar 3
    r = tt(1.2)
    noise = fft_filter(rng.normal(0, 1, len(r)), lo=600, hi=9000)
    place(drums, noise / np.max(np.abs(noise)) * (r / 1.2) ** 3, 2 * BAR - 1.2, 0.13)
    sub = tt(1.6)
    boom = np.sin(2 * np.pi * (40 + 32 * np.exp(-sub * 7)) * sub) * np.exp(-sub * 2)
    place(drums, boom, 2 * BAR, 0.3)
    for j, m in enumerate((72, 76, 79, 84)):
        place(keys, fa.bell(hz(m), 1.8, 0.8), 2 * BAR + j * 0.04, 0.06)
    # CTA hit at bar 7
    place(drums, boom, 6 * BAR, 0.3)
    for j, m in enumerate((72, 76, 79, 83, 86)):
        place(keys, fa.bell(hz(m), 2.0, 0.8), 6 * BAR + j * 0.05, 0.07)
    # riser through bar 8 into the chaos downbeat (which is the loop point)
    r = tt(BAR)
    noise = fft_filter(rng.normal(0, 1, len(r)), lo=500, hi=9000)
    place(drums, noise / np.max(np.abs(noise)) * (r / BAR) ** 2.5, 7 * BAR, 0.12)
    place(drums, boom, 0.0, 0.26)

    pad = reverb(fft_filter(pad, hi=3200), 2.2, 0.3, 2)
    keys = reverb(keys, 1.8, 0.3, 1)
    bass = fft_filter(bass, hi=900)
    mono = pad + keys * 1.1 + drums + bass
    half = int(SR * LOOP)
    loop = mono[half : half * 2]  # second pass: includes the tails wrapped from the first
    loop = loop / (np.max(np.abs(loop)) + 1e-9) * 0.85
    fa.write("music.wav", np.stack([loop, loop], axis=1))


def sfx():
    t = tt(0.4)
    tk = (np.sin(2 * np.pi * 1568 * t) * np.exp(-t * 22) + 0.55 * np.sin(2 * np.pi * 2349.3 * t) * np.exp(-t * 30)) * np.minimum(1, t / 0.001)
    fa.write("tick.wav", reverb(tk * 0.45, 0.6, 0.2, 5))
    sh = np.zeros(int(SR * 1.6))
    for j, m in enumerate((84, 88, 91, 95, 96)):
        fa.place(sh, fa.bell(hz(m), 1.1, 1.0), j * 0.05, 0.14)
    fa.write("shimmer.wav", reverb(sh, 1.2, 0.35, 6))


if __name__ == "__main__":
    music()
    sfx()
    print("wrote", sorted(os.listdir(fa.OUT)))
