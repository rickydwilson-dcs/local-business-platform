/**
 * Step Tracker
 *
 * Reads and writes .done-{stepName}.json files to track pipeline step
 * completion with content hashes. Used by all orchestrators for resumability.
 */

import * as fs from "fs";
import * as path from "path";

interface StepRecord {
  completedAt: string;
  inputHash: string;
  outputHash?: string;
}

function recordPath(dir: string, stepName: string): string {
  return path.join(dir, `.done-${stepName}.json`);
}

export function hasCompletedStep(dir: string, stepName: string, inputHash?: string): boolean {
  const filePath = recordPath(dir, stepName);
  if (!fs.existsSync(filePath)) return false;
  if (!inputHash) return true;
  try {
    const record = JSON.parse(fs.readFileSync(filePath, "utf-8")) as StepRecord;
    return record.inputHash === inputHash;
  } catch {
    return false;
  }
}

export function markStepDone(
  dir: string,
  stepName: string,
  inputHash: string,
  outputHash?: string
): void {
  fs.mkdirSync(dir, { recursive: true });
  const record: StepRecord = {
    completedAt: new Date().toISOString(),
    inputHash,
    outputHash,
  };
  fs.writeFileSync(recordPath(dir, stepName), JSON.stringify(record, null, 2), "utf-8");
}
