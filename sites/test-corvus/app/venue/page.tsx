/**
 * Venue Page (Category B)
 */
import type { Metadata } from 'next';
import { StatsVenue } from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Venue | Digital Marketing Weekend 2026',
  description:
    'The Winter Garden, Eastbourne — venue for Digital Marketing Weekend 2026. Address, travel information, and nearby hotels.',
};

export default function VenuePage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            The Venue
          </span>
          <h1 className="text-h1 text-surface-foreground mb-4">Winter Garden, Eastbourne</h1>
          <p className="text-body text-surface-foreground opacity-80">
            Compton Street, Eastbourne, East Sussex, BN21 4BP · 17–18 October 2026
          </p>
        </div>
      </section>

      <StatsVenue />

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Travel */}
          <div>
            <h2 className="text-h2 text-surface-foreground mb-8">Getting Here</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-h4 text-brand-secondary mb-3">By Train</h3>
                <p className="text-body text-surface-foreground opacity-80">
                  Eastbourne station is a 10-minute walk along the seafront. The Winter Garden is
                  clearly signposted from the station.
                </p>
              </div>
              <div>
                <h3 className="text-h4 text-brand-secondary mb-3">By Car</h3>
                <p className="text-body text-surface-foreground opacity-80">
                  Seafront car parks within 5 minutes — Wish Tower or Central car parks on King
                  Edward&apos;s Parade are closest.
                </p>
              </div>
              <div>
                <h3 className="text-h4 text-brand-secondary mb-3">By Bus</h3>
                <p className="text-body text-surface-foreground opacity-80">
                  Regular services from Eastbourne town centre, with a stop on Grand Parade — a
                  2-minute walk from the venue.
                </p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Winter+Garden+Compton+Street+Eastbourne"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-md bg-brand-secondary text-brand-primary font-bold hover:opacity-90 transition-opacity"
            >
              Open in Google Maps
            </a>
          </div>

          {/* Facilities */}
          <div>
            <h2 className="text-h2 text-surface-foreground mb-8">Venue Facilities</h2>
            <ul className="space-y-3 mb-12">
              {[
                'Accessible entrance on Compton Street with step-free access throughout',
                'On-site café and bar open both days',
                'Terrace with sea views — perfect for networking breaks',
                'Flexible seating across Main Stage and Workshop Room',
                'Capacity 400 — plenty of room to connect with fellow attendees',
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-body text-surface-foreground opacity-80"
                >
                  <span className="text-brand-secondary font-bold flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <h2 className="text-h2 text-surface-foreground mb-6">Nearby Hotels</h2>
            <div className="space-y-4">
              {[
                {
                  name: 'The Grand Hotel Eastbourne',
                  dist: '5 min walk',
                  note: "Iconic seafront hotel on King Edward's Parade.",
                },
                {
                  name: 'The Best Western Lansdowne',
                  dist: '8 min walk',
                  note: 'Comfortable seafront hotel with easy access to the venue.',
                },
                {
                  name: 'Hydro Hotel',
                  dist: '12 min walk',
                  note: 'Elegant hotel on the seafront with sea views.',
                },
              ].map((h) => (
                <div
                  key={h.name}
                  className="p-4 bg-surface-card rounded-lg border border-surface-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-body font-semibold text-surface-foreground">{h.name}</h4>
                    <span className="text-small text-brand-secondary flex-shrink-0">{h.dist}</span>
                  </div>
                  <p className="text-small text-surface-foreground opacity-70 mt-1">{h.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
