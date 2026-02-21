import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { discoverPages } from "../lib/site-discovery";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal HTML page whose <nav> contains the supplied paths as links.
 */
function buildNavHtml(paths: string[], baseUrl = "https://example.com"): string {
  const links = paths
    .map((p) => `<a href="${baseUrl}${p}">${p}</a>`)
    .join("\n");
  return `
    <html>
      <head><title>Test Site</title></head>
      <body>
        <nav>${links}</nav>
        <main><h1>Hello</h1></main>
      </body>
    </html>
  `;
}

// ---------------------------------------------------------------------------
// Mock fetch
// ---------------------------------------------------------------------------

const fetchMock = vi.fn<(...args: unknown[]) => Promise<Response>>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.restoreAllMocks();
});

/**
 * Configure the fetch mock to respond to URLs matching the given map.
 * Any URL not in the map returns a 404 response.
 */
function mockFetchResponses(responseMap: Record<string, string>): void {
  fetchMock.mockImplementation(async (url: unknown) => {
    const urlStr = typeof url === "string" ? url : String(url);

    for (const [pattern, body] of Object.entries(responseMap)) {
      if (urlStr.includes(pattern)) {
        return new Response(body, { status: 200, headers: { "Content-Type": "text/html" } });
      }
    }

    return new Response("Not Found", { status: 404 });
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("discoverPages", () => {
  it("discovers pages from navigation links in homepage HTML", async () => {
    const navPaths = ["/about", "/services", "/contact", "/blog"];
    const html = buildNavHtml(navPaths);

    mockFetchResponses({
      "robots.txt": "User-agent: *\nAllow: /",
      "sitemap.xml": "", // triggers 404-like empty response -- safeFetch returns null on non-ok
      "example.com/about": "<html><title>About</title></html>",
      "example.com/services": "<html><title>Services</title></html>",
      "example.com/contact": "<html><title>Contact</title></html>",
      "example.com/blog": "<html><title>Blog</title></html>",
    });

    // Override the root homepage fetch to return our nav HTML
    fetchMock.mockImplementation(async (url: unknown) => {
      const urlStr = typeof url === "string" ? url : String(url);

      if (urlStr === "https://example.com" || urlStr === "https://example.com/") {
        return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
      }
      if (urlStr.includes("robots.txt")) {
        return new Response("User-agent: *\nAllow: /", { status: 200 });
      }
      if (urlStr.includes("sitemap.xml")) {
        return new Response("Not Found", { status: 404 });
      }
      // Probed paths should return 200 so they get picked up
      return new Response("<html><title>Page</title><body>Content</body></html>", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    });

    const pages = await discoverPages("https://example.com", { maxPages: 20 });

    // Homepage should always be present
    const homePage = pages.find((p) => p.path === "/");
    expect(homePage).toBeDefined();
    expect(homePage!.pageType).toBe("home");

    // Nav links should be discovered
    const discoveredPaths = pages.map((p) => p.path);
    expect(discoveredPaths).toContain("/about");
    expect(discoveredPaths).toContain("/services");
    expect(discoveredPaths).toContain("/contact");
    expect(discoveredPaths).toContain("/blog");
  });

  it("classifies known path patterns correctly via discoverPages", async () => {
    // We provide many nav links to exercise the path classifier
    const navPaths = [
      "/",
      "/about",
      "/services",
      "/services/plumbing",
      "/blog",
      "/blog/my-post",
      "/contact",
      "/locations",
      "/locations/london",
      "/reviews",
      "/pricing",
      "/something-unknown",
    ];

    const html = buildNavHtml(navPaths);

    fetchMock.mockImplementation(async (url: unknown) => {
      const urlStr = typeof url === "string" ? url : String(url);

      if (urlStr.includes("robots.txt")) {
        return new Response("User-agent: *\nAllow: /", { status: 200 });
      }
      if (urlStr.includes("sitemap.xml")) {
        return new Response("Not Found", { status: 404 });
      }
      // All other URLs (homepage + probed pages) return valid HTML
      return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
    });

    const pages = await discoverPages("https://example.com", { maxPages: 50 });
    const byPath = new Map(pages.map((p) => [p.path, p]));

    const expectedClassifications: Record<string, string> = {
      "/": "home",
      "/about": "about",
      "/services": "services-list",
      "/services/plumbing": "service-detail",
      "/blog": "blog-list",
      "/blog/my-post": "blog-post",
      "/contact": "contact",
      "/locations": "locations-list",
      "/locations/london": "location-detail",
      "/reviews": "reviews",
      "/pricing": "pricing",
      "/something-unknown": "custom",
    };

    for (const [pathStr, expectedType] of Object.entries(expectedClassifications)) {
      const page = byPath.get(pathStr);
      expect(page, `Expected page at path "${pathStr}" to be discovered`).toBeDefined();
      expect(page!.pageType).toBe(expectedType);
    }
  });

  it("respects the maxPages cap", async () => {
    // Provide more nav links than the maxPages limit
    const navPaths = Array.from({ length: 20 }, (_, i) => `/page-${i}`);
    const html = buildNavHtml(navPaths);

    fetchMock.mockImplementation(async (url: unknown) => {
      const urlStr = typeof url === "string" ? url : String(url);

      if (urlStr.includes("robots.txt")) {
        return new Response("User-agent: *\nAllow: /", { status: 200 });
      }
      if (urlStr.includes("sitemap.xml")) {
        return new Response("Not Found", { status: 404 });
      }
      return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
    });

    const maxPages = 5;
    const pages = await discoverPages("https://example.com", { maxPages });

    expect(pages.length).toBeLessThanOrEqual(maxPages);
  });

  it("uses default maxPages (10) when no option is provided", async () => {
    const navPaths = Array.from({ length: 25 }, (_, i) => `/page-${i}`);
    const html = buildNavHtml(navPaths);

    fetchMock.mockImplementation(async (url: unknown) => {
      const urlStr = typeof url === "string" ? url : String(url);

      if (urlStr.includes("robots.txt")) {
        return new Response("User-agent: *\nAllow: /", { status: 200 });
      }
      if (urlStr.includes("sitemap.xml")) {
        return new Response("Not Found", { status: 404 });
      }
      return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
    });

    const pages = await discoverPages("https://example.com");

    // Default is 10
    expect(pages.length).toBeLessThanOrEqual(10);
  });

  it("includes homepage even when sitemap already provided pages", async () => {
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://example.com/about</loc></url>
        <url><loc>https://example.com/services</loc></url>
      </urlset>`;

    const homepageHtml = `
      <html><head><title>Home</title></head>
      <body><nav><a href="/about">About</a></nav></body>
      </html>`;

    fetchMock.mockImplementation(async (url: unknown) => {
      const urlStr = typeof url === "string" ? url : String(url);

      if (urlStr.includes("robots.txt")) {
        return new Response("User-agent: *\nAllow: /", { status: 200 });
      }
      if (urlStr.includes("sitemap.xml")) {
        return new Response(sitemapXml, { status: 200, headers: { "Content-Type": "application/xml" } });
      }
      if (urlStr === "https://example.com" || urlStr === "https://example.com/") {
        return new Response(homepageHtml, { status: 200, headers: { "Content-Type": "text/html" } });
      }
      return new Response("<html><body>Page</body></html>", { status: 200 });
    });

    const pages = await discoverPages("https://example.com");
    const homePage = pages.find((p) => p.path === "/");
    expect(homePage).toBeDefined();
    expect(homePage!.pageType).toBe("home");
  });

  it("sorts pages with home first, then by depth, then alphabetically", async () => {
    const navPaths = ["/blog", "/about", "/services/plumbing", "/contact"];
    const html = buildNavHtml(navPaths);

    fetchMock.mockImplementation(async (url: unknown) => {
      const urlStr = typeof url === "string" ? url : String(url);

      if (urlStr.includes("robots.txt")) {
        return new Response("User-agent: *\nAllow: /", { status: 200 });
      }
      if (urlStr.includes("sitemap.xml")) {
        return new Response("Not Found", { status: 404 });
      }
      return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
    });

    const pages = await discoverPages("https://example.com", { maxPages: 20 });

    // Home should always be first
    expect(pages[0].path).toBe("/");

    // Depth-1 pages should come before depth-2 pages
    const depth1Pages = pages.filter((p) => p.depth === 1);
    const depth2Pages = pages.filter((p) => p.depth === 2);

    if (depth1Pages.length > 0 && depth2Pages.length > 0) {
      const lastDepth1Index = pages.indexOf(depth1Pages[depth1Pages.length - 1]);
      const firstDepth2Index = pages.indexOf(depth2Pages[0]);
      expect(lastDepth1Index).toBeLessThan(firstDepth2Index);
    }
  });
});
