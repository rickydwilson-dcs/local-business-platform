/**
 * Homepage — corvus theme components
 *
 * Composes Corvus theme components for the Digital Marketing Weekend event site.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { absUrl } from "@/lib/site";
import { getLocalBusinessSchema } from "@/lib/schema";
import {
  HeroFullBleedText,
  EventDetailsBanner,
  EventStats,
  ColorCodeEventsAbout,
  HowItStartedSection,
  NewsletterSignupCTA,
} from "@platform/themes/corvus/components";

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
      <HeroFullBleedText headline="Digital Marketing Weekend 2026" />

      {/* 2. Event Details Banner */}
      <EventDetailsBanner
        eventDate="17–18 October 2026"
        eventTime="9:00am – 6:00pm each day"
        eventVenue="The Winter Garden, Eastbourne"
        ctaButton={[{ label: "Get Event Info", href: "/venue" }]}
      />

      {/* 3. Stats strip */}
      <EventStats
        heading="Event at a Glance"
        statItems={[
          { title: "2", description: "Days" },
          { title: "10+", description: "Speakers" },
          { title: "20+", description: "Sessions" },
          { title: "300", description: "Attendees" },
        ]}
      />

      {/* 4. About the event */}
      <ColorCodeEventsAbout
        sectionHeading="About Digital Marketing Weekend"
        bodyText="Digital Marketing Weekend is a free two-day event bringing together digital marketers, small business owners, and freelancers in Eastbourne. Across two packed days at The Winter Garden, you'll hear from industry experts on everything from SEO and social media to email marketing, paid advertising, and AI-powered tools. Whether you're just starting your digital journey or looking to sharpen your strategy, there's something for everyone — and it's completely free."
        ctaButton={[{ label: "Learn More", href: "/venue" }]}
      />

      {/* 5. Why Choose Us */}
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-12">
            Why Attend?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Completely free to attend",
              "10+ industry expert speakers",
              "20+ practical sessions and workshops",
              "Networking opportunities with 300 attendees",
              "Stunning seafront venue",
              "Saturday and Sunday programme",
              "No sales pitches — just practical advice",
              "Suitable for all levels of experience",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-surface-card border border-surface-border rounded-xl p-5"
              >
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-surface-background"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-surface-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Schedule preview */}
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-on-brand-primary text-center mb-12">
            Weekend Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Saturday */}
            <div className="bg-surface-inverse rounded-xl p-6">
              <h3 className="text-xl font-bold text-brand-secondary mb-4">Saturday 17 October</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-brand-accent font-mono text-sm mt-0.5">09:30</span>
                  <span className="text-surface-foreground">
                    The Small Business Marketing Stack — Ricky Wilson
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-accent font-mono text-sm mt-0.5">11:00</span>
                  <span className="text-surface-foreground">Local SEO in 2026 — Sarah Chen</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-accent font-mono text-sm mt-0.5">14:00</span>
                  <span className="text-surface-foreground">
                    Email Isn&apos;t Dead — Emily Thornton
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-accent font-mono text-sm mt-0.5">15:30</span>
                  <span className="text-surface-foreground">
                    Panel: Marketing on a Shoestring Budget
                  </span>
                </li>
              </ul>
            </div>
            {/* Sunday */}
            <div className="bg-surface-inverse rounded-xl p-6">
              <h3 className="text-xl font-bold text-brand-secondary mb-4">Sunday 18 October</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-brand-accent font-mono text-sm mt-0.5">10:00</span>
                  <span className="text-surface-foreground">
                    Google &amp; Meta Ads on a Small Budget — Marcus Okafor
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-accent font-mono text-sm mt-0.5">11:30</span>
                  <span className="text-surface-foreground">
                    AI-Powered Marketing — James Hartley
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-accent font-mono text-sm mt-0.5">14:00</span>
                  <span className="text-surface-foreground">
                    Build Your 90-Day Marketing Plan — Ricky Wilson
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-accent font-mono text-sm mt-0.5">15:30</span>
                  <span className="text-surface-foreground">
                    Closing Keynote: The Future of Local Marketing
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <a
              href="/schedule"
              className="inline-block bg-brand-secondary text-brand-primary font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              View Full Schedule
            </a>
          </div>
        </div>
      </section>

      {/* 7. Newsletter CTA */}
      <NewsletterSignupCTA
        heading="Stay in the loop"
        subtext="Get speaker announcements, schedule updates, and event news delivered to your inbox."
      />

      {/* 8. Final CTA */}
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
            Ready to Join Us?
          </h2>
          <p className="text-surface-muted-foreground text-lg mb-8">
            Digital Marketing Weekend is completely free. Secure your spot today.
          </p>
          <a
            href={siteConfig.cta.primary.href}
            className="inline-block bg-brand-primary text-on-brand-primary font-bold text-lg px-10 py-4 rounded-lg hover:bg-brand-primary-hover transition-colors"
          >
            Get Your Free Ticket
          </a>
        </div>
      </section>
    </>
  );
}
