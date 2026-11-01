"""Build the 20 s soundtrack entirely with ffmpeg (no samples, no voice-over).

- calm lo-fi bed: soft piano arpeggios over a warm pad, low-passed, with a little
  tape wobble, room echo and a whisper of vinyl-style noise
- subtle UI sounds at the tap/tick times logged by scripts/record.js
- a gentle chime on the end card, then a fade out

Usage: python3 scripts/make_audio.py out/rec/timeline.json out/audio.m4a
"""
import json
import subprocess
import sys

TOTAL = 20.0
BPM = 72
BEAT = 60 / BPM
BAR = BEAT * 4

timeline = json.load(open(sys.argv[1]))
out = sys.argv[2]


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# Fmaj9 - Am7 - Dm9 - Bbmaj7 - Fmaj9 - Bbmaj9 (resolves under the end card)
CHORDS = [
    [41, 57, 60, 64, 67],
    [45, 57, 60, 64, 67],
    [38, 57, 60, 64, 65],
    [46, 57, 62, 65, 69],
    [41, 57, 60, 64, 67],
    [46, 57, 60, 65, 69],
]
# arpeggio pattern (beat offset, chord tone index, octave shift, velocity)
PATTERN = [(0, 1, 12, 0.9), (1, 3, 12, 0.6), (1.5, 4, 12, 0.55), (2, 2, 12, 0.7), (3, 3, 12, 0.5), (3.5, 4, 12, 0.45)]

inputs = []  # (lavfi source, delay seconds, gain)


def piano(freq, start, vel, dur=2.6):
    expr = (
        f"(1-exp(-300*t))*exp(-2.4*t)*(sin(2*PI*{freq:.3f}*t)"
        f"+0.42*exp(-1.5*t)*sin(4*PI*{freq:.3f}*t)"
        f"+0.16*exp(-3*t)*sin(6*PI*{freq:.3f}*t)"
        f"+0.05*exp(-5*t)*sin(8*PI*{freq:.3f}*t))"
    )
    inputs.append((f"aevalsrc='{expr}':s=48000:d={dur}", start, 0.16 * vel))


def pad(chord, start, dur):
    parts = []
    for i, m in enumerate(chord):
        f = hz(m)
        amp = 0.5 if i == 0 else 0.3
        parts.append(f"{amp}*sin(2*PI*{f * 0.998:.3f}*t)+{amp}*sin(2*PI*{f * 1.002:.3f}*t+1)")
    expr = "+".join(parts)
    src = f"aevalsrc='{expr}':s=48000:d={dur:.3f},afade=t=in:d=1.4,afade=t=out:st={dur - 1.8:.3f}:d=1.8"
    inputs.append((src, start, 0.045))


for b, chord in enumerate(CHORDS):
    start = b * BAR
    if start >= TOTAL:
        break
    pad(chord, max(0, start - 0.3), min(BAR + 1.8, TOTAL - start + 0.3))
    for beat, tone, octave, vel in PATTERN:
        t = start + beat * BEAT
        if t < TOTAL - 1.2:
            piano(hz(chord[tone] + octave), t, vel)
    piano(hz(chord[0] + 12), start, 0.5, 3.2)  # soft bass note

# UI sounds
TAP = "aevalsrc='(1-exp(-900*t))*exp(-55*t)*sin(2*PI*(520+380*exp(-45*t))*t)':s=48000:d=0.18"
TICK = (
    "aevalsrc='(1-exp(-900*t))*(exp(-22*t)*sin(2*PI*1568*t)+0.55*exp(-30*t)*sin(2*PI*2349.3*t))':s=48000:d=0.4"
)
GLASS = (
    "aevalsrc='(1-exp(-400*t))*exp(-3.2*t)*(sin(2*PI*1046.5*t)+0.6*sin(2*PI*1568*t)+0.4*sin(2*PI*2093*t))':s=48000:d=1.6"
)
for ev in timeline["events"]:
    if ev["kind"] == "tap":
        inputs.append((TAP, ev["t"], 0.15))
    elif ev["kind"] == "tick":
        inputs.append((TAP, ev["t"], 0.1))
        inputs.append((TICK, ev["t"] + 0.06, 0.09))
    elif ev["kind"] == "glass":
        inputs.append((TAP, ev["t"], 0.14))
        inputs.append((GLASS, ev["t"] + 0.08, 0.07))
# end-card chime
for i, m in enumerate([72, 76, 79, 84]):
    piano(hz(m), 18.3 + i * 0.09, 0.8, 1.7)

cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"]
for src, _, _ in inputs:
    cmd += ["-f", "lavfi", "-i", src]
noise_idx = len(inputs)
cmd += ["-f", "lavfi", "-i", f"anoisesrc=color=pink:amplitude=0.006:sample_rate=48000:d={TOTAL}"]

graph = []
labels = []
for i, (_, delay, gain) in enumerate(inputs):
    ms = int(round(delay * 1000))
    graph.append(f"[{i}:a]volume={gain:.4f},adelay={ms}|{ms},apad=whole_dur={TOTAL}[a{i}]")
    labels.append(f"[a{i}]")
graph.append(f"[{noise_idx}:a]lowpass=f=2500,highpass=f=300[nz]")
labels.append("[nz]")
graph.append(
    "".join(labels)
    + f"amix=inputs={len(labels)}:normalize=0:duration=longest,"
    "lowpass=f=3600,highpass=f=45,"
    "vibrato=f=0.5:d=0.04,"
    "aecho=0.85:0.6:70|140:0.22|0.12,"
    f"atrim=0:{TOTAL},afade=t=in:d=0.6,afade=t=out:st={TOTAL - 1.6}:d=1.6,"
    "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,"
    "pan=stereo|c0=c0|c1=c0[out]"
)
cmd += ["-filter_complex", ";".join(graph), "-map", "[out]", "-c:a", "aac", "-b:a", "192k", "-t", str(TOTAL), out]
subprocess.run(cmd, check=True)
print(f"wrote {out} from {len(inputs)} synthesised voices")
