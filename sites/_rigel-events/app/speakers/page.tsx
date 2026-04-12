/**
 * Speakers Listing Page
 *
 * Fetches speaker MDX content and renders a grid using corvus theme components.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems } from "@/lib/content";
import { siteConfig } from "@/site.config";
import { PageTitleBanner } from "@platform/themes/corvus/components";

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
  imageAlt?: string;
  social?: { twitter?: string; linkedin?: string; website?: string };
}

export default async function SpeakersPage() {
  const items = await getContentItems("speakers");

  const speakers = items
    .map((item) => {
      const fm = item as unknown as SpeakerFrontmatter;
      return {
        slug: item.slug,
        name: fm.name,
        title: fm.title,
        topic: fm.topic,
        description: fm.description,
        day: fm.day,
        time: fm.time,
        stage: fm.stage,
        featured: fm.featured,
        imageAlt: fm.imageAlt,
        social: fm.social,
      };
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.day !== b.day) return a.day === "saturday" ? -1 : 1;
      return a.time.localeCompare(b.time);
    });

  return (
    <>
      <PageTitleBanner pageTitle="Speakers" />

      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-surface-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Meet the practitioners and specialists sharing what actually works in digital marketing.
          </p>

          {speakers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-muted-foreground text-lg">
                Speaker announcements coming soon. Check back for updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((speaker) => (
                <Link
                  key={speaker.slug}
                  href={`/speakers/${speaker.slug}`}
                  className="group bg-surface-card border border-surface-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {speaker.featured && (
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                    <span className="text-xs font-medium uppercase tracking-wider text-brand-secondary">
                      {speaker.day === "saturday" ? "Saturday" : "Sunday"} &middot; {speaker.time}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-surface-foreground mb-1 group-hover:text-brand-primary transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-sm text-surface-muted-foreground mb-2">{speaker.title}</p>
                  <p className="text-brand-primary font-semibold text-sm mb-3">{speaker.topic}</p>
                  <p className="text-surface-muted-foreground text-sm line-clamp-3">
                    {speaker.description}
                  </p>
                  <div className="mt-4 text-xs text-surface-muted-foreground">{speaker.stage}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-primary py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-on-brand-primary mb-4">
            Want to hear these speakers live?
          </h2>
          <a
            href={siteConfig.cta.primary.href}
            className="inline-block bg-brand-secondary text-brand-primary font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Get Your Free Ticket
          </a>
        </div>
      </section>
    </>
  );
}
