"use client";

/**
 * CardsSponsors
 *
 * Displays sponsor logos or cards in a grid layout
 * Layout: Contained grid of sponsor cards with heading and card images
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CardsSponsorsProps {
  /** heading */
  heading?: string;
  /** cards */
  cards?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** cardImages */
  cardImages?: { src?: string; alt?: string };
}

export function CardsSponsors(props: CardsSponsorsProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {props.heading && (
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
                {props.heading}
              </h2>
            </div>
          </RevealOnScroll>
        )}

        {props.cards && props.cards.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {props.cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-xl shadow-sm border border-surface-muted flex items-center justify-center p-6 md:p-8 hover:shadow-md transition-shadow duration-300"
                >
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.title || `Sponsor ${index + 1}`}
                      className="max-h-16 md:max-h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  )}
                  {!card.image && card.title && (
                    <span className="text-surface-muted-foreground font-semibold text-sm md:text-base text-center">
                      {card.title}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}

        {props.cardImages && !props.cards && (
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="bg-surface-foreground rounded-xl shadow-sm border border-surface-muted flex items-center justify-center p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <img
                  src={props.cardImages.src}
                  alt={props.cardImages.alt || "Sponsor"}
                  className="max-h-16 md:max-h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </RevealOnScroll>
        )}

        {!props.cards && !props.cardImages && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-surface-muted rounded-xl border border-surface-muted flex items-center justify-center p-6 md:p-8 h-28 md:h-32 animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
