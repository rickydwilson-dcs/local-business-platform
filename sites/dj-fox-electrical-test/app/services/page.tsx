import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Our Services | D J Fox Electrical",
  description:
    "Professional services offered by D J Fox Electrical. Quality work, competitive prices, and excellent customer service.",
  keywords: ["services", "professional services", "local business"],
  openGraph: {
    title: "Our Services | D J Fox Electrical",
    description: "Professional services offered by D J Fox Electrical.",
    url: "/services",
    type: "website",
  },
};

export default function ServicesPage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "services",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
