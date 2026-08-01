/**
 * News Detail Page
 * ================
 *
 * Individual news article, rendered from content/news/<slug>.mdx.
 *
 * Deliberately minimal — plain semantic HTML with basic Tailwind, no theme-token
 * polish. Phase 5 rebuilds this with the full "Grid Box" design system; this
 * route's job is correct data plumbing, not final visual design.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { listNewsSlugs, loadNewsArticle } from '@/lib/news';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await listNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadNewsArticle(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.excerpt,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await loadNewsArticle(slug);

  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm">
        <Link href="/news" className="hover:underline">
          &larr; Back to News
        </Link>
      </p>
      <article className="mt-6">
        <header>
          <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {new Date(frontmatter.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}{' '}
            &middot; Source: {frontmatter.sourceName}
          </p>
        </header>
        <div className="prose mt-6 max-w-none">{content}</div>
        <p className="mt-8 text-sm">
          <a href={frontmatter.sourceUrl} target="_blank" rel="noopener noreferrer">
            Read the original report at {frontmatter.sourceName}
          </a>
        </p>
      </article>
    </main>
  );
}
