/**
 * RigelBlogPostPage — Individual blog post template
 *
 * Displays post hero, MDX content, tags, author card, related posts,
 * and CTA section. All data passed as props.
 */

import Link from "next/link";
import {
  Breadcrumbs,
  BlogPostHero,
  BlogPostCard,
  AuthorCard,
  CTASection,
} from "@platform/core-components";
import type {
  RigelBlogPostPageTemplateProps,
  BlogPostSummary,
  BreadcrumbItem,
} from "@platform/core-components";

const categoryLabels: Record<string, string> = {
  "industry-tips": "Industry Tips",
  "how-to-guide": "How-To Guide",
  "case-study": "Case Study",
  seasonal: "Seasonal",
  news: "News",
};

function RelatedPosts({
  posts,
  currentSlug,
}: {
  posts: BlogPostSummary[];
  currentSlug: string;
}) {
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="section-standard bg-surface-subtle">
      <div className="container-standard">
        <div className="section-header">
          <h2 className="heading-section">Related Articles</h2>
          <p className="text-subtitle mx-auto max-w-2xl">
            Continue reading with more expert insights and industry guidance
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {related.map((post) => (
            <BlogPostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              heroImage={post.heroImage}
              date={post.date}
              readingTime={post.readingTime}
              category={post.category}
              categoryLabel={categoryLabels[post.category] ?? post.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export interface RigelBlogPostPageProps extends RigelBlogPostPageTemplateProps {
  slug?: string;
  readingTime?: number;
}

export function RigelBlogPostPage({
  siteConfig,
  frontmatter,
  mdxContent,
  relatedPosts,
  breadcrumbs,
  slug = "",
  readingTime,
}: RigelBlogPostPageProps) {
  const crumbs: BreadcrumbItem[] = breadcrumbs;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      <div>
        <article>
          {/* Hero Section */}
          <BlogPostHero
            variant="blog"
            title={frontmatter.title}
            excerpt={frontmatter.description}
            category={frontmatter.category}
            categoryLabel={categoryLabels[frontmatter.category] ?? frontmatter.category}
            date={frontmatter.date}
            readingTime={readingTime ?? 0}
            author={frontmatter.author}
            heroImage={frontmatter.heroImage}
          />

          {/* Article Content */}
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                {/* Prose Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
                  {mdxContent}
                </div>

                {/* Tags */}
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-surface-border">
                    <h3 className="text-sm font-semibold text-surface-muted uppercase tracking-wide mb-4">
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-surface-subtle text-surface-muted-foreground text-sm px-4 py-2 rounded-full hover:bg-surface-border transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio */}
                <div className="mt-12">
                  <AuthorCard name={frontmatter.author.name} role={frontmatter.author.role} />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <CTASection
            title="Want to Attend the Event?"
            description={`Join us at ${siteConfig.name} — completely free to attend. Register your place today.`}
            primaryButtonText={siteConfig.cta.primary.label}
            primaryButtonUrl={siteConfig.cta.primary.href}
            secondaryButtonText="Learn More"
            secondaryButtonUrl="/speakers"
          />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} currentSlug={slug} />
        )}
      </div>
    </>
  );
}
