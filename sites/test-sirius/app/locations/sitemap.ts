import type { MetadataRoute } from 'next';
import { listSlugs, getPageImage } from '@/lib/mdx';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/site.config';

const BASE_URL = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listSlugs('locations');

  const indexEntry = {
    url: `${BASE_URL}/locations`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  const locationEntries = await Promise.all(
    slugs.map(async (slug) => {
      const heroImage = await getPageImage('locations', slug);
      const imageUrl = heroImage ? getImageUrl(heroImage) : null;

      return {
        url: `${BASE_URL}/locations/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        ...(imageUrl && { images: [imageUrl] }),
      };
    })
  );

  return [indexEntry, ...locationEntries];
}
