import type { BlogPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

const categoryLabels: Record<string, string> = {
  'industry-tips': 'Industry Tips',
  'how-to-guide': 'How-To Guide',
  'case-study': 'Case Study',
  seasonal: 'Seasonal',
  news: 'News',
};

export function OrionBlogPage({ siteConfig, posts }: BlogPageTemplateProps) {
  const featuredPosts = posts.filter((p) => (p as { featured?: boolean }).featured);
  const regularPosts = posts.filter((p) => !(p as { featured?: boolean }).featured);

  const breadcrumbItems = [{ name: 'Blog', href: '/blog', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-surface-subtle to-surface-background">
        {/* Hero Section */}
        <section className="section-standard lg:py-24 bg-surface-background">
          <div className="container-standard">
            <div className="text-center">
              <h1 className="heading-hero">Industry Insights & Expert Tips</h1>
              <p className="text-xl text-surface-foreground mb-8 mx-auto max-w-3xl">
                Professional guidance, tips, and industry news from our experienced team. Stay
                informed with the latest insights from {siteConfig.name}.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <h2 className="heading-section mb-8">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 2).map((post) => (
                  <article
                    key={post.slug}
                    className="bg-surface-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group border border-surface-border"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-surface-muted-foreground mb-3">
                        <span className="bg-brand-primary text-brand-on-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {categoryLabels[post.category] || post.category}
                        </span>
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold text-surface-foreground mb-3 group-hover:text-brand-primary transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-surface-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        {post.author && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-brand-on-primary text-sm font-semibold">
                              {post.author.name.charAt(0)}
                            </div>
                            <span className="text-sm text-surface-muted-foreground">{post.author.name}</span>
                          </div>
                        )}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-brand-primary font-medium text-sm hover:underline"
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <h2 className="heading-section mb-8">
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
                {(featuredPosts.length > 0 ? regularPosts : posts).map((post) => (
                  <article
                    key={post.slug}
                    className="bg-surface-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group border border-surface-border"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-surface-muted-foreground mb-3">
                        <span className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {categoryLabels[post.category] || post.category}
                        </span>
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold text-surface-foreground mb-3 group-hover:text-brand-primary transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-surface-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        {post.author && (
                          <span className="text-sm text-surface-muted-foreground">{post.author.name}</span>
                        )}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-brand-primary font-medium text-sm hover:underline"
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-surface-foreground mb-6">
                Have a question? Contact our expert team.
              </p>
              <Link href="/contact" className="btn-primary-lg">
                Get Expert Advice
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
