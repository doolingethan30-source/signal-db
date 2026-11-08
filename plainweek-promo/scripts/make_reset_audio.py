"""Score + 3 effects for "The 3-minute week" (PlainweekReset, 30 s, no voice-over).

Synthesised with numpy (royalty-free); reuses the synth helpers from
make_family_audio.py. Writes WAVs to public/reset/.
Run: python3 scripts/make_reset_audio.py

Music map (seconds), 124 bpm, A minor resolving to C major:
  0–2.6    hook: low drone, accelerating clock, swelling tension, a breath
  2.6      GO: the groove drops in on a ticking-clock motif
  2.6–23   one new layer per step (arp, claps + chords, bell hook, build)
  23.0     STOP: everything cuts on a bright hit as the clock stops at 2:41
  23–30    a warm, wide C major finale under the logo and call to action
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import make_family_audio as fa  # noqa: E402

fa.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "reset")
os.makedirs(fa.OUT, exist_ok=True)
SR, tt, hz, place, reverb, fft_filter = fa.SR, fa.tt, fa.hz, fa.place, fa.reverb, fa.fft_filter
rng = np.random.default_rng(31)

DUR = 30.0
N = int(SR * DUR)
BPM = 124
BEAT = 60 / BPM
BAR = BEAT * 4
GO = 2.6
STOP = 23.0
STEPS = [2.6, 6.5, 10.0, 15.0, 19.5]


def tick(pitch=3200, d=0.035):
    c = tt(d)
    return (np.sin(2 * np.pi * pitch * c) * np.exp(-c * 180) + 0.4 * rng.normal(0, 1, len(c)) * np.exp(-c * 400)) * np.minimum(1, c / 0.0005)


def kick(g):
    k = tt(0.32)
    return (np.sin(2 * np.pi * (48 + 90 * np.exp(-k * 32)) * k) * np.exp(-k * 10) + 0.1 * rng.normal(0, 1, len(k)) * np.exp(-k * 250)) * g


def hat(open_=False):
    h = tt(0.18 if open_ else 0.05)
    return fft_filter(rng.normal(0, 1, len(h)), lo=7000, hi=14000) * np.exp(-h * (18 if open_ else 80))


def music():
    pad = np.zeros(N)
    keys = np.zeros(N)
    drums = np.zeros(N)
    bass = np.zeros(N)
    pump = np.ones(N)

    # ---- hook (0–2.6 s)
    t = tt(GO)
    drone = sum(a * np.sin(2 * np.pi * f * t + f) for f, a in ((55, 0.5), (55.4, 0.4), (110, 0.2), (82.4, 0.15)))
    drone = fft_filter(drone * (0.3 + 0.7 * (t / GO) ** 1.5), hi=600)
    place(pad, drone / np.max(np.abs(drone)) * 0.16, 0)
    for k, m in enumerate((57, 60, 64, 71)):  # Am(add9) swelling
        place(pad, fa.pad_tone(hz(m), GO - 0.08, attack=GO * 0.9, release=0.05), 0, 0.08)
    x, step = 0.15, 0.36
    while x < GO - 0.12:
        place(drums, tick(3000 if int(x / 0.01) % 2 else 2400), x, 0.08 + 0.1 * x / GO)
        x += step
        step = max(0.07, step * 0.86)
    r = tt(1.4)
    place(drums, fft_filter(rng.normal(0, 1, len(r)), lo=600, hi=9000) * (r / 1.4) ** 3 * 0.12, GO - 1.45)

    # ---- groove (2.6–23 s): Am – F – C – G
    chords = [[45, 57, 60, 64, 71], [41, 57, 60, 65, 69], [48, 55, 60, 64, 67], [43, 55, 59, 62, 67]]
    b = 0
    while GO + b * BAR < STOP - 0.01:
        s = GO + b * BAR
        ch = chords[b % 4]
        lvl = sum(1 for st in STEPS if s >= st - 0.01)  # layers unlocked so far
        if lvl >= 3:
            for m in ch[1:]:
                place(pad, fa.pad_tone(hz(m), BAR + 0.4, attack=0.15, release=0.4), s, 0.11)
        for beat in range(4):
            bt = s + beat * BEAT
            if bt >= STOP:
                break
            place(drums, kick(0.34), bt)
            i0 = int(bt * SR)
            seg = tt(0.28)
            pump[i0 : i0 + len(seg)] = np.minimum(pump[i0 : i0 + len(seg)], 1 - 0.4 * np.exp(-seg * 11))
            # clock motif: tick-tock 16ths
            for q in range(4):
                place(drums, tick(3300 if q % 2 == 0 else 2500), bt + q * BEAT / 4, 0.05 if q else 0.075)
            if lvl >= 2:
                place(drums, hat(True), bt + BEAT / 2, 0.05)
            if lvl >= 3 and beat % 2 == 1:
                place(drums, reverb(fa.clap(), 0.5, 0.25, 3), bt, 0.15)
            for e in range(2):  # bass eighths
                m = ch[0] + (12 if (lvl >= 4 and e == 1) else 0)
                place(bass, fa.pluck(hz(m), 0.3, 1.0), bt + e * BEAT / 2, 0.24)
        if lvl >= 2:  # arp
            pat = [1, 2, 3, 4, 3, 2, 4, 3]
            for i in range(16):
                when = s + i * BEAT / 4
                if when >= STOP:
                    break
                place(keys, fa.pluck(hz(ch[pat[i % 8]] + 12), 0.25, 0.6 + 0.4 * (i % 4 == 0)), when, 0.05)
        b += 1
    # bell hook from step 4
    hook = [(0, 76), (0.5, 79), (1, 81), (2, 79), (2.5, 76), (3, 74), (4, 76), (6, 72), (6.5, 74), (7, 76)]
    hs = STEPS[3]
    for rep in range(3):
        for off, m in hook:
            when = hs + rep * 2 * BAR + off * BEAT
            if when < STOP - 0.1:
                place(keys, fa.bell(hz(m), 1.4, 0.8), when, 0.05)
    # snare roll + riser into the stop
    roll_t = STOP - 1.5
    while roll_t < STOP - 0.05:
        sn = tt(0.12)
        place(drums, fft_filter(rng.normal(0, 1, len(sn)), lo=1500, hi=8000) * np.exp(-sn * 40), roll_t, 0.04 + 0.08 * (roll_t - (STOP - 1.5)) / 1.5)
        roll_t += BEAT / 4 if roll_t < STOP - 0.75 else BEAT / 8
    r = tt(1.5)
    place(drums, fft_filter(rng.normal(0, 1, len(r)), lo=800, hi=10000) * (r / 1.5) ** 3 * 0.1, STOP - 1.5)

    # ---- STOP hit + finale (23–30 s): C major
    sub = tt(2.2)
    place(drums, np.sin(2 * np.pi * (36 + 34 * np.exp(-sub * 7)) * sub) * np.exp(-sub * 1.7), STOP, 0.42)
    for i, m in enumerate((72, 76, 79, 83, 86)):
        place(keys, fa.bell(hz(m), 3.0, 0.9), STOP + i * 0.03, 0.09)
    fin = [(STOP, [36, 48, 55, 59, 62, 64, 67]), (25.6, [41, 53, 57, 60, 64, 67]), (27.8, [36, 48, 55, 59, 62, 64, 67, 71])]
    for i, (s, notes) in enumerate(fin):
        e = fin[i + 1][0] if i + 1 < len(fin) else DUR
        for k, m in enumerate(notes):
            place(pad, fa.pad_tone(hz(m), e - s + 1.6, attack=0.6, release=1.4), s, 0.2 if k == 0 else 0.08)
        for j, m in enumerate(notes[2:]):
            place(keys, fa.piano(hz(m + 12), 2.0, 0.7), s + 0.35 + j * BEAT / 2, 0.05)
    hb = 25.6
    while hb < 28.8:  # soft half-time pulse keeps it moving under the CTA
        place(drums, kick(0.14), hb)
        hb += BEAT * 2

    pad = reverb(fft_filter(pad, hi=3200) * pump, 2.6, 0.3, 2)
    keys = reverb(keys, 2.2, 0.32, 1)
    bass = fft_filter(bass, hi=1000) * pump
    left = pad * 0.95 + keys * 1.1 + drums + bass
    right = pad * 1.05 + keys * 0.9 + drums + bass
    st = np.stack([left, right], axis=1)
    tt_ = np.arange(N) / SR
    st *= (np.minimum(1, tt_ / 0.05) * np.clip((DUR - tt_) / 1.8, 0, 1))[:, None]
    st /= np.max(np.abs(st)) + 1e-9
    fa.write("music.wav", st * 0.85)


def sfx():
    t = tt(0.6)
    sw = fft_filter(rng.normal(0, 1, len(t)), lo=300, hi=3000) * np.sin(np.pi * t / 0.6) ** 2
    fa.write("whoosh.wav", sw / np.max(np.abs(sw)) * 0.45)
    dn = np.zeros(int(SR * 1.4))
    place(dn, fa.bell(hz(84), 1.2, 1.0), 0, 0.3)
    place(dn, fa.bell(hz(91), 1.2, 1.0), 0.1, 0.26)
    fa.write("done.wav", reverb(dn, 1.0, 0.3, 4))
    sh = np.zeros(int(SR * 1.6))
    for i, m in enumerate((84, 88, 91, 95, 96)):
        place(sh, fa.bell(hz(m), 1.1, 1.0), i * 0.05, 0.14)
    fa.write("shimmer.wav", reverb(sh, 1.2, 0.35, 5))


if __name__ == "__main__":
    music()
    sfx()
    print("wrote", sorted(os.listdir(fa.OUT)))
