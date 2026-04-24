# YOLO Implementation Brief: Parallel Self-Containment Migration

**Branch:** develop (orchestrator stays on develop; per-site work on `feature/self-contained-{site}` branches inside worktrees)
**Session spec:** output/sessions/2026-04/2026-04-23_parallel-self-containment-migration/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Three sites (base-template, dcs, mad-graphics) still depend on `@platform/themes/*` shared packages, which are being retired in favour of a self-contained architecture where each site owns its layout components and CSS directly. The migration has been proven on colossus-scaffolding (April 21) and dj-fox-electrical using a documented 7-step recipe. This brief executes the same migration across all three remaining sites in parallel using git worktrees and Task agents, then consolidates any cross-cutting issues.

The approved plan was reviewed and approved. Implement it exactly as specified below.

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
pnpm type-check   # must be clean before starting
```

---

## Phase 0: Write the Migration Brief

**Goal:** Create `docs/briefs/component-library-migration.md` — the self-contained recipe file that per-site Task agents will read in Phase 2.
**Model:** sonnet

Read the following files in parallel before writing:

```bash
# Parallel reads — launch all in one message
cat packages/themes/vega/index.ts
cat packages/themes/vega/globals.css
cat packages/themes/solaris/index.ts
cat packages/themes/solaris/globals.css
cat packages/themes/cygnus/index.ts
cat packages/themes/cygnus/globals.css
cat sites/colossus-scaffolding/app/globals.css        # post-migration reference
cat sites/colossus-scaffolding/app/layout.tsx          # post-migration reference
cat sites/colossus-scaffolding/components/site-header.tsx
cat sites/colossus-scaffolding/theme.config.ts
```

Write `docs/briefs/component-library-migration.md` with this structure:

```markdown
# Component Library Migration Brief (Self-Containment)

## What This Brief Is

Site-agnostic YOLO brief for migrating a site off @platform/themes/\* to self-contained architecture.
Reference site: sites/colossus-scaffolding/ (post-migration gold standard).

## Invariant

After migration, this must return zero hits:
grep -rn "@platform/themes\|packages/themes" sites/<name> --exclude-dir=node_modules --exclude-dir=.next

## Per-Site Configuration

| Site          | Theme   | Source package           | Components to copy (source → dest)                                                      |
| ------------- | ------- | ------------------------ | --------------------------------------------------------------------------------------- |
| base-template | vega    | packages/themes/vega/    | header.tsx→SiteHeader, footer.tsx→SiteFooter                                            |
| dcs           | solaris | packages/themes/solaris/ | header.tsx→SiteHeader, footer.tsx→SiteFooter, scroll-reveal-script.tsx→SiteScrollReveal |
| mad-graphics  | cygnus  | packages/themes/cygnus/  | header.tsx→SiteHeader, footer.tsx→SiteFooter                                            |

## The 7-Step Recipe

### Step 1 — Inline theme globals.css

Read packages/themes/<theme>/globals.css.
Open sites/<name>/app/globals.css.
Replace the @import line for the theme (e.g. `@import "../../packages/themes/vega/globals.css"`)
with the FULL CONTENT of the theme globals.css file.
IMPORTANT: Remove the `@import "../../core-components/src/styles/animations.css"` line from the
inlined content — it is a relative path from the theme package and will break from the site. The
site should instead ensure it has `@import "../../../packages/core-components/src/styles/animations.css"`
at the top of its globals.css (check colossus reference).

### Step 2 — Copy theme layout components into the site

Read packages/themes/<theme>/components/header.tsx (and footer.tsx, etc).
Write them to sites/<name>/components/site-header.tsx and sites/<name>/components/site-footer.tsx.
Rename all exported identifiers to generic names (SiteHeader, SiteFooter, SiteScrollReveal).
Update sites/<name>/app/layout.tsx:

- Replace `import { VegaHeader, VegaFooter } from '@platform/themes/vega/components'`
  with `import { SiteHeader } from '@/components/site-header'; import { SiteFooter } from '@/components/site-footer'`
- Replace all JSX usages of the theme component names with the new generic names.
- Remove the ThemeProvider wrapper if present — colossus layout.tsx has no ThemeProvider.
  (ThemeProvider from core-components is client-only and not needed in self-contained sites.)
- Remove `import { <theme>Registry } from '@platform/themes/<theme>'`
- Remove `registry={<theme>Registry}` from PageShell props if present.

### Step 3 — Inline the componentRegistry into theme.config.ts

Read packages/themes/<theme>/index.ts — extract the `<theme>Registry` object literal.
Open sites/<name>/theme.config.ts.
Delete: `import { <theme>Registry } from '@platform/themes/<theme>'`
Delete: `componentRegistry: <theme>Registry,` line from themeConfig.
Add a separate export: `export const registry: ComponentRegistry = { <paste inline object> };`
Add import at top: `import type { ComponentRegistry } from '@platform/theme-system';`
(No runtime side effects — the registry is consumed by tooling only.)

### Step 4 — Delete @platform/themes path aliases from tsconfig.json

Open sites/<name>/tsconfig.json.
Delete every "paths" entry whose key starts with `@platform/themes/` or `@platform/themes`.
Keep all @platform/core-components, @platform/theme-system, @platform/component-composition entries.

### Step 5 — Scope Tailwind content globs

Open sites/<name>/tailwind.config.ts.
Remove these glob patterns (they scan theme packages):
'../../packages/themes/_/_.{js,ts,jsx,tsx}'
'../../packages/themes/_/components/\*\*/_.{js,ts,jsx,tsx}'
Keep: '../../packages/core-components/src/**/\*.{js,ts,jsx,tsx}'
Keep: '../../packages/component-composition/src/**/\*.{js,ts,jsx,tsx}' (if present)

### Step 6 — Remove @platform/themes from package.json

Open sites/<name>/package.json.
Delete `"@platform/themes": "workspace:*"` from dependencies and/or devDependencies.
Keep @platform/core-components, @platform/theme-system, @platform/component-composition.

### Step 7 — Verify

Run the invariant grep:
grep -rn "@platform/themes\|packages/themes" sites/<name> --exclude-dir=node_modules --exclude-dir=.next
Must return ZERO hits. If any hits remain, fix them before continuing.

## Verification Commands (per site, run from site directory)

npm run type-check # must exit 0
npm run build # must exit 0 — use --no-lint to skip if needed
```

After writing the file, commit:

```bash
git add docs/briefs/component-library-migration.md
git commit -m "docs(briefs): add component-library-migration self-containment recipe"
```

```bash
# Verification gate — STOP if this fails
test -f docs/briefs/component-library-migration.md && echo "Brief created" || exit 1
```

---

## Phase 1: Create Git Worktrees

**Goal:** Create three isolated git worktrees (one per site), each on its own feature branch off develop.
**Model:** haiku

```bash
# Create worktrees (sequential — each depends on git state)
git worktree add /Users/rickywilson/Sites/worktrees/base-template feature/self-contained-base-template
git worktree add /Users/rickywilson/Sites/worktrees/dcs feature/self-contained-dcs
git worktree add /Users/rickywilson/Sites/worktrees/mad-graphics feature/self-contained-mad-graphics
```

Then install pnpm dependencies in each worktree (can run in parallel — separate directories):

Spawn 3 Task agents in parallel (haiku):

```
Task: pnpm install in base-template worktree
model: haiku
prompt: Run `pnpm install` in /Users/rickywilson/Sites/worktrees/base-template. Report success or failure.

Task: pnpm install in dcs worktree
model: haiku
prompt: Run `pnpm install` in /Users/rickywilson/Sites/worktrees/dcs. Report success or failure.

Task: pnpm install in mad-graphics worktree
model: haiku
prompt: Run `pnpm install` in /Users/rickywilson/Sites/worktrees/mad-graphics. Report success or failure.
```

```bash
# Verification gate — STOP if this fails
git worktree list | grep -E "base-template|dcs|mad-graphics" | wc -l | grep -q "^3$" && echo "3 worktrees created" || exit 1
```

---

## Phase 2: Parallel Site Migrations

**Goal:** Migrate all three sites in parallel using Task agents. Each agent executes the full 7-step recipe, visual baseline seeding, type-check, and build.
**Model:** sonnet (each agent)

Launch the following 3 agents in a single message (they run concurrently):

---

### Agent 1: base-template

```
Task: Migrate base-template to self-contained architecture
model: sonnet
prompt: |
  You are migrating sites/base-template/ to self-contained architecture.
  Your working directory is the worktree at /Users/rickywilson/Sites/worktrees/base-template/.
  The site lives at sites/base-template/ within that worktree.

  ## Step A — Seed pre-migration visual baseline
  From sites/base-template/:
    npm run build
  If build passes, capture evidence: save `npm run build` exit code as baseline proof.
  Then do a quick visual capture:
    cd sites/base-template
    npm run build 2>&1 | tail -20 > /tmp/base-template-premig-build.txt
  Start next on port 3010 in background:
    PORT=3010 npx next start sites/base-template/.next &
    NEXTPID=$!
    sleep 5
  Capture screenshots using playwright (or curl for HTML evidence):
    npx playwright screenshot --browser chromium http://localhost:3010 /tmp/base-template-pre-home.png || curl -s http://localhost:3010 > /tmp/base-template-pre-home.html
    npx playwright screenshot --browser chromium http://localhost:3010/services /tmp/base-template-pre-services.png || curl -s http://localhost:3010/services > /tmp/base-template-pre-services.html
  Kill the server: kill $NEXTPID 2>/dev/null || true

  ## Step B — Read the migration brief
  Read /Users/rickywilson/Sites/worktrees/base-template/docs/briefs/component-library-migration.md in full.

  ## Step C — Read all source files before editing (parallel reads)
  Read these files simultaneously:
    - sites/base-template/app/layout.tsx
    - sites/base-template/app/globals.css
    - sites/base-template/tailwind.config.ts
    - sites/base-template/theme.config.ts
    - sites/base-template/tsconfig.json
    - sites/base-template/package.json
    - packages/themes/vega/globals.css
    - packages/themes/vega/components/header.tsx
    - packages/themes/vega/components/footer.tsx
    - packages/themes/vega/components/index.ts
    - packages/themes/vega/index.ts
    - sites/colossus-scaffolding/app/layout.tsx  (reference)
    - sites/colossus-scaffolding/app/globals.css (reference)

  ## Step D — Execute the 7-step recipe
  Follow the brief exactly for site=base-template, theme=vega.
  Key specifics for base-template:
  - Step 2: Remove the ThemeProvider wrapper from layout.tsx (colossus reference has none).
    Remove `import { ThemeProvider } from '@platform/core-components'`
    Remove `<ThemeProvider theme="vega" registry={vegaRegistry}>` wrapper.
  - Step 3: The registry for vega is:
    { theme: "vega", heroVariant: "split", headerVariant: "light", cardVariant: "standard", sectionVariant: "standard" }
    Write this inline in theme.config.ts (read the actual object from packages/themes/vega/index.ts to confirm).
  - Step 4: Delete aliases: @platform/themes/orion, @platform/themes/vega, @platform/themes/vega/components, @platform/themes/vega/pages
  - Step 5: Remove glob lines containing 'packages/themes' from tailwind.config.ts

  ## Step E — Run invariant check
  grep -rn "@platform/themes\|packages/themes" sites/base-template --exclude-dir=node_modules --exclude-dir=.next
  Must return ZERO hits. Fix any remaining hits before continuing.

  ## Step F — Type-check and build
  pnpm --filter base-template run type-check
  pnpm --filter base-template run build
  STOP if either fails.

  ## Step G — Post-migration visual capture and diff
  Start next on port 3010 in background with the new build:
    PORT=3010 npx next start sites/base-template/.next &
    NEXTPID=$!
    sleep 5
  Capture screenshots:
    npx playwright screenshot --browser chromium http://localhost:3010 /tmp/base-template-post-home.png || curl -s http://localhost:3010 > /tmp/base-template-post-home.html
  Kill: kill $NEXTPID 2>/dev/null || true
  Report: did the visual capture succeed, are there obvious layout breaks compared to what you expect from the theme?

  ## Step H — Commit
  cd /Users/rickywilson/Sites/worktrees/base-template
  git add sites/base-template/
  git commit -m "feat(self-containment): remove @platform/themes dep from base-template

  - Inlined vega globals.css into app/globals.css
  - Copied VegaHeader/VegaFooter to components/site-header.tsx/site-footer.tsx
  - Inlined componentRegistry into theme.config.ts
  - Removed @platform/themes path aliases from tsconfig.json
  - Scoped Tailwind content globs
  - Removed @platform/themes from package.json

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

  ## Report
  Return:
  - ✅/❌ for each step A–H
  - The exact grep output from Step E
  - The last 20 lines of type-check output
  - The last 20 lines of build output
  - Visual capture result
  - Commit SHA
  - Any blockers or issues that might affect other sites
```

---

### Agent 2: dcs

```
Task: Migrate dcs to self-contained architecture
model: sonnet
prompt: |
  You are migrating sites/dcs/ to self-contained architecture.
  Your working directory is the worktree at /Users/rickywilson/Sites/worktrees/dcs/.
  The site lives at sites/dcs/ within that worktree.

  ## Step A — Seed pre-migration visual baseline
  cd sites/dcs
  npm run build 2>&1 | tail -20 > /tmp/dcs-premig-build.txt
  PORT=3011 npx next start sites/dcs/.next &
  NEXTPID=$!; sleep 5
  npx playwright screenshot --browser chromium http://localhost:3011 /tmp/dcs-pre-home.png || curl -s http://localhost:3011 > /tmp/dcs-pre-home.html
  kill $NEXTPID 2>/dev/null || true

  ## Step B — Read the migration brief
  Read /Users/rickywilson/Sites/worktrees/dcs/docs/briefs/component-library-migration.md in full.

  ## Step C — Read all source files before editing (parallel reads)
  Read these simultaneously:
    - sites/dcs/app/layout.tsx
    - sites/dcs/app/globals.css
    - sites/dcs/tailwind.config.ts
    - sites/dcs/theme.config.ts
    - sites/dcs/tsconfig.json
    - sites/dcs/package.json
    - packages/themes/solaris/globals.css
    - packages/themes/solaris/components/header.tsx
    - packages/themes/solaris/components/footer.tsx
    - packages/themes/solaris/components/scroll-reveal-script.tsx
    - packages/themes/solaris/components/index.ts
    - packages/themes/solaris/index.ts
    - sites/colossus-scaffolding/app/layout.tsx  (reference)

  ## Step D — Execute the 7-step recipe
  Follow the brief exactly for site=dcs, theme=solaris.
  Key specifics for dcs:
  - Step 2: dcs uses THREE layout components: SolarisHeader, SolarisFooter, SolarisScrollReveal.
    Copy all three. Name them SiteHeader, SiteFooter, SiteScrollReveal.
    Update layout.tsx to import all three from @/components/.
    Remove the ThemeProvider wrapper.
    Remove the solarisRegistry import and registry prop from PageShell.
  - Step 3: Read packages/themes/solaris/index.ts to get the exact registry object literal.
    Inline it as `export const registry: ComponentRegistry = { ... }` in theme.config.ts.
  - Step 4: Delete ALL @platform/themes/solaris* path aliases from tsconfig.json.
  - Step 5: Remove glob lines containing 'packages/themes' from tailwind.config.ts.
  - Note: dcs uses Space_Grotesk and Inter fonts via next/font/google — these are fine and stay.

  ## Step E — Run invariant check
  grep -rn "@platform/themes\|packages/themes" sites/dcs --exclude-dir=node_modules --exclude-dir=.next
  Must return ZERO hits.

  ## Step F — Type-check and build
  pnpm --filter dcs run type-check
  pnpm --filter dcs run build
  STOP if either fails.

  ## Step G — Post-migration visual capture
  PORT=3011 npx next start sites/dcs/.next &
  NEXTPID=$!; sleep 5
  npx playwright screenshot --browser chromium http://localhost:3011 /tmp/dcs-post-home.png || curl -s http://localhost:3011 > /tmp/dcs-post-home.html
  kill $NEXTPID 2>/dev/null || true

  ## Step H — Commit
  cd /Users/rickywilson/Sites/worktrees/dcs
  git add sites/dcs/
  git commit -m "feat(self-containment): remove @platform/themes dep from dcs

  - Inlined solaris globals.css into app/globals.css
  - Copied SolarisHeader/Footer/ScrollReveal to components/
  - Inlined componentRegistry into theme.config.ts
  - Removed @platform/themes path aliases from tsconfig.json
  - Scoped Tailwind content globs
  - Removed @platform/themes from package.json

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

  ## Report
  Return:
  - ✅/❌ for each step A–H
  - The exact grep output from Step E
  - Last 20 lines of type-check and build outputs
  - Visual capture result
  - Commit SHA
  - Any issues that might affect other sites
```

---

### Agent 3: mad-graphics

```
Task: Migrate mad-graphics to self-contained architecture
model: sonnet
prompt: |
  You are migrating sites/mad-graphics/ to self-contained architecture.
  Your working directory is the worktree at /Users/rickywilson/Sites/worktrees/mad-graphics/.
  The site lives at sites/mad-graphics/ within that worktree.

  ## Step A — Seed pre-migration visual baseline
  cd sites/mad-graphics
  npm run build 2>&1 | tail -20 > /tmp/mad-graphics-premig-build.txt
  PORT=3012 npx next start sites/mad-graphics/.next &
  NEXTPID=$!; sleep 5
  npx playwright screenshot --browser chromium http://localhost:3012 /tmp/mad-graphics-pre-home.png || curl -s http://localhost:3012 > /tmp/mad-graphics-pre-home.html
  kill $NEXTPID 2>/dev/null || true

  ## Step B — Read the migration brief
  Read /Users/rickywilson/Sites/worktrees/mad-graphics/docs/briefs/component-library-migration.md in full.

  ## Step C — Read all source files before editing (parallel reads)
  Read these simultaneously:
    - sites/mad-graphics/app/layout.tsx
    - sites/mad-graphics/app/globals.css
    - sites/mad-graphics/tailwind.config.ts
    - sites/mad-graphics/theme.config.ts
    - sites/mad-graphics/tsconfig.json
    - sites/mad-graphics/package.json
    - packages/themes/cygnus/globals.css
    - packages/themes/cygnus/components/header.tsx
    - packages/themes/cygnus/components/footer.tsx
    - packages/themes/cygnus/components/index.ts
    - packages/themes/cygnus/index.ts
    - sites/colossus-scaffolding/app/layout.tsx  (reference)

  ## Step D — Execute the 7-step recipe
  Follow the brief exactly for site=mad-graphics, theme=cygnus.
  Key specifics for mad-graphics:
  - Step 2: Cygnus uses CygnusHeader, CygnusFooter → SiteHeader, SiteFooter.
    mad-graphics also has custom site-specific page components (app/page.tsx uses Material Symbols
    icons, custom stats). Do NOT touch app/page.tsx — only layout.tsx and the header/footer.
    Remove ThemeProvider from layout.tsx. Remove cygnusRegistry import and registry prop.
  - Step 3: Read packages/themes/cygnus/index.ts to get exact registry object. Inline it.
  - Step 4: Delete ALL @platform/themes/cygnus* path aliases from tsconfig.json.
  - Step 5: Remove glob lines containing 'packages/themes' from tailwind.config.ts.
  - Note: mad-graphics globals.css has site-specific utilities (.label-overline, .cta-band-text-dark)
    — preserve these below the inlined theme CSS.

  ## Step E — Run invariant check
  grep -rn "@platform/themes\|packages/themes" sites/mad-graphics --exclude-dir=node_modules --exclude-dir=.next
  Must return ZERO hits.

  ## Step F — Type-check and build
  pnpm --filter mad-graphics run type-check
  pnpm --filter mad-graphics run build
  STOP if either fails.

  ## Step G — Post-migration visual capture
  PORT=3012 npx next start sites/mad-graphics/.next &
  NEXTPID=$!; sleep 5
  npx playwright screenshot --browser chromium http://localhost:3012 /tmp/mad-graphics-post-home.png || curl -s http://localhost:3012 > /tmp/mad-graphics-post-home.html
  kill $NEXTPID 2>/dev/null || true

  ## Step H — Commit
  cd /Users/rickywilson/Sites/worktrees/mad-graphics
  git add sites/mad-graphics/
  git commit -m "feat(self-containment): remove @platform/themes dep from mad-graphics

  - Inlined cygnus globals.css into app/globals.css
  - Copied CygnusHeader/Footer to components/site-header.tsx/site-footer.tsx
  - Inlined componentRegistry into theme.config.ts
  - Removed @platform/themes path aliases from tsconfig.json
  - Scoped Tailwind content globs
  - Removed @platform/themes from package.json

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

  ## Report
  Return:
  - ✅/❌ for each step A–H
  - The exact grep output from Step E
  - Last 20 lines of type-check and build outputs
  - Visual capture result
  - Commit SHA
  - Any issues that might affect other sites
```

```bash
# Verification gate (after all 3 agents report) — STOP if any failed
# All 3 agents must report commit SHAs and zero grep hits before Phase 3
```

---

## Phase 3: Analyze Cross-Cutting Failures

**Goal:** After agents report, identify any failures that appear in ≥2 sites and fix them. Generate a consolidated fix if needed.
**Model:** sonnet (opus if failures span >5 interdependent files)

Read all three agent reports. For each failure:

1. Identify the root cause (missing export, type error, CSS conflict, etc.)
2. Check if the same failure appeared in ≥2 sites
3. If cross-cutting: fix in the relevant package (core-components, theme-system, etc.) on develop in the main worktree, then cherry-pick to all three feature branches

```bash
# If any cross-cutting fix was made on develop, propagate to all three worktrees:
cd /Users/rickywilson/Sites/worktrees/base-template && git rebase develop
cd /Users/rickywilson/Sites/worktrees/dcs && git rebase develop
cd /Users/rickywilson/Sites/worktrees/mad-graphics && git rebase develop
```

If no cross-cutting failures: note "No shared issues found" and proceed.

If fixes were made, commit them to develop:

```bash
git add packages/
git commit -m "fix(core): <describe fix> — required for self-containment migration"
```

---

## Phase 4: Write Summary Document

**Goal:** Write `output/migrations/parallel-run-2026-04-23.md` with full per-site status.
**Model:** haiku

```bash
mkdir -p output/migrations
```

Write `output/migrations/parallel-run-2026-04-23.md` with:

- Date: 2026-04-23
- Per-site status table: Site | Branch | Baseline Seeded | 7 Steps Done | Type-Check | Build | Visual Diff | Commit SHA | Notes
- Shared issues section: list any cross-cutting failures and the fix applied
- Deferred items: any site that didn't fully complete with reason
- Next steps: PR merge order, any remaining work

Commit:

```bash
git add output/migrations/parallel-run-2026-04-23.md
git commit -m "docs(migrations): parallel self-containment run 2026-04-23 summary"
```

```bash
# Verification gate
test -f output/migrations/parallel-run-2026-04-23.md && echo "Summary written" || exit 1
```

---

## Parallel Execution Groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                     | File overlap          | Model      | Rationale                                        |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------- | ------------------------------------------------ |
| G1    | Phase 0 | Read vega/index.ts, vega/globals.css, solaris/index.ts, solaris/globals.css, cygnus/index.ts, cygnus/globals.css + 7 more | none (reads only)     | n/a        | Independent reads — batch in one message         |
| G2    | Phase 1 | pnpm install in base-template worktree, pnpm install in dcs worktree, pnpm install in mad-graphics worktree               | none (separate dirs)  | haiku × 3  | Independent install tasks — separate directories |
| G3    | Phase 2 | Agent 1 (base-template), Agent 2 (dcs), Agent 3 (mad-graphics)                                                            | none (separate sites) | sonnet × 3 | Independent site migrations — no shared files    |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale                                        |
| ------ | ------ | ----- | ------------------------------------------------ |
| (none) |        |       | All phases depend on the previous phase's output |

### Sequential points — MUST NOT parallelise

| Item                                                 | Reason                                                                      |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| Phase 0 → Phase 1                                    | Agents in Phase 2 reference the brief created in Phase 0 — must exist first |
| Phase 1 → Phase 2                                    | Agents need worktrees + pnpm install to be complete before migrating        |
| Phase 2 → Phase 3                                    | Phase 3 reads all three agent reports                                       |
| Worktree creation commands (Phase 1)                 | Sequential — each `git worktree add` modifies shared git state              |
| Git commits within each agent                        | One commit per agent, after all edits verified                              |
| `pnpm type-check` and `pnpm build` within each agent | Build must run after type-check (writes .next/)                             |

---

## Cost Estimate

| Phase                          | Model    | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------ | -------- | ----------------- | ------------------ | ---------- |
| Phase 0: Write migration brief | sonnet   | ~10k              | ~3k                | ~$0.08     |
| Phase 1: Create worktrees      | haiku ×3 | ~2k               | ~0.5k              | <$0.01     |
| Phase 2: base-template agent   | sonnet   | ~14k              | ~4k                | ~$0.10     |
| Phase 2: dcs agent             | sonnet   | ~16k              | ~4k                | ~$0.11     |
| Phase 2: mad-graphics agent    | sonnet   | ~14k              | ~4k                | ~$0.10     |
| Phase 3: Analyze failures      | sonnet   | ~8k               | ~2k                | ~$0.06     |
| Phase 4: Write summary         | haiku    | ~3k               | ~1k                | <$0.01     |
| **Total**                      |          | **~67k**          | **~18.5k**         | **~$0.47** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm all three sites pass `pnpm type-check` and `pnpm build`
3. Visual parity — confirm baseline seeded and post-migration captures completed
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-23_parallel-self-containment-migration/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-23
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
- Never push — leave all changes on the feature branches in worktrees
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model: `Claude Sonnet 4.6`
- **Post-migration**: the feature branches (feature/self-contained-base-template, feature/self-contained-dcs, feature/self-contained-mad-graphics) are in worktrees at /Users/rickywilson/Sites/worktrees/. They need to be reviewed and merged to develop — this is done separately via /deploy.changes after the YOLO session completes.

## Completed

**Date:** 2026-04-23
**Status:** All phases executed successfully

All four phases ran to completion. Phase 0 created `docs/briefs/component-library-migration.md` — the reusable self-containment recipe. Phase 1 created three git worktrees at `/Users/rickywilson/Sites/worktrees/`. Phase 2 ran three parallel sonnet agents that each executed the full 7-step recipe, discovered that theme `pages/` components also needed copying (not covered by the original brief), ran type-check and build (both EXIT 0 per site), and committed. Phase 3 identified two cross-cutting issues (missing theme-system `dist/` in fresh worktrees; pages/ copy pattern missing from brief) and updated the brief with both discoveries. No package code changes were needed. Phase 4 produced the migration summary at `output/migrations/parallel-run-2026-04-23.md`.

### Commits (on develop)

| SHA     | Message                                                                            |
| ------- | ---------------------------------------------------------------------------------- |
| 83d98ac | docs(briefs): add component-library-migration self-containment recipe              |
| 160e5b1 | fix(core): update migration brief with pages/ copy pattern and worktree pre-flight |
| 20aae5e | docs(migrations): parallel self-containment run 2026-04-23 summary                 |

### Feature Branch Commits (in worktrees)

| Site          | Branch                               | Commit SHA                               |
| ------------- | ------------------------------------ | ---------------------------------------- |
| base-template | feature/self-contained-base-template | d102b770d31855a0765af45f9c6dc03f1b20b9ff |
| dcs           | feature/self-contained-dcs           | 7e1d432                                  |
| mad-graphics  | feature/self-contained-mad-graphics  | 5dbed5a1bee4c14873ab973c22f949272c805f05 |
