/**
 * Regression Watchdog — deploy gate
 *
 * The watchdog was previously observation-only: it opened GitHub issues but
 * could never fail its own check, so a broken run and a healthy run looked
 * identical (green + silence). `evaluateGate` is the missing verdict — it turns
 * a Playwright smoke-results file into an explicit pass/fail with a reason, and
 * it treats every ambiguous signal (missing file, empty/fabricated report, zero
 * tests) as a FAILURE rather than a pass. Nothing here fabricates an "ok".
 *
 * Pure and dependency-free so it can be unit- and fault-injection-tested without
 * running Playwright or touching the network.
 */
import type { PlaywrightReport } from "./types";

export type GateCode =
  | "PASS"
  | "SMOKE_EXIT_NONZERO"
  | "MISSING_RESULTS"
  | "EMPTY_RESULTS"
  | "UNPARSEABLE_RESULTS"
  | "INVALID_SHAPE"
  | "NO_TESTS_RAN"
  | "TESTS_FAILED";

export interface GateResult {
  ok: boolean;
  code: GateCode;
  reason: string;
  stats?: PlaywrightReport["stats"];
}

export interface GateInput {
  /** Raw contents of the results file, or null if the file did not exist. */
  raw: string | null;
  /** Exit code the smoke step reported, if known. Non-zero overrides the file. */
  smokeExit?: number | null;
}

function isRealStats(stats: unknown): stats is PlaywrightReport["stats"] {
  if (!stats || typeof stats !== "object") return false;
  const s = stats as Record<string, unknown>;
  // The genuine Playwright JSON reporter always emits these numeric counters.
  // The historical fabricated pass was `{"stats":{"ok":true},"suites":[]}` —
  // it has none of them, so this check rejects it as INVALID_SHAPE.
  return (
    typeof s.expected === "number" &&
    typeof s.unexpected === "number" &&
    typeof s.flaky === "number" &&
    typeof s.skipped === "number"
  );
}

export function evaluateGate({ raw, smokeExit }: GateInput): GateResult {
  // A non-zero smoke exit is authoritative regardless of what the file says —
  // a crashed runner may still have left a stale or partial passing report.
  if (smokeExit != null && smokeExit !== 0) {
    return {
      ok: false,
      code: "SMOKE_EXIT_NONZERO",
      reason: `Smoke step exited ${smokeExit} — treating as failure regardless of results file.`,
    };
  }

  if (raw == null) {
    return {
      ok: false,
      code: "MISSING_RESULTS",
      reason:
        "Results file is missing — a run that produced no results is a failure, not a pass (no fabricated ok).",
    };
  }

  const trimmed = raw.trim();
  if (trimmed === "") {
    return { ok: false, code: "EMPTY_RESULTS", reason: "Results file is empty." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      ok: false,
      code: "UNPARSEABLE_RESULTS",
      reason: "Results file is not valid JSON.",
    };
  }

  const stats = (parsed as { stats?: unknown }).stats;
  if (!isRealStats(stats)) {
    return {
      ok: false,
      code: "INVALID_SHAPE",
      reason:
        "Results file lacks real Playwright stats (expected/unexpected/flaky/skipped) — fabricated, truncated, or wrong format.",
    };
  }

  const ran = stats.expected + stats.unexpected + stats.flaky;
  if (ran === 0) {
    return {
      ok: false,
      code: "NO_TESTS_RAN",
      reason: `No tests ran (expected=0, unexpected=0, flaky=0, skipped=${stats.skipped}) — empty targets/config is a failure, not an all-clear.`,
      stats,
    };
  }

  if (stats.unexpected > 0) {
    return {
      ok: false,
      code: "TESTS_FAILED",
      reason: `${stats.unexpected} test(s) failed (unexpected); ${stats.expected} passed, ${stats.flaky} flaky.`,
      stats,
    };
  }

  return {
    ok: true,
    code: "PASS",
    reason: `${stats.expected} passed, ${stats.flaky} flaky, ${stats.skipped} skipped, 0 failed.`,
    stats,
  };
}
