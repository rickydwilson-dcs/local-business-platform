import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { siteConfig } from '../site.config';
import { TOPIC_ORDER } from '../lib/blog-topics';

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
 * Phase 5 (2026-09-18) of the inner-pages port opted the shipped sections
 * into indexing per-page: `/about`, `/contact`, `/pricing`,
 * `/privacy-policy`, `/cookie-policy`, `/terms-and-conditions`, the
 * `/services`, `/locations`, `/blog` and `/projects` list pages, and all
 * five of their dynamic `[slug]` children (including
 * `/blog/category/[slug]`) — see `INDEXABLE_STATIC_PATHS` and
 * `INDEXABLE_DYNAMIC_PATTERNS` below. Only the root 404 page
 * (`app/not-found.tsx`) is still deliberately `noindex` — it was never
 * ported and 404s should never be indexed. See Phase 5 of
 * output/sessions/2026-09/2026-09-18_dcs-inner-pages-port/yolo-brief.md and
 * PRODUCT.md's "Indexing" section for the default-deny rationale.
 *
 * This test is slower than the others (it boots a real production server)
 * — that's expected. It always kills the server on the way out, pass or
 * fail.
 */

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
const SITE_ROOT = path.resolve(__dirname, '..');

// Static routes-manifest `page` values opted into indexing by Phase 5. Every
// other static page path reaching the crawl loop (there are none left, as of
// Phase 5 — every static route in `app/(site)/*` is opted in) is expected
// `noindex`.
const INDEXABLE_STATIC_PATHS = new Set<string>([
  '/',
  '/about',
  '/blog',
  '/contact',
  '/cookie-policy',
  '/locations',
  '/pricing',
  '/privacy-policy',
  '/projects',
  '/services',
  '/terms-and-conditions',
]);

// Dynamic routes-manifest `page` patterns (bracketed, pre-slug-resolution)
// opted into indexing by Phase 5. All five ported dynamic routes qualify.
const INDEXABLE_DYNAMIC_PATTERNS = new Set<string>([
  '/blog/[slug]',
  '/blog/category/[slug]',
  '/locations/[slug]',
  '/projects/[slug]',
  '/services/[slug]',
]);

// A path that can never resolve to a real route — used to exercise the
// still-`noindex` 404 page (`app/not-found.tsx`), which is deliberately
// excluded from the routes-manifest crawl below (see `isNonPageRoute`) since
// `/_not-found` is an internal build artifact, not a URL a visitor or
// crawler would ever request directly.
const UNMATCHED_PATH = '/this-route-does-not-exist-indexability-test';

// Every real slug in a `content/<dir>/*.mdx` directory, read live rather
// than hardcoded — mirrors `firstSlug` below but returns the full list.
function allSlugs(contentDir: string): string[] {
  const dir = path.join(SITE_ROOT, 'content', contentDir);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
    .sort();
}

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
  if (pagePath === '/blog/category/[slug]') return `/blog/category/${TOPIC_ORDER[0]}`;
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

describe('dcs indexability — opted-in sections indexable, everything else noindex', () => {
  it('crawls the real route manifest: every opted-in page URL is indexable, every other page URL is noindex, and the still-denied 404 stays noindex', async () => {
    const manifest = loadRoutesManifest();

    const staticPagePaths = manifest.staticRoutes
      .map((r) => r.page)
      .filter((p) => !isNonPageRoute(p));
    const dynamicRoutePatterns = manifest.dynamicRoutes.map((r) => r.page);

    // Carry both the fetchable path and its expected indexability together,
    // so the assertion loop never has to re-derive intent from the path
    // string.
    const pages: Array<{ path: string; expectIndexable: boolean }> = [
      ...staticPagePaths.map((p) => ({ path: p, expectIndexable: INDEXABLE_STATIC_PATHS.has(p) })),
      ...dynamicRoutePatterns.map((pattern) => ({
        path: resolveDynamicPage(pattern),
        expectIndexable: INDEXABLE_DYNAMIC_PATTERNS.has(pattern),
      })),
      // The 404 page is not in the crawlable manifest at all (its
      // `/_not-found` entry is a build artifact — see `isNonPageRoute`), so
      // it's exercised here via a path guaranteed to 404.
      { path: UNMATCHED_PATH, expectIndexable: false },
    ];

    expect(pages.length).toBeGreaterThan(0);
    expect(pages.some((p) => p.path === '/')).toBe(true);

    let indexableCount = 0;
    let noindexCount = 0;
    let errors = 0;
    let firstOffender = '';
    const results: Array<{ path: string; status: number; robots: string | null }> = [];

    for (const { path: pagePath, expectIndexable } of pages) {
      const url = `${BASE_URL}${pagePath}`;
      const res = await fetch(url);
      const html = await res.text();
      const robots = extractRobotsContent(html);
      const isNoindex = robots !== null && /noindex/i.test(robots);

      results.push({ path: pagePath, status: res.status, robots });

      // The 404 fixture is expected to answer 404, not 200 — every other
      // page must answer 200.
      const expectedStatus = pagePath === UNMATCHED_PATH ? 404 : 200;
      if (res.status !== expectedStatus) {
        errors++;
        if (!firstOffender) {
          firstOffender = `${pagePath}: expected HTTP ${expectedStatus}, got ${res.status}`;
        }
        continue;
      }

      if (expectIndexable) {
        if (isNoindex) {
          errors++;
          if (!firstOffender) {
            firstOffender = `${pagePath}: expected indexable (opted in), got robots="${robots}"`;
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
      console.log(
        `PASS — ${pages.length}/${pages.length} URLs verified, 0 errors ` +
          `(${indexableCount} indexable, ${noindexCount} noindex)`
      );
    } else {
      console.log(
        `FAIL — ${pages.length - errors}/${pages.length} URLs verified, ${errors} errors: ${firstOffender}`
      );
    }

    expect(errors, `first offending record: ${firstOffender}`).toBe(0);
    expect(indexableCount).toBeGreaterThan(0);
    expect(noindexCount).toBeGreaterThan(0);
    expect(indexableCount).toBe(INDEXABLE_STATIC_PATHS.size + INDEXABLE_DYNAMIC_PATTERNS.size);
    // Only the 404 fixture is expected noindex among the paths this loop
    // fetches — every real static/dynamic route in the manifest is opted in.
    expect(noindexCount).toBe(pages.length - indexableCount);
  });

  it('sitemap-index.xml and every sitemap it lists resolve to exactly the opted-in URL set, with no noindex page listed', async () => {
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

    // Built from the same opted-in sets as the crawl test above, plus every
    // real content slug read live from `content/<dir>/*.mdx` — never
    // hardcoded counts, so this stays correct as content changes.
    const expectedPageLocs = new Set<string>();
    // app/sitemap.ts emits `url: baseUrl` for the homepage entry (no
    // trailing slash) — match that exactly rather than assuming one.
    for (const staticPath of INDEXABLE_STATIC_PATHS) {
      expectedPageLocs.add(staticPath === '/' ? siteConfig.url : `${siteConfig.url}${staticPath}`);
    }
    for (const slug of TOPIC_ORDER) {
      expectedPageLocs.add(`${siteConfig.url}/blog/category/${slug}`);
    }
    for (const slug of allSlugs('services')) {
      expectedPageLocs.add(`${siteConfig.url}/services/${slug}`);
    }
    for (const slug of allSlugs('locations')) {
      expectedPageLocs.add(`${siteConfig.url}/locations/${slug}`);
    }
    for (const slug of allSlugs('blog')) {
      expectedPageLocs.add(`${siteConfig.url}/blog/${slug}`);
    }
    for (const slug of allSlugs('projects')) {
      expectedPageLocs.add(`${siteConfig.url}/projects/${slug}`);
    }

    const missing = [...expectedPageLocs].filter((loc) => !allPageLocs.has(loc));
    const unexpected = [...allPageLocs].filter((loc) => !expectedPageLocs.has(loc));

    if (missing.length === 0 && unexpected.length === 0) {
      console.log(
        `PASS — ${allPageLocs.size}/${expectedPageLocs.size} sitemap URLs verified, 0 errors`
      );
    } else {
      console.log(
        `FAIL — ${expectedPageLocs.size - missing.length}/${expectedPageLocs.size} sitemap URLs verified, ` +
          `${missing.length + unexpected.length} errors: ` +
          `missing=${JSON.stringify(missing)} unexpected=${JSON.stringify(unexpected)}`
      );
    }

    expect(
      missing,
      `URLs opted in but absent from the sitemap: ${JSON.stringify(missing)}`
    ).toEqual([]);
    expect(
      unexpected,
      `URLs in the sitemap that are not opted in (or are stale): ${JSON.stringify(unexpected)}`
    ).toEqual([]);
  });
});
