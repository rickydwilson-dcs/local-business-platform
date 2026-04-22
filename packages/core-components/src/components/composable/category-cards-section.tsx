import { ImageOverlayCard } from "../ui/image-overlay-card";

interface CategoryItem {
  title: string;
  description?: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  category?: string;
}

interface Category {
  heading: string;
  cards: CategoryItem[];
}

interface CategoryCardsSectionProps {
  layout?: { background?: string };
  data: Record<string, unknown>;
  className?: string;
}

export function CategoryCardsSection({ layout, data, className }: CategoryCardsSectionProps) {
  const background = layout?.background;
  const bg =
    background === "inverse"
      ? "bg-surface-inverse text-white"
      : background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const heading = typeof data.heading === "string" ? data.heading : undefined;
  const subheading = typeof data.subheading === "string" ? data.subheading : undefined;
  const cards = Array.isArray(data.cards) ? (data.cards as CategoryItem[]) : [];
  const categories = Array.isArray(data.categories) ? (data.categories as Category[]) : [];

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="CategoryCardsSection">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        {heading && cards.length > 0 && (
          <div>
            <h2 className="heading-section tracking-tight text-surface-foreground mb-2">
              {heading}
            </h2>
            {subheading && (
              <p className="text-body text-surface-muted-foreground mb-10 max-w-xl">{subheading}</p>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card, j) =>
                card.imageSrc ? (
                  <ImageOverlayCard
                    key={j}
                    imageSrc={card.imageSrc}
                    imageAlt={card.imageAlt ?? card.title}
                    category={card.category}
                    title={card.title}
                    href={card.href}
                  />
                ) : (
                  <a
                    key={j}
                    href={card.href}
                    className="block rounded-lg bg-surface-card border border-surface-subtle p-6 transition-colors hover:border-brand-primary"
                  >
                    <h3 className="heading-card mb-2">{card.title}</h3>
                    {card.description && (
                      <p className="text-body-sm text-surface-muted-foreground">
                        {card.description}
                      </p>
                    )}
                  </a>
                )
              )}
            </div>
          </div>
        )}
        {categories.map((category, i) => (
          <div key={i} className="mb-12">
            <h2 className="heading-section tracking-tight text-surface-foreground mb-6">
              {category.heading}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.cards.map((card, j) =>
                card.imageSrc ? (
                  <ImageOverlayCard
                    key={j}
                    imageSrc={card.imageSrc}
                    imageAlt={card.imageAlt ?? card.title}
                    category={card.category}
                    title={card.title}
                    href={card.href}
                  />
                ) : (
                  <a
                    key={j}
                    href={card.href}
                    className="block rounded-lg bg-surface-card border border-surface-subtle p-6 transition-colors hover:border-brand-primary"
                  >
                    <h3 className="heading-card mb-2">{card.title}</h3>
                    {card.description && (
                      <p className="text-body-sm text-surface-muted-foreground">
                        {card.description}
                      </p>
                    )}
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
