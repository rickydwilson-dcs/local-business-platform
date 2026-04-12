import type { BlogPageTemplateProps, BlogPostSummary } from '@platform/core-components';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@platform/core-components';

const categoryLabels: Record<string, string> = {
  'industry-tips': 'Industry Tips',
  'how-to-guide': 'How-To Guide',
  'case-study': 'Case Study',
  seasonal: 'Seasonal',
  news: 'News',
};

function NovaBlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="bg-surface-card border border-surface-cardBorder rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
      {post.heroImage && (
        <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              {categoryLabels[post.category] || post.category}
            </span>
          </div>
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-surface-muted-foreground mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          {post.readingTime && (
            <>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>
        <h2 className="text-xl font-bold text-surface-foreground mb-3 group-hover:text-brand-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-surface-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
        {post.author && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                {post.author.name.charAt(0)}
              </div>
              <span className="text-sm text-surface-muted-foreground">{post.author.name}</span>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="text-brand-primary font-semibold text-sm hover:underline inline-flex items-center gap-1"
            >
              Read more &rarr;
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export function NovaBlogPage({ siteConfig, posts }: BlogPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Blog', href: '/blog', current: true }];
  const featuredPosts = posts.filter((p) => p.heroImage);
  const regularPosts = posts;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-brand-primary py-16 md:py-24">
        <div className="container-standard text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Industry Insights &amp; Expert Tips
          </h1>
          <p className="text-xl text-white/90 mx-auto max-w-3xl">
            Professional guidance, tips, and industry news from our experienced team. Stay informed
            with the latest insights from {siteConfig.name}.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-standard bg-surface-background">
        <div className="container-standard">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-muted-foreground text-lg">
                No blog posts yet. Check back soon for industry insights and expert tips.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <NovaBlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-surface-foreground mb-6">Have a question? Contact our expert team.</p>
            <Link
              href="/contact"
              className="inline-block bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-primary-hover transition-colors"
            >
              Get Expert Advice
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
