/**
 * Blog Listing Page
 * =================
 *
 * Blog posts in the site's dark editorial style.
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { getBlogPosts, type BlogPost } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { PageHeader } from '@/components/ui/page-header';
import { CtaBand } from '@/components/ui/cta-band';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Blog | Industry Insights & Expert Tips | ${siteConfig.business.name}`,
  description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team. Stay informed with professional advice and industry news.`,
  keywords: ['blog', 'tips', 'industry news', 'expert advice', 'guidance'],
  openGraph: {
    title: `Blog | Industry Insights & Expert Tips`,
    description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team.`,
    url: '/blog',
    type: 'website',
  },
};

const categoryLabels: Record<string, string> = {
  'industry-tips': 'Industry Tips',
  'how-to-guide': 'How-To Guide',
  'case-study': 'Case Study',
  seasonal: 'Seasonal',
  news: 'News',
};

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block bg-surface-muted overflow-hidden">
      {post.heroImage && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={getImageUrl(post.heroImage)}
            alt={post.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
        </div>
      )}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">
            {categoryLabels[post.category] || post.category}
          </span>
          <span className="text-surface-muted-foreground text-xs uppercase tracking-widest">
            {new Date(post.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          {post.readingTime && (
            <span className="text-surface-muted-foreground text-xs uppercase tracking-widest">
              {post.readingTime} min
            </span>
          )}
        </div>
        <h2 className="text-2xl font-headline font-bold text-surface-foreground mb-4 group-hover:text-brand-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-surface-muted-foreground mb-6 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-surface-muted-foreground font-body">
            {post.author.name}
          </span>
          <span className="inline-flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
            Read <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <>
      <PageHeader
        overline="Insights"
        title="From the workshop"
        description="Professional guidance, tips, and industry news from our experienced team."
      />

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-20 bg-surface-background">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16">
              <span className="label-overline mb-4 inline-block">Featured</span>
              <h2 className="text-5xl font-headline font-bold">Top articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-card-border/20">
              {featuredPosts.slice(0, 2).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-20 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
            <h2 className="text-5xl font-headline font-bold">
              {featuredPosts.length > 0 ? 'Latest articles' : 'All articles'}
            </h2>
          </div>

          {posts.length === 0 ? (
            <p className="text-surface-muted-foreground text-lg">
              No blog posts yet. Check back soon for industry insights and expert tips.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-card-border/20">
              {(featuredPosts.length > 0 ? regularPosts : posts).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        headline="Have a question?"
        subtext="Contact our team for expert advice on your project."
        primaryLabel="Get Expert Advice"
        primaryHref="/contact"
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ]}
        webpage={{
          '@type': 'Blog',
          '@id': absUrl('/blog#blog'),
          url: absUrl('/blog'),
          name: `${siteConfig.business.name} Blog`,
          description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team.`,
        }}
      />
    </>
  );
}
