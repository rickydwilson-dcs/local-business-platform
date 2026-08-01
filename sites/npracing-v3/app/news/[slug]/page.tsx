/**
 * News Detail Page
 * ================
 *
 * Individual news article with MDX content rendering.
 * Minimal server-rendered article view — visual design lands in a later phase.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { listSlugs, loadMdx } from '@/lib/mdx';
import { NewsFrontmatterSchema } from '@/lib/schemas/news';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await listSlugs('news');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { frontmatter: raw } = await loadMdx({ baseDir: 'news', slug });
    const frontmatter = NewsFrontmatterSchema.parse(raw);

    return {
      title: `${frontmatter.title} | ${siteConfig.business.name}`,
      description: frontmatter.excerpt,
      alternates: {
        canonical: absUrl(`/news/${slug}`),
      },
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.excerpt,
        url: absUrl(`/news/${slug}`),
        siteName: siteConfig.business.name,
        type: 'article',
        publishedTime: frontmatter.publishedAt,
      },
    };
  } catch {
    return { title: 'Not Found' };
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const slugs = await listSlugs('news');
  if (!slugs.includes(slug)) {
    notFound();
  }

  const { frontmatter: raw, content } = await loadMdx({ baseDir: 'news', slug });
  const frontmatter = NewsFrontmatterSchema.parse(raw);

  if (frontmatter.draft) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface-background">
      <article className="section-standard">
        <div className="container-narrow">
          <Link href="/news" className="text-sm text-brand-primary hover:underline">
            &larr; Back to News
          </Link>

          <header className="mt-4 mb-8">
            <time dateTime={frontmatter.publishedAt} className="text-sm text-surface-tertiary">
              {new Date(frontmatter.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            <h1 className="heading-hero mt-2">{frontmatter.title}</h1>
            <p className="text-body-lg">{frontmatter.excerpt}</p>
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-surface-tertiary bg-surface-subtle border border-surface-border rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose max-w-none text-surface-foreground">{content}</div>

          <footer className="mt-8 pt-6 border-t border-surface-border text-sm text-surface-tertiary">
            Source:{' '}
            <a
              href={frontmatter.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-brand-primary hover:underline"
            >
              {frontmatter.sourceName}
            </a>
          </footer>
        </div>
      </article>
    </div>
  );
}
