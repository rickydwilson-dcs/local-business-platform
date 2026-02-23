/**
 * Site Discovery Module
 *
 * Discovers pages from a website URL using three strategies in priority order:
 * 1. Sitemap.xml parsing (with sitemap index recursion, 1 level max)
 * 2. Navigation link extraction from homepage HTML (<nav>, <header>, <footer>)
 * 3. Common path probing (fallback when nav yields < 3 pages)
 *
 * All discovered pages are classified by URL path pattern and deduplicated.
 */

import type { DiscoveredPage, PageType } from "./reference-analysis-types";

// ============================================================================
// Constants
// ============================================================================

const USER_AGENT =
  "Mozilla/5.0 (compatible; ThemeExtractor/1.0; +https://example.com)";

const FETCH_TIMEOUT = 10000;

const DELAY_BETWEEN_FETCHES = 500;

const DEFAULT_MAX_PAGES = 10;

const COMMON_PATHS = [
  "/about",
  "/services",
  "/blog",
  "/contact",
  "/locations",
  "/pricing",
  "/reviews",
  "/projects",
];

const PAGE_TYPE_PRIORITY: PageType[] = [
  "home",
  "services-list",
  "about",
  "blog-list",
  "contact",
  "locations-list",
  "pricing",
  "reviews",
  "projects",
  "service-detail",
  "blog-post",
  "location-detail",
  "custom",
];

// ============================================================================
// Helpers
// ============================================================================

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalise a URL string into a consistent base URL with no trailing slash.
 * Preserves path prefix for subdirectory-hosted sites.
 */
function normaliseBaseUrl(raw: string): string {
  const url = new URL(raw);
  let basePath = url.pathname;
  if (basePath.length > 1 && basePath.endsWith("/")) {
    basePath = basePath.slice(0, -1);
  }
  return `${url.protocol}//${url.host}${basePath === "/" ? "" : basePath}`;
}

/**
 * Check whether a URL is under the base URL (same host and path prefix).
 */
function isUnderBase(href: string, baseUrl: string): boolean {
  try {
    const target = new URL(href, baseUrl);
    const base = new URL(baseUrl);
    if (target.hostname !== base.hostname) return false;
    return (
      target.pathname === base.pathname ||
      target.pathname.startsWith(base.pathname + "/")
    );
  } catch {
    return false;
  }
}

/**
 * Get a clean relative pathname from an absolute or relative URL string.
 * Strips base path prefix for subdirectory-hosted sites.
 * Returns null if the URL is invalid or off-domain.
 */
function toCleanPath(href: string, baseUrl: string): string | null {
  try {
    const target = new URL(href, baseUrl);
    const base = new URL(baseUrl);
    if (target.hostname !== base.hostname) return null;

    let targetPath = target.pathname;
    const basePath = base.pathname;

    // Strip base path prefix to get relative path
    if (basePath !== "/" && targetPath.startsWith(basePath)) {
      targetPath = targetPath.slice(basePath.length) || "/";
    }

    if (targetPath.length > 1 && targetPath.endsWith("/")) {
      targetPath = targetPath.slice(0, -1);
    }
    return targetPath;
  } catch {
    return null;
  }
}

/**
 * Calculate the depth of a path (number of non-empty segments).
 */
function pathDepth(path: string): number {
  return path.split("/").filter(Boolean).length;
}

/**
 * Classify a URL path into a PageType based on pattern matching.
 */
function classifyPage(path: string): PageType {
  const lower = path.toLowerCase();

  if (lower === "/" || lower === "") return "home";

  if (/^\/about/.test(lower)) return "about";

  if (lower === "/services") return "services-list";
  if (/^\/services\/.+/.test(lower)) return "service-detail";

  if (lower === "/blog") return "blog-list";
  if (/^\/blog\/.+/.test(lower)) return "blog-post";

  if (/^\/contact/.test(lower)) return "contact";

  if (lower === "/locations" || lower === "/areas") return "locations-list";
  if (/^\/locations\/.+/.test(lower)) return "location-detail";

  if (/^\/reviews/.test(lower)) return "reviews";

  if (/^\/projects/.test(lower)) return "projects";

  if (/^\/pricing/.test(lower)) return "pricing";

  return "custom";
}

/**
 * Make an HTTP fetch with the standard user-agent and timeout.
 * Returns null on any failure instead of throwing.
 */
async function safeFetch(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Build a DiscoveredPage object, deduplicating by path within a map.
 */
function addPage(
  pages: Map<string, DiscoveredPage>,
  baseUrl: string,
  path: string,
  source: DiscoveredPage["source"],
  title?: string,
): void {
  // Normalise path
  let normPath = path;
  if (normPath.length > 1 && normPath.endsWith("/")) {
    normPath = normPath.slice(0, -1);
  }

  // Skip if already discovered (first source wins)
  if (pages.has(normPath)) return;

  pages.set(normPath, {
    url: `${baseUrl}${normPath === "/" ? "" : normPath}`,
    path: normPath || "/",
    source,
    pageType: classifyPage(normPath),
    title,
    depth: pathDepth(normPath),
  });
}

// ============================================================================
// Robots.txt Checking
// ============================================================================

/**
 * Fetch and parse robots.txt, returning a simple list of disallowed paths.
 * This is a basic implementation -- it checks User-agent: * rules only.
 */
async function fetchDisallowedPaths(baseUrl: string): Promise<string[]> {
  const robotsUrl = `${baseUrl}/robots.txt`;
  const body = await safeFetch(robotsUrl);
  if (!body) return [];

  const disallowed: string[] = [];
  let relevantSection = false;

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim().toLowerCase();

    if (line.startsWith("user-agent:")) {
      const agent = line.slice("user-agent:".length).trim();
      relevantSection = agent === "*";
    } else if (relevantSection && line.startsWith("disallow:")) {
      const path = rawLine.trim().slice("disallow:".length).trim();
      if (path) {
        disallowed.push(path);
      }
    }
  }

  return disallowed;
}

/**
 * Check if a path is disallowed by robots.txt rules.
 */
function isDisallowed(path: string, disallowedPaths: string[]): boolean {
  for (const rule of disallowedPaths) {
    if (path === rule) return true;
    if (rule.endsWith("*")) {
      const prefix = rule.slice(0, -1);
      if (path.startsWith(prefix)) return true;
    } else if (rule.endsWith("/") && path.startsWith(rule)) {
      return true;
    }
  }
  return false;
}

// ============================================================================
// Strategy 1: Sitemap.xml
// ============================================================================

/**
 * Extract <loc> values from a sitemap XML body using regex.
 */
function extractLocs(xml: string): string[] {
  const locs: string[] = [];
  const pattern = /<loc>\s*(.*?)\s*<\/loc>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(xml)) !== null) {
    const loc = match[1]?.trim();
    if (loc) locs.push(loc);
  }
  return locs;
}

/**
 * Check whether a sitemap body is a sitemap index (contains <sitemapindex>).
 */
function isSitemapIndex(xml: string): boolean {
  return /<sitemapindex[\s>]/i.test(xml);
}

/**
 * Discover pages from sitemap.xml. Handles sitemap indexes with one level
 * of recursion (fetches child sitemaps referenced in the index).
 */
async function discoverFromSitemap(
  baseUrl: string,
  disallowed: string[],
  maxPages: number,
): Promise<Map<string, DiscoveredPage>> {
  const pages = new Map<string, DiscoveredPage>();
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const body = await safeFetch(sitemapUrl);
  if (!body) return pages;

  let allLocs: string[];

  if (isSitemapIndex(body)) {
    // Fetch child sitemaps (1 level only)
    const childUrls = extractLocs(body);
    allLocs = [];

    for (const childUrl of childUrls) {
      await delay(DELAY_BETWEEN_FETCHES);
      const childBody = await safeFetch(childUrl);
      if (childBody) {
        allLocs.push(...extractLocs(childBody));
      }
    }
  } else {
    allLocs = extractLocs(body);
  }

  for (const loc of allLocs) {
    if (pages.size >= maxPages) break;

    const path = toCleanPath(loc, baseUrl);
    if (path === null) continue;
    if (isDisallowed(path, disallowed)) continue;

    addPage(pages, baseUrl, path, "sitemap");
  }

  return pages;
}

// ============================================================================
// Strategy 2: Navigation Parsing
// ============================================================================

/**
 * Extract links from <nav>, <header>, and <footer> elements in HTML.
 * Returns deduplicated same-domain paths.
 */
function extractNavLinks(html: string, baseUrl: string): string[] {
  const paths = new Set<string>();

  // Extract content from <nav>, <header>, and <footer> tags
  const sectionPatterns = [
    /<nav[\s>][\s\S]*?<\/nav>/gi,
    /<header[\s>][\s\S]*?<\/header>/gi,
    /<footer[\s>][\s\S]*?<\/footer>/gi,
  ];

  let navHtml = "";
  for (const pattern of sectionPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html)) !== null) {
      navHtml += match[0] + "\n";
    }
  }

  // Extract href values from anchor tags within those sections
  const hrefPattern = /<a\s[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
  let hrefMatch: RegExpExecArray | null;
  while ((hrefMatch = hrefPattern.exec(navHtml)) !== null) {
    const href = hrefMatch[1]?.trim();
    if (!href) continue;

    // Skip non-HTTP links
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      continue;
    }

    if (!isUnderBase(href, baseUrl)) continue;

    const path = toCleanPath(href, baseUrl);
    if (path !== null) {
      paths.add(path);
    }
  }

  return Array.from(paths);
}

/**
 * Extract the <title> content from an HTML string.
 */
function extractTitle(html: string): string | undefined {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match?.[1]?.trim().replace(/\s+/g, " ") || undefined;
}

/**
 * Discover pages by parsing navigation links from the homepage HTML.
 */
async function discoverFromNavigation(
  baseUrl: string,
  html: string,
  disallowed: string[],
  existingPages: Map<string, DiscoveredPage>,
  maxPages: number,
): Promise<Map<string, DiscoveredPage>> {
  const pages = new Map<string, DiscoveredPage>(existingPages);

  const navPaths = extractNavLinks(html, baseUrl);

  for (const path of navPaths) {
    if (pages.size >= maxPages) break;
    if (isDisallowed(path, disallowed)) continue;

    addPage(pages, baseUrl, path, "nav");
  }

  return pages;
}

// ============================================================================
// Strategy 3: Common Path Probing
// ============================================================================

/**
 * Probe common paths to discover additional pages when navigation yields
 * fewer than 3 results.
 */
async function discoverFromProbing(
  baseUrl: string,
  disallowed: string[],
  existingPages: Map<string, DiscoveredPage>,
  maxPages: number,
): Promise<Map<string, DiscoveredPage>> {
  const pages = new Map<string, DiscoveredPage>(existingPages);

  for (const path of COMMON_PATHS) {
    if (pages.size >= maxPages) break;
    if (pages.has(path)) continue;
    if (isDisallowed(path, disallowed)) continue;

    await delay(DELAY_BETWEEN_FETCHES);

    const probeUrl = `${baseUrl}${path}`;
    const body = await safeFetch(probeUrl);

    if (body) {
      // Verify it is not a generic 404 page by checking for common 404 indicators
      const lower = body.toLowerCase();
      const is404 =
        lower.includes("<title>404") ||
        lower.includes("page not found") ||
        lower.includes("not found</title>");

      if (!is404) {
        const title = extractTitle(body);
        addPage(pages, baseUrl, path, "probe", title);
      }
    }
  }

  return pages;
}

// ============================================================================
// Main Export
// ============================================================================

/**
 * Discover pages from a website URL using a three-strategy approach:
 *
 * 1. **Sitemap.xml** -- Parse sitemap (with index recursion) for all listed URLs.
 * 2. **Navigation parsing** -- Extract links from nav/header/footer of the homepage.
 * 3. **Common path probing** -- If nav yields < 3 pages, probe well-known paths.
 *
 * Results are deduplicated, classified by page type, and capped at `maxPages`.
 */
export async function discoverPages(
  url: string,
  options?: { maxPages?: number; pages?: string[] },
): Promise<DiscoveredPage[]> {
  const maxPages = options?.maxPages ?? DEFAULT_MAX_PAGES;
  const baseUrl = normaliseBaseUrl(url);

  // Manifest mode: bypass all discovery strategies
  if (options?.pages && options.pages.length > 0) {
    const pages = new Map<string, DiscoveredPage>();
    for (const pageUrl of options.pages) {
      const path = toCleanPath(pageUrl, baseUrl);
      if (path !== null) {
        addPage(pages, baseUrl, path, "manifest");
      }
    }
    return Array.from(pages.values())
      .sort((a, b) => {
        if (a.path === "/") return -1;
        if (b.path === "/") return 1;
        const aPriority = PAGE_TYPE_PRIORITY.indexOf(a.pageType);
        const bPriority = PAGE_TYPE_PRIORITY.indexOf(b.pageType);
        if (aPriority !== bPriority) return aPriority - bPriority;
        if (a.depth !== b.depth) return a.depth - b.depth;
        return a.path.localeCompare(b.path);
      })
      .slice(0, maxPages);
  }

  // Step 0: Check robots.txt
  const disallowed = await fetchDisallowedPaths(baseUrl);

  // Step 1: Try sitemap.xml
  let pages = await discoverFromSitemap(baseUrl, disallowed, maxPages);

  // Step 2: Fetch homepage and extract navigation links
  await delay(DELAY_BETWEEN_FETCHES);
  const homepageHtml = await safeFetch(baseUrl);

  if (homepageHtml) {
    // Always add the homepage itself
    if (!pages.has("/")) {
      const title = extractTitle(homepageHtml);
      addPage(pages, baseUrl, "/", pages.size === 0 ? "nav" : "sitemap", title);
    }

    pages = await discoverFromNavigation(
      baseUrl,
      homepageHtml,
      disallowed,
      pages,
      maxPages,
    );
  }

  // Step 3: Probe common paths if navigation yielded fewer than 3 pages
  // Count pages that came from nav source
  const allPages = Array.from(pages.values());
  const navCount = allPages.filter((p) => p.source === "nav").length;
  if (navCount < 3) {
    pages = await discoverFromProbing(baseUrl, disallowed, pages, maxPages);
  }

  if (pages.size <= 2) {
    console.warn(`  [Warning] Only ${pages.size} page(s) discovered. Consider using --pages to provide specific URLs.`);
  }

  return Array.from(pages.values())
    .sort((a, b) => {
      if (a.path === "/") return -1;
      if (b.path === "/") return 1;
      const aPriority = PAGE_TYPE_PRIORITY.indexOf(a.pageType);
      const bPriority = PAGE_TYPE_PRIORITY.indexOf(b.pageType);
      if (aPriority !== bPriority) return aPriority - bPriority;
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.path.localeCompare(b.path);
    })
    .slice(0, maxPages);
}
