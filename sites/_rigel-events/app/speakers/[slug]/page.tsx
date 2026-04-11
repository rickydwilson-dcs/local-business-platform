/**
 * Speaker Bio Page
 * ================
 *
 * Individual speaker bio page with MDX body content.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems, getContentItem } from "@/lib/content";
import { loadMdx } from "@/lib/mdx";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

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

export async function generateStaticParams() {
  const speakers = await getContentItems("speakers");
  return speakers.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getContentItem("speakers", slug);

  if (!result) {
    return { title: "Speaker Not Found" };
  }

  const fm = result.frontmatter as unknown as SpeakerFrontmatter;

  return {
    title: `${fm.name} | Speakers | Digital Marketing Weekend 2026`,
    description: fm.description,
    openGraph: {
      title: `${fm.name} — ${fm.topic}`,
      description: fm.description,
      url: `/speakers/${slug}`,
      type: "website",
    },
  };
}

export default async function SpeakerPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getContentItem("speakers", slug);

  if (!result) {
    notFound();
  }

  const fm = result.frontmatter as unknown as SpeakerFrontmatter;
  const { content: mdxContent } = await loadMdx({ baseDir: "speakers", slug });

  return (
    <div className="min-h-screen bg-surface-background">
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-muted">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-surface-muted-foreground">
            <Link href="/" className="hover:text-brand-primary transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/speakers" className="hover:text-brand-primary transition-colors">
              Speakers
            </Link>
            <span>›</span>
            <span className="text-surface-foreground">{fm.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/speakers"
          className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm hover:underline mb-8 block"
        >
          ← Back to Speakers
        </Link>

        {/* Speaker header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                fm.day === "saturday"
                  ? "bg-brand-primary text-white"
                  : "bg-brand-secondary text-brand-primary"
              }`}
            >
              {fm.day === "saturday" ? "Saturday" : "Sunday"}
            </span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-surface-subtle text-surface-muted-foreground">
              {fm.time} · {fm.stage}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-surface-foreground mb-2">{fm.name}</h1>
          <p className="text-xl text-brand-primary font-semibold mb-2">{fm.title}</p>
          <p className="text-lg text-surface-muted-foreground italic">{fm.topic}</p>
        </div>

        {/* Divider */}
        <div className="w-16 h-1 bg-brand-secondary rounded-full mb-8" />

        {/* Bio body */}
        <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground">
          {mdxContent}
        </div>

        {/* Social links */}
        {(fm.social.twitter || fm.social.linkedin || fm.social.website) && (
          <div className="mt-10 pt-8 border-t border-surface-muted">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-surface-muted-foreground mb-4">
              Connect with {fm.name.split(" ")[0]}
            </h2>
            <div className="flex flex-wrap gap-3">
              {fm.social.twitter && (
                <a
                  href={fm.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-subtle text-surface-foreground font-medium text-sm hover:bg-surface-muted transition-colors"
                >
                  Twitter / X
                </a>
              )}
              {fm.social.linkedin && (
                <a
                  href={fm.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-subtle text-surface-foreground font-medium text-sm hover:bg-surface-muted transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {fm.social.website && (
                <a
                  href={fm.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-subtle text-surface-foreground font-medium text-sm hover:bg-surface-muted transition-colors"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        )}

        {/* Back link footer */}
        <div className="mt-12">
          <Link
            href="/speakers"
            className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm hover:underline"
          >
            ← Back to Speakers
          </Link>
        </div>
      </div>
    </div>
  );
}
