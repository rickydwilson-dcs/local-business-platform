import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Blog | Industry Insights & Expert Tips | D J Fox Electrical",
  description:
    "Expert insights, tips, and guidance from the D J Fox Electrical team. Stay informed with professional advice and industry news.",
  keywords: ["blog", "tips", "industry news", "expert advice", "guidance"],
  openGraph: {
    title: "Blog | Industry Insights & Expert Tips",
    description: "Expert insights, tips, and guidance from the D J Fox Electrical team.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "blog",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
