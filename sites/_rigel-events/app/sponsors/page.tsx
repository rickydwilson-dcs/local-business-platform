/**
 * Sponsors Page
 * =============
 *
 * Sponsors and community partners for Digital Marketing Weekend 2026.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Sponsors | Digital Marketing Weekend 2026",
  description:
    "Our sponsors and community partners who make Digital Marketing Weekend free to attend.",
  openGraph: {
    title: "Sponsors | Digital Marketing Weekend 2026",
    description: "Sponsors and partners supporting Digital Marketing Weekend 2026.",
    url: "/sponsors",
    type: "website",
  },
};

const goldSponsors = ["Verdant Digital", "Spark Advertising"];

const silverSponsors = ["TechEast", "Sussex Business Hub", "Coastal Web Co"];

const communityPartners = [
  "Eastbourne Chamber of Commerce",
  "East Sussex Growth Hub",
  "Digital Brighton",
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header */}
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Sponsors & Partners
          </h1>
          <p className="text-lg text-white opacity-90 max-w-2xl mx-auto">
            Digital Marketing Weekend is completely free to attend thanks to the generous support of
            our sponsors and community partners.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Gold Sponsors */}
        <section>
          <h2 className="text-2xl font-bold text-surface-foreground mb-8 text-center">
            Gold Sponsors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {goldSponsors.map((name) => (
              <div
                key={name}
                className="bg-surface-subtle border-2 border-brand-primary rounded-lg p-8 flex items-center justify-center font-bold text-brand-primary text-xl"
              >
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* Silver Sponsors */}
        <section>
          <h2 className="text-2xl font-bold text-surface-foreground mb-8 text-center">
            Silver Sponsors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {silverSponsors.map((name) => (
              <div
                key={name}
                className="bg-surface-subtle border border-brand-primary rounded-lg p-6 flex items-center justify-center font-semibold text-brand-primary text-base"
              >
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* Community Partners */}
        <section>
          <h2 className="text-2xl font-bold text-surface-foreground mb-8 text-center">
            Community Partners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {communityPartners.map((name) => (
              <div
                key={name}
                className="bg-surface-subtle border border-surface-muted rounded-lg p-5 flex items-center justify-center font-medium text-surface-foreground text-sm text-center"
              >
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* Become a Sponsor CTA */}
        <section className="bg-brand-primary rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Interested in Sponsoring?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Reach 300+ small business owners and digital marketers. Sponsorship packages from £500.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-secondary text-brand-primary font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
          >
            Enquire About Sponsoring
          </Link>
        </section>
      </div>
    </div>
  );
}
