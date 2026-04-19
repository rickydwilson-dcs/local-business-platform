"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * EfficiencyPrivacyCards
 *
 * Highlights key benefits of commercial window tinting such as efficiency and privacy using feature cards
 * Layout: Single column or grid of feature cards with images, dark background
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface EfficiencyPrivacyCardsProps {
  /** section-heading */
  sectionHeading?: string;
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

export function EfficiencyPrivacyCards(props: EfficiencyPrivacyCardsProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background mb-4">
              {props.sectionHeading ?? "Efficiency & Privacy Solutions"}
            </h2>
            <div className="w-16 h-1 bg-brand-accent mx-auto rounded-full" />
          </div>
        </RevealOnScroll>

        {/* Feature Cards Grid */}
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {props.featureCards && props.featureCards.length > 0
              ? props.featureCards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground border border-surface-muted rounded-2xl overflow-hidden flex flex-col group hover:border-brand-accent transition-colors duration-300"
                  >
                    {/* Card Image */}
                    {card.image && (
                      <div className="relative w-full h-56 overflow-hidden">
                        <img
                          src={card.image}
                          alt={""}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-surface-inverse opacity-20" />
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {card.icon && (
                        <div className="mb-4">
                          <span className="text-brand-accent text-3xl">{card.icon}</span>
                        </div>
                      )}
                      {card.title && (
                        <h3 className="text-xl font-semibold text-surface-background mb-3">
                          {card.title}
                        </h3>
                      )}
                      {card.description && (
                        <p className="text-surface-muted-foreground text-base leading-relaxed flex-1">
                          {card.description}
                        </p>
                      )}
                      {card.cta && (
                        <div className="mt-6">
                          <a
                            href={card.href}
                            className="inline-flex items-center gap-2 text-brand-accent font-medium hover:underline transition-all duration-200"
                          >
                            {card.label}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
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
                        </div>
                      )}
                    </div>
                  </div>
                ))
              : /* Fallback default cards */
                [
                  {
                    title: "Energy Efficiency",
                    description:
                      "Reduce solar heat gain and lower cooling costs year-round with our high-performance commercial window films.",
                    icon: "⚡",
                  },
                  {
                    title: "Enhanced Privacy",
                    description:
                      "Protect sensitive workspaces and maintain a professional appearance with our range of privacy tinting solutions.",
                    icon: "🔒",
                  },
                  {
                    title: "UV Protection",
                    description:
                      "Block up to 99% of harmful UV rays to protect your employees, furnishings, and equipment from sun damage.",
                    icon: "🛡️",
                  },
                ].map((defaultCard, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground border border-surface-muted rounded-2xl overflow-hidden flex flex-col group hover:border-brand-accent transition-colors duration-300"
                  >
                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-4">
                        <span className="text-brand-accent text-3xl">{defaultCard.icon}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-surface-background mb-3">
                        {defaultCard.title}
                      </h3>
                      <p className="text-surface-muted-foreground text-base leading-relaxed flex-1">
                        {defaultCard.description}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
