import type { ReactElement } from 'react';
import Image from 'next/image';
import type { NewsArticle } from '@/lib/schemas/news';
import { Eyebrow } from '@/components/sections/eyebrow';
import { ArrowTextLink } from '@/components/sections/arrow-link';

/**
 * NewsDetailPage — a single article, rendered from content/news/<slug>.mdx.
 *
 * The body is the compiled MDX element supplied by lib/news.ts; the source
 * attribution and outbound link are mandatory, since these records summarise
 * coverage published by third parties.
 */
export interface NewsDetailPageProps {
  article: NewsArticle;
  /** Compiled MDX body from lib/news.ts. */
  body: ReactElement;
}

export function NewsDetailPage({ article, body }: NewsDetailPageProps) {
  const published = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <article className="container-grid max-w-[52rem] pb-20 pt-16 sm:pt-20">
        <ArrowTextLink href="/news" className="text-surface-secondary-foreground">
          Back to news
        </ArrowTextLink>

        <header className="mt-8">
          <Eyebrow>{article.sourceName}</Eyebrow>
          <h1 className="mt-4 text-h1 uppercase italic text-surface-foreground">{article.title}</h1>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.1em] text-surface-tertiary-foreground">
            <time dateTime={article.publishedAt}>{published}</time>
            {' · '}
            Source: {article.sourceName}
          </p>
        </header>

        {article.heroImage && (
          <Image
            src={article.heroImage.src}
            alt={article.heroImage.alt}
            width={article.heroImage.width}
            height={article.heroImage.height}
            sizes="(min-width: 1024px) 52rem, 100vw"
            className="mt-8 w-full rounded-card border border-surface-card-border object-cover"
          />
        )}

        <div className="prose-grid-box mt-10">{body}</div>

        <footer className="mt-12 border-t border-surface-card-border pt-6">
          <ArrowTextLink
            href={article.sourceUrl}
            external
            externalLabel={`Read the original report at ${article.sourceName}`}
          >
            Read the full story at {article.sourceName}
          </ArrowTextLink>
        </footer>
      </article>
    </>
  );
}
