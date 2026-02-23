"use client";

/**
 * BlogPostGrid
 *
 * Displays a grid of blog post cards with thumbnail, title, date, excerpt, and read more CTA
 * Layout: Two-column card grid on white background, each card has image top, metadata and excerpt below, CTA button at bottom
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
                  className="bg-surface-foreground rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-video overflow-hidden bg-surface-muted">
                    {props['post-thumbnail'] ? (
                      <img
                        src={props['post-thumbnail']}
                        alt={props['post-title'] ?? 'Blog post thumbnail'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-muted flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-surface-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
  
                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-6 gap-4">
                    {/* Date */}
                    <time
                      dateTime={props['post-date'] ?? ''}
                      className="text-sm text-surface-muted-foreground font-medium uppercase tracking-wide"
                    >
                      {props['post-date'] ?? 'January 1, 2024'}
                    </time>
  
                    {/* Title */}
                    <h2 className="text-xl font-bold text-surface-foreground leading-snug">
                      {props['post-title'] ?? 'Blog Post Title Goes Here'}
                    </h2>
  
                    {/* Excerpt */}
                    <p className="text-surface-muted-foreground text-base leading-relaxed flex-1">
                      {props['post-excerpt'] ??
                        'A short excerpt from the blog post that gives readers a preview of the content. It should be concise and engaging to encourage clicks.'}
                    </p>
  
                    {/* CTA */}
                    <div className="pt-2">
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 border border-brand-primary text-brand-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                        aria-label={`Read more about ${props['post-title'] ?? 'this blog post'}`}
                      >
                        {props['read-more-button'] ?? 'Read More'}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </a>
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
