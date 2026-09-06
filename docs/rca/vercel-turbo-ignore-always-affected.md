# RCA: turbo-ignore reports every site as "affected" inside Vercel, but "not affected" locally on the identical commit

**Date:** 2026-09-03 **Status:** Fixed and verified in production (2026-09-04) **Slug:** `vercel-turbo-ignore-always-affected`

## Symptom

Every git-linked Vercel project in this monorepo (colossus-scaffolding, dcs,
npracing-v1, npracing-v3) rebuilds on **every** push to develop/staging/main, even when
the push touches nothing under that site's package or its dependencies. Sustained
through the 2026-09-03 DPM Autobody prototype session (15+ pushes touching only
`output/sessions/**` and one `docs/` file).

Commit `1c4b782e` already fixed a real, separate failure (`.vercelignore` excluded
`.git`, so turbo-ignore's SCM query errored with "not a Git repository" and failed
open). That mode is gone — turbo-ignore now finds the previous deployment SHA and runs
its diff cleanly — yet it still concludes "This commit affects <pkg>" every time.

Colossus build log for `dpl_DR7XNeSU5gDE9pWf6jLHn4VBkc2M`:

```
Found previous deployment ("7caf6c23...") for "colossus-scaffolding" on branch "staging"
Analyzing results of `npx -y turbo@^2.4.3 run build --filter="colossus-scaffolding...[7caf6c23...]" --dry=json`
This commit affects "colossus-scaffolding"
✓ Proceeding with deployment
```

…for a commit range whose entire diff is 14 files, all under
`output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/` and
`docs/guides/prototype-hosting.md`. The identical command on a local checkout at the
same commit returns `"packages": []`.

## Root cause

**`.vercelignore` deletes git-_tracked_ files from the build working tree before
`ignoreCommand` runs, and turbo counts a tracked-but-missing file as a change.**

The chain, anchored to source:

1. `.vercelignore:35` contains the pattern `*.png`. Vercel applies `.vercelignore` to
   the build's working tree on **every** build, git-push-triggered included — the
   file's own header comment (`.vercelignore:1-20`) documents this, established when
   the `.git` exclusion broke every build.

2. That deletes files git still has in its index. A tracked file removed from disk
   without `git rm` is reported by `git ls-files --modified` — a state
   indistinguishable from an uncommitted deletion.

3. Every site's `ignoreCommand` uses the filter `<pkg>...[<sha>]`
   (`sites/colossus-scaffolding/vercel.json:5` and 6 siblings). In turborepo this parses
   to `GitRange { from_ref: Some(sha), to_ref: None, include_uncommitted: true }`
   (`crates/turborepo-scope/src/target_selector.rs`). Because `include_uncommitted` is
   true, `turborepo-scm/src/git.rs::changed_files` runs
   `git ls-files --others --modified --exclude-standard -z` **in addition to** the
   commit-to-commit diff.

4. So the PNGs `.vercelignore` just deleted are reported as modified. Any such file
   inside a package directory marks that package affected — permanently, on every build,
   regardless of what the commit actually changed.

**Why exactly these four sites.** The mechanism is package-scoped, not global. A site is
exposed if and only if it has ≥1 tracked file matching a `.vercelignore` pattern
_inside its own package directory_:

| Site                                                  | Tracked matches in own package dir                   | Exposed                   |
| ----------------------------------------------------- | ---------------------------------------------------- | ------------------------- |
| `colossus-scaffolding`                                | 12 — `e2e/visual-regression.spec.ts-snapshots/*.png` | **Yes**                   |
| `npracing-v1`                                         | 2 — `app/icon.png`, `app/apple-icon.png`             | **Yes**                   |
| `npracing-v3`                                         | 2 — `app/icon.png`, `app/apple-icon.png`             | **Yes**                   |
| `dcs` (`@platform/dcs`)                               | 1 — `public/social-share.png`                        | **Yes**                   |
| `dj-fox-electrical`, `dch-automotive`, `mad-graphics` | 0                                                    | No                        |
| `packages/*`, `tools/*`                               | 0                                                    | No (no transitive vector) |

That is exactly the reported symptom set. **`*.png` is the only pattern in
`.vercelignore` with any tracked match inside a package directory** — every other
pattern (`node_modules`, `.turbo`, `.next`, `playwright-report`, `test-results`,
`.code-review-graph`, `supabase`, `*.tsbuildinfo`) has zero tracked matches anywhere.

### The cache-restoration hypothesis is disproven

`Restored build cache from previous deployment` precedes `Running "…turbo-ignore…"`
in **every** log examined — identically in the four broken projects and the three
correctly-skipping ones. Since the ordering is the same on both sides of the split, it
cannot be the differentiator.

### Why the local test disagreed

The local reproduction was the right experiment run against the wrong pattern. Deleting
`output/` locally correctly yields "not affected" — because `output/`, `.claude/`,
`.agents/` and `tasks/` sit outside every `pnpm-workspace.yaml` glob
(`packages/*`, `sites/*`, `tools/*`) and are not in `turbo.json`'s
`globalDependencies` (`["**/.env.*local"]`), so turbo has no package to attribute them
to and ignores them entirely. Only the PNGs _inside package directories_ matter, and
those were never deleted in the local test.

### Reproduction (verified)

Throwaway clone at `6ac7a020`, base SHA `7caf6c23`, turbo 2.5.8 resolved from `^2.4.3`.
Command in every row:
`npx -y turbo@^2.4.3 run build --filter="<pkg>...[7caf6c23…]" --dry=json`

| #   | Working-tree state                             | Result                                                                                |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| A   | clean                                          | `colossus: []`                                                                        |
| B   | delete all 118 tracked `*.png`                 | `colossus: ["colossus-scaffolding"]`                                                  |
| C   | delete **only** colossus's 12 PNGs             | `colossus` affected; `@platform/dcs: []`                                              |
| D   | full `.vercelignore` **incl.** `*.png`         | colossus, `@platform/dcs`, npracing-v1, npracing-v3 affected; `dj-fox-electrical: []` |
| E   | full `.vercelignore` **minus** `*.png`         | all four `[]`                                                                         |
| F   | delete only `output/ .claude/ .agents/ tasks/` | all `[]`                                                                              |

Positive controls (affected-detection is **not** broken in the other direction): a
`vercel.json`-only edit → affected; an `app/layout.tsx` edit → affected; a real source
commit range → affected.

Row D reproduces production exactly, including which sites skip.

## Blast radius

**24 unnecessary full builds, confirmed exactly**, in the window since `1c4b782e`
landed: 6 consecutive commits (`6ac7a020`, `df44027b`, `0ec2e78e`, `70de1ae6`,
`c722a35a`, `9c92dc68` — each touching only `output/sessions/**` or docs) × 4 projects,
all `READY`, none skipped.

Over a 20-deployment sample per project (includes the pre-`1c4b782e` era, which had the
separate `.git` fail-open bug):

| Project              | Unnecessary / 20 | Still broken today |
| -------------------- | ---------------- | ------------------ |
| colossus-scaffolding | 18               | **Yes**            |
| dcs                  | 18               | **Yes**            |
| npracing-v3          | 18               | **Yes**            |
| npracing-v1          | 15               | **Yes**            |
| dch-automotive       | 13 (all pre-fix) | No                 |
| mad-graphics         | 13 (all pre-fix) | No                 |
| dj-fox-electrical    | 13 (all pre-fix) | No                 |

Queries: `mcp__claude_ai_Vercel__list_projects` / `list_deployments` (20 each) against
`team_wr412hUEEmAULurOOD1ZPXfm`, cross-referenced with `git diff --stat <sha>^ <sha>`.

**Decisive live negative control.** On the _same_ commit `0ec2e78e`, `dch-automotive`
and `mad-graphics` logged:

```
≫ Found previous deployment ("c722a35a…") for "dch-automotive" on branch "develop"
≫ This project and its dependencies are not affected
⏭ Ignoring the change
The deployment was canceled because the Ignored Build Step command returned exit code 0.
```

The skip mechanism demonstrably works in this repo, on this `turbo.json`, for the three
sites with zero tracked PNGs — and fails for the four that have them. Independent
confirmation of the mechanism from production.

Sibling call sites (all identical pattern): `sites/{colossus-scaffolding,dch-automotive,dcs,dj-fox-electrical,mad-graphics,npracing-v1,npracing-v3}/vercel.json:5`.

## Second defect found: `*.png` is also stripping live production assets

Not part of the reported symptom, but caused by the same line and currently shipping.
Because `.vercelignore` deletes these files before `next build` runs, they are absent
from production output:

| Asset                                              | Live result | Control in the same directory                   |
| -------------------------------------------------- | ----------- | ----------------------------------------------- |
| `digitalconsultingservices.co.uk/social-share.png` | **404**     | `favicon.svg`, `logo.svg`, `dcs-mark.svg` → 200 |
| npracing-v1 `/icon.png`, `/apple-icon.png`         | **404**     | `app/favicon.ico` → 200                         |
| npracing-v3 `/icon.png`, `/apple-icon.png`         | **404**     | —                                               |

The SVG/ICO controls sit in the _same_ directory in the _same_ deployment; the only
difference is the `*.png` match. This is proof `.vercelignore` applies to git-triggered
builds.

Customer-facing consequence: the DCS homepage serves
`<meta property="og:image" content="https://www.digitalconsultingservices.co.uk/social-share.png"/>`
pointing at a 404 — **every DCS link preview is broken**. The npracing sites emit no
`icon.png`/`apple-touch-icon` link at all. Both were introduced silently: no build error,
no failing test.

## History

**Introduced:** `71893624` — 2026-08-23 — _"chore: exclude local build artifacts from CLI
vercel deploy uploads"_. Created `.vercelignore` from scratch with all patterns at once,
including `*.png`. It solved a real problem (CLI `vercel deploy` swept 15,782 files vs
3,367 tracked). Its load-bearing wrong claim:

> "Git-triggered deploys are unaffected (Vercel clones fresh), but this protects any
> future local CLI deploy."

The 12 colossus PNGs had been tracked since `7523dfe4` (2026-04-22), four months
earlier — so the defect went live the moment `.vercelignore` was created.

**Prior partial fixes:**

1. `9d9e9f2c` (2026-08-05) — restored `ignoreCommand` after April's `2ea58db7` removed it
   platform-wide on the false premise that Vercel skips natively. Predates `.vercelignore`.
2. `105e08bd` (2026-08-27) — added `--fallback=HEAD^1` for the shallow-clone
   unreachable-SHA fail-open. **Its own message says it was "verified locally with a
   clean tree"** — precisely the condition that cannot reproduce this bug.
3. `1c4b782e` (2026-09-02) — removed only the `.git` line. Correctly diagnosed the
   general mechanism ("`.vercelignore` applies before ignoreCommand runs on every build,
   git-push-triggered included") but applied it to one entry only, leaving `*.png` —
   the entry that actually matters — in place.

Each fix was real and each verification was structurally blind to the next layer.
`866f2bf2` (2026-04-08) additionally codified the wrong April belief into CLAUDE.md as
platform doctrine for four months.

No prior write-up of the `.vercelignore` ↔ turbo-ignore interaction exists in
`output/sessions/**` or `docs/**`.

## Open questions / disagreements

1. **Broad vs narrow invariant — resolved against the agent that proposed it.** The
   regression-test author proposed asserting that _no tracked file anywhere_ may match
   a `.vercelignore` pattern, reasoning that "a tracked file anywhere in the repo …
   corrupts the diff for every site's build." **Reproduction row F refutes that**:
   deleting `output/`, `.claude/`, `.agents/` and `tasks/` changed nothing for any site.
   The broad invariant also fails on 1,227 files today, 1,210 of them harmless, and
   satisfying it would mean untracking `output/sessions/**`, which is tracked
   deliberately. The evidence-backed invariant is the narrow one, and it matches the
   proven cause exactly — `git ls-files -ci --exclude-from=.vercelignore -- sites packages tools`
   returns precisely the 17 files, byte-identical to the set that causes the flip.
2. **Vercel's `.vercelignore` parser vs git's gitignore engine.** The test below uses
   git's engine as a proxy. Vercel documents `.vercelignore` as gitignore-style but
   ships its own parser. For the patterns actually present (bare names, simple `*.ext`)
   divergence is very unlikely — but this is an **assumption**, not verified.
3. **Dashboard-level "Ignored Build Step" overrides** could not be read by the available
   Vercel API tooling — **UNKNOWN**. Not needed to explain the symptom, since the build
   logs show the `vercel.json` command running verbatim.
4. **turbo-ignore deprecation.** Build logs confirm the notice prints:
   `≫ "turbo-ignore" is deprecated. Use Vercel's built-in project skipping instead.`
   Not the cause here, and CLAUDE.md records that the April attempt to act on a similar
   claim caused a four-month regression. Evaluate `turbo query affected` deliberately,
   separately — **not** as part of this fix.
5. The four `*.png` deletions in `sites/colossus-scaffolding/e2e/**` are legitimate
   Playwright visual baselines regenerated by `.github/workflows/generate-visual-baselines.yml`.
   They should stay tracked; the fix belongs on the `.vercelignore` side.

## Fix applied — 2026-09-03

Executed as a direct fix. Changes:

| File                                                  | Change                                                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `.vercelignore`                                       | Removed the `*.png` line; replaced with a comment recording why it must not return |
| `tools/__tests__/vercel-ignore-tracked-files.test.ts` | New — enforces the narrow invariant + the `ignoreCommand` contract                 |
| `.github/workflows/ci.yml`                            | New `quality-checks` step running that test (scoped to the one file)               |
| `CLAUDE.md`                                           | Two new rules under "Vercel Monorepo Configuration"                                |

Verification actually run:

- Invariant: `git ls-files -ci --exclude-from=.vercelignore -- sites packages tools` → **0** (was 17).
- Regression test: **11 passed**. Re-adding `*.png` makes it fail with the exact 17-file diagnostic, then pass again on removal — so it genuinely detects the defect rather than passing vacuously.
- Reproduction row E against the real fixed file, in a throwaway clone at `6ac7a020`: colossus, `@platform/dcs`, npracing-v1, npracing-v3, dj-fox, dch, mad-graphics → **all `[]`**.
- Positive controls under the fixed file: `app/layout.tsx` edit → colossus affected; `@platform/theme-system` edit → colossus, dcs **and** dj-fox all affected (dependency fan-out intact). A `@platform/core-components` edit correctly leaves dcs unaffected — dcs depends only on `theme-system`.
- `ci.yml` parses; prettier clean.

### Deployed and verified in production — 2026-09-04

Promoted `develop` → `staging` → `main` (`ce525bf8`, PR #76). All CI, E2E and
Regression Watchdog checks green; the new CI step ran and passed in real CI.

**Skip behaviour restored (the reported symptom).** On both the develop push
(`a608519c`) and the staging merge (`6a7f7745`), all four sites were `CANCELED`
where they would previously have built. Colossus's log:

```
Removed 1209 ignored files defined in .vercelignore      (was 1226 — the 17 PNGs now survive)
≫  Found previous deployment ("d431077b…") for "colossus-scaffolding" on branch "staging"
≫  This project and its dependencies are not affected
⏭ Ignoring the change
```

Correctness confirmed in both directions: npracing-v1 still _built_ for its own
content commits, and only skipped for the commits that genuinely did not touch it.

**Trap found during rollout — the assets do not self-heal.** With turbo-ignore
working correctly, the sites that needed a rebuild to restore their stripped PNGs
were precisely the ones it now (correctly) refused to rebuild — dcs's production
deploy at `ce525bf8` logged "This project and its dependencies are not affected"
and cancelled, leaving the 404s in place. Fixing the cause does not repair the
already-published output; that needs one forced build per affected site.

Resolved with `vercel redeploy <last-production-deployment>`, which empirically
**does** bypass the Ignored Build Step (verified by observing it build rather than
cancel — Vercel's docs do not state this either way, so it was tested, not assumed):

| Site                 | Action                                              | Result                                                               |
| -------------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| dcs                  | `vercel redeploy`                                   | `/social-share.png` **200**; homepage `og:image` resolves end-to-end |
| npracing-v1          | none needed — self-healed via its own content build | `/icon.png`, `/apple-icon.png` **200**                               |
| npracing-v3          | `vercel redeploy`                                   | `/icon.png`, `/apple-icon.png` **200**                               |
| colossus-scaffolding | none needed                                         | its 12 PNGs are Playwright baselines, never shipped                  |

Gate (b) is now fully satisfied.

**Superseded note:** gate (b)'s production half — `/social-share.png`, `/icon.png` and `/apple-icon.png` must return 200 after the first deploy carrying this change, and an unrelated push must log `⏭ Ignoring the change` for the four sites. Neither can be confirmed until it ships.

## Original remediation plan (as investigated)

The `*.png` line is **all cost and no benefit**. 101 of the 118 tracked PNGs live under
`output/`, already excluded wholesale by the `output` rule. The line's only marginal
effect is deleting the 17 PNGs inside package directories — which is exactly the defect.

1. **Dry-run / scope report** (hermetic, read-only):

   ```
   git ls-files -ci --exclude-from=.vercelignore -- sites packages tools
   ```

   Expect 17 files. Then confirm the CLI-upload cost of removing the rule:

   ```
   git ls-files '*.png' | grep -v '^output/' | xargs stat -f%z | awk '{s+=$1} END {print s/1048576" MB"}'
   ```

   Expect ~16.2 MB across 17 files re-entering CLI uploads (`output/`-based PNGs stay excluded).

2. **Review that scope report before executing.**

3. **Execute (targeted):** delete the single `*.png` line from `.vercelignore`. Replace
   it, if upload-size protection is still wanted, only with patterns that provably match
   zero tracked files, verified by re-running step 1. Do **not** untrack any asset, do
   **not** touch the other `.vercelignore` entries, and do **not** change `ignoreCommand`
   or migrate off turbo-ignore in this change.

4. **Verify before promoting:** re-run reproduction row E in a throwaway clone (expect
   `[]` for all four sites), then confirm on the first real deploy that colossus/dcs/
   npracing log `⏭ Ignoring the change` for an unrelated push, and that
   `/social-share.png`, `/icon.png`, `/apple-icon.png` return 200.

5. Update CLAUDE.md's "Vercel Monorepo Configuration" section — it documents this class
   of bug three times over and still does not mention `.vercelignore`.

**Gate contract for the fix**

- **(a) Golden-fixture test:** the regression test below, run against the real repo.
- **(b) Invariant on real data:** `git ls-files -ci --exclude-from=.vercelignore -- sites packages tools`
  returns empty; and post-deploy, the three previously-404 asset paths return 200.
- **(c) Rollback:** see below.
- **(d) Hard fail:** the fix is rejected if reproduction row E returns anything other
  than `[]` for all four sites; if the positive controls stop reporting affected (that
  would mean real changes no longer trigger builds — far worse than the current bug); or
  if step 1 reports 0 files on a non-empty repo (indicates the check itself is broken and
  passing vacuously).

## Rollback

Single-file, single-line change, no data migration:

```
git revert <fix-sha>      # or: git checkout <fix-sha>^ -- .vercelignore
```

Then push through develop → staging → main as normal. Reverting restores today's
behaviour exactly (unnecessary rebuilds + stripped PNGs); there is no persistent state
to unwind. Vercel build caches are keyed by content hash and self-correct.

## Regression test (not yet added to the suite)

**Path:** `tools/__tests__/vercel-ignore-tracked-files.test.ts` — matches the existing
convention (14 monorepo-wide tests already live there with their own
`tools/__tests__/vitest.config.ts`).

**Known CI gap (pre-existing, out of scope):** `tools/` is not a pnpm workspace member,
so `turbo run test` never reaches `tools/__tests__/`. Those 14 existing tests are already
orphaned from CI. This test therefore needs its own explicit step in
`.github/workflows/ci.yml`'s `quality-checks` job, scoped to this one file so it does not
silently resurrect 13 dormant tests:

```yaml
- name: Deployment safety checks (.vercelignore vs git-tracked files)
  run: npx vitest run --config tools/__tests__/vitest.config.ts tools/__tests__/vercel-ignore-tracked-files.test.ts
```

**Shell one-liner** (for humans, run from repo root — empty output means the invariant holds):

```
git ls-files -ci --exclude-from=.vercelignore -- sites packages tools
```

```ts
import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Regression test for: ".vercelignore deletes git-tracked files, so turbo-ignore
 * sees every site as affected on every push."
 *
 * WHY THIS NEEDS A STANDING TEST RATHER THAN VIGILANCE
 *
 * Vercel applies .vercelignore to the build working tree BEFORE each site's
 * ignoreCommand (`npx turbo-ignore <pkg> --fallback=HEAD^1`) runs. turbo-ignore's
 * filter `<pkg>...[<sha>]` sets include_uncommitted, so turbo also runs
 * `git ls-files --others --modified`. A tracked file deleted from disk but still
 * in the index reports as modified — so a .vercelignore pattern that matches a
 * tracked file inside a package directory marks that package changed on EVERY
 * build, forever.
 *
 * Nothing errors and nothing goes red: every project just rebuilds on every push,
 * silently burning build minutes, and (as of the 2026-09-03 incident) silently
 * stripping real assets like sites/dcs/public/social-share.png out of production.
 * That is exactly the shape of bug a cheap always-on invariant should catch.
 *
 * SCOPE — deliberately narrow, and this matters.
 * The invariant is scoped to workspace package directories (sites/, packages/,
 * tools/), NOT the whole repo. Reproduction showed deleting root-level tracked
 * paths (output/, .claude/, .agents/, tasks/) changes nothing: they sit outside
 * every pnpm-workspace glob and are not in turbo.json globalDependencies, so turbo
 * has no package to attribute them to. A repo-wide assertion would fail on 1,227
 * files (1,210 of them harmless) and could only be satisfied by untracking
 * output/sessions/**, which is tracked on purpose.
 *
 * MATCHING: delegates to git's own gitignore engine rather than hand-rolling a
 * glob matcher —
 *   git ls-files -ci --exclude-from=.vercelignore -- sites packages tools
 *   -c cached (tracked only) | -i ignored (matching the exclude patterns)
 * Reading patterns from the real .vercelignore, never a hand-copied list.
 *
 * UNVERIFIED ASSUMPTION: that Vercel's own .vercelignore parser matches git's
 * gitignore engine. Vercel documents .vercelignore as gitignore-style but ships
 * its own parser. For the patterns actually in the file (bare names, simple
 * *.ext globs — no negation, globstars, anchors or character classes) divergence
 * is very unlikely, but it is an assumption, not a checked fact.
 */

const REPO_ROOT = join(__dirname, "..", "..");
const WORKSPACE_DIRS = ["sites", "packages", "tools"];

describe(".vercelignore vs git-tracked files inside workspace packages", () => {
  it("has patterns to check against (fixture sanity)", () => {
    const patterns = readFileSync(join(REPO_ROOT, ".vercelignore"), "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("#"));
    expect(patterns.length).toBeGreaterThan(0);
  });

  it("is running against a real checkout (fixture sanity)", () => {
    // Without this, the assertion below could pass vacuously outside a git tree.
    const tracked = execSync("git ls-files", { cwd: REPO_ROOT, encoding: "utf8" })
      .split("\n")
      .filter(Boolean).length;
    expect(tracked).toBeGreaterThan(100);
  });

  it("matches no git-tracked file inside any workspace package", () => {
    const matches = execSync(
      `git ls-files -ci --exclude-from=.vercelignore -- ${WORKSPACE_DIRS.join(" ")}`,
      { cwd: REPO_ROOT, encoding: "utf8" }
    )
      .split("\n")
      .filter(Boolean);

    if (matches.length > 0) {
      const sample = matches.slice(0, 25);
      const more =
        matches.length > sample.length ? `\n…and ${matches.length - sample.length} more` : "";
      throw new Error(
        `${matches.length} git-tracked file(s) inside a workspace package match a ` +
          `pattern in the root .vercelignore.\n\n` +
          `Vercel deletes these from the build working tree before turbo-ignore runs. ` +
          `turbo then sees them as uncommitted deletions and marks their package ` +
          `"affected" on every single push — and the files are also missing from the ` +
          `production build output.\n\n` +
          `Fix by narrowing the .vercelignore pattern (anchor it with a leading "/", ` +
          `or scope it to an untracked path) — not by untracking the asset.\n\n` +
          sample.join("\n") +
          more
      );
    }
  });
});

describe("every deployed site declares a turbo-ignore ignoreCommand", () => {
  const sitesDir = join(REPO_ROOT, "sites");
  // Only sites deployed as their own Vercel project carry a vercel.json —
  // base-template and showcase intentionally do not (confirmed: no Vercel
  // project exists for either).
  const deployed = readdirSync(sitesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((n) => existsSync(join(sitesDir, n, "vercel.json")));

  it("found deployed sites to check (fixture sanity)", () => {
    expect(deployed.length).toBeGreaterThan(0);
  });

  it.each(deployed)(
    "sites/%s/vercel.json has a turbo-ignore ignoreCommand with --fallback=HEAD^1",
    (site) => {
      const cfg = JSON.parse(readFileSync(join(sitesDir, site, "vercel.json"), "utf8")) as {
        ignoreCommand?: string;
      };
      const pkg = JSON.parse(readFileSync(join(sitesDir, site, "package.json"), "utf8")) as {
        name: string;
      };

      expect(
        cfg.ignoreCommand,
        `sites/${site}/vercel.json is missing "ignoreCommand" — without it Vercel ` +
          `builds this project unconditionally on every push; there is no automatic ` +
          `skip-if-unaffected behaviour for monorepo rootDirectory projects.`
      ).toBeDefined();

      const escaped = pkg.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      expect(
        cfg.ignoreCommand,
        `sites/${site}/vercel.json's ignoreCommand does not match the expected ` +
          `"cd ../.. && npx turbo-ignore ${pkg.name} --fallback=HEAD^1". The ` +
          `--fallback flag is load-bearing: without it turbo-ignore fails open once ` +
          `its diff target SHA falls outside Vercel's shallow clone.`
      ).toMatch(new RegExp(`cd \\.\\./\\.\\. && npx turbo-ignore ${escaped} --fallback=HEAD\\^1`));
    }
  );
});
```

**Current status against the real repo:** the first suite **fails** (17 matches) —
correct for an unfixed defect. The second suite **passes** for all 7 deployed sites.

**What this test does not cover:** Vercel-parser-vs-git-parser drift on exotic glob
syntax; CLI-upload behaviour specifically; the pre-existing `tools/__tests__` CI-wiring
gap; and whether `.git` stays unexcluded (covered by `.vercelignore`'s own header
comment, and `.git` is not a tracked file).
