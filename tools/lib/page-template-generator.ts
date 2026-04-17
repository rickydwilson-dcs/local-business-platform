/**
 * Page Template Generator
 *
 * Generates example page TSX files from PageBlueprints.
 * Each page composes sections in blueprint order, importing
 * matched core-components or generated theme components.
 */

import * as fs from "fs";
import * as path from "path";
import type {
  PageBlueprint,
  PageSection,
  SectionBlueprint,
  ComponentMatch,
  PageType,
} from "./reference-analysis-types";
import { sanitiseSlotName } from "./theme-component-templates";

// ============================================================================
// Types
// ============================================================================

export interface GeneratedPage {
  pageType: PageType;
  outputPath: string;
  content: string;
}

export interface PageGenerationResult {
  pages: GeneratedPage[];
  readmePath: string;
}

// ============================================================================
// Helpers
// ============================================================================

/** Page types that are NOT generated (handled by [slug] routes). */
const SKIP_PAGE_TYPES: PageType[] = ["service-detail", "blog-post", "location-detail"];

/** Map pageType to output file path under example-pages/. */
function getOutputPath(pageType: PageType, pagePath: string): string | null {
  switch (pageType) {
    case "home":
      return "app/page.tsx";
    case "about":
      return "app/about/page.tsx";
    case "services-list":
      return "app/services/page.tsx";
    case "blog-list":
      return "app/blog/page.tsx";
    case "contact":
      return "app/contact/page.tsx";
    case "reviews":
      return "app/reviews/page.tsx";
    case "projects":
      return "app/projects/page.tsx";
    case "pricing":
      return "app/pricing/page.tsx";
    case "locations-list":
      return "app/locations/page.tsx";
    case "custom": {
      const cleanPath = pagePath.replace(/^\//, "").replace(/\/$/, "") || "custom";
      return `app/${cleanPath}/page.tsx`;
    }
    default:
      return null;
  }
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join("");
}

// ============================================================================
// Placeholder Image Helpers
// ============================================================================

function placeholderImageSvg(width: number, height: number, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect fill="#E5E7EB" width="${width}" height="${height}"/><text fill="#9CA3AF" font-family="system-ui,sans-serif" font-size="14" text-anchor="middle" x="${width / 2}" y="${height / 2 + 5}">${label} (${width}x${height})</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

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

// ============================================================================
// Import Resolution
// ============================================================================

interface ResolvedImport {
  componentName: string;
  importPath: string;
  isCore: boolean;
}

function resolveImport(
  section: PageSection,
  blueprintMap: Map<string, SectionBlueprint>,
  matchMap: Map<string, ComponentMatch | null>,
  themeName: string
): ResolvedImport | null {
  const match = matchMap.get(section.blueprintId);
  if (match && (match.matchConfidence === "exact" || match.matchConfidence === "close")) {
    return {
      componentName: match.componentName,
      importPath: match.importPath,
      isCore: true,
    };
  }

  const blueprint = blueprintMap.get(section.blueprintId);
  if (blueprint) {
    return {
      componentName: blueprint.componentExportName,
      importPath: `@platform/themes/${themeName}/components`,
      isCore: false,
    };
  }

  return null;
}

// ============================================================================
// TSX Generation
// ============================================================================

function generatePageTsx(
  blueprint: PageBlueprint,
  blueprintMap: Map<string, SectionBlueprint>,
  matchMap: Map<string, ComponentMatch | null>,
  themeName: string
): string {
  const imports: Map<string, Set<string>> = new Map();
  const sectionLines: string[] = [];

  for (const section of blueprint.sections) {
    const resolved = resolveImport(section, blueprintMap, matchMap, themeName);
    if (!resolved) continue;

    // Collect imports by path
    if (!imports.has(resolved.importPath)) {
      imports.set(resolved.importPath, new Set());
    }
    imports.get(resolved.importPath)!.add(resolved.componentName);

    // Build section JSX
    const bp = blueprintMap.get(section.blueprintId);
    const purpose = bp?.purpose ?? section.blueprintId;
    sectionLines.push(`      {/* Section: ${purpose} — from ${section.blueprintId} */}`);
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
    sectionLines.push("");
  }

  // Build import statements
  const importLines: string[] = [];
  for (const [importPath, names] of imports) {
    const sorted = [...names].sort();
    importLines.push(`import { ${sorted.join(", ")} } from "${importPath}";`);
  }

  // Pages are Server Components by default — no blanket "use client"
  const lines: string[] = [];

  lines.push(`/**`);
  lines.push(` * ${toPascalCase(blueprint.pageType)} Page`);
  lines.push(` *`);
  lines.push(` * Generated from site analysis blueprint.`);
  lines.push(` * Path: ${blueprint.path}`);
  lines.push(` */`);
  lines.push("");

  if (importLines.length > 0) {
    lines.push(...importLines);
    lines.push("");
  }

  lines.push(`export default function Page() {`);
  lines.push(`  return (`);
  lines.push(`    <div className="min-h-screen">`);

  if (sectionLines.length > 0) {
    lines.push(...sectionLines);
  } else {
    lines.push(`      {/* No sections defined in blueprint */}`);
  }

  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// Review Panel Generation
// ============================================================================

interface RouteManifestEntry {
  pageType: string;
  route: string;
  label: string;
}

function generateReviewPanel(routes: RouteManifestEntry[]): string {
  const routeArray = JSON.stringify(routes, null, 2)
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");

  return `"use client";

/**
 * ReviewPanel
 *
 * Collapsible navigation panel for test sites.
 * Shows all generated routes with active-page highlighting.
 * Intentionally uses hardcoded colors (not theme tokens) to be
 * visually distinct from the theme under review.
 */

import { useState } from "react";

const ROUTES = ${routeArray.trim()};

export function ReviewPanel() {
  const [open, setOpen] = useState(false);
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9999,
        fontFamily: "system-ui, sans-serif",
        fontSize: "13px",
      }}
    >
      {open ? (
        <div
          style={{
            background: "#1F2937",
            color: "#F9FAFB",
            borderRadius: "8px",
            padding: "12px",
            minWidth: "200px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: 600, color: "#9CA3AF", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Review Panel
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: "0 2px", fontSize: "16px", lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          <nav>
            {ROUTES.map((r) => (
              <a
                key={r.route}
                href={r.route}
                style={{
                  display: "block",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  color: currentPath === r.route ? "#FFFFFF" : "#D1D5DB",
                  background: currentPath === r.route ? "#374151" : "transparent",
                  textDecoration: "none",
                  marginBottom: "2px",
                }}
              >
                {r.label}
              </a>
            ))}
          </nav>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "#1F2937",
            color: "#F9FAFB",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            fontFamily: "system-ui, sans-serif",
            fontSize: "13px",
          }}
        >
          Pages ▲
        </button>
      )}
    </div>
  );
}
`;
}

// ============================================================================
// README Generation
// ============================================================================

function generateReadme(themeName: string, pages: GeneratedPage[]): string {
  const lines: string[] = [];

  lines.push(`# Example Pages — ${toPascalCase(themeName)} Theme`);
  lines.push("");
  lines.push("These example pages were auto-generated from the site analysis blueprints.");
  lines.push("They demonstrate how to compose theme components into full pages.");
  lines.push("");
  lines.push("## How to Use");
  lines.push("");
  lines.push("1. Copy the desired page files into your site's `app/` directory");
  lines.push("2. Adjust imports to match your project structure");
  lines.push("3. Replace placeholder content with real data");
  lines.push("4. Add metadata exports (`export const metadata: Metadata = { ... }`)");
  lines.push("");
  lines.push("## Generated Pages");
  lines.push("");
  lines.push("| Page Type | File Path |");
  lines.push("|-----------|-----------|");

  for (const page of pages) {
    lines.push(`| ${page.pageType} | \`${page.outputPath}\` |`);
  }

  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- All components use theme token classes only (no hardcoded hex colors)");
  lines.push("- Pages use Server Component pattern unless stateful interaction is needed");
  lines.push("- Placeholder content is marked with comments");
  lines.push("- `service-detail`, `blog-post`, and `location-detail` pages are NOT generated");
  lines.push("  — they use dynamic `[slug]/page.tsx` routes from the base template");
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Generate example page TSX files from PageBlueprints.
 *
 * @param blueprints - Page blueprints from the analysis
 * @param sectionBlueprints - All section blueprints (for resolving imports)
 * @param componentMatches - Map of blueprint ID to ComponentMatch
 * @param themeName - Theme slug for import paths
 * @param outputDir - Base output directory (example-pages/ will be created here)
 * @returns Generated page files and README
 */
export function generateExamplePages(
  blueprints: PageBlueprint[],
  sectionBlueprints: SectionBlueprint[],
  componentMatches: Map<string, ComponentMatch | null>,
  themeName: string,
  outputDir: string
): PageGenerationResult {
  const exampleDir = path.join(outputDir, "example-pages");
  fs.mkdirSync(exampleDir, { recursive: true });

  // Build lookup maps
  const blueprintMap = new Map<string, SectionBlueprint>();
  for (const bp of sectionBlueprints) {
    blueprintMap.set(bp.id, bp);
  }

  const pages: GeneratedPage[] = [];

  for (const blueprint of blueprints) {
    // Skip page types handled by [slug] routes
    if (SKIP_PAGE_TYPES.includes(blueprint.pageType)) continue;

    const relativePath = getOutputPath(blueprint.pageType, blueprint.path);
    if (!relativePath) continue;

    const content = generatePageTsx(blueprint, blueprintMap, componentMatches, themeName);

    const fullPath = path.join(exampleDir, relativePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");

    pages.push({
      pageType: blueprint.pageType,
      outputPath: relativePath,
      content,
    });

    console.log(`  ✓ ${relativePath}`);
  }

  // Generate route manifest JSON
  const routeManifest = pages.map((p) => ({
    pageType: p.pageType,
    route: p.outputPath.replace(/^app/, "").replace(/\/page\.tsx$/, "") || "/",
    label: p.pageType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
  const manifestPath = path.join(exampleDir, "route-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(routeManifest, null, 2), "utf8");
  console.log(`  ✓ route-manifest.json`);

  // Generate ReviewPanel component
  const reviewPanelContent = generateReviewPanel(routeManifest);
  const reviewPanelDir = path.join(exampleDir, "components");
  fs.mkdirSync(reviewPanelDir, { recursive: true });
  const reviewPanelPath = path.join(reviewPanelDir, "ReviewPanel.tsx");
  fs.writeFileSync(reviewPanelPath, reviewPanelContent, "utf8");
  console.log(`  ✓ components/ReviewPanel.tsx`);

  // Generate README
  const readmeContent = generateReadme(themeName, pages);
  const readmePath = path.join(exampleDir, "README.md");
  fs.writeFileSync(readmePath, readmeContent, "utf8");
  console.log(`  ✓ README.md`);

  return { pages, readmePath };
}
