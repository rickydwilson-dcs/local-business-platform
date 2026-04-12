/**
 * Call for Volunteers — mirrors colorcode.events/call-for-volunteers/
 */
import type { Metadata } from 'next';
import { CallForVolunteersCTA } from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Volunteer at Digital Marketing Weekend 2026',
  description:
    'Volunteer at Digital Marketing Weekend 2026. Help run a free community event and gain experience in event management.',
};

export default function CallForVolunteersPage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Get Involved
          </span>
          <h1 className="text-h1 text-surface-foreground mb-6">Volunteer With Us</h1>
          <p className="text-body text-surface-foreground opacity-80">
            Help us deliver a fantastic free event for the Eastbourne business community.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 text-surface-foreground mb-8">What Volunteers Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {[
              {
                role: 'Registration Desk',
                desc: 'Welcome attendees and manage check-in both days.',
              },
              {
                role: 'Stage Management',
                desc: 'Assist speakers and manage session timing on stage.',
              },
              { role: 'Venue Support', desc: 'Help direct attendees around the Winter Garden.' },
              { role: 'Social Media', desc: 'Live coverage and photography during the event.' },
            ].map((r) => (
              <div
                key={r.role}
                className="p-6 bg-surface-card rounded-lg border border-surface-border"
              >
                <h3 className="text-h4 text-brand-secondary mb-2">{r.role}</h3>
                <p className="text-body text-surface-foreground opacity-80">{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="p-6 bg-surface-inverse rounded-lg">
            <h3 className="text-h3 text-surface-foreground mb-3">What You Get</h3>
            <ul className="space-y-2">
              {[
                'Free entry to all sessions',
                'Volunteer t-shirt',
                'Lunch both days',
                'Networking with 300 attendees',
                'Certificate of volunteering',
              ].map((perk) => (
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
        </div>
      </section>

      <CallForVolunteersCTA
        heading="Ready to Help?"
        bodyText="We would love to have you on the team. Get in touch and tell us which roles interest you."
        ctaButton={[
          {
            label: 'Apply to Volunteer',
            href: 'mailto:hello@digitalmarketingweekend.co.uk?subject=Volunteering',
          },
        ]}
      />
    </main>
  );
}
