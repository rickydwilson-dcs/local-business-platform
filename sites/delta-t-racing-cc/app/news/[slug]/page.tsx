/**
 * News Detail route
 * =================
 *
 * Individual news article, rendered from content/news/<slug>.mdx.
 *
 * The route's job is data plumbing and metadata only; presentation is the Grid
 * Box `NewsDetailPage` component (Phase 5), which replaced the placeholder
 * markup this file previously carried.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listNewsSlugs, loadNewsArticle } from '@/lib/news';
import { absUrl } from '@/lib/site';
import { NewsDetailPage } from '@/components/pages/news-detail-page';

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
    alternates: {
      canonical: absUrl(`/news/${slug}`),
    },
  };
}

export default async function NewsDetailRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await loadNewsArticle(slug);

  if (!article) {
    notFound();
  }

  return <NewsDetailPage article={article.frontmatter} body={article.content} />;
}
