"use client";

/**
 * BlogPreviewGrid
 *
 * Showcases recent or all blog posts with thumbnail, title, date, excerpt, and read-more link in a card grid
 * Layout: White background, section heading top-left, two-column card grid below; each card has top image, heading, date in brand colour, excerpt, and outlined CTA button
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPreviewGridProps {
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

export function BlogPreviewGrid(props: BlogPreviewGridProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
              {props.sectionHeading ?? "Latest from the Blog"}
            </h2>
          </div>
  
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <RevealOnScroll variant="fade-up">
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col h-full">
                {/* Thumbnail */}
                <div className="w-full aspect-video overflow-hidden">
                  <img
                    src={props.postThumbnail ?? "/placeholder-blog.jpg"}
                    alt={props.postTitle ?? "Blog post thumbnail"}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
  
                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Date */}
                  <p className="text-brand-accent text-sm font-semibold uppercase tracking-wide mb-2">
                    {props.postDate ?? "January 1, 2024"}
                  </p>
  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-surface-foreground mb-3 leading-snug">
                    {props.postTitle ?? "How to Build Better Products Faster"}
                  </h3>
  
                  {/* Excerpt */}
                  <p className="text-surface-muted-foreground text-base leading-relaxed mb-6 flex-1">
                    {props.postExcerpt ??
                      "Discover the strategies and tools that leading teams use to ship high-quality products without sacrificing speed or creativity."}
                  </p>
  
                  {/* CTA Button */}
                  <div>
                    <a
                      href="#"
                      className="inline-block border border-brand-primary text-brand-primary font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200"
                    >
                      {props.readMoreButton ?? "Read More"}
                    </a>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
  
            {/* Card 2 */}
            <RevealOnScroll variant="fade-up">
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col h-full">
                {/* Thumbnail */}
                <div className="w-full aspect-video overflow-hidden">
                  <img
                    src={props.postThumbnail ?? "/placeholder-blog-2.jpg"}
                    alt={props.postTitle ?? "Blog post thumbnail"}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
  
                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Date */}
                  <p className="text-brand-accent text-sm font-semibold uppercase tracking-wide mb-2">
                    {props.postDate ?? "February 14, 2024"}
                  </p>
  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-surface-foreground mb-3 leading-snug">
                    {props.postTitle ?? "The Future of Design Systems in 2024"}
                  </h3>
  
                  {/* Excerpt */}
                  <p className="text-surface-muted-foreground text-base leading-relaxed mb-6 flex-1">
                    {props.postExcerpt ??
                      "Design systems are evolving rapidly. We explore the trends shaping how teams build, maintain, and scale their component libraries."}
                  </p>
  
                  {/* CTA Button */}
                  <div>
                    <a
                      href="#"
                      className="inline-block border border-brand-primary text-brand-primary font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200"
                    >
                      {props.readMoreButton ?? "Read More"}
                    </a>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
