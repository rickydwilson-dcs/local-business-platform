#!/usr/bin/env npx tsx
/**
 * Regression Watchdog — fault-injection harness
 *
 * Phase 2 of the deploy-staircase hardening. `validate-loop.ts` proved one
 * failure class (an unreachable site URL) and asserted the weaker property
 * "an issue was opened". This harness generalises that: it drives each
 * deploy-relevant failure class into the *gate* and asserts the strong property
 * the audit actually cares about — the watchdog **screams** (non-zero verdict),
 * not merely that it filed a ticket. Any class that fails to scream is a bug and
 * fails this harness (exit 1).
 *
 * It is pure and deterministic — no Playwright run, no network, no GitHub — so it
 * runs on every push in CI (see .github/workflows/ci.yml) and gates promotion.
 *
 * The brief's five failure classes, and how each is exercised here:
 *   1. missing data            → results file absent / fabricated  → gate FAILS
 *   2. empty models/targets    → zero tests ran                    → gate FAILS
 *   3. network timeout          → a test never passes (unexpected)  → gate FAILS
 *   4. stale background status  → DEFERRED to Phase 3 (promotion gate) — the
 *                                 results-file gate cannot see run age; this
 *                                 harness reports it as an explicit known gap
 *                                 rather than faking coverage.
 *   5. partial sync             → truncated / empty / fabricated file → gate FAILS
 *
 * Usage: npx tsx tools/watchdog/fault-injection.ts
 */
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { execSync } from "child_process";
import { evaluateGate, type GateCode } from "./lib/gate";

const HEALTHY_REPORT = JSON.stringify({
  stats: { expected: 12, unexpected: 0, flaky: 0, skipped: 0, duration: 4200 },
  suites: [{ title: "smoke", specs: [], suites: [] }],
});

const FAILING_REPORT = JSON.stringify({
  stats: { expected: 11, unexpected: 1, flaky: 0, skipped: 0, duration: 4200 },
  suites: [
    {
      title: "smoke",
      suites: [],
      specs: [
        {
          title: "[colossus] https://example.com loads",
          ok: false,
          tests: [
            {
              status: "unexpected",
              results: [
                {
                  status: "timedOut",
                  duration: 30000,
                  error: { message: "Timeout 30000ms exceeded" },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

interface Injection {
  /** The brief's failure class this case represents. */
  class: string;
  /** Human-readable description of the fault being injected. */
  name: string;
  /** null models a missing results file. */
  raw: string | null;
  smokeExit?: number | null;
  /** The gate must return this code (and ok=false) for the case to pass. */
  expect: GateCode;
}

const MUST_SCREAM: Injection[] = [
  {
    class: "missing data",
    name: "results file is absent",
    raw: null,
    expect: "MISSING_RESULTS",
  },
  {
    class: "missing data",
    name: "legacy fabricated pass ({stats:{ok:true}})",
    raw: JSON.stringify({ stats: { ok: true }, suites: [] }),
    expect: "INVALID_SHAPE",
  },
  {
    class: "empty models/targets list",
    name: "zero tests ran",
    raw: JSON.stringify({
      stats: { expected: 0, unexpected: 0, flaky: 0, skipped: 0, duration: 3 },
      suites: [],
    }),
    expect: "NO_TESTS_RAN",
  },
  {
    class: "network timeout",
    name: "a test timed out and never passed",
    raw: FAILING_REPORT,
    expect: "TESTS_FAILED",
  },
  {
    class: "network timeout",
    name: "smoke runner crashed (non-zero exit) with a stale passing file",
    raw: HEALTHY_REPORT,
    smokeExit: 1,
    expect: "SMOKE_EXIT_NONZERO",
  },
  {
    class: "partial sync",
    name: "truncated / empty results file",
    raw: "",
    expect: "EMPTY_RESULTS",
  },
  {
    class: "partial sync",
    name: "corrupted (unparseable) results file",
    raw: "{ not valid json",
    expect: "UNPARSEABLE_RESULTS",
  },
];

// Honestly enumerated: classes this Phase-2 gate does NOT cover, so the harness
// never implies full coverage it doesn't have. Closing these is later-phase work.
const DEFERRED: { class: string; why: string }[] = [
  {
    class: "stale background-task status",
    why: "Detecting that a green E2E run belongs to an older commit is a promotion-gate concern (F9). The results-file gate cannot see run age — deferred to Phase 3 (server-side promotion gate).",
  },
];

function runUnitChecks(): string[] {
  const failures: string[] = [];

  for (const c of MUST_SCREAM) {
    const result = evaluateGate({ raw: c.raw, smokeExit: c.smokeExit ?? null });
    const ok = result.ok === false && result.code === c.expect;
    const mark = ok ? "✅" : "❌";
    console.log(
      `  ${mark} [${c.class}] ${c.name} → ${result.code}` +
        (ok ? "" : ` (expected ${c.expect}, ok=${result.ok})`)
    );
    if (!ok) {
      failures.push(
        `Class "${c.class}" — "${c.name}" did not scream as expected: got ${result.code} (ok=${result.ok}), wanted ${c.expect} (ok=false).`
      );
    }
  }

  // Control: a genuinely healthy run must PASS, or the gate is uselessly strict.
  const healthy = evaluateGate({ raw: HEALTHY_REPORT, smokeExit: 0 });
  const controlOk = healthy.ok === true && healthy.code === "PASS";
  console.log(
    `  ${controlOk ? "✅" : "❌"} [control] healthy run → ${healthy.code}` +
      (controlOk ? "" : ` (expected PASS/ok=true, got ${healthy.code}/ok=${healthy.ok})`)
  );
  if (!controlOk) {
    failures.push(
      `Control failed: a healthy run must PASS, but the gate returned ${healthy.code} (ok=${healthy.ok}).`
    );
  }

  return failures;
}

/**
 * End-to-end check of the exact wiring CI depends on: the gate.ts CLI's *exit
 * code*. Unit-testing evaluateGate is not enough — watchdog.yml reads the process
 * exit status, so we assert that too.
 */
function runCliChecks(): string[] {
  const failures: string[] = [];
  const gateCli = path.resolve(__dirname, "gate.ts");
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "watchdog-fault-"));

  const exitCodeOf = (args: string): number => {
    try {
      execSync(`npx tsx ${gateCli} ${args}`, { stdio: "pipe" });
      return 0;
    } catch (err) {
      const code = (err as { status?: number }).status;
      return typeof code === "number" ? code : 1;
    }
  };

  try {
    // Missing file → non-zero.
    const missing = path.join(tmpDir, "missing.json");
    const missingCode = exitCodeOf(`--results=${missing}`);
    const missingOk = missingCode !== 0;
    console.log(`  ${missingOk ? "✅" : "❌"} CLI: missing results file → exit ${missingCode}`);
    if (!missingOk) failures.push("CLI did not exit non-zero for a missing results file.");

    // Failing report → non-zero.
    const failing = path.join(tmpDir, "failing.json");
    fs.writeFileSync(failing, FAILING_REPORT);
    const failingCode = exitCodeOf(`--results=${failing}`);
    const failingOk = failingCode !== 0;
    console.log(`  ${failingOk ? "✅" : "❌"} CLI: failing report → exit ${failingCode}`);
    if (!failingOk) failures.push("CLI did not exit non-zero for a failing report.");

    // Healthy report → zero.
    const healthy = path.join(tmpDir, "healthy.json");
    fs.writeFileSync(healthy, HEALTHY_REPORT);
    const healthyCode = exitCodeOf(`--results=${healthy} --smoke-exit=0`);
    const healthyOk = healthyCode === 0;
    console.log(`  ${healthyOk ? "✅" : "❌"} CLI: healthy report → exit ${healthyCode}`);
    if (!healthyOk)
      failures.push(`CLI did not exit zero for a healthy report (got ${healthyCode}).`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  return failures;
}

function main() {
  console.log("\n[fault-injection] Asserting the watchdog gate screams for each failure class:\n");
  const unitFailures = runUnitChecks();

  console.log("\n[fault-injection] Asserting the gate CLI exit codes (the wiring CI relies on):\n");
  const cliFailures = runCliChecks();

  console.log("\n[fault-injection] Known coverage gaps (deferred, not faked):");
  for (const d of DEFERRED) {
    console.log(`  ⚠️  [${d.class}] ${d.why}`);
  }

  const failures = [...unitFailures, ...cliFailures];
  const covered = new Set(MUST_SCREAM.map((c) => c.class)).size;
  const deferred = DEFERRED.length;
  console.log(
    `\n[fault-injection] Coverage: ${covered} failure class(es) proven to scream, ${deferred} deferred to a later phase.`
  );

  if (failures.length > 0) {
    console.error(
      `\n[fault-injection] ✗ FAIL — ${failures.length} case(s) did not behave correctly:`
    );
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log(
    "\n[fault-injection] ✓ PASS — every covered failure class produces a non-zero watchdog verdict."
  );
  process.exit(0);
}

main();
