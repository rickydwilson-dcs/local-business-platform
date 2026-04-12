import type { BlogPostPageTemplateProps, BlogPostSummary } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs, BlogPostHero, BlogPostCard, AuthorCard, CTASection } from '@platform/core-components';

const categoryLabels: Record<string, string> = {
  'industry-tips': 'Industry Tips',
  'how-to-guide': 'How-To Guide',
  'case-study': 'Case Study',
  seasonal: 'Seasonal',
  news: 'News',
};

function CygnusRelatedPosts({
  posts,
  currentSlug,
}: {
  posts: BlogPostSummary[];
  currentSlug: string;
}) {
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="section-standard bg-surface-muted">
      <div className="container-standard">
        <h2 className="text-2xl font-bold text-surface-foreground mb-8">Related Articles</h2>
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
              categoryLabel={categoryLabels[post.category] || post.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CygnusBlogPostPage({
  siteConfig,
  frontmatter,
  mdxContent,
  relatedPosts,
  readingTime,
  breadcrumbs,
  schemaNodes,
}: BlogPostPageTemplateProps) {
  return (
    <>
      {schemaNodes}

      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-card-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div>
        <article>
          {/* Hero */}
          <BlogPostHero
            variant="blog"
            title={frontmatter.title}
            excerpt={frontmatter.description}
            category={frontmatter.category}
            categoryLabel={categoryLabels[frontmatter.category] || frontmatter.category}
            date={frontmatter.date}
            readingTime={readingTime ?? 5}
            author={frontmatter.author}
            heroImage={frontmatter.heroImage}
          />

          {/* Article Content */}
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground">
                  {mdxContent}
                </div>

                {/* Tags */}
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-surface-card-border">
                    <h3 className="text-sm font-semibold text-surface-muted-foreground uppercase tracking-wide mb-4">
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-surface-card text-surface-muted-foreground border border-surface-card-border text-sm px-4 py-2 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Services */}
                {frontmatter.relatedServices && frontmatter.relatedServices.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-surface-card-border">
                    <h3 className="text-sm font-semibold text-surface-muted-foreground uppercase tracking-wide mb-4">
                      Related Services
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {frontmatter.relatedServices.map((serviceSlug) => (
                        <Link
                          key={serviceSlug}
                          href={`/services/${serviceSlug}`}
                          className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary font-medium text-sm px-4 py-2 rounded-full hover:bg-brand-primary/20 transition-colors"
                        >
                          {serviceSlug
                            .split('-')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
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

          {/* CTA */}
          <CTASection
            title="Need Professional Advice?"
            description={`Our expert team is ready to help with your requirements. Contact ${siteConfig.name} for a free consultation today.`}
            primaryButtonText="Get a Free Quote"
            primaryButtonUrl="/contact"
            secondaryButtonText="Learn More"
            secondaryButtonUrl="/services"
          />
        </article>

        {/* Related Posts */}
        <CygnusRelatedPosts posts={relatedPosts} currentSlug={frontmatter.title} />
      </div>
    </>
  );
}
