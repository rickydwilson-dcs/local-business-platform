# Plan — make the promotion gate blocking (residual F7) via PR-based promotion

**Status:** proposal, read-only. No deploy files changed by this document.
**Depends on:** Phase 3 (`scripts/verify-staging-e2e.ts` + the `verify-staging-e2e` job in
`deploy.yml`), already committed (`7c9fb37f`) and pushed to `develop`.
**Goal:** turn the Phase-3 gate from a _trustworthy signal_ into an _actual block_ — make it
impossible for `main` to advance to a commit whose staging E2E was not green, without
touching per-site Vercel config.

---

## Why this approach (recap)

Every site is its own Vercel project keyed off `main`. Gating at the **git layer** (one
place — `main`) blocks all of them at once, versus a Vercel-side fix that must be repeated
and token-managed per project. So: make the only path to `main` a **pull request** that
cannot merge unless `verify-staging-e2e` passes. Vercel keeps deploying on push to `main` —
but `main` now only moves via a gated merge, so the deploy is gated transitively. No Vercel
change required.

---

## ⚠️ Must-verify BEFORE rollout (do not skip)

1. **Which branch does each Vercel project deploy Production from?**
   `docs/guides/git-workflow.md` says `main` = Production, but `deploy-to-production.sh`
   also runs `git push origin main:production` — pushing a separate `production` branch.
   If **any** Vercel project's Production Branch is `production` (not `main`), gating `main`
   does **not** gate that project — the `main:production` push bypasses the PR entirely.
   - Action: in the Vercel dashboard, for each site project, read Settings → Git →
     Production Branch. Confirm it is `main` for all of them.
   - If any use `production`: either (a) repoint them to `main`, or (b) also protect
     `production` and stop the direct `main:production` push (see Step 3, Option B).
2. **Is "Allow auto-merge" enabled** in repo Settings → General? Required for
   `gh pr merge --auto` in the reworked deploy script (Step 3).
3. **Confirm the exact check name** GitHub shows for the gate job. It will be the job
   `name:` — currently `Verify promoted commit passed staging E2E`. Branch protection
   matches the check by that string, so it must be stable.

---

## Step 1 — Branch protection on `main` (repo-admin; the load-bearing change)

This is the piece that makes the gate blocking. In Settings → Branches → add a rule for
`main` (or a ruleset):

- ✅ **Require a pull request before merging.** (No direct pushes to `main`.)
  - Optional: require 1 approval. Not strictly needed for the gate, but recommended for
    production.
- ✅ **Require status checks to pass before merging**, and add the required check:
  - `Verify promoted commit passed staging E2E` (the `verify-staging-e2e` job).
  - ✅ **Require branches to be up to date before merging** — so the check reflects the
    current merge target, not a stale run.
- ✅ **Do not allow bypassing the above settings** (include administrators). Without this,
  an admin `git push --no-verify origin main` still works and F7 is not actually closed.
- ✅ **Restrict deletions** / optionally **Require linear history**.

> **Break-glass:** with bypass disabled, an emergency hotfix cannot go direct to `main`.
> Document the procedure: temporarily disable the ruleset, push, re-enable — and record it.
> This is a deliberate tradeoff: unattended safety over one-off convenience.

Why admin does this and not me: it changes deploy policy for every human and automation on
the repo, and needs admin rights I don't have. It is a decision, not a mechanical edit.

---

## Step 2 — Add a `pull_request` trigger to the gate (`deploy.yml`) — I can do this

Today `deploy.yml` runs on `push` to `main`, i.e. _after_ the merge. For the check to gate a
PR it must also run on the PR. Two edits:

1. Add the trigger:
   ```yaml
   on:
     push:
       branches: [main]
       paths-ignore: ["output/**", "docs/**", "**/*.md"]
     pull_request:
       branches: [main]
       paths-ignore: ["output/**", "docs/**", "**/*.md"]
   ```
2. Make the "Resolve promoted staging commit" step event-aware. In a `pull_request`, the
   promoted commit is the PR head (the staging tip), which is exact and needs no parent
   parsing:
   ```bash
   if [ "${{ github.event_name }}" = "pull_request" ]; then
     SHA="${{ github.event.pull_request.head.sha }}"
   else
     read -r _ _P1 P2 _ <<< "$(git rev-list --parents -n 1 HEAD)"
     if [ -n "$P2" ]; then SHA="$P2"; else SHA="$GITHUB_SHA"; fi
   fi
   echo "sha=$SHA" >> "$GITHUB_OUTPUT"
   ```

Note the `paths-ignore` interaction: if a promotion PR touches **only** docs, the gate job
won't run and (with "require branches up to date" + required check) the PR can't merge until
the check reports. Decide whether docs-only promotions should be allowed to skip the gate.
Recommended: drop `paths-ignore` on the `pull_request` trigger so the gate always runs on a
promotion PR (a docs-only prod promotion is rare and cheap to gate).

---

## Step 3 — Rework `deploy-to-production.sh` from direct-push to gated PR — I can do this

Current: checkout main → `git merge staging` → `git push origin main` → `git push origin
main:production`. With Step 1 in place, `git push origin main` will be **rejected** (no
direct pushes), so the script must change.

**Option A (recommended): open a PR and auto-merge on green.**

```bash
# ...existing sync + summary + confirm...

STAGING_SHA=$(git rev-parse origin/staging)

# Optional fast local pre-check (keeps the current early signal; not the real gate):
echo "🔒 Pre-checking staging E2E for $STAGING_SHA..."
npx tsx scripts/verify-staging-e2e.ts --sha="$STAGING_SHA" || {
  echo "❌ Staging E2E not green for $STAGING_SHA — not opening a promotion PR."
  exit 1
}

# Reuse an open staging→main PR if present, else create one.
PR=$(gh pr list --base main --head staging --state open --json number --jq '.[0].number')
if [ -z "$PR" ]; then
  PR=$(gh pr create --base main --head staging \
        --title "Promote staging → main ($TODAY)" \
        --body "$COMMITS" --json number --jq '.number')
fi

# Let GitHub merge it the moment the required check (verify-staging-e2e) passes.
gh pr merge "$PR" --auto --merge
echo "⏳ Auto-merge armed on PR #$PR. It will merge to main only when the gate is green."
echo "   Watch: gh pr checks $PR --watch"
```

- `--auto` requires "Allow auto-merge" (must-verify #2). The merge happens only after the
  required check passes — this is the block.
- **The `main:production` push must be re-homed.** It can no longer live in this script
  (which no longer pushes `main`). Move production promotion to a workflow that runs _on
  push to `main`_ (i.e. after the gated merge), e.g. a job in `deploy.yml` that does
  `git push origin HEAD:production`. That keeps `production` a strict mirror of gated `main`.
  Only needed if any project deploys from `production` (must-verify #1).

**Option B (if any Vercel project deploys from `production`):** also add a branch-protection
rule on `production` and generate it only from `main` via the post-merge workflow above —
never pushed by hand. Then gating `main` gates `production` by construction.

---

## Rollout order (so you never have a window where deploys are unguarded OR wedged)

1. **Merge Phases 2+3 up the staircase first** (develop → staging → main) so `deploy.yml`
   already contains the `verify-staging-e2e` job on `main` before you require it. Requiring a
   check that doesn't exist yet wedges all merges.
2. Do **Step 2** (add `pull_request` trigger) and let it run once on a throwaway PR to
   confirm the check appears with the expected name.
3. Do **Step 1** (branch protection), referencing that confirmed check name.
4. Do **Step 3** (deploy script rework) and dry-run one promotion.
5. Re-home the `production` push (Step 3 tail) if must-verify #1 says any project needs it.

---

## Verification (definition of done)

- A staging→main PR whose head commit has a **failing/absent** staging E2E run **cannot**
  be merged (required check red). Confirm with a deliberately-red staging commit.
- A staging→main PR whose head commit is **green** merges (auto-merge fires), `main`
  advances, Vercel deploys.
- A direct `git push origin main` (even `--no-verify`, even as admin) is **rejected**.
- If `production` is in play: `production` only ever moves via the post-merge workflow, and
  is itself protected from direct pushes.

---

## What stays open after this

- **F4** (per-failure triage errors swallowed in `index.ts`) — orthogonal; a real
  regression can still yield no issue. Separate fix.
- **F10** (CI content-validation runs one site only) — separate, low-ish risk.
- **F11** (results path defined in three places) — fragility cleanup; the Phase-2 gate now
  catches the _symptom_ (missing/empty results → FAIL) but the duplication remains.

These are independent of F7 and can be scheduled separately.
