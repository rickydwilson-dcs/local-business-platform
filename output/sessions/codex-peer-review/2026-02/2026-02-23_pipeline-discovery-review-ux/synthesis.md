# Implementation Plan: Pipeline Discovery + Test Site Review UX

**Date:** 2026-02-23
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect                         | Claude                                                                 | Codex                                     | Synthesised Decision                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `--pages` semantics            | Full bypass, skip all discovery                                        | Full bypass, skip all discovery           | **Agreed** — full bypass, no merge                                                                                 |
| Props regex scope              | Single-quoted keys only                                                | Single AND double-quoted keys             | **Codex** — match both `props['key']` and `props["key"]` for robustness                                            |
| Residual bracket props         | Warn only                                                              | Hard-fail generation                      | **Codex** — hard-fail prevents silently broken components reaching the test site                                   |
| Priority: detail pages         | `service-detail` after `projects` (rank 10)                            | `service-detail` after `contact` (rank 6) | **Claude** — list pages should be prioritised over detail pages; detail pages are less useful for theme assessment |
| Synonym: contact               | `contact-us`, `get-in-touch`, `enquiry`, `enquiries`                   | Adds `talk-to-us`, `book`, `quote`        | **Merge** — include all synonyms from both lists                                                                   |
| Synonym: services              | `our-services`, `what-we-do`, `solutions`, `capabilities`, `expertise` | Adds `offerings`                          | **Merge** — include all                                                                                            |
| `isUnderBase()` implementation | Explicit rename + implementation + toCleanPath relative paths          | Mentioned but not fully specified         | **Claude** — concrete implementation is needed                                                                     |
| ReviewPanel component          | Generated as `"use client"` with useState for collapse                 | Not specified in detail                   | **Claude** — collapsible panel with route highlighting                                                             |

## Blind Spots Caught

**Codex caught that Claude missed:**

- **Hard-fail on residual bracket props.** If the post-processing regex doesn't catch everything (e.g. dynamic expressions, unusual quoting), silently broken components reach the test site. Hard-failing forces the operator to notice and handle it.
- **Double-quote variant in regex.** The AI may use `props["key"]` as well as `props['key']`. Claude's regex only handles single quotes.
- **Source union ripple.** Adding `"manifest"` to the source union may require updating any switch/if statements that assume exactly 3 values. Need to audit downstream consumers.

**Claude caught that Codex missed:**

- **`sanitiseSlotName` is not exported.** The placeholder image detection needs this function from `theme-component-templates.ts` — it's currently private. Must export it.
- **`toCleanPath()` must return relative paths.** With a path-preserving base URL, `toCleanPath()` currently returns absolute paths like `/themes/bold/about`. It needs to strip the base prefix to return `/about` so that `classifyPage()` and page type matching work correctly.
- **ReviewPanel SSR safety.** `window.location.pathname` must be guarded with `typeof window !== "undefined"` to avoid SSR crashes.

---

## Implementation Plan

### Phase 1: Type Foundation — `"manifest"` Source

**Files:**

- `tools/lib/reference-analysis-types.ts`

**Changes:**

1. Add `"manifest"` to `DiscoveredPage.source` union:
   ```typescript
   source: "sitemap" | "nav" | "probe" | "manifest";
   ```
2. Audit all downstream consumers of `source` field for switch/if exhaustiveness.

**Verification:** `pnpm type-check` — any broken exhaustive checks will surface as type errors.

---

### Phase 2: `--pages` CLI Flag

**Files:**

- `tools/analyse-site.ts`
- `tools/lib/site-discovery.ts`

**Changes:**

2a. Extend `CliArgs` with `pages?: string[]` and add `--pages` to the switch block in `parseArgs()`. Parse as comma-separated, trim, filter empties.

2b. Extend `discoverPages()` options:

```typescript
export async function discoverPages(
  url: string,
  options?: { maxPages?: number; pages?: string[] }
): Promise<DiscoveredPage[]>;
```

When `options.pages` is provided and non-empty:

- Skip all three discovery strategies
- Parse each URL into a `DiscoveredPage` with `source: "manifest"`
- Use the reference URL as the base for `toCleanPath()` (to get relative paths for classification)
- Classify each with `classifyPage()`
- Apply priority sorting (Phase 4)
- Slice to `maxPages`

2c. Wire in `analyse-site.ts` Step 2:

```typescript
const discoveredPages = await discoverPages(args.url, {
  maxPages: args.maxPages,
  pages: args.pages,
});
```

**Verification:**

```bash
pnpm type-check
npx tsx tools/analyse-site.ts --url https://example.com --pages https://example.com/,https://example.com/about --dry-run --html-only
# Should show exactly 2 pages: home + about
```

---

### Phase 3: Fix Base-URL Scoping

**Files:**

- `tools/lib/site-discovery.ts`

**Changes:**

3a. Replace `normaliseBaseUrl()` to preserve path prefix:

```typescript
function normaliseBaseUrl(raw: string): string {
  const url = new URL(raw);
  let basePath = url.pathname;
  if (basePath.length > 1 && basePath.endsWith("/")) {
    basePath = basePath.slice(0, -1);
  }
  return `${url.protocol}//${url.host}${basePath === "/" ? "" : basePath}`;
}
```

3b. Rename `isSameDomain()` → `isUnderBase()` to check both host and path prefix:

```typescript
function isUnderBase(href: string, baseUrl: string): boolean {
  try {
    const target = new URL(href, baseUrl);
    const base = new URL(baseUrl);
    if (target.hostname !== base.hostname) return false;
    return target.pathname === base.pathname || target.pathname.startsWith(base.pathname + "/");
  } catch {
    return false;
  }
}
```

3c. Update `toCleanPath()` to strip base path prefix, returning relative paths:

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

    if (targetPath.length > 1 && targetPath.endsWith("/")) {
      targetPath = targetPath.slice(0, -1);
    }
    return targetPath;
  } catch {
    return null;
  }
}
```

3d. Replace all `isSameDomain()` calls with `isUnderBase()` throughout the file.

3e. `addPage()` URL construction — already correct because `${baseUrl}${normPath}` with path-preserving base produces the right full URL.

**Verification:**

```bash
pnpm type-check
# Unit tests in Phase 8
```

---

### Phase 4: Page-Type Priority Selection

**Files:**

- `tools/lib/site-discovery.ts`

**Changes:**

4a. Add priority constant (after `COMMON_PATHS`):

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

4b. Replace the sort + slice at end of `discoverPages()`:

```typescript
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
```

4c. Low page count warning (before return, when not using manifest):

```typescript
if (pages.size <= 2 && !options?.pages) {
  console.warn(
    `  [Warning] Only ${pages.size} page(s) discovered. Consider using --pages to provide specific URLs.`
  );
}
```

**Verification:** `pnpm type-check`

---

### Phase 5: Expand `classifyPage()` with Synonyms

**Files:**

- `tools/lib/site-discovery.ts`

**Changes:**

5a. Add merged synonym map (union of both plans):

```typescript
const PAGE_TYPE_SYNONYMS: Record<string, PageType> = {
  // About
  "about-us": "about",
  "our-story": "about",
  "who-we-are": "about",
  team: "about",
  "our-team": "about",
  // Services
  services: "services-list",
  "our-services": "services-list",
  "what-we-do": "services-list",
  solutions: "services-list",
  capabilities: "services-list",
  expertise: "services-list",
  offerings: "services-list",
  // Contact
  contact: "contact",
  "contact-us": "contact",
  "get-in-touch": "contact",
  enquiry: "contact",
  enquiries: "contact",
  "talk-to-us": "contact",
  book: "contact",
  quote: "contact",
  // Blog
  blog: "blog-list",
  news: "blog-list",
  articles: "blog-list",
  insights: "blog-list",
  resources: "blog-list",
  // Projects
  projects: "projects",
  portfolio: "projects",
  work: "projects",
  "case-studies": "projects",
  gallery: "projects",
  // Reviews
  reviews: "reviews",
  testimonials: "reviews",
  // Pricing
  pricing: "pricing",
  plans: "pricing",
  packages: "pricing",
  // Locations
  locations: "locations-list",
  areas: "locations-list",
  "areas-we-cover": "locations-list",
  "service-areas": "locations-list",
};
```

5b. Rewrite `classifyPage()` — synonym map first, then existing fallback regexes:

```typescript
function classifyPage(path: string): PageType {
  const lower = path.toLowerCase();
  if (lower === "/" || lower === "") return "home";

  const firstSegment = lower.split("/").filter(Boolean)[0] ?? "";
  const synonymMatch = PAGE_TYPE_SYNONYMS[firstSegment];
  if (synonymMatch) {
    const hasSubPath = lower.split("/").filter(Boolean).length > 1;
    if (hasSubPath) {
      if (synonymMatch === "services-list") return "service-detail";
      if (synonymMatch === "blog-list") return "blog-post";
      if (synonymMatch === "locations-list") return "location-detail";
    }
    return synonymMatch;
  }

  // Fallback regex patterns for paths not covered by synonyms
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

**Verification:** `pnpm type-check` + unit tests in Phase 8.

---

### Phase 6: Fix Props Access Bug (Prompt + Post-Processing + Hard-Fail)

**Files:**

- `tools/lib/theme-component-templates.ts`
- `tools/lib/theme-component-generator.ts`

**Changes:**

6a. **Prompt fix.** In `buildComponentGenerationPrompt()`, replace rule 5 with:

```
5. The component receives "props" as the parameter name.
6. Access props using ONLY dot notation with camelCase names matching the interface:
   CORRECT: props.backgroundImage, props.ctaButtons, props.heading
   WRONG: props['background-image'], props['cta-buttons'], props['heading']
   The interface defines camelCase prop names — use dot notation to access them.
```

Renumber subsequent rules (old 6→7, old 7→8, etc.).

6b. **Post-processing regex.** Add to `theme-component-generator.ts`:

```typescript
function fixBracketNotationProps(content: string): { content: string; fixCount: number } {
  let fixCount = 0;
  const fixed = content.replace(
    /props\[['"]([a-z][a-z0-9]*(?:-[a-z0-9]+)*)['"]\]/g,
    (_match, key: string) => {
      const camelKey = key.replace(/-([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
      fixCount++;
      return `props.${camelKey}`;
    }
  );
  return { content: fixed, fixCount };
}
```

Note: regex matches BOTH single and double quotes (`['"]`). Handles `props['kebab-key']` and `props["kebab-key"]`.

6c. **Hard-fail validation.** After rewrite, check for residual bracket notation:

```typescript
function hasResidualBracketProps(content: string): boolean {
  return /props\[['"][a-z]/.test(content);
}
```

6d. **Wire into `generateSingleComponent()`**, after token class validation:

```typescript
if (usedAI) {
  const { content: propsFixed, fixCount } = fixBracketNotationProps(content);
  if (fixCount > 0) {
    warnings.push(
      `${blueprint.name}: Fixed ${fixCount} bracket-notation prop accesses → dot notation`
    );
    content = propsFixed;
  }
  // Hard-fail if bracket notation still remains after fix
  if (hasResidualBracketProps(content)) {
    warnings.push(
      `${blueprint.name}: Residual bracket-notation props detected after fix — using placeholder`
    );
    content = placeholderComponent(blueprint);
    usedAI = false;
  }
}
```

**Verification:** `pnpm type-check` + unit tests in Phase 8.

---

### Phase 7: Placeholder Images in Example Pages

**Files:**

- `tools/lib/page-template-generator.ts`
- `tools/lib/theme-component-templates.ts`

**Changes:**

7a. **Export `sanitiseSlotName`** from `theme-component-templates.ts` (currently private).

7b. **Add placeholder SVG generator** to `page-template-generator.ts`:

```typescript
function placeholderImageSvg(width: number, height: number, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect fill="#E5E7EB" width="${width}" height="${height}"/><text fill="#9CA3AF" font-family="system-ui,sans-serif" font-size="14" text-anchor="middle" x="${width / 2}" y="${height / 2 + 5}">${label} (${width}x${height})</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
```

7c. **Add image prop detector**:

```typescript
function getImageProps(
  blueprint: SectionBlueprint
): Map<string, { width: number; height: number }> {
  const imageProps = new Map<string, { width: number; height: number }>();
  for (const slot of blueprint.contentSlots) {
    const lower = slot.toLowerCase();
    if (/image|photo|background|logo|avatar|banner|thumbnail/i.test(lower)) {
      const propName = sanitiseSlotName(slot);
      let width = 800,
        height = 400;
      if (/logo|avatar|icon/i.test(lower)) {
        width = 200;
        height = 200;
      } else if (/banner|hero|background/i.test(lower)) {
        width = 1920;
        height = 600;
      } else if (/thumbnail|card/i.test(lower)) {
        width = 400;
        height = 300;
      }
      imageProps.set(propName, { width, height });
    }
  }
  return imageProps;
}
```

7d. **Update `generatePageTsx()`** to pass placeholder props when image slots exist:

```typescript
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

**Verification:** `pnpm type-check`

---

### Phase 8: Review Panel

**Files:**

- `tools/lib/page-template-generator.ts`
- `.claude/commands/pipeline.ingest.md`

**Changes:**

8a. **Generate route manifest JSON** in `generateExamplePages()`, after all pages written:

```typescript
const routeManifest = pages.map((p) => ({
  pageType: p.pageType,
  route: p.outputPath.replace(/^app/, "").replace(/\/page\.tsx$/, "") || "/",
  label: p.pageType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));
const manifestPath = path.join(exampleDir, "route-manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(routeManifest, null, 2), "utf8");
```

8b. **Generate ReviewPanel component** — `"use client"` component with:

- Collapsible state (useState)
- Fixed bottom-right position, z-[9999]
- Dark gray styling (intentionally distinct from theme)
- Route list with active-page highlighting (SSR-safe: guard `window`)
- Written to `example-pages/components/ReviewPanel.tsx`

8c. **Update `pipeline.ingest.md` Step 5e** — bare shell layout includes ReviewPanel:

```typescript
import { ReviewPanel } from './components/ReviewPanel';
// ...
<ThemeProvider theme="<theme-name>" registry={<camelCaseThemeName>Registry}>
  {children}
  <ReviewPanel />
</ThemeProvider>
```

8d. **Update Step 5f** — example page overlay also copies ReviewPanel component:

```bash
cp -r output/ingestion/<theme-name>/example-pages/components/ sites/test-<theme-name>/app/components/
```

**Verification:** Start test site dev server, confirm panel visible bottom-right with clickable links.

---

### Phase 9: Unit Tests

**Files:**

- `tools/__tests__/site-discovery.test.ts` (new)
- `tools/__tests__/theme-component-generator.test.ts` (new or extend)

**Test cases — discovery:**

- `normaliseBaseUrl("https://host.com/themes/bold/")` → `"https://host.com/themes/bold"`
- `normaliseBaseUrl("https://host.com/")` → `"https://host.com"` (domain root unchanged)
- `classifyPage("/our-services")` → `"services-list"`
- `classifyPage("/what-we-do/plumbing")` → `"service-detail"`
- `classifyPage("/get-in-touch")` → `"contact"`
- `classifyPage("/portfolio")` → `"projects"`
- `classifyPage("/testimonials")` → `"reviews"`
- `classifyPage("/news/my-article")` → `"blog-post"`
- `classifyPage("/random-page")` → `"custom"` (no false positive)
- Priority sort: given 15 pages with mixed types, maxPages=10 returns home + services-list + about before blog-posts/custom
- `isUnderBase("https://host.com/themes/bold/about", "https://host.com/themes/bold")` → `true`
- `isUnderBase("https://host.com/other", "https://host.com/themes/bold")` → `false`
- `toCleanPath("https://host.com/themes/bold/about", "https://host.com/themes/bold")` → `"/about"`

**Test cases — props fix:**

- `fixBracketNotationProps("props['event-info-cta']")` → `"props.eventInfoCta"`
- `fixBracketNotationProps('props["cta-button"]')` → `"props.ctaButton"` (double quotes)
- `fixBracketNotationProps("props['items'][0]")` → `"props.items[0]"`
- `fixBracketNotationProps("props.heading")` → `"props.heading"` (unchanged)
- `hasResidualBracketProps("props.heading")` → `false`

**Verification:**

```bash
pnpm type-check && npx vitest run tools/__tests__/site-discovery.test.ts tools/__tests__/theme-component-generator.test.ts
```

---

### Phase 10: Final Verification and Commit

```bash
pnpm type-check
pnpm test  # all existing tests pass
```

**Files to commit:**

- `tools/lib/reference-analysis-types.ts`
- `tools/lib/site-discovery.ts`
- `tools/analyse-site.ts`
- `tools/lib/theme-component-templates.ts`
- `tools/lib/theme-component-generator.ts`
- `tools/lib/page-template-generator.ts`
- `.claude/commands/pipeline.ingest.md`
- `tools/__tests__/site-discovery.test.ts`
- `tools/__tests__/theme-component-generator.test.ts`

---

## Risks and Mitigations

1. **Classification false positives.** `/work` → `projects` could misclassify. Mitigation: only match first path segment (not substring). `/how-we-work` won't match because its first segment is `how-we-work`, not `work`.

2. **Base-URL scoping change.** Preserving the path means sitemap URLs outside the subdirectory are filtered out. Correct for showcase sites, but could surprise users who give a deep link wanting the whole site. Mitigation: `--pages` provides an escape hatch.

3. **Props regex edge cases.** Dynamic expressions like `props[variableName]` won't match (no quotes). Template literals like ``props[`key`]`` won't match. Both are rare in AI output and would trigger the hard-fail residual check, surfacing them for manual investigation.

4. **Placeholder data URIs make long lines.** Generated `.tsx` files will have very long lines from encoded SVGs. Acceptable — files are auto-generated, not human-edited.

5. **Source union ripple.** Adding `"manifest"` to the source union type could break exhaustive switches/ifs downstream. The type-check in Phase 1 will catch these immediately.

## Implementation Sequencing

Phases must run in this order due to dependencies:

1. Type foundation (Phase 1) — unblocks everything
2. `--pages` flag (Phase 2) — uses new source type
3. Base-URL fix (Phase 3) — affects all discovery strategies
4. Priority selection (Phase 4) — uses `classifyPage()` output
5. Synonym expansion (Phase 5) — must come after priority is wired
6. Props bug fix (Phase 6) — independent of discovery, but do before placeholder images
7. Placeholder images (Phase 7) — depends on exported `sanitiseSlotName`
8. Review panel (Phase 8) — depends on example page generation changes
9. Tests (Phase 9) — validates all of the above
10. Final verification (Phase 10)
