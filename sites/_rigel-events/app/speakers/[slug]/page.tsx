/**
 * Speaker Bio Page
 *
 * Loads speaker data + MDX content, renders with corvus theme layout.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContentItems, getContentItem } from "@/lib/content";
import { loadMdx } from "@/lib/mdx";
import { siteConfig } from "@/site.config";
import { PageTitleBanner } from "@platform/themes/corvus/components";

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
  imageAlt?: string;
  social?: { twitter?: string; linkedin?: string; website?: string };
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

  const speakerSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fm.name,
    jobTitle: fm.title,
    description: fm.description,
    url: `${siteConfig.url}/speakers/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakerSchema) }}
      />

      <PageTitleBanner pageTitle={fm.name} />

      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-surface-muted-foreground">
            <Link href="/" className="hover:text-brand-primary transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/speakers" className="hover:text-brand-primary transition-colors">
              Speakers
            </Link>
            <span className="mx-2">/</span>
            <span className="text-surface-foreground">{fm.name}</span>
          </nav>

          {/* Speaker info header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {fm.featured && (
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded">
                  Featured Speaker
                </span>
              )}
              <span className="text-sm font-medium text-brand-secondary uppercase tracking-wider">
                {fm.day === "saturday" ? "Saturday" : "Sunday"} &middot; {fm.time} &middot;{" "}
                {fm.stage}
              </span>
            </div>
            <p className="text-surface-muted-foreground text-lg">{fm.title}</p>
            <p className="text-brand-primary font-semibold text-lg mt-2">{fm.topic}</p>
          </div>

          {/* Social links */}
          {fm.social && (
            <div className="flex gap-4 mb-8">
              {fm.social.twitter && (
                <a
                  href={fm.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-primary-hover transition-colors text-sm font-medium"
                >
                  Twitter
                </a>
              )}
              {fm.social.linkedin && (
                <a
                  href={fm.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-primary-hover transition-colors text-sm font-medium"
                >
                  LinkedIn
                </a>
              )}
              {fm.social.website && (
                <a
                  href={fm.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-primary-hover transition-colors text-sm font-medium"
                >
                  Website
                </a>
              )}
            </div>
          )}

          {/* MDX content */}
          <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary">
            {mdxContent}
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-surface-border">
            <Link
              href="/speakers"
              className="text-brand-primary font-semibold hover:text-brand-primary-hover transition-colors"
            >
              &larr; Back to all speakers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
