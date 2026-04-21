import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Contact Us | D J Fox Electrical",
  description:
    "Get in touch with D J Fox Electrical for a free quote or to discuss your requirements. Professional services across Eastbourne, Hastings, Bexhill-on-Sea and surrounding areas.",
};

export default function ContactPage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "contact",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
