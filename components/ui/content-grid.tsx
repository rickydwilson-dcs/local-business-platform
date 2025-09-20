// components/ui/content-grid.tsx
import { ContentCard } from "./content-card";
import type { ContentItem } from "@/lib/content";

interface ContentGridProps {
  items: ContentItem[];
  basePath: string;
  emptyMessage?: string;
  fallbackDescription?: (title: string) => string;
  contentType?: "services" | "locations";
}

export function ContentGrid({
  items,
  basePath,
  emptyMessage = "No items found.",
  fallbackDescription,
  contentType = "services",
}: ContentGridProps) {
  if (items.length === 0) {
    return <p className="text-gray-800">{emptyMessage}</p>;
  }

  return (
    <div className="grid-responsive grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
