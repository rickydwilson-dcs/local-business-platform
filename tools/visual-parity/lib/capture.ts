/**
 * Playwright-driven capture for visual parity.
 *
 * For each route × viewport, produces:
 *   - {pageType}--{slug}/{viewport}.png          (full-page screenshot)
 *   - {pageType}--{slug}/dom.json                (one per route, viewport-agnostic)
 *   - {pageType}--{slug}/{viewport}.missing      (empty marker on hard fail after retry)
 *
 * DOM snapshot is captured only once per route (at desktop viewport) because
 * we compare semantic structure, not per-viewport layout.
 */

import { chromium, type Browser } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

import { VIEWPORTS, type Viewport } from "./thresholds";
import { CAPTURE_LOCALE, CAPTURE_TIMEZONE, prepareContext, stabilisePage } from "./determinism";
import type { ManifestRoute } from "./manifest";

export interface DomSnapshot {
  h1: string;
  headingOutline: Array<{ level: number; text: string }>;
  sectionCount: number;
  landmarks: { header: number; main: number; footer: number; nav: number };
  imageCount: number;
  linkCount: number;
  markerCount: number;
  bodyTextLength: number;
  title: string;
}

export interface RouteCaptureResult {
  path: string;
  pageType: string;
  slug: string;
  status: number | null;
  error: string | null;
  screenshots: Partial<Record<Viewport, string>>;
  domSnapshotPath: string | null;
}

export interface CaptureOptions {
  baseUrl: string;
  routes: ManifestRoute[];
  outDir: string;
  viewports?: Viewport[];
  navigationTimeoutMs?: number;
}

function routeFolder(route: ManifestRoute): string {
  return `${route.pageType}--${route.slug}`;
}

export async function captureAll(options: CaptureOptions): Promise<RouteCaptureResult[]> {
  const viewports = options.viewports ?? (["desktop", "tablet", "mobile"] as Viewport[]);
  const navigationTimeoutMs = options.navigationTimeoutMs ?? 45_000;
  fs.mkdirSync(options.outDir, { recursive: true });

  const browser: Browser = await chromium.launch({ headless: true });
  const results: RouteCaptureResult[] = [];

  try {
    const context = await browser.newContext({
      locale: CAPTURE_LOCALE,
      timezoneId: CAPTURE_TIMEZONE,
      reducedMotion: "reduce",
      colorScheme: "light",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 lbp-visual-parity/1.0",
    });
    await prepareContext(context);

    for (const route of options.routes) {
      const routeDir = path.join(options.outDir, routeFolder(route));
      fs.mkdirSync(routeDir, { recursive: true });
      const result: RouteCaptureResult = {
        path: route.path,
        pageType: route.pageType,
        slug: route.slug,
        status: null,
        error: null,
        screenshots: {},
        domSnapshotPath: null,
      };
      let domCaptured = false;

      for (const viewport of viewports) {
        const { width, height } = VIEWPORTS[viewport];
        const page = await context.newPage();
        await page.setViewportSize({ width, height });

        let lastError: string | null = null;
        let succeeded = false;
        for (let attempt = 0; attempt < 2 && !succeeded; attempt++) {
          try {
            const response = await page.goto(new URL(route.path, options.baseUrl).toString(), {
              waitUntil: "domcontentloaded",
              timeout: navigationTimeoutMs,
            });
            result.status = response?.status() ?? null;
            await stabilisePage(page);

            if (!domCaptured) {
              const snapshot = await extractDomSnapshot(page);
              const snapshotPath = path.join(routeDir, "dom.json");
              fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
              result.domSnapshotPath = snapshotPath;
              domCaptured = true;
            }

            const shotPath = path.join(routeDir, `${viewport}.png`);
            await page.screenshot({ path: shotPath, fullPage: true, type: "png" });
            result.screenshots[viewport] = shotPath;
            succeeded = true;
          } catch (err) {
            lastError = err instanceof Error ? err.message : String(err);
            if (attempt === 0) {
              await page.waitForTimeout(1_000);
            }
          }
        }
        if (!succeeded && lastError) {
          result.error = lastError;
          fs.writeFileSync(path.join(routeDir, `${viewport}.missing`), lastError);
        }

        await page.close();
      }

      results.push(result);
      await writeRouteResult(routeDir, result);
    }

    await context.close();
  } finally {
    await browser.close();
  }

  const indexPath = path.join(options.outDir, "capture-index.json");
  fs.writeFileSync(
    indexPath,
    JSON.stringify(
      { baseUrl: options.baseUrl, capturedAt: new Date().toISOString(), results },
      null,
      2
    )
  );
  return results;
}

async function writeRouteResult(routeDir: string, result: RouteCaptureResult) {
  fs.writeFileSync(path.join(routeDir, "capture.json"), JSON.stringify(result, null, 2));
}

// Extract DOM snapshot inside the browser page.
// NOTE: This function body is stringified so tsx/esbuild doesn't wrap inner
// arrow functions with `__name()` helpers that aren't defined in the browser.
const DOM_SNAPSHOT_SCRIPT = `
  (function () {
    var headingEls = document.querySelectorAll("h1, h2, h3");
    var headings = [];
    for (var i = 0; i < headingEls.length; i++) {
      var el = headingEls[i];
      var text = (el.textContent || "").replace(/\\s+/g, " ").replace(/^ +| +$/g, "");
      headings.push({ level: Number(el.tagName.substring(1)), text: text });
    }
    var h1 = "";
    for (var j = 0; j < headings.length; j++) {
      if (headings[j].level === 1) { h1 = headings[j].text; break; }
    }
    return {
      h1: h1,
      headingOutline: headings,
      sectionCount: document.querySelectorAll("main section, main > section, [data-section]").length,
      landmarks: {
        header: document.querySelectorAll("header, [role=banner]").length,
        main: document.querySelectorAll("main, [role=main]").length,
        footer: document.querySelectorAll("footer, [role=contentinfo]").length,
        nav: document.querySelectorAll("nav, [role=navigation]").length
      },
      imageCount: document.querySelectorAll("img").length,
      linkCount: document.querySelectorAll("a[href]").length,
      markerCount: document.querySelectorAll("[data-map-marker], .leaflet-marker-icon").length,
      bodyTextLength: (document.body.innerText || "").length,
      title: document.title
    };
  })();
`;

async function extractDomSnapshot(page: import("@playwright/test").Page): Promise<DomSnapshot> {
  return (await page.evaluate(DOM_SNAPSHOT_SCRIPT)) as DomSnapshot;
}
