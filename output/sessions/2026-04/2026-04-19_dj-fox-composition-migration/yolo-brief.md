# YOLO Implementation Brief: DJ Fox Test Site — Polish Pass

**Branch:** `feature/dj-fox-composition-migration` (already exists — checkout directly, do NOT create)
**Session spec:** `output/sessions/2026-04/2026-04-19_dj-fox-composition-migration/yolo-brief.md`
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The DJ Fox composition migration test site (`sites/dj-fox-electrical-test/`) has several visual bugs and missing sections discovered during visual comparison against the production site (https://djfoxelectrical.com). A planning session identified 7 targeted fixes across 5 files.

The most visible bugs (invisible text on dark sections) are caused by a missing Tailwind utility token in the theme system. The other fixes are composition config adjustments and typography sizing changes.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
# Confirm you're on the correct branch
git status
git checkout feature/dj-fox-composition-migration

# Verify clean starting point
pnpm type-check   # must be 13/13 before starting
```

---

## Phase 1 — Fix missing Tailwind token (invisible text bug)

**Goal:** Register `.text-surface-inverse-foreground` in the theme plugin so dark-background sections render white text.  
**Model:** haiku — single mechanical insertion to one file

**File:** `packages/theme-system/src/tailwind-plugin.ts`

Read the file first. Confirm around line 97 there is a `.text-on-inverse-muted` block. Insert immediately after the closing `},` of that block:

```typescript
".text-surface-inverse-foreground": {
  color: "#ffffff",
},
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/theme-system/src/tailwind-plugin.ts
git commit -m "$(cat <<'EOF'
fix(theme): register text-surface-inverse-foreground utility token

Missing Tailwind class caused invisible text on all dark-background
composable sections (stats-strip, cta-section, why-choose-us etc).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Hero section fixes

**Goal:** Increase overlay opacity for legibility and fix inner container padding alignment.  
**Model:** haiku — two targeted find-replace edits in one file

**File:** `packages/core-components/src/components/composable/hero-section.tsx`

Read the file first, then make both edits:

1. Around line 75: `bg-brand-primary/60` → `bg-brand-primary/75`
2. Around line 78: `container mx-auto px-4 py-16` → `container mx-auto px-4 sm:px-6 lg:px-8 py-16`

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/core-components/src/components/composable/hero-section.tsx
git commit -m "$(cat <<'EOF'
fix(hero): increase overlay opacity and align inner padding

- Brand overlay: 60% → 75% for better text legibility on hero images
- Inner container: add sm:px-6 lg:px-8 to match other section containers

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Header + footer typography sizing

**Goal:** Reduce phone number, CTA button, and footer section heading text sizes.  
**Model:** haiku — mechanical class additions to two independent files, run in parallel

**File A:** `packages/core-components/src/components/ui/site-header.tsx`

Read the file first, then:

- Around line 104 (phoneClasses): prepend `text-sm ` — the string currently starts with `flex items-center gap-2`; add `text-sm ` before `flex`
- Around line 159 (CTA button className): add `text-sm ` before `bg-brand-primary`

**File B:** `packages/themes/orion/components/footer.tsx`

Read the file first. Find all occurrences of `text-base sm:text-lg` (section headings, should be exactly 3 occurrences at lines ~72, ~101, ~129). Replace each with `text-sm sm:text-base`.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/core-components/src/components/ui/site-header.tsx packages/themes/orion/components/footer.tsx
git commit -m "$(cat <<'EOF'
fix(header, footer): reduce nav phone, CTA and footer heading text sizes

- Header phone number and CTA button: inherit text-base → explicit text-sm
- Orion footer section headings: text-base sm:text-lg → text-sm sm:text-base

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — composition.json homepage sections

**Goal:** Add CategoryCardsSection, fix WhyChooseUs stat column, improve section background rhythm.  
**Model:** sonnet — structured JSON edit requiring careful ordering

**File:** `sites/dj-fox-electrical-test/composition.json`

Read the file first. Find `pages[0].sections` (the array under `"pageType": "home"`). Replace the entire sections array with:

```json
[
  {
    "component": "HeroSection",
    "dataKey": "home.hero",
    "layout": { "background": "image", "fullBleed": true, "align": "center" }
  },
  {
    "component": "StatsStrip",
    "dataKey": "home.stats",
    "layout": { "background": "inverse" }
  },
  {
    "component": "ServiceListSection",
    "dataKey": "home.serviceList"
  },
  {
    "component": "CategoryCardsSection",
    "dataKey": "home.categories",
    "layout": { "background": "subtle" }
  },
  {
    "component": "LocationPillsSection",
    "dataKey": "home.locationPills"
  },
  {
    "component": "WhyChooseUsSection",
    "dataKey": "home.whyChooseUs",
    "slots": { "showStat": false },
    "layout": { "background": "surface" }
  },
  {
    "component": "CTASection",
    "dataKey": "home.cta",
    "layout": { "background": "inverse" }
  }
]
```

All non-home page sections remain unchanged.

Background rhythm achieved: image → dark → white → subtle → white → white → dark

After editing, validate JSON:

```bash
# Verification gate — STOP if this fails
cd sites/dj-fox-electrical-test && node -e "JSON.parse(require('fs').readFileSync('composition.json','utf8')); console.log('JSON valid')"
cd ../.. && pnpm type-check
```

**Commit:**

```bash
git add sites/dj-fox-electrical-test/composition.json
git commit -m "$(cat <<'EOF'
feat(dj-fox-test): add CategoryCardsSection, fix section rhythm and WhyChooseUs

- Add 'Check Your Needs' CategoryCardsSection (data already in page-data.ts)
- WhyChooseUsSection: showStat: false removes tabular 3-column appearance
- Section backgrounds: image→dark→white→subtle→white→white→dark
- Breaks two consecutive white and two consecutive dark sections

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                      | File overlap | Model | Rationale                              |
| ----- | ------- | ------------------------------------------ | ------------ | ----- | -------------------------------------- |
| G1    | Phase 3 | Edit `site-header.tsx` + Edit `footer.tsx` | none         | haiku | Independent files — launch in parallel |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                            | Reason                                                |
| ------------------------------- | ----------------------------------------------------- |
| Phase gates (`pnpm type-check`) | Each phase gates the next — synchronisation barrier   |
| Git commits                     | One commit per phase in order                         |
| Phase 2 edits (same file)       | Both edits are in `hero-section.tsx` — must serialise |

---

## Cost Estimate

| Phase                           | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: tailwind plugin token  | haiku  | ~6k               | ~0.5k              | ~$0.002    |
| Phase 2: hero section fixes     | haiku  | ~5k               | ~0.5k              | ~$0.002    |
| Phase 3: header + footer sizing | haiku  | ~8k               | ~0.5k              | ~$0.003    |
| Phase 4: composition.json       | sonnet | ~6k               | ~1k                | ~$0.033    |
| **Total**                       |        | **~25k**          | **~2.5k**          | **~$0.04** |

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes (13/13)
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-19_dj-fox-composition-migration/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Completed

**Date:** 2026-04-19
**Status:** All phases executed successfully

All 4 phases implemented without deviation. Phase 1 registered the missing `text-surface-inverse-foreground` Tailwind utility that was causing invisible text on dark-background sections. Phase 2 improved hero legibility with 75% brand overlay and responsive padding. Phase 3 ran both header and footer edits in parallel — phone, CTA button, and three footer headings all reduced one size step. Phase 4 added the `CategoryCardsSection` to the home page, wired `showStat: false` on `WhyChooseUsSection`, and locked in the correct background rhythm (image→dark→white→subtle→white→white→dark). All type-check gates passed 13/13 at each phase boundary.

### Commits

- `1a02837` fix(theme): register text-surface-inverse-foreground utility token
- `941f671` fix(hero): increase overlay opacity and align inner padding
- `56ba502` fix(header, footer): reduce nav phone, CTA and footer heading text sizes
- `c25af9c` feat(dj-fox-test): add CategoryCardsSection, fix section rhythm and WhyChooseUs

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult `## Parallel execution groups` before launching any work.** Group items MUST launch in a single Task-tool message.
- **Items NOT in any group run sequentially.**
- **Never parallelise across phase boundaries.** Verification gates are synchronisation barriers.
- **If the groups table and phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for mechanical Task agents; `model: sonnet` for standard edits
- Co-Authored-By line must say `Claude Sonnet 4.6`
