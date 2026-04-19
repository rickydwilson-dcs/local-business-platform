"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * ValuePropositionCards
 *
 * Highlights the company's fresh approach to customer service with icon/feature cards
 * Layout: Centred heading with multi-column icon cards below on dark background with graphic overlay
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ValuePropositionCardsProps {
  /** section-heading */
  sectionHeading?: string;
  /** section-subtext */
  sectionSubtext?: string;
  /** feature-cards */
  featureCards?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
}

export function ValuePropositionCards(props: ValuePropositionCardsProps) {
  return (
    <section className="relative bg-surface-inverse overflow-hidden py-20 px-4">
      {/* Graphic overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-brand-primary blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-accent blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Centred heading block */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            {props.sectionHeading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background mb-4 leading-tight">
                {props.sectionHeading}
              </h2>
            )}
            {props.sectionSubtext && (
              <p className="text-lg text-surface-muted-foreground leading-relaxed">
                {props.sectionSubtext}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Feature cards grid */}
        {props.featureCards && props.featureCards.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {props.featureCards.map((card, index) => (
                <div
                  key={index}
                  className="group relative bg-surface-foreground border border-surface-muted rounded-2xl p-8 flex flex-col items-start gap-5 hover:border-brand-primary transition-colors duration-300"
                >
                  {/* Icon area */}
                  {card.icon && (
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-primary text-on-brand-primary text-2xl shrink-0">
                      <span aria-hidden="true">{card.icon}</span>
                    </div>
                  )}

                  {/* Card content */}
                  <div className="flex flex-col gap-2">
                    {card.title && (
                      <h3 className="text-xl font-semibold text-surface-background leading-snug">
                        {card.title}
                      </h3>
                    )}
                    {card.description && (
                      <p className="text-surface-muted-foreground text-base leading-relaxed">
                        {card.description}
                      </p>
                    )}
                  </div>

                  {/* Subtle accent line on hover */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
