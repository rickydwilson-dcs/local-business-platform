import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Schema from "@/components/Schema";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { BlogPostHero } from "@/components/ui/blog-post-hero";
import { BlogPostCard } from "@/components/ui/blog-post-card";
import { AuthorCard } from "@/components/ui/author-card";
import { ServiceCTA } from "@/components/ui/service-cta";
import { getBlogPosts, getBlogPost, calculateReadingTime, type BlogPost } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { loadMdx } from "@/lib/mdx";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

const categoryLabels: Record<string, string> = {
  "industry-tips": "Industry Tips",
  "how-to-guide": "How-To Guide",
  "case-study": "Case Study",
  seasonal: "Seasonal",
  news: "News",
};

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
    title: frontmatter.seoTitle || `${frontmatter.title} | Colossus Scaffolding Blog`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    authors: [{ name: frontmatter.author.name }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: absUrl(`/blog/${slug}`),
      siteName: "Colossus Scaffolding",
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

function RelatedPosts({ posts, currentSlug }: { posts: BlogPost[]; currentSlug: string }) {
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="section-standard bg-gray-50">
      <div className="container-standard">
        <div className="section-header">
          <h2 className="heading-section">Related Articles</h2>
          <p className="text-subtitle mx-auto max-w-2xl">
            Continue reading with more expert insights and industry guidance
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {related.map((post) => (
            <BlogPostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              heroImage={post.heroImage}
              date={post.date}
              readingTime={post.readingTime}
              category={post.category}
              categoryLabel={categoryLabels[post.category] || post.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
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

  const breadcrumbItems = [
    { name: "Blog", href: "/blog" },
    { name: frontmatter.title, href: `/blog/${slug}`, current: true },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main>
        <article>
          {/* Hero Section - Matches ServiceHero pattern */}
          <BlogPostHero
            variant="blog"
            title={frontmatter.title}
            excerpt={frontmatter.excerpt}
            category={frontmatter.category}
            categoryLabel={categoryLabels[frontmatter.category] || frontmatter.category}
            date={frontmatter.date}
            readingTime={readingTime}
            author={frontmatter.author}
            heroImage={frontmatter.heroImage}
          />

          {/* Article Content - Single Column Layout */}
          <section className="section-standard bg-white">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                {/* Prose Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-li:text-gray-700 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
                  {mdxContent}
                </div>

                {/* Tags */}
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Services */}
                {frontmatter.relatedServices && frontmatter.relatedServices.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                      Related Services
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {frontmatter.relatedServices.map((serviceSlug) => (
                        <Link
                          key={serviceSlug}
                          href={`/services/${serviceSlug}`}
                          className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue font-medium text-sm px-4 py-2 rounded-full hover:bg-brand-blue/20 transition-colors"
                        >
                          {serviceSlug
                            .split("-")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio */}
                <div className="mt-12">
                  <AuthorCard name={frontmatter.author.name} role={frontmatter.author.role} />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section - Reusing ServiceCTA component */}
          <ServiceCTA
            title="Need Professional Scaffolding Advice?"
            description="Our expert team is ready to help with your scaffolding requirements across the South East. Get a free consultation and quote today."
            primaryAction="Get Free Quote"
            primaryUrl="/contact"
          />
        </article>

        {/* Related Posts */}
        <RelatedPosts posts={allPosts} currentSlug={slug} />
      </main>

      <Schema
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg",
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
            name: "Colossus Scaffolding",
            logo: {
              "@type": "ImageObject",
              url: absUrl("/Colossus-Scaffolding-Logo.svg"),
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
