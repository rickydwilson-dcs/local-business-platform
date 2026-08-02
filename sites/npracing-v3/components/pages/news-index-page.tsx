import Link from 'next/link';
import { listSlugs, loadMdx } from '@/lib/mdx';
import { NewsFrontmatterSchema, type NewsFrontmatter } from '@/lib/schemas/news';
import { PageHead } from '@/components/sections/page-head';
import { ArrowRightIcon, ExternalLinkIcon } from '@/components/ui/icons';

/**
 * NewsIndexPage — "Number 51" news listing.
 *
 * Stacked hairline rows with a big red date in the left rail, per
 * news-03-number51.html. Article titles link to the on-site detail route
 * (`/news/<slug>`); the original source is a separate, clearly-marked external
 * link so the two destinations are never confused.
 */
interface NewsEntry {
  slug: string;
  frontmatter: NewsFrontmatter;
}

async function getNewsArticles(): Promise<NewsEntry[]> {
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

function formatDayMonth(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    .toUpperCase();
}

export async function NewsIndexPage() {
  const articles = await getNewsArticles();

  return (
    <>
      <PageHead
        tag="News"
        heading="Straight from the BSB paddock."
        lede="A roundup of official British Superbike coverage on NP Racing — team news and results, with links back to the full articles."
      />

      <section aria-label="News articles" className="py-14">
        <div className="mx-auto w-full max-w-[80rem] px-6">
          {articles.length === 0 ? (
            <p className="text-body text-surface-secondary">
              No news articles yet — check back soon.
            </p>
          ) : (
            <ul className="border border-surface-card-border">
              {articles.map(({ slug, frontmatter }) => (
                <li
                  key={slug}
                  className="grid gap-6 border-b border-surface-card-border p-8 last:border-b-0 md:grid-cols-[8rem_1fr] md:p-10"
                >
                  <div className="flex flex-col gap-1.5">
                    <time
                      dateTime={frontmatter.publishedAt}
                      className="font-heading text-3xl leading-none text-brand-accent"
                    >
                      {formatDayMonth(frontmatter.publishedAt)}
                    </time>
                    <span className="text-caption uppercase text-surface-tertiary">
                      {new Date(frontmatter.publishedAt).getFullYear()} · {frontmatter.sourceName}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-sans text-xl font-extrabold leading-tight text-surface-foreground">
                      <Link
                        href={`/news/${slug}`}
                        className="transition-colors duration-normal hover:text-brand-accent"
                      >
                        {frontmatter.title}
                      </Link>
                    </h2>

                    <p className="mt-3 max-w-[70ch] text-body text-surface-secondary">
                      {frontmatter.excerpt}
                    </p>

                    {frontmatter.tags && frontmatter.tags.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {frontmatter.tags.map((tag) => (
                          <li
                            key={tag}
                            className="border border-surface-subtle px-2.5 py-1 text-caption uppercase text-surface-tertiary"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-6">
                      <Link
                        href={`/news/${slug}`}
                        className="group inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.05em] text-surface-foreground"
                      >
                        Read on site
                        <ArrowRightIcon className="h-3.5 w-3.5 text-brand-accent transition-transform duration-slow group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                      </Link>

                      <a
                        href={frontmatter.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.05em] text-surface-tertiary hover:text-surface-foreground"
                      >
                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                        {frontmatter.sourceName}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
