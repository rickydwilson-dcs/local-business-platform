/**
 * Buffalo Event Page — mirrors colorcode.events/buffalo/
 */
import type { Metadata } from 'next';
import {
  EventDetailsBanner,
  EventStats,
  EventPhotoGallery,
} from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Buffalo 2025 | colorcode.events',
  description:
    'colorcode Buffalo 2025 — a tech and creative conference celebrating colour, code, and community.',
};

export default function BuffaloPage() {
  return (
    <main>
      {/* Hero */}
      <EventDetailsBanner
        eventDate="2025"
        eventVenue="Buffalo, New York"
        ctaButton={[{ label: 'View Recap', href: '#recap' }]}
      />

      {/* Stats */}
      <EventStats
        heading="Buffalo 2025 by the Numbers"
        statItems={[
          { title: '2', description: 'Days' },
          { title: '30+', description: 'Speakers' },
          { title: '40+', description: 'Sessions' },
          { title: '500+', description: 'Attendees' },
        ]}
      />

      {/* Gallery */}
      <EventPhotoGallery />

      {/* About */}
      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-h2 text-surface-foreground mb-6">About colorcode Buffalo</h2>
          <p className="text-body text-surface-foreground opacity-80 mb-6">
            colorcode Buffalo brings together developers, designers, and digital creators for two
            days of talks, workshops, and community building in Western New York.
          </p>
          <p className="text-body text-surface-foreground opacity-80">
            With a focus on the intersection of creativity and technology, colorcode celebrates the
            people who make the web beautiful, functional, and accessible.
          </p>
        </div>
      </section>

      {/* Schedule preview */}
      <section className="py-20 px-4 bg-surface-inverse">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-h2 text-surface-foreground text-center mb-12">Schedule Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { time: 'Day 1 Morning', title: 'Opening Keynote', speaker: 'Featured Speaker' },
              { time: 'Day 1 Afternoon', title: 'Workshop: Creative Coding', speaker: 'TBA' },
              { time: 'Day 2 Morning', title: 'Accessibility & Inclusion', speaker: 'TBA' },
              { time: 'Day 2 Afternoon', title: 'Closing Keynote', speaker: 'Featured Speaker' },
            ].map((s) => (
              <div
                key={s.title}
                className="p-6 bg-surface-card rounded-lg border border-surface-border"
              >
                <span className="text-brand-secondary text-sm font-semibold uppercase tracking-wider block mb-2">
                  {s.time}
                </span>
                <h3 className="text-h4 text-surface-foreground mb-1">{s.title}</h3>
                <p className="text-small text-surface-muted-foreground">{s.speaker}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
