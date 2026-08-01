/**
 * News Index Page
 * ================
 *
 * Lists all published race/team news articles, newest first.
 * Minimal server-rendered listing — visual design lands in a later phase.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { listSlugs, loadMdx } from '@/lib/mdx';
import { NewsFrontmatterSchema, type NewsFrontmatter } from '@/lib/schemas/news';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `News | ${siteConfig.business.name}`,
  description: `Latest race reports, team announcements, and rider news from ${siteConfig.business.name}.`,
  alternates: {
    canonical: absUrl('/news'),
  },
};

async function getNewsArticles() {
  const slugs = await listSlugs('news');

  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await loadMdx({ baseDir: 'news', slug });
      return { slug, frontmatter: NewsFrontmatterSchema.parse(frontmatter) };
    })
  );

  return articles
    .filter(({ frontmatter }) => !frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    );
}

export default async function NewsIndexPage() {
  const articles = await getNewsArticles();

  return (
    <div className="min-h-screen bg-surface-background">
      <section className="section-standard">
        <div className="container-standard">
          <h1 className="heading-hero">News</h1>
          <p className="text-body-lg mb-8">
            Race reports, team announcements, and rider news from {siteConfig.business.name}.
          </p>

          {articles.length === 0 ? (
            <p className="text-surface-foreground">No news articles yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map(
                ({ slug, frontmatter }: { slug: string; frontmatter: NewsFrontmatter }) => (
                  <article
                    key={slug}
                    className="border border-surface-border rounded-lg p-6 bg-surface-card"
                  >
                    <time
                      dateTime={frontmatter.publishedAt}
                      className="text-sm text-surface-tertiary"
                    >
                      {new Date(frontmatter.publishedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <h2 className="heading-card mt-2">
                      <Link
                        href={`/news/${slug}`}
                        className="hover:text-brand-primary transition-colors"
                      >
                        {frontmatter.title}
                      </Link>
                    </h2>
                    <p className="text-surface-foreground">{frontmatter.excerpt}</p>
                    <p className="text-sm text-surface-tertiary mt-3">
                      Source: {frontmatter.sourceName}
                    </p>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
