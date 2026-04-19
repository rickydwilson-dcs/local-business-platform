import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Customer Reviews | What Our Clients Say | D J Fox Electrical",
  description:
    "Read what our customers say about D J Fox Electrical. Trusted by homeowners and businesses for professional services.",
  keywords: [
    "reviews",
    "testimonials",
    "customer reviews",
    "client testimonials",
    "company reviews",
  ],
  openGraph: {
    title: "Customer Reviews | What Our Clients Say",
    description:
      "Read what our customers say about D J Fox Electrical. Trusted by homeowners and businesses.",
    url: "/reviews",
    type: "website",
  },
};

export default function ReviewsPage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "reviews",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
