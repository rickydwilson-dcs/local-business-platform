import type { MetadataRoute } from 'next';
import { listSlugs, loadMdx } from '@/lib/mdx';
import { NewsFrontmatterSchema } from '@/lib/schemas/news';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/site.config';

const BASE_URL = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listSlugs('news');

  const indexEntry = {
    url: `${BASE_URL}/news`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  };

  const newsEntries = (
    await Promise.all(
      slugs.map(async (slug) => {
        const { frontmatter: raw } = await loadMdx({ baseDir: 'news', slug });
        const frontmatter = NewsFrontmatterSchema.parse(raw);

        if (frontmatter.draft) {
          return null;
        }

        const imageUrl = frontmatter.heroImage ? getImageUrl(frontmatter.heroImage.src) : null;

        return {
          url: `${BASE_URL}/news/${slug}`,
          lastModified: new Date(frontmatter.publishedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          ...(imageUrl && { images: [imageUrl] }),
        };
      })
    )
  ).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return [indexEntry, ...newsEntries];
}
