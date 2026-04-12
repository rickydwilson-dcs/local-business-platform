/**
 * Speakers Listing Page (Category B)
 */
import type { Metadata } from 'next';
import { StatsSpeakers } from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Speakers | Digital Marketing Weekend 2026',
  description:
    'Meet the speakers at Digital Marketing Weekend 2026. Industry experts sharing practical digital marketing insights.',
};

const speakers = [
  {
    name: 'Ricky Wilson',
    role: 'Small Business Marketing Strategist',
    slug: 'ricky-wilson',
    topic: 'The Small Business Marketing Stack: What Actually Works in 2026',
  },
  {
    name: 'Sarah Chen',
    role: 'SEO Consultant',
    slug: 'sarah-chen',
    topic: "Local SEO in 2026: What's Changed and What Still Works",
  },
  {
    name: 'Emily Thornton',
    role: 'Email Marketing Specialist',
    slug: 'emily-thornton',
    topic: "Email Isn't Dead: Building a List That Actually Converts",
  },
  {
    name: 'Marcus Okafor',
    role: 'Paid Advertising Expert',
    slug: 'marcus-okafor',
    topic: 'Getting ROI from Google & Meta Ads on a Small Budget',
  },
  {
    name: 'James Hartley',
    role: 'AI & Marketing Tools',
    slug: 'james-hartley',
    topic: 'AI-Powered Marketing: Tools You Can Use Today',
  },
];

export default function SpeakersPage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Our Experts
          </span>
          <h1 className="text-h1 text-surface-foreground mb-6">2026 Speakers</h1>
          <p className="text-body text-surface-foreground opacity-80">
            10+ industry experts sharing practical, actionable insights across two days.
          </p>
        </div>
      </section>

      <StatsSpeakers />

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker) => (
              <a
                key={speaker.slug}
                href={`/speakers/${speaker.slug}`}
                className="block p-8 bg-surface-card rounded-lg border border-surface-border hover:border-brand-secondary transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center mb-6">
                  <span className="text-h3 text-brand-secondary font-bold">
                    {speaker.name.charAt(0)}
                  </span>
                </div>
                <h2 className="text-h4 text-surface-foreground mb-1 group-hover:text-brand-secondary transition-colors">
                  {speaker.name}
                </h2>
                <p className="text-small text-brand-secondary mb-4">{speaker.role}</p>
                <p className="text-body text-surface-foreground opacity-70 text-sm">
                  {speaker.topic}
                </p>
              </a>
            ))}

            {/* TBA speaker */}
            <div className="p-8 bg-surface-card rounded-lg border border-surface-border opacity-60">
              <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-6">
                <span className="text-h3 text-surface-muted-foreground font-bold">?</span>
              </div>
              <h2 className="text-h4 text-surface-foreground mb-1">More Speakers TBA</h2>
              <p className="text-small text-surface-muted-foreground mb-4">
                Announcements coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-brand-primary text-center">
        <h2 className="text-h3 text-surface-foreground mb-4">Want to Speak?</h2>
        <a
          href="/call-for-speakers"
          className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-brand-secondary text-brand-primary font-bold hover:opacity-90 transition-opacity"
        >
          Submit a Talk Proposal
        </a>
      </section>
    </main>
  );
}
