import { describe, it, expect } from "vitest";
import { analyzeHtmlStructure } from "../lib/html-structure-analyzer";
import type { DiscoveredPage } from "../lib/reference-analysis-types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create a minimal DiscoveredPage fixture for passing to analyzeHtmlStructure.
 */
function makePage(overrides?: Partial<DiscoveredPage>): DiscoveredPage {
  return {
    url: "https://example.com",
    path: "/",
    source: "nav",
    pageType: "home",
    depth: 0,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("analyzeHtmlStructure", () => {
  it("detects <nav>, <section>, and <footer> as separate sections", () => {
    const html = `
      <html>
        <body>
          <nav>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          <section>
            <h1>Welcome</h1>
            <p>Hello world</p>
          </section>
          <footer>
            <a href="/privacy">Privacy</a>
          </footer>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());

    expect(result.sections.length).toBeGreaterThanOrEqual(3);

    const tags = result.sections.map((s) => s.tag);
    expect(tags).toContain("nav");
    expect(tags).toContain("section");
    expect(tags).toContain("footer");
  });

  it("extracts heading text from a section with <h1>", () => {
    const html = `
      <html>
        <body>
          <section>
            <h1>Welcome to Our Site</h1>
            <p>Some content here</p>
          </section>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());
    const sectionWithHeading = result.sections.find((s) => s.headingText !== undefined);

    expect(sectionWithHeading).toBeDefined();
    expect(sectionWithHeading!.headingText).toBe("Welcome to Our Site");
  });

  it("detects hasImages when a section contains <img>", () => {
    const html = `
      <html>
        <body>
          <section>
            <h2>Gallery</h2>
            <img src="/photo.jpg" alt="A photo" />
          </section>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());
    const sectionWithImage = result.sections.find((s) => s.tag === "section");

    expect(sectionWithImage).toBeDefined();
    expect(sectionWithImage!.hasImages).toBe(true);
  });

  it("sets hasImages to false when no <img> is present", () => {
    const html = `
      <html>
        <body>
          <section>
            <h2>Text Only</h2>
            <p>No images here</p>
          </section>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());
    const section = result.sections.find((s) => s.tag === "section");

    expect(section).toBeDefined();
    expect(section!.hasImages).toBe(false);
  });

  it("detects hasForm when a section contains <form>", () => {
    const html = `
      <html>
        <body>
          <section>
            <h2>Contact Us</h2>
            <form action="/submit">
              <input type="text" name="name" />
              <button type="submit">Send</button>
            </form>
          </section>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());
    const sectionWithForm = result.sections.find((s) => s.hasForm);

    expect(sectionWithForm).toBeDefined();
    expect(sectionWithForm!.hasForm).toBe(true);
  });

  it("classifies <nav> section as 'Navigation'", () => {
    const html = `
      <html>
        <body>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());
    const navSection = result.sections.find((s) => s.tag === "nav");

    expect(navSection).toBeDefined();
    expect(navSection!.estimatedCategory).toBe("Navigation");
  });

  it("classifies <footer> section as 'Footer'", () => {
    const html = `
      <html>
        <body>
          <section><h1>Main</h1></section>
          <footer>
            <p>Copyright 2025</p>
            <a href="/privacy">Privacy</a>
          </footer>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());
    const footerSection = result.sections.find((s) => s.tag === "footer");

    expect(footerSection).toBeDefined();
    expect(footerSection!.estimatedCategory).toBe("Footer");
  });

  it("classifies the first non-nav/non-footer section as 'Hero'", () => {
    const html = `
      <html>
        <body>
          <nav><a href="/">Home</a></nav>
          <section>
            <h1>Big Headline</h1>
            <p>Welcome to our business</p>
          </section>
          <section>
            <h2>Our Services</h2>
            <p>We do things</p>
          </section>
          <footer><p>Footer</p></footer>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());

    // Filter to only <section> tags (skip nav/footer)
    const contentSections = result.sections.filter((s) => s.tag === "section");
    expect(contentSections.length).toBeGreaterThanOrEqual(2);

    // The first content section should be classified as Hero
    expect(contentSections[0].estimatedCategory).toBe("Hero");

    // The second content section should NOT be Hero
    expect(contentSections[1].estimatedCategory).not.toBe("Hero");
  });

  it("extracts navigation links from <nav> elements", () => {
    const html = `
      <html>
        <body>
          <nav>
            <a href="/about">About</a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
          </nav>
          <section><h1>Main</h1></section>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());

    expect(result.navigationLinks).toContain("/about");
    expect(result.navigationLinks).toContain("/services");
    expect(result.navigationLinks).toContain("/contact");
  });

  it("extracts footer links from <footer> elements", () => {
    const html = `
      <html>
        <body>
          <section><h1>Main</h1></section>
          <footer>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </footer>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());

    expect(result.footerLinks).toContain("/privacy");
    expect(result.footerLinks).toContain("/terms");
  });

  it("classifies a section with hero class as 'Hero' even when not the first section", () => {
    const html = `
      <html>
        <body>
          <nav><a href="/">Home</a></nav>
          <section><h2>Something first</h2></section>
          <section class="hero-banner">
            <h1>The Real Hero</h1>
          </section>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());
    const heroClassSection = result.sections.find(
      (s) => s.cssClasses.some((c) => c.includes("hero")),
    );

    expect(heroClassSection).toBeDefined();
    expect(heroClassSection!.estimatedCategory).toBe("Hero");
  });

  it("classifies a section with <form> as 'CTA'", () => {
    const html = `
      <html>
        <body>
          <section><h1>Hero</h1></section>
          <section>
            <h2>Get in touch</h2>
            <form action="/contact">
              <input type="email" placeholder="Email" />
              <button>Submit</button>
            </form>
          </section>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());
    const formSection = result.sections.find((s) => s.hasForm);

    expect(formSection).toBeDefined();
    expect(formSection!.estimatedCategory).toBe("CTA");
  });

  it("returns the DiscoveredPage in the result", () => {
    const page = makePage({ url: "https://example.com/about", path: "/about", pageType: "about" });
    const html = "<html><body><section><h1>About</h1></section></body></html>";

    const result = analyzeHtmlStructure(html, page);

    expect(result.page).toBe(page);
    expect(result.page.pageType).toBe("about");
  });

  it("handles HTML with no semantic sections gracefully", () => {
    const html = `
      <html>
        <body>
          <p>Just a paragraph</p>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());

    expect(result.sections).toEqual([]);
    expect(result.navigationLinks).toEqual([]);
    expect(result.footerLinks).toEqual([]);
  });

  it("extracts heading text from nested h2-h6 tags", () => {
    const html = `
      <html>
        <body>
          <section>
            <div>
              <h2>Services <span>We Offer</span></h2>
            </div>
          </section>
        </body>
      </html>
    `;

    const result = analyzeHtmlStructure(html, makePage());
    const section = result.sections.find((s) => s.tag === "section");

    expect(section).toBeDefined();
    expect(section!.headingText).toBe("Services We Offer");
  });
});
