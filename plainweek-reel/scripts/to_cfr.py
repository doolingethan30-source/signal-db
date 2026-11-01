"""Turn the variable-rate screencast frames into a constant 30 fps JPEG sequence.

Chrome only emits a screencast frame when the page changes, so each frame is
held until the next one arrives (ffmpeg concat with per-frame durations).
Usage: python3 scripts/to_cfr.py out/rec
"""
import json
import os
import subprocess
import sys

rec = sys.argv[1]
tl = json.load(open(os.path.join(rec, "timeline.json")))
frames = tl["frames"]
lines = ["ffconcat version 1.0"]
for i, f in enumerate(frames):
    nxt = frames[i + 1]["t"] if i + 1 < len(frames) else tl["end"]
    start = max(f["t"], 0)
    lines.append(f"file 'raw/{f['file']}'")
    lines.append(f"duration {max(nxt - start, 0.001):.4f}")
lines.append(f"file 'raw/{frames[-1]['file']}'")
open(os.path.join(rec, "frames.ffconcat"), "w").write("\n".join(lines) + "\n")
gaps = [b["t"] - a["t"] for a, b in zip(frames, frames[1:])]
print(f"{len(frames)} frames, longest hold {max(gaps):.2f}s")
os.makedirs(os.path.join(rec, "cfr"), exist_ok=True)
subprocess.run(
    ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0",
     "-i", os.path.join(rec, "frames.ffconcat"), "-vf", "fps=30,format=yuvj420p",
     "-q:v", "2", "-start_number", "0", os.path.join(rec, "cfr", "c%04d.jpg")],
    check=True,
)
print(len(os.listdir(os.path.join(rec, "cfr"))), "cfr frames")
