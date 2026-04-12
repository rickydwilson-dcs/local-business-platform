/**
 * About Page
 *
 * Uses Solaris page template driven from siteConfig.
 */

import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { SolarisAboutPage } from "@platform/themes/solaris/pages";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";
import { absUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.business.name}`,
  description: `Learn about ${siteConfig.business.name} — established ${siteConfig.credentials.yearEstablished}. ${siteConfig.tagline}.`,
  alternates: {
    canonical: absUrl("/about"),
  },
};

export default function AboutPage() {
  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

  return <SolarisAboutPage siteConfig={siteSummary} />;
}
