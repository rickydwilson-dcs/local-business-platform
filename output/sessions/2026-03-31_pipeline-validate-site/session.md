# Session: pipeline.validate-site extraction

**Date:** 2026-03-31
**Branch:** develop

---

## Purpose

Extract the duplicated "Fidelity Review + Fix" block (Step 5h) from `pipeline.ingest` and `pipeline.stitch-design` into a reusable shared skill: `/pipeline.validate-site`.

Both pipelines had independently grown ~200 lines of near-identical logic: start dev server, screenshot pages, review agent, fix agent, console QA, kill server. The two implementations had already diverged (stitch lacked Playwright screenshots; ingest used `skipped` status where stitch used different error handling).

---

## What was done

### Created: `.claude/commands/pipeline.validate-site.md`

New shared skill with 7 steps:

1. **Start dev server** — `npm install --silent`, background start, poll until ready, health-check (STOP on failure)
2. **Screenshot pages** — Playwright tsx script with `reducedMotion: 'reduce'` (prevents blank screenshots from RevealOnScroll components hiding content before IntersectionObserver fires); WARN not STOP on failure
3. **Review agent** — reads `--review-prompt-file` written by the calling pipeline; writes findings JSON to `--findings-file`
4. **Fix agent (3-attempt retry loop)** — for each finding: attempt fix → type-check → if pass mark fixed, if fail revert and retry (up to 3 attempts); findings that fail all 3 are marked `unresolved` with last error logged
5. **Console QA** — Node HTTP checks across all pages + Playwright console/network error scan; interpret and fix blocker errors before proceeding
6. **Kill dev server**
7. **Report** — findings/fix summary; unresolved findings surfaced as a named warning block with ID, page, section, type, and last error

**Key design decision: review prompt is a parameter, not baked in.** The calling pipeline writes its own review criteria to `validate-review-prompt.txt` before calling the skill. This keeps the shared skill generic while preserving the meaningfully different review logic each pipeline needs (brand fidelity vs HTML fidelity).

**Fix log format:**
```json
{ "id": "V001", "status": "fixed", "attempt": 1, "description": "..." }
{ "id": "V002", "status": "unresolved", "attempts": 3, "lastError": "...", "reason": "..." }
```

### Modified: `pipeline.ingest.md` — Step 5h

Replaced ~200 lines with:
1. Write ingest review criteria to `validate-review-prompt.txt` — 11-point brand fidelity checklist (font loading, brand colours, section completeness, nav/footer, layout pattern, CSS, image rendering, logo rendering, hamburger menu, CTA colour variety, invisible text) plus fix guidance for common finding types
2. Call `/pipeline.validate-site` with `--screenshot-dir` pointing to `meta/dev-screenshots`
3. Post-call: pixel-diff baseline against reference screenshots (informational, uses `pipeline-visual-compare.ts`)

### Modified: `pipeline.stitch-design.md` — Step 5h

Replaced ~200 lines with:
1. Write stitch review criteria to `validate-review-prompt.txt` — HTML-vs-rendered fidelity check, Stitch MD3 colour token mapping table, CSS class fidelity rules (transitions, grayscale filters, scale transforms), explicit do-not-flag list
2. Call `/pipeline.validate-site` with `--screenshot-dir` — stitch now gets Playwright screenshots it previously lacked, giving the review agent visual output in addition to HTML source

---

## Improvements made in the process

- **Stitch gains screenshots**: stitch previously had no dev screenshots; the shared skill always takes them when `--screenshot-dir` is provided. Review agent now has visual evidence for both pipelines.
- **3-attempt retry replaces single-pass skipped**: previously both pipelines gave up on a finding after one failed type-check. The new fix agent retries up to 3 times with different approaches before marking unresolved.
- **Unresolved findings are surfaced clearly**: previously buried in the fix log JSON. Now printed as a warning block in the report so the user sees what needs manual attention without digging into files.
- **`reducedMotion: 'reduce'` explanation consolidated**: the rationale (RevealOnScroll + IntersectionObserver) lives once in the shared skill rather than duplicated.

---

## Files changed

| File | Action |
|---|---|
| `.claude/commands/pipeline.validate-site.md` | Created |
| `.claude/commands/pipeline.ingest.md` | Modified — Step 5h replaced |
| `.claude/commands/pipeline.stitch-design.md` | Modified — Step 5h replaced |

---

## What was learned

The review prompt as a file parameter is a clean pattern for skills that need to be generic but whose agent reasoning must be domain-specific. The calling pipeline owns the what-to-look-for; the shared skill owns the how-to-run-it. Future pipelines (e.g. batch/CSV-driven) can use the same skill with their own review criteria.

The 3-attempt retry is also a useful general pattern for any agentic fix loop — it's worth considering for `fix.findings` too at some point.
