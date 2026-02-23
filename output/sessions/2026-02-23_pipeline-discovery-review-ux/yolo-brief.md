# YOLO Implementation Brief: Pipeline Discovery + Test Site Review UX

**Branch:** feature/pipeline-discovery-review-ux (created from develop)
**Session spec:** output/sessions/2026-02-23_pipeline-discovery-review-ux/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The ingestion pipeline's site discovery has several gaps: it doesn't handle subdirectory-hosted sites correctly, page-type classification misses common synonyms, there's no way to manually specify pages, AI-generated components sometimes use bracket-notation prop access, and test sites lack a review panel for navigating generated pages.

A dual-model peer review (Claude + Codex) produced a synthesised 10-phase plan covering type foundation, CLI flags, base-URL scoping, priority selection, synonym expansion, props bug fixes, placeholder images, a review panel component, and unit tests.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier | Alias | Cost (in/out per MTok) | Use for |
|------|-------|----------------------|---------|
| Opus | `opus` | $15 / $75 | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15 | Standard implementation — file edits, feature wiring, most phases |
| Haiku | `haiku` | $0.80 / $4 | Mechanical tasks: find-replace, import additions, grep checks, content validation |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/pipeline-discovery-review-ux   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Type Foundation — `"manifest"` Source

**Goal:** Add `"manifest"` to the `DiscoveredPage.source` union type so downstream phases can use it.
**Model:** haiku — single-line type union edit + grep audit

**Files:**
- `tools/lib/reference-analysis-types.ts`

**Steps:**
1. Read `tools/lib/reference-analysis-types.ts`
2. Find the `source` field in the `DiscoveredPage` type and add `"manifest"` to the union:
   ```typescript
   source: "sitemap" | "nav" | "probe" | "manifest";
   ```
3. Audit all downstream consumers of the `source` field for switch/if exhaustiveness:
   ```bash
   # Search for switch or if statements on .source
   grep -rn 'source' tools/lib/ tools/analyse-site.ts --include='*.ts' | grep -v node_modules | grep -v '.test.'
   ```
   If any exhaustive checks exist, update them to handle `"manifest"`.

**Verification gate — STOP if this fails:**
```bash
pnpm type-check
```

**Commit:**
```bash
git add tools/lib/reference-analysis-types.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): add 'manifest' to DiscoveredPage source union

Supports the upcoming --pages CLI flag which bypasses discovery and
uses operator-provided URLs directly.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: `--pages` CLI Flag

**Goal:** Add `--pages` flag to the CLI and wire it into `discoverPages()` to bypass discovery.
**Model:** sonnet — two-file edit with logic changes

**Files:**
- `tools/analyse-site.ts`
- `tools/lib/site-discovery.ts`

**Steps:**

1. Read both files in parallel.

2. In `tools/analyse-site.ts`:
   - Extend `CliArgs` interface with `pages?: string[]`
   - Add `--pages` case to the switch block in `parseArgs()`. Parse as comma-separated, trim, filter empties.
   - Wire `pages` into the `discoverPages()` call:
     ```typescript
     const discoveredPages = await discoverPages(args.url, {
       maxPages: args.maxPages,
       pages: args.pages,
     });
     ```

3. In `tools/lib/site-discovery.ts`:
   - Extend `discoverPages()` options parameter:
     ```typescript
     export async function discoverPages(
       url: string,
       options?: { maxPages?: number; pages?: string[] },
     ): Promise<DiscoveredPage[]>
     ```
   - When `options.pages` is provided and non-empty:
     - Skip all three discovery strategies (sitemap, nav, probe)
     - Parse each URL into a `DiscoveredPage` with `source: "manifest"`
     - Use the reference URL as the base for `toCleanPath()` (to get relative paths for classification)
     - Classify each with `classifyPage()`
     - Apply priority sorting (will be added in Phase 4, but wire the call site now)
     - Slice to `maxPages`

**Verification gate — STOP if this fails:**
```bash
pnpm type-check
```

**Commit:**
```bash
git add tools/analyse-site.ts tools/lib/site-discovery.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): add --pages CLI flag to bypass discovery

When --pages is provided with comma-separated URLs, discovery strategies
(sitemap, nav, probe) are skipped entirely. Pages are classified and
priority-sorted like discovered pages.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Fix Base-URL Scoping

**Goal:** Make discovery work correctly for subdirectory-hosted sites (e.g. `host.com/themes/bold/`).
**Model:** sonnet — logic-heavy changes to URL handling functions

**Files:**
- `tools/lib/site-discovery.ts`

**Steps:**

1. Read `tools/lib/site-discovery.ts` (if not already in context from Phase 2).

2. Replace `normaliseBaseUrl()` to preserve path prefix:
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

3. Rename `isSameDomain()` → `isUnderBase()` to check both host and path prefix:
   ```typescript
   function isUnderBase(href: string, baseUrl: string): boolean {
     try {
       const target = new URL(href, baseUrl);
       const base = new URL(baseUrl);
       if (target.hostname !== base.hostname) return false;
       return target.pathname === base.pathname ||
         target.pathname.startsWith(base.pathname + "/");
     } catch {
       return false;
     }
   }
   ```

4. Update `toCleanPath()` to strip base path prefix, returning relative paths:
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

5. Replace ALL `isSameDomain()` calls with `isUnderBase()` throughout the file.

6. Verify `addPage()` URL construction still works — `${baseUrl}${normPath}` with path-preserving base produces the right full URL.

**Verification gate — STOP if this fails:**
```bash
pnpm type-check
```

**Commit:**
```bash
git add tools/lib/site-discovery.ts
git commit -m "$(cat <<'EOF'
fix(pipeline): preserve base path in URL scoping for subdirectory sites

normaliseBaseUrl() now keeps the path prefix (e.g. /themes/bold).
isSameDomain() renamed to isUnderBase() — checks host AND path prefix.
toCleanPath() strips the base prefix to return relative paths for
correct page classification.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Page-Type Priority Selection

**Goal:** Sort discovered pages by page-type priority so the most useful pages for theme assessment are selected first.
**Model:** sonnet — sorting logic + constant definition

**Files:**
- `tools/lib/site-discovery.ts`

**Steps:**

1. Add priority constant (after `COMMON_PATHS`):
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

2. Replace the sort + slice at end of `discoverPages()`:
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

3. Add low page count warning (before return, when not using manifest):
   ```typescript
   if (pages.size <= 2 && !options?.pages) {
     console.warn(`  [Warning] Only ${pages.size} page(s) discovered. Consider using --pages to provide specific URLs.`);
   }
   ```

**Verification gate — STOP if this fails:**
```bash
pnpm type-check
```

**Commit:**
```bash
git add tools/lib/site-discovery.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): priority-based page selection for discovery

Pages are now sorted by type priority (home > services > about > blog >
contact > ...) before slicing to maxPages. Ensures the most useful pages
for theme assessment are always included. Warns when <3 pages found.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Expand `classifyPage()` with Synonyms

**Goal:** Improve page classification accuracy with a comprehensive synonym map.
**Model:** sonnet — rewrite of classifyPage() with new synonym constant

**Files:**
- `tools/lib/site-discovery.ts`

**Steps:**

1. Add merged synonym map (union of both Claude and Codex plans):
   ```typescript
   const PAGE_TYPE_SYNONYMS: Record<string, PageType> = {
     // About
     "about-us": "about", "our-story": "about", "who-we-are": "about",
     "team": "about", "our-team": "about",
     // Services
     "services": "services-list", "our-services": "services-list",
     "what-we-do": "services-list", "solutions": "services-list",
     "capabilities": "services-list", "expertise": "services-list",
     "offerings": "services-list",
     // Contact
     "contact": "contact", "contact-us": "contact",
     "get-in-touch": "contact", "enquiry": "contact",
     "enquiries": "contact", "talk-to-us": "contact",
     "book": "contact", "quote": "contact",
     // Blog
     "blog": "blog-list", "news": "blog-list", "articles": "blog-list",
     "insights": "blog-list", "resources": "blog-list",
     // Projects
     "projects": "projects", "portfolio": "projects", "work": "projects",
     "case-studies": "projects", "gallery": "projects",
     // Reviews
     "reviews": "reviews", "testimonials": "reviews",
     // Pricing
     "pricing": "pricing", "plans": "pricing", "packages": "pricing",
     // Locations
     "locations": "locations-list", "areas": "locations-list",
     "areas-we-cover": "locations-list", "service-areas": "locations-list",
   };
   ```

2. Rewrite `classifyPage()` — synonym map first, then existing fallback regexes:
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

**Verification gate — STOP if this fails:**
```bash
pnpm type-check
```

**Commit:**
```bash
git add tools/lib/site-discovery.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): synonym-based page classification

classifyPage() now checks a comprehensive synonym map before falling
back to regex patterns. Handles common alternatives like our-services,
what-we-do, testimonials, portfolio, get-in-touch, etc. Sub-paths
under list pages are correctly classified as detail pages.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Fix Props Access Bug (Prompt + Post-Processing + Hard-Fail)

**Goal:** Prevent AI-generated components from using bracket-notation prop access that breaks at runtime.
**Model:** sonnet — two-file edit with regex logic

**Files:**
- `tools/lib/theme-component-templates.ts`
- `tools/lib/theme-component-generator.ts`

**Steps:**

Read both files in parallel.

1. In `tools/lib/theme-component-templates.ts` — find `buildComponentGenerationPrompt()`, replace rule 5 with:
   ```
   5. The component receives "props" as the parameter name.
   6. Access props using ONLY dot notation with camelCase names matching the interface:
      CORRECT: props.backgroundImage, props.ctaButtons, props.heading
      WRONG: props['background-image'], props['cta-buttons'], props['heading']
      The interface defines camelCase prop names — use dot notation to access them.
   ```
   Renumber subsequent rules (old 6→7, old 7→8, etc.).

2. In `tools/lib/theme-component-generator.ts`:

   2a. Add `fixBracketNotationProps()` function:
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

   2b. Add `hasResidualBracketProps()` function:
   ```typescript
   function hasResidualBracketProps(content: string): boolean {
     return /props\[['"][a-z]/.test(content);
   }
   ```

   2c. Wire into `generateSingleComponent()`, after token class validation (after the `usedAI` block):
   ```typescript
   if (usedAI) {
     const { content: propsFixed, fixCount } = fixBracketNotationProps(content);
     if (fixCount > 0) {
       warnings.push(`${blueprint.name}: Fixed ${fixCount} bracket-notation prop accesses → dot notation`);
       content = propsFixed;
     }
     // Hard-fail if bracket notation still remains after fix
     if (hasResidualBracketProps(content)) {
       warnings.push(`${blueprint.name}: Residual bracket-notation props detected after fix — using placeholder`);
       content = placeholderComponent(blueprint);
       usedAI = false;
     }
   }
   ```

**Verification gate — STOP if this fails:**
```bash
pnpm type-check
```

**Commit:**
```bash
git add tools/lib/theme-component-templates.ts tools/lib/theme-component-generator.ts
git commit -m "$(cat <<'EOF'
fix(pipeline): prevent bracket-notation prop access in generated components

Adds explicit dot-notation instruction to the AI prompt. Post-processes
generated code to rewrite props['kebab-key'] → props.camelKey (handles
both single and double quotes). Hard-fails to placeholder if residual
bracket notation remains after fix.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Placeholder Images in Example Pages

**Goal:** Generate inline SVG placeholders for image props so example pages render without broken images.
**Model:** sonnet — new helper functions + wiring in page generator

**Files:**
- `tools/lib/page-template-generator.ts`
- `tools/lib/theme-component-templates.ts`

**Steps:**

Read both files in parallel.

1. In `tools/lib/theme-component-templates.ts`:
   - Export `sanitiseSlotName` (currently private — add `export` keyword).

2. In `tools/lib/page-template-generator.ts`:

   2a. Import `sanitiseSlotName` from `theme-component-templates.ts`.

   2b. Add placeholder SVG generator:
   ```typescript
   function placeholderImageSvg(width: number, height: number, label: string): string {
     const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect fill="#E5E7EB" width="${width}" height="${height}"/><text fill="#9CA3AF" font-family="system-ui,sans-serif" font-size="14" text-anchor="middle" x="${width / 2}" y="${height / 2 + 5}">${label} (${width}x${height})</text></svg>`;
     return `data:image/svg+xml,${encodeURIComponent(svg)}`;
   }
   ```

   2c. Add image prop detector:
   ```typescript
   function getImageProps(blueprint: SectionBlueprint): Map<string, { width: number; height: number }> {
     const imageProps = new Map<string, { width: number; height: number }>();
     for (const slot of blueprint.contentSlots) {
       const lower = slot.toLowerCase();
       if (/image|photo|background|logo|avatar|banner|thumbnail/i.test(lower)) {
         const propName = sanitiseSlotName(slot);
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

   2d. Update `generatePageTsx()` to pass placeholder props when image slots exist:
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

**Verification gate — STOP if this fails:**
```bash
pnpm type-check
```

**Commit:**
```bash
git add tools/lib/page-template-generator.ts tools/lib/theme-component-templates.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): placeholder SVG images for example page image props

Detects image-related content slots and generates inline SVG data URIs
as placeholder values. Prevents broken image rendering on test sites.
Exports sanitiseSlotName for reuse.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8: Review Panel

**Goal:** Generate a collapsible navigation panel for test sites that shows all routes with active-page highlighting.
**Model:** sonnet — new component generation + pipeline.ingest.md updates

**Files:**
- `tools/lib/page-template-generator.ts`
- `.claude/commands/pipeline.ingest.md`

**Steps:**

Read both files in parallel.

1. In `tools/lib/page-template-generator.ts`:

   1a. In `generateExamplePages()`, after all pages are written, generate a route manifest JSON:
   ```typescript
   const routeManifest = pages.map(p => ({
     pageType: p.pageType,
     route: p.outputPath.replace(/^app/, "").replace(/\/page\.tsx$/, "") || "/",
     label: p.pageType.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
   }));
   const manifestPath = path.join(exampleDir, "route-manifest.json");
   fs.writeFileSync(manifestPath, JSON.stringify(routeManifest, null, 2), "utf8");
   ```

   1b. Generate a `ReviewPanel.tsx` component — a `"use client"` component with:
   - Collapsible state (useState)
   - Fixed bottom-right position, z-[9999]
   - Dark gray styling (intentionally distinct from theme — use hardcoded colors, not theme tokens)
   - Route list read from an inline array (generated from the manifest data)
   - Active-page highlighting using `window.location.pathname` (SSR-safe: guard with `typeof window !== "undefined"`)
   - Written to `example-pages/components/ReviewPanel.tsx`

2. In `.claude/commands/pipeline.ingest.md`:

   2a. Update Step 5e — bare shell layout includes ReviewPanel:
   ```typescript
   import { ReviewPanel } from './components/ReviewPanel';
   // ...
   <ThemeProvider theme="<theme-name>" registry={<camelCaseThemeName>Registry}>
     {children}
     <ReviewPanel />
   </ThemeProvider>
   ```

   2b. Update Step 5f — example page overlay also copies ReviewPanel component:
   ```bash
   cp -r output/ingestion/<theme-name>/example-pages/components/ sites/test-<theme-name>/app/components/
   ```

**Verification gate — STOP if this fails:**
```bash
pnpm type-check
```

**Commit:**
```bash
git add tools/lib/page-template-generator.ts .claude/commands/pipeline.ingest.md
git commit -m "$(cat <<'EOF'
feat(pipeline): ReviewPanel component for test site navigation

Generates a collapsible bottom-right panel showing all discovered routes
with active-page highlighting. Route manifest JSON also written for
external tooling. Updates pipeline.ingest.md to wire ReviewPanel into
test site layout.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 9: Unit Tests

**Goal:** Add comprehensive unit tests for the new discovery and props-fix functionality.
**Model:** sonnet — test authoring with understanding of the implementation

**Files:**
- `tools/__tests__/site-discovery.test.ts` (extend existing)
- `tools/__tests__/theme-component-generator.test.ts` (extend existing)

**Steps:**

Read both existing test files in parallel.

1. In `tools/__tests__/site-discovery.test.ts`, ADD new test cases (do not remove existing tests):

   **Discovery tests:**
   - `normaliseBaseUrl("https://host.com/themes/bold/")` → `"https://host.com/themes/bold"`
   - `normaliseBaseUrl("https://host.com/")` → `"https://host.com"` (domain root unchanged)
   - `classifyPage("/our-services")` → `"services-list"`
   - `classifyPage("/what-we-do/plumbing")` → `"service-detail"`
   - `classifyPage("/get-in-touch")` → `"contact"`
   - `classifyPage("/portfolio")` → `"projects"`
   - `classifyPage("/testimonials")` → `"reviews"`
   - `classifyPage("/news/my-article")` → `"blog-post"`
   - `classifyPage("/random-page")` → `"custom"` (no false positive)
   - Priority sort: given pages with mixed types, verify home + services-list + about come before blog-posts/custom
   - `isUnderBase("https://host.com/themes/bold/about", "https://host.com/themes/bold")` → `true`
   - `isUnderBase("https://host.com/other", "https://host.com/themes/bold")` → `false`
   - `toCleanPath("https://host.com/themes/bold/about", "https://host.com/themes/bold")` → `"/about"`

   Note: Some of these functions may not be exported. If they are not exported, either:
   - Export them (preferred — add `export` keyword to the functions needed for testing)
   - Or test them indirectly through `discoverPages()`

2. In `tools/__tests__/theme-component-generator.test.ts`, ADD new test cases:

   **Props fix tests:**
   - `fixBracketNotationProps("props['event-info-cta']")` → content: `"props.eventInfoCta"`, fixCount: 1
   - `fixBracketNotationProps('props["cta-button"]')` → content: `"props.ctaButton"`, fixCount: 1
   - `fixBracketNotationProps("props['items'][0]")` → content: `"props.items[0]"`, fixCount: 1
   - `fixBracketNotationProps("props.heading")` → content: `"props.heading"`, fixCount: 0 (unchanged)
   - `hasResidualBracketProps("props.heading")` → `false`

   Note: `fixBracketNotationProps` and `hasResidualBracketProps` must be exported from `theme-component-generator.ts` for testing. Add `export` keyword if not already exported.

**Verification gate — STOP if this fails:**
```bash
pnpm type-check && npx vitest run tools/__tests__/site-discovery.test.ts tools/__tests__/theme-component-generator.test.ts
```

**Commit:**
```bash
git add tools/__tests__/site-discovery.test.ts tools/__tests__/theme-component-generator.test.ts tools/lib/site-discovery.ts tools/lib/theme-component-generator.ts
git commit -m "$(cat <<'EOF'
test(pipeline): add discovery synonym, priority, and props-fix tests

Covers classifyPage() synonyms, isUnderBase() scoping, toCleanPath()
relative paths, priority sorting, fixBracketNotationProps() rewriting,
and hasResidualBracketProps() detection.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 10: Final Verification and Commit

**Goal:** Verify everything passes together.
**Model:** haiku — mechanical checks only

**Steps:**
```bash
# Verification gate — STOP if any of these fail
pnpm type-check
pnpm lint
npx vitest run tools/__tests__/
```

If any test was broken by earlier phases (pre-existing tests), fix them now and amend the relevant commit.

No additional commit needed if everything passes.

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 1: Type foundation | haiku | ~8k | ~500 | $0.01 |
| Phase 2: --pages flag | sonnet | ~14k | ~3k | $0.09 |
| Phase 3: Base-URL scoping | sonnet | ~12k | ~2k | $0.07 |
| Phase 4: Priority selection | sonnet | ~12k | ~1.5k | $0.06 |
| Phase 5: Synonym expansion | sonnet | ~12k | ~2k | $0.07 |
| Phase 6: Props bug fix | sonnet | ~13k | ~2.5k | $0.08 |
| Phase 7: Placeholder images | sonnet | ~13k | ~2k | $0.07 |
| Phase 8: Review panel | sonnet | ~13k | ~3k | $0.09 |
| Phase 9: Unit tests | sonnet | ~15k | ~4k | $0.11 |
| Phase 10: Final verification | haiku | ~8k | ~500 | $0.01 |
| Orchestration overhead | sonnet | ~30k | ~5k | $0.17 |
| **Total** | | **~150k** | **~26k** | **~$0.83** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model | Est. input tokens | Est. output tokens | Est. cost |
   |-------|------------------|--------------------|-----------|
   | sonnet | [total across phases] | | $X.XX |
   | haiku | [if used] | | $X.XX |
   | opus | [if used] | | $X.XX |
   | **Total** | | | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-02-23_pipeline-discovery-review-ux/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-02-23
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits
[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)

## Completed

**Date:** 2026-02-23
**Status:** All phases executed successfully

All 10 phases were implemented on branch `feature/pipeline-discovery-review-ux`. Phase 1 added `"manifest"` to the `DiscoveredPage.source` union. Phase 2 added `--pages` CLI flag with manifest-mode bypass and wired the `PAGE_TYPE_PRIORITY` constant (needed for compilation, formally part of Phase 4). Phase 3 fixed base-URL scoping for subdirectory-hosted sites, renaming `isSameDomain` → `isUnderBase` and updating `normaliseBaseUrl` and `toCleanPath` to preserve path prefixes. Phase 4 was substantively complete as part of Phase 2. Phase 5 added a comprehensive synonym map to `classifyPage()`. Phase 6 added bracket-notation prop auto-fix with hard-fail fallback to placeholder. Phase 7 added inline SVG placeholder image generation for image content slots. Phase 8 generated a `ReviewPanel.tsx` client component and route manifest JSON, and updated `pipeline.ingest.md`. Phase 9 added 26 new test cases (36 total in site-discovery, 10 in component-generator) — one `isUnderBase` domain-root edge case was caught by the tests and fixed. All 146 tools tests pass.

### Commits
- `4efd6ce` feat(pipeline): add 'manifest' to DiscoveredPage source union
- `31363e2` feat(pipeline): add --pages CLI flag to bypass discovery
- `2b1885b` fix(pipeline): preserve base path in URL scoping for subdirectory sites
- `8b8cbae` feat(pipeline): synonym-based page classification
- `1070a8f` fix(pipeline): prevent bracket-notation prop access in generated components
- `53552b7` feat(pipeline): placeholder SVG images for example page image props
- `ffadec7` feat(pipeline): ReviewPanel component for test site navigation
- `daf4d32` test(pipeline): add discovery synonym, priority, and props-fix tests

### Token usage and cost estimate

| Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|------------------|--------------------|-----------|
| sonnet | ~145k | ~27k | ~$0.84 |
| haiku | 0 | 0 | $0.00 |
| opus | 0 | 0 | $0.00 |
| **Total** | **~145k** | **~27k** | **~$0.84** |

Estimation basis: files read (~5 tokens/line × ~1,800 lines across all reads) + brief (~3k) + system prompt (~3k) per phase; output ~5 tokens/line × ~500 lines written per phase across 8 phases. Actual figures: check console.anthropic.com. Pre-flight estimate was $0.83.
