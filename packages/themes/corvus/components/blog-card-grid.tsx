"use client";

/**
 * BlogPreviewGrid
 *
 * Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA button
 * Layout: Two-column card grid on white background; each card has top image, heading, date, excerpt text, and outlined CTA button
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
        {props.sectionHeading && (
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
                {props.sectionHeading}
              </h2>
              <div className="mt-4 w-16 h-1 bg-brand-accent mx-auto rounded-full" />
            </div>
          </RevealOnScroll>
        )}

        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.isArray(props.postTitle) ? (
              props.postTitle.map((postTitleItem, index: number) => (
                <article
                  key={index}
                  className="bg-surface-foreground rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col"
                >
                  {props.postThumbnail && props.postThumbnail[index] && (
                    <div className="w-full h-52 md:h-64 overflow-hidden">
                      <img
                        src={props.postThumbnail[index].image}
                        alt={postTitleItem.title ?? "Blog post"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {props.postDate && props.postDate[index] && (
                      <p className="text-surface-muted-foreground text-sm mb-2 uppercase tracking-wide">
                        {props.postDate[index].title}
                      </p>
                    )}

                    <h3 className="text-xl font-semibold text-surface-foreground mb-3 leading-snug">
                      {postTitleItem.title}
                    </h3>

                    {props.postExcerpt && props.postExcerpt[index] && (
                      <p className="text-surface-muted-foreground text-base leading-relaxed mb-6 flex-1">
                        {props.postExcerpt[index].description}
                      </p>
                    )}

                    {props.readMoreButton && props.readMoreButton[index] && (
                      <div className="mt-auto">
                        <a
                          href={props.readMoreButton[index].href || "#"}
                          className="inline-block border border-brand-primary text-brand-primary text-sm font-medium px-5 py-2 rounded-full hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200"
                        >
                          {props.readMoreButton[index].label || "Read More"}
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <article className="bg-surface-foreground rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col">
                {props.postThumbnail && (
                  <div className="w-full h-52 md:h-64 overflow-hidden">
                    <img
                      src={props.postThumbnail?.[0]?.image}
                      alt="Blog post"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {props.postDate && (
                    <p className="text-surface-muted-foreground text-sm mb-2 uppercase tracking-wide">
                      {props.postDate?.[0]?.title}
                    </p>
                  )}

                  {props.postTitle && (
                    <h3 className="text-xl font-semibold text-surface-foreground mb-3 leading-snug">
                      {"Blog post"}
                    </h3>
                  )}

                  {props.postExcerpt && (
                    <p className="text-surface-muted-foreground text-base leading-relaxed mb-6 flex-1">
                      {props.postExcerpt?.[0]?.description}
                    </p>
                  )}

                  {props.readMoreButton && (
                    <div className="mt-auto">
                      <a
                        href={props.readMoreButton?.[0]?.href || "#"}
                        className="inline-block border border-brand-primary text-brand-primary text-sm font-medium px-5 py-2 rounded-full hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200"
                      >
                        {props.readMoreButton?.[0]?.label || "Read More"}
                      </a>
                    </div>
                  )}
                </div>
              </article>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
