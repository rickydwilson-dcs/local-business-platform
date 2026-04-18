import { generateVisualConfig } from "./lib/composition-visual-pass.js";
import { DesignBriefSchema } from "./lib/design-brief-types.js";
import * as fs from "fs";

async function main() {
  const raw = fs.readFileSync("output/briefs/navagarden/design-brief.json", "utf-8");
  const brief = DesignBriefSchema.parse(JSON.parse(raw));
  const output = await generateVisualConfig(brief);
  console.log("fontLinks:", output.fontLinks.length);
  console.log("cssOverrides length:", output.cssOverrides.length);
  console.log("themeConfig keys:", Object.keys(output.themeConfig));
  console.log("provenance entries:", Object.keys(output.provenance).length);
  const hexCheck = output.cssOverrides.match(/#[0-9a-fA-F]{6}/g);
  if (hexCheck) {
    console.error("FAIL: hardcoded hex in cssOverrides:", hexCheck);
    process.exit(1);
  }
  console.log("PASS: visual pass produced valid VisualPassOutput (no hardcoded hex)");
}

main().catch((e: Error) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
