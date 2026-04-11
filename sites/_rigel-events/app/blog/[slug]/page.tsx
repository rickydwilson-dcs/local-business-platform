/**
 * Blog Post Detail Page — thin wrapper
 *
 * Fetches post data and MDX content, builds schema, delegates rendering to RigelBlogPostPage.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Schema } from "@platform/core-components";
import { getBlogPosts, getBlogPost, calculateReadingTime } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { loadMdx } from "@/lib/mdx";
import { siteConfig } from "@/site.config";
import type { SiteConfigSummary, BlogPostSummary, BreadcrumbItem } from "@platform/core-components";
import { RigelBlogPostPage } from "@platform/themes/rigel/pages";

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

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content: rawContent } = post;
  const { content: mdxContent } = await loadMdx({ baseDir: "blog", slug });
  const allPosts = await getBlogPosts();
  const readingTime = frontmatter.readingTime || calculateReadingTime(rawContent);

  const relatedPosts: BlogPostSummary[] = allPosts
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

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Blog", href: "/blog" },
    { name: frontmatter.title, href: `/blog/${slug}`, current: true },
  ];

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
      <RigelBlogPostPage
        siteConfig={siteSummary}
        frontmatter={{
          title: frontmatter.title,
          description: frontmatter.description,
          date: frontmatter.date,
          category: frontmatter.category,
          heroImage: frontmatter.heroImage,
          author: frontmatter.author,
          tags: frontmatter.tags,
        }}
        mdxContent={mdxContent}
        relatedPosts={relatedPosts}
        breadcrumbs={breadcrumbs}
        slug={slug}
        readingTime={readingTime}
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
    </>
  );
}
