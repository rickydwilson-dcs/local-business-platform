/**
 * CardsAllTypesOfWorkClothing
 *
 * Cards section: All types of work clothing
 * Layout: contained
 * Category: Cards
 */

export interface CardsAllTypesOfWorkClothingProps {
  /** heading */
  heading?: string;
  /** cards */
  cards?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** cardImages */
  cardImages?: Array<{ src?: string; alt?: string }>;
}

export function CardsAllTypesOfWorkClothing(props: CardsAllTypesOfWorkClothingProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
            {props.heading ?? "All Types of Work Clothing"}
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {props.cards && props.cards.length > 0
            ? props.cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                >
                  {/* Card Image */}
                  {props.cardImages && props.cardImages[index] ? (
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img
                        src={props.cardImages[index]?.src}
                        alt={props.cardImages[index]?.alt ?? card.title ?? "Work clothing category"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-surface-muted flex items-center justify-center">
                      <span className="text-surface-muted-foreground text-sm">No image</span>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1">
                    {card.title && (
                      <h3 className="text-lg font-semibold text-surface-foreground mb-1">
                        {card.title}
                      </h3>
                    )}
                    {card.description && (
                      <p className="text-surface-muted-foreground text-sm mb-4 flex-1">
                        {card.description}
                      </p>
                    )}
                    {card.href && (
                      <a
                        href={card.href}
                        className="mt-auto inline-block text-center bg-brand-primary text-on-brand-primary text-sm font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-200"
                      >
                        {card.label ?? "Shop Now"}
                      </a>
                    )}
                  </div>
                </div>
              ))
            : // Fallback placeholder cards
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="w-full aspect-square bg-surface-muted" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-4 bg-surface-muted rounded w-3/4" />
                    <div className="h-3 bg-surface-muted rounded w-full" />
                    <div className="h-3 bg-surface-muted rounded w-5/6" />
                    <div className="h-8 bg-surface-muted rounded mt-2" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
