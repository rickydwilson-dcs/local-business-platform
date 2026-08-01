import Link from 'next/link';
import type { NewsArticle } from '@/lib/schemas/news';
import { PageHead } from '@/components/sections/page-head';
import { ArrowTextLink } from '@/components/sections/arrow-link';

/**
 * NewsIndexPage — the Grid Box news listing.
 *
 * Cards are rendered entirely from content/news/*.mdx frontmatter. Each entry
 * carries a source attribution (this is coverage published elsewhere, not
 * original reporting) and links both to the on-site article and out to the
 * original report.
 */
export interface NewsIndexPageProps {
  articles: NewsArticle[];
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatFull(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function NewsIndexPage({ articles }: NewsIndexPageProps) {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <PageHead
        eyebrow="News"
        title="From the paddock, via the BSB press office."
        lede="A roundup of official British Superbike coverage on NPRacing — team news and results, with links back to the full articles."
      />

      <section className="container-grid py-16">
        <h2 className="sr-only">Latest articles</h2>

        {articles.length === 0 ? (
          <p className="text-surface-secondary-foreground">No news articles yet.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {articles.map((article) => (
              <li key={article.slug}>
                <article className="grid grid-cols-1 gap-6 rounded-card border border-surface-card-border bg-surface-card p-8 transition-colors duration-300 hover:border-brand-primary sm:grid-cols-[9rem_1fr]">
                  <div className="flex flex-col gap-1">
                    <time
                      dateTime={article.publishedAt}
                      className="font-heading text-2xl leading-none text-brand-accent"
                    >
                      {formatDay(article.publishedAt)}
                    </time>
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-surface-tertiary-foreground">
                      {article.sourceName}
                    </span>
                    <span className="sr-only">Published {formatFull(article.publishedAt)}</span>
                  </div>

                  <div>
                    <h3 className="text-h3 text-surface-foreground">
                      <Link
                        href={`/news/${article.slug}`}
                        className="transition-colors hover:text-brand-accent"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-3 max-w-[70ch] leading-relaxed text-surface-secondary-foreground">
                      {article.excerpt}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-6">
                      <ArrowTextLink href={`/news/${article.slug}`}>Read on site</ArrowTextLink>
                      <ArrowTextLink
                        href={article.sourceUrl}
                        external
                        externalLabel={`Read the original report at ${article.sourceName}`}
                        className="text-surface-secondary-foreground"
                      >
                        {article.sourceName}
                      </ArrowTextLink>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
