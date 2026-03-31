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
        {props.backgroundImage && (
          <ParallaxSection backgroundImage={props.backgroundImage} speed={0.3}>
            <div className="absolute inset-0 bg-brand-primary opacity-70" />
          </ParallaxSection>
        )}
  
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-surface-background">
                Welcome to Our Platform
              </h1>
  
              {props.subheading && (
                <p className="text-base md:text-lg lg:text-xl text-surface-background opacity-90 max-w-2xl">
                  {props.subheading}
                </p>
              )}
  
              {props.ctaButtons && props.ctaButtons.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center">
                  {props.ctaButtons.map((button, index) => (
                    <a
                      key={index}
                      href={button.href}
                      className={
                        index === 0
                          ? "inline-flex items-center justify-center px-8 py-3 rounded-lg bg-surface-background text-brand-primary font-semibold text-base transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2"
                          : "inline-flex items-center justify-center px-8 py-3 rounded-lg border border-surface-muted text-surface-background font-semibold text-base transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2"
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
      </section>
    );
}
