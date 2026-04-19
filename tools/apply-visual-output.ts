/**
 * apply-visual-output.ts
 *
 * Reads the visual pass output (visual-output.json) and writes globals.css
 * for the poc-composition-test site. The :root block is derived deterministically
 * from themeConfig.colors — no AI involvement, no self-referencing vars.
 */

import * as fs from "fs";

const visualOutput = JSON.parse(
  fs.readFileSync("output/briefs/navagarden/visual-output.json", "utf-8")
);

const { themeConfig, fontLinks, cssOverrides } = visualOutput;
const { colors, typography } = themeConfig;

function toVar(value: string): string {
  // Pass through non-hex values (rgba, etc.) as-is
  return value;
}

const fontSans = typography?.fontFamily?.sans?.join(", ") ?? "system-ui, sans-serif";
const fontHeading = typography?.fontFamily?.heading?.join(", ") ?? "system-ui, sans-serif";

const root = `:root {
  --color-brand-primary: ${toVar(colors.brand.primary)};
  --color-brand-primary-hover: ${toVar(colors.brand.primaryHover)};
  --color-brand-secondary: ${toVar(colors.brand.secondary)};
  --color-brand-accent: ${toVar(colors.brand.accent)};
  --color-brand-on-primary: ${toVar(colors.brand.onPrimary)};

  --color-surface-background: ${toVar(colors.surface.background)};
  --color-surface-foreground: ${toVar(colors.surface.foreground)};
  --color-surface-muted: ${toVar(colors.surface.muted)};
  --color-surface-muted-foreground: ${toVar(colors.surface.mutedForeground ?? colors.surface.foreground)};
  --color-surface-card: ${toVar(colors.surface.card)};
  --color-surface-card-border: ${toVar(colors.surface.cardBorder ?? colors.surface.cardBorder ?? "#E5E7EB")};
  --color-surface-inverse: ${toVar(colors.surface.inverse ?? colors.brand.secondary)};
  --color-surface-inverse-foreground: ${toVar(colors.surface.background)};

  --color-semantic-success: ${toVar(colors.semantic?.success ?? "#10b981")};
  --color-semantic-warning: ${toVar(colors.semantic?.warning ?? "#f59e0b")};
  --color-semantic-error: ${toVar(colors.semantic?.error ?? "#ef4444")};
  --color-semantic-info: ${toVar(colors.semantic?.info ?? "#3b82f6")};

  --font-sans: '${typography?.fontFamily?.sans?.[0] ?? "system-ui"}', system-ui, sans-serif;
  --font-heading: '${typography?.fontFamily?.heading?.[0] ?? "system-ui"}', system-ui, sans-serif;
}`;

const fontLinkTag = fontLinks
  .map((href: string) => `    <link rel="stylesheet" href="${href}" />`)
  .join("\n");

const globalsContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

${root}

body {
  background-color: var(--color-surface-background);
  color: var(--color-surface-foreground);
  font-family: var(--font-sans);
}
`;

fs.writeFileSync("sites/poc-composition-test/app/globals.css", globalsContent);
console.log("Written: sites/poc-composition-test/app/globals.css");

// Print the <link> tag(s) so the developer can paste into layout.tsx
console.log("\nFont links for layout.tsx <head>:");
console.log(fontLinkTag);

// Print a summary of what was applied
console.log("\nApplied tokens:");
console.log("  brand.primary    →", colors.brand.primary);
console.log("  brand.secondary  →", colors.brand.secondary);
console.log("  surface.bg       →", colors.surface.background);
console.log("  font-sans        →", typography?.fontFamily?.sans?.[0]);
console.log("  font-heading     →", typography?.fontFamily?.heading?.[0]);
