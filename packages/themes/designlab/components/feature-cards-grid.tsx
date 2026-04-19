"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * FeatureCardsGrid
 *
 * Highlights key service features, benefits, or value propositions using a grid of icon or image cards under a section heading
 * Layout: Centred section heading above a multi-column grid of feature cards on dark background
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface FeatureCardsGridProps {
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
  /** card-image */
  cardImage?: { src?: string; alt?: string };
  /** card-title */
  cardTitle?: string;
  /** card-description */
  cardDescription?: string;
}

export function FeatureCardsGrid(props: FeatureCardsGridProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12 md:mb-16">
            {props.sectionHeading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background mb-4">
                {props.sectionHeading}
              </h2>
            )}
            {props.sectionSubtext && (
              <p className="text-lg md:text-xl text-surface-muted-foreground max-w-2xl mx-auto">
                {props.sectionSubtext}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Feature Cards Grid */}
        {props.featureCards && props.featureCards.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {props.featureCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground border border-surface-muted rounded-2xl p-6 md:p-8 flex flex-col items-start hover:border-brand-primary transition-colors duration-300"
                >
                  {props.cardImage && (
                    <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl bg-surface-muted overflow-hidden">
                      <img
                        src={props.cardImage?.src}
                        alt={props.cardImage?.alt ?? ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {props.cardTitle && (
                    <h3 className="text-xl font-semibold text-surface-background mb-3">
                      {props.cardTitle}
                    </h3>
                  )}
                  {props.cardDescription && (
                    <p className="text-surface-muted-foreground leading-relaxed text-base">
                      {props.cardDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
