"use client";

/**
 * FeaturedBlogPost
 *
 * Highlights the latest or featured blog post with image, category tags, title, excerpt and author
 * Layout: Two-column split: large image left, text content with tags, title, excerpt and author right
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface FeaturedBlogPostProps {
  /** featured-image */
  featuredImage?: { src?: string; alt?: string };
  /** category-tags */
  categoryTags?: string[];
  /** post-title */
  postTitle?: string;
  /** post-excerpt */
  postExcerpt?: string;
  /** author-avatar */
  authorAvatar?: { src?: string; alt?: string };
  /** author-name */
  authorName?: string;
}

export function FeaturedBlogPost(props: FeaturedBlogPostProps) {
  return (
    <section className="bg-surface-background py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center bg-surface-foreground rounded-2xl overflow-hidden shadow-sm">
            {/* Left: Featured Image */}
            <div className="relative w-full h-64 md:h-full min-h-[320px] lg:min-h-[480px] overflow-hidden">
              {props.featuredImage?.src ? (
                <img
                  src={props.featuredImage.src}
                  alt={props.featuredImage.alt ?? "Featured blog post image"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-muted flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm">No image available</span>
                </div>
              )}
            </div>

            {/* Right: Text Content */}
            <div className="flex flex-col justify-center px-6 py-8 md:px-8 lg:px-12 lg:py-12 gap-5">
              {/* Category Tags */}
              {props.categoryTags && props.categoryTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {props.categoryTags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-block bg-brand-accent text-on-brand-secondary text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Title */}
              {props.postTitle && (
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-primary leading-tight">
                  {props.postTitle}
                </h2>
              )}

              {/* Post Excerpt */}
              {props.postExcerpt && (
                <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed line-clamp-4">
                  {props.postExcerpt}
                </p>
              )}

              {/* Author */}
              {(props.authorName || props.authorAvatar?.src) && (
                <div className="flex items-center gap-3 pt-2 border-t border-surface-muted">
                  {props.authorAvatar?.src && (
                    <img
                      src={props.authorAvatar.src}
                      alt={props.authorAvatar.alt ?? props.authorName ?? "Author avatar"}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  {props.authorName && (
                    <div>
                      <p className="text-xs text-surface-muted-foreground uppercase tracking-wide font-medium">
                        Written by
                      </p>
                      <p className="text-sm font-semibold text-brand-primary">{props.authorName}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Read More CTA */}
              <div className="pt-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-brand-primary text-on-brand-primary text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200"
                  aria-label={`Read more about ${props.postTitle ?? "this post"}`}
                >
                  Read Full Article
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
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
