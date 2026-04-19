"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * ValuePropositionCards
 *
 * Highlights the company's core value propositions or fresh approach to customer service with icon or feature cards on a dark background
 * Layout: Centred heading and subtext above a multi-column icon card grid on dark background with optional graphic overlay
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
    <section className="relative bg-surface-inverse py-20 px-4 overflow-hidden">
      {/* Subtle graphic overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-brand-primary blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading block */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            {props.sectionHeading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background mb-4 leading-tight">
                {props.sectionHeading}
              </h2>
            )}
            {props.sectionSubtext && (
              <p className="text-lg md:text-xl text-surface-muted-foreground leading-relaxed">
                {props.sectionSubtext}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Feature cards grid */}
        {props.featureCards && props.featureCards.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {props.featureCards.map((card, index) => (
                <div
                  key={index}
                  className="group relative bg-surface-foreground border border-surface-muted rounded-2xl p-8 flex flex-col items-start hover:border-brand-primary transition-all duration-300"
                >
                  {/* Icon area */}
                  {card.icon && (
                    <div className="mb-5 w-14 h-14 rounded-xl bg-brand-primary flex items-center justify-center shrink-0">
                      <span className="text-on-brand-primary text-2xl" aria-hidden="true">
                        {card.icon}
                      </span>
                    </div>
                  )}

                  {/* Card title */}
                  {card.title && (
                    <h3 className="text-xl font-semibold text-surface-background mb-3 leading-snug">
                      {card.title}
                    </h3>
                  )}

                  {/* Card description */}
                  {card.description && (
                    <p className="text-surface-muted-foreground leading-relaxed text-base">
                      {card.description}
                    </p>
                  )}

                  {/* Optional CTA link */}
                  {card.href && card.label && (
                    <a
                      href={card.href}
                      className="mt-6 inline-flex items-center gap-2 text-brand-primary font-medium text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
                    >
                      {card.label}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  )}

                  {/* Hover accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
