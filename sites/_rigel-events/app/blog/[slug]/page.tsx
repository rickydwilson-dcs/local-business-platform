/**
 * Blog Post Detail Page
 *
 * Fetches post data and MDX content, renders with corvus theme layout.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Schema } from "@platform/core-components";
import { getBlogPosts, getBlogPost, calculateReadingTime } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { loadMdx } from "@/lib/mdx";
import { siteConfig } from "@/site.config";
import { PageTitleBanner } from "@platform/themes/corvus/components";

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

  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      category: p.category,
    }));

  return (
    <>
      <PageTitleBanner pageTitle={frontmatter.title} />

      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-surface-muted-foreground">
            <Link href="/" className="hover:text-brand-primary transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-brand-primary transition-colors">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-surface-foreground">{frontmatter.title}</span>
          </nav>

          {/* Post meta */}
          <div className="flex flex-wrap gap-4 items-center text-sm text-surface-muted-foreground mb-8">
            {frontmatter.category && (
              <span className="text-brand-primary font-semibold uppercase tracking-wider text-xs">
                {frontmatter.category}
              </span>
            )}
            {frontmatter.date && <span>{frontmatter.date}</span>}
            {readingTime && <span>{readingTime} min read</span>}
            {frontmatter.author && <span>By {frontmatter.author.name}</span>}
          </div>

          {/* MDX content */}
          <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary">
            {mdxContent}
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-surface-border">
              <h2 className="text-2xl font-bold text-surface-foreground mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group bg-surface-card border border-surface-border rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors mb-2">
                      {rp.title}
                    </h3>
                    {rp.excerpt && (
                      <p className="text-surface-muted-foreground text-sm line-clamp-2">
                        {rp.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-surface-border">
            <Link
              href="/blog"
              className="text-brand-primary font-semibold hover:text-brand-primary-hover transition-colors"
            >
              &larr; Back to all posts
            </Link>
          </div>
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
