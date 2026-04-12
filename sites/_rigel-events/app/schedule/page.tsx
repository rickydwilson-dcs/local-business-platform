/**
 * Schedule Page
 *
 * Static session data with corvus theme components for the two-day layout.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { PageTitleBanner, StatsSchedule } from "@platform/themes/corvus/components";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Schedule | Digital Marketing Weekend 2026",
  description:
    "The full weekend schedule for Digital Marketing Weekend 2026 at the Winter Garden, Eastbourne. Saturday 17 and Sunday 18 October.",
  openGraph: {
    title: "Schedule | Digital Marketing Weekend 2026",
    description: "Two days of sessions, workshops, and networking.",
    url: "/schedule",
    type: "website",
  },
};

interface ScheduleSession {
  time: string;
  title: string;
  stage: string;
  speaker: string | null;
  day: "saturday" | "sunday";
}

const sessions: ScheduleSession[] = [
  // Saturday
  {
    time: "09:00",
    title: "Registration & Welcome Coffee",
    stage: "Foyer",
    speaker: null,
    day: "saturday",
  },
  {
    time: "09:30",
    title: "The Small Business Marketing Stack: What Actually Works in 2026",
    stage: "Main Stage",
    speaker: "Ricky Wilson",
    day: "saturday",
  },
  {
    time: "11:00",
    title: "Local SEO in 2026: What's Changed and What Still Works",
    stage: "Main Stage",
    speaker: "Sarah Chen",
    day: "saturday",
  },
  { time: "12:30", title: "Lunch Break", stage: "Terrace", speaker: null, day: "saturday" },
  {
    time: "14:00",
    title: "Email Isn't Dead: Building a List That Actually Converts",
    stage: "Workshop Room",
    speaker: "Emily Thornton",
    day: "saturday",
  },
  {
    time: "14:00",
    title: "Social Media for Service Businesses",
    stage: "Main Stage",
    speaker: "Guest Speaker TBA",
    day: "saturday",
  },
  {
    time: "15:30",
    title: "Panel: Marketing on a Shoestring Budget",
    stage: "Main Stage",
    speaker: "All Speakers",
    day: "saturday",
  },
  {
    time: "17:00",
    title: "Networking Drinks",
    stage: "Terrace Bar",
    speaker: null,
    day: "saturday",
  },

  // Sunday
  { time: "09:30", title: "Doors Open & Coffee", stage: "Foyer", speaker: null, day: "sunday" },
  {
    time: "10:00",
    title: "Getting ROI from Google & Meta Ads on a Small Budget",
    stage: "Main Stage",
    speaker: "Marcus Okafor",
    day: "sunday",
  },
  {
    time: "11:30",
    title: "AI-Powered Marketing: Tools You Can Use Today",
    stage: "Main Stage",
    speaker: "James Hartley",
    day: "sunday",
  },
  { time: "13:00", title: "Lunch Break", stage: "Terrace", speaker: null, day: "sunday" },
  {
    time: "14:00",
    title: "Workshop: Build Your 90-Day Marketing Plan",
    stage: "Workshop Room",
    speaker: "Ricky Wilson",
    day: "sunday",
  },
  {
    time: "14:00",
    title: "Video & Reels for Local Businesses",
    stage: "Main Stage",
    speaker: "Guest Speaker TBA",
    day: "sunday",
  },
  {
    time: "15:30",
    title: "Closing Keynote: The Future of Local Marketing",
    stage: "Main Stage",
    speaker: "All Speakers",
    day: "sunday",
  },
  { time: "16:30", title: "Close & Networking", stage: "Foyer", speaker: null, day: "sunday" },
];

export default function SchedulePage() {
  const saturdaySessions = sessions.filter((s) => s.day === "saturday");
  const sundaySessions = sessions.filter((s) => s.day === "sunday");

  return (
    <>
      <PageTitleBanner pageTitle="Schedule" />

      <StatsSchedule
        heading="Weekend Overview"
        statItems={[
          { title: "2", description: "Full Days" },
          { title: "10+", description: "Speakers" },
          { title: "20+", description: "Sessions" },
          { title: "2", description: "Stages" },
        ]}
      />

      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Saturday */}
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-6 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-brand-secondary" />
                Saturday 17 October
              </h2>
              <div className="space-y-4">
                {saturdaySessions.map((session, idx) => (
                  <div
                    key={`sat-${idx}`}
                    className="bg-surface-card border border-surface-border rounded-lg p-4 flex gap-4"
                  >
                    <div className="flex-shrink-0 w-16 text-center">
                      <span className="text-brand-primary font-mono font-bold text-sm">
                        {session.time}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-surface-foreground">{session.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-sm text-surface-muted-foreground">
                        <span>{session.stage}</span>
                        {session.speaker && (
                          <>
                            <span>&middot;</span>
                            <span className="text-brand-primary">{session.speaker}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sunday */}
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-6 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-brand-accent" />
                Sunday 18 October
              </h2>
              <div className="space-y-4">
                {sundaySessions.map((session, idx) => (
                  <div
                    key={`sun-${idx}`}
                    className="bg-surface-card border border-surface-border rounded-lg p-4 flex gap-4"
                  >
                    <div className="flex-shrink-0 w-16 text-center">
                      <span className="text-brand-primary font-mono font-bold text-sm">
                        {session.time}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-surface-foreground">{session.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-sm text-surface-muted-foreground">
                        <span>{session.stage}</span>
                        {session.speaker && (
                          <>
                            <span>&middot;</span>
                            <span className="text-brand-primary">{session.speaker}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href={siteConfig.cta.primary.href}
              className="inline-block bg-brand-primary text-on-brand-primary font-bold px-8 py-3 rounded-lg hover:bg-brand-primary-hover transition-colors"
            >
              Get Your Free Ticket
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
