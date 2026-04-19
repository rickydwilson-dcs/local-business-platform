"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * PrintBrandCards
 *
 * Showcases print service offerings under the heading 'Print to build your brand' using a card grid layout
 * Layout: Single container with grid of cards, dark background, each card with image and text
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CardItem {
  title?: string;
  description?: string;
  image?: { src?: string; alt?: string };
  cta?: { href?: string; label?: string };
}

export interface PrintBrandCardsProps {
  /** section-heading */
  sectionHeading?: string;
  /** card-grid */
  cardGrid?: CardItem[];
}

export function PrintBrandCards(props: PrintBrandCardsProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <h2 className="text-on-brand-primary text-3xl md:text-4xl font-bold text-center mb-12">
            {props.sectionHeading ?? "Print to build your brand"}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.cardGrid && props.cardGrid.length > 0
              ? props.cardGrid.map((card: CardItem, index: number) => (
                  <div
                    key={index}
                    className="bg-surface-foreground border border-surface-muted rounded-xl overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300"
                  >
                    {card.image && (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={card.image.src}
                          alt={card.image.alt ?? ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {card.title && (
                        <h3 className="text-on-brand-primary text-xl font-semibold mb-2">
                          {card.title}
                        </h3>
                      )}
                      {card.description && (
                        <p className="text-surface-muted-foreground text-sm leading-relaxed flex-1">
                          {card.description}
                        </p>
                      )}
                      {card.cta && (
                        <a
                          href={card.cta.href}
                          className="mt-4 inline-block text-brand-accent font-medium text-sm hover:underline"
                        >
                          {card.cta.label}
                        </a>
                      )}
                    </div>
                  </div>
                ))
              : [
                  {
                    title: "Business Cards",
                    description:
                      "Make a lasting first impression with premium business cards tailored to your brand.",
                    imageSrc: "https://placehold.co/400x300",
                    imageAlt: "Business Cards",
                  },
                  {
                    title: "Brochures & Flyers",
                    description:
                      "Communicate your message clearly with professionally printed brochures and flyers.",
                    imageSrc: "https://placehold.co/400x300",
                    imageAlt: "Brochures and Flyers",
                  },
                  {
                    title: "Banners & Signage",
                    description:
                      "Stand out at events and in-store with bold, high-quality banners and signage.",
                    imageSrc: "https://placehold.co/400x300",
                    imageAlt: "Banners and Signage",
                  },
                  {
                    title: "Packaging",
                    description:
                      "Elevate your product packaging with custom print solutions that reflect your brand.",
                    imageSrc: "https://placehold.co/400x300",
                    imageAlt: "Custom Packaging",
                  },
                  {
                    title: "Stationery",
                    description:
                      "Keep your brand consistent across all touchpoints with branded stationery.",
                    imageSrc: "https://placehold.co/400x300",
                    imageAlt: "Branded Stationery",
                  },
                  {
                    title: "Promotional Items",
                    description:
                      "Boost brand awareness with custom promotional merchandise your audience will love.",
                    imageSrc: "https://placehold.co/400x300",
                    imageAlt: "Promotional Items",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground border border-surface-muted rounded-xl overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300"
                  >
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-on-brand-primary text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-surface-muted-foreground text-sm leading-relaxed flex-1">
                        {item.description}
                      </p>
                      <a
                        href="#"
                        className="mt-4 inline-block text-brand-accent font-medium text-sm hover:underline"
                      >
                        Learn more
                      </a>
                    </div>
                  </div>
                ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
