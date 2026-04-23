/**
 * Blog Listing Page
 * =================
 *
 * Displays all blog posts.
 */

import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { Schema } from "@platform/core-components";
import { SiteBlogPage } from "@/components/pages/BlogPage";
import { getBlogPosts } from "@/lib/content";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Blog | Insights for Tradespeople | ${siteConfig.business.name}`,
  description: `Expert tips on websites, local SEO, and growing your trade business. Advice from the ${siteConfig.business.name} team.`,
  keywords: ["blog", "web design tips", "local SEO", "tradespeople", "digital marketing"],
  openGraph: {
    title: `Blog | Insights for Tradespeople`,
    description: `Expert tips on websites, local SEO, and growing your trade business.`,
    url: "/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

  return (
    <>
      <SiteBlogPage
        siteConfig={siteSummary}
        posts={posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          date: String(p.date),
          category: p.category,
          heroImage: p.heroImage,
          readingTime: p.readingTime,
          author: { name: p.author.name },
        }))}
      />

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
          description: `Expert tips on websites, local SEO, and growing your trade business.`,
        }}
      />
    </>
  );
}
