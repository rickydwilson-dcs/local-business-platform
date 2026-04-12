/**
 * Sponsors Page
 *
 * Static sponsor data rendered with corvus theme components.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { PageTitleBanner, CardsSponsors } from "@platform/themes/corvus/components";

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

const goldSponsors = [{ name: "Verdant Digital" }, { name: "Spark Advertising" }];

const silverSponsors = [
  { name: "TechEast" },
  { name: "Sussex Business Hub" },
  { name: "Coastal Web Co" },
];

const communityPartners = [
  { name: "Eastbourne Chamber of Commerce" },
  { name: "East Sussex Growth Hub" },
  { name: "Digital Brighton" },
];

export default function SponsorsPage() {
  return (
    <>
      <PageTitleBanner pageTitle="Sponsors & Partners" />

      {/* Gold Sponsors */}
      <CardsSponsors heading="Gold Sponsors" cards={goldSponsors.map((s) => ({ title: s.name }))} />

      {/* Silver Sponsors */}
      <section className="bg-surface-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-surface-foreground text-center mb-8">
            Silver Sponsors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {silverSponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="bg-surface-card border border-surface-border rounded-xl p-8 text-center"
              >
                <h3 className="text-lg font-bold text-surface-foreground">{sponsor.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Partners */}
      <section className="bg-surface-card py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-surface-foreground text-center mb-8">
            Community Partners
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {communityPartners.map((partner) => (
              <div
                key={partner.name}
                className="bg-surface-background border border-surface-border rounded-xl p-8 text-center"
              >
                <h3 className="text-lg font-bold text-surface-foreground">{partner.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a sponsor CTA */}
      <section className="bg-brand-primary py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-on-brand-primary mb-4">
            Interested in Sponsoring?
          </h2>
          <p className="text-on-brand-primary/80 mb-6">
            Get your brand in front of 300+ digital marketers and business owners.
          </p>
          <a
            href="/contact"
            className="inline-block bg-brand-secondary text-brand-primary font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </>
  );
}
