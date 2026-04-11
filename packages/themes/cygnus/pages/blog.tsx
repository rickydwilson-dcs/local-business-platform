import type { BlogPageTemplateProps, BlogPostSummary } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

const categoryLabels: Record<string, string> = {
  'industry-tips': 'Industry Tips',
  'how-to-guide': 'How-To Guide',
  'case-study': 'Case Study',
  seasonal: 'Seasonal',
  news: 'News',
};

function CygnusBlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="bg-surface-card border border-surface-card-border rounded-2xl overflow-hidden hover:border-brand-primary hover:shadow-xl transition-all group">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-brand-primary text-on-brand-primary text-xs font-semibold px-3 py-1 rounded-full">
            {categoryLabels[post.category] || post.category}
          </span>
          <time dateTime={post.date} className="text-sm text-surface-muted-foreground">
            {new Date(post.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          {post.readingTime && (
            <span className="text-sm text-surface-muted-foreground">{post.readingTime} min read</span>
          )}
        </div>
        <h2 className="text-xl font-bold text-surface-foreground mb-3 group-hover:text-brand-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-surface-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          {post.author && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-on-brand-primary text-sm font-semibold">
                {post.author.name.charAt(0)}
              </div>
              <span className="text-sm text-surface-muted-foreground">{post.author.name}</span>
            </div>
          )}
          <Link
            href={`/blog/${post.slug}`}
            className="text-brand-primary font-medium text-sm hover:underline inline-flex items-center gap-1"
          >
            Read more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CygnusBlogPage({ siteConfig, posts }: BlogPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Blog', href: '/blog', current: true }];
  const featuredPosts = posts.filter((_, i) => i < 2);
  const remainingPosts = posts.slice(2);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-card-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero */}
        <section className="section-standard bg-surface-inverse">
          <div className="container-standard text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-surface-foreground">
              Industry Insights &amp; Expert Tips
            </h1>
            <p className="text-xl text-surface-secondary-foreground mb-8 mx-auto max-w-3xl">
              Professional guidance, tips, and industry news from our experienced team. Stay
              informed with the latest insights from {siteConfig.name}.
            </p>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <h2 className="text-2xl font-bold text-surface-foreground mb-8">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <CygnusBlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="section-standard bg-surface-muted">
          <div className="container-standard">
            <h2 className="text-2xl font-bold text-surface-foreground mb-8">
              {featuredPosts.length > 0 ? 'Latest Articles' : 'All Articles'}
            </h2>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-surface-muted-foreground text-lg">
                  No blog posts yet. Check back soon for industry insights and expert tips.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(featuredPosts.length > 0 ? remainingPosts : posts).map((post) => (
                  <CygnusBlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-surface-foreground mb-6">Have a question? Contact our expert team.</p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-on-brand-primary font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors"
              >
                Get Expert Advice
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
