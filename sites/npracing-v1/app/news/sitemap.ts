import type { MetadataRoute } from 'next';
import { getAllNewsArticles } from '@/lib/news';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/site.config';

const BASE_URL = siteConfig.url;

/**
 * News sitemap — /news/sitemap.xml
 *
 * `getAllNewsArticles()` already excludes `draft: true` records (see
 * lib/news.ts), so no additional filtering is needed here.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllNewsArticles();

  const indexEntry = {
    url: `${BASE_URL}/news`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  };

  const articleEntries = articles.map((article) => {
    const imageUrl = article.heroImage ? getImageUrl(article.heroImage.src) : null;

    return {
      url: `${BASE_URL}/news/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      ...(imageUrl && { images: [imageUrl] }),
    };
  });

  return [indexEntry, ...articleEntries];
}
