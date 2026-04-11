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

export function VegaBlogPage({ posts }: BlogPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Blog', href: '/blog', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Page Title */}
      <section className="section-standard lg:py-24 bg-surface-background">
        <div className="container-standard">
          <div className="text-center">
            <h1 className="heading-hero">Industry Insights & Expert Tips</h1>
            <p className="text-xl text-surface-foreground mb-8 mx-auto max-w-3xl">
              Professional guidance, tips, and industry news from our experienced team.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-standard bg-surface-subtle">
        <div className="container-standard">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-muted-foreground text-lg">
                No blog posts yet. Check back soon for industry insights and expert tips.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
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
                    <h2 className="text-xl font-bold text-surface-foreground mb-3 group-hover:text-brand-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-surface-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      {post.author && (
                        <span className="text-sm text-surface-muted-foreground">
                          {post.author.name}
                        </span>
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
        </div>
      </section>
    </>
  );
}
