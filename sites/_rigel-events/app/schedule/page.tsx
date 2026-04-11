/**
 * Schedule Page — thin wrapper
 *
 * Static session data lives here. Delegates rendering to RigelSchedulePage.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import type { SiteConfigSummary } from "@platform/core-components";
import { RigelSchedulePage } from "@platform/themes/rigel/pages";
import type { ScheduleSession } from "@platform/themes/rigel/pages";

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

const sessions: ScheduleSession[] = [
  // Saturday
  { time: "09:00", title: "Registration & Welcome Coffee", stage: "Foyer", speaker: null, day: "saturday" },
  { time: "09:30", title: "The Small Business Marketing Stack: What Actually Works in 2026", stage: "Main Stage", speaker: "Ricky Wilson", day: "saturday" },
  { time: "11:00", title: "Local SEO in 2026: What's Changed and What Still Works", stage: "Main Stage", speaker: "Sarah Chen", day: "saturday" },
  { time: "12:30", title: "Lunch Break", stage: "Terrace", speaker: null, day: "saturday" },
  { time: "14:00", title: "Email Isn't Dead: Building a List That Actually Converts", stage: "Workshop Room", speaker: "Emily Thornton", day: "saturday" },
  { time: "14:00", title: "Social Media for Service Businesses", stage: "Main Stage", speaker: "Guest Speaker TBA", day: "saturday" },
  { time: "15:30", title: "Panel: Marketing on a Shoestring Budget", stage: "Main Stage", speaker: "All Speakers", day: "saturday" },
  { time: "17:00", title: "Networking Drinks", stage: "Terrace Bar", speaker: null, day: "saturday" },

  // Sunday
  { time: "09:30", title: "Doors Open & Coffee", stage: "Foyer", speaker: null, day: "sunday" },
  { time: "10:00", title: "Getting ROI from Google & Meta Ads on a Small Budget", stage: "Main Stage", speaker: "Marcus Okafor", day: "sunday" },
  { time: "11:30", title: "AI-Powered Marketing: Tools You Can Use Today", stage: "Main Stage", speaker: "James Hartley", day: "sunday" },
  { time: "13:00", title: "Lunch Break", stage: "Terrace", speaker: null, day: "sunday" },
  { time: "14:00", title: "Workshop: Build Your 90-Day Marketing Plan", stage: "Workshop Room", speaker: "Ricky Wilson", day: "sunday" },
  { time: "14:00", title: "Video & Reels for Local Businesses", stage: "Main Stage", speaker: "Guest Speaker TBA", day: "sunday" },
  { time: "15:30", title: "Closing Keynote: The Future of Local Marketing", stage: "Main Stage", speaker: "All Speakers", day: "sunday" },
  { time: "16:30", title: "Close & Networking", stage: "Foyer", speaker: null, day: "sunday" },
];

export default function SchedulePage() {
  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone ?? "",
    phoneDisplay: siteConfig.business.phone ?? "",
    address: {
      city: siteConfig.business.address.city,
      county: siteConfig.business.address.region,
    },
    cta: siteConfig.cta,
    stats: siteConfig.credentials.stats,
  };

  return (
    <RigelSchedulePage
      siteConfig={siteSummary}
      sessions={sessions}
      ticketUrl={siteConfig.cta.primary.href}
      eventDateSaturday="Saturday 17 October"
      eventDateSunday="Sunday 18 October"
    />
  );
}
