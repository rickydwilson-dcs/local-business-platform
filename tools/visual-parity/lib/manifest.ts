/**
 * Route manifest — discovery, classification, persistence.
 *
 * Discovers routes by parsing the site's sitemap (index + sub-sitemaps).
 * Classifies each route into a pageType so thresholds and report groupings
 * can be applied uniformly.
 */

import * as fs from "fs";
import * as path from "path";

export interface ManifestRoute {
  path: string;
  pageType: string;
  slug: string;
}

export interface Manifest {
  version: 1;
  siteSlug: string;
  baselineUrl: string;
  capturedAt: string;
  routes: ManifestRoute[];
}

const MANIFEST_FILENAME = "manifest.json";

export function manifestPath(dir: string): string {
  return path.join(dir, MANIFEST_FILENAME);
}

export function readManifest(dir: string): Manifest {
  const raw = fs.readFileSync(manifestPath(dir), "utf8");
  return JSON.parse(raw) as Manifest;
}

export function writeManifest(dir: string, manifest: Manifest): void {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(manifestPath(dir), JSON.stringify(manifest, null, 2));
}

export function classifyRoute(routePath: string): { pageType: string; slug: string } {
  if (routePath === "/" || routePath === "") return { pageType: "home", slug: "home" };

  const segments = routePath.replace(/^\/+|\/+$/g, "").split("/");

  if (segments[0] === "services") {
    if (segments.length === 1) return { pageType: "services", slug: "services" };
    if (segments.length === 2) return { pageType: "service-detail", slug: segments[1] };
    return { pageType: "service-location-detail", slug: `${segments[1]}--${segments[2]}` };
  }

  if (segments[0] === "locations") {
    if (segments.length === 1) return { pageType: "locations", slug: "locations" };
    return { pageType: "location-detail", slug: segments[1] };
    // Note: county-vs-town classification happens post-hoc from MDX frontmatter;
    // the initial classification lumps both under location-detail. The semantic
    // comparer is responsible for catching structural mismatches between them.
  }

  if (segments[0] === "blog") {
    if (segments.length === 1) return { pageType: "blog", slug: "blog" };
    return { pageType: "blog-post", slug: segments[1] };
  }

  if (segments[0] === "projects") {
    if (segments.length === 1) return { pageType: "projects", slug: "projects" };
    return { pageType: "project-detail", slug: segments[1] };
  }

  if (segments[0] === "about") return { pageType: "about", slug: "about" };
  if (segments[0] === "reviews") return { pageType: "reviews", slug: "reviews" };
  if (segments[0] === "contact") return { pageType: "contact", slug: "contact" };
  if (segments[0] === "privacy-policy") return { pageType: "privacy", slug: "privacy" };
  if (segments[0] === "cookie-policy") return { pageType: "cookie", slug: "cookie" };

  return { pageType: "other", slug: segments.join("--") };
}

export async function discoverRoutesFromSitemap(baseUrl: string): Promise<ManifestRoute[]> {
  const seen = new Set<string>();
  const routes: ManifestRoute[] = [];

  const rootCandidates = [
    new URL("/sitemap-index.xml", baseUrl).toString(),
    new URL("/sitemap.xml", baseUrl).toString(),
  ];

  const subSitemaps = new Set<string>();
  for (const candidate of rootCandidates) {
    const xml = await fetchText(candidate);
    if (!xml) continue;
    const sitemapUrls = extractTagValues(xml, "sitemap", "loc");
    if (sitemapUrls.length > 0) {
      sitemapUrls.forEach((u) => subSitemaps.add(u));
    }
    const urlLocs = extractTagValues(xml, "url", "loc");
    urlLocs.forEach((u) => addRoute(u));
    break;
  }

  if (subSitemaps.size === 0) {
    for (const known of [
      "/services/sitemap.xml",
      "/locations/sitemap.xml",
      "/blog/sitemap.xml",
      "/projects/sitemap.xml",
    ]) {
      subSitemaps.add(new URL(known, baseUrl).toString());
    }
  }

  for (const subSitemap of subSitemaps) {
    const xml = await fetchText(subSitemap);
    if (!xml) continue;
    const urlLocs = extractTagValues(xml, "url", "loc");
    urlLocs.forEach((u) => addRoute(u));
  }

  const fallbackStatics = [
    "/",
    "/about",
    "/contact",
    "/reviews",
    "/privacy-policy",
    "/cookie-policy",
    "/services",
    "/locations",
    "/blog",
    "/projects",
  ];
  for (const s of fallbackStatics) {
    addRoute(new URL(s, baseUrl).toString());
  }

  return routes.sort((a, b) => a.path.localeCompare(b.path));

  function addRoute(absoluteUrl: string) {
    try {
      const u = new URL(absoluteUrl);
      const relPath = u.pathname.replace(/\/$/, "") || "/";
      if (seen.has(relPath)) return;
      seen.add(relPath);
      const cls = classifyRoute(relPath);
      routes.push({ path: relPath, pageType: cls.pageType, slug: cls.slug });
    } catch {
      /* ignore malformed */
    }
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "lbp-visual-parity/1.0" } });
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch {
    return null;
  }
}

function extractTagValues(xml: string, outerTag: string, innerTag: string): string[] {
  const outerRe = new RegExp(`<${outerTag}[\\s\\S]*?</${outerTag}>`, "g");
  const innerRe = new RegExp(`<${innerTag}>([^<]+)</${innerTag}>`);
  const values: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = outerRe.exec(xml)) !== null) {
    const inner = innerRe.exec(m[0]);
    if (inner) values.push(inner[1].trim());
  }
  return values;
}
