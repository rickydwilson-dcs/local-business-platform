"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * CardsMakeAGoodFirstImpression
 *
 * Cards section: Make a good first impression
 * Layout: contained
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CardsMakeAGoodFirstImpressionProps {
  /** heading */
  heading?: string;
  /** cards */
  cards?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** cardImages */
  cardImages?: Array<{ src?: string; alt?: string }>;
}

export function CardsMakeAGoodFirstImpression(props: CardsMakeAGoodFirstImpressionProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-foreground">
              {props.heading ?? "Make a good first impression"}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {props.cards && props.cards.length > 0
              ? props.cards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    {props.cardImages && props.cardImages[index] && (
                      <div className="w-full h-52 overflow-hidden">
                        <img
                          src={props.cardImages[index]?.src}
                          alt={props.cardImages[index]?.alt ?? ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
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
                      {card.href && (
                        <div className="mt-6">
                          <a
                            href={card.href}
                            className="inline-block bg-brand-primary text-on-brand-primary font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity duration-200"
                          >
                            {card.label}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              : [0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground rounded-2xl overflow-hidden shadow-md flex flex-col"
                  >
                    {props.cardImages && props.cardImages[index] && (
                      <div className="w-full h-52 overflow-hidden">
                        <img
                          src={props.cardImages[index]?.src}
                          alt={props.cardImages[index]?.alt ?? ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold text-surface-background mb-3">
                        {index === 0
                          ? "Professional Design"
                          : index === 1
                            ? "Clear Messaging"
                            : "Consistent Branding"}
                      </h3>
                      <p className="text-surface-muted-foreground text-base leading-relaxed flex-1">
                        {index === 0
                          ? "Create visually stunning layouts that captivate your audience from the very first glance."
                          : index === 1
                            ? "Communicate your value proposition clearly and concisely to engage visitors instantly."
                            : "Maintain a cohesive visual identity across all touchpoints to build trust and recognition."}
                      </p>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="inline-block bg-brand-primary text-on-brand-primary font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity duration-200"
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
