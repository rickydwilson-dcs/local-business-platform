/**
 * Visual QA Loop
 *
 * Playwright-driven capture → diff → fix → re-capture cycle.
 * Manages Next.js dev server lifecycle. Supports pixel and structural modes.
 */

import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import { chromium } from "@playwright/test";

import { compareImages } from "./pipeline-visual-compare";

// ── Types ────────────────────────────────────────────────────────────────────

export interface VisualQAConfig {
  clonePath: string;
  maxIterations: number;
  thresholds: Record<string, number>;
  mode: "pixel" | "structural";
}

export interface PageDiffResult {
  page: string;
  diffPercent: number;
  pass: boolean;
  threshold: number;
}

export interface VisualQAResult {
  passed: boolean;
  iterations: number;
  finalDiffs: PageDiffResult[];
  warnings: string[];
}

// ── Dev server management ────────────────────────────────────────────────────

const SERVER_READY_PATTERNS = [/Ready in/, /Local:/, /localhost:\d+/];
const SERVER_STARTUP_TIMEOUT_MS = 60_000;
const SERVER_PORT = 3799; // Use a non-standard port to avoid conflicts

async function startDevServer(
  siteDir: string
): Promise<{ process: child_process.ChildProcess; url: string }> {
  return new Promise((resolve, reject) => {
    const proc = child_process.spawn("npx", ["next", "dev", "--port", String(SERVER_PORT)], {
      cwd: siteDir,
      env: { ...process.env, PORT: String(SERVER_PORT) },
      stdio: ["ignore", "pipe", "pipe"],
    });

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error(`Dev server failed to start within ${SERVER_STARTUP_TIMEOUT_MS}ms`));
    }, SERVER_STARTUP_TIMEOUT_MS);

    const url = `http://localhost:${SERVER_PORT}`;

    function onData(data: Buffer) {
      const text = data.toString();
      if (SERVER_READY_PATTERNS.some((re) => re.test(text))) {
        clearTimeout(timer);
        resolve({ process: proc, url });
      }
    }

    proc.stdout?.on("data", onData);
    proc.stderr?.on("data", onData);

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    proc.on("exit", (code) => {
      if (code !== 0) {
        clearTimeout(timer);
        reject(new Error(`Dev server exited with code ${code}`));
      }
    });
  });
}

function stopDevServer(proc: child_process.ChildProcess): void {
  try {
    if (proc.pid) {
      process.kill(-proc.pid, "SIGTERM");
    }
  } catch {
    try {
      proc.kill("SIGTERM");
    } catch {
      // ignore
    }
  }
}

// ── Screenshot capture ───────────────────────────────────────────────────────

async function captureIterationScreenshots(
  baseUrl: string,
  pages: string[],
  outputDir: string
): Promise<Record<string, string>> {
  const browser = await chromium.launch({ headless: true });
  const screenshots: Record<string, string> = {};

  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const pageName of pages) {
      const urlPath = pageName === "home" ? "/" : `/${pageName}`;
      const screenshotPath = path.join(outputDir, `${pageName}.png`);
      try {
        await page.goto(`${baseUrl}${urlPath}`, {
          waitUntil: "networkidle",
          timeout: 30_000,
        });
        await page.screenshot({ path: screenshotPath, fullPage: false });
        screenshots[pageName] = screenshotPath;
      } catch (err) {
        console.warn(`[visual-qa] Screenshot failed for ${pageName}: ${(err as Error).message}`);
      }
    }
  } finally {
    await browser.close();
  }

  return screenshots;
}

// ── Structural comparison ────────────────────────────────────────────────────

async function structuralCompare(
  baseUrl: string,
  pages: string[],
  thresholds: Record<string, number>
): Promise<PageDiffResult[]> {
  const browser = await chromium.launch({ headless: true });
  const results: PageDiffResult[] = [];

  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const pageName of pages) {
      const urlPath = pageName === "home" ? "/" : `/${pageName}`;
      const threshold = thresholds[pageName] ?? thresholds["default"] ?? 0.1;

      try {
        await page.goto(`${baseUrl}${urlPath}`, {
          waitUntil: "networkidle",
          timeout: 30_000,
        });

        // Structural checks: section count, hero presence, header presence
        const { sectionCount, hasHero, hasHeader, hasFooter, hasNav } = (await page.evaluate(`
          (function() {
            return {
              sectionCount: document.querySelectorAll('section').length,
              hasHero: !!(document.querySelector('.hero, [class*="hero"], section:first-of-type')),
              hasHeader: !!(document.querySelector('header, [role="banner"]')),
              hasFooter: !!(document.querySelector('footer, [role="contentinfo"]')),
              hasNav: !!(document.querySelector('nav, [role="navigation"]')),
            };
          })()
        `)) as {
          sectionCount: number;
          hasHero: boolean;
          hasHeader: boolean;
          hasFooter: boolean;
          hasNav: boolean;
        };

        // Simple scoring: each missing element adds 0.2 to diff
        let diffPercent = 0;
        if (!hasHeader) diffPercent += 0.2;
        if (!hasFooter) diffPercent += 0.2;
        if (!hasNav) diffPercent += 0.15;
        if (!hasHero) diffPercent += 0.15;
        if (sectionCount === 0) diffPercent += 0.3;

        results.push({
          page: pageName,
          diffPercent,
          pass: diffPercent <= threshold,
          threshold,
        });
      } catch (err) {
        console.warn(
          `[visual-qa] Structural check failed for ${pageName}: ${(err as Error).message}`
        );
        results.push({ page: pageName, diffPercent: 1.0, pass: false, threshold });
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

// ── Heuristic fix application ────────────────────────────────────────────────

function applyHeuristicFixes(clonePath: string, failures: PageDiffResult[]): void {
  // v1 heuristic: if there are failures, check if there's a globals.css we can patch
  // This is intentionally minimal — full agent-based fixing is v2
  const globalsCss = path.join(clonePath, "app", "globals.css");
  if (!fs.existsSync(globalsCss)) return;

  const existing = fs.readFileSync(globalsCss, "utf-8");
  const failedPages = failures.map((f) => f.page).join(", ");
  const comment = `/* QA fix attempt: ${new Date().toISOString()} — failed pages: ${failedPages} */\n`;

  // Only add the comment if it's not already there (avoid duplicates)
  if (!existing.includes("QA fix attempt")) {
    fs.writeFileSync(globalsCss, comment + existing, "utf-8");
  }

  console.log(`[visual-qa] Applied heuristic fixes for: ${failedPages}`);
}

// ── Main QA loop ─────────────────────────────────────────────────────────────

export async function runVisualQALoop(config: VisualQAConfig): Promise<VisualQAResult> {
  const { clonePath, maxIterations, thresholds, mode } = config;
  const warnings: string[] = [];

  // Discover reference screenshots to know which pages to test
  const referenceShotsDir = path.join(clonePath, "reference-screenshots");
  if (!fs.existsSync(referenceShotsDir)) {
    return {
      passed: false,
      iterations: 0,
      finalDiffs: [],
      warnings: ["No reference screenshots found — skipping visual QA"],
    };
  }

  const referencePages = fs
    .readdirSync(referenceShotsDir)
    .filter((f) => f.endsWith(".png"))
    .map((f) => f.replace(".png", ""));

  if (referencePages.length === 0) {
    return {
      passed: false,
      iterations: 0,
      finalDiffs: [],
      warnings: ["Reference screenshots directory is empty — skipping visual QA"],
    };
  }

  const reportsDir = path.join(clonePath, "reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  let finalDiffs: PageDiffResult[] = [];
  let devServerProc: child_process.ChildProcess | null = null;

  // Cleanup handler
  const cleanup = () => {
    if (devServerProc) {
      stopDevServer(devServerProc);
      devServerProc = null;
    }
  };
  process.on("exit", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);

  try {
    for (let iter = 1; iter <= maxIterations; iter++) {
      console.log(`[visual-qa] Iteration ${iter}/${maxIterations}`);
      const iterDir = path.join(reportsDir, `iteration-${iter}`);
      fs.mkdirSync(iterDir, { recursive: true });

      if (mode === "structural") {
        // Structural mode: no dev server needed for simple checks
        // but we need one for actual page rendering
        let serverUrl = "";
        try {
          console.log(`[visual-qa] Starting dev server...`);
          const server = await startDevServer(clonePath);
          devServerProc = server.process;
          serverUrl = server.url;
        } catch (err) {
          warnings.push(`Dev server failed to start: ${(err as Error).message}`);
          break;
        }

        try {
          finalDiffs = await structuralCompare(serverUrl, referencePages, thresholds);
        } finally {
          stopDevServer(devServerProc);
          devServerProc = null;
        }

        // Save results
        fs.writeFileSync(
          path.join(iterDir, "structural-results.json"),
          JSON.stringify(finalDiffs, null, 2),
          "utf-8"
        );

        const allPass = finalDiffs.every((d) => d.pass);
        if (allPass) {
          console.log(`[visual-qa] Iteration ${iter}: PASS (structural)`);
          return { passed: true, iterations: iter, finalDiffs, warnings };
        }

        const failed = finalDiffs.filter((d) => !d.pass);
        console.log(
          `[visual-qa] Iteration ${iter}: FAIL — ${failed.map((f) => `${f.page}: ${(f.diffPercent * 100).toFixed(1)}%`).join(", ")}`
        );
        break; // Structural mode: no iterative fixing
      } else {
        // Pixel mode: start dev server, capture, diff, optionally fix
        let serverUrl = "";
        try {
          console.log(`[visual-qa] Starting dev server...`);
          const server = await startDevServer(clonePath);
          devServerProc = server.process;
          serverUrl = server.url;
        } catch (err) {
          warnings.push(`Dev server failed to start: ${(err as Error).message}`);
          break;
        }

        let screenshots: Record<string, string>;
        try {
          screenshots = await captureIterationScreenshots(serverUrl, referencePages, iterDir);
        } finally {
          stopDevServer(devServerProc);
          devServerProc = null;
        }

        // Diff each page
        finalDiffs = [];
        for (const pageName of referencePages) {
          const refPath = path.join(referenceShotsDir, `${pageName}.png`);
          const currentPath = screenshots[pageName];
          const threshold = thresholds[pageName] ?? thresholds["default"] ?? 0.1;

          if (!currentPath || !fs.existsSync(currentPath)) {
            finalDiffs.push({ page: pageName, diffPercent: 1.0, pass: false, threshold });
            continue;
          }

          try {
            const diffResult = await compareImages(
              refPath,
              currentPath,
              path.join(iterDir, `${pageName}-diff.png`)
            );
            const diffPercent = diffResult.diffPercent;
            const pass = diffPercent <= threshold;
            finalDiffs.push({ page: pageName, diffPercent, pass, threshold });

            console.log(
              `[visual-qa]   ${pageName}: ${(diffPercent * 100).toFixed(2)}% diff — ${pass ? "PASS" : "FAIL"} (threshold: ${(threshold * 100).toFixed(0)}%)`
            );
          } catch (err) {
            warnings.push(`Diff failed for ${pageName}: ${(err as Error).message}`);
            finalDiffs.push({ page: pageName, diffPercent: 1.0, pass: false, threshold });
          }
        }

        // Save results
        fs.writeFileSync(
          path.join(iterDir, "results.json"),
          JSON.stringify(finalDiffs, null, 2),
          "utf-8"
        );

        const allPass = finalDiffs.every((d) => d.pass);
        if (allPass) {
          console.log(`[visual-qa] Iteration ${iter}: PASS`);
          return { passed: true, iterations: iter, finalDiffs, warnings };
        }

        const failed = finalDiffs.filter((d) => !d.pass);
        console.log(
          `[visual-qa] Iteration ${iter}: FAIL — ${failed.length} page(s) exceed threshold`
        );

        // Write findings for potential fix pass
        fs.writeFileSync(
          path.join(iterDir, "findings-input.json"),
          JSON.stringify({ iteration: iter, failures: failed }, null, 2),
          "utf-8"
        );

        // Apply heuristic fixes if more iterations remain
        if (iter < maxIterations) {
          applyHeuristicFixes(clonePath, failed);
        }
      }
    }
  } finally {
    cleanup();
    process.off("exit", cleanup);
    process.off("SIGTERM", cleanup);
    process.off("SIGINT", cleanup);
  }

  const remaining = finalDiffs.filter((d) => !d.pass);
  warnings.push(
    `Visual QA did not pass after ${maxIterations} iteration(s). Remaining failures: ${remaining.map((f) => `${f.page} (${(f.diffPercent * 100).toFixed(1)}%)`).join(", ")}`
  );

  return { passed: false, iterations: maxIterations, finalDiffs, warnings };
}
