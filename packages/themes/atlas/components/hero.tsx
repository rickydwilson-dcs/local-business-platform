"use client";

/**
 * Hero
 *
 * Hero section
 * Layout: contained
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll, ParallaxSection } from "@platform/core-components/components/animation";

export interface HeroProps {
  /** subheading */
  subheading?: string;
  /** ctaButtons */
  ctaButtons?: Array<{ label?: string; href?: string }>;
  /** backgroundImage */
  backgroundImage?: { src?: string; alt?: string };
}

export function Hero(props: HeroProps) {
  return (
      <section className="relative w-full bg-brand-primary overflow-hidden">
        <ParallaxSection backgroundImage={props.backgroundImage} speed={0.3}>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
            <RevealOnScroll variant="fade-up">
              <div className="max-w-3xl mx-auto text-center">
                {props.subheading && (
                  <p className="text-surface-background text-sm md:text-base font-semibold uppercase tracking-widest mb-4 opacity-80">
                    {props.subheading}
                  </p>
                )}
  
                <h1 className="text-surface-background text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Welcome to Our Platform
                </h1>
  
                {props.subheading && (
                  <p className="text-surface-background text-lg md:text-xl leading-relaxed mb-10 opacity-90">
                    {props.subheading}
                  </p>
                )}
  
                {props.ctaButtons && props.ctaButtons.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {props.ctaButtons.map((button, index) => (
                      <a
                        key={index}
                        href={button.href}
                        className={
                          index === 0
                            ? "inline-block bg-surface-background text-brand-primary font-semibold px-8 py-3 rounded-lg text-base md:text-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
                            : "inline-block border-2 border-surface-muted text-surface-background font-semibold px-8 py-3 rounded-lg text-base md:text-lg transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
                        }
                      >
                        {button.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </RevealOnScroll>
          </div>
  
          <div
            className="absolute inset-0 bg-brand-primary opacity-60 z-0"
            aria-hidden="true"
          />
        </ParallaxSection>
      </section>
    );
}
