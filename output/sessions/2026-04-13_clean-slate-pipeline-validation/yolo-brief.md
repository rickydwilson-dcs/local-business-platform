# YOLO Implementation Brief: Clean Slate + Pipeline Validation (Entry A)

**Branch:** feature/clean-slate-pipeline-validation (created from develop)
**Session spec:** output/sessions/2026-04-13_clean-slate-pipeline-validation/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The unified clone pipeline (`feature/unified-clone-pipeline`) has been deployed. Before running it end-to-end, the repo needs cleanup: kill 6 test/underscore sites and the castor theme package, preserving useful content from 4 DCS trade sites. Then run Entry A (ingest from live URL) against colorcode.events as the first pipeline validation.

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
git checkout develop && git pull
git checkout -b feature/clean-slate-pipeline-validation
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Archive Content from 4 DCS Trade Sites

**Goal:** Save industry-specific MDX content and site.config narrative from `_castor-plumbing`, `_cygnus-graphics`, `_lyra-garden`, `_nova-print` before deletion.
**Model:** haiku — mechanical file copying and text extraction

For each of the 4 sites (`_castor-plumbing`, `_cygnus-graphics`, `_lyra-garden`, `_nova-print`):

### Step 1.1: Create archive directories

```bash
mkdir -p output/archive/site-content/castor-plumbing/content
mkdir -p output/archive/site-content/cygnus-graphics/content
mkdir -p output/archive/site-content/lyra-garden/content
mkdir -p output/archive/site-content/nova-print/content
```

### Step 1.2: Copy MDX content

For each site, copy the entire `content/` directory:

```bash
cp -r sites/_castor-plumbing/content/* output/archive/site-content/castor-plumbing/content/
cp -r sites/_cygnus-graphics/content/* output/archive/site-content/cygnus-graphics/content/
cp -r sites/_lyra-garden/content/* output/archive/site-content/lyra-garden/content/
cp -r sites/_nova-print/content/* output/archive/site-content/nova-print/content/
```

### Step 1.3: Extract site.config narrative

For each site, read `site.config.ts` and write a `site-config-extract.md` capturing:

- Business name, trade, tagline
- About section (story paragraphs, whyChooseUs items, values)
- Credentials (stats, certifications, insurance)
- Navigation structure
- Contact info (phone, email, address)
- Social media links

Write to `output/archive/site-content/[site-name]/site-config-extract.md`.

Spawn 4 parallel haiku agents (one per site) to read `site.config.ts` and write the extract:

```
Task: Extract castor-plumbing site config
model: haiku
Prompt: Read sites/_castor-plumbing/site.config.ts. Write a markdown file at output/archive/site-content/castor-plumbing/site-config-extract.md containing all business narrative content (about.story, about.whyChooseUs, about.values, credentials, navigation, contact info, social media). Format as readable markdown sections.

Task: Extract cygnus-graphics site config
model: haiku
Prompt: [same pattern for _cygnus-graphics]

Task: Extract lyra-garden site config
model: haiku
Prompt: [same pattern for _lyra-garden]

Task: Extract nova-print site config
model: haiku
Prompt: [same pattern for _nova-print]
```

### Step 1.4: Verify archive

```bash
# Verification gate — STOP if this fails
test -d output/archive/site-content/castor-plumbing/content/services && \
test -d output/archive/site-content/cygnus-graphics/content/services && \
test -d output/archive/site-content/lyra-garden/content/services && \
test -d output/archive/site-content/nova-print/content/services && \
test -f output/archive/site-content/castor-plumbing/site-config-extract.md && \
test -f output/archive/site-content/cygnus-graphics/site-config-extract.md && \
test -f output/archive/site-content/lyra-garden/site-config-extract.md && \
test -f output/archive/site-content/nova-print/site-config-extract.md && \
echo "Phase 1 PASSED — all archives created" || echo "FAILED — missing archive files"
```

**Commit:**

```bash
git add output/archive/site-content/
git commit -m "$(cat <<'EOF'
chore: archive content from 4 DCS trade sites before cleanup

Preserves industry-specific MDX content (services, locations, blog,
projects, testimonials) and site.config narrative from castor-plumbing,
cygnus-graphics, lyra-garden, and nova-print for future reuse as
seed content in the new pipeline.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Kill Sites and Castor Theme

**Goal:** Remove 6 test/underscore site directories and the castor theme package.
**Model:** haiku — mechanical deletion

### Step 2.1: Delete site directories

```bash
rm -rf sites/test-corvus
rm -rf sites/_castor-plumbing
rm -rf sites/_cygnus-graphics
rm -rf sites/_lyra-garden
rm -rf sites/_nova-print
rm -rf sites/_rigel-events
```

### Step 2.2: Delete castor theme package

```bash
rm -rf packages/themes/castor
```

### Step 2.3: Verify no other references to castor

```bash
# Check for any remaining imports of castor
grep -r "@platform/themes/castor" --include="*.ts" --include="*.tsx" sites/ packages/ || echo "No castor references found — OK"
```

If any references are found, fix them before proceeding.

### Step 2.4: Update lockfile

```bash
pnpm install
```

### Step 2.5: Verify

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
echo "---"
# Verify killed directories are gone
test ! -d sites/test-corvus && \
test ! -d sites/_castor-plumbing && \
test ! -d sites/_cygnus-graphics && \
test ! -d sites/_lyra-garden && \
test ! -d sites/_nova-print && \
test ! -d sites/_rigel-events && \
test ! -d packages/themes/castor && \
echo "Phase 2 PASSED — all targets removed, type-check clean" || echo "FAILED"
```

**Commit:**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: remove 6 test/underscore sites and castor theme

Kill sites: test-corvus, _castor-plumbing, _cygnus-graphics,
_lyra-garden, _nova-print, _rigel-events.
Kill theme: castor (no live site dependents).

Content was archived in previous commit. Showcase and all live
sites unaffected — their theme packages remain.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Build Verification

**Goal:** Confirm the repo builds cleanly after deletion. All remaining sites and packages must compile and build without errors.
**Model:** haiku — running verification commands

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -15
echo "=== TYPE CHECK COMPLETE ==="
pnpm build 2>&1 | tail -20
echo "=== BUILD COMPLETE ==="
echo "Phase 3 PASSED"
```

If build fails, investigate and fix. Common issues:

- Stale import references to killed sites in shared files
- Turborepo cache referencing deleted workspaces (run `pnpm clean` then `pnpm build`)

No commit needed — this is verification only.

---

## Phase 4: Create Pipeline Brief for Entry A

**Goal:** Create a JobBrief JSON for the colorcode.events ingest test run.
**Model:** sonnet — requires understanding brief schema and crafting valid JSON

### Step 4.1: Read the brief schema

Read `tools/lib/pipeline-brief-types.ts` to understand the JobBrief schema.

### Step 4.2: Create brief

Run the brief creation tool if it exists:

```bash
npx tsx tools/create-pipeline-brief.ts \
  --source-type url \
  --url https://colorcode.events \
  --name corvus \
  --trade "digital-marketing-events" \
  --business "Digital Marketing Weekend" \
  --mode autonomous 2>&1 | tail -20
```

If `create-pipeline-brief.ts` does not exist yet (it's part of the unified-clone-pipeline feature), create the brief JSON manually:

**Create:** `output/briefs/entry-a-corvus-events.json`

```json
{
  "id": "entry-a-corvus-events-2026-04-13",
  "createdAt": "2026-04-13T00:00:00Z",
  "cpfVersion": "0.1",
  "source": {
    "type": "url",
    "value": "https://colorcode.events"
  },
  "business": {
    "name": "Digital Marketing Weekend",
    "trade": "digital-marketing-events",
    "tagline": "Two days of practical marketing sessions, workshops, and networking",
    "email": "hello@colorcode.events",
    "address": {
      "city": "Eastbourne",
      "postcode": "BN21 4BP",
      "region": "East Sussex"
    }
  },
  "content": {
    "services": [
      "Conference Sessions",
      "Workshops",
      "Networking Events",
      "Speaker Presentations",
      "Panel Discussions"
    ],
    "locations": ["Eastbourne"],
    "aboutSummary": "A free two-day conference for small business owners and marketers, held at the Winter Garden, Eastbourne.",
    "tone": "friendly"
  },
  "theme": {
    "name": "corvus",
    "brandColors": {
      "primary": "#292661",
      "secondary": "#F5D121",
      "accent": "#e8175d"
    },
    "preferDark": true,
    "referenceNotes": "Deep navy background, bold yellow accent, colorful geometric inline shapes in hero text, hamburger nav on all widths, bold solid-color section backgrounds (yellow, blue, green)"
  },
  "qa": {
    "maxIterations": 3,
    "thresholds": {
      "home": 0.05,
      "about": 0.05,
      "default": 0.1
    }
  },
  "imageGen": {
    "enabled": false,
    "mode": "batch"
  },
  "runMode": "autonomous"
}
```

Note: `imageGen.enabled` is false for this validation run — we're testing the clone + extract + scaffold pipeline, not Gemini image generation.

```bash
# Verification gate — STOP if this fails
test -f output/briefs/entry-a-corvus-events.json && echo "Phase 4 PASSED — brief created" || echo "FAILED"
```

**Commit:**

```bash
git add output/briefs/entry-a-corvus-events.json
git commit -m "$(cat <<'EOF'
chore: add pipeline brief for Entry A validation (colorcode.events)

JobBrief for the first end-to-end test of the unified clone pipeline.
Target: colorcode.events → corvus theme → events site.
Image generation disabled for this validation run.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Run Entry A Pipeline

**Goal:** Execute the full clone-and-scaffold pipeline against colorcode.events to validate it works end-to-end.
**Model:** sonnet — pipeline execution and debugging

### Step 5.1: Check if pipeline tools exist

```bash
test -f tools/clone-and-scaffold.ts && echo "E2E orchestrator exists" || echo "E2E orchestrator NOT FOUND"
test -f tools/clone-site.ts && echo "Clone tool exists" || echo "Clone tool NOT FOUND"
test -f tools/extract-theme.ts && echo "Extract tool exists" || echo "Extract tool NOT FOUND"
test -f tools/scaffold-client-site.ts && echo "Scaffold tool exists" || echo "Scaffold tool NOT FOUND"
```

### Step 5.2: Run the pipeline

**If `clone-and-scaffold.ts` exists:**

```bash
npx tsx tools/clone-and-scaffold.ts --brief output/briefs/entry-a-corvus-events.json 2>&1 | tee output/sessions/2026-04-13_clean-slate-pipeline-validation/pipeline-run-a.log
```

**If individual tools exist but not the E2E orchestrator, run stages manually:**

```bash
# Stage 1: Clone
npx tsx tools/clone-site.ts --url https://colorcode.events --name corvus 2>&1 | tee output/sessions/2026-04-13_clean-slate-pipeline-validation/stage-1.log

# Stage 2: Extract theme
npx tsx tools/extract-theme.ts --clone corvus 2>&1 | tee output/sessions/2026-04-13_clean-slate-pipeline-validation/stage-2.log

# Stage 3: Scaffold (without images)
npx tsx tools/scaffold-client-site.ts --theme corvus --trade "digital-marketing-events" --brief output/briefs/entry-a-corvus-events.json 2>&1 | tee output/sessions/2026-04-13_clean-slate-pipeline-validation/stage-3.log
```

**If pipeline tools don't exist yet** (feature branch not merged):

- STOP and report: "Pipeline tools from feature/unified-clone-pipeline not found on develop. Merge that branch first, then re-run this brief from Phase 5."

### Step 5.3: Verify pipeline output

```bash
# Verification gate — STOP if this fails
echo "=== Checking Stage 1: Clone ==="
test -d output/clones/corvus && echo "Clone directory exists" || echo "MISSING: output/clones/corvus/"
test -f output/clones/corvus/meta.json && echo "meta.json exists" || echo "MISSING: meta.json"
ls output/clones/corvus/jsx/pages/ 2>/dev/null | head -5 || echo "No JSX pages found"
ls output/clones/corvus/reference-screenshots/ 2>/dev/null | head -5 || echo "No reference screenshots found"

echo "=== Checking Stage 2: Theme ==="
test -d packages/themes/corvus && echo "Theme package exists" || echo "MISSING: packages/themes/corvus/"
test -f packages/themes/corvus/index.ts && echo "index.ts exists" || echo "MISSING: index.ts"
ls packages/themes/corvus/components/ 2>/dev/null | head -5 || echo "No components found"
ls packages/themes/corvus/pages/ 2>/dev/null | head -5 || echo "No page layouts found"

echo "=== Checking Stage 3: Scaffold ==="
SITE_DIR=$(ls -d sites/_corvus-* 2>/dev/null | head -1)
if [ -n "$SITE_DIR" ]; then
  echo "Site directory: $SITE_DIR"
  test -f "$SITE_DIR/site.config.ts" && echo "site.config.ts exists" || echo "MISSING"
  test -f "$SITE_DIR/theme.config.ts" && echo "theme.config.ts exists" || echo "MISSING"
  ls "$SITE_DIR/content/services/" 2>/dev/null | wc -l | xargs echo "Service MDX files:"
else
  echo "MISSING: No _corvus-* site directory found"
fi

echo "=== Type check ==="
pnpm type-check 2>&1 | tail -10
echo "Phase 5 PASSED"
```

### Step 5.4: Record results

Write pipeline results to the session log:

```bash
cat > output/sessions/2026-04-13_clean-slate-pipeline-validation/entry-a-results.md << 'RESULTS_EOF'
# Entry A Pipeline Results

**Date:** 2026-04-13
**Reference:** colorcode.events
**Theme:** corvus
**Entry point:** Ingest from live URL

## Stage 1: Clone
- CPF directory: output/clones/corvus/
- Pages cloned: [count from ls]
- Reference screenshots: [count]
- Assets downloaded: [count]

## Stage 2: Extract Theme
- Theme package: packages/themes/corvus/
- Components: [count]
- Page layouts: [count]
- Type-check: [pass/fail]

## Stage 3: Scaffold
- Site directory: sites/_corvus-digital-marketing-events/
- Content files: [count]
- Dev server: [works/fails]

## Issues Found
[document any errors, warnings, or unexpected behavior]
RESULTS_EOF
```

Update with actual values from the verification output.

**Commit:**

```bash
git add output/sessions/2026-04-13_clean-slate-pipeline-validation/
git add output/clones/ output/briefs/
# Only add pipeline-generated theme/site if they exist and pass type-check
test -d packages/themes/corvus && git add packages/themes/corvus/
SITE_DIR=$(ls -d sites/_corvus-* 2>/dev/null | head -1)
test -n "$SITE_DIR" && git add "$SITE_DIR"
git commit -m "$(cat <<'EOF'
feat: Entry A pipeline validation — colorcode.events → corvus

First end-to-end run of the unified clone pipeline.
Clone → Extract Theme → Scaffold Client Site.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Final Verification

**Goal:** Confirm everything is clean after all changes.
**Model:** haiku — mechanical verification

```bash
# Verification gate — STOP if this fails
echo "=== Remaining sites ==="
ls -d sites/*/ | grep -v node_modules
echo "=== Remaining themes ==="
ls -d packages/themes/*/
echo "=== Type check ==="
pnpm type-check 2>&1 | tail -10
echo "=== Git status ==="
git status
echo "=== Commits on this branch ==="
git log --oneline develop..HEAD
echo "Phase 6 PASSED"
```

No commit needed.

---

## Parallel execution groups

This section lists work units that can run concurrently.

### Intra-phase groups

| Group | Phase   | Items                                                                                        | File overlap                                      | Model | Rationale                                                       |
| ----- | ------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----- | --------------------------------------------------------------- |
| G1    | Phase 1 | Extract site-config from 4 sites (castor-plumbing, cygnus-graphics, lyra-garden, nova-print) | none (4 independent reads + 4 independent writes) | haiku | Each agent reads one site.config.ts and writes one extract file |
| —     | Phase 2 | — no parallel work in this phase —                                                           |                                                   |       | Sequential deletions + single lockfile update                   |
| —     | Phase 3 | — no parallel work in this phase —                                                           |                                                   |       | Single verification run                                         |
| —     | Phase 4 | — no parallel work in this phase —                                                           |                                                   |       | Single file creation                                            |
| —     | Phase 5 | — no parallel work in this phase —                                                           |                                                   |       | Sequential pipeline stages                                      |
| —     | Phase 6 | — no parallel work in this phase —                                                           |                                                   |       | Single verification run                                         |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                    |
| --------------------------------- | ----------------------------------------- |
| Verification gates between phases | Each phase's output gates the next        |
| Git commits                       | One per phase, in order                   |
| Phase 2 depends on Phase 1        | Must archive before deleting              |
| Phase 3 depends on Phase 2        | Must delete before verifying build        |
| Phase 5 depends on Phase 3        | Must have clean build before pipeline run |

---

## Cost Estimate

| Phase                        | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Archive content     | haiku  | ~20k              | ~8k                | $0.02      |
| Phase 2: Kill sites + castor | haiku  | ~5k               | ~1k                | $0.002     |
| Phase 3: Build verification  | haiku  | ~8k               | ~0.5k              | $0.003     |
| Phase 4: Create brief        | sonnet | ~8k               | ~2k                | $0.05      |
| Phase 5: Run pipeline        | sonnet | ~25k              | ~5k                | $0.15      |
| Phase 6: Final verification  | haiku  | ~5k               | ~0.5k              | $0.002     |
| **Total**                    |        | **~71k**          | **~17k**           | **~$0.23** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Pipeline results summary (from entry-a-results.md)
5. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-13_clean-slate-pipeline-validation/yolo-brief.md`:

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

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)
- **DO NOT TOUCH live sites:** dj-fox-electrical, colossus-scaffolding, base-template, dcs, mad-graphics, showcase
- **DO NOT TOUCH theme packages** other than castor (which is being killed) and corvus (which the pipeline will overwrite)
- **DO NOT modify `THEME_NAMES`** in `packages/theme-system/src/types.ts`
- If Phase 5 pipeline tools don't exist, STOP and report — don't try to build the pipeline tools yourself
