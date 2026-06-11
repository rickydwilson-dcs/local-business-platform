/**
 * BlogArticleGrid
 *
 * Displays a filterable grid of blog article cards with category filter tabs and pagination
 * Layout: Category filter tabs row above a 3-column card grid with pagination below
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
    [key: string]: string | undefined;
  }>;
  /** pagination */
  pagination?: Array<{
    label?: string;
    href?: string;
    active?: string;
    [key: string]: string | undefined;
  }>;
}
export function BlogArticleGrid(props: BlogArticleGridProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        {props.sectionHeading && (
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-primary">
                {props.sectionHeading}
              </h2>
            </div>
          </RevealOnScroll>
        )}

        {/* Category Filter Tabs */}
        {props.categoryFilters && props.categoryFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {props.categoryFilters.map((filter, index) => (
              <button
                key={index}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  index === 0
                    ? "bg-brand-primary text-on-brand-primary border-brand-primary"
                    : "bg-surface-foreground text-surface-muted-foreground border-surface-muted hover:bg-brand-primary hover:text-on-brand-primary hover:border-brand-primary"
                }`}
              >
                {filter?.label ?? ""}
              </button>
            ))}
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
                  {card?.image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title ?? ""}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Category Badge */}
                    {card?.category && (
                      <span className="inline-block text-xs font-semibold uppercase tracking-wide text-brand-accent mb-3">
                        {card.category}
                      </span>
                    )}

                    {/* Article Title */}
                    {card?.title && (
                      <h3 className="text-lg font-bold text-surface-foreground mb-2 leading-snug">
                        {card.title}
                      </h3>
                    )}

                    {/* Article Excerpt */}
                    {card?.excerpt && (
                      <p className="text-sm text-surface-muted-foreground mb-4 flex-1 leading-relaxed">
                        {card.excerpt}
                      </p>
                    )}

                    {/* Meta: Author & Date */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-muted">
                      {card?.author && (
                        <span className="text-xs text-surface-muted-foreground font-medium">
                          {card.author}
                        </span>
                      )}
                      {card?.date && (
                        <span className="text-xs text-surface-muted-foreground">{card.date}</span>
                      )}
                    </div>

                    {/* Read More Link */}
                    {card?.link && (
                      <a
                        href={card.link}
                        className="mt-4 inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors duration-200"
                        aria-label={`Read more about ${card?.title ?? "this article"}`}
                      >
                        {card.label ?? "Read More"}
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </RevealOnScroll>
        )}

        {/* Pagination */}
        {props.pagination && props.pagination.length > 0 && (
          <nav className="flex justify-center items-center gap-2" aria-label="Blog pagination">
            {props.pagination.map((page, index) => (
              <a
                key={index}
                href={page?.href ?? "#"}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium border transition-colors duration-200 ${
                  page?.active
                    ? "bg-brand-primary text-on-brand-primary border-brand-primary"
                    : "bg-surface-foreground text-surface-muted-foreground border-surface-muted hover:bg-brand-primary hover:text-on-brand-primary hover:border-brand-primary"
                }`}
                aria-current={page?.active ? "page" : undefined}
              >
                {page?.label ?? index + 1}
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
