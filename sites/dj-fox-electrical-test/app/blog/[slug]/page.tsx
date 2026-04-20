/**
 * Blog Post Detail Page — composition renderer version
 */

import { notFound } from "next/navigation";

const CATEGORY_LABELS: Record<string, string> = {
  "industry-tips": "Industry Tips",
  "how-to-guide": "How-To Guide",
  "case-study": "Case Study",
  seasonal: "Seasonal",
  news: "News",
};
import type { Metadata } from "next";
import { Schema } from "@platform/core-components";
import { getBlogPosts, getBlogPost, calculateReadingTime } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { loadMdx } from "@/lib/mdx";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY } from "@/lib/contact-info";
import compositionConfig from "../../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested blog article could not be found.",
    };
  }

  const { frontmatter } = post;

  return {
    title: frontmatter.seoTitle || `${frontmatter.title} | ${siteConfig.business.name} Blog`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    authors: [{ name: frontmatter.author.name }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: absUrl(`/blog/${slug}`),
      siteName: siteConfig.business.name,
      type: "article",
      publishedTime: frontmatter.date,
      authors: [frontmatter.author.name],
      images: frontmatter.heroImage
        ? [
            {
              url: getImageUrl(frontmatter.heroImage),
              width: 1200,
              height: 630,
              alt: frontmatter.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: frontmatter.heroImage ? [getImageUrl(frontmatter.heroImage)] : undefined,
    },
    alternates: {
      canonical: absUrl(`/blog/${slug}`),
    },
  };
}

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content: rawContent } = post;
  const { content } = await loadMdx({ baseDir: "blog", slug });
  const allPosts = await getBlogPosts();
  const readingTime = frontmatter.readingTime || calculateReadingTime(rawContent);

  const schemaNodes = (
    <Schema
      org={{
        name: siteConfig.business.name,
        url: "/",
        logo: "/logo.svg",
      }}
      breadcrumbs={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: frontmatter.title, url: `/blog/${slug}` },
      ]}
      article={{
        "@type": "BlogPosting",
        "@id": absUrl(`/blog/${slug}#article`),
        headline: frontmatter.title,
        description: frontmatter.description,
        image: frontmatter.heroImage ? getImageUrl(frontmatter.heroImage) : undefined,
        datePublished: frontmatter.date,
        dateModified: frontmatter.date,
        author: {
          "@type": "Person",
          name: frontmatter.author.name,
          jobTitle: frontmatter.author.role,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.business.name,
          logo: {
            "@type": "ImageObject",
            url: absUrl("/logo.svg"),
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": absUrl(`/blog/${slug}`),
        },
      }}
    />
  );

  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      category: p.category,
      heroImage: p.heroImage,
      readingTime: p.readingTime,
      author: p.author ? { name: p.author.name } : undefined,
    }));

  const { elements } = renderComposedPage({
    composition: config,
    pageType: "blog-post",
    data: {
      ...(siteData as unknown as Record<string, unknown>),
      ...frontmatter,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      category: frontmatter.category,
      heroImage: frontmatter.heroImage,
      hero: {
        heading: frontmatter.title,
        subheading: frontmatter.description || "",
        eyebrow: CATEGORY_LABELS[frontmatter.category] ?? frontmatter.category ?? "Blog",
        image: frontmatter.heroImage,
        heroImageSrc: frontmatter.heroImage,
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: frontmatter.title, href: `/blog/${slug}` },
        ],
      },
      author: frontmatter.author,
      tags: frontmatter.tags,
      relatedServices: frontmatter.relatedServices,
      relatedPosts,
      readingTime,
      mdxContent: { content },
      phone: siteConfig.business.phone,
      phoneDisplay: PHONE_DISPLAY,
    },
  });

  return (
    <>
      {schemaNodes}
      <main className="min-h-screen">{elements}</main>
    </>
  );
}
