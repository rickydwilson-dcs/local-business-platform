import { generateVisualConfig } from "./lib/composition-visual-pass.js";
import { DesignBriefSchema } from "./lib/design-brief-types.js";
import * as fs from "fs";

async function main() {
  const raw = fs.readFileSync("output/briefs/navagarden/design-brief.json", "utf-8");
  const brief = DesignBriefSchema.parse(JSON.parse(raw));
  const output = await generateVisualConfig(brief);

  fs.mkdirSync("sites/poc-composition-test/app", { recursive: true });

  fs.writeFileSync("sites/poc-composition-test/app/composition-overrides.css", output.cssOverrides);

  const themeTs = `import type { DeepPartialThemeConfig } from '@platform/theme-system';

export const themeConfig: DeepPartialThemeConfig = ${JSON.stringify(output.themeConfig, null, 2)} as DeepPartialThemeConfig;
`;
  fs.writeFileSync("sites/poc-composition-test/theme.config.ts", themeTs);

  console.log("Font links to add to layout.tsx:");
  output.fontLinks.forEach((link) => console.log(`  <link rel="stylesheet" href="${link}" />`));
  console.log("PASS: visual config written");
}

main().catch((e: Error) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
