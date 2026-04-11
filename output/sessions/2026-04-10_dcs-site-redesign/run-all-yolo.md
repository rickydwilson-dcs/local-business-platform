# Design Run Orchestrator — YOLO Brief

You are orchestrating 24 design experiment runs. Work through them sequentially. Do not ask for confirmation between runs.

---

## Setup

All brief files are at:
`/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-04-10_dcs-site-redesign/design-runs/`

Create a timestamped output directory:
`/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-04-10_dcs-site-redesign/outputs/[YYYY-MM-DD_HHMMSS]/`

---

## For each of the 24 brief files (in filename order, skip `_content-brief.md`):

1. Create a subdirectory inside the timestamped output folder named after the brief file (without `.md`)
2. Read the brief file in full
3. Execute the brief: generate the `index.html` described in it, applying the skill and configuration specified at the top of each brief
4. Write the output as `index.html` into that run's subdirectory
5. Print: `[N/24] run-name — ✓ done` (or `✗ failed`) and continue to the next

The 24 files in order:

- b1-brutalist-swiss-print.md
- b2-brutalist-crt-terminal.md
- h1-high-end-ethereal-glass-bento.md
- h2-high-end-ethereal-glass-cascade.md
- h3-high-end-ethereal-glass-editorial-split.md
- h4-high-end-editorial-luxury-bento.md
- h5-high-end-editorial-luxury-cascade.md
- h6-high-end-editorial-luxury-editorial-split.md
- h7-high-end-soft-structuralism-bento.md
- h8-high-end-soft-structuralism-cascade.md
- h9-high-end-soft-structuralism-editorial-split.md
- m1-minimalist.md
- t1-taste-baseline.md
- t2-taste-creativity-low.md
- t3-taste-creativity-high.md
- t4-taste-density-low.md
- t5-taste-density-high.md
- t6-taste-variance-low.md
- t7-taste-variance-high.md
- t8-taste-motion-low.md
- t9-taste-motion-high.md
- t10-taste-creative-max.md
- t11-taste-dense-rigid-static.md
- t12-taste-skill-defaults.md

---

## When all 24 are complete

Print a summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design runs complete
Passed: N/24
Failed: [list any that produced no index.html]
Output: /path/to/outputs/[timestamp]/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Rules

- Run all 24 without stopping or asking questions
- Each `index.html` must be a complete standalone file with embedded CSS and JS — no external dependencies except Google Fonts
- If a run fails for any reason, note it and continue to the next
- Do not open or preview any files — just write them and move on
