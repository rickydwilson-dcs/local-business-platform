/**
 * Call for Sponsors — mirrors colorcode.events/call-for-sponsors/
 */
import type { Metadata } from 'next';
import { CallForSponsorsCTA } from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sponsor Digital Marketing Weekend 2026',
  description:
    'Sponsorship opportunities for Digital Marketing Weekend 2026 in Eastbourne. Reach 300 small business owners and digital marketers.',
};

export default function CallForSponsorsPage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Partner With Us
          </span>
          <h1 className="text-h1 text-surface-foreground mb-6">Sponsorship Opportunities</h1>
          <p className="text-body text-surface-foreground opacity-80">
            Support a free community event and put your brand in front of 300 engaged small business
            owners.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-h2 text-surface-foreground text-center mb-12">Why Sponsor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                tier: 'Gold Sponsor',
                price: '£1,500',
                perks: [
                  'Stage branding',
                  'Speaking slot',
                  'Exhibitor table',
                  'Logo on all materials',
                  'Social media mentions',
                ],
              },
              {
                tier: 'Silver Sponsor',
                price: '£750',
                perks: ['Exhibitor table', 'Logo on materials', 'Social media mentions'],
              },
              {
                tier: 'Community Partner',
                price: 'Contact us',
                perks: ['Logo on website', 'Social media mention', 'Event programme listing'],
              },
            ].map((tier) => (
              <div
                key={tier.tier}
                className="p-8 bg-surface-card rounded-lg border border-surface-border"
              >
                <h3 className="text-h3 text-brand-secondary mb-2">{tier.tier}</h3>
                <p className="text-h4 text-surface-foreground mb-6">{tier.price}</p>
                <ul className="space-y-2">
                  {tier.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-2 text-body text-surface-foreground opacity-80"
                    >
                      <span className="text-brand-secondary">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallForSponsorsCTA
        heading="Interested in Sponsoring?"
        bodyText="Get in touch to discuss your sponsorship package. We are happy to create bespoke arrangements to suit your goals."
        ctaButton={[
          {
            label: 'Get in Touch',
            href: 'mailto:hello@digitalmarketingweekend.co.uk?subject=Sponsorship%20Enquiry',
          },
        ]}
      />
    </main>
  );
}
