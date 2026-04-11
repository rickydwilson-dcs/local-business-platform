/**
 * RigelSponsorsPage — Sponsors and partners template
 *
 * Displays gold sponsors, silver sponsors, community partners,
 * and a sponsorship enquiry CTA.
 * All sponsor data passed as props.
 */

import Link from "next/link";
import type { RigelSponsorsPageTemplateProps } from "@platform/core-components";

export interface SponsorEntry {
  name: string;
  url?: string;
  logoUrl?: string;
}

export interface RigelSponsorsPageProps extends RigelSponsorsPageTemplateProps {
  goldSponsors?: SponsorEntry[];
  silverSponsors?: SponsorEntry[];
  communityPartners?: SponsorEntry[];
}

function SponsorBox({
  sponsor,
  tier,
}: {
  sponsor: SponsorEntry;
  tier: "gold" | "silver" | "partner";
}) {
  const classes =
    tier === "gold"
      ? "bg-surface-subtle border-2 border-brand-primary rounded-lg p-8 flex items-center justify-center font-bold text-brand-primary text-xl"
      : tier === "silver"
        ? "bg-surface-subtle border border-brand-primary rounded-lg p-6 flex items-center justify-center font-semibold text-brand-primary text-base"
        : "bg-surface-subtle border border-surface-muted rounded-lg p-5 flex items-center justify-center font-medium text-surface-foreground text-sm text-center";

  const content = sponsor.name;

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${classes} hover:opacity-80 transition-opacity`}
      >
        {content}
      </a>
    );
  }

  return <div className={classes}>{content}</div>;
}

export function RigelSponsorsPage({
  siteConfig,
  goldSponsors = [],
  silverSponsors = [],
  communityPartners = [],
}: RigelSponsorsPageProps) {
  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header */}
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Sponsors &amp; Partners
          </h1>
          <p className="text-lg text-white opacity-90 max-w-2xl mx-auto">
            {siteConfig.name} is completely free to attend thanks to the generous support of our
            sponsors and community partners.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Gold Sponsors */}
        {goldSponsors.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-surface-foreground mb-8 text-center">
              Gold Sponsors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {goldSponsors.map((sponsor) => (
                <SponsorBox key={sponsor.name} sponsor={sponsor} tier="gold" />
              ))}
            </div>
          </section>
        )}

        {/* Silver Sponsors */}
        {silverSponsors.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-surface-foreground mb-8 text-center">
              Silver Sponsors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {silverSponsors.map((sponsor) => (
                <SponsorBox key={sponsor.name} sponsor={sponsor} tier="silver" />
              ))}
            </div>
          </section>
        )}

        {/* Community Partners */}
        {communityPartners.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-surface-foreground mb-8 text-center">
              Community Partners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {communityPartners.map((partner) => (
                <SponsorBox key={partner.name} sponsor={partner} tier="partner" />
              ))}
            </div>
          </section>
        )}

        {/* Become a Sponsor CTA */}
        <section className="bg-brand-primary rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Interested in Sponsoring?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Reach hundreds of small business owners and digital marketers. Contact us to discuss
            sponsorship packages.
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
