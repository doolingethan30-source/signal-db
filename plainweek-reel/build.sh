#!/usr/bin/env bash
# Full pipeline: record prototype -> 30 fps sequence -> soundtrack -> wrapper frames -> encodes.
set -euo pipefail
cd "$(dirname "$0")"
PROTO="${1:-prototype/plainweek-prototype.html}"
node scripts/record.js "$PROTO" out/rec
python3 scripts/to_cfr.py out/rec
python3 scripts/make_audio.py out/rec/timeline.json out/audio.m4a
node scripts/render_wrapper.js portrait out/frames-portrait &
node scripts/render_wrapper.js landscape out/frames-landscape &
wait
scripts/encode.sh
echo "done: out/plainweek-promo.mp4, out/plainweek-promo-landscape.mp4, out/plainweek-full-glass.gif, out/check/"
