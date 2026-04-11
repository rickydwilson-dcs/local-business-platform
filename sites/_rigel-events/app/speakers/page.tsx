/**
 * Speakers Listing Page
 * =====================
 *
 * Displays all speakers at Digital Marketing Weekend.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems } from "@/lib/content";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Speakers | Digital Marketing Weekend 2026",
  description:
    "Meet the speakers at Digital Marketing Weekend 2026. Hear from practitioners and specialists across digital marketing, SEO, paid ads, email, and AI tools.",
  openGraph: {
    title: "Speakers | Digital Marketing Weekend 2026",
    description: "Practitioners and specialists sharing what actually works in digital marketing.",
    url: "/speakers",
    type: "website",
  },
};

interface SpeakerFrontmatter {
  name: string;
  slug: string;
  title: string;
  topic: string;
  description: string;
  day: "saturday" | "sunday";
  time: string;
  stage: string;
  featured: boolean;
  imageAlt: string;
  social: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export default async function SpeakersPage() {
  const items = await getContentItems("speakers");

  // Sort: featured first, then by day (saturday before sunday), then by time
  const speakers = items
    .map((item) => ({ ...item, fm: item.frontmatter as SpeakerFrontmatter }))
    .sort((a, b) => {
      if (a.fm.featured && !b.fm.featured) return -1;
      if (!a.fm.featured && b.fm.featured) return 1;
      if (a.fm.day !== b.fm.day) return a.fm.day === "saturday" ? -1 : 1;
      return a.fm.time.localeCompare(b.fm.time);
    });

  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header */}
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet the Speakers</h1>
          <p className="text-lg text-white opacity-90 max-w-2xl mx-auto">
            Hear from practitioners and specialists across digital marketing, SEO, paid ads, email,
            and AI tools.
          </p>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map(({ fm, slug }) => (
              <div
                key={slug}
                className="bg-surface-background border border-surface-muted rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
              >
                {/* Day badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      fm.day === "saturday"
                        ? "bg-brand-primary text-white"
                        : "bg-brand-secondary text-brand-primary"
                    }`}
                  >
                    {fm.day === "saturday" ? "Saturday" : "Sunday"}
                  </span>
                  {fm.featured && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-surface-subtle text-surface-foreground">
                      Featured
                    </span>
                  )}
                </div>

                {/* Speaker info */}
                <div>
                  <h2 className="text-xl font-bold text-surface-foreground">{fm.name}</h2>
                  <p className="text-sm text-surface-muted-foreground mt-1">{fm.title}</p>
                </div>

                {/* Topic */}
                <p className="text-surface-foreground font-medium leading-snug">{fm.topic}</p>

                {/* Time + Stage */}
                <p className="text-sm text-surface-muted-foreground">
                  {fm.time} · {fm.stage}
                </p>

                {/* Link */}
                <Link
                  href={`/speakers/${slug}`}
                  className="mt-auto inline-flex items-center gap-1 text-brand-primary font-semibold text-sm hover:underline"
                >
                  Read Bio →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
