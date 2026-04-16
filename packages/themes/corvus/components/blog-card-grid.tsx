/**
 * BlogCardGrid
 *
 * Blog post preview grid with thumbnail, title, date, excerpt, and read more link
 * Layout: white background with section heading, 2-column card grid below
 * Category: Blog
 */

import React from "react";

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
  /** cardCta */
  cardCta?: string;
}

export function BlogCardGrid(props: BlogCardGridProps) {
  return (
    <section className="relative w-full bg-white">
      <div className="flex flex-col w-full max-w-full mx-auto px-[10px] pt-[10px] pb-0">
        <img
          src={
            props.cardThumbnail ??
            "https://colorcode.events/wp-content/uploads/2024/12/colorcode-events-logo.svg"
          }
          alt={props.cardTitle ?? "ColorCode Events"}
          loading="lazy"
          className="max-w-[150px]"
        />
      </div>

      <div className="flex flex-col items-center text-center w-full max-w-full mx-auto px-4 py-10">
        {props.sectionHeading && (
          <h2 className="text-3xl font-bold text-brand-primary tracking-tight leading-tight mb-8">
            {props.sectionHeading}
          </h2>
        )}

        {props.blogCards && props.blogCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto text-left">
            {props.blogCards.map((card, index) => (
              <div
                key={card.title ?? index}
                className="card bg-white rounded-lg overflow-hidden shadow-sm border border-surface-border flex flex-col"
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
                    <a
                      href={card.href}
                      className="inline-block mt-2 text-brand-secondary font-semibold text-sm hover:underline"
                    >
                      {card.cta ?? "Read More"}
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
