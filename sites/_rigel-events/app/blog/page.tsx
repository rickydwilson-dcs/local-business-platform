/**
 * Blog Listing Page
 *
 * Fetches blog posts and renders with corvus theme layout.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Schema } from "@platform/core-components";
import { getBlogPosts } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { PageTitleBanner } from "@platform/themes/corvus/components";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Blog | Industry Insights & Expert Tips | ${siteConfig.business.name}`,
  description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team. Stay informed with professional advice and industry news.`,
  keywords: ["blog", "tips", "industry news", "expert advice", "guidance"],
  openGraph: {
    title: `Blog | Industry Insights & Expert Tips`,
    description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team.`,
    url: "/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const rawPosts = await getBlogPosts();

  const posts = rawPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    category: post.category,
    heroImage: post.heroImage,
    readingTime: post.readingTime,
    author: post.author ? { name: post.author.name } : undefined,
  }));

  return (
    <>
      <PageTitleBanner pageTitle="Blog" />

      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-muted-foreground text-lg">
                No blog posts yet. Check back soon for articles and insights.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-surface-card border border-surface-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2 block">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-surface-foreground mb-2 group-hover:text-brand-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-surface-muted-foreground text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-surface-muted-foreground">
                      {post.date && <span>{post.date}</span>}
                      {post.readingTime && <span>&middot; {post.readingTime} min read</span>}
                      {post.author && <span>&middot; {post.author.name}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Schema
        org={{
          name: siteConfig.business.name,
          url: "/",
          logo: "/logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
        webpage={{
          "@type": "Blog",
          "@id": absUrl("/blog#blog"),
          url: absUrl("/blog"),
          name: `${siteConfig.business.name} Blog`,
          description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team.`,
        }}
      />
    </>
  );
}
