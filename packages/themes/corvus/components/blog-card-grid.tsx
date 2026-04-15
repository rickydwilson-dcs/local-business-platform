import React from "react";

/**
 * BlogCardGrid
 *
 * Display recent blog posts in a card grid with thumbnail, title, date, excerpt, and read more link
 * Layout: contained section with section heading, 2-column card grid below
 * Category: Blog
 */

export interface BlogCardGridProps {
  /** sectionHeading */
  sectionHeading?: string;
  /** blogCards */
  blogCards?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** cardThumbnail */
  cardThumbnail?: string;
  /** cardTitle */
  cardTitle?: string;
  /** cardDate */
  cardDate?: string;
  /** cardExcerpt */
  cardExcerpt?: string;
  /** cardCtaButton */
  cardCtaButton?: { label?: string; href?: string };
}

export function BlogCardGrid(props: BlogCardGridProps) {
  return (
    <section className="relative w-full">
      <div className="flex flex-col w-full max-w-full mx-auto px-[10px] pt-[10px] pb-0">
        <img
          src={
            props.cardThumbnail ??
            "https://colorcode.events/wp-content/uploads/2024/12/colorcode-events-logo.svg"
          }
          alt=""
          loading="lazy"
          className="max-w-[150px]"
        />
      </div>

      <div className="flex flex-col items-center text-center w-full max-w-full mx-auto py-10">
        {props.sectionHeading && (
          <h2 className="text-3xl font-bold text-brand-primary tracking-tight mb-8">
            {props.sectionHeading}
          </h2>
        )}

        {props.blogCards && props.blogCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
            {props.blogCards.map((card, index) => (
              <div
                key={card.title ?? index}
                className="card flex flex-col bg-surface-card rounded-lg overflow-hidden shadow-sm border border-surface-border text-left"
              >
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title ?? ""}
                    loading="lazy"
                    className="w-full h-52 object-cover"
                  />
                )}
                <div className="flex flex-col flex-1 p-6 gap-3">
                  {card.date && (
                    <p className="text-sm text-on-inverse-muted font-medium">{card.date}</p>
                  )}
                  {card.title && (
                    <h3 className="text-xl font-bold text-brand-primary leading-tight">
                      {card.title}
                    </h3>
                  )}
                  {card.description && (
                    <p className="text-base text-surface-foreground leading-relaxed flex-1">
                      {card.description}
                    </p>
                  )}
                  {card.href && (
                    <a href={card.href} className="btn-secondary self-start mt-2">
                      {card.label ?? "Read More"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
