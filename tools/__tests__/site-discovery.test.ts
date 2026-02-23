import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  discoverPages,
  normaliseBaseUrl,
  classifyPage,
  isUnderBase,
  toCleanPath,
} from "../lib/site-discovery";

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

  it("uses manifest pages when --pages option is provided", async () => {
    // fetch should NOT be called when pages option is provided
    fetchMock.mockImplementation(async () => {
      return new Response("Should not be called", { status: 200 });
    });

    const pages = await discoverPages("https://example.com", {
      pages: [
        "https://example.com/",
        "https://example.com/about",
        "https://example.com/services",
      ],
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(pages).toHaveLength(3);
    expect(pages.find((p) => p.path === "/")?.source).toBe("manifest");
    expect(pages.find((p) => p.path === "/about")?.pageType).toBe("about");
    expect(pages.find((p) => p.path === "/services")?.pageType).toBe("services-list");
  });

  it("priority sort: home+services+about come before blog-post/custom", async () => {
    const navPaths = ["/blog/post-1", "/custom-page", "/services", "/about", "/blog"];
    const html = buildNavHtml(navPaths);

    fetchMock.mockImplementation(async (url: unknown) => {
      const urlStr = typeof url === "string" ? url : String(url);
      if (urlStr.includes("robots.txt")) return new Response("User-agent: *\nAllow: /", { status: 200 });
      if (urlStr.includes("sitemap.xml")) return new Response("Not Found", { status: 404 });
      return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
    });

    const pages = await discoverPages("https://example.com", { maxPages: 20 });

    const homeIdx = pages.findIndex((p) => p.pageType === "home");
    const servicesIdx = pages.findIndex((p) => p.pageType === "services-list");
    const aboutIdx = pages.findIndex((p) => p.pageType === "about");
    const blogListIdx = pages.findIndex((p) => p.pageType === "blog-list");
    const blogPostIdx = pages.findIndex((p) => p.pageType === "blog-post");

    expect(homeIdx).toBe(0);
    if (servicesIdx !== -1 && blogPostIdx !== -1) {
      expect(servicesIdx).toBeLessThan(blogPostIdx);
    }
    if (aboutIdx !== -1 && blogPostIdx !== -1) {
      expect(aboutIdx).toBeLessThan(blogPostIdx);
    }
    if (blogListIdx !== -1 && blogPostIdx !== -1) {
      expect(blogListIdx).toBeLessThan(blogPostIdx);
    }
  });
});

// ---------------------------------------------------------------------------
// normaliseBaseUrl
// ---------------------------------------------------------------------------

describe("normaliseBaseUrl", () => {
  it("strips trailing slash from domain root", () => {
    expect(normaliseBaseUrl("https://host.com/")).toBe("https://host.com");
  });

  it("preserves subdirectory path prefix", () => {
    expect(normaliseBaseUrl("https://host.com/themes/bold/")).toBe("https://host.com/themes/bold");
  });

  it("preserves subdirectory without trailing slash", () => {
    expect(normaliseBaseUrl("https://host.com/themes/bold")).toBe("https://host.com/themes/bold");
  });
});

// ---------------------------------------------------------------------------
// classifyPage — synonym map
// ---------------------------------------------------------------------------

describe("classifyPage (synonym expansion)", () => {
  it('classifies "/our-services" as services-list', () => {
    expect(classifyPage("/our-services")).toBe("services-list");
  });

  it('classifies "/what-we-do/plumbing" as service-detail', () => {
    expect(classifyPage("/what-we-do/plumbing")).toBe("service-detail");
  });

  it('classifies "/get-in-touch" as contact', () => {
    expect(classifyPage("/get-in-touch")).toBe("contact");
  });

  it('classifies "/portfolio" as projects', () => {
    expect(classifyPage("/portfolio")).toBe("projects");
  });

  it('classifies "/testimonials" as reviews', () => {
    expect(classifyPage("/testimonials")).toBe("reviews");
  });

  it('classifies "/news/my-article" as blog-post', () => {
    expect(classifyPage("/news/my-article")).toBe("blog-post");
  });

  it('classifies "/random-page" as custom (no false positive)', () => {
    expect(classifyPage("/random-page")).toBe("custom");
  });
});

// ---------------------------------------------------------------------------
// isUnderBase
// ---------------------------------------------------------------------------

describe("isUnderBase", () => {
  it("returns true for URL under subdirectory base", () => {
    expect(isUnderBase("https://host.com/themes/bold/about", "https://host.com/themes/bold")).toBe(true);
  });

  it("returns false for URL outside subdirectory base", () => {
    expect(isUnderBase("https://host.com/other", "https://host.com/themes/bold")).toBe(false);
  });

  it("returns true for exact base URL match", () => {
    expect(isUnderBase("https://host.com/themes/bold", "https://host.com/themes/bold")).toBe(true);
  });

  it("returns false for different hostname", () => {
    expect(isUnderBase("https://other.com/themes/bold/about", "https://host.com/themes/bold")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// toCleanPath
// ---------------------------------------------------------------------------

describe("toCleanPath", () => {
  it("strips base path prefix to return relative path", () => {
    expect(toCleanPath("https://host.com/themes/bold/about", "https://host.com/themes/bold")).toBe("/about");
  });

  it("returns / for URL matching the base exactly", () => {
    expect(toCleanPath("https://host.com/themes/bold", "https://host.com/themes/bold")).toBe("/");
  });

  it("returns null for off-domain URL", () => {
    expect(toCleanPath("https://other.com/about", "https://host.com")).toBeNull();
  });

  it("works for domain-root base", () => {
    expect(toCleanPath("https://host.com/about", "https://host.com")).toBe("/about");
  });
});
