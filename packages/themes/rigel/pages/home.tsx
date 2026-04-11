/**
 * RigelHomePage — Event homepage template
 *
 * 8-section layout:
 * 1. Hero
 * 2. Stats Strip
 * 3. About the Event
 * 4. Featured Speakers
 * 5. Schedule Preview
 * 6. Venue Teaser
 * 7. Testimonials
 * 8. Final CTA
 *
 * Receives all data as props — no content loading inside this component.
 */

import Link from "next/link";
import type {
  RigelHomePageTemplateProps,
  SpeakerSummary,
  TestimonialSummary,
} from "@platform/core-components";

interface SchedulePreviewSession {
  time: string;
  title: string;
  stage: string;
  speaker: string | null;
}

export interface RigelHomePageProps extends RigelHomePageTemplateProps {
  saturdayPreview?: SchedulePreviewSession[];
  sundayPreview?: SchedulePreviewSession[];
  whyChooseUs?: string[];
  eventDate?: string;
  eventLocation?: string;
  ticketUrl?: string;
}

function SpeakerCard({ speaker }: { speaker: SpeakerSummary }) {
  return (
    <div className="card flex flex-col gap-3">
      <div>
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
            speaker.day === "saturday"
              ? "bg-brand-primary text-white"
              : "bg-brand-secondary text-brand-primary"
          }`}
        >
          {speaker.day === "saturday" ? "Saturday" : "Sunday"}
        </span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-surface-foreground">{speaker.name}</h3>
        <p className="text-sm text-surface-muted-foreground">{speaker.title}</p>
      </div>
      <p className="text-surface-foreground text-sm font-medium leading-snug flex-1">
        {speaker.topic}
      </p>
      <p className="text-xs text-surface-muted-foreground">
        {speaker.time} · {speaker.stage}
      </p>
      <Link
        href={`/speakers/${speaker.slug}`}
        className="text-brand-primary font-semibold text-sm hover:underline"
      >
        Read Bio →
      </Link>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialSummary }) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-brand-secondary"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-surface-muted-foreground leading-relaxed flex-1 italic">
        &ldquo;{testimonial.body}&rdquo;
      </p>
      <div>
        <p className="font-semibold text-surface-foreground text-sm">{testimonial.name}</p>
        {testimonial.platform && (
          <p className="text-xs text-surface-muted-foreground mt-0.5">via {testimonial.platform}</p>
        )}
      </div>
    </div>
  );
}

export function RigelHomePage({
  siteConfig,
  featuredSpeakers,
  testimonials,
  schemaNodes,
  saturdayPreview = [],
  sundayPreview = [],
  whyChooseUs = [],
  eventDate = "17–18 October 2026 · Eastbourne",
  eventLocation = "The Winter Garden, Eastbourne",
  ticketUrl,
}: RigelHomePageProps) {
  const ctaHref = ticketUrl ?? siteConfig.cta.primary.href;
  const ctaLabel = siteConfig.cta.primary.label;

  return (
    <div className="min-h-screen">
      {schemaNodes}

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="bg-brand-primary py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-secondary text-brand-primary text-sm font-bold uppercase tracking-widest">
            {eventDate}
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {siteConfig.name}
          </h1>

          <p className="text-xl md:text-2xl text-white opacity-90 mb-10 max-w-2xl mx-auto">
            {siteConfig.tagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-secondary text-brand-primary font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
            </a>
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white/10 transition-colors"
            >
              View Schedule
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white opacity-80 text-sm">
            <span className="flex items-center gap-2">
              <span aria-hidden="true">✓</span> Free to Attend
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true">✓</span> 10+ Expert Speakers
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true">✓</span> {eventLocation}
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. EVENT STATS STRIP ────────────────────────────────────── */}
      {siteConfig.stats && siteConfig.stats.length > 0 && (
        <section className="bg-surface-foreground py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {siteConfig.stats.map((stat, index) => (
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
      )}

      {/* ── 3. ABOUT THE EVENT ──────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-6">
                What is {siteConfig.name}?
              </h2>
              <div className="space-y-4 text-surface-muted-foreground leading-relaxed">
                <p>
                  {siteConfig.name} is a free two-day event bringing together digital marketers,
                  small business owners, and freelancers in the heart of {siteConfig.address.city}.
                </p>
                <p>
                  Across two packed days at {eventLocation}, you&apos;ll hear from industry experts
                  on everything from SEO and social media to email marketing, paid advertising, and
                  AI-powered tools.
                </p>
                <p>
                  Whether you&apos;re just starting your digital journey or looking to sharpen your
                  strategy, there&apos;s something for everyone — and it&apos;s completely free.
                </p>
              </div>
            </div>

            {whyChooseUs.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-surface-foreground mb-5">
                  Who Should Attend?
                </h3>
                <ul className="space-y-3">
                  {whyChooseUs.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-brand-secondary flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-brand-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="text-surface-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              {featuredSpeakers.map((speaker) => (
                <SpeakerCard key={speaker.slug} speaker={speaker} />
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
      {(saturdayPreview.length > 0 || sundayPreview.length > 0) && (
        <section className="section">
          <div className="container-narrow">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-4">
              Weekend Schedule
            </h2>
            <p className="text-center text-surface-muted-foreground mb-12 max-w-xl mx-auto">
              {eventDate} · {eventLocation}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {saturdayPreview.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-surface-foreground mb-4 pb-3 border-b-2 border-brand-primary">
                    Saturday
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
              )}

              {sundayPreview.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-surface-foreground mb-4 pb-3 border-b-2 border-brand-secondary">
                    Sunday
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
              )}
            </div>

            <div className="text-center mt-10">
              <Link href="/schedule" className="btn-secondary">
                View Full Schedule
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 6. VENUE TEASER ─────────────────────────────────────────── */}
      <section className="section bg-surface-subtle">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
            The Venue
          </h2>
          <p className="text-xl text-brand-primary font-semibold mb-2">{eventLocation}</p>
          <p className="text-surface-muted-foreground max-w-xl mx-auto mb-8">
            A stunning Victorian seafront venue with a 1,000-seat auditorium, breakout workshop
            rooms, and a terrace overlooking the seafront.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/venue" className="btn-primary">
              Venue &amp; Travel Info
            </Link>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(eventLocation)}`}
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
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container-narrow">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-4">
              What Attendees Say
            </h2>
            <p className="text-center text-surface-muted-foreground mb-12 max-w-xl mx-auto">
              Hear from people who attended our last event.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.slug} testimonial={testimonial} />
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
            Secure your free place at {siteConfig.name}. {eventDate}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={ctaHref}
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
