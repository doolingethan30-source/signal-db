"""Soundtrack + UI sound effects for the PlainweekLaunch film (no voice-over).

All sounds are synthesised here with numpy (royalty-free). Writes WAVs to
public/launch/. Run: python3 scripts/make_launch_audio.py

Music map (seconds):
  0.0–4.1   tension: low drone, dissonant shimmer, a ticking clock and a
            reverse swell that cuts out as the chaos collapses
  4.1       release: soft sub drop + bright bell chord
  4.1–24.6  calm ambient pad in F with a gentle piano motif and a soft pulse
  24.6–27.3 riser through the theme changes
  27.3–30   hero chord with a long tail
"""
import os
import wave

import numpy as np

SR = 48000
DUR = 30.0
N = int(SR * DUR)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "launch")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(11)


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
    """Zero-phase band filter with smooth roll-offs (FFT domain)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if hi:
        g *= 1 / (1 + (f / hi) ** 4)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(X * g, len(x))


def reverb(x, seconds=2.6, mix=0.35, seed=0):
    r = np.random.default_rng(seed)
    n = int(SR * seconds)
    t = np.arange(n) / SR
    ir = r.normal(0, 1, n) * np.exp(-t * 6.9 / seconds)
    ir = fft_filter(ir, hi=5000)
    ir /= np.sqrt(np.sum(ir**2))
    L = len(x) + n
    size = 1 << (L - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - mix) * x + mix * wet


def place(buf, sig, start, gain=1.0):
    i = int(start * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


# ---------------------------------------------------------------- music
def pad_tone(freq, d, attack=1.6, release=2.0):
    t = tt(d)
    env = np.minimum(1, t / attack) * np.clip((d - t) / release, 0, 1)
    x = np.zeros_like(t)
    for det in (-0.12, 0.0, 0.11):
        f = freq * 2 ** (det / 12)
        ph = 2 * np.pi * f * t + rng.uniform(0, 6)
        x += np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    return x * env / 3


def piano(freq, d=2.4, vel=1.0):
    t = tt(d)
    env = np.exp(-t * 2.6) * np.minimum(1, t / 0.004)
    x = (
        np.sin(2 * np.pi * freq * t)
        + 0.45 * np.exp(-t * 1.5) * np.sin(4 * np.pi * freq * t)
        + 0.18 * np.exp(-t * 3) * np.sin(6 * np.pi * freq * t)
        + 0.05 * np.exp(-t * 6) * np.sin(8 * np.pi * freq * 1.002 * t)
    )
    return x * env * vel


def bell(freq, d=3.0, vel=1.0):
    t = tt(d)
    env = np.exp(-t * 1.6) * np.minimum(1, t / 0.003)
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 3) + 0.2 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t * 5)
    return x * env * vel


def music():
    pad = np.zeros(N)
    keys = np.zeros(N)
    fx = np.zeros(N)

    # --- tension 0–4.1 s
    t = tt(4.25)
    drone = np.zeros_like(t)
    for f, a in ((55, 0.5), (55.4, 0.4), (110.3, 0.25), (82.4, 0.18)):
        for h in range(1, 7):
            drone += a / h * np.sin(2 * np.pi * f * h * t + h)
    drone *= np.minimum(1, t / 1.2) * (0.6 + 0.4 * t / 4.25)
    drone = fft_filter(drone, hi=600)
    place(pad, drone / np.max(np.abs(drone)) * 0.28, 0)
    cluster = sum(np.sin(2 * np.pi * hz(m) * t + m) for m in (76, 77, 78, 83))
    cluster *= (t / 4.25) ** 2 * 0.05 * (1 + 0.3 * np.sin(2 * np.pi * 5.5 * t))
    place(pad, cluster, 0)
    # ticking clock, accelerating
    tick_t, step = 0.25, 0.5
    while tick_t < 4.0:
        c = tt(0.03)
        click = rng.normal(0, 1, len(c)) * np.exp(-c * 300) + np.sin(2 * np.pi * 2600 * c) * np.exp(-c * 200)
        place(fx, click, tick_t, 0.05 + 0.05 * tick_t / 4)
        tick_t += step
        step = max(0.2, step * 0.93)
    # reverse swell into the release
    sw = tt(1.2)
    noise = fft_filter(rng.normal(0, 1, len(sw)), lo=300, hi=6000)
    place(fx, noise / np.max(np.abs(noise)) * (sw / 1.2) ** 3 * 0.22, 2.9)

    # --- release at 4.1 s
    rel = 4.1
    b = tt(2.5)
    sub = np.sin(2 * np.pi * (38 + 30 * np.exp(-b * 6)) * b) * np.exp(-b * 1.6) * np.minimum(1, b / 0.01)
    place(fx, sub, rel, 0.5)
    for i, m in enumerate((77, 81, 84, 88, 91)):
        place(keys, bell(hz(m), 3.5, 0.5), rel + 0.04 * i, 0.16)

    # --- calm progression
    chords = [
        (4.1, 9.0, [41, 53, 57, 60, 64, 67]),  # Fmaj9
        (9.0, 13.6, [38, 50, 57, 60, 64, 65]),  # Dm9
        (13.6, 18.4, [46, 53, 57, 62, 65, 69]),  # Bbmaj9
        (18.4, 22.6, [48, 55, 60, 62, 64, 67]),  # Cadd9
        (22.6, 24.6, [45, 52, 57, 60, 64, 67]),  # Am7(9)
        (24.6, 27.3, [46, 53, 58, 62, 64, 69]),  # Bbmaj7#11
        (27.3, 30.0, [41, 53, 57, 60, 64, 67, 72]),  # Fmaj9 (hero)
    ]
    for s, e, notes in chords:
        d = e - s + 2.2
        for k, m in enumerate(notes):
            amp = 0.42 if k == 0 else 0.22
            place(pad, pad_tone(hz(m), d, attack=1.2 if s > 4.2 else 0.6), s - 0.2, amp)

    # piano motif (85 bpm eighths, sparse) from 5.2 s to 24.6 s
    beat = 60 / 85
    motif = [(0, 72), (1.5, 76), (2, 79), (3, 77), (4, 76), (5.5, 72), (6, 74), (7, 76)]
    shift = {0: 0, 1: -3, 2: -2, 3: 0, 4: -3, 5: -2, 6: 0}
    bar = 0
    s = 5.2
    while s < 24.0:
        for off, m in motif:
            when = s + off * beat
            if when < 24.4:
                place(keys, piano(hz(m + shift[bar % 7]), 2.2, 0.6 + 0.4 * rng.random()), when, 0.075)
        s += 8 * beat
        bar += 1

    # soft pulse, 8 s – 24.4 s
    p = 8.0
    while p < 24.4:
        k = tt(0.35)
        thump = np.sin(2 * np.pi * (52 + 40 * np.exp(-k * 30)) * k) * np.exp(-k * 9)
        place(fx, thump, p, 0.09)
        p += beat * 2

    # riser into the hero
    r = tt(2.7)
    rn = fft_filter(rng.normal(0, 1, len(r)), lo=800, hi=9000)
    place(fx, rn / np.max(np.abs(rn)) * (r / 2.7) ** 2.5 * 0.12, 24.6)
    for i, m in enumerate((84, 88, 91, 96, 100)):
        place(keys, bell(hz(m), 3.2, 0.7), 27.3 + 0.07 * i, 0.12)
    place(fx, sub, 27.3, 0.35)

    pad = fft_filter(pad, hi=2400)
    keys = reverb(keys, 3.2, 0.45, 1)
    pad = reverb(pad, 3.0, 0.3, 2)
    left = pad * 0.95 + keys * 1.05 + fx
    right = pad * 1.05 + keys * 0.95 + fx
    st = np.stack([left, right], axis=1)
    t = np.arange(N) / SR
    st *= (np.minimum(1, t / 0.4) * np.clip((DUR - t) / 2.2, 0, 1))[:, None]
    st /= np.max(np.abs(st)) + 1e-9
    write("music.wav", st * 0.8)


# ---------------------------------------------------------------- sfx
def sfx():
    t = tt(0.5)
    write("ping.wav", reverb((np.sin(2 * np.pi * 1318.5 * t) * np.exp(-t * 14) + 0.6 * np.sin(2 * np.pi * 1975.5 * t) * np.exp(-t * 18) * (t > 0.07)) * 0.5, 0.8, 0.25, 3))

    t = tt(0.9)
    sw = fft_filter(rng.normal(0, 1, len(t)), lo=250, hi=2400) * np.sin(np.pi * t / 0.9) ** 2
    write("swoosh.wav", sw / np.max(np.abs(sw)) * 0.5)

    t = tt(0.12)
    tap = np.sin(2 * np.pi * (520 + 380 * np.exp(-t * 45)) * t) * np.exp(-t * 55) * np.minimum(1, t / 0.001)
    write("tap.wav", tap * 0.6)

    t = tt(0.05)
    key = fft_filter(rng.normal(0, 1, len(t)), lo=1500, hi=7000) * np.exp(-t * 160)
    write("key.wav", key / np.max(np.abs(key)) * 0.35)

    t = tt(0.2)
    f = 500 + 600 * np.exp(-t * 28)
    write("pop.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26) * 0.5)

    t = tt(0.4)
    tick = (np.sin(2 * np.pi * 1568 * t) * np.exp(-t * 22) + 0.55 * np.sin(2 * np.pi * 2349.3 * t) * np.exp(-t * 30)) * np.minimum(1, t / 0.001)
    write("tick.wav", reverb(tick * 0.45, 0.6, 0.2, 4))

    t = tt(0.25)
    f = 380 + 300 * t / 0.25
    write("lift.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.25) * 0.35)

    t = tt(0.3)
    drop = np.sin(2 * np.pi * (140 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 18) + 0.3 * rng.normal(0, 1, len(t)) * np.exp(-t * 120)
    write("drop.wav", drop * 0.5)

    sh = np.zeros(int(SR * 1.4))
    for i, m in enumerate((84, 88, 91, 95, 98, 103)):
        place(sh, bell(hz(m), 1.0, 1.0), i * 0.045, 0.16)
    write("shimmer.wav", reverb(sh, 1.2, 0.35, 5))

    dg = np.zeros(int(SR * 1.0))
    place(dg, bell(hz(88), 0.9, 1.0), 0, 0.35)
    place(dg, bell(hz(95), 0.9, 1.0), 0.12, 0.3)
    write("ding.wav", reverb(dg, 0.8, 0.25, 6))

    t = tt(0.4)
    write("thud.wav", np.sin(2 * np.pi * (90 + 40 * np.exp(-t * 20)) * t) * np.exp(-t * 12) * 0.6)


if __name__ == "__main__":
    music()
    sfx()
    print("wrote", sorted(os.listdir(OUT)))
