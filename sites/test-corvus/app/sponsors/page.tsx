/**
 * Sponsors Page (Category B)
 */
import type { Metadata } from 'next';
import { CardsSponsors } from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sponsors | Digital Marketing Weekend 2026',
  description:
    'Our sponsors and community partners who make Digital Marketing Weekend free to attend.',
};

export default function SponsorsPage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Thank You
          </span>
          <h1 className="text-h1 text-surface-foreground mb-6">Our Sponsors</h1>
          <p className="text-body text-surface-foreground opacity-80">
            Digital Marketing Weekend is completely free to attend thanks to the generosity of our
            sponsors and partners.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-7xl mx-auto">
          {/* Gold */}
          <div className="mb-16">
            <h2 className="text-h2 text-surface-foreground text-center mb-10">
              <span className="text-brand-secondary">Gold</span> Sponsors
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              {['Verdant Digital', 'Spark Advertising'].map((name) => (
                <div
                  key={name}
                  className="w-64 h-32 bg-surface-card rounded-lg border border-surface-border flex items-center justify-center"
                >
                  <span className="text-h4 text-surface-foreground font-bold text-center px-4">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Silver */}
          <div className="mb-16">
            <h2 className="text-h2 text-surface-foreground text-center mb-10">
              <span className="text-surface-muted-foreground">Silver</span> Sponsors
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {['TechEast', 'Sussex Business Hub', 'Coastal Web Co'].map((name) => (
                <div
                  key={name}
                  className="w-48 h-24 bg-surface-card rounded-lg border border-surface-border flex items-center justify-center"
                >
                  <span className="text-body text-surface-foreground font-semibold text-center px-4">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Community */}
          <div className="mb-16">
            <h2 className="text-h2 text-surface-foreground text-center mb-10">
              Community Partners
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Eastbourne Chamber of Commerce', 'East Sussex Growth Hub', 'Digital Brighton'].map(
                (name) => (
                  <div
                    key={name}
                    className="px-6 py-4 bg-surface-card rounded-lg border border-surface-border"
                  >
                    <span className="text-body text-surface-foreground font-medium">{name}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <CardsSponsors />

      <section className="py-16 px-4 bg-brand-primary text-center">
        <h2 className="text-h3 text-surface-foreground mb-4">Want to Sponsor?</h2>
        <a
          href="/call-for-sponsors"
          className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-brand-secondary text-brand-primary font-bold hover:opacity-90 transition-opacity"
        >
          View Sponsorship Packages
        </a>
      </section>
    </main>
  );
}
