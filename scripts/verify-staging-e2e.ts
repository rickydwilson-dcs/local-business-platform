#!/usr/bin/env npx tsx
/**
 * Verify staging E2E for a specific commit — the promotion gate (Phase 3).
 *
 * The old gate (in .husky/pre-push) had three holes this closes:
 *   F8 — it lived only in a local hook that failed OPEN when `gh` was missing
 *        and was bypassable with `--no-verify`.
 *   F9 — it read the *latest* staging "E2E Tests" run, not the run for the
 *        commit actually being promoted, so a stale green satisfied it.
 *   F7 — nothing server-side verified staging E2E before main advanced.
 *
 * This checks the E2E Tests workflow run for one exact commit SHA on the staging
 * branch and requires conclusion == "success". It is deliberately FAIL-CLOSED:
 * a missing token, a missing run, an in-progress run, or any API error all exit
 * non-zero. "I could not prove it is green" is treated as "it is not green".
 *
 * Usage:
 *   npx tsx scripts/verify-staging-e2e.ts --sha=<commit> [--repo=<owner/repo>]
 *                                         [--workflow=e2e-tests.yml] [--branch=staging]
 *
 * Auth: GITHUB_TOKEN (CI) or, locally, falls back to `gh auth token`.
 */
import { execSync } from "child_process";

interface Args {
  sha: string;
  repo: string;
  workflow: string;
  branch: string;
}

function resolveRepo(): string {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  // Local runs (pre-push hook, deploy script) have no GITHUB_REPOSITORY — derive
  // owner/repo from the origin remote so the caller doesn't have to pass --repo.
  try {
    const remote = execSync("git remote get-url origin", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    const match = remote.match(/[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
    if (match) return match[1];
  } catch {
    // fall through
  }
  return "";
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (key: string) =>
    argv
      .find((a) => a.startsWith(`--${key}=`))
      ?.split("=")
      .slice(1)
      .join("=");
  return {
    sha: get("sha") ?? "",
    repo: get("repo") ?? resolveRepo(),
    workflow: get("workflow") ?? "e2e-tests.yml",
    branch: get("branch") ?? "staging",
  };
}

function fail(message: string): never {
  console.error(`[promotion-gate] ❌ FAIL — ${message}`);
  console.error(
    "[promotion-gate] Refusing to treat the promotion as safe. This gate fails closed by design."
  );
  process.exit(1);
}

function resolveToken(): string {
  const envToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (envToken) return envToken;
  try {
    const tok = execSync("gh auth token", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    if (tok) return tok;
  } catch {
    // fall through to fail-closed
  }
  return "";
}

interface WorkflowRun {
  id: number;
  head_sha: string;
  event: string; // push | pull_request | workflow_dispatch | ...
  status: string; // queued | in_progress | completed
  conclusion: string | null; // success | failure | cancelled | timed_out | ...
  html_url: string;
  created_at: string;
}

async function main() {
  const { sha, repo, workflow, branch } = parseArgs();

  if (!sha) fail("no --sha given. Pass the exact commit being promoted.");
  if (!repo) fail("no repo. Pass --repo=<owner/repo> or set GITHUB_REPOSITORY.");

  const token = resolveToken();
  if (!token) {
    fail(
      "no GitHub token available (GITHUB_TOKEN unset and `gh auth token` failed). " +
        "Cannot verify staging E2E — refusing to pass."
    );
  }

  // event=push is essential: the same commit also produces a pull_request-
  // triggered E2E run when a staging->main PR is opened, and that run SKIPS all
  // jobs (its conclusion is "skipped"). Without this filter the verifier could
  // pick the newer skipped PR run and fail-closed on a genuinely-green commit.
  const url =
    `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/runs` +
    `?head_sha=${encodeURIComponent(sha)}&branch=${encodeURIComponent(branch)}` +
    `&event=push&per_page=20`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (err) {
    return fail(`GitHub API request failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!res.ok) {
    return fail(`GitHub API returned ${res.status} ${res.statusText} for ${workflow} runs.`);
  }

  const body = (await res.json()) as { workflow_runs?: WorkflowRun[] };
  // Defensively re-filter to push events in case the API param is ever ignored —
  // a skipped pull_request run must never be mistaken for the real staging run.
  const runs = (body.workflow_runs ?? []).filter((r) => r.event === "push");
  const shortSha = sha.slice(0, 8);

  if (runs.length === 0) {
    return fail(
      `no push-triggered "${workflow}" run found on ${branch} for commit ${shortSha}. ` +
        "The promoted commit was never E2E-tested on staging."
    );
  }

  // Newest first (the API returns most-recent first, but sort defensively).
  runs.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const latest = runs[0];

  if (latest.status !== "completed") {
    return fail(
      `staging E2E for ${shortSha} is still ${latest.status} (not completed). ${latest.html_url}`
    );
  }

  if (latest.conclusion !== "success") {
    return fail(
      `staging E2E for ${shortSha} concluded "${latest.conclusion}", not success. ${latest.html_url}`
    );
  }

  console.log(
    `[promotion-gate] ✅ PASS — staging E2E for ${shortSha} succeeded (${latest.html_url}).`
  );
  process.exit(0);
}

main().catch((err) => {
  fail(`unexpected error: ${err instanceof Error ? err.message : String(err)}`);
});
