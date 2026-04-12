/**
 * Sponsors Page — thin wrapper
 *
 * Static sponsor data lives here. Delegates rendering to RigelSponsorsPage.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import type { SiteConfigSummary } from "@platform/core-components";
import { RigelSponsorsPage } from "@platform/themes/rigel/pages";
import type { SponsorEntry } from "@platform/themes/rigel/pages";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Sponsors | Digital Marketing Weekend 2026",
  description:
    "Our sponsors and community partners who make Digital Marketing Weekend free to attend.",
  openGraph: {
    title: "Sponsors | Digital Marketing Weekend 2026",
    description: "Sponsors and partners supporting Digital Marketing Weekend 2026.",
    url: "/sponsors",
    type: "website",
  },
};

const goldSponsors: SponsorEntry[] = [
  { name: "Verdant Digital" },
  { name: "Spark Advertising" },
];

const silverSponsors: SponsorEntry[] = [
  { name: "TechEast" },
  { name: "Sussex Business Hub" },
  { name: "Coastal Web Co" },
];

const communityPartners: SponsorEntry[] = [
  { name: "Eastbourne Chamber of Commerce" },
  { name: "East Sussex Growth Hub" },
  { name: "Digital Brighton" },
];

export default function SponsorsPage() {
  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone ?? "",
    phoneDisplay: siteConfig.business.phone ?? "",
    address: {
      city: siteConfig.business.address.city,
      county: siteConfig.business.address.region,
    },
    cta: siteConfig.cta,
    stats: siteConfig.credentials.stats,
  };

  return (
    <RigelSponsorsPage
      siteConfig={siteSummary}
      goldSponsors={goldSponsors}
      silverSponsors={silverSponsors}
      communityPartners={communityPartners}
    />
  );
}
