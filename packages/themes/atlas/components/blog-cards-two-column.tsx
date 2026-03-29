"use client";

/**
 * BlogPostGrid
 *
 * Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA
 * Layout: Two-column card grid on white background; each card has top image, heading, date in brand colour, excerpt text, and outlined CTA button
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
              {/* Card 1 */}
              <article className="bg-surface-foreground rounded-lg overflow-hidden shadow-sm border border-surface-muted flex flex-col">
                {props.postThumbnail && (
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={props.postThumbnail}
                      alt={props.postTitle ?? 'Blog post thumbnail'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!props.postThumbnail && (
                  <div className="w-full aspect-video bg-surface-muted flex items-center justify-center">
                    <span className="text-surface-muted-foreground text-sm">No image available</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  {props.postDate && (
                    <time className="text-brand-accent text-sm font-medium mb-2 block">
                      {props.postDate}
                    </time>
                  )}
                  {props.postTitle && (
                    <h2 className="text-surface-foreground text-xl font-bold mb-3 leading-snug">
                      {props.postTitle}
                    </h2>
                  )}
                  {props.postExcerpt && (
                    <p className="text-surface-muted-foreground text-base leading-relaxed mb-6 flex-1">
                      {props.postExcerpt}
                    </p>
                  )}
                  {props.readMoreButton && (
                    <div className="mt-auto">
                      <a
                        href="#"
                        className="inline-block border border-brand-accent text-brand-accent text-sm font-semibold px-5 py-2 rounded hover:bg-brand-accent hover:text-on-brand-secondary transition-colors duration-200"
                      >
                        {props.readMoreButton}
                      </a>
                    </div>
                  )}
                  {!props.readMoreButton && (
                    <div className="mt-auto">
                      <a
                        href="#"
                        className="inline-block border border-brand-accent text-brand-accent text-sm font-semibold px-5 py-2 rounded hover:bg-brand-accent hover:text-on-brand-secondary transition-colors duration-200"
                      >
                        Read More
                      </a>
                    </div>
                  )}
                </div>
              </article>
  
              {/* Card 2 */}
              <article className="bg-surface-foreground rounded-lg overflow-hidden shadow-sm border border-surface-muted flex flex-col">
                {props.postThumbnail && (
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={props.postThumbnail}
                      alt={props.postTitle ?? 'Blog post thumbnail'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!props.postThumbnail && (
                  <div className="w-full aspect-video bg-surface-muted flex items-center justify-center">
                    <span className="text-surface-muted-foreground text-sm">No image available</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  {props.postDate && (
                    <time className="text-brand-accent text-sm font-medium mb-2 block">
                      {props.postDate}
                    </time>
                  )}
                  {props.postTitle && (
                    <h2 className="text-surface-foreground text-xl font-bold mb-3 leading-snug">
                      {props.postTitle}
                    </h2>
                  )}
                  {props.postExcerpt && (
                    <p className="text-surface-muted-foreground text-base leading-relaxed mb-6 flex-1">
                      {props.postExcerpt}
                    </p>
                  )}
                  {props.readMoreButton && (
                    <div className="mt-auto">
                      <a
                        href="#"
                        className="inline-block border border-brand-accent text-brand-accent text-sm font-semibold px-5 py-2 rounded hover:bg-brand-accent hover:text-on-brand-secondary transition-colors duration-200"
                      >
                        {props.readMoreButton}
                      </a>
                    </div>
                  )}
                  {!props.readMoreButton && (
                    <div className="mt-auto">
                      <a
                        href="#"
                        className="inline-block border border-brand-accent text-brand-accent text-sm font-semibold px-5 py-2 rounded hover:bg-brand-accent hover:text-on-brand-secondary transition-colors duration-200"
                      >
                        Read More
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
