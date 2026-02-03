import Link from 'next/link';

/**
 * Grid item interface
 */
interface GridItem {
  slug: string;
  title: string;
  description?: string;
  href?: string;
  isHeadquarters?: boolean;
  towns?: string[];
}

/**
 * Card grid props
 */
interface CardGridProps {
  /** Array of items to display */
  items: GridItem[];
  /** Base path for links */
  basePath: string;
  /** Link text prefix */
  linkText?: string;
  /** Whether to show placeholder images */
  showPlaceholderImage?: boolean;
  /** Icon type for placeholder */
  imageIcon?: 'location' | 'image';
}

/**
 * Card Grid Component
 *
 * A simple grid of cards with placeholder images.
 * Useful for location listings or simple content grids.
 *
 * @example
 * ```tsx
 * <CardGrid
 *   items={locations}
 *   basePath="/locations"
 *   linkText="View"
 *   imageIcon="location"
 * />
 * ```
 */
export function CardGrid({
  items = [],
  basePath,
  linkText = 'Learn More About',
  showPlaceholderImage = true,
  imageIcon = 'image',
}: CardGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-surface-muted-foreground">
        <p>No items found.</p>
      </div>
    );
  }

  const getIcon = () => {
    if (imageIcon === 'location') {
      return (
        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.slug}
          className="bg-surface-background rounded-lg border border-surface-border overflow-hidden hover:shadow-md transition-shadow relative group"
        >
          {/* Headquarters badge */}
          {item.isHeadquarters && (
            <span className="absolute -top-2 -right-2 px-2 py-1 bg-brand-primary text-brand-on-primary text-xs rounded-full z-10">
              Headquarters
            </span>
          )}

          {/* Placeholder image */}
          {showPlaceholderImage && (
            <div className="h-48 bg-surface-subtle flex items-center justify-center">
              <div className="text-surface-muted text-center">
                {getIcon()}
                <span className="text-sm">
                  {imageIcon === 'location' ? 'Location Image' : 'Image Coming Soon'}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-surface-foreground mb-3">
              <Link
                href={item.href || `${basePath}/${item.slug}`}
                className="hover:text-brand-primary transition-colors"
              >
                {item.title}
              </Link>
            </h2>

            <p className="text-surface-muted-foreground mb-4">
              {item.description || `Learn more about ${item.title.toLowerCase()}.`}
            </p>

            {/* Towns list */}
            {item.towns && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-surface-foreground mb-2">
                  Key Towns & Cities:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {item.towns.map((town, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-surface-subtle text-surface-muted-foreground text-xs rounded border border-surface-border"
                    >
                      {town}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Link */}
            <Link
              href={item.href || `${basePath}/${item.slug}`}
              className="inline-flex items-center text-brand-primary hover:text-brand-primary-hover font-medium"
            >
              {linkText} {item.title} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
