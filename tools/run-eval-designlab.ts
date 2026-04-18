import {
  generateStructuralComposition,
  DesignBriefSchema,
} from "./lib/composition-structural-pass.js";
import { generateVisualConfig } from "./lib/composition-visual-pass.js";
import * as fs from "fs";

async function main() {
  const raw = fs.readFileSync("output/briefs/designlab/design-brief.json", "utf-8");
  const brief = DesignBriefSchema.parse(JSON.parse(raw));

  console.log("Running structural pass for designlab...");
  const structuralConfig = await generateStructuralComposition(brief);
  fs.writeFileSync(
    "output/sessions/2026-04/2026-04-18_component-composition-system/designlab-composition.json",
    JSON.stringify(structuralConfig, null, 2)
  );
  console.log(
    `siteId: ${structuralConfig.siteId}, pages: ${structuralConfig.pages.length}, home sections: ${structuralConfig.pages.find((p) => p.pageType === "home")?.sections.length}`
  );

  console.log("\nRunning visual pass for designlab...");
  const visualConfig = await generateVisualConfig(brief);
  fs.writeFileSync(
    "output/sessions/2026-04/2026-04-18_component-composition-system/designlab-visual.json",
    JSON.stringify(visualConfig, null, 2)
  );
  console.log(
    `fontLinks: ${visualConfig.fontLinks.length}, themeConfig keys: ${Object.keys(visualConfig.themeConfig)}, provenance entries: ${Object.keys(visualConfig.provenance).length}`
  );

  console.log("\nPASS: both passes completed for designlab");
}

main().catch((e: Error) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
