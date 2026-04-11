/**
 * Blog Listing Page
 * =================
 *
 * Displays all blog posts.
 */

import type { Metadata } from "next";
import type { SiteConfigSummary } from "@platform/core-components";
import { Schema } from "@platform/core-components";
import { NovaBlogPage } from "@platform/themes/nova/pages";
import { getBlogPosts } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";

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
      <NovaBlogPage
        siteConfig={siteSummary}
        posts={posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          date: p.date,
          category: p.category,
          heroImage: p.heroImage ? getImageUrl(p.heroImage) : undefined,
          readingTime: p.readingTime,
          author: p.author ? { name: p.author.name } : undefined,
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
          description: `Expert insights, tips, and guidance from the ${siteConfig.business.name} team.`,
        }}
      />
    </>
  );
}
