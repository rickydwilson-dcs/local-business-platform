# YOLO Implementation Brief: Blog Post Page Hero Fix

**Branch:** feature/blog-post-hero-fix (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-20_blog-post-hero-fix/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The blog post page on `dj-fox-electrical-test` (port 3001) has three problems: (1) the hero is single-column with no image instead of the intended two-column split layout with the hero image, (2) breadcrumbs appear in the hero but the user doesn't want them, and (3) the raw category slug (e.g. `industry-tips`) is displayed instead of a pretty label (e.g. `Industry Tips`) both in the blog post hero eyebrow and on blog listing grid cards. All three fixes are targeted changes across three files — no shared logic changes required.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | /                      | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | /                      | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | /                      | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/blog-post-hero-fix
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Fix composition.json — hero layout

**Goal:** Enable two-column split layout with hero image and remove breadcrumbs from the blog-post HeroSection in `composition.json`.

**Model:** haiku — single-field JSON edits in one file

Read `sites/dj-fox-electrical-test/composition.json`.

Find the `"pageType": "blog-post"` entry. Its first section is:

```json
{
  "component": "HeroSection",
  "dataKey": "hero",
  "slots": { "showHeroImage": false, "showBreadcrumbs": true },
  "layout": { "background": "inverse" }
}
```

Change it to:

```json
{
  "component": "HeroSection",
  "dataKey": "hero",
  "slots": { "showHeroImage": true, "showBreadcrumbs": false },
  "layout": { "background": "inverse", "align": "split" }
}
```

**Why:** `ComposableHeroSection` only renders the image column when both `isSplit` (`layout.align === "split"`) AND `slots.showHeroImage` are true (hero-section.tsx line 255). The breadcrumb removal is a straight slot flip.

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
git add sites/dj-fox-electrical-test/composition.json
git commit -m "fix(dj-fox-test): blog-post hero — split layout, show image, hide breadcrumbs

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Fix blog listing page — category labels

**Goal:** Map raw category slugs to display labels on the blog listing page grid cards.

**Model:** haiku — add a constant map and one field substitution in a 45-line file

Read `sites/dj-fox-electrical-test/app/blog/page.tsx`.

Add a `CATEGORY_LABELS` constant at the top of the file (after imports):

```typescript
const CATEGORY_LABELS: Record<string, string> = {
  "industry-tips": "Industry Tips",
  "how-to-guide": "How-To Guide",
  "case-study": "Case Study",
  seasonal: "Seasonal",
  news: "News",
};
```

In the `posts.map()` call, change:

```typescript
category: p.category,
```

to:

```typescript
category: CATEGORY_LABELS[p.category] ?? p.category,
```

The `BlogGrid` composable renders `{post.category}` directly (blog-grid.tsx line 119) — passing the label instead of the slug is the complete fix, no component change needed.

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
git add sites/dj-fox-electrical-test/app/blog/page.tsx
git commit -m "fix(dj-fox-test): blog listing — show pretty category labels not raw slugs

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Fix blog post detail page — hero eyebrow category label

**Goal:** Map the raw category slug to a display label in the hero eyebrow on the blog post detail page.

**Model:** haiku — add the same constant map and one field substitution in one file

Read `sites/dj-fox-electrical-test/app/blog/[slug]/page.tsx`.

Add the same `CATEGORY_LABELS` constant at the top of the file (after imports):

```typescript
const CATEGORY_LABELS: Record<string, string> = {
  "industry-tips": "Industry Tips",
  "how-to-guide": "How-To Guide",
  "case-study": "Case Study",
  seasonal: "Seasonal",
  news: "News",
};
```

In the `renderComposedPage` data block, find the `hero` object. Change:

```typescript
eyebrow: frontmatter.category || "Blog",
```

to:

```typescript
eyebrow: CATEGORY_LABELS[frontmatter.category] ?? frontmatter.category ?? "Blog",
```

The `ComposableHeroSection` renders `d.eyebrow` as the category badge (hero-section.tsx line 174–178).

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
git add "sites/dj-fox-electrical-test/app/blog/[slug]/page.tsx"
git commit -m "fix(dj-fox-test): blog post hero — show pretty category label in eyebrow

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase       | Items                                                                         | File overlap      | Model | Rationale                                                   |
| ----- | ----------- | ----------------------------------------------------------------------------- | ----------------- | ----- | ----------------------------------------------------------- |
| G1    | Pre-flight  | Read `composition.json`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`      | none (reads only) | n/a   | All reads independent — batch in one message                |
| G2    | Phase 2 + 3 | Edit `app/blog/page.tsx` (Phase 2), Edit `app/blog/[slug]/page.tsx` (Phase 3) | none              | haiku | No file overlap; mechanical constant + substitution in each |

> Note on G2: Phases 2 and 3 are independent (different files, same pattern). They MAY be executed as parallel Task agents if the orchestrator chooses, but each must be committed separately after both complete.

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                                  | Reason                                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Verification gates (`pnpm type-check`) between phases | Each phase's output gates the next. Gates are the sync barrier.                                                    |
| Git commits                                           | One commit per phase, in order. Never batch commits.                                                               |
| Phase 1 must complete before Phase 2/3                | Phase 1 edits `composition.json`; Phases 2/3 edit different files but must verify Phase 1 type-checks clean first. |

---

## Cost Estimate

| Phase                              | Model | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------------- | ----- | ----------------- | ------------------ | ---------- |
| Phase 1: composition.json          | haiku | ~4k               | ~0.5k              | ~$0.01     |
| Phase 2: blog listing labels       | haiku | ~3k               | ~0.5k              | ~$0.01     |
| Phase 3: blog post hero label      | haiku | ~6k               | ~0.5k              | ~$0.01     |
| Verification gates (×3 type-check) | haiku | ~3k               | ~0.3k              | ~$0.01     |
| **Total**                          |       | **~16k**          | **~1.8k**          | **~$0.04** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | haiku     | [total across phases] |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-20_blog-post-hero-fix/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-20
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Completed

**Date:** 2026-04-20
**Status:** All phases executed successfully

Phase 1 flipped the blog-post `HeroSection` in `composition.json` to split layout with image shown and breadcrumbs hidden. Phases 2 and 3 added a `CATEGORY_LABELS` map to both the blog listing page and the blog post detail page, replacing raw slugs (e.g. `industry-tips`) with display labels (e.g. `Industry Tips`) — in the listing grid cards and in the hero eyebrow respectively. No surprises; all three type-check gates passed cleanly.

### Commits

- `c58900c` fix(dj-fox-test): blog-post hero — split layout, show image, hide breadcrumbs
- `cc8d19c` fix(dj-fox-test): blog listing — show pretty category labels not raw slugs
- `6a9a218` fix(dj-fox-test): blog post hero — show pretty category label in eyebrow

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
