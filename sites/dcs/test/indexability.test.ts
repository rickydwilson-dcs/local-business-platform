import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { siteConfig } from '../site.config';

/**
 * Runs against the REAL BUILT SITE — `next start` on the pre-built `.next`
 * output (this repo's gate contract runs `pnpm run build` immediately
 * before this test), not a hand-written HTML fixture or an assumed
 * metadata shape. It:
 *   1. reads the real `.next/routes-manifest.json` to get the actual route
 *      list rather than a hand-maintained one,
 *   2. fetches every page route over real HTTP and parses the actual
 *      `<meta name="robots">` tag emitted in the response body,
 *   3. fetches the real `/sitemap-index.xml`, follows every listed sitemap,
 *      and reads the real XML `<loc>` entries.
 *
 * Phase 8 (2026-08-23): `/` is the only URL that may be indexed until the
 * inner pages ship. Every other route must stay reachable (200, no
 * Disallow) and crawlable, but must emit `noindex`. See Phase 8 of
 * output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/yolo-brief.md.
 *
 * This test is slower than the others (it boots a real production server)
 * — that's expected. It always kills the server on the way out, pass or
 * fail.
 */

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
const SITE_ROOT = path.resolve(__dirname, '..');

let serverProcess: ChildProcess | null = null;

function killServer(): void {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill('SIGTERM');
  }
  serverProcess = null;
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  let lastError: unknown = null;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      // Any HTTP response (even a 4xx/5xx) means the server is up.
      if (res) return;
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(
    `Server at ${url} did not respond within ${timeoutMs}ms. Last error: ${String(lastError)}`
  );
}

interface RoutesManifest {
  staticRoutes: Array<{ page: string }>;
  dynamicRoutes: Array<{ page: string }>;
}

function loadRoutesManifest(): RoutesManifest {
  const manifestPath = path.join(SITE_ROOT, '.next', 'routes-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `${manifestPath} not found. Run "pnpm --filter @platform/dcs run build" before this test — ` +
        'it must run against the real built site, not a hand-written fixture.'
    );
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as RoutesManifest;
}

// Routes present in routes-manifest.json that are not HTML pages carrying a
// robots meta tag: XML/text endpoints and Next.js internal error routes.
function isNonPageRoute(pagePath: string): boolean {
  if (pagePath === '/robots.txt') return true;
  if (pagePath === '/sitemap.xml') return true;
  if (pagePath === '/sitemap-index.xml') return true;
  if (pagePath.endsWith('/sitemap.xml')) return true; // section sitemaps
  if (pagePath.startsWith('/api/')) return true;
  if (pagePath === '/_global-error') return true;
  if (pagePath === '/_not-found') return true;
  return false;
}

// One real content slug per dynamic segment, read live from the content
// directory (first filename alphabetically) rather than hardcoded, so this
// stays correct as content changes.
function firstSlug(contentDir: string): string {
  const dir = path.join(SITE_ROOT, 'content', contentDir);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .sort();
  if (files.length === 0) {
    throw new Error(`No .mdx content files found in ${dir} to resolve a real dynamic slug`);
  }
  return files[0]!.replace(/\.mdx$/, '');
}

function resolveDynamicPage(pagePath: string): string {
  if (pagePath === '/blog/[slug]') return `/blog/${firstSlug('blog')}`;
  if (pagePath === '/locations/[slug]') return `/locations/${firstSlug('locations')}`;
  if (pagePath === '/projects/[slug]') return `/projects/${firstSlug('projects')}`;
  if (pagePath === '/services/[slug]') return `/services/${firstSlug('services')}`;
  throw new Error(`Unhandled dynamic route in indexability test: ${pagePath}`);
}

function extractRobotsContent(html: string): string | null {
  const match = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
  return match ? match[1]! : null;
}

function extractLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
}

beforeAll(async () => {
  // Fail fast and loud if the real build this test depends on isn't there,
  // rather than silently starting a server with stale/missing output.
  loadRoutesManifest();

  const nextBin = path.join(SITE_ROOT, 'node_modules', '.bin', 'next');
  if (!fs.existsSync(nextBin)) {
    throw new Error(`next binary not found at ${nextBin}`);
  }

  try {
    serverProcess = spawn(nextBin, ['start', '-p', String(PORT)], {
      cwd: SITE_ROOT,
      env: { ...process.env, NODE_ENV: 'production' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderrOutput = '';
    serverProcess.stderr?.on('data', (chunk: Buffer) => {
      stderrOutput += chunk.toString();
    });

    let exited = false;
    serverProcess.once('exit', () => {
      exited = true;
    });

    await waitForServer(`${BASE_URL}/`, 30000);

    if (exited) {
      throw new Error(`next start exited before becoming ready. stderr:\n${stderrOutput}`);
    }
  } catch (err) {
    killServer();
    throw err;
  }
}, 45000);

afterAll(() => {
  killServer();
});

describe('dcs indexability — homepage indexable, everything else noindex', () => {
  it('crawls the real route manifest: exactly one URL is indexable, every other page URL is noindex', async () => {
    const manifest = loadRoutesManifest();

    const pagePaths = [
      ...manifest.staticRoutes.map((r) => r.page).filter((p) => !isNonPageRoute(p)),
      ...manifest.dynamicRoutes.map((r) => resolveDynamicPage(r.page)),
    ];

    expect(pagePaths.length).toBeGreaterThan(0);
    expect(pagePaths).toContain('/');

    let indexableCount = 0;
    let noindexCount = 0;
    let errors = 0;
    let firstOffender = '';
    const results: Array<{ path: string; status: number; robots: string | null }> = [];

    for (const pagePath of pagePaths) {
      const url = `${BASE_URL}${pagePath}`;
      const res = await fetch(url);
      const html = await res.text();
      const robots = extractRobotsContent(html);
      const isNoindex = robots !== null && /noindex/i.test(robots);

      results.push({ path: pagePath, status: res.status, robots });

      if (res.status !== 200) {
        errors++;
        if (!firstOffender) {
          firstOffender = `${pagePath}: expected HTTP 200, got ${res.status}`;
        }
        continue;
      }

      if (pagePath === '/') {
        if (isNoindex) {
          errors++;
          if (!firstOffender) {
            firstOffender = `${pagePath}: homepage must NOT carry noindex, got robots="${robots}"`;
          }
        } else {
          indexableCount++;
        }
      } else {
        if (!isNoindex) {
          errors++;
          if (!firstOffender) {
            firstOffender = `${pagePath}: expected noindex, got robots="${robots ?? '(no robots meta tag)'}"`;
          }
        } else {
          noindexCount++;
        }
      }
    }

    if (errors === 0) {
      // eslint-disable-next-line no-console
      console.log(
        `PASS — ${pagePaths.length}/${pagePaths.length} URLs verified, 0 errors ` +
          `(1 indexable: /, ${noindexCount} noindex)`
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `FAIL — ${pagePaths.length - errors}/${pagePaths.length} URLs verified, ${errors} errors: ${firstOffender}`
      );
    }

    expect(errors, `first offending record: ${firstOffender}`).toBe(0);
    expect(indexableCount).toBe(1);
    expect(noindexCount).toBe(pagePaths.length - 1);
  });

  it('sitemap-index.xml and every sitemap it lists resolve to exactly one URL: the homepage', async () => {
    const indexRes = await fetch(`${BASE_URL}/sitemap-index.xml`);
    expect(indexRes.status).toBe(200);
    const indexXml = await indexRes.text();
    const sitemapUrls = extractLocs(indexXml);

    expect(sitemapUrls.length).toBeGreaterThan(0);

    const allPageLocs = new Set<string>();
    for (const sitemapUrl of sitemapUrls) {
      // The sitemap route computes absolute URLs from siteConfig.url, not
      // from the request host, so this is a real network hop back through
      // the same local server rather than an external fetch.
      const relative = sitemapUrl.replace(siteConfig.url, '');
      const res = await fetch(`${BASE_URL}${relative}`);
      expect(res.status, `sitemap at ${sitemapUrl} did not resolve`).toBe(200);
      const xml = await res.text();
      for (const loc of extractLocs(xml)) {
        allPageLocs.add(loc);
      }
    }

    // app/sitemap.ts emits `url: baseUrl` for the homepage entry (no
    // trailing slash) — match that exactly rather than assuming one.
    const expectedHomepageUrl = siteConfig.url;

    // eslint-disable-next-line no-console
    console.log(
      allPageLocs.size === 1 && allPageLocs.has(expectedHomepageUrl)
        ? `PASS — 1/1 sitemap URLs verified, 0 errors (only ${expectedHomepageUrl})`
        : `FAIL — sitemap union has ${allPageLocs.size} URLs, expected exactly {${expectedHomepageUrl}}: ${JSON.stringify([...allPageLocs])}`
    );

    expect([...allPageLocs]).toEqual([expectedHomepageUrl]);
  });
});
