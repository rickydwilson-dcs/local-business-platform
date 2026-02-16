/**
 * Location Utilities for DJ Fox Electrical
 * Provides location data for the mega-menu dropdown
 */

import { getContentItems } from './content';
import type { CountyGroup } from '@platform/core-components';

/**
 * Get all locations split alphabetically across 4 columns for balanced mega-menu layout
 * Returns data structure for mega-menu dropdown (no region headers, just alphabetical towns)
 */
export async function getAllCounties(): Promise<CountyGroup[]> {
  const locations = await getContentItems('locations');

  // Extract and sort all location names alphabetically
  const allTowns = locations.map((loc) => {
    const breadcrumbs = loc.breadcrumbs as Array<{ title: string; href: string }> | undefined;
    const locationName =
      breadcrumbs?.[breadcrumbs.length - 1]?.title ||
      loc.slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
      name: locationName,
      slug: loc.slug,
      href: `/locations/${loc.slug}`,
      isRichContent: true,
    };
  });

  // Sort alphabetically
  allTowns.sort((a, b) => a.name.localeCompare(b.name));

  // Split into 4 roughly equal chunks for 4-column layout
  const chunkSize = Math.ceil(allTowns.length / 4);
  const chunks: CountyGroup[] = [];

  for (let i = 0; i < 4; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunkTowns = allTowns.slice(start, end);

    if (chunkTowns.length > 0) {
      // Use alphabetical range as internal identifier
      // The mega-menu will show this as the column header
      const firstLetter = chunkTowns[0].name[0];
      const lastLetter = chunkTowns[chunkTowns.length - 1].name[0];
      const columnName = firstLetter === lastLetter ? firstLetter : `${firstLetter}-${lastLetter}`;

      chunks.push({
        name: columnName,
        slug: `column-${i + 1}`,
        href: '/locations',
        towns: chunkTowns,
      });
    }
  }

  return chunks;
}
