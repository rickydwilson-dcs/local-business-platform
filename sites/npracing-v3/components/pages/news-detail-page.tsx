import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listSlugs, loadMdx } from '@/lib/mdx';
import { NewsFrontmatterSchema } from '@/lib/schemas/news';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/site.config';
import { SectionTag } from '@/components/ui/section-tag';
import { ArrowRightIcon, ExternalLinkIcon } from '@/components/ui/icons';

/**
 * NewsDetailPage — single article in the "Number 51" editorial treatment.
 *
 * Self-loading: hand it a slug and it resolves the MDX record itself, so the
 * route file stays a thin wrapper. Unknown or draft slugs fall through to
 * `notFound()`.
 */
export interface NewsDetailPageProps {
  slug: string;
}

const PROSE_CLASSES = [
  'prose prose-invert max-w-none',
  'prose-headings:font-sans prose-headings:font-extrabold prose-headings:uppercase',
  'prose-headings:tracking-[0.06em] prose-headings:text-surface-foreground',
  'prose-p:text-body prose-p:text-surface-secondary',
  'prose-li:text-surface-secondary prose-strong:text-surface-foreground',
  'prose-a:text-brand-accent prose-blockquote:border-l-brand-primary',
  'prose-blockquote:text-surface-foreground prose-blockquote:not-italic',
].join(' ');

export async function NewsDetailPage({ slug }: NewsDetailPageProps) {
  const slugs = await listSlugs('news');
  if (!slugs.includes(slug)) {
    notFound();
  }

  const { frontmatter: raw, content } = await loadMdx({ baseDir: 'news', slug });
  const frontmatter = NewsFrontmatterSchema.parse(raw);

  if (frontmatter.draft) {
    notFound();
  }

  const publishedLabel = new Date(frontmatter.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article>
      <header className="border-b border-surface-card-border pb-12 pt-16">
        <div className="mx-auto w-full max-w-[80rem] px-6">
          <SectionTag>News</SectionTag>
          <h1 className="mt-5 max-w-[22ch] text-h1 uppercase text-surface-foreground">
            {frontmatter.title}
          </h1>
          <p className="mt-4 max-w-[60ch] text-body text-surface-secondary">
            {frontmatter.excerpt}
          </p>
          <p className="mt-4 text-caption uppercase text-surface-tertiary">
            <time dateTime={frontmatter.publishedAt}>{publishedLabel}</time> ·{' '}
            {frontmatter.sourceName ?? siteConfig.name}
          </p>
        </div>
      </header>

      {frontmatter.heroImage && (
        <div className="mx-auto w-full max-w-[80rem] px-6 pt-12">
          {/* object-contain (not cover) + a bounded height: hero images vary between
              landscape action shots and portrait paddock photos, and cropping either
              to a fixed banner ratio loses real content. Letterboxing on
              bg-surface-card shows the whole image regardless of its aspect ratio. */}
          <div className="relative h-[24rem] border border-surface-card-border bg-surface-card sm:h-[32rem]">
            <Image
              src={getImageUrl(frontmatter.heroImage.src)}
              alt={frontmatter.heroImage.alt}
              fill
              sizes="100vw"
              className="object-contain grayscale-[0.1]"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[46rem] px-6 py-14">
        <div className={PROSE_CLASSES}>{content}</div>

        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
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

        <footer className="mt-10 border-t border-surface-card-border pt-6">
          {frontmatter.sourceUrl && frontmatter.sourceName && (
            <p className="text-small text-surface-tertiary">
              Original report by{' '}
              <a
                href={frontmatter.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 font-semibold text-brand-accent underline underline-offset-2"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
                {frontmatter.sourceName}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          )}

          <Link
            href="/news"
            className="group mt-6 inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.05em] text-surface-foreground"
          >
            All news
            <ArrowRightIcon className="h-3.5 w-3.5 text-brand-accent transition-transform duration-slow group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Link>
        </footer>
      </div>
    </article>
  );
}
