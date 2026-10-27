"""Generate the ambient music bed and soft UI sound effects for the promo.

Everything is synthesised from scratch (no samples), so the audio is
royalty-free. Run: python3 scripts/make_audio.py  (needs numpy)
"""
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public")


def write_wav(name, stereo):
    stereo = np.clip(stereo, -1, 1)
    data = (stereo * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lowpass(x, cutoff):
    # one-pole low-pass, applied twice for a gentler 12 dB/oct slope
    a = np.exp(-2 * np.pi * cutoff / SR)
    for _ in range(2):
        y = np.empty_like(x)
        acc = 0.0
        for i in range(len(x)):
            acc = (1 - a) * x[i] + a * acc
            y[i] = acc
        x = y
    return x


def reverb(x, mix=0.35):
    # small Schroeder-style comb bank, cheap but smooth on pads
    out = np.zeros(len(x) + SR * 3)
    out[: len(x)] += x
    wet = np.zeros_like(out)
    for delay_ms, fb in [(29.7, 0.82), (37.1, 0.8), (41.1, 0.78), (43.7, 0.76)]:
        d = int(SR * delay_ms / 1000)
        buf = np.zeros_like(out)
        buf[: len(x)] = x
        for start in range(d, len(out), d):
            end = min(start + d, len(out))
            buf[start:end] += fb * buf[start - d : end - d]
        wet += buf
    wet /= 4
    return (1 - mix) * out + mix * wet * 0.5


def pad(duration):
    # Fmaj9 -> Am7 -> Dm9 -> Bbmaj7(#11) -> Fmaj9: warm, unresolved, calm
    chords = [
        [53, 60, 64, 67, 72],
        [57, 60, 64, 67, 71],
        [50, 57, 60, 64, 65],
        [46, 57, 62, 65, 69],
        [53, 60, 64, 67, 69],
    ]
    seg = duration / (len(chords) - 0.5)
    n = int(SR * duration)
    t = np.arange(n) / SR
    left = np.zeros(n)
    right = np.zeros(n)
    for ci, chord in enumerate(chords):
        start = ci * seg
        length = seg + 2.5
        s0 = int(start * SR)
        s1 = min(n, int((start + length) * SR))
        tt = t[s0:s1] - start
        env = np.minimum(1, tt / 1.8) * np.clip((length - tt) / 2.2, 0, 1)
        for k, note in enumerate(chord):
            f = midi(note)
            for det, pan in [(-0.11, 0.25), (0.13, 0.75)]:
                ff = f * 2 ** (det / 12 * 0.5)
                ph = 2 * np.pi * ff * tt + k
                tone = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
                tone *= env * (0.55 if k == 0 else 0.32)
                left[s0:s1] += tone * (1 - pan)
                right[s0:s1] += tone * pan
    # gentle breathing movement
    lfo = 0.85 + 0.15 * np.sin(2 * np.pi * 0.12 * t)
    left *= lfo
    right *= lfo
    return left, right


def bells(duration):
    # sparse, soft glassy arpeggio notes on top of the pad
    n = int(SR * duration)
    left = np.zeros(n)
    right = np.zeros(n)
    pattern = [72, 76, 79, 84, 81, 76, 77, 81, 74, 77, 81, 79, 77, 72, 76, 79]
    step = 1.6
    rng = np.random.default_rng(7)
    for i, note in enumerate(pattern):
        start = 0.8 + i * step + rng.uniform(-0.05, 0.05)
        if start > duration - 1.5:
            break
        s0 = int(start * SR)
        length = int(2.4 * SR)
        s1 = min(n, s0 + length)
        tt = np.arange(s1 - s0) / SR
        f = midi(note)
        env = np.exp(-tt * 2.2) * np.minimum(1, tt / 0.01)
        tone = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 2.01 * tt) * np.exp(-tt * 4)) * env * 0.16
        pan = 0.3 + 0.4 * (i % 3) / 2
        left[s0:s1] += tone * (1 - pan)
        right[s0:s1] += tone * pan
    return left, right


def music(duration=30.0):
    pl, pr = pad(duration)
    bl, br = bells(duration)
    left = lowpass(pl, 1800) + bl
    right = lowpass(pr, 1800) + br
    left = reverb(left, 0.45)[: int(SR * duration)]
    right = reverb(right, 0.45)[: int(SR * duration)]
    st = np.stack([left, right], axis=1)
    st /= np.max(np.abs(st)) + 1e-9
    st *= 0.7
    t = np.arange(len(st)) / SR
    fade = np.minimum(1, t / 1.5) * np.clip((duration - t) / 2.5, 0, 1)
    st *= fade[:, None]
    write_wav("music.wav", st)


def tick():
    # soft, rounded "tick" for checking off a task
    d = 0.25
    t = np.arange(int(SR * d)) / SR
    tone = np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 28) + 0.5 * np.sin(2 * np.pi * 1980 * t) * np.exp(-t * 40)
    click = np.random.default_rng(1).normal(0, 1, len(t)) * np.exp(-t * 400) * 0.15
    s = (tone + click) * 0.45
    write_wav("tick.wav", np.stack([s, s], axis=1))


def whoosh():
    # filtered-noise swell for scene transitions
    d = 0.9
    n = int(SR * d)
    t = np.arange(n) / SR
    noise = np.random.default_rng(3).normal(0, 1, n)
    env = np.sin(np.pi * t / d) ** 2
    s = lowpass(noise, 900) * env
    s /= np.max(np.abs(s)) + 1e-9
    s *= 0.35
    write_wav("whoosh.wav", np.stack([s * 0.9, s], axis=1))


def pop():
    # light bubbly pop for UI elements appearing
    d = 0.18
    t = np.arange(int(SR * d)) / SR
    f = 600 + 500 * np.exp(-t * 30)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * 0.4
    write_wav("pop.wav", np.stack([s, s], axis=1))


if __name__ == "__main__":
    music()
    tick()
    whoosh()
    pop()
    print("audio written to", os.path.abspath(OUT))
