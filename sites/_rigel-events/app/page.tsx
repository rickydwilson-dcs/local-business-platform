/**
 * Homepage — thin wrapper
 *
 * Fetches data and delegates all rendering to RigelHomePage template.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { getContentItems } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { getLocalBusinessSchema } from "@/lib/schema";
import type { SiteConfigSummary, SpeakerSummary, TestimonialSummary } from "@platform/core-components";
import { RigelHomePage } from "@platform/themes/rigel/pages";
import type { RigelHomePageProps } from "@platform/themes/rigel/pages";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
  description:
    "Digital Marketing Weekend is a free two-day conference for small business owners and marketers, held at the Winter Garden, Eastbourne on 17–18 October 2026.",
  keywords: [
    "digital marketing conference",
    "small business marketing",
    "Eastbourne",
    "free marketing event",
    "SEO workshop",
    "social media marketing",
    "email marketing",
    "AI marketing tools",
  ],
  openGraph: {
    title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
    description:
      "Two days of practical marketing sessions, workshops, and networking — completely free to attend.",
    url: absUrl("/"),
    siteName: siteConfig.name,
    images: [
      {
        url: absUrl("/logo.svg"),
        width: 1200,
        height: 630,
        alt: "Digital Marketing Weekend 2026",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
    description: "Free digital marketing conference — Eastbourne, 17–18 October 2026.",
    images: [absUrl("/logo.svg")],
  },
  alternates: {
    canonical: absUrl("/"),
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

interface TestimonialFrontmatter {
  customerName: string;
  customerRole: string;
  rating: number;
  text: string;
  featured: boolean;
  platform: string;
}

const saturdayPreview: RigelHomePageProps["saturdayPreview"] = [
  {
    time: "09:30",
    title: "The Small Business Marketing Stack: What Actually Works in 2026",
    stage: "Main Stage",
    speaker: "Ricky Wilson",
  },
  {
    time: "11:00",
    title: "Local SEO in 2026: What's Changed and What Still Works",
    stage: "Main Stage",
    speaker: "Sarah Chen",
  },
  {
    time: "14:00",
    title: "Email Isn't Dead: Building a List That Actually Converts",
    stage: "Workshop Room",
    speaker: "Emily Thornton",
  },
  {
    time: "15:30",
    title: "Panel: Marketing on a Shoestring Budget",
    stage: "Main Stage",
    speaker: "All Speakers",
  },
];

const sundayPreview: RigelHomePageProps["sundayPreview"] = [
  {
    time: "10:00",
    title: "Getting ROI from Google & Meta Ads on a Small Budget",
    stage: "Main Stage",
    speaker: "Marcus Okafor",
  },
  {
    time: "11:30",
    title: "AI-Powered Marketing: Tools You Can Use Today",
    stage: "Main Stage",
    speaker: "James Hartley",
  },
  {
    time: "14:00",
    title: "Workshop: Build Your 90-Day Marketing Plan",
    stage: "Workshop Room",
    speaker: "Ricky Wilson",
  },
  {
    time: "15:30",
    title: "Closing Keynote: The Future of Local Marketing",
    stage: "Main Stage",
    speaker: "All Speakers",
  },
];

export default async function HomePage() {
  const [allSpeakers, allTestimonials] = await Promise.all([
    getContentItems("speakers"),
    getContentItems("testimonials"),
  ]);

  const featuredSpeakers: SpeakerSummary[] = allSpeakers
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
    .filter((s) => s.featured)
    .slice(0, 6);

  const testimonials: TestimonialSummary[] = allTestimonials
    .map((item) => {
      const fm = item as unknown as TestimonialFrontmatter;
      return {
        slug: item.slug,
        name: fm.customerName,
        rating: fm.rating,
        body: fm.text,
        platform: fm.platform,
      } satisfies TestimonialSummary;
    })
    .filter((_, i) => {
      const fm = allTestimonials[i] as unknown as TestimonialFrontmatter;
      return fm.featured;
    })
    .slice(0, 3);

  const localBusinessSchema = getLocalBusinessSchema();

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Digital Marketing Weekend 2026",
    startDate: "2026-10-17",
    endDate: "2026-10-18",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description:
      "A free two-day conference for small business owners and marketers at the Winter Garden, Eastbourne.",
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: "The Winter Garden",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Compton Street",
        addressLocality: "Eastbourne",
        addressRegion: "East Sussex",
        postalCode: "BN21 4BP",
        addressCountry: "GB",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Digital Marketing Weekend",
      url: absUrl("/"),
    },
    url: absUrl("/"),
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absUrl("/#website"),
    name: siteConfig.business.name,
    url: absUrl("/"),
    description: siteConfig.tagline,
    inLanguage: "en-GB",
  };

  const schemaNodes = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );

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
    <RigelHomePage
      siteConfig={siteSummary}
      featuredSpeakers={featuredSpeakers}
      testimonials={testimonials}
      schemaNodes={schemaNodes}
      saturdayPreview={saturdayPreview}
      sundayPreview={sundayPreview}
      whyChooseUs={siteConfig.about?.whyChooseUs ?? []}
      eventDate="17–18 October 2026 · Eastbourne"
      eventLocation="The Winter Garden, Eastbourne"
      ticketUrl={siteConfig.cta.primary.href}
    />
  );
}
