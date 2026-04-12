/**
 * RigelSpeakerDetailPage — Individual speaker bio template
 *
 * Displays speaker bio with MDX body, social links, and breadcrumb navigation.
 * MDX content is pre-rendered by the wrapper — passed as a React node.
 */

import Link from "next/link";
import type { RigelSpeakerDetailPageTemplateProps } from "@platform/core-components";

export function RigelSpeakerDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
}: RigelSpeakerDetailPageTemplateProps) {
  return (
    <div className="min-h-screen bg-surface-background">
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-muted">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-surface-muted-foreground" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">›</span>}
                {crumb.current ? (
                  <span className="text-surface-foreground">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-brand-primary transition-colors">
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
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
                frontmatter.day === "saturday"
                  ? "bg-brand-primary text-white"
                  : "bg-brand-secondary text-brand-primary"
              }`}
            >
              {frontmatter.day === "saturday" ? "Saturday" : "Sunday"}
            </span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-surface-subtle text-surface-muted-foreground">
              {frontmatter.time} · {frontmatter.stage}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-surface-foreground mb-2">
            {frontmatter.name}
          </h1>
          <p className="text-xl text-brand-primary font-semibold mb-2">{frontmatter.title}</p>
          <p className="text-lg text-surface-muted-foreground italic">{frontmatter.topic}</p>
        </div>

        {/* Divider */}
        <div className="w-16 h-1 bg-brand-secondary rounded-full mb-8" />

        {/* Bio body */}
        <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground">
          {mdxContent}
        </div>

        {/* Social links */}
        {frontmatter.social &&
          (frontmatter.social.twitter ||
            frontmatter.social.linkedin ||
            frontmatter.social.website) && (
            <div className="mt-10 pt-8 border-t border-surface-muted">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-surface-muted-foreground mb-4">
                Connect with {frontmatter.name.split(" ")[0]}
              </h2>
              <div className="flex flex-wrap gap-3">
                {frontmatter.social.twitter && (
                  <a
                    href={frontmatter.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-subtle text-surface-foreground font-medium text-sm hover:bg-surface-muted transition-colors"
                  >
                    Twitter / X
                  </a>
                )}
                {frontmatter.social.linkedin && (
                  <a
                    href={frontmatter.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-subtle text-surface-foreground font-medium text-sm hover:bg-surface-muted transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {frontmatter.social.website && (
                  <a
                    href={frontmatter.social.website}
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
