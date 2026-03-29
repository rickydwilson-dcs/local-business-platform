"use client";

/**
 * BlogPostArticle
 *
 * Full blog post content including title, date, body text, inline images, ordered lists, and back-to-blog link
 * Layout: Single column article with text wrapping around floated inline images (right and left), ordered list mid-content, author signature, and back link
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPostArticleProps {
  /** post-title */
  postTitle?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-date */
  postDate?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-body */
  postBody?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** inline-image-right */
  inlineImageRight?: { src?: string; alt?: string };
  /** inline-image-left */
  inlineImageLeft?: { src?: string; alt?: string };
  /** inline-list */
  inlineList?: Array<{ label: string; href?: string }>;
  /** author-signature */
  authorSignature?: string;
  /** back-link */
  backLink?: Array<{ label?: string; href?: string }>;
}

export function BlogPostArticle(props: BlogPostArticleProps) {
  return (
      <article className="bg-surface-background min-h-screen py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
  
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-surface-foreground leading-tight mb-3">
              {props.postTitle ?? "Blog Post Title"}
            </h1>
            <time className="text-surface-muted-foreground text-sm md:text-base">
              {props.postDate ?? "January 1, 2024"}
            </time>
            <div className="mt-4 border-b border-surface-muted" />
          </header>
  
          {/* Article Body with Floated Right Image */}
          <RevealOnScroll variant="fade-up">
            <section className="mb-8">
              {props.inlineImageRight && (
                <div className="float-right ml-6 mb-4 w-full max-w-xs md:max-w-sm">
                  <img
                    src={props.inlineImageRight}
                    alt="Inline illustration"
                    className="rounded-lg w-full h-auto object-cover shadow-md"
                  />
                </div>
              )}
              <div className="text-surface-foreground text-base md:text-lg leading-relaxed">
                {props.postBody ?? (
                  <>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="mb-4">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </>
                )}
              </div>
              <div className="clear-both" />
            </section>
          </RevealOnScroll>
  
          {/* Ordered List Mid-Content */}
          {props.inlineList && (
            <RevealOnScroll variant="fade-up">
              <section className="mb-8 bg-surface-muted rounded-xl p-6 md:p-8">
                <ol className="list-decimal list-inside space-y-3 text-surface-foreground text-base md:text-lg">
                  {Array.isArray(props.inlineList)
                    ? props.inlineList.map((item: string, index: number) => (
                        <li key={index} className="leading-relaxed pl-2">
                          {item}
                        </li>
                      ))
                    : (
                      <>
                        <li className="leading-relaxed pl-2">First key point of the article</li>
                        <li className="leading-relaxed pl-2">Second important consideration</li>
                        <li className="leading-relaxed pl-2">Third takeaway for readers</li>
                        <li className="leading-relaxed pl-2">Final conclusion or action item</li>
                      </>
                    )}
                </ol>
              </section>
            </RevealOnScroll>
          )}
  
          {/* Continued Body with Floated Left Image */}
          <section className="mb-10">
            {props.inlineImageLeft && (
              <div className="float-left mr-6 mb-4 w-full max-w-xs md:max-w-sm">
                <img
                  src={props.inlineImageLeft}
                  alt="Inline illustration"
                  className="rounded-lg w-full h-auto object-cover shadow-md"
                />
              </div>
            )}
            <div className="text-surface-foreground text-base md:text-lg leading-relaxed">
              <p className="mb-4">
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
              </p>
              <p className="mb-4">
                Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
              </p>
            </div>
            <div className="clear-both" />
          </section>
  
          {/* Author Signature */}
          {props.authorSignature && (
            <div className="border-t border-surface-muted pt-6 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                <span className="text-on-brand-primary font-bold text-sm">
                  {typeof props.authorSignature === "string"
                    ? props.authorSignature.charAt(0).toUpperCase()
                    : "A"}
                </span>
              </div>
              <div>
                <p className="text-surface-muted-foreground text-sm">Written by</p>
                <p className="text-surface-foreground font-semibold text-base">
                  {props.authorSignature ?? "Author Name"}
                </p>
              </div>
            </div>
          )}
  
          {/* Back to Blog Link */}
          <div className="border-t border-surface-muted pt-6">
            <a
              href={props.backLink ?? "/blog"}
              className="inline-flex items-center gap-2 text-brand-primary font-medium text-base hover:underline transition-all duration-200"
              aria-label="Back to blog listing"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </a>
          </div>
  
        </div>
      </article>
    );
}
