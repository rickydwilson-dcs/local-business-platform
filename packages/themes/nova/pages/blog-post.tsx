import type { BlogPostPageTemplateProps, BlogPostSummary } from '@platform/core-components';
import Link from 'next/link';
import {
  Breadcrumbs,
  BlogPostHero,
  BlogPostCard,
  AuthorCard,
  CTASection,
} from '@platform/core-components';

const categoryLabels: Record<string, string> = {
  'industry-tips': 'Industry Tips',
  'how-to-guide': 'How-To Guide',
  'case-study': 'Case Study',
  seasonal: 'Seasonal',
  news: 'News',
};

function NovaRelatedPosts({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="section-standard bg-surface-subtle">
      <div className="container-standard">
        <h2 className="text-2xl font-bold text-surface-foreground mb-8">Related Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
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

export function NovaBlogPostPage({
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
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbs} />
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
                {/* Prose Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
                  {mdxContent}
                </div>

                {/* Tags */}
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-surface-border">
                    <h3 className="text-sm font-bold text-surface-muted-foreground uppercase tracking-wide mb-4">
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-brand-primary/10 text-brand-primary text-sm px-4 py-2 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Services */}
                {frontmatter.relatedServices && frontmatter.relatedServices.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-surface-border">
                    <h3 className="text-sm font-bold text-surface-muted-foreground uppercase tracking-wide mb-4">
                      Related Services
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {frontmatter.relatedServices.map((serviceSlug) => (
                        <Link
                          key={serviceSlug}
                          href={`/services/${serviceSlug}`}
                          className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary font-semibold text-sm px-4 py-2 rounded-full hover:bg-brand-primary/20 transition-colors"
                        >
                          {serviceSlug
                            .split('-')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
                          &rarr;
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

          {/* CTA Section */}
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
        <NovaRelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}
