import { ContentCard } from './content-card';

/**
 * Content item interface matching the content.ts exports
 */
export interface ContentItem {
  slug: string;
  title: string;
  description?: string;
  badge?: string;
  image?: string;
  heroImage?: string;
  features?: string[];
  towns?: string[];
  subtitle?: string[];
  isHeadquarters?: boolean;
  [key: string]: unknown;
}

/**
 * Content grid props
 */
interface ContentGridProps {
  /** Array of content items */
  items: ContentItem[];
  /** Base path for links */
  basePath: string;
  /** Message to show when empty */
  emptyMessage?: string;
  /** Fallback description generator */
  fallbackDescription?: (title: string) => string;
  /** Content type for card styling */
  contentType?: 'services' | 'locations';
}

/**
 * Content Grid Component
 *
 * Displays a responsive grid of content cards.
 * Automatically handles empty states and fallback descriptions.
 *
 * @example
 * ```tsx
 * <ContentGrid
 *   items={services}
 *   basePath="/services"
 *   contentType="services"
 *   emptyMessage="No services available."
 * />
 * ```
 */
export function ContentGrid({
  items,
  basePath,
  emptyMessage = 'No items found.',
  fallbackDescription,
  contentType = 'services',
}: ContentGridProps) {
  if (items.length === 0) {
    return <p className="text-surface-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ContentCard
          key={item.slug}
          title={item.title}
          description={item.description}
          href={`${basePath}/${item.slug}`}
          fallbackDescription={fallbackDescription?.(item.title)}
          badge={item.badge as string}
          image={(item.image as string) || (item.heroImage as string)}
          features={item.features as string[]}
          towns={item.towns as string[]}
          subtitle={item.subtitle as string[]}
          isHeadquarters={item.isHeadquarters as boolean}
          contentType={contentType}
        />
      ))}
    </div>
  );
}
