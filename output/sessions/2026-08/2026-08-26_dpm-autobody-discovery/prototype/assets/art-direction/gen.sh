#!/bin/zsh
# Generate one plate. Args: label, aspect, prompt
label=$1; aspect=$2; prompt=$3
url=$(higgsfield generate create seedream_v5_pro --prompt "$prompt" --aspect_ratio "$aspect" --resolution 2k --wait 2>&1 | grep -o 'https://[^ ]*\.png' | tail -1)
if [[ -n "$url" ]]; then
  curl -s -o "${label}.png" "$url"
  echo "OK   $label  $(du -h ${label}.png | cut -f1)"
else
  echo "FAIL $label"
fi
