"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * CardsCommercialVehicleSignwriting
 *
 * Cards section: Commercial Vehicle Signwriting
 * Layout: contained
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CardsCommercialVehicleSignwritingProps {
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

export function CardsCommercialVehicleSignwriting(props: CardsCommercialVehicleSignwritingProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
              {props.heading ?? "Commercial Vehicle Signwriting"}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {props.cards && props.cards.length > 0
              ? props.cards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground rounded-2xl overflow-hidden shadow-md flex flex-col"
                  >
                    {props.cardImages && props.cardImages[index] && (
                      <div className="w-full h-56 overflow-hidden">
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
                        <p className="text-surface-muted-foreground text-sm leading-relaxed flex-1">
                          {card.description}
                        </p>
                      )}
                      {(card.href || card.label) && (
                        <div className="mt-6">
                          <a
                            href={card.href}
                            className="inline-block bg-brand-primary text-on-brand-primary text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            {card.label}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              : [
                  {
                    title: "Van & Truck Wraps",
                    description:
                      "Full and partial vehicle wraps that turn your fleet into moving billboards. High-impact graphics that get your brand noticed on every journey.",
                  },
                  {
                    title: "Fleet Branding",
                    description:
                      "Consistent, professional branding across your entire fleet. We ensure every vehicle carries your identity with precision and quality.",
                  },
                  {
                    title: "Cut Vinyl Lettering",
                    description:
                      "Durable, cost-effective vinyl lettering for contact details, logos, and messaging. Perfect for vans, lorries, and commercial vehicles of all sizes.",
                  },
                  {
                    title: "Magnetic Signs",
                    description:
                      "Flexible magnetic vehicle signs that can be applied and removed as needed. Ideal for businesses that use personal vehicles for work.",
                  },
                  {
                    title: "Reflective Signwriting",
                    description:
                      "High-visibility reflective graphics for vehicles that operate at night or in low-light conditions. Safety and branding combined.",
                  },
                  {
                    title: "Custom Designs",
                    description:
                      "Bespoke signwriting solutions tailored to your brand. Our design team works with you to create graphics that truly represent your business.",
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground rounded-2xl overflow-hidden shadow-md flex flex-col"
                  >
                    <div className="w-full h-56 bg-surface-muted flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-surface-muted-foreground opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                        />
                      </svg>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold text-surface-background mb-3">
                        {card.title}
                      </h3>
                      <p className="text-surface-muted-foreground text-sm leading-relaxed flex-1">
                        {card.description}
                      </p>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="inline-block bg-brand-primary text-on-brand-primary text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Learn More
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
