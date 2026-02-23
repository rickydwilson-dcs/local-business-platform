# Claude Implementation Plan: Pipeline Discovery + Test Site Review UX

**Date:** 2026-02-23
**Scope:** Two areas — smarter URL discovery, better test site review experience

---

## Phase 1: URL Manifest (`--pages` flag)

### 1.1 Extend CLI argument parsing

**File:** `tools/analyse-site.ts`

Add `--pages` flag to `CliArgs` interface and `parseArgs()`:

```typescript
interface CliArgs {
  url: string;
  pages?: string[];  // NEW: explicit URL list
  name?: string;
  output?: string;
  maxPages: number;
  dryRun: boolean;
  skipExamples: boolean;
  htmlOnly: boolean;
}
```

In the switch block, add:
```typescript
case "--pages":
  args.pages = next.split(",").map(u => u.trim());
  i++;
  break;
```

### 1.2 Extend `discoverPages()` options

**File:** `tools/lib/site-discovery.ts`

Add `pages?: string[]` to the options parameter:

```typescript
export async function discoverPages(
  url: string,
  options?: { maxPages?: number; pages?: string[] },
): Promise<DiscoveredPage[]> {
```

When `options.pages` is provided:
1. Skip all three discovery strategies (sitemap, nav, probing)
2. Parse each provided URL into a `DiscoveredPage` with `source: "manifest"`
3. Classify each by path using `classifyPage()`
4. Apply page-type priority sorting (Phase 3)
5. Return sliced to `maxPages`

### 1.3 Add `"manifest"` to source union

**File:** `tools/lib/reference-analysis-types.ts`

```typescript
interface DiscoveredPage {
  source: "sitemap" | "nav" | "probe" | "manifest";
  // ... rest unchanged
}
```

### 1.4 Wire `--pages` into Step 2

**File:** `tools/analyse-site.ts` (line 251)

```typescript
const discoveredPages = await discoverPages(args.url, {
  maxPages: args.maxPages,
  pages: args.pages,
});
```

### Verification Gate

```bash
pnpm type-check
# Manual: run with --pages flag and verify exactly those pages appear
npx tsx tools/analyse-site.ts --url https://example.com --pages https://example.com/,https://example.com/about --dry-run --html-only
```

---

## Phase 2: Fix Base-URL Scoping

### 2.1 Preserve path prefix in `normaliseBaseUrl()`

**File:** `tools/lib/site-discovery.ts`

Replace:
```typescript
function normaliseBaseUrl(raw: string): string {
  const url = new URL(raw);
  return `${url.protocol}//${url.host}`;
}
```

With:
```typescript
function normaliseBaseUrl(raw: string): string {
  const url = new URL(raw);
  let basePath = url.pathname;
  // Strip trailing slash (except root)
  if (basePath.length > 1 && basePath.endsWith("/")) {
    basePath = basePath.slice(0, -1);
  }
  return `${url.protocol}//${url.host}${basePath === "/" ? "" : basePath}`;
}
```

This means for `https://themefoundry.io/themes/bold/`, baseUrl becomes `https://themefoundry.io/themes/bold`.

### 2.2 Update `isSameDomain()` to `isUnderBase()`

The function needs to check that a URL is under the base path, not just the same host:

```typescript
function isUnderBase(href: string, baseUrl: string): boolean {
  try {
    const target = new URL(href, baseUrl);
    const base = new URL(baseUrl);
    if (target.hostname !== base.hostname) return false;
    // Check target path is under base path
    return target.pathname === base.pathname ||
      target.pathname.startsWith(base.pathname + "/");
  } catch {
    return false;
  }
}
```

### 2.3 Update `toCleanPath()` to return relative paths

Currently returns absolute paths (`/themes/bold/about`). Needs to return paths relative to the base (`/about`):

```typescript
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

    // Strip trailing slash (except root)
    if (targetPath.length > 1 && targetPath.endsWith("/")) {
      targetPath = targetPath.slice(0, -1);
    }
    return targetPath;
  } catch {
    return null;
  }
}
```

### 2.4 Update common path probing

Currently probes `${baseUrl}${path}` which for a subdirectory base would produce `https://host.com/themes/bold/about`. This is now correct because `normaliseBaseUrl` preserves the path. But `isUnderBase()` needs to be used in place of `isSameDomain()` throughout.

### 2.5 Update `addPage()` URL construction

The `addPage()` function constructs URLs as `${baseUrl}${normPath}`. With the path-preserving base, this naturally becomes `https://host.com/themes/bold/about` — correct.

### Verification Gate

```bash
pnpm type-check
# Unit test: normaliseBaseUrl("https://host.com/themes/bold/") === "https://host.com/themes/bold"
# Unit test: toCleanPath("https://host.com/themes/bold/about", "https://host.com/themes/bold") === "/about"
# Unit test: isUnderBase("https://host.com/themes/bold/about", "https://host.com/themes/bold") === true
# Unit test: isUnderBase("https://host.com/other-page", "https://host.com/themes/bold") === false
```

---

## Phase 3: Page-Type Priority Selection

### 3.1 Define priority order

**File:** `tools/lib/site-discovery.ts`

Add a constant after `COMMON_PATHS`:

```typescript
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
```

### 3.2 Apply priority in `discoverPages()` before slicing

Replace the current sort + slice at the end of `discoverPages()`:

```typescript
// Sort by page-type priority, then by depth, then alphabetically
return Array.from(pages.values())
  .sort((a, b) => {
    // Home always first
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    // Then by page type priority
    const aPriority = PAGE_TYPE_PRIORITY.indexOf(a.pageType);
    const bPriority = PAGE_TYPE_PRIORITY.indexOf(b.pageType);
    if (aPriority !== bPriority) return aPriority - bPriority;
    // Then by depth
    if (a.depth !== b.depth) return a.depth - b.depth;
    // Then alphabetically
    return a.path.localeCompare(b.path);
  })
  .slice(0, maxPages);
```

This means with maxPages=10, we get home + services-list + about + blog-list + contact before any blog-posts or custom pages.

### 3.3 Low page count warning

After discovery completes, before the return:

```typescript
if (pages.size <= 2 && !options?.pages) {
  console.warn(`  [Warning] Only ${pages.size} page(s) discovered. Consider using --pages to provide specific URLs.`);
}
```

### Verification Gate

```bash
pnpm type-check
# Verify: given 15 discovered pages, maxPages=10, the returned set prioritises by type
```

---

## Phase 4: Expand `classifyPage()` with Synonyms

### 4.1 Add synonym map

**File:** `tools/lib/site-discovery.ts`

Add before `classifyPage()`:

```typescript
/** Path segment synonyms for page type classification. */
const PAGE_TYPE_SYNONYMS: Record<string, PageType> = {
  // About variants
  "about-us": "about",
  "our-story": "about",
  "who-we-are": "about",
  "team": "about",
  "our-team": "about",

  // Services variants
  "services": "services-list",
  "our-services": "services-list",
  "what-we-do": "services-list",
  "solutions": "services-list",
  "capabilities": "services-list",
  "expertise": "services-list",

  // Contact variants
  "contact": "contact",
  "contact-us": "contact",
  "get-in-touch": "contact",
  "enquiry": "contact",
  "enquiries": "contact",

  // Blog variants
  "blog": "blog-list",
  "news": "blog-list",
  "articles": "blog-list",
  "insights": "blog-list",
  "resources": "blog-list",

  // Projects variants
  "projects": "projects",
  "portfolio": "projects",
  "work": "projects",
  "case-studies": "projects",
  "gallery": "projects",

  // Reviews variants
  "reviews": "reviews",
  "testimonials": "reviews",

  // Pricing variants
  "pricing": "pricing",
  "plans": "pricing",
  "packages": "pricing",

  // Locations variants
  "locations": "locations-list",
  "areas": "locations-list",
  "areas-we-cover": "locations-list",
  "service-areas": "locations-list",
};
```

### 4.2 Update `classifyPage()` to check synonyms

```typescript
function classifyPage(path: string): PageType {
  const lower = path.toLowerCase();

  if (lower === "/" || lower === "") return "home";

  // Extract the first path segment for synonym matching
  const firstSegment = lower.split("/").filter(Boolean)[0] ?? "";

  // Check synonym map first
  const synonymMatch = PAGE_TYPE_SYNONYMS[firstSegment];
  if (synonymMatch) {
    // For list types, check if there's a sub-path (making it a detail page)
    const hasSubPath = lower.split("/").filter(Boolean).length > 1;
    if (hasSubPath) {
      if (synonymMatch === "services-list") return "service-detail";
      if (synonymMatch === "blog-list") return "blog-post";
      if (synonymMatch === "locations-list") return "location-detail";
    }
    return synonymMatch;
  }

  // Fallback to existing exact patterns for any missed cases
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
```

### Verification Gate

```bash
pnpm type-check
# Unit tests:
# classifyPage("/our-services") === "services-list"
# classifyPage("/what-we-do") === "services-list"
# classifyPage("/what-we-do/plumbing") === "service-detail"
# classifyPage("/get-in-touch") === "contact"
# classifyPage("/portfolio") === "projects"
# classifyPage("/testimonials") === "reviews"
# classifyPage("/news") === "blog-list"
# classifyPage("/news/my-article") === "blog-post"
# classifyPage("/random-page") === "custom"  (no false positive)
```

---

## Phase 5: Fix Props Access Bug

### 5.1 Update AI prompt

**File:** `tools/lib/theme-component-templates.ts`

In `buildComponentGenerationPrompt()`, add a new rule after rule 5:

```
5. The component receives "props" as the parameter name.
6. Access props using ONLY dot notation with camelCase: props.backgroundImage, props.ctaButtons, props.heading.
   NEVER use bracket notation like props['background-image'] or props['cta-buttons'].
   The props interface uses camelCase names — match them exactly.
```

Renumber subsequent rules (old 6 becomes 7, old 7 becomes 8, etc.).

### 5.2 Add post-processing regex

**File:** `tools/lib/theme-component-generator.ts`

Add a new function after `validateAndFixTokenClasses()`:

```typescript
/**
 * Convert bracket-notation prop access to dot-notation camelCase.
 * e.g. props['background-image'] → props.backgroundImage
 *      props['cta-button'] → props.ctaButton
 */
function fixBracketNotationProps(content: string): { content: string; fixCount: number } {
  let fixCount = 0;

  const fixed = content.replace(
    /props\['([a-z][a-z0-9]*(?:-[a-z0-9]+)*)'\]/g,
    (match, key: string) => {
      // Convert kebab-case to camelCase
      const camelKey = key.replace(/-([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
      fixCount++;
      return `props.${camelKey}`;
    }
  );

  return { content: fixed, fixCount };
}
```

Key design decisions in the regex:
- Only matches `props['kebab-key']` with single quotes and lowercase kebab keys
- Does NOT match `props['items']` (no hyphen, already valid) — wait, actually it does match because the pattern is `[a-z][a-z0-9]*(?:-[a-z0-9]+)*` which also matches `items`. That's fine — `props['items']` becomes `props.items` which is correct.
- Does NOT match `props['Items']` (uppercase) or `props["key"]` (double quotes) — these are less common and may be intentional.
- Chained access like `props['cta-button'].map(...)` becomes `props.ctaButton.map(...)` — correct.
- Array access like `props['items'][0]` becomes `props.items[0]` — correct.

### 5.3 Wire into `generateSingleComponent()`

In `generateSingleComponent()`, after the token class validation block (around line 276), add:

```typescript
// Post-generation: Fix bracket-notation prop access
if (usedAI) {
  const { content: propsFixed, fixCount } = fixBracketNotationProps(content);
  if (fixCount > 0) {
    warnings.push(`${blueprint.name}: Fixed ${fixCount} bracket-notation prop accesses → dot notation`);
    content = propsFixed;
  }
}
```

### Verification Gate

```bash
pnpm type-check
# Manual verification: run fixBracketNotationProps on a sample string:
# Input:  `props['event-info-cta']` → Output: `props.eventInfoCta`
# Input:  `props['items'][0]` → Output: `props.items[0]`
# Input:  `props.heading` → Output: `props.heading` (unchanged)
```

---

## Phase 6: Placeholder Images in Example Pages

### 6.1 Add placeholder SVG generator

**File:** `tools/lib/page-template-generator.ts`

Add a helper function:

```typescript
/** Generate an inline SVG data URI for a placeholder image. */
function placeholderImageSvg(width: number, height: number, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect fill="#E5E7EB" width="${width}" height="${height}"/><text fill="#9CA3AF" font-family="system-ui,sans-serif" font-size="14" text-anchor="middle" x="${width / 2}" y="${height / 2 + 5}">${label} (${width}x${height})</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
```

### 6.2 Detect image props from blueprint contentSlots

Add a helper that examines a section's blueprint to find image-type slots:

```typescript
function getImageProps(blueprint: SectionBlueprint): Map<string, { width: number; height: number }> {
  const imageProps = new Map<string, { width: number; height: number }>();
  for (const slot of blueprint.contentSlots) {
    const lower = slot.toLowerCase();
    if (/image|photo|background|logo|avatar|banner|thumbnail/i.test(lower)) {
      const propName = sanitiseSlotName(slot);
      // Assign reasonable default dimensions based on slot purpose
      let width = 800, height = 400;
      if (/logo|avatar|icon/i.test(lower)) { width = 200; height = 200; }
      else if (/banner|hero|background/i.test(lower)) { width = 1920; height = 600; }
      else if (/thumbnail|card/i.test(lower)) { width = 400; height = 300; }
      imageProps.set(propName, { width, height });
    }
  }
  return imageProps;
}
```

Note: need to import `sanitiseSlotName` from `theme-component-templates.ts` — currently it's not exported. Export it.

### 6.3 Pass placeholder props in `generatePageTsx()`

Currently each section renders:
```tsx
<${resolved.componentName} />
```

Update to pass image placeholder props when the blueprint has image slots:

```tsx
const bp = blueprintMap.get(section.blueprintId);
const imageProps = bp ? getImageProps(bp) : new Map();

if (imageProps.size > 0) {
  const propsEntries = [...imageProps.entries()].map(([name, dims]) => {
    const uri = placeholderImageSvg(dims.width, dims.height, name);
    return `${name}={{ src: "${uri}", alt: "Placeholder: ${name}" }}`;
  });
  sectionLines.push(`      <${resolved.componentName} ${propsEntries.join(" ")} />`);
} else {
  sectionLines.push(`      <${resolved.componentName} />`);
}
```

### 6.4 Export `sanitiseSlotName`

**File:** `tools/lib/theme-component-templates.ts`

Change `function sanitiseSlotName` to `export function sanitiseSlotName`.

### Verification Gate

```bash
pnpm type-check
# Verify: a generated page TSX for a blueprint with "backgroundImage" slot renders:
# <HeroComponent backgroundImage={{ src: "data:image/svg+xml,...", alt: "Placeholder: backgroundImage" }} />
```

---

## Phase 7: Review Panel

### 7.1 Generate route manifest JSON

**File:** `tools/lib/page-template-generator.ts`

In `generateExamplePages()`, after generating all pages, write a manifest:

```typescript
// Write route manifest for review panel
const routeManifest = pages.map(p => ({
  pageType: p.pageType,
  route: p.outputPath.replace(/^app/, "").replace(/\/page\.tsx$/, "") || "/",
  label: p.pageType.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
}));
const manifestPath = path.join(exampleDir, "route-manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(routeManifest, null, 2), "utf8");
console.log(`  ✓ route-manifest.json`);
```

### 7.2 Create ReviewPanel component

**File:** `tools/lib/page-template-generator.ts`

Generate a `ReviewPanel` component file alongside the example pages:

```typescript
// Write ReviewPanel component
const reviewPanelContent = `"use client";

import { useState } from "react";

const ROUTES: Array<{ route: string; label: string; pageType: string }> = ${JSON.stringify(routeManifest, null, 2)};

export function ReviewPanel() {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white text-xs px-3 py-2 rounded-full shadow-lg hover:bg-gray-700"
        title="Show review panel"
      >
        Routes
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-gray-900/95 text-white rounded-lg shadow-2xl border border-gray-700 max-w-xs w-72 text-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="font-semibold text-xs uppercase tracking-wider text-gray-400">Review Panel</span>
        <button onClick={() => setCollapsed(true)} className="text-gray-400 hover:text-white text-xs">Hide</button>
      </div>
      <nav className="px-3 py-2 max-h-64 overflow-y-auto">
        {ROUTES.map((r) => (
          <a
            key={r.route}
            href={r.route}
            className={\`block py-1.5 px-2 rounded text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors \${
              typeof window !== "undefined" && window.location.pathname === r.route ? "bg-gray-700 text-white font-medium" : ""
            }\`}
          >
            <span className="text-gray-500 text-xs mr-2">{r.pageType}</span>
            {r.route}
          </a>
        ))}
      </nav>
    </div>
  );
}
`;

const reviewPanelPath = path.join(exampleDir, "components", "ReviewPanel.tsx");
fs.mkdirSync(path.dirname(reviewPanelPath), { recursive: true });
fs.writeFileSync(reviewPanelPath, reviewPanelContent, "utf8");
console.log(`  ✓ components/ReviewPanel.tsx`);
```

### 7.3 Update pipeline.ingest.md Step 5e to include ReviewPanel

**File:** `.claude/commands/pipeline.ingest.md`

In the bare shell layout.tsx template, add the ReviewPanel import and render:

```typescript
import { ReviewPanel } from './components/ReviewPanel';

// ... in the body:
<ThemeProvider theme="<theme-name>" registry={<camelCaseThemeName>Registry}>
  {children}
  <ReviewPanel />
</ThemeProvider>
```

### 7.4 Update Step 5f to copy ReviewPanel

In the example page overlay step, also copy the ReviewPanel component:

```bash
cp -r output/ingestion/<theme-name>/example-pages/components/ sites/test-<theme-name>/app/components/
```

### Verification Gate

```bash
pnpm type-check
# Manual: start test site dev server, verify review panel appears bottom-right
# Verify: clicking a link navigates to the correct route
```

---

## Phase 8: Unit Tests

### 8.1 Write tests for site-discovery changes

**File:** `tools/__tests__/site-discovery.test.ts` (new)

Test cases:
- `normaliseBaseUrl()` preserves subdirectory paths
- `classifyPage()` synonym matching
- `classifyPage()` sub-path detection (synonym + child = detail page)
- Page-type priority sorting
- `--pages` manifest mode (mock: provide 3 URLs, verify 3 DiscoveredPages returned)

### 8.2 Write tests for props fix

**File:** `tools/__tests__/theme-component-generator.test.ts` (new or extend existing)

Test cases:
- `fixBracketNotationProps()` converts kebab bracket notation to camelCase dot notation
- Does not alter already-correct dot notation
- Handles chained access (`props['cta'].map(...)`)
- Handles array access (`props['items'][0]`)

### Verification Gate

```bash
pnpm type-check && npx vitest run tools/__tests__/site-discovery.test.ts tools/__tests__/theme-component-generator.test.ts
```

---

## Phase 9: Final Verification and Commit

```bash
pnpm type-check
pnpm test  # all existing tests still pass
```

Commit files:
- `tools/lib/site-discovery.ts`
- `tools/lib/reference-analysis-types.ts`
- `tools/analyse-site.ts`
- `tools/lib/theme-component-templates.ts`
- `tools/lib/theme-component-generator.ts`
- `tools/lib/page-template-generator.ts`
- `.claude/commands/pipeline.ingest.md`
- `tools/__tests__/site-discovery.test.ts`
- `tools/__tests__/theme-component-generator.test.ts`

---

## Risks and Trade-offs

1. **`classifyPage()` false positives.** Adding synonyms like `/work` → `projects` could misclassify unrelated pages on showcase sites. Mitigation: only match the first path segment, not arbitrary path components. `/work` matches but `/how-we-work` does not (it starts with `how-we-work`, not `work`).

2. **Base-URL change affects all strategies.** Preserving the path in `normaliseBaseUrl()` means sitemap parsing now filters for URLs under that path. If a sitemap lists pages across the whole domain, we only pick up ones under the reference subdirectory. This is correct behavior for showcase sites but could be surprising for sites where the user provides a deep link as the reference URL when they actually want the whole site. Mitigation: the `--pages` flag provides an escape hatch.

3. **Post-processing regex for props.** The regex `props\['([a-z][a-z0-9]*(?:-[a-z0-9]+)*)'\]` only matches single-quoted lowercase keys. If the AI uses double quotes (`props["key"]`) or mixed case (`props['ctaButton']`), it won't match. For double quotes, we could add a second regex. For already-camelCase bracket notation, converting `props['ctaButton']` to `props.ctaButton` is harmless and correct. Consider matching both quote styles.

4. **Review panel Tailwind classes.** The review panel uses Tailwind utilities (`bg-gray-900`, `text-white`) that must be available in the test site's Tailwind config. Since all sites use the platform's Tailwind setup, standard gray/white classes are always available. No risk.

5. **Placeholder image data URIs in JSX.** Long SVG data URIs in JSX props are ugly but functional. The data URIs are generated at build time (when `generateExamplePages` runs), not at runtime. The generated `.tsx` files will have long lines but they're auto-generated and not meant to be edited by hand. Acceptable trade-off.
