#!/usr/bin/env npx tsx
/**
 * Regression Watchdog — deploy gate (CLI)
 *
 * The authoritative pass/fail for the watchdog check. Reads the smoke-results
 * file (and the smoke step's exit code, if provided) and exits non-zero when the
 * run should be treated as a failure — including a missing or fabricated results
 * file. Wired into watchdog.yml as an `if: always()` step so its exit code, not
 * the (observation-only) triage engine, decides whether the check is red.
 *
 * Usage:
 *   npx tsx tools/watchdog/gate.ts --results=<path> [--smoke-exit=<code>]
 */
import * as fs from "fs";
import { evaluateGate } from "./lib/gate";

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (key: string) =>
    args
      .find((a) => a.startsWith(`--${key}=`))
      ?.split("=")
      .slice(1)
      .join("=");
  const smokeRaw = get("smoke-exit");
  return {
    resultsPath: get("results") ?? "smoke-results.json",
    smokeExit: smokeRaw != null && smokeRaw !== "" ? Number(smokeRaw) : null,
  };
}

const { resultsPath, smokeExit } = parseArgs();
const raw = fs.existsSync(resultsPath) ? fs.readFileSync(resultsPath, "utf8") : null;
const result = evaluateGate({ raw, smokeExit });

if (result.ok) {
  console.log(`[watchdog:gate] ✅ PASS — ${result.reason}`);
  process.exit(0);
}

console.error(`[watchdog:gate] ❌ FAIL [${result.code}] — ${result.reason}`);
console.error(
  "[watchdog:gate] The smoke run did not produce a trustworthy pass. This check is intentionally red."
);
process.exit(1);
