/**
 * RigelBlogPage — Blog listing template
 *
 * Displays featured posts section followed by all posts grid.
 * All post data passed as props — no content loading inside this component.
 */

import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@platform/core-components";
import type { RigelBlogPageTemplateProps, BlogPostSummary, BreadcrumbItem } from "@platform/core-components";

const categoryLabels: Record<string, string> = {
  "industry-tips": "Industry Tips",
  "how-to-guide": "How-To Guide",
  "case-study": "Case Study",
  seasonal: "Seasonal",
  news: "News",
};

export interface RigelBlogPageProps extends RigelBlogPageTemplateProps {
  breadcrumbs?: BreadcrumbItem[];
}

function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="bg-surface-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group border border-surface-border">
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
            <span className="bg-brand-primary text-brand-on-primary text-xs font-semibold px-3 py-1 rounded-full">
              {categoryLabels[post.category] ?? post.category}
            </span>
          </div>
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-surface-muted mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          {post.readingTime && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>
        <h2 className="text-xl font-bold text-surface-foreground mb-3 group-hover:text-brand-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-surface-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          {post.author && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-brand-on-primary text-sm font-semibold" aria-hidden="true">
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
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function RigelBlogPage({ siteConfig, posts, breadcrumbs }: RigelBlogPageProps) {
  const featuredPosts = posts.filter((p) => p.category !== undefined).slice(0, 2);
  const allPosts = posts;
  const regularPosts = allPosts.filter((_, i) => i >= 2);

  const crumbs: BreadcrumbItem[] = breadcrumbs ?? [{ name: "Blog", href: "/blog", current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-surface-subtle to-surface-background">
        {/* Hero Section */}
        <section className="section-standard lg:py-24 bg-surface-background">
          <div className="container-standard">
            <div className="text-center">
              <h1 className="heading-hero">Industry Insights &amp; Expert Tips</h1>
              <p className="text-xl text-surface-foreground mb-8 mx-auto max-w-3xl">
                Professional guidance, tips, and industry news from the {siteConfig.name} team.
                Stay informed with the latest insights.
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
                {featuredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <h2 className="heading-section mb-8">
              {featuredPosts.length > 0 ? "Latest Articles" : "All Articles"}
            </h2>

            {allPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-surface-muted-foreground text-lg">
                  No blog posts yet. Check back soon for industry insights and expert tips.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(featuredPosts.length > 0 ? regularPosts : allPosts).map((post) => (
                  <BlogCard key={post.slug} post={post} />
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
