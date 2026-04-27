# Session Wrap-Up: /pipeline.ingest — fountaindigital.co.uk

**Date:** 2026-04-26
**Goal:** Run the full ingestion pipeline against https://www.fountaindigital.co.uk/ and produce a working test site.
**Outcome:** Aborted at Phase B gate. Theme package generated but failed TPV validation (Critical=2, High=3). Test site not created.

---

## What Worked

### Phase A0 — analyse-site.ts

Ran successfully to completion (exit code 0). Generated theme name `lyra`.

- 10 pages analysed (3.5 min run time)
- 36 components generated (3 reused from core, 33 AI-generated, some as placeholders after gauntlet failures)
- Token reconciliation produced a plausible brand blue (`#0041B3`) from the site's `#3898EC` CSS primary
- Registry assignment: `vega` (high confidence)
- Output: `packages/themes/lyra/`, `output/ingestion/lyra/`

### Phase A1 + A3 — Parallel sub-agents

Both ran cleanly and in parallel as required.

- A1: 10 HTML pages captured, 20/20 images downloaded — no curl failures
- A3: Scaffold inventory correct — registry=`lyraRegistry`, 23/26 component files present, 3 missing barrel entries detected

### Phase B — TPV Validator

Caught all 6 findings correctly and returned a clear Statistics line. The gate logic worked exactly as designed — pipeline stopped before any `sites/` modification.

---

## What Didn't Work

### Phase B gate: pipeline aborted (5 Critical+High findings)

The generated `packages/themes/lyra/` package had systemic defects, all traceable to `analyse-site.ts` generator behaviour:

| #   | Severity | Finding                                                                                                                            | Root cause                                                                                                                          |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Critical | `site-header.tsx` emitted as `"use client"` with `useState` (TPV-003)                                                              | Generator wraps interactive navigation in a single Client Component instead of splitting shell/toggle                               |
| 2   | Critical | `lyraDefaultConfig` missing `colors.semantic`, `colors.overlay`, `colors.surface.mutedForeground`, `colors.surface.card` (TPV-006) | Generator only populates token fields it extracted from the site; doesn't fill in required-but-unextracted categories with defaults |
| 3   | High     | Footer exported as `SiteFooter` not `LyraFooter`; no header export at all; no prop type exports (TPV-002)                          | Generator uses generic names (`SiteHeader`, `SiteFooter`) rather than theme-scoped names (`LyraHeader`, `LyraFooter`)               |
| 4   | High     | `react` and `next` in `dependencies` not `peerDependencies` in `packages/themes/package.json` (TPV-004)                            | Static defect in the workspace package.json — not a generator issue, one-time fix                                                   |
| 5   | High     | `typography.scale` entirely absent from `lyraDefaultConfig` (TPV-009)                                                              | Generator populates `fontFamily` but never generates the 8-level scale object                                                       |

Plus one Medium (inline `backgroundImage` in `cta-full-bleed-gradient.tsx`) and three barrel-only ghost exports (`hero-blog-centered`, `hero-centered-light`, `navigation` — referenced in the barrel but files don't exist because those sections were "reused from core").

### Gauntlet TS errors (non-blocking but indicative of quality)

Several AI-generated components had TS errors that the gauntlet flagged and retried:

- `AnnouncementBar`, `ClientLogoStrip` — property access on `string` (object prop typed as `string`)
- `SiteHeader` — same + semantic-fix retry also failed → fell back to placeholder
- `TestimonialsStrip`, `ServicesGrid` — TS syntax errors (unterminated string, unclosed JSX) → retry
- `CaseStudiesGrid` — `.map` called on `string` type

This suggests the AI had trouble with this site's component complexity (animated split hero, tabbed case studies grid, logo carousel). Higher placeholder rate than typical.

---

## Bugs to Fix (next session)

### Bug 1 — Generator: Header emitted as Client Component (BLOCKER)

**File:** `tools/analyse-site.ts` (component generation prompt / post-processing)
**Fix:** In the AI prompt for Header components, explicitly instruct that the top-level component must be a Server Component. Any interactive behaviour (mobile menu, dropdown) must be extracted into a named `*MobileMenu` or `*NavToggle` child marked `"use client"`. Post-generation, the gauntlet should flag `"use client"` on any component whose blueprint category is `Navigation` and whose name suggests a site-wide header.

### Bug 2 — Generator: DefaultConfig doesn't fill required-but-unextracted token categories (BLOCKER)

**File:** `tools/analyse-site.ts` (token reconciliation / index.ts scaffolding step)
**Fix:** After token extraction, the scaffolding step that writes `{name}DefaultConfig` must always include a complete skeleton for `colors.semantic`, `colors.overlay`, and the full `colors.surface` map — populated with safe defaults if extraction didn't find values. Reference the `DeepPartialThemeConfig` interface to enumerate required paths. This is the same defect pattern as TPV-006; it will recur on every site that doesn't use Material Design-style semantic colours in its CSS.

### Bug 3 — Generator: Component naming convention not followed (BLOCKER)

**File:** `tools/analyse-site.ts` (component generation / barrel writing)
**Fix:** When generating the `components/index.ts` barrel and the component source files, use `{ThemeName}Header` / `{ThemeName}Footer` naming (e.g. `LyraHeader`, `LyraFooter`). Export the component's props interface as `{ThemeName}HeaderProps` / `{ThemeName}FooterProps`. The barrel must explicitly include the header component — currently the generator doesn't add `site-header.tsx` to the barrel at all.

### Bug 4 — Generator: `typography.scale` never populated (BLOCKER)

**File:** `tools/analyse-site.ts` (token reconciliation / index.ts scaffolding step)
**Fix:** The scaffolding step must always write a `typography.scale` block with all 8 levels. Values can be derived from the extracted `fontSizeRamp` / heading sizes in `site-analysis.json`, or populated from a standard ramp if extraction didn't yield them. Currently the generator writes only `fontFamily` and stops.

### Bug 5 — Generator: Barrel entries written for core-reused components (build failure)

**File:** `tools/analyse-site.ts` (barrel generation step)
**Fix:** When a component is classified as "reused from core" (i.e. no file is generated in `packages/themes/<name>/components/`), its export must NOT be written into `components/index.ts`. The current logic writes the barrel entry regardless of whether the file was generated. Affects `hero-blog-centered`, `hero-centered-light`, `navigation` in this run.

### Bug 6 — One-time: `packages/themes/package.json` has wrong dependency type (build risk)

**File:** `packages/themes/package.json`
**Fix:** Move `react` and `next` from `dependencies` → `peerDependencies`. Match version ranges from `packages/core-components/package.json`. This is a static defect — it pre-dates this session and affects all themes, not just lyra.

---

## Artefacts Produced

```
packages/themes/lyra/               — generated theme package (NOT production-ready)
output/ingestion/lyra/
  site-analysis.json                — full analysis output
  site-analysis.md                  — human-readable summary
  screenshots/                      — 10 reference page captures
  html/                             — 10 reference HTML pages
  images/                           — 20 downloaded reference images
  meta/
    html-manifest.json
    image-manifest.json
    scaffold-inventory.json
    findings-theme-package.md       — full TPV audit report
```

No commits were made. No `sites/` directories were created or modified.

---

## Next Steps

Two paths:

**Option A — Fix the generator, re-run pipeline**
Fix Bugs 1–5 in `tools/analyse-site.ts`, then re-run:

```
/pipeline.ingest --url https://www.fountaindigital.co.uk/ --name lyra
```

The existing `output/ingestion/lyra/` artefacts will be overwritten.

**Option B — Manually patch the generated package, re-run from Phase B**
Patch `packages/themes/lyra/` directly (rename exports, add missing tokens, fix Server Component, remove ghost barrel entries), then re-run just the pipeline validator to confirm it passes, then continue to Phase C manually.

Option A is cleaner for long-term platform health; Option B is faster if you want a test site today.
