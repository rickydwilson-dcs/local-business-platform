#!/usr/bin/env tsx
/**
 * E2E Pipeline Orchestrator
 *
 * Reads a JobBrief and runs all three stages with per-step resumability:
 *   Stage 1: Clone (Entry A/B/C)
 *   Stage 2: Extract theme
 *   Stage 3: Scaffold client site
 *
 * Usage:
 *   npx tsx tools/clone-and-scaffold.ts --brief output/briefs/abc123.json
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

import { JobBriefSchema, type JobBrief } from "./lib/pipeline-brief-types";
import { ingestLiveSite } from "./lib/clone-entry/ingest-live-site";
import { designSkillEntry } from "./lib/clone-entry/design-skill";
import { runVisualQALoop } from "./lib/visual-qa-loop";
import { hasCompletedStep, markStepDone } from "./lib/step-tracker";

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseArgs(): { brief?: string } {
  const args = process.argv.slice(2);
  const result: { brief?: string } = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--brief" && args[i + 1]) result.brief = args[++i];
  }
  return result;
}

function readAndValidateBrief(briefPath: string): JobBrief {
  const rawPath = path.resolve(briefPath);
  if (!fs.existsSync(rawPath)) {
    console.error(`Brief file not found: ${rawPath}`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8")) as unknown;
  const result = JobBriefSchema.safeParse(raw);
  if (!result.success) {
    console.error("Invalid brief:", result.error.format());
    process.exit(1);
  }
  return result.data;
}

function pickThemeName(): string {
  return `theme-${Date.now()}`;
}

async function waitForInput(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question("Press Enter to continue or Ctrl+C to stop...", () => {
      rl.close();
      resolve();
    });
  });
}

// ── Lazy imports for heavy operations ───────────────────────────────────────

async function extractTheme(brief: JobBrief, cloneDir: string, themeName: string): Promise<void> {
  // Dynamically import to avoid circular dep issues
  const { execSync } = await import("child_process");
  const briefPath = path.join(cloneDir, ".pipeline-brief.json");
  fs.writeFileSync(briefPath, JSON.stringify(brief, null, 2), "utf-8");
  execSync(`npx tsx ${path.resolve("tools/extract-theme.ts")} --brief ${briefPath}`, {
    stdio: "inherit",
    cwd: process.cwd(),
  });
}

async function scaffoldSite(brief: JobBrief, _themeName: string, _sitePath: string): Promise<void> {
  const { execSync } = await import("child_process");
  const briefPath = path.join(process.cwd(), `output/.pipeline-brief-${brief.id}.json`);
  fs.mkdirSync(path.dirname(briefPath), { recursive: true });
  fs.writeFileSync(briefPath, JSON.stringify(brief, null, 2), "utf-8");
  execSync(`npx tsx ${path.resolve("tools/scaffold-client-site.ts")} --brief ${briefPath}`, {
    stdio: "inherit",
    cwd: process.cwd(),
  });
}

async function generateImages(brief: JobBrief, sitePath: string): Promise<void> {
  const { execSync } = await import("child_process");
  const styleFlag = brief.imageGen.stylePrompt
    ? `--style-prompt "${brief.imageGen.stylePrompt}"`
    : "";
  execSync(
    `npx tsx ${path.resolve("tools/generate-image-manifest.ts")} --site ${sitePath} ${styleFlag}`,
    { stdio: "inherit", cwd: process.cwd() }
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  if (!args.brief) {
    console.error("Usage: clone-and-scaffold.ts --brief <path>");
    process.exit(1);
  }

  const brief = readAndValidateBrief(args.brief);
  const themeName = brief.theme.name ?? pickThemeName();
  const cloneDir = path.resolve(`output/clones/${themeName}`);
  const sitePath = path.resolve(`sites/_${themeName}-${brief.business.trade}`);

  console.log("\nE2E Pipeline: Clone → Extract → Scaffold");
  console.log(`  Brief: ${args.brief}`);
  console.log(`  Theme: ${themeName}`);
  console.log(`  Clone dir: ${cloneDir}`);
  console.log(`  Site path: ${sitePath}\n`);

  // ── Stage 1: Clone ──────────────────────────────────────────────────────────
  if (!hasCompletedStep(cloneDir, "stage-1")) {
    console.log("=== Stage 1: Clone ===");

    switch (brief.source.type) {
      case "url":
        await ingestLiveSite(brief, cloneDir);
        break;
      case "stitch":
        console.log("Stitch entry (Entry B): use /pipeline.stitch-design with --cpf-output flag");
        process.exit(1);
        break;
      case "design-skill":
        await designSkillEntry(brief, cloneDir);
        break;
    }

    await runVisualQALoop({
      clonePath: cloneDir,
      maxIterations: brief.qa.maxIterations,
      thresholds: brief.qa.thresholds,
      mode: "pixel",
    });

    markStepDone(cloneDir, "stage-1", brief.id);

    if (brief.runMode === "interactive") {
      console.log(`\nStage 1 complete. Review clone at: ${cloneDir}/`);
      await waitForInput();
    }
  } else {
    console.log("=== Stage 1: SKIP (already completed) ===");
  }

  // ── Stage 2: Extract theme ──────────────────────────────────────────────────
  if (!hasCompletedStep(cloneDir, "stage-2")) {
    console.log("\n=== Stage 2: Extract Theme ===");
    await extractTheme(brief, cloneDir, themeName);
    markStepDone(cloneDir, "stage-2", brief.id);

    if (brief.runMode === "interactive") {
      console.log(`\nStage 2 complete. Review theme at: packages/themes/${themeName}/`);
      await waitForInput();
    }
  } else {
    console.log("=== Stage 2: SKIP (already completed) ===");
  }

  // ── Stage 3: Scaffold ───────────────────────────────────────────────────────
  if (!hasCompletedStep(cloneDir, "stage-3")) {
    console.log("\n=== Stage 3: Scaffold Site ===");
    await scaffoldSite(brief, themeName, sitePath);

    await runVisualQALoop({
      clonePath: sitePath,
      maxIterations: brief.qa.maxIterations,
      thresholds: brief.qa.thresholds,
      mode: "structural",
    });

    markStepDone(cloneDir, "stage-3", brief.id);

    if (brief.runMode === "interactive") {
      console.log(`\nSite scaffolded at: ${sitePath}/`);
      console.log("Review before image generation.");
      await waitForInput();
    }
  } else {
    console.log("=== Stage 3: SKIP (already completed) ===");
  }

  // ── Image generation ────────────────────────────────────────────────────────
  if (brief.imageGen.enabled && !hasCompletedStep(cloneDir, "images")) {
    console.log("\n=== Image Generation ===");
    await generateImages(brief, sitePath);
    markStepDone(cloneDir, "images", brief.id);
  }

  console.log(`\nDone. Site at: ${sitePath}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
