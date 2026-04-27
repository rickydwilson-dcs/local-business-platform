"use client";

/**
 * HelpCTABanner
 *
 * Encourages visitors to contact the team if they have website problems, with a contact button
 * Layout: Two-column split with text and CTA button on left, illustrated character images on right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HelpCTABannerProps {
  /** headline */
  headline?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
  /** illustration-images */
  illustrationImages?: { src?: string; alt?: string }[];
}

export function HelpCTABanner(props: HelpCTABannerProps) {
  return (
    <section className="bg-surface-muted py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left column: text and CTA */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground leading-tight">
                {props.headline ?? "Having trouble with our website?"}
              </h2>
              <p className="text-surface-muted-foreground text-lg leading-relaxed">
                {props.bodyText ??
                  "Our team is here to help. Whether you're experiencing a technical issue or just need some guidance, don't hesitate to reach out — we'll get you sorted quickly."}
              </p>
              {props.ctaButton && (
                <div>
                  <a
                    href={props.ctaButton?.href ?? "#contact"}
                    className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                  >
                    {props.ctaButton?.label ?? "Contact Us"}
                  </a>
                </div>
              )}
              {!props.ctaButton && (
                <div>
                  <a
                    href="#contact"
                    className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                  >
                    Contact Us
                  </a>
                </div>
              )}
            </div>
          </RevealOnScroll>

          {/* Right column: illustrated character images */}
          <div className="flex items-end justify-center md:justify-end gap-4 relative">
            {props.illustrationImages && props.illustrationImages.length > 0 ? (
              props.illustrationImages.map(
                (image: { src?: string; alt?: string }, index: number) => (
                  <div
                    key={index}
                    className={`animate-fade-in-up flex-shrink-0 ${
                      index === 0
                        ? "w-40 md:w-48 lg:w-56"
                        : index === 1
                          ? "w-32 md:w-40 lg:w-48 mb-4"
                          : "w-28 md:w-36 lg:w-44 mb-8"
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <img
                      src={image?.src}
                      alt={image?.alt ?? `Support team illustration ${index + 1}`}
                      className="w-full h-auto object-contain drop-shadow-md"
                    />
                  </div>
                )
              )
            ) : (
              /* Fallback placeholder illustrations */
              <div className="flex items-end gap-4">
                <div className="w-40 md:w-48 lg:w-56 animate-fade-in-up">
                  <div className="bg-brand-secondary rounded-2xl w-full aspect-[3/4] flex items-center justify-center">
                    <svg
                      viewBox="0 0 120 160"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3/4 h-3/4"
                      aria-hidden="true"
                    >
                      <circle cx="60" cy="40" r="28" className="fill-brand-primary" />
                      <rect
                        x="20"
                        y="80"
                        width="80"
                        height="70"
                        rx="16"
                        className="fill-brand-primary"
                      />
                      <circle cx="48" cy="36" r="5" fill="white" />
                      <circle cx="72" cy="36" r="5" fill="white" />
                      <path
                        d="M48 54 Q60 64 72 54"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className="w-32 md:w-40 lg:w-48 mb-4 animate-fade-in-up"
                  style={{ animationDelay: "150ms" }}
                >
                  <div className="bg-brand-accent rounded-2xl w-full aspect-[3/4] flex items-center justify-center">
                    <svg
                      viewBox="0 0 120 160"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3/4 h-3/4"
                      aria-hidden="true"
                    >
                      <circle cx="60" cy="40" r="28" className="fill-brand-secondary" />
                      <rect
                        x="20"
                        y="80"
                        width="80"
                        height="70"
                        rx="16"
                        className="fill-brand-secondary"
                      />
                      <circle cx="48" cy="36" r="5" fill="white" />
                      <circle cx="72" cy="36" r="5" fill="white" />
                      <path
                        d="M48 54 Q60 64 72 54"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
