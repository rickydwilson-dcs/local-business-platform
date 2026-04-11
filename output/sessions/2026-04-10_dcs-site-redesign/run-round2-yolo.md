# Design Run Orchestrator — Round 2 YOLO Brief

You are orchestrating 8 design experiment runs. Work through them sequentially. Do not ask for confirmation between runs.

---

## Setup

All brief files are at:
`/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-04-10_dcs-site-redesign/design-runs/`

Create a timestamped output directory:
`/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-04-10_dcs-site-redesign/outputs/[YYYY-MM-DD_HHMMSS]/`

---

## For each of the 8 brief files (in order):

1. Create a subdirectory inside the timestamped output folder named after the brief file (without `.md`)
2. Read the brief file in full
3. Execute the brief: generate the `index.html` described in it, applying the skill and configuration specified at the top
4. Write the output as `index.html` into that run's subdirectory
5. Print: `[N/8] run-name — ✓ done` (or `✗ failed`) and continue to the next

The 8 files in order:

- r2-a-sage-geometric.md
- r2-b-sage-stats.md
- r2-c-sage-fulltext.md
- r2-d-teal-geometric.md
- r2-e-teal-stats.md
- r2-f-sky-geometric.md
- r2-g-citrus-geometric.md
- r2-h-citrus-stats.md

---

## When all 8 are complete

Print a summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design runs complete
Passed: N/8
Failed: [list any that produced no index.html]
Output: /path/to/outputs/[timestamp]/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Rules

- Run all 8 without stopping or asking questions
- Each `index.html` must be a complete standalone file with embedded CSS and JS — no external dependencies except Google Fonts
- If a run fails for any reason, note it and continue to the next
- Do not open or preview any files — just write them and move on
- Each brief specifies exact CSS variables, hero layout, and colour mapping — follow them precisely, do not improvise the palette or hero treatment
