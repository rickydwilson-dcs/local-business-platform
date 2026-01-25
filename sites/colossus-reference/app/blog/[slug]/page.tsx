import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Schema from "@/components/Schema";
import Breadcrumbs from "@/components/ui/breadcrumbs";
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
        <h2 className="heading-section mb-8">Related Articles</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {related.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.heroImage && (
                <Link href={`/blog/${post.slug}`} className="block relative h-40 overflow-hidden">
                  <Image
                    src={getImageUrl(post.heroImage)}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
              )}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-brand-blue transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
              </div>
            </article>
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
        {/* Hero Section */}
        <article>
          <header className="section-standard bg-white">
            <div className="container-standard max-w-4xl">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="bg-brand-blue text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                  {categoryLabels[frontmatter.category] || frontmatter.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {frontmatter.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 mb-8">{frontmatter.excerpt}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-semibold">
                    {frontmatter.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{frontmatter.author.name}</p>
                    {frontmatter.author.role && (
                      <p className="text-sm text-gray-500">{frontmatter.author.role}</p>
                    )}
                  </div>
                </div>
                <span className="text-gray-300">|</span>
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span className="text-gray-300">|</span>
                <span>{readingTime} min read</span>
              </div>

              {/* Hero Image */}
              {frontmatter.heroImage && (
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
                  <Image
                    src={getImageUrl(frontmatter.heroImage)}
                    alt={frontmatter.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <section className="section-standard bg-white pt-0">
            <div className="container-standard max-w-4xl">
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-li:text-gray-700">
                {mdxContent}
              </div>

              {/* Tags */}
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Services */}
              {frontmatter.relatedServices && frontmatter.relatedServices.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
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
              <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {frontmatter.author.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{frontmatter.author.name}</h3>
                    {frontmatter.author.role && (
                      <p className="text-gray-600 mb-2">{frontmatter.author.role}</p>
                    )}
                    <p className="text-gray-600 text-sm">
                      Our team of scaffolding professionals share their expertise to help you make
                      informed decisions about your construction and maintenance projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-compact bg-brand-blue">
            <div className="container-standard text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Need Professional Scaffolding Advice?
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Our expert team is ready to help with your scaffolding requirements across the South
                East.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-blue font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Free Quote
              </Link>
            </div>
          </section>
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
