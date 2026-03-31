"use client";

/**
 * ColorCodeEventsAbout
 *
 * Describes the ColorCode Events organisation, its history, and mission
 * Layout: Dark background two-column layout: left with heading, right with body text and learn more button
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ColorCodeEventsAboutProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** learn-more-button */
  learnMoreButton?: Array<{ label?: string; href?: string }>;
}

export function ColorCodeEventsAbout(props: ColorCodeEventsAboutProps) {
  return (
      <section className="bg-surface-inverse py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left Column: Heading */}
            <RevealOnScroll variant="fade-up">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary leading-tight">
                  {props.sectionHeading ?? "About ColorCode Events"}
                </h2>
              </div>
            </RevealOnScroll>
  
            {/* Right Column: Body Text + CTA */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-8">
                <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                  {props.bodyText ??
                    "ColorCode Events is a pioneering organisation dedicated to celebrating diversity, creativity, and community through immersive live experiences. Founded with a mission to bring people together through the power of colour and culture, we have been crafting unforgettable events that inspire, connect, and uplift communities around the world. Our history is rooted in a belief that every person deserves a space to express themselves freely and joyfully."}
                </p>
  
                {props.learnMoreButton && (
                  <div>
                    <a
                      href={props.learnMoreButton.href ?? "#"}
                      className="inline-block bg-brand-accent text-on-brand-secondary font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                      aria-label={props.learnMoreButton.label ?? "Learn more about ColorCode Events"}
                    >
                      {props.learnMoreButton.label ?? "Learn More"}
                    </a>
                  </div>
                )}
  
                {!props.learnMoreButton && (
                  <div>
                    <a
                      href="#"
                      className="inline-block bg-brand-accent text-on-brand-secondary font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                      aria-label="Learn more about ColorCode Events"
                    >
                      Learn More
                    </a>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
