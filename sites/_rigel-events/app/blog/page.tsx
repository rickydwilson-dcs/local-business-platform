/**
 * Blog Listing Page — thin wrapper
 *
 * Fetches blog posts, builds schema, delegates rendering to RigelBlogPage.
 */

import type { Metadata } from "next";
import { Schema } from "@platform/core-components";
import { getBlogPosts } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import type { SiteConfigSummary, BlogPostSummary, BreadcrumbItem } from "@platform/core-components";
import { RigelBlogPage } from "@platform/themes/rigel/pages";

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

  const posts: BlogPostSummary[] = rawPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    category: post.category,
    heroImage: post.heroImage,
    readingTime: post.readingTime,
    author: post.author ? { name: post.author.name } : undefined,
  }));

  const breadcrumbs: BreadcrumbItem[] = [{ name: "Blog", href: "/blog", current: true }];

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone ?? "",
    phoneDisplay: siteConfig.business.phone ?? "",
    address: {
      city: siteConfig.business.address.city,
      county: siteConfig.business.address.region,
    },
    cta: siteConfig.cta,
    stats: siteConfig.credentials.stats,
  };

  return (
    <>
      <RigelBlogPage siteConfig={siteSummary} posts={posts} breadcrumbs={breadcrumbs} />

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
