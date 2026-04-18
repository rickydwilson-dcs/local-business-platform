import compositionConfig from "../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export default function HomePage() {
  const { elements, diagnostics } = renderComposedPage({
    composition: config,
    pageType: "home",
    data: siteData,
  });

  if (diagnostics.length > 0) {
    console.warn("[Composition diagnostics]", diagnostics);
  }

  return <main className="min-h-screen">{elements}</main>;
}
