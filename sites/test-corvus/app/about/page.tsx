/**
 * About Page — mirrors colorcode.events/about/
 */
import type { Metadata } from 'next';
import {
  ColorCodeEventsAbout,
  HowItStartedSection,
  EventStats,
} from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About | Digital Marketing Weekend 2026',
  description:
    'Digital Marketing Weekend is a free two-day conference for small business owners and marketers, held at the Winter Garden, Eastbourne.',
};

export default function AboutPage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            About
          </span>
          <h1 className="text-h1 text-surface-foreground mb-6">About Digital Marketing Weekend</h1>
          <p className="text-body text-surface-foreground opacity-80">
            Bringing together digital marketers, small business owners, and freelancers in the heart
            of Eastbourne.
          </p>
        </div>
      </section>

      <EventStats
        heading="The Event at a Glance"
        statItems={[
          { title: '2', description: 'Days' },
          { title: '10+', description: 'Speakers' },
          { title: '20+', description: 'Sessions' },
          { title: '300', description: 'Attendees' },
        ]}
      />

      <ColorCodeEventsAbout />

      <HowItStartedSection />

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-h2 text-surface-foreground text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Practical Learning',
                body: 'Every session is designed to give you actionable takeaways you can implement immediately.',
              },
              {
                title: 'Accessible to All',
                body: 'Free to attend and welcoming to everyone — from beginners to experienced marketers.',
              },
              {
                title: 'Community First',
                body: 'Built to bring together the local and regional business community around shared learning.',
              },
              {
                title: 'No Fluff',
                body: 'Real practitioners sharing real insights. No sales pitches, no filler.',
              },
            ].map((v) => (
              <div
                key={v.title}
                className="p-6 bg-surface-card rounded-lg border border-surface-border"
              >
                <h3 className="text-h4 text-brand-secondary mb-3">{v.title}</h3>
                <p className="text-body text-surface-foreground opacity-80">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-brand-primary text-center">
        <h2 className="text-h3 text-surface-foreground mb-6">Join Us in Eastbourne</h2>
        <a
          href="https://www.eventbrite.co.uk/e/digital-marketing-weekend-2026"
          className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-brand-secondary text-brand-primary font-bold hover:opacity-90 transition-opacity"
        >
          Get Free Tickets
        </a>
      </section>
    </main>
  );
}
