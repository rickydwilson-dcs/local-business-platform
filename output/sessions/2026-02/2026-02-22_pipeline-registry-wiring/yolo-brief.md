# YOLO Implementation Brief: Fix Pipeline Registry Wiring

**Branch:** feature/pipeline-registry-wiring (created from develop)
**Session spec:** output/sessions/2026-02-22_pipeline-registry-wiring/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error

---

## Context

The ingestion pipeline correctly identifies which component registry (orion vs vega) matches a reference site's visual patterns, but `/pipeline.ingest` ignores the recommendation and hardcodes `vegaRegistry`. For colorcode.events (lyra theme), the analysis returned `registryRecommendation: { themeName: "orion", confidence: "high" }` (dark header, full-bleed hero), but the test site got wired to vega (light header, split hero). This makes every generated test site structurally wrong.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/pipeline-registry-wiring   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Update `/pipeline.ingest` Command to Use Recommended Registry

**File:** `.claude/commands/pipeline.ingest.md`

Read the file. Find **Step 5a** (around line 70) where `theme.config.ts` is written. Currently it hardcodes:

```typescript
import { vegaRegistry } from "@platform/themes/vega";
```

Replace Step 5a with instructions that:

1. Read `output/ingestion/<theme-name>/site-analysis.json`
2. Extract the `registryRecommendation.themeName` field (will be `"orion"` or `"vega"`)
3. If the field is missing or the value is not `"orion"` or `"vega"`, default to `"vega"`
4. Use the recommended registry in the generated `theme.config.ts`:

For orion:

```typescript
import { orionRegistry } from "@platform/themes/orion";
```

For vega:

```typescript
import { vegaRegistry } from "@platform/themes/vega";
```

And the config should use whichever registry was imported:

```typescript
componentRegistry: orionRegistry,  // or vegaRegistry
```

Update the comment in the template to say "uses <registryTheme> registry (from analysis)" instead of "uses vega registry".

Keep the rest of Step 5a unchanged (the camelCase theme name logic, the DefaultConfig import).

### Verification Gate

```bash
# Verification gate — STOP if this fails
# The command file is markdown, not code — just verify it reads correctly
grep -c "registryRecommendation" .claude/commands/pipeline.ingest.md
# Should return >= 1
```

---

## Phase 2: Fix test-lyra to Use Orion Registry

**File:** `sites/test-lyra/theme.config.ts`

Read the file. Change:

```typescript
import { vegaRegistry } from "@platform/themes/vega";
```

To:

```typescript
import { orionRegistry } from "@platform/themes/orion";
```

And change:

```typescript
  componentRegistry: vegaRegistry,
```

To:

```typescript
  componentRegistry: orionRegistry,
```

Update the comment from "uses vega registry" to "uses orion registry (from analysis)".

### Verification Gate

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

---

## Phase 3: Commit

```bash
git add .claude/commands/pipeline.ingest.md sites/test-lyra/theme.config.ts
git commit -m "$(cat <<'EOF'
fix: use recommended registry from site-analysis in pipeline.ingest

The /pipeline.ingest command was hardcoding vegaRegistry for all test
sites regardless of what the analysis recommended. Now it reads
registryRecommendation.themeName from site-analysis.json and uses the
matching registry (orion or vega). Also fixed test-lyra to use orion
as the analysis recommended.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan

---

## Update Session File

After completing all phases, append to `output/sessions/2026-02-22_pipeline-registry-wiring/yolo-brief.md`:

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

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more

## Completed

**Date:** 2026-02-22
**Status:** Phase 1 and 3 executed successfully. Phase 2 skipped (test-lyra already deleted).

The `/pipeline.ingest` command template was updated to read `registryRecommendation.themeName` from `site-analysis.json` and use the matching registry (orion or vega) instead of hardcoding vega. Phase 2 was skipped because `sites/test-lyra/` had already been removed via `/pipeline.kill-site` earlier in the same session — the fix in Phase 1 ensures all future pipeline runs wire the correct registry automatically.

### Commits

- `e0e1d9f` fix: use recommended registry from site-analysis in pipeline.ingest
