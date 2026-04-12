/**
 * Homepage — thin wrapper
 *
 * Composes Rigel theme components to match the colorcode.events reference design.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { getContentItems } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { getLocalBusinessSchema } from "@/lib/schema";
import {
  Hero,
  Stats,
  ColorCodeEventsAbout,
  HowItStarted,
  EventDetailsBanner,
  StatsSpeakers,
  EventStatsBlock,
  NewsletterSignupCTA,
} from "@platform/themes/rigel/components";

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

export default async function HomePage() {
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

  return (
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

      {/* 1. Hero */}
      <Hero
        heading="Digital Marketing Weekend 2026"
        subheading="Two days of practical marketing sessions, workshops, and networking — free to attend. Eastbourne, 17–18 October 2026."
        ctaButtons={[
          { label: "Get Your Free Ticket", href: siteConfig.cta.primary.href },
          { label: "View Schedule", href: "/schedule" },
        ]}
      />

      {/* 2. Event Details Banner */}
      <EventDetailsBanner
        eventDate="17–18 October 2026"
        eventTime="9:00am – 6:00pm each day"
        eventVenue="The Winter Garden, Eastbourne"
        eventInfoCta={[{ label: "Get Event Info", href: "/venue" }]}
      />

      {/* 3. Stats strip */}
      <Stats
        statItems={[
          {
            value: "10+",
            label: "Expert Speakers",
            description: "Practitioners sharing real results",
          },
          { value: "2", label: "Full Days", description: "Packed with sessions and workshops" },
          { value: "Free", label: "To Attend", description: "No ticket price, no catch" },
          { value: "500+", label: "Attendees", description: "Marketers and business owners" },
        ]}
      />

      {/* 4. About the event */}
      <ColorCodeEventsAbout
        sectionHeading="About Digital Marketing Weekend"
        bodyText="Digital Marketing Weekend is a free two-day event bringing together digital marketers, small business owners, and freelancers in Eastbourne. Across two packed days at The Winter Garden, you'll hear from industry experts on everything from SEO and social media to email marketing, paid advertising, and AI-powered tools. Whether you're just starting your digital journey or looking to sharpen your strategy, there's something for everyone — and it's completely free."
        learnMoreButton={[{ label: "About the Event", href: "/about" }]}
      />

      {/* 5. How it started */}
      <HowItStarted
        sectionHeading="How It All Started"
        bodyText={[
          "Digital Marketing Weekend was born out of a simple belief: that world-class marketing education shouldn't be locked behind expensive conference fees.",
          "We started with a single event in Eastbourne, bringing together a handful of passionate marketers and business owners who wanted practical, actionable advice — not theoretical fluff.",
          "Today, thousands of attendees have walked away with strategies they could implement the very next day. And it's still completely free.",
        ]}
      />

      {/* 6. Speaker stats */}
      <StatsSpeakers
        heading="Our Speakers"
        statItems={[
          { value: "10+", label: "Expert Speakers" },
          { value: "2", label: "Stages" },
          { value: "20+", label: "Sessions" },
          { value: "100%", label: "Practitioner-Led" },
        ]}
      />

      {/* 7. Event stats block */}
      <EventStatsBlock
        heading="Event at a Glance"
        statItems={[
          { label: "Schedule", value: "9AM – 6PM", description: "Both Saturday and Sunday" },
          { label: "Venue", value: "Winter Garden", description: "Compton Street, Eastbourne" },
          { label: "Speakers", value: "10+", description: "Industry practitioners" },
          { label: "Stages", value: "2", description: "Main stage and workshop room" },
        ]}
      />

      {/* 8. Newsletter / register CTA */}
      <NewsletterSignupCTA />
    </>
  );
}
