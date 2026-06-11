/**
 * FilteredCardsGrid
 *
 * Filterable grid of cards (case studies or blog articles) with category filter tabs, card image, tags, title, description, author and pagination
 * Layout: Category filter tabs row above a multi-column card grid with pagination controls
 * Category: Cards
 */
export interface FilteredCardsGridProps {
  /** section-heading */
  sectionHeading?: string;
  /** filter-tabs */
  filterTabs?: string;
  /** card-image */
  cardImage?: { src?: string; alt?: string };
  /** card-tags */
  cardTags?: string;
  /** card-title */
  cardTitle?: string;
  /** card-description */
  cardDescription?: string;
  /** card-author */
  cardAuthor?: string;
  /** pagination */
  pagination?: string;
}
export function FilteredCardsGrid(props: FilteredCardsGridProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">Cards</p>
        <h2 className="text-h2 text-surface-foreground mb-4">FilteredCardsGrid</h2>
        <p className="text-body text-surface-secondary-foreground">
          Filterable grid of cards (case studies or blog articles) with category filter tabs, card
          image, tags, title, description, author and pagination
        </p>
      </div>
    </section>
  );
}
