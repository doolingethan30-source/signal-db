#!/usr/bin/env bash
# Encode the rendered wrapper frames + soundtrack into the deliverables,
# then make the Full Glass GIF and the QA frames.
set -euo pipefail
cd "$(dirname "$0")/.."
enc() { # frames dir, output
  ffmpeg -hide_banner -loglevel error -y -framerate 30 -i "$1/w%04d.jpg" -i out/audio.m4a \
    -c:v libx264 -preset slow -crf 17 -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$2"
}
enc out/frames-portrait out/plainweek-promo.mp4
enc out/frames-landscape out/plainweek-promo-landscape.mp4

# 3 s looping GIF of the Full Glass moment (switch lands at ~15.45 s)
ffmpeg -hide_banner -loglevel error -y -ss 15.1 -t 3 -i out/plainweek-promo.mp4 \
  -vf "fps=15,scale=540:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle" \
  -loop 0 out/plainweek-full-glass.gif

# QA frames
mkdir -p out/check
for t in 2 7 12 16 19; do
  ffmpeg -hide_banner -loglevel error -y -ss "$t" -i out/plainweek-promo.mp4 -frames:v 1 "out/check/portrait-${t}s.png"
  ffmpeg -hide_banner -loglevel error -y -ss "$t" -i out/plainweek-promo-landscape.mp4 -frames:v 1 "out/check/landscape-${t}s.png"
done
