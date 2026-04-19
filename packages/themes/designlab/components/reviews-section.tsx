"use client";
import { RevealOnScroll, Carousel } from "@platform/core-components/components/animation";
("use client");

/**
 * ReviewsSection
 *
 * Displays customer testimonials and reviews to build trust with prospective clients
 * Layout: Centred heading above review cards or a carousel on dark background
 * Category: Social Proof
 */

import { useState } from "react";
import { RevealOnScroll, Carousel } from "@platform/core-components/components/animation";

export interface ReviewsSectionProps {
  /** section-heading */
  sectionHeading?: string;
  /** review-cards */
  reviewCards?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
}

export function ReviewsSection(props: ReviewsSectionProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background mb-4">
              {props.sectionHeading ?? "What Our Customers Say"}
            </h2>
            <div className="w-16 h-1 bg-brand-accent mx-auto rounded-full" />
          </div>
        </RevealOnScroll>

        {/* Review Cards Carousel */}
        {props.reviewCards && props.reviewCards.length > 0 ? (
          <RevealOnScroll variant="fade-up">
            <Carousel autoPlay showDots loop>
              {props.reviewCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl p-8 mx-4 flex flex-col items-center text-center shadow-lg"
                >
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-brand-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  {card.reviewText && (
                    <blockquote className="text-surface-secondary-foreground text-lg leading-relaxed mb-6 italic">
                      &ldquo;{card.reviewText}&rdquo;
                    </blockquote>
                  )}

                  {/* Reviewer Avatar */}
                  {card.avatar && (
                    <img
                      src={card.avatar}
                      alt="Reviewer photo"
                      className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-brand-primary"
                    />
                  )}

                  {/* Reviewer Name */}
                  {card.reviewerName && (
                    <p className="text-surface-background font-semibold text-base">
                      {card.reviewerName}
                    </p>
                  )}

                  {/* Reviewer Title / Company */}
                  {card.reviewerTitle && (
                    <p className="text-surface-muted-foreground text-sm mt-1">
                      {card.reviewerTitle}
                    </p>
                  )}
                </div>
              ))}
            </Carousel>
          </RevealOnScroll>
        ) : (
          /* Fallback static cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah M.",
                title: "Small Business Owner",
                review:
                  "Absolutely outstanding service. The team went above and beyond to deliver exactly what we needed.",
              },
              {
                name: "James T.",
                title: "Marketing Director",
                review:
                  "I've worked with many agencies, but none have matched the quality and professionalism shown here.",
              },
              {
                name: "Priya K.",
                title: "Startup Founder",
                review:
                  "From start to finish, the experience was seamless. Highly recommend to anyone looking for top-tier results.",
              },
            ].map((item, index) => (
              <RevealOnScroll key={index} variant="fade-up">
                <div className="bg-surface-foreground rounded-2xl p-8 flex flex-col items-center text-center shadow-lg h-full">
                  <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-brand-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-surface-secondary-foreground text-lg leading-relaxed mb-6 italic">
                    &ldquo;{item.review}&rdquo;
                  </blockquote>
                  <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center mb-3">
                    <span className="text-on-brand-primary font-bold text-lg">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-surface-background font-semibold text-base">{item.name}</p>
                  <p className="text-surface-muted-foreground text-sm mt-1">{item.title}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
