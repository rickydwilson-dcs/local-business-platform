/**
 * Locations Listing Page
 * ======================
 *
 * Displays all service area locations.
 */

import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { Schema } from "@platform/core-components";
import { NovaLocationsPage } from "@platform/themes/nova/pages";
import { getLocations } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Service Areas | Locations | ${siteConfig.business.name}`,
  description: `${siteConfig.business.name} serves customers across ${siteConfig.serviceAreas.join(", ")}. Find our services in your area.`,
  keywords: ["locations", "service areas", "local services", ...siteConfig.serviceAreas],
  openGraph: {
    title: `Service Areas | ${siteConfig.business.name}`,
    description: `${siteConfig.business.name} serves customers across multiple locations.`,
    url: "/locations",
    type: "website",
  },
};

export default async function LocationsPage() {
  const locations = await getLocations();

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

  return (
    <>
      <NovaLocationsPage
        siteConfig={siteSummary}
        locations={locations.map((l) => ({
          slug: l.slug,
          title: l.title,
          description: l.description,
        }))}
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: "/",
          logo: "/logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Locations", url: "/locations" },
        ]}
        webpage={{
          "@type": "CollectionPage",
          "@id": absUrl("/locations#collection"),
          url: absUrl("/locations"),
          name: `${siteConfig.business.name} Service Areas`,
          description: `${siteConfig.business.name} serves customers across multiple locations.`,
        }}
      />
    </>
  );
}
