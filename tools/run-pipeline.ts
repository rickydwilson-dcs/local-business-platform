/**
 * run-pipeline.ts
 *
 * Runs the full composition pipeline for a given brief:
 *   1. Structural pass → composition.json
 *   2. Visual pass     → visual-output.json + globals.css
 *
 * Usage:
 *   npx tsx tools/run-pipeline.ts --brief navagarden
 *   npx tsx tools/run-pipeline.ts --brief designlab
 *   npx tsx tools/run-pipeline.ts --brief output/briefs/custom/design-brief.json
 */

import { generateStructuralComposition } from "./lib/composition-structural-pass.ts";
import { generateVisualConfig } from "./lib/composition-visual-pass.ts";
import { DesignBriefSchema } from "./lib/design-brief-types.ts";
import * as fs from "fs";
import * as path from "path";

function parseBriefPath(arg: string): string {
  // Accept shorthand names or full paths
  if (arg.endsWith(".json")) return arg;
  return `output/briefs/${arg}/design-brief.json`;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const briefIdx = args.indexOf("--brief");
  const briefArg = briefIdx !== -1 ? args[briefIdx + 1] : "navagarden";
  const siteIdx = args.indexOf("--site");
  const siteArg = siteIdx !== -1 ? args[siteIdx + 1] : "poc-composition-test";
  return { briefPath: parseBriefPath(briefArg), site: siteArg };
}

function buildRootBlock(
  colors: Record<string, Record<string, string>>,
  typography: Record<string, unknown>
): string {
  const brand = colors.brand ?? {};
  const surface = colors.surface ?? {};
  const semantic = colors.semantic ?? {};
  const fonts = (typography?.fontFamily as Record<string, string[]>) ?? {};
  const fontSans = fonts.sans?.[0] ?? "system-ui";
  const fontHeading = fonts.heading?.[0] ?? "system-ui";

  return `:root {
  --color-brand-primary: ${brand.primary ?? "#000"};
  --color-brand-primary-hover: ${brand.primaryHover ?? brand.primary ?? "#000"};
  --color-brand-secondary: ${brand.secondary ?? "#000"};
  --color-brand-accent: ${brand.accent ?? brand.primary ?? "#000"};
  --color-brand-on-primary: ${brand.onPrimary ?? "#fff"};

  --color-surface-background: ${surface.background ?? "#fff"};
  --color-surface-foreground: ${surface.foreground ?? "#000"};
  --color-surface-muted: ${surface.muted ?? "#f5f5f5"};
  --color-surface-muted-foreground: ${surface.mutedForeground ?? surface.foreground ?? "#666"};
  --color-surface-card: ${surface.card ?? "#fff"};
  --color-surface-card-border: ${surface.cardBorder ?? "#e5e7eb"};
  --color-surface-inverse: ${surface.inverse ?? brand.secondary ?? "#000"};
  --color-surface-inverse-foreground: ${surface.background ?? "#fff"};

  --color-semantic-success: ${semantic.success ?? "#10b981"};
  --color-semantic-warning: ${semantic.warning ?? "#f59e0b"};
  --color-semantic-error: ${semantic.error ?? "#ef4444"};
  --color-semantic-info: ${semantic.info ?? "#3b82f6"};

  --font-sans: '${fontSans}', system-ui, sans-serif;
  --font-heading: '${fontHeading}', system-ui, sans-serif;
}`;
}

async function main() {
  const { briefPath, site } = parseArgs();

  if (!fs.existsSync(briefPath)) {
    console.error(`FAIL: brief not found at ${briefPath}`);
    process.exit(1);
  }

  const brief = DesignBriefSchema.parse(JSON.parse(fs.readFileSync(briefPath, "utf-8")));
  const briefDir = path.dirname(briefPath);
  const siteDir = `sites/${site}`;

  console.log(`\nBrief:  ${briefPath}`);
  console.log(`Site:   ${siteDir}`);
  console.log(`\n── Structural pass ──────────────────────`);

  const composition = await generateStructuralComposition(brief);
  const compositionPath = path.join(siteDir, "composition.json");
  fs.mkdirSync(siteDir, { recursive: true });
  fs.writeFileSync(compositionPath, JSON.stringify(composition, null, 2));
  const homeSections = composition.pages.find((p) => p.pageType === "home")?.sections.length ?? 0;
  console.log(`  siteId: ${composition.siteId}`);
  console.log(`  pages: ${composition.pages.length}  |  home sections: ${homeSections}`);
  console.log(`  → ${compositionPath}`);

  console.log(`\n── Visual pass ──────────────────────────`);

  const visual = await generateVisualConfig(brief);
  const visualPath = path.join(briefDir, "visual-output.json");
  fs.writeFileSync(visualPath, JSON.stringify(visual, null, 2));
  console.log(`  fontLinks: ${visual.fontLinks.length}`);
  console.log(`  provenance entries: ${Object.keys(visual.provenance).length}`);

  const hexCheck = visual.cssOverrides.match(/#[0-9a-fA-F]{6}/g);
  if (hexCheck) {
    console.error(
      `  WARN: AI wrote hardcoded hex in cssOverrides (ignored — using themeConfig): ${hexCheck}`
    );
  }

  console.log(`  → ${visualPath}`);

  console.log(`\n── Apply visual → globals.css ───────────`);

  const { themeConfig } = visual;
  const rootBlock = buildRootBlock(
    themeConfig.colors as Record<string, Record<string, string>>,
    themeConfig.typography as Record<string, unknown>
  );

  const globalsPath = path.join(siteDir, "app/globals.css");
  const globalsContent = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${rootBlock}\n\nbody {\n  background-color: var(--color-surface-background);\n  color: var(--color-surface-foreground);\n  font-family: var(--font-sans);\n}\n`;
  fs.writeFileSync(globalsPath, globalsContent);
  console.log(
    `  brand.primary   → ${(themeConfig.colors as Record<string, Record<string, string>>).brand?.primary}`
  );
  console.log(
    `  surface.bg      → ${(themeConfig.colors as Record<string, Record<string, string>>).surface?.background}`
  );
  console.log(
    `  font-sans       → ${((themeConfig.typography as Record<string, unknown>)?.fontFamily as Record<string, string[]>)?.sans?.[0]}`
  );
  console.log(`  → ${globalsPath}`);

  if (visual.fontLinks.length > 0) {
    console.log(`\n── Font links (add to layout.tsx <head>) ─`);
    visual.fontLinks.forEach((l: string) => console.log(`  ${l}`));
  }

  console.log(`\nPASS ✓\n`);
}

main().catch((e: Error) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
