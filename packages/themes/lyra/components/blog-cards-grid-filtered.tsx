/**
 * BlogArticleGrid
 *
 * Displays a filterable grid of blog article cards with category filters, pagination
 * Layout: Category filter tabs row above a 3-column card grid with pagination controls
 * Category: Blog
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface BlogArticleGridProps {
  /** section-heading */
  sectionHeading?: string;
  /** category-filters */
  categoryFilters?: Array<{ label?: string; [key: string]: string | undefined }>;
  /** article-cards */
  articleCards?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    thumbnail?: { src?: string; alt?: string };
    category?: string;
    excerpt?: string;
    authorAvatar?: { src?: string; alt?: string };
    authorName?: string;
    date?: string;
    readTime?: string;
    [key: string]: unknown;
  }>;
  /** pagination */
  pagination?: {
    prevHref?: string;
    nextHref?: string;
    pages?: Array<{ href?: string; label?: string; active?: boolean }>;
  };
}
export function BlogArticleGrid(props: BlogArticleGridProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        {props.sectionHeading && (
          <RevealOnScroll variant="fade-up">
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
                {props.sectionHeading}
              </h2>
            </div>
          </RevealOnScroll>
        )}

        {/* Category Filter Tabs */}
        {props.categoryFilters && props.categoryFilters.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2 justify-center md:justify-start">
            {props.categoryFilters.map(
              (filter: { label?: string; [key: string]: string | undefined }, index: number) => (
                <button
                  key={index}
                  className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary
                    ${
                      index === 0
                        ? "bg-brand-primary text-on-brand-primary border-brand-primary"
                        : "bg-surface-foreground text-surface-muted-foreground border-surface-muted hover:bg-surface-muted hover:text-surface-foreground"
                    }`}
                  aria-pressed={index === 0}
                >
                  {filter?.label ?? ""}
                </button>
              )
            )}
          </div>
        )}

        {/* Article Cards Grid */}
        {props.articleCards && props.articleCards.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {props.articleCards.map((card, index) => (
                <article
                  key={index}
                  className="bg-surface-foreground rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col hover:shadow-md transition-shadow duration-300"
                >
                  {/* Card Thumbnail */}
                  {card?.thumbnail && (
                    <a href={card?.href ?? "#"} className="block overflow-hidden">
                      <img
                        src={card.thumbnail?.src}
                        alt={card.thumbnail?.alt ?? ""}
                        className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </a>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Category Badge */}
                    {card?.category && (
                      <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-wide text-brand-primary bg-surface-muted px-3 py-1 rounded-full self-start">
                        {card.category}
                      </span>
                    )}

                    {/* Title */}
                    {card?.title && (
                      <h3 className="text-lg font-bold text-surface-foreground mb-2 leading-snug">
                        <a
                          href={card?.href ?? "#"}
                          className="hover:text-brand-primary transition-colors duration-200"
                        >
                          {card.title}
                        </a>
                      </h3>
                    )}

                    {/* Excerpt */}
                    {card?.excerpt && (
                      <p className="text-surface-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                        {card.excerpt}
                      </p>
                    )}

                    {/* Meta: Author + Date */}
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-surface-muted">
                      {card?.authorAvatar && (
                        <img
                          src={card.authorAvatar?.src}
                          alt={card.authorAvatar?.alt ?? ""}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className="flex flex-col">
                        {card?.authorName && (
                          <span className="text-xs font-semibold text-surface-foreground">
                            {card.authorName}
                          </span>
                        )}
                        {card?.date && (
                          <span className="text-xs text-surface-muted-foreground">{card.date}</span>
                        )}
                      </div>
                      {card?.readTime && (
                        <span className="ml-auto text-xs text-surface-muted-foreground">
                          {card.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </RevealOnScroll>
        )}

        {/* Pagination Controls */}
        {props.pagination && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {/* Previous Button */}
            {props.pagination.prevHref && (
              <a
                href={props.pagination.prevHref}
                aria-label="Previous page"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-surface-muted text-surface-muted-foreground hover:bg-surface-muted hover:text-surface-foreground transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </a>
            )}

            {/* Page Numbers */}
            {props.pagination.pages &&
              props.pagination.pages.map((page, index) => (
                <a
                  key={index}
                  href={page?.href ?? "#"}
                  aria-label={`Page ${page?.label}`}
                  aria-current={page?.active ? "page" : undefined}
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium border transition-colors duration-200
                    ${
                      page?.active
                        ? "bg-brand-primary text-on-brand-primary border-brand-primary"
                        : "border-surface-muted text-surface-muted-foreground hover:bg-surface-muted hover:text-surface-foreground"
                    }`}
                >
                  {page?.label}
                </a>
              ))}

            {/* Next Button */}
            {props.pagination.nextHref && (
              <a
                href={props.pagination.nextHref}
                aria-label="Next page"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-surface-muted text-surface-muted-foreground hover:bg-surface-muted hover:text-surface-foreground transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
