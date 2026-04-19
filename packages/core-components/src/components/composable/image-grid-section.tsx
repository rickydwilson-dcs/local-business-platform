import Image from "next/image";
import Link from "next/link";
import type { LayoutParams } from "./layout-params";

export interface ImageGridSectionSlots {
  showCategoryBadge: boolean;
  showTitle: boolean;
  showArrow: boolean;
}

export const IMAGE_GRID_SECTION_DEFAULT_SLOTS: ImageGridSectionSlots = {
  showCategoryBadge: true,
  showTitle: true,
  showArrow: true,
};

interface ImageGridCard {
  imageSrc: string;
  imageAlt: string;
  category?: string;
  title: string;
  href?: string;
}

interface ImageGridSectionProps {
  slots?: Partial<ImageGridSectionSlots>;
  layout?: Pick<LayoutParams, "columns" | "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function ImageGridSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: ImageGridSectionProps) {
  const slots = { ...IMAGE_GRID_SECTION_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;

  const bg =
    layout?.background === "subtle"
      ? "bg-surface-subtle text-surface-foreground"
      : "bg-surface-background text-surface-foreground";

  const cols = layout?.columns ?? 3;
  const gridCols =
    cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const cards = Array.isArray(data.cards) ? (data.cards as ImageGridCard[]) : [];

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="ImageGridSection">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {d.heading && (
          <h2 data-slot="heading" className="text-h2 mb-12 text-center">
            {d.heading}
          </h2>
        )}
        <div className={`grid gap-6 ${gridCols}`}>
          {cards.map((card, i) => {
            const content = (
              <>
                <div className="relative aspect-[16/9] overflow-hidden md:aspect-[4/5]">
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    {slots.showCategoryBadge && card.category && (
                      <span
                        data-slot="categoryBadge"
                        className="bg-brand-primary mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs text-white"
                      >
                        {card.category}
                      </span>
                    )}
                    {slots.showTitle && (
                      <h3 data-slot="cardTitle" className="text-xl font-bold text-white">
                        {card.title}
                      </h3>
                    )}
                    {slots.showArrow && (
                      <span data-slot="arrow" className="mt-2 text-sm text-white/80">
                        View More →
                      </span>
                    )}
                  </div>
                </div>
              </>
            );

            const baseClass = "group relative block overflow-hidden rounded-xl";

            return card.href ? (
              <Link key={i} href={card.href} className={baseClass}>
                {content}
              </Link>
            ) : (
              <div key={i} className={baseClass}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
