/**
 * CaseStudiesGrid
 *
 * Filterable grid of case study cards with image, title, description and author
 * Layout: Filter tabs row above a two-column card layout with image left and content right
 * Category: Cards
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface CaseStudiesGridProps {
  /** filter-tabs */
  filterTabs?: string[];
  /** card-image */
  cardImage?: { src?: string; alt?: string }[];
  /** card-title */
  cardTitle?: string[];
  /** card-description */
  cardDescription?: string[];
  /** card-author */
  cardAuthor?: string[];
}
export function CaseStudiesGrid(props: CaseStudiesGridProps) {
  return (
    <section className="py-16 px-4 bg-surface-background">
      <div className="max-w-7xl mx-auto">
        {/* Filter Tabs */}
        {props.filterTabs && props.filterTabs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {props.filterTabs.map((tab: string, index: number) => (
              <button
                key={index}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  index === 0
                    ? "bg-brand-primary text-on-brand-primary border-brand-primary"
                    : "bg-surface-foreground text-surface-muted-foreground border-surface-muted hover:border-brand-primary hover:text-brand-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Case Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {props.cardTitle &&
            props.cardTitle.map((title: string, index: number) => (
              <RevealOnScroll key={index} variant="fade-up">
                <article className="bg-surface-foreground rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row border border-surface-muted hover:shadow-md transition-shadow duration-300">
                  {/* Card Image */}
                  {props.cardImage && props.cardImage[index] && (
                    <div className="sm:w-2/5 flex-shrink-0">
                      <img
                        src={props.cardImage[index]?.src}
                        alt={props.cardImage[index]?.alt ?? ""}
                        className="w-full h-48 sm:h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="flex flex-col justify-between p-6 sm:w-3/5">
                    <div>
                      {title && (
                        <h3 className="text-lg font-semibold text-surface-foreground mb-2 leading-snug">
                          {title}
                        </h3>
                      )}
                      {props.cardDescription && props.cardDescription[index] && (
                        <p className="text-sm text-surface-muted-foreground leading-relaxed mb-4">
                          {props.cardDescription[index]}
                        </p>
                      )}
                    </div>

                    {/* Author */}
                    {props.cardAuthor && props.cardAuthor[index] && (
                      <div className="flex items-center gap-3 pt-4 border-t border-surface-muted">
                        <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-on-brand-secondary text-xs font-bold uppercase flex-shrink-0">
                          {props.cardAuthor[index]?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-surface-secondary-foreground">
                          {props.cardAuthor[index]}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              </RevealOnScroll>
            ))}
        </div>
      </div>
    </section>
  );
}
