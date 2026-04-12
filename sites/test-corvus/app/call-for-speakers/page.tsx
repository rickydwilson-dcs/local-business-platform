/**
 * Call for Speakers — mirrors colorcode.events/call-for-speakers/
 */
import type { Metadata } from 'next';
import { CallForSpeakersCTA } from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Call for Speakers | Digital Marketing Weekend 2026',
  description:
    'Share your expertise at Digital Marketing Weekend 2026. We are looking for speakers on digital marketing, SEO, social media, email, paid ads, and AI tools.',
};

export default function CallForSpeakersPage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Speak at DMW
          </span>
          <h1 className="text-h1 text-surface-foreground mb-6">Call for Speakers</h1>
          <p className="text-body text-surface-foreground opacity-80">
            Share your expertise with 300 small business owners and marketers at our free two-day
            event in Eastbourne.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 text-surface-foreground mb-8">What We Are Looking For</h2>
          <ul className="space-y-4 mb-12">
            {[
              'Practical, actionable sessions on digital marketing topics',
              'SEO, social media, email marketing, paid advertising, AI tools',
              'Case studies and real-world examples',
              'Workshops with takeaway resources',
              'No sales pitches — practical value only',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-brand-secondary font-bold text-lg leading-relaxed">→</span>
                <span className="text-body text-surface-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CallForSpeakersCTA
        heading="Ready to Share Your Expertise?"
        bodyText="Submit your talk proposal and we will be in touch. All levels of experience welcome — we value real practitioners over polished presenters."
        ctaButton={[
          {
            label: 'Submit a Talk Proposal',
            href: 'mailto:hello@digitalmarketingweekend.co.uk?subject=Speaker%20Proposal',
          },
        ]}
      />
    </main>
  );
}
