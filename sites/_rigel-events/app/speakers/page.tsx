/**
 * Speakers Listing Page — thin wrapper
 *
 * Fetches and sorts speaker data, delegates rendering to RigelSpeakersPage template.
 */

import type { Metadata } from "next";
import { getContentItems } from "@/lib/content";
import { siteConfig } from "@/site.config";
import type { SiteConfigSummary, SpeakerSummary } from "@platform/core-components";
import { RigelSpeakersPage } from "@platform/themes/rigel/pages";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Speakers | Digital Marketing Weekend 2026",
  description:
    "Meet the speakers at Digital Marketing Weekend 2026. Hear from practitioners and specialists across digital marketing, SEO, paid ads, email, and AI tools.",
  openGraph: {
    title: "Speakers | Digital Marketing Weekend 2026",
    description: "Practitioners and specialists sharing what actually works in digital marketing.",
    url: "/speakers",
    type: "website",
  },
};

interface SpeakerFrontmatter {
  name: string;
  slug: string;
  title: string;
  topic: string;
  description: string;
  day: "saturday" | "sunday";
  time: string;
  stage: string;
  featured: boolean;
  imageAlt?: string;
  social?: { twitter?: string; linkedin?: string; website?: string };
}

export default async function SpeakersPage() {
  const items = await getContentItems("speakers");

  const speakers: SpeakerSummary[] = items
    .map((item) => {
      const fm = item as unknown as SpeakerFrontmatter;
      return {
        slug: item.slug,
        name: fm.name,
        title: fm.title,
        topic: fm.topic,
        description: fm.description,
        day: fm.day,
        time: fm.time,
        stage: fm.stage,
        featured: fm.featured,
        imageAlt: fm.imageAlt,
        social: fm.social,
      } satisfies SpeakerSummary;
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.day !== b.day) return a.day === "saturday" ? -1 : 1;
      return a.time.localeCompare(b.time);
    });

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

  return <RigelSpeakersPage siteConfig={siteSummary} speakers={speakers} />;
}
