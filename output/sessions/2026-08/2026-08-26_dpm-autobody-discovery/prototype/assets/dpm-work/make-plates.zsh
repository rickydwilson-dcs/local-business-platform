#!/bin/zsh
# make-plates.zsh — rebuild every real-DPM plate the prototype uses.
#
# Nothing in this folder is in git (output/.gitignore denies binaries across
# sessions/** by design — assets belong in R2), so this script IS the asset.
# Run it and the prototype's <img> tags resolve again.
#
# Every plate here is DPM Autobody's own photograph or DPM Autobody's own
# video, of DPM Autobody's own work. None of it is AI, none of it is stock,
# and none of it is another shop's car. Sources are named per block.
#
# Requires: ImageMagick (magick), ffmpeg, yt-dlp.
# Usage:    ./make-plates.zsh [path-to-session-root]

set -e
HERE=${0:a:h}
ROOT=${1:-${HERE}/../../..}
SHOTS="$ROOT/research/screenshots/dpm-assets"
TMP="${TMPDIR:-/tmp}/dpm-plates"
mkdir -p "$TMP" "$HERE/bentley-s3" "$HERE/jaguar-sea-green" "$HERE/workshop"

# JPEG export settings. These plates sit behind a dark veil and a grain layer,
# so quality 86 is indistinguishable from 95 here and roughly half the bytes.
export_plate() { magick "$1" -resize "${3}x>" -depth 8 -colorspace sRGB -strip -quality 86 "$2"; }

# ---------------------------------------------------------------------------
# 1963 Bentley S3 Continental
#
# Source: the 4032x3024 photograph DPM publish on their own site
# (static.wixstatic.com, served untransformed). It is a phone file, shot on the
# yard in hard summer light — the exposure is the reason it is cropped rather
# than used whole. All three plates below are crops of that one frame, which is
# why the light matches across them.
# ---------------------------------------------------------------------------
BENT="$SHOTS/wix/orig-2b5b05_046ae4f7ecd14957bdfd492dd45db60b-mv2.png"
if [[ -f "$BENT" ]]; then
  # The shut line between door and rear wing, with the chrome waistrail running
  # through it. This is the concours argument in one frame: the rail is dead
  # straight and the reflection under it does not kink at the gap.
  magick "$BENT" -crop 1500x900+2100+1150 +repage "$TMP/b-shut.png"
  export_plate "$TMP/b-shut.png" "$HERE/bentley-s3/shutline.jpg" 2000

  # Radiator shell, winged-B mascot, twin headlamps and the front wing.
  magick "$BENT" -crop 1400x1050+380+1050 +repage "$TMP/b-front.png"
  export_plate "$TMP/b-front.png" "$HERE/bentley-s3/front.jpg" 1800

  # The whole car. Cropped to hold the car and the fence line and to push the
  # yard clutter (a van, a shed) to the far right, where the page's veil covers
  # it. A commissioned replacement is item 1 on the shot list.
  magick "$BENT" -crop 3500x1970+230+760 +repage "$TMP/b-whole.png"
  export_plate "$TMP/b-whole.png" "$HERE/bentley-s3/whole.jpg" 2400
else
  echo "missing: $BENT — re-fetch from dpmautobody.co.uk" >&2
fi

# ---------------------------------------------------------------------------
# Jaguar, Aston Martin Sea Green
#
# Source: "DPM TV: FULL CUSTOM CLASSIC JAGUAR PREP AND PAINT" (3bcai_euCy4),
# 1920x1080. Shot on a wide action camera, so every frame is barrel-distorted;
# k1=-0.16 straightens the booth door frame and the panel edges without the
# over-correction that starts to bow them the other way at -0.22.
#
# Only the `web_safari` client offers 1080p (format 96) without a PO token;
# `android` silently falls back to 640x360 and `tv` refuses outright.
# ---------------------------------------------------------------------------
JAG="$TMP/3bcai_euCy4.mp4"
if [[ ! -f "$JAG" ]]; then
  echo "fetching the Jaguar film (1080p, ~540 MB)…"
  yt-dlp --extractor-args "youtube:player_client=web_safari" \
         --retries 20 --fragment-retries 20 -f 96 \
         -o "$JAG" "https://www.youtube.com/watch?v=3bcai_euCy4"
fi
grab() { ffmpeg -v error -ss "$2" -i "$JAG" -frames:v 1 -vf "lenscorrection=k1=-0.16:k2=0.01:i=bilinear" -q:v 2 "$1" -y; }

# Bonnet, wing and door, with the booth strip light running as one unbroken
# highlight down each panel in turn.
grab "$TMP/j-panels.jpg" 640
magick "$TMP/j-panels.jpg" -crop 1460x920+40+90 +repage "$TMP/j-panels-c.jpg"
export_plate "$TMP/j-panels-c.jpg" "$HERE/jaguar-sea-green/panels.jpg" 1440

# The car in the booth, colour going down, with DPM's own signwriting on the
# wall behind it.
grab "$TMP/j-booth.jpg" 556
magick "$TMP/j-booth.jpg" -crop 1800x1010+60+40 +repage "$TMP/j-booth-c.jpg"
export_plate "$TMP/j-booth-c.jpg" "$HERE/jaguar-sea-green/booth.jpg" 1780

# A hand and a polisher on the finished green.
grab "$TMP/j-polish.jpg" 916
magick "$TMP/j-polish.jpg" -crop 1560x880+180+120 +repage "$TMP/j-polish-c.jpg"
export_plate "$TMP/j-polish-c.jpg" "$HERE/jaguar-sea-green/polish.jpg" 1540

# ---------------------------------------------------------------------------
# The workshop
#
# Sources: the 57-second craft film DPM run as their own site hero
# (video.wixstatic.com, 1920x1080, 24fps, colour-graded — this was shot on a
# real camera) and its 3840x2160 poster frame.
# ---------------------------------------------------------------------------
POSTER="$SHOTS/wix/orig-2b5b05_a669aa362c1a4aecaf06f3f98aca3b02f000.jpg"
[[ -f "$POSTER" ]] && export_plate "$POSTER" "$HERE/workshop/spray-gun.jpg" 2400

# Frame 12 of that film: a near-black shell in the booth with the strip light
# unbroken down the whole flank. The best photograph of paintwork DPM own.
FLANK="$SHOTS/video/f12.jpg"
[[ -f "$FLANK" ]] && export_plate "$FLANK" "$HERE/workshop/booth-flank.jpg" 1920

echo
for f in "$HERE"/*/*.jpg; do
  printf '%-46s %8s  %s\n' "${f#$HERE/}" "$(du -h "$f" | cut -f1)" "$(magick "$f" -format '%wx%h' info:)"
done
