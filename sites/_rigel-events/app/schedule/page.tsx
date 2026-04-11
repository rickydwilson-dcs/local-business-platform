/**
 * Schedule Page
 * =============
 *
 * Static weekend schedule for Digital Marketing Weekend 2026.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/site.config";

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

interface Session {
  time: string;
  title: string;
  stage: string;
  speaker: string | null;
}

const saturday: Session[] = [
  { time: "09:00", title: "Registration & Welcome Coffee", stage: "Foyer", speaker: null },
  {
    time: "09:30",
    title: "The Small Business Marketing Stack: What Actually Works in 2026",
    stage: "Main Stage",
    speaker: "Ricky Wilson",
  },
  {
    time: "11:00",
    title: "Local SEO in 2026: What's Changed and What Still Works",
    stage: "Main Stage",
    speaker: "Sarah Chen",
  },
  { time: "12:30", title: "Lunch Break", stage: "Terrace", speaker: null },
  {
    time: "14:00",
    title: "Email Isn't Dead: Building a List That Actually Converts",
    stage: "Workshop Room",
    speaker: "Emily Thornton",
  },
  {
    time: "14:00",
    title: "Social Media for Service Businesses",
    stage: "Main Stage",
    speaker: "Guest Speaker TBA",
  },
  {
    time: "15:30",
    title: "Panel: Marketing on a Shoestring Budget",
    stage: "Main Stage",
    speaker: "All Speakers",
  },
  { time: "17:00", title: "Networking Drinks", stage: "Terrace Bar", speaker: null },
];

const sunday: Session[] = [
  { time: "09:30", title: "Doors Open & Coffee", stage: "Foyer", speaker: null },
  {
    time: "10:00",
    title: "Getting ROI from Google & Meta Ads on a Small Budget",
    stage: "Main Stage",
    speaker: "Marcus Okafor",
  },
  {
    time: "11:30",
    title: "AI-Powered Marketing: Tools You Can Use Today",
    stage: "Main Stage",
    speaker: "James Hartley",
  },
  { time: "13:00", title: "Lunch Break", stage: "Terrace", speaker: null },
  {
    time: "14:00",
    title: "Workshop: Build Your 90-Day Marketing Plan",
    stage: "Workshop Room",
    speaker: "Ricky Wilson",
  },
  {
    time: "14:00",
    title: "Video & Reels for Local Businesses",
    stage: "Main Stage",
    speaker: "Guest Speaker TBA",
  },
  {
    time: "15:30",
    title: "Closing Keynote: The Future of Local Marketing",
    stage: "Main Stage",
    speaker: "All Speakers",
  },
  { time: "16:30", title: "Close & Networking", stage: "Foyer", speaker: null },
];

function stageBadgeClass(stage: string): string {
  if (stage === "Main Stage") return "bg-brand-primary text-white";
  if (stage === "Workshop Room") return "bg-brand-secondary text-brand-primary";
  return "bg-surface-subtle text-surface-foreground";
}

function SessionRow({ session }: { session: Session }) {
  const isBreak = session.speaker === null;
  return (
    <div
      className={`flex items-start gap-4 py-4 border-b border-surface-muted last:border-0 ${isBreak ? "opacity-60" : ""}`}
    >
      {/* Time */}
      <div className="flex-shrink-0 w-14">
        <span className="inline-block bg-surface-subtle text-surface-foreground text-xs font-bold px-2 py-1 rounded">
          {session.time}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium leading-snug ${isBreak ? "text-surface-muted-foreground" : "text-surface-foreground"}`}
        >
          {session.title}
        </p>
        {session.speaker && (
          <p className="text-sm text-surface-muted-foreground mt-0.5">{session.speaker}</p>
        )}
      </div>

      {/* Stage badge */}
      <div className="flex-shrink-0">
        <span
          className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${stageBadgeClass(session.stage)}`}
        >
          {session.stage}
        </span>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header */}
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Weekend Schedule</h1>
          <p className="text-lg text-white opacity-90">
            17–18 October 2026 · The Winter Garden, Eastbourne
          </p>
        </div>
      </section>

      {/* Schedule Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Saturday */}
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-6 pb-3 border-b-2 border-brand-primary">
                Saturday 17 October
              </h2>
              <div>
                {saturday.map((session, index) => (
                  <SessionRow key={index} session={session} />
                ))}
              </div>
            </div>

            {/* Sunday */}
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-6 pb-3 border-b-2 border-brand-secondary">
                Sunday 18 October
              </h2>
              <div>
                {sunday.map((session, index) => (
                  <SessionRow key={index} session={session} />
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href="https://www.eventbrite.co.uk/e/digital-marketing-weekend-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Tickets — Free
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
