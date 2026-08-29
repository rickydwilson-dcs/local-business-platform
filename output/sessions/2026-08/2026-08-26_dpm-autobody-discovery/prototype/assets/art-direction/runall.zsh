#!/bin/zsh
setopt no_nomatch
i=0
while IFS=$'\t' read -r l a p; do
  [[ -z "$l" ]] && continue
  ./gen.sh "$l" "$a" "$p" &
  (( i++ ))
  if (( i % 7 == 0 )); then wait; fi
done < plates.tsv
wait
