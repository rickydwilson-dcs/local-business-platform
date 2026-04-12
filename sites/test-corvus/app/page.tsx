/**
 * Homepage — mirrors colorcode.events home
 */
import type { Metadata } from 'next';
import {
  HeroFullBleedText,
  EventDetailsBanner,
  EventStats,
  HowItStartedSection,
  BlogPreviewGrid,
  NewsletterSignupCTA,
} from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Digital Marketing Weekend 2026',
  description:
    'Two days of practical marketing sessions, workshops, and networking — free to attend. Eastbourne, 17–18 October 2026.',
};

export default function HomePage() {
  return (
    <main>
      <HeroFullBleedText headline="Digital Marketing Weekend 2026" />

      <EventDetailsBanner
        eventDate="17–18 October 2026"
        eventVenue="Winter Garden, Eastbourne"
        ctaButton={[
          {
            label: 'Get Free Tickets',
            href: 'https://www.eventbrite.co.uk/e/digital-marketing-weekend-2026',
          },
        ]}
      />

      <EventStats
        heading="Two Days of Practical Marketing"
        statItems={[
          { title: '2', description: 'Days' },
          { title: '10+', description: 'Speakers' },
          { title: '20+', description: 'Sessions' },
          { title: '300', description: 'Attendees' },
        ]}
      />

      <HowItStartedSection />

      <BlogPreviewGrid />

      <NewsletterSignupCTA
        heading="Stay in the Loop"
        bodyText="Get updates on speakers, schedule announcements, and event news."
        ctaButton={[{ label: 'Subscribe', href: '#newsletter' }]}
      />

      <section className="py-20 px-4 bg-brand-primary text-center">
        <h2 className="text-h2 text-surface-foreground mb-4">Ready to attend?</h2>
        <p className="text-body text-surface-foreground opacity-80 mb-8 max-w-xl mx-auto">
          It&apos;s completely free. Reserve your place now before spaces run out.
        </p>
        <a
          href="https://www.eventbrite.co.uk/e/digital-marketing-weekend-2026"
          className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-brand-secondary text-brand-primary font-bold text-lg hover:opacity-90 transition-opacity"
        >
          Get Free Tickets
        </a>
      </section>
    </main>
  );
}
