import type { MetadataRoute } from 'next';
import { listMakes } from '@/lib/car-remaps/repository';
import { siteConfig } from '@/site.config';

const BASE_URL = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const makes = await listMakes();

  const indexEntry = {
    url: `${BASE_URL}/car-remaps`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  const makeEntries = makes.map((make) => ({
    url: `${BASE_URL}/car-remaps/${make.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [indexEntry, ...makeEntries];
}
