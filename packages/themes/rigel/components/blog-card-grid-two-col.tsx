"use client";

/**
 * BlogPostGrid
 *
 * Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA
 * Layout: Two-column card grid with image top, metadata and excerpt below, CTA button at bottom of each card
 * Category: Blog
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPostGridItem {
  thumbnail?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  href?: string;
}

export interface BlogPostGridProps {
  /** posts */
  posts?: BlogPostGridItem[];
}

export function BlogPostGrid(props: BlogPostGridProps) {
  const posts = props.posts ?? [];

  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <article
                  key={index}
                  className="bg-surface-foreground rounded-2xl shadow-card overflow-hidden flex flex-col border border-surface-muted"
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-video overflow-hidden bg-surface-muted">
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.title ?? "Blog post thumbnail"}
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
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-surface-muted-foreground flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <time className="text-sm text-surface-muted-foreground font-medium">
                        {post.date ?? "January 1, 2024"}
                      </time>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-surface-foreground leading-snug">
                      {post.title ?? "Blog Post Title"}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-surface-muted-foreground text-base leading-relaxed flex-1">
                      {post.excerpt ??
                        "Discover insights and ideas in this blog post. A short excerpt gives readers a preview of what to expect when they click through to read the full article."}
                    </p>

                    {/* CTA */}
                    <div className="pt-2">
                      <a
                        href={post.href ?? "#"}
                        className="inline-flex items-center gap-2 bg-brand-primary text-on-brand-primary font-semibold px-5 py-2.5 rounded-lg transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                        aria-label={`Read more about ${post.title ?? "this blog post"}`}
                      >
                        Read More
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
              ))
            ) : (
              /* Fallback: placeholder cards */
              [0, 1, 2, 3].map((index) => (
                <article
                  key={index}
                  className="bg-surface-foreground rounded-2xl shadow-card overflow-hidden flex flex-col border border-surface-muted"
                >
                  <div className="w-full aspect-video bg-surface-muted flex items-center justify-center">
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
                  <div className="flex flex-col flex-1 p-6 gap-4">
                    <time className="text-sm text-surface-muted-foreground font-medium">
                      January 1, 2024
                    </time>
                    <h2 className="text-xl font-bold text-surface-foreground leading-snug">
                      Blog Post Title
                    </h2>
                    <p className="text-surface-muted-foreground text-base leading-relaxed flex-1">
                      Check back soon for our latest updates and insights.
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
