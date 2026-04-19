import type { Metadata } from "next";
import compositionConfig from "../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Professional Electrical Services in Eastbourne | D J Fox Electrical",
  description:
    "NICEIC approved electrical contractor in Eastbourne, East Sussex. 15+ years experience, 24/7 emergency service. Domestic and commercial electrical services.",
  openGraph: {
    title: "Professional Electrical Services in Eastbourne | D J Fox Electrical",
    description:
      "NICEIC approved electrical contractor in Eastbourne, East Sussex. 15+ years experience, 24/7 emergency service.",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Electrical Services in Eastbourne | D J Fox Electrical",
    description:
      "NICEIC approved electrical contractor in Eastbourne, East Sussex. 15+ years experience, 24/7 emergency service.",
  },
};

export default function HomePage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "home",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
