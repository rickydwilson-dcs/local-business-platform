/**
 * Services Listing Page
 * =====================
 *
 * Thin wrapper — delegates rendering to CygnusServicesPage template.
 */

import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { Schema } from "@platform/core-components";
import { CygnusServicesPage } from "@platform/themes/cygnus/pages";
import { getServices } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Our Services | ${siteConfig.business.name}`,
  description: `Professional services offered by ${siteConfig.business.name}. Quality work, competitive prices, and excellent customer service.`,
  keywords: ["services", "professional services", "local business"],
  openGraph: {
    title: `Our Services | ${siteConfig.business.name}`,
    description: `Professional services offered by ${siteConfig.business.name}.`,
    url: "/services",
    type: "website",
  },
};

export default async function ServicesPage() {
  const services = await getServices();

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

  const serviceSummaries = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
  }));

  return (
    <>
      <CygnusServicesPage siteConfig={siteSummary} services={serviceSummaries} />
      <Schema
        org={{
          name: siteConfig.business.name,
          url: "/",
          logo: "/logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
        webpage={{
          "@type": "CollectionPage",
          "@id": absUrl("/services#collection"),
          url: absUrl("/services"),
          name: `${siteConfig.business.name} Services`,
          description: `Professional services offered by ${siteConfig.business.name}.`,
        }}
      />
    </>
  );
}
