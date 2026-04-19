interface CategoryItem {
  title: string;
  description?: string;
  href: string;
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
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  const categories = data.categories as Category[] | undefined;

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="CategoryCardsSection">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {categories?.map((category, i) => (
          <section key={i} className="mb-12">
            <h2 className="text-h2 mb-6">{category.heading}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.cards.map((card, j) => (
                <a
                  key={j}
                  href={card.href}
                  className="block rounded-lg bg-surface-subtle p-6 transition-colors hover:bg-surface-hover"
                >
                  <h3 className="text-h4 mb-2">{card.title}</h3>
                  {card.description && (
                    <p className="text-surface-muted-foreground text-sm">{card.description}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
