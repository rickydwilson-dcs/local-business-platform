/**
 * News Index Page
 * ================
 *
 * Lists all published articles from content/news/*.mdx.
 *
 * Deliberately minimal — plain semantic HTML with basic Tailwind, no theme-token
 * polish. Phase 5 rebuilds this with the full "Grid Box" design system; this
 * route's job is correct data plumbing, not final visual design.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllNewsArticles } from '@/lib/news';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and press coverage for NP Racing.',
};

export default async function NewsIndexPage() {
  const articles = await getAllNewsArticles();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">News</h1>
      <div className="mt-8 flex flex-col gap-8">
        {articles.map((article) => (
          <article key={article.slug} className="border-b border-gray-200 pb-8">
            <Link href={`/news/${article.slug}`}>
              <h2 className="text-xl font-semibold hover:underline">{article.title}</h2>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              &middot; {article.sourceName}
            </p>
            <p className="mt-2 text-gray-700">{article.excerpt}</p>
          </article>
        ))}
        {articles.length === 0 && <p className="text-gray-500">No news articles yet.</p>}
      </div>
    </main>
  );
}
