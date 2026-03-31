"use client";

/**
 * BlogPreview
 *
 * Showcases recent blog posts with thumbnail, title, date, excerpt and read more link
 * Layout: White background section with 'Blog' heading, two-column card grid with image, title, date, excerpt, and CTA
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPreviewProps {
  /** section-heading */
  sectionHeading?: string;
  /** blog-card-1-image */
  blogCard1Image?: { src?: string; alt?: string };
  /** blog-card-1-title */
  blogCard1Title?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** blog-card-1-date */
  blogCard1Date?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** blog-card-1-excerpt */
  blogCard1Excerpt?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** blog-card-1-cta */
  blogCard1Cta?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** blog-card-2-image */
  blogCard2Image?: { src?: string; alt?: string };
  /** blog-card-2-title */
  blogCard2Title?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** blog-card-2-date */
  blogCard2Date?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** blog-card-2-excerpt */
  blogCard2Excerpt?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** blog-card-2-cta */
  blogCard2Cta?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function BlogPreview(props: BlogPreviewProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <h2 className="text-3xl font-bold text-brand-primary mb-10 text-center">
              {props['section-heading'] ?? 'Blog'}
            </h2>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1 */}
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col">
                {props['blog-card-1-image'] && (
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={props['blog-card-1-image']}
                      alt={props['blog-card-1-title'] ?? 'Blog post thumbnail'}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  {props['blog-card-1-date'] && (
                    <time className="text-sm text-surface-muted-foreground mb-2 block">
                      {props['blog-card-1-date']}
                    </time>
                  )}
                  {props['blog-card-1-title'] && (
                    <h3 className="text-xl font-semibold text-surface-foreground mb-3">
                      {props['blog-card-1-title']}
                    </h3>
                  )}
                  {props['blog-card-1-excerpt'] && (
                    <p className="text-surface-muted-foreground text-base leading-relaxed mb-6 flex-1">
                      {props['blog-card-1-excerpt']}
                    </p>
                  )}
                  {props['blog-card-1-cta'] && (
                    <a
                      href="#"
                      className="inline-block self-start bg-brand-primary text-on-brand-primary font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity duration-200"
                    >
                      {props['blog-card-1-cta']}
                    </a>
                  )}
                </div>
              </article>
  
              {/* Card 2 */}
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col">
                {props['blog-card-2-image'] && (
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={props['blog-card-2-image']}
                      alt={props['blog-card-2-title'] ?? 'Blog post thumbnail'}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  {props['blog-card-2-date'] && (
                    <time className="text-sm text-surface-muted-foreground mb-2 block">
                      {props['blog-card-2-date']}
                    </time>
                  )}
                  {props['blog-card-2-title'] && (
                    <h3 className="text-xl font-semibold text-surface-foreground mb-3">
                      {props['blog-card-2-title']}
                    </h3>
                  )}
                  {props['blog-card-2-excerpt'] && (
                    <p className="text-surface-muted-foreground text-base leading-relaxed mb-6 flex-1">
                      {props['blog-card-2-excerpt']}
                    </p>
                  )}
                  {props['blog-card-2-cta'] && (
                    <a
                      href="#"
                      className="inline-block self-start bg-brand-primary text-on-brand-primary font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity duration-200"
                    >
                      {props['blog-card-2-cta']}
                    </a>
                  )}
                </div>
              </article>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
