/**
 * Contact Page
 *
 * Uses site page template driven from siteConfig.
 */

import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { SiteContactPage } from "@/components/pages/ContactPage";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";
import { absUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.business.name}`,
  description: `Get in touch with ${siteConfig.business.name} for a free quote or to discuss your website requirements. Professional web design for tradespeople across ${siteConfig.serviceAreas.slice(0, 3).join(", ")} and surrounding areas.`,
  alternates: {
    canonical: absUrl("/contact"),
  },
};

export default function ContactPage() {
  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

  return <SiteContactPage siteConfig={siteSummary} />;
}
