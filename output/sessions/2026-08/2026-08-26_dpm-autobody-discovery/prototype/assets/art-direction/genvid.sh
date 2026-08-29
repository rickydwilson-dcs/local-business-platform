#!/bin/zsh
label=$1; start=$2; prompt=$3
url=$(higgsfield generate create kling3_0_turbo --prompt "$prompt" --start-image "$start" --duration 5 --resolution 1080p --aspect_ratio 16:9 --wait 2>&1 | grep -oE 'https://[^ ]*\.(mp4|mov)' | tail -1)
if [[ -n "$url" ]]; then curl -s -o "${label}.mp4" "$url"; echo "OK   $label $(du -h ${label}.mp4|cut -f1)"; else echo "FAIL $label"; fi
