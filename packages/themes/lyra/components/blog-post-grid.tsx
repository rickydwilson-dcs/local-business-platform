"use client";

/**
 * BlogPostGrid
 *
 * Displays recent blog post cards with thumbnail, title, date, excerpt, and read more CTA in a two-column grid
 * Layout: White background section with heading, two-column card grid with image top, metadata and excerpt below, button at bottom of each card
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPostGridProps {
  /** section-heading */
  sectionHeading?: string;
  /** post-thumbnail */
  postThumbnail?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-title */
  postTitle?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-date */
  postDate?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-excerpt */
  postExcerpt?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** read-more-button */
  readMoreButton?: Array<{ label?: string; href?: string }>;
}

export function BlogPostGrid(props: BlogPostGridProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {props['section-heading'] && (
            <RevealOnScroll variant="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-12">
                {props['section-heading']}
              </h2>
            </RevealOnScroll>
          )}
  
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[0, 1].map((index) => (
                <article
                  key={index}
                  className="bg-surface-foreground rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col"
                >
                  {props['post-thumbnail'] && (
                    <div className="w-full aspect-video overflow-hidden">
                      <img
                        src={props['post-thumbnail']}
                        alt={props['post-title'] ?? 'Blog post thumbnail'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
  
                  <div className="flex flex-col flex-1 p-6">
                    {props['post-date'] && (
                      <time className="text-sm text-surface-muted-foreground mb-2 block">
                        {props['post-date']}
                      </time>
                    )}
  
                    {props['post-title'] && (
                      <h3 className="text-xl font-semibold text-surface-foreground mb-3 leading-snug">
                        {props['post-title']}
                      </h3>
                    )}
  
                    {props['post-excerpt'] && (
                      <p className="text-surface-muted-foreground text-base leading-relaxed flex-1 mb-6">
                        {props['post-excerpt']}
                      </p>
                    )}
  
                    {props['read-more-button'] && (
                      <div className="mt-auto">
                        <a
                          href="#"
                          className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                          aria-label={`Read more: ${props['post-title'] ?? 'blog post'}`}
                        >
                          {props['read-more-button']}
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
