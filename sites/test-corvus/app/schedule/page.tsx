/**
 * Schedule Page (Category B) — two-column Sat/Sun layout
 */
import type { Metadata } from 'next';
import { StatsSaturday, StatsSchedule } from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Schedule | Digital Marketing Weekend 2026',
  description:
    'The full weekend schedule for Digital Marketing Weekend 2026. Saturday 17 and Sunday 18 October at the Winter Garden, Eastbourne.',
};

const saturdaySessions = [
  { time: '09:00', title: 'Registration & Welcome Coffee', stage: 'Foyer', speaker: null },
  {
    time: '09:30',
    title: 'The Small Business Marketing Stack: What Actually Works in 2026',
    stage: 'Main Stage',
    speaker: 'Ricky Wilson',
  },
  {
    time: '11:00',
    title: "Local SEO in 2026: What's Changed and What Still Works",
    stage: 'Main Stage',
    speaker: 'Sarah Chen',
  },
  { time: '12:30', title: 'Lunch Break', stage: 'Terrace', speaker: null },
  {
    time: '14:00',
    title: "Email Isn't Dead: Building a List That Actually Converts",
    stage: 'Workshop Room',
    speaker: 'Emily Thornton',
  },
  {
    time: '14:00',
    title: 'Social Media for Service Businesses',
    stage: 'Main Stage',
    speaker: 'Guest Speaker TBA',
  },
  {
    time: '15:30',
    title: 'Panel: Marketing on a Shoestring Budget',
    stage: 'Main Stage',
    speaker: 'All Speakers',
  },
  { time: '17:00', title: 'Networking Drinks', stage: 'Terrace Bar', speaker: null },
];

const sundaySessions = [
  { time: '09:30', title: 'Doors Open & Coffee', stage: 'Foyer', speaker: null },
  {
    time: '10:00',
    title: 'Getting ROI from Google & Meta Ads on a Small Budget',
    stage: 'Main Stage',
    speaker: 'Marcus Okafor',
  },
  {
    time: '11:30',
    title: 'AI-Powered Marketing: Tools You Can Use Today',
    stage: 'Main Stage',
    speaker: 'James Hartley',
  },
  { time: '13:00', title: 'Lunch Break', stage: 'Terrace', speaker: null },
  {
    time: '14:00',
    title: 'Workshop: Build Your 90-Day Marketing Plan',
    stage: 'Workshop Room',
    speaker: 'Ricky Wilson',
  },
  {
    time: '14:00',
    title: 'Video & Reels for Local Businesses',
    stage: 'Main Stage',
    speaker: 'Guest Speaker TBA',
  },
  {
    time: '15:30',
    title: 'Closing Keynote: The Future of Local Marketing',
    stage: 'Main Stage',
    speaker: 'All Speakers',
  },
  { time: '16:30', title: 'Close & Networking', stage: 'Foyer', speaker: null },
];

function SessionRow({
  time,
  title,
  stage,
  speaker,
}: {
  time: string;
  title: string;
  stage: string;
  speaker: string | null;
}) {
  const isBreak = speaker === null;
  return (
    <div
      className={`flex gap-4 p-4 rounded-lg border ${isBreak ? 'border-surface-border bg-surface-muted opacity-60' : 'border-surface-border bg-surface-card'}`}
    >
      <div className="flex-shrink-0 w-16 text-right">
        <span className="text-small font-semibold text-brand-secondary">{time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-surface-foreground leading-snug mb-1">{title}</p>
        <p className="text-small text-surface-muted-foreground">
          {stage}
          {speaker ? ` · ${speaker}` : ''}
        </p>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Full Programme
          </span>
          <h1 className="text-h1 text-surface-foreground mb-6">Weekend Schedule</h1>
          <p className="text-body text-surface-foreground opacity-80">
            17–18 October 2026 · Winter Garden, Eastbourne
          </p>
        </div>
      </section>

      <StatsSchedule />
      <StatsSaturday />

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Saturday */}
            <div>
              <h2 className="text-h2 text-surface-foreground mb-8">Saturday 17 October</h2>
              <div className="space-y-3">
                {saturdaySessions.map((s, i) => (
                  <SessionRow key={i} {...s} />
                ))}
              </div>
            </div>

            {/* Sunday */}
            <div>
              <h2 className="text-h2 text-surface-foreground mb-8">Sunday 18 October</h2>
              <div className="space-y-3">
                {sundaySessions.map((s, i) => (
                  <SessionRow key={i} {...s} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-brand-primary text-center">
        <h2 className="text-h3 text-surface-foreground mb-4">Save Your Spot</h2>
        <a
          href="https://www.eventbrite.co.uk/e/digital-marketing-weekend-2026"
          className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-brand-secondary text-brand-primary font-bold hover:opacity-90 transition-opacity"
        >
          Get Free Tickets
        </a>
      </section>
    </main>
  );
}
