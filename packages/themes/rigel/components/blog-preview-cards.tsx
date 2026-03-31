"use client";

/**
 * BlogPreviewCards
 *
 * Showcases recent or listed blog posts with thumbnail, title, date, excerpt, and read more CTA
 * Layout: Two-column card grid with image top, metadata and excerpt below, CTA button at bottom of each card
 * Category: Blog
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPreviewPost {
  thumbnail?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  href?: string;
}

export interface BlogPreviewCardsProps {
  /** section-heading */
  sectionHeading?: string;
  /** posts */
  posts?: BlogPreviewPost[];
}

export function BlogPreviewCards(props: BlogPreviewCardsProps) {
  const posts = props.posts ?? [];

  return (
    <section className="py-16 px-4 bg-surface-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
              {props.sectionHeading ?? "From the Blog"}
            </h2>
          </div>
        </RevealOnScroll>

        {/* Blog Card Grid */}
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <article
                  key={index}
                  className="bg-surface-foreground rounded-2xl shadow-md overflow-hidden flex flex-col border border-surface-muted"
                >
                  {post.thumbnail && (
                    <div className="w-full h-52 md:h-60 overflow-hidden">
                      <img
                        src={post.thumbnail}
                        alt={post.title ?? "Blog post thumbnail"}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-6">
                    {post.date && (
                      <time className="text-sm text-surface-muted-foreground mb-2 block">
                        {post.date}
                      </time>
                    )}
                    {post.title && (
                      <h3 className="text-xl font-semibold text-surface-foreground mb-3 leading-snug">
                        {post.title}
                      </h3>
                    )}
                    {post.excerpt && (
                      <p className="text-surface-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto">
                      <a
                        href={post.href ?? "#"}
                        className="inline-block bg-brand-primary text-on-brand-primary text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              /* Fallback: empty state */
              [0, 1].map((index) => (
                <article
                  key={index}
                  className="bg-surface-foreground rounded-2xl shadow-md overflow-hidden flex flex-col border border-surface-muted"
                >
                  <div className="w-full h-52 md:h-60 bg-surface-muted flex items-center justify-center">
                    <span className="text-surface-muted-foreground text-sm">No image</span>
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <time className="text-sm text-surface-muted-foreground mb-2 block">
                      January 1, 2024
                    </time>
                    <h3 className="text-xl font-semibold text-surface-foreground mb-3 leading-snug">
                      Blog Post Title
                    </h3>
                    <p className="text-surface-muted-foreground text-sm leading-relaxed flex-1 mb-6">
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
