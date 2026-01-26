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
            title={frontmatter.title}
            excerpt={frontmatter.excerpt}
            category={frontmatter.category}
            categoryLabel={categoryLabels[frontmatter.category] || frontmatter.category}
            date={frontmatter.date}
            readingTime={readingTime}
            author={frontmatter.author}
            heroImage={frontmatter.heroImage}
          />

          {/* Article Content - Two Column Layout */}
          <section className="section-standard bg-white">
            <div className="container-standard">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12 max-w-7xl mx-auto">
                {/* Main Content Column */}
                <div className="min-w-0">
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

                {/* Sidebar Column - Sticky on Desktop */}
                <aside className="hidden lg:block">
                  <div className="sticky top-24 space-y-6">
                    {/* CTA Card */}
                    <div className="bg-gradient-to-br from-brand-blue to-brand-blue-hover rounded-2xl p-6 text-white shadow-lg">
                      <h3 className="text-xl font-bold mb-3">Need Expert Scaffolding?</h3>
                      <p className="text-sm text-white/90 mb-4 leading-relaxed">
                        Get a free consultation and quote from our CISRS-qualified team across the
                        South East.
                      </p>
                      <Link
                        href="/contact"
                        className="block w-full bg-white text-brand-blue text-center font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Get Free Quote
                      </Link>
                      <Link
                        href="/contact"
                        className="block w-full mt-3 bg-white/10 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                      >
                        Request Survey
                      </Link>
                    </div>

                    {/* Quick Info Card */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-brand-blue"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Why Choose Us
                      </h4>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>TG20:21 Compliant</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>£10M Public Liability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>CHAS Accredited</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Free Site Surveys</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>
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
