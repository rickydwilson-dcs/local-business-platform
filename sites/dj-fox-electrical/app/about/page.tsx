import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "About Us | D J Fox Electrical",
  description:
    "Learn about D J Fox Electrical - established 2025. Professional services with qualified team and comprehensive insurance.",
};

export default function AboutPage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "about",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
