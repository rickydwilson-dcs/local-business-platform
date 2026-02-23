"use client";

/**
 * BlogPostGrid
 *
 * Displays blog post cards in a two-column grid with thumbnail, title, date, excerpt, and read more CTA
 * Layout: Two-column card grid with image top, metadata and excerpt below, button at bottom of each card
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPostGridProps {
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
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[0, 1, 2, 3].map((index) => (
                <article
                  key={index}
                  className="bg-surface-foreground rounded-2xl overflow-hidden flex flex-col shadow-sm border border-surface-muted"
                >
                  {/* Thumbnail */}
                  {props['post-thumbnail'] && (
                    <div className="w-full aspect-video overflow-hidden">
                      <img
                        src={props['post-thumbnail']}
                        alt={props['post-title'] ?? 'Blog post thumbnail'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
  
                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-6 gap-4">
                    {/* Date */}
                    {props['post-date'] && (
                      <time className="text-sm text-surface-muted-foreground font-medium uppercase tracking-wide">
                        {props['post-date']}
                      </time>
                    )}
  
                    {/* Title */}
                    {props['post-title'] && (
                      <h2 className="text-xl font-bold text-surface-foreground leading-snug">
                        {props['post-title']}
                      </h2>
                    )}
  
                    {/* Excerpt */}
                    {props['post-excerpt'] && (
                      <p className="text-surface-muted-foreground text-base leading-relaxed flex-1">
                        {props['post-excerpt']}
                      </p>
                    )}
  
                    {/* Read More CTA */}
                    <div className="pt-2">
                      <button
                        className="inline-flex items-center gap-2 bg-brand-primary text-on-brand-primary font-semibold px-5 py-2.5 rounded-lg transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                        aria-label={`Read more about ${props['post-title'] ?? 'this post'}`}
                      >
                        {props['read-more-button'] ?? 'Read More'}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
