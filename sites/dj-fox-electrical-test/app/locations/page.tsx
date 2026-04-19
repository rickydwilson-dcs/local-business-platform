import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Service Areas | Locations | D J Fox Electrical",
  description:
    "D J Fox Electrical serves customers across Eastbourne, Hastings, Bexhill-on-Sea, Brighton, Lewes, Hailsham. Find our services in your area.",
  keywords: ["locations", "service areas", "local services"],
  openGraph: {
    title: "Service Areas | D J Fox Electrical",
    description: "D J Fox Electrical serves customers across multiple locations.",
    url: "/locations",
    type: "website",
  },
};

export default function LocationsPage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "locations",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
