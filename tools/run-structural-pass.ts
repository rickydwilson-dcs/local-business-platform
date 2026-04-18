import { generateStructuralComposition } from "./lib/composition-structural-pass.ts";
import { DesignBriefSchema } from "./lib/design-brief-types.ts";
import * as fs from "fs";

async function main() {
  const brief = DesignBriefSchema.parse(
    JSON.parse(fs.readFileSync("output/briefs/navagarden/design-brief.json", "utf-8"))
  );
  fs.mkdirSync("sites/poc-composition-test", { recursive: true });
  const config = await generateStructuralComposition(brief);
  fs.writeFileSync("sites/poc-composition-test/composition.json", JSON.stringify(config, null, 2));
  console.log("siteId:", config.siteId);
  console.log("pages:", config.pages.length);
  console.log("home sections:", config.pages.find((p) => p.pageType === "home")?.sections.length);
  console.log("PASS: structural pass produced valid SiteCompositionConfig");
}
main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
