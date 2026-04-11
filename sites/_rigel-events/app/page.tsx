/**
 * Digital Marketing Weekend — Homepage
 * =====================================
 *
 * 8-section event homepage:
 * 1. Hero
 * 2. Event Stats Strip
 * 3. About the Event
 * 4. Featured Speakers
 * 5. Schedule Preview
 * 6. Venue Teaser
 * 7. Past Attendees / Testimonials
 * 8. Final CTA
 */

import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { getContentItems } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { getLocalBusinessSchema } from "@/lib/schema";

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
  featured: boolean;
  day: "saturday" | "sunday";
  time: string;
  stage: string;
}

interface TestimonialFrontmatter {
  customerName: string;
  customerRole: string;
  rating: number;
  text: string;
  featured: boolean;
  platform: string;
}

interface ScheduleSession {
  time: string;
  title: string;
  stage: string;
  speaker: string | null;
}

const saturdayPreview: ScheduleSession[] = [
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

const sundayPreview: ScheduleSession[] = [
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

  const featuredSpeakers = allSpeakers
    .map((item) => ({ fm: item as unknown as SpeakerFrontmatter, slug: item.slug }))
    .filter((s) => s.fm.featured)
    .slice(0, 6);

  const featuredTestimonials = allTestimonials
    .map((item) => ({ fm: item as unknown as TestimonialFrontmatter, slug: item.slug }))
    .filter((t) => t.fm.featured)
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

  return (
    <div className="min-h-screen">
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

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="bg-brand-primary py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Date / location badge */}
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-secondary text-brand-primary text-sm font-bold uppercase tracking-widest">
            17–18 October 2026 · Eastbourne
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Digital Marketing Weekend
          </h1>

          <p className="text-xl md:text-2xl text-white opacity-90 mb-10 max-w-2xl mx-auto">
            Two days of practical marketing sessions, workshops, and networking — free to attend.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href={siteConfig.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-secondary text-brand-primary font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
            >
              {siteConfig.cta.primary.label}
            </a>
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white/10 transition-colors"
            >
              View Schedule
            </Link>
          </div>

          {/* Icon badges */}
          <div className="flex flex-wrap justify-center gap-6 text-white opacity-80 text-sm">
            <span className="flex items-center gap-2">
              <span aria-hidden="true">✓</span> Free to Attend
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true">✓</span> 10+ Expert Speakers
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true">✓</span> Winter Garden, Eastbourne
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. EVENT STATS STRIP ────────────────────────────────────── */}
      <section className="bg-surface-foreground py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {siteConfig.credentials.stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold text-brand-secondary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-surface-background opacity-80 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ABOUT THE EVENT ──────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-6">
                What is Digital Marketing Weekend?
              </h2>
              <div className="space-y-4 text-surface-muted-foreground leading-relaxed">
                <p>
                  Digital Marketing Weekend is a free two-day event bringing together digital
                  marketers, small business owners, and freelancers in the heart of Eastbourne.
                </p>
                <p>
                  Across two packed days at the historic Winter Garden, you&apos;ll hear from
                  industry experts on everything from SEO and social media to email marketing, paid
                  advertising, and AI-powered tools.
                </p>
                <p>
                  Whether you&apos;re just starting your digital journey or looking to sharpen your
                  strategy, there&apos;s something for everyone — and it&apos;s completely free.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-surface-foreground mb-5">Who Should Attend?</h3>
              <ul className="space-y-3">
                {siteConfig.about?.whyChooseUs?.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-brand-secondary flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-brand-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-surface-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED SPEAKERS ────────────────────────────────────── */}
      {featuredSpeakers.length > 0 && (
        <section className="section bg-surface-subtle">
          <div className="container-narrow">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-4">
              Featured Speakers
            </h2>
            <p className="text-center text-surface-muted-foreground mb-12 max-w-xl mx-auto">
              Hear from practitioners sharing what actually works in digital marketing today.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSpeakers.map(({ slug, fm }) => (
                <div key={slug} className="card flex flex-col gap-3">
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
                        fm.day === "saturday"
                          ? "bg-brand-primary text-white"
                          : "bg-brand-secondary text-brand-primary"
                      }`}
                    >
                      {fm.day === "saturday" ? "Saturday" : "Sunday"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-surface-foreground">{fm.name}</h3>
                    <p className="text-sm text-surface-muted-foreground">{fm.title}</p>
                  </div>
                  <p className="text-surface-foreground text-sm font-medium leading-snug flex-1">
                    {fm.topic}
                  </p>
                  <p className="text-xs text-surface-muted-foreground">
                    {fm.time} · {fm.stage}
                  </p>
                  <Link
                    href={`/speakers/${slug}`}
                    className="text-brand-primary font-semibold text-sm hover:underline"
                  >
                    Read Bio →
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/speakers" className="btn-secondary">
                View All Speakers
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. SCHEDULE PREVIEW ─────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-4">
            Weekend Schedule
          </h2>
          <p className="text-center text-surface-muted-foreground mb-12 max-w-xl mx-auto">
            17–18 October 2026 · The Winter Garden, Eastbourne
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Saturday */}
            <div>
              <h3 className="text-xl font-bold text-surface-foreground mb-4 pb-3 border-b-2 border-brand-primary">
                Saturday 17 October
              </h3>
              <div className="space-y-0 divide-y divide-surface-muted">
                {saturdayPreview.map((session, index) => (
                  <div key={index} className="py-3 flex items-start gap-4">
                    <span className="flex-shrink-0 inline-block bg-surface-subtle text-surface-foreground text-xs font-bold px-2 py-1 rounded w-14 text-center">
                      {session.time}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-foreground text-sm leading-snug">
                        {session.title}
                      </p>
                      {session.speaker && (
                        <p className="text-xs text-surface-muted-foreground mt-0.5">
                          {session.speaker}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sunday */}
            <div>
              <h3 className="text-xl font-bold text-surface-foreground mb-4 pb-3 border-b-2 border-brand-secondary">
                Sunday 18 October
              </h3>
              <div className="space-y-0 divide-y divide-surface-muted">
                {sundayPreview.map((session, index) => (
                  <div key={index} className="py-3 flex items-start gap-4">
                    <span className="flex-shrink-0 inline-block bg-surface-subtle text-surface-foreground text-xs font-bold px-2 py-1 rounded w-14 text-center">
                      {session.time}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-foreground text-sm leading-snug">
                        {session.title}
                      </p>
                      {session.speaker && (
                        <p className="text-xs text-surface-muted-foreground mt-0.5">
                          {session.speaker}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/schedule" className="btn-secondary">
              View Full Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. VENUE TEASER ─────────────────────────────────────────── */}
      <section className="section bg-surface-subtle">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">The Venue</h2>
          <p className="text-xl text-brand-primary font-semibold mb-2">
            The Winter Garden, Eastbourne
          </p>
          <p className="text-surface-muted-foreground mb-2">Compton Street, Eastbourne, BN21 4BP</p>
          <p className="text-surface-muted-foreground max-w-xl mx-auto mb-8">
            A stunning Victorian seafront venue with a 1,000-seat auditorium, breakout workshop
            rooms, and a terrace overlooking Eastbourne&apos;s seafront.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/venue" className="btn-primary">
              Venue & Travel Info
            </Link>
            <a
              href="https://maps.google.com/?q=Winter+Garden+Eastbourne+BN21+4BP"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View on Map
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ─────────────────────────────────────────── */}
      {featuredTestimonials.length > 0 && (
        <section className="section">
          <div className="container-narrow">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-4">
              What Attendees Say
            </h2>
            <p className="text-center text-surface-muted-foreground mb-12 max-w-xl mx-auto">
              Hear from people who attended our last event.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTestimonials.map(({ slug, fm }) => (
                <div key={slug} className="card flex flex-col gap-4">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: fm.rating }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-brand-secondary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-surface-muted-foreground leading-relaxed flex-1 italic">
                    &ldquo;{fm.text}&rdquo;
                  </p>

                  {/* Attribution */}
                  <div>
                    <p className="font-semibold text-surface-foreground text-sm">
                      {fm.customerName}
                    </p>
                    <p className="text-xs text-surface-muted-foreground">{fm.customerRole}</p>
                    <p className="text-xs text-surface-muted-foreground mt-0.5">
                      via {fm.platform}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. FINAL CTA ────────────────────────────────────────────── */}
      <section className="section bg-brand-primary">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Level Up Your Marketing?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-xl mx-auto">
            Secure your free place at Digital Marketing Weekend 2026. Saturday &amp; Sunday, 17–18
            October, Eastbourne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={siteConfig.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-secondary text-brand-primary font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Your Free Ticket
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
