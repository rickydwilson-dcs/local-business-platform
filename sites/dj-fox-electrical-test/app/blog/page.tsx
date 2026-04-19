import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";
import { getBlogPosts } from "@/lib/content";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Blog | Industry Insights & Expert Tips | D J Fox Electrical",
  description:
    "Expert insights, tips, and guidance from the D J Fox Electrical team. Stay informed with professional advice and industry news.",
  keywords: ["blog", "tips", "industry news", "expert advice", "guidance"],
  openGraph: {
    title: "Blog | Industry Insights & Expert Tips",
    description: "Expert insights, tips, and guidance from the D J Fox Electrical team.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const data = {
    ...(siteData as unknown as Record<string, unknown>),
    blog: {
      ...((siteData as unknown as Record<string, unknown>).blog as Record<string, unknown>),
      posts: posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? p.description,
        date: p.date,
        category: p.category,
        heroImage: p.heroImage,
        readingTime: p.readingTime,
        featured: p.featured,
      })),
    },
  };
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "blog",
    data,
  });
  return <main className="min-h-screen">{elements}</main>;
}
