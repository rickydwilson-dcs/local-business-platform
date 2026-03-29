"use client";

/**
 * BlogPostGrid
 *
 * Displays blog post cards in a two-column grid with thumbnail, title, date, excerpt, and read more CTA
 * Layout: Two-column card grid with image top, metadata and excerpt below, button at bottom of each card; section heading top-left
 * Category: Blog
 */

import { useState } from "react";

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
          {/* Section Heading */}
          <div className="mb-10">
            {props['section-heading'] && (
              <h2 className="text-3xl font-bold text-surface-foreground">
                {props['section-heading']}
              </h2>
            )}
          </div>
  
          {/* Blog Post Grid */}
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1 */}
              <article className="bg-surface-foreground rounded-2xl overflow-hidden border border-surface-muted flex flex-col shadow-sm">
                {props['post-thumbnail'] && (
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={props['post-thumbnail']}
                      alt={props['post-title'] || 'Blog post thumbnail'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
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
                        className="inline-block border border-brand-primary text-brand-primary font-semibold px-5 py-2 rounded-lg hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200"
                      >
                        {props['read-more-button']}
                      </a>
                    </div>
                  )}
                </div>
              </article>
  
              {/* Card 2 */}
              <article className="bg-surface-foreground rounded-2xl overflow-hidden border border-surface-muted flex flex-col shadow-sm">
                {props['post-thumbnail'] && (
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={props['post-thumbnail']}
                      alt={props['post-title'] || 'Blog post thumbnail'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
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
                        className="inline-block border border-brand-primary text-brand-primary font-semibold px-5 py-2 rounded-lg hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200"
                      >
                        {props['read-more-button']}
                      </a>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
