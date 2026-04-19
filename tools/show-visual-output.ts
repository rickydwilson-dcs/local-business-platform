import { generateVisualConfig } from "./lib/composition-visual-pass.ts";
import { DesignBriefSchema } from "./lib/design-brief-types.ts";
import * as fs from "fs";

async function main() {
  const brief = DesignBriefSchema.parse(
    JSON.parse(fs.readFileSync("output/briefs/navagarden/design-brief.json", "utf-8"))
  );
  const out = await generateVisualConfig(brief);
  console.log("=== fontLinks ===");
  out.fontLinks.forEach((l: string) => console.log(l));
  console.log("\n=== cssOverrides ===");
  console.log(out.cssOverrides);
  console.log("\n=== themeConfig ===");
  console.log(JSON.stringify(out.themeConfig, null, 2));
  fs.writeFileSync("output/briefs/navagarden/visual-output.json", JSON.stringify(out, null, 2));
  console.log("\nWritten to output/briefs/navagarden/visual-output.json");
}
main().catch(console.error);
