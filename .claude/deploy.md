# Deploy config

base-branch: develop
promotion: staircase
promotion-target: main
docs: update.docs

## Gates

Pre-push hooks already enforce `type-check` and `lint` (turbo, all packages) on every
`git push`, and re-verify staging E2E before allowing a push to `main`. No extra gates
need to be declared here. Per CLAUDE.md, still run `pnpm --filter <site> run lint` for
each modified site before committing, as a fast pre-commit check.

## Promotion — staircase with a PR-gated final rung

develop → staging → main, but the two rungs behave differently:

- **develop → staging**: plain `git push origin staging` after a local
  `git merge develop`. Gate on develop's CI (`gh run watch`) before merging up.
- **staging → main**: `main` is a GitHub-protected branch. A direct push is
  rejected with `GH006: Protected branch update failed` — pushing requires a
  PR, and GitHub also runs a required status check ("Verify promoted commit
  passed staging E2E") that the local pre-push hook pre-verifies for you.
  Do **not** attempt `git push origin main` after merging staging into a local
  main. Instead:

  ```bash
  gh pr create --base main --head staging --fill
  ```

  Report the PR URL and stop — do not merge it. A human (or the required
  check) owns the merge into `main`.

Gate on staging's E2E CI (`gh run watch`) before opening the PR into `main`.
