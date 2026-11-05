"""Score + UI sounds for the PlainweekFamily film (30 s, no voice-over).

Synthesised with numpy (royalty-free). Writes WAVs to public/family/.
Run: python3 scripts/make_family_audio.py

Music map (seconds), 104 bpm in D major:
  0–5    morning: gentle piano arpeggios, warm pad, a little birdsong, a lift
  5–10   problem: muted, pulsing and slightly tense (Bm – G – Em – F#sus)
  10–23  use case: the groove arrives (D – A – Bm – G): soft kick, claps,
         shaker, plucked bass and a bright arpeggio; a bell hook joins at 16.9 s
  23–30  call to action: drums fall away, a wide resolving chord and bells
"""
import os
import wave

import numpy as np

SR = 48000
DUR = 30.0
N = int(SR * DUR)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "family")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(21)
BEAT = 60 / 104
BAR = BEAT * 4


def write(name, x):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    x = np.clip(x, -1, 1)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(SR * d)) / SR


def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if hi:
        g *= 1 / (1 + (f / hi) ** 4)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(X * g, len(x))


def reverb(x, seconds=2.4, mix=0.3, seed=0):
    r = np.random.default_rng(seed)
    n = int(SR * seconds)
    t = np.arange(n) / SR
    ir = fft_filter(r.normal(0, 1, n) * np.exp(-t * 6.9 / seconds), hi=6000)
    ir /= np.sqrt(np.sum(ir**2))
    size = 1 << (len(x) + n - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - mix) * x + mix * wet


def place(buf, sig, start, gain=1.0):
    i = int(start * SR)
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def piano(freq, d=2.0, vel=1.0):
    t = tt(d)
    env = np.exp(-t * 2.8) * np.minimum(1, t / 0.004)
    x = np.sin(2 * np.pi * freq * t) + 0.45 * np.exp(-t * 1.5) * np.sin(4 * np.pi * freq * t) + 0.16 * np.exp(-t * 3) * np.sin(6 * np.pi * freq * t)
    return x * env * vel


def pluck(freq, d=0.45, vel=1.0):
    t = tt(d)
    env = np.exp(-t * 9) * np.minimum(1, t / 0.002)
    x = np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(4 * np.pi * freq * t) * np.exp(-t * 14) + 0.25 * np.sin(6 * np.pi * freq * t) * np.exp(-t * 20)
    return x * env * vel


def bell(freq, d=2.5, vel=1.0):
    t = tt(d)
    env = np.exp(-t * 1.8) * np.minimum(1, t / 0.003)
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 3) + 0.18 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t * 5)
    return x * env * vel


def pad_tone(freq, d, attack=1.0, release=1.6):
    t = tt(d)
    env = np.minimum(1, t / attack) * np.clip((d - t) / release, 0, 1)
    x = np.zeros_like(t)
    for det in (-0.1, 0.0, 0.1):
        ph = 2 * np.pi * freq * 2 ** (det / 12) * t + rng.uniform(0, 6)
        x += np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph)
    return x * env / 3


def kick(gain=1.0):
    k = tt(0.35)
    return (np.sin(2 * np.pi * (50 + 80 * np.exp(-k * 30)) * k) * np.exp(-k * 9) + 0.12 * rng.normal(0, 1, len(k)) * np.exp(-k * 220)) * gain


def clap():
    c = tt(0.3)
    x = np.zeros_like(c)
    for off in (0, 0.011, 0.022):
        n = rng.normal(0, 1, len(c))
        x += np.roll(n * np.exp(-c * 45), int(off * SR))
    return fft_filter(x, lo=900, hi=7000) / 3


def shaker():
    h = tt(0.07)
    return fft_filter(rng.normal(0, 1, len(h)), lo=6000, hi=13000) * np.exp(-h * 60)


def music():
    pad = np.zeros(N)
    keys = np.zeros(N)
    drums = np.zeros(N)
    bass = np.zeros(N)
    pump = np.ones(N)

    # ---- 0–5 s: morning
    morning = [(0.0, [50, 62, 66, 69, 73, 76]), (2.5, [55, 62, 67, 71, 74, 78])]  # Dmaj9, Gmaj9
    for s, notes in morning:
        for k, m in enumerate(notes[:4]):
            place(pad, pad_tone(hz(m), 3.4, attack=1.4), s, 0.24 if k == 0 else 0.12)
        arp = [notes[1], notes[2], notes[3], notes[4], notes[5], notes[4], notes[3], notes[2]]
        for i, m in enumerate(arp):
            place(keys, piano(hz(m + 12), 1.8, 0.55 + 0.25 * (i % 2 == 0)), 0.35 + s + i * BEAT / 2, 0.07)
    for at, f0 in ((0.9, 3400), (1.15, 3900), (3.1, 3600)):  # birdsong
        c = tt(0.16)
        place(keys, np.sin(2 * np.pi * np.cumsum(f0 + 900 * np.sin(np.pi * c / 0.16)) / SR) * np.sin(np.pi * c / 0.16) ** 2, at, 0.025)
    r = tt(1.2)
    place(drums, fft_filter(rng.normal(0, 1, len(r)), lo=500, hi=8000) * (r / 1.2) ** 3 * 0.08, 3.8)

    # ---- 5–10 s: the problem (muted, pulsing)
    prob = [(5.0, [47, 59, 62, 66]), (6.25, [43, 59, 62, 67]), (7.5, [40, 59, 64, 67]), (8.75, [42, 61, 66, 68])]
    for s, notes in prob:
        for k, m in enumerate(notes):
            place(pad, pad_tone(hz(m), 1.9, attack=0.3, release=0.6), s, 0.2 if k == 0 else 0.1)
        for i in range(4):  # staccato pulse
            place(keys, piano(hz(notes[1] + 12), 0.35, 0.7), s + i * BEAT / 2 + BEAT / 4, 0.06)
    t0 = 5.0
    while t0 < 9.9:
        place(drums, kick(0.1), t0)
        place(drums, shaker(), t0 + BEAT / 2, 0.03)
        t0 += BEAT
    r = tt(0.8)
    place(drums, fft_filter(rng.normal(0, 1, len(r)), lo=500, hi=9000) * (r / 0.8) ** 3 * 0.14, 9.2)

    # ---- 10–23 s: the groove (D – A – Bm – G)
    prog_ = [[38, 57, 62, 66, 69], [45, 57, 61, 64, 69], [47, 59, 62, 66, 71], [43, 59, 62, 67, 71]]
    start = 10.0
    b = 0
    while start + b * BAR < 23.0:
        s = start + b * BAR
        chord = prog_[b % 4]
        for k, m in enumerate(chord[1:]):
            place(pad, pad_tone(hz(m), BAR + 0.6, attack=0.25, release=0.5), s, 0.16)
        for beat in range(4):
            bt = s + beat * BEAT
            if bt >= 23.0:
                break
            place(drums, kick(0.32), bt)
            i0 = int(bt * SR)
            seg = tt(0.3)
            pump[i0 : i0 + len(seg)] = np.minimum(pump[i0 : i0 + len(seg)], 1 - 0.35 * np.exp(-seg * 10))
            if beat % 2 == 1:
                place(drums, reverb(clap(), 0.6, 0.25, 3), bt, 0.16)
            for e in range(2):
                place(drums, shaker(), bt + e * BEAT / 2, 0.035 if e else 0.025)
            # bass: root eighths with an octave pop
            for e in range(2):
                m = chord[0] + (12 if (beat == 3 and e == 1) else 0)
                place(bass, pluck(hz(m), 0.32, 1.0), bt + e * BEAT / 2, 0.22)
        # bright 16th arpeggio
        pattern = [1, 2, 3, 4, 3, 2, 3, 4]
        for i in range(16):
            when = s + i * BEAT / 4
            if when >= 23.0:
                break
            m = chord[pattern[i % 8]] + 12
            place(keys, pluck(hz(m), 0.3, 0.6 + 0.4 * (i % 4 == 0)), when, 0.055)
        b += 1
    # bell hook from 16.9 s
    hook = [(0, 81), (0.75, 78), (1.5, 76), (2.5, 78), (3, 81), (3.75, 83), (4.5, 81), (6, 78), (6.75, 76), (7.5, 74)]
    hs = 10.0 + 3 * BAR
    for rep in range(2):
        for off, m in hook:
            when = hs + rep * 2 * BAR + off * BEAT
            if when < 22.9:
                place(keys, bell(hz(m), 1.6, 0.8), when, 0.06)
    r = tt(0.9)
    place(drums, fft_filter(rng.normal(0, 1, len(r)), lo=600, hi=9000) * (r / 0.9) ** 3 * 0.12, 22.1)

    # ---- 23–30 s: resolve
    final = [38, 50, 57, 62, 64, 66, 69, 73]  # Dmaj9 wide
    for k, m in enumerate(final):
        place(pad, pad_tone(hz(m), 7.4, attack=0.8, release=3.5), 23.0, 0.36 if k == 0 else 0.15)
    sub = tt(2.2)
    place(drums, np.sin(2 * np.pi * (38 + 30 * np.exp(-sub * 6)) * sub) * np.exp(-sub * 1.8), 23.0, 0.35)
    for i, m in enumerate((74, 78, 81, 85, 86)):
        place(keys, bell(hz(m), 2.8, 0.8), 23.05 + i * 0.09, 0.08)
    for i, m in enumerate((62, 66, 69, 74, 78)):
        place(keys, piano(hz(m), 2.8, 0.7), 25.8 + i * 0.12, 0.07)
    place(keys, bell(hz(86), 3.0, 0.7), 26.6, 0.06)

    pad = fft_filter(pad, hi=3000) * pump
    keys = reverb(keys * np.concatenate([np.ones(int(SR * 10)), pump[int(SR * 10):]]), 2.6, 0.35, 1)
    bass = fft_filter(bass, hi=900) * pump
    pad = reverb(pad, 2.8, 0.3, 2)
    left = pad * 0.95 + keys * 1.1 + drums + bass
    right = pad * 1.05 + keys * 0.9 + drums + bass
    st = np.stack([left, right], axis=1)
    t = np.arange(N) / SR
    st *= (np.minimum(1, t / 0.3) * np.clip((DUR - t) / 2.2, 0, 1))[:, None]
    st /= np.max(np.abs(st)) + 1e-9
    write("music.wav", st * 0.85)


def sfx():
    t = tt(0.35)
    f = 700 + 500 * np.minimum(1, t / 0.12)
    write("sync.wav", reverb(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10) * np.minimum(1, t / 0.005) * 0.45, 0.6, 0.25, 4))

    t = tt(0.4)
    tick = (np.sin(2 * np.pi * 1568 * t) * np.exp(-t * 22) + 0.55 * np.sin(2 * np.pi * 2349.3 * t) * np.exp(-t * 30)) * np.minimum(1, t / 0.001)
    write("tick.wav", reverb(tick * 0.45, 0.6, 0.2, 5))

    st = np.zeros(int(SR * 1.2))
    for i, m in enumerate((86, 90, 93)):
        place(st, bell(hz(m), 0.9, 1.0), i * 0.09, 0.22)
    write("stars.wav", reverb(st, 1.0, 0.3, 6))

    ap = np.zeros(int(SR * 1.4))
    for i, m in enumerate((74, 78, 81)):
        place(ap, bell(hz(m), 1.2, 1.0), i * 0.06, 0.2)
    write("approve.wav", reverb(ap, 1.0, 0.3, 7))

    sh = np.zeros(int(SR * 1.6))
    for i, m in enumerate((86, 90, 93, 97, 98)):
        place(sh, bell(hz(m), 1.1, 1.0), i * 0.05, 0.14)
    write("shimmer.wav", reverb(sh, 1.2, 0.35, 8))


if __name__ == "__main__":
    music()
    sfx()
    print("wrote", sorted(os.listdir(OUT)))
