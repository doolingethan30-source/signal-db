"""
Procedurally synthesises the soundtrack for "The Little Seed of Faith":
a gentle, joyful mini-orchestra (strings pad, pizzicato bass, harp arpeggios,
celesta + flute melody) with birdsong and soft story sound-effects.

Exactly 30.000 s, 48 kHz stereo. Everything (note tails, reverb, birds) is
wrapped circularly so the track loops seamlessly with the video.
"""
import numpy as np
import wave, os

SR = 48000
DUR = 30.0
N = int(SR * DUR)
FPS = 30
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)


def add(sig, start_s, pan=0.0, gain=1.0):
    """Add a mono signal at start time, wrapping around the loop point."""
    start = int(round(start_s * SR)) % N
    idx = (np.arange(len(sig)) + start) % N
    gl = np.cos((pan + 1) * np.pi / 4) * gain
    gr = np.sin((pan + 1) * np.pi / 4) * gain
    np.add.at(L, idx, sig * gl)
    np.add.at(R, idx, sig * gr)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def adsr(n, a, d, s, r, sustain_len):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    hold = max(int(sustain_len * SR) - a - d, 0)
    env = np.concatenate([
        np.linspace(0, 1, max(a, 1), endpoint=False),
        np.linspace(1, s, max(d, 1), endpoint=False),
        np.full(hold, s),
        np.linspace(s, 0, max(r, 1)),
    ])
    return env[:n] if len(env) >= n else np.pad(env, (0, n - len(env)))


# ---------------------------------------------------------------- instruments
def strings(freq, length, vel=1.0):
    n = int((length + 1.2) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.12, 0.0, 0.11):  # ensemble detune (in semitones/10)
        f = freq * 2 ** (det / 12)
        vib = 1 + 0.0035 * np.sin(2 * np.pi * (5.1 + det) * t + rng.uniform(0, 6))
        ph = 2 * np.pi * np.cumsum(f * vib) / SR
        for h in range(1, 9):  # soft saw, rolled off
            out += np.sin(h * ph + rng.uniform(0, 6)) / (h ** 1.6)
    env = adsr(n, 0.45, 0.3, 0.85, 1.1, length)
    return out * env * vel / 6.0


def pizz(freq, vel=1.0):
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * freq * h * t) * np.exp(-t * (5 + 3 * h)) / h for h in range(1, 6))
    s *= np.minimum(t / 0.004, 1)
    return s * vel


def harp(freq, vel=1.0):
    n = int(2.0 * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * freq * h * t + h) * np.exp(-t * (2.2 + 1.6 * h)) / (h ** 1.3) for h in range(1, 7))
    s *= np.minimum(t / 0.003, 1)
    return s * vel


def celesta(freq, vel=1.0):
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * freq * t) * np.exp(-t * 2.4)
         + 0.35 * np.sin(2 * np.pi * freq * 4.0 * t) * np.exp(-t * 7)
         + 0.12 * np.sin(2 * np.pi * freq * 9.8 * t) * np.exp(-t * 14))
    s *= np.minimum(t / 0.002, 1)
    return s * vel


def flute(freq, length, vel=1.0):
    n = int((length + 0.3) * SR)
    t = np.arange(n) / SR
    vib_depth = 0.006 * np.minimum(t / 0.35, 1)
    ph = 2 * np.pi * np.cumsum(freq * (1 + vib_depth * np.sin(2 * np.pi * 5.3 * t))) / SR
    s = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    breath = rng.normal(0, 1, n)
    breath = np.convolve(breath, np.ones(24) / 24, mode="same") * 0.08
    env = adsr(n, 0.07, 0.1, 0.8, 0.25, length)
    return (s + breath) * env * vel


# ------------------------------------------------------------------- harmony
BPM = 96
BEAT = 60 / BPM          # 0.625 s
BAR = 4 * BEAT           # 2.5 s  -> 12 bars == 30 s
C, D, E, F, G, A, B = 60, 62, 64, 65, 67, 69, 71
chords = [  # (bass root, chord tones)
    (C - 24, [C, E, G]), (G - 24, [B - 12, D, G]), (A - 24, [C, E, A]), (F - 24, [C, F, A]),
    (C - 24, [C, E, G]), (F - 24, [C, F, A]), (D - 24, [D, F, A]), (G - 24, [D, G, B]),
    (F - 24, [C, F, A]), (G - 24, [D, G, B]), (A - 24, [C, E, A]), (G - 24, [D, F, G + 0]),
]

for i, (root, tones) in enumerate(chords):
    t0 = i * BAR
    for m in tones:
        add(strings(midi(m - 12), BAR + 0.15, 0.10), t0, pan=rng.uniform(-0.5, 0.5))
    add(strings(midi(root + 12), BAR + 0.15, 0.07), t0, pan=0.0)
    # pizzicato bass: beats 1 and 3, a passing fifth on 4&
    add(pizz(midi(root), 0.55), t0, pan=-0.15)
    add(pizz(midi(root + 7), 0.40), t0 + 2 * BEAT, pan=-0.15)
    add(pizz(midi(root + 12), 0.22), t0 + 3.5 * BEAT, pan=-0.1)
    # harp arpeggio in eighths (from bar 2 on, as the story warms up)
    if i >= 1:
        arp = [tones[0], tones[1], tones[2], tones[0] + 12, tones[2], tones[1], tones[2], tones[0] + 12]
        for k, m in enumerate(arp):
            add(harp(midi(m), 0.10), t0 + k * BEAT / 2, pan=0.35)

# Melody (celesta for the first half, flute joins for the growing/sharing part)
# (bar, beat, midi, beats)
melody = [
    (0, 0, E + 12, 1), (0, 1, G + 12, 1), (0, 2, C + 24, 2),
    (1, 0, B + 12, 1), (1, 1, A + 12, 1), (1, 2, G + 12, 2),
    (2, 0, A + 12, 1), (2, 1, C + 24, 1), (2, 2, E + 24, 1.5), (2, 3.5, D + 24, 0.5),
    (3, 0, C + 24, 2), (3, 2, A + 12, 2),
    (4, 0, G + 12, 1), (4, 1, E + 12, 1), (4, 2, G + 12, 1), (4, 3, C + 24, 1),
    (5, 0, A + 12, 1.5), (5, 1.5, G + 12, 0.5), (5, 2, F + 12, 2),
    (6, 0, F + 12, 1), (6, 1, A + 12, 1), (6, 2, D + 24, 2),
    (7, 0, D + 24, 1), (7, 1, C + 24, 1), (7, 2, B + 12, 2),
    (8, 0, C + 24, 1), (8, 1, A + 12, 1), (8, 2, F + 12, 1), (8, 3, A + 12, 1),
    (9, 0, B + 12, 1), (9, 1, D + 24, 1), (9, 2, G + 24, 2),
    (10, 0, E + 24, 1.5), (10, 1.5, D + 24, 0.5), (10, 2, C + 24, 2),
    (11, 0, B + 12, 1), (11, 1, A + 12, 1), (11, 2, G + 12, 2),
]
for bar, beat, m, beats in melody:
    t = bar * BAR + beat * BEAT
    add(celesta(midi(m), 0.22), t, pan=0.2)
    if 5 <= bar <= 11:
        add(flute(midi(m), beats * BEAT * 0.95, 0.11), t, pan=-0.25)

# --------------------------------------------------------------- birdsong
def chirp_phrase():
    notes = rng.integers(3, 7)
    parts = []
    base = rng.uniform(2600, 4200)
    for _ in range(notes):
        d = rng.uniform(0.04, 0.09)
        n = int(d * SR)
        t = np.arange(n) / SR
        f0 = base * rng.uniform(0.85, 1.2)
        f1 = f0 * rng.uniform(0.7, 1.45)
        f = np.linspace(f0, f1, n) * (1 + 0.04 * np.sin(2 * np.pi * 38 * t))
        ph = 2 * np.pi * np.cumsum(f) / SR
        env = np.sin(np.pi * np.arange(n) / n) ** 2
        parts.append(np.sin(ph) * env)
        parts.append(np.zeros(int(rng.uniform(0.02, 0.07) * SR)))
    return np.concatenate(parts)

t = 0.3
while t < DUR:
    add(chirp_phrase(), t, pan=rng.uniform(-0.85, 0.85), gain=rng.uniform(0.035, 0.07))
    t += rng.uniform(1.0, 2.6)

# ------------------------------------------------------- story sound effects
def sparkle(n_notes=5, base=C + 24, gain=0.12):
    out = []
    scale = [0, 4, 7, 12, 16, 19, 24]
    for k in range(n_notes):
        out.append((k * 0.06, celesta(midi(base + scale[k % len(scale)]), gain)))
    return out

def at_frame(f):
    return f / FPS

for dt, s in sparkle(5):            # Finn spots / lifts the seed
    add(s, at_frame(45) + dt, pan=-0.3)
for dt, s in sparkle(6, C + 24, 0.1):
    add(s, at_frame(104) + dt, pan=-0.2)

def thump(gain=0.35):
    n = int(0.25 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (140 * np.exp(-t * 12) + 60) * t) * np.exp(-t * 18) * gain

for f in (172, 180, 188, 208, 216, 224):   # digging / patting soil
    add(thump(0.22), at_frame(f), pan=0.1)

def droplet(gain=0.08):
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = 900 + 1400 * (t / 0.12)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40) * gain

for k in range(14):                          # watering
    add(droplet(rng.uniform(0.05, 0.09)), at_frame(282 + k * 3.4) + rng.uniform(0, 0.03), pan=0.15)

def pop(freq=520, gain=0.18):
    n = int(0.18 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(freq * (1 + 1.4 * t / 0.18)) / SR) * np.exp(-t * 26) * gain

add(pop(600, 0.2), at_frame(410))            # sprout!
for dt, s in sparkle(5, G + 12, 0.1):
    add(s, at_frame(412) + dt, pan=0.0)

# growth: rising harp glissando
gl = [C, D, E, G, A, C + 12, D + 12, E + 12, G + 12, A + 12, C + 24, D + 24, E + 24, G + 24]
for k, m in enumerate(gl):
    add(harp(midi(m), 0.13), at_frame(458) + k * 0.075, pan=-0.4 + k * 0.06)
for k in range(9):                            # canopy & apple pops
    add(pop(480 + 40 * k, 0.12), at_frame(495 + k * 7))
for dt, s in sparkle(7, C + 24, 0.1):        # apples ready
    add(s, at_frame(552) + dt)
for f in (608, 616, 624):                     # apples drop into paws
    add(pop(700, 0.1), at_frame(f))
for dt, s in sparkle(6, E + 24, 0.08):       # sharing
    add(s, at_frame(668) + dt, pan=0.2)
for dt, s in sparkle(7, C + 24, 0.09):       # ending text
    add(s, at_frame(714) + dt)

# ----------------------------------------------------------------- reverb
def circular_reverb(x, seconds=2.2, mix=0.28):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.normal(0, 1, n) * np.exp(-t * 6.9 / seconds)
    ir = np.convolve(ir, np.ones(6) / 6, mode="same")  # soften highs
    ir[:int(0.012 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    irp = np.zeros(N); irp[:n] = ir
    wet = np.fft.irfft(np.fft.rfft(x) * np.fft.rfft(irp), N)   # circular -> seamless
    return x * (1 - mix) + wet * mix * 2.2

L = circular_reverb(L)
R = circular_reverb(R)

# gentle master: normalise, soft clip
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.9, R / peak * 0.9
L, R = np.tanh(L * 1.1) / np.tanh(1.1), np.tanh(R * 1.1) / np.tanh(1.1)
L *= 0.89; R *= 0.89

out = np.stack([L, R], axis=1)
pcm = (out * 32767).astype("<i2")
path = os.path.join(os.path.dirname(__file__), "..", "public", "music.wav")
with wave.open(path, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", os.path.abspath(path), f"{N / SR:.3f}s")
