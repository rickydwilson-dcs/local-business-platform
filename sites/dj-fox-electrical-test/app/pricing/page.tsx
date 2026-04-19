import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Pricing & Rates | D J Fox Electrical",
  description:
    "Transparent pricing for electrical services in Eastbourne and Hastings, Bexhill-on-Sea, Brighton, Lewes, Hailsham. Emergency callouts, installations, rewiring, testing and more. Free quotes available.",
};

export default function PricingPage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "pricing",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
