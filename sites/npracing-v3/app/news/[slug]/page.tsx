/**
 * News article route
 *
 * Thin wrapper: static params and the not-found gate for unknown/draft
 * slugs live here, but rendering is delegated to
 * `components/pages/news-detail-page.tsx`'s `NewsDetailPage`, which
 * resolves the MDX record itself from the slug.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { listSlugs, loadMdx } from '@/lib/mdx';
import { NewsFrontmatterSchema } from '@/lib/schemas/news';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';
import { NewsDetailPage } from '@/components/pages/news-detail-page';

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

    if (frontmatter.draft) {
      return { title: 'Not Found' };
    }

    const ogImages = frontmatter.heroImage
      ? [
          {
            url: getImageUrl(frontmatter.heroImage.src),
            width: frontmatter.heroImage.width,
            height: frontmatter.heroImage.height,
            alt: frontmatter.heroImage.alt,
          },
        ]
      : undefined;

    return {
      title: frontmatter.title,
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
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.title,
        description: frontmatter.excerpt,
        images: ogImages?.map((image) => image.url),
      },
    };
  } catch {
    return { title: 'Not Found' };
  }
}

export default async function NewsArticleRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const slugs = await listSlugs('news');
  if (!slugs.includes(slug)) {
    notFound();
  }

  const { frontmatter: raw } = await loadMdx({ baseDir: 'news', slug });
  const frontmatter = NewsFrontmatterSchema.parse(raw);

  if (frontmatter.draft) {
    notFound();
  }

  return <NewsDetailPage slug={slug} />;
}
