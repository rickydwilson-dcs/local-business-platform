import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Schema from "@/components/Schema";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { getBlogPosts, type BlogPost } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Scaffolding Blog | Industry Insights & Expert Tips",
  description:
    "Expert scaffolding insights, safety tips, and industry guidance from the Colossus Scaffolding team. Stay informed with our professional advice.",
  keywords: [
    "scaffolding blog",
    "scaffolding tips",
    "construction safety",
    "scaffolding industry news",
    "TG20:21 guidance",
  ],
  openGraph: {
    title: "Scaffolding Blog | Industry Insights & Expert Tips",
    description:
      "Expert scaffolding insights, safety tips, and industry guidance from the Colossus Scaffolding team.",
    url: "/blog",
    type: "website",
  },
  alternates: {
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
};

const categoryLabels: Record<string, string> = {
  "industry-tips": "Industry Tips",
  "how-to-guide": "How-To Guide",
  "case-study": "Case Study",
  seasonal: "Seasonal",
  news: "News",
};

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      {post.heroImage && (
        <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
          <Image
            src={getImageUrl(post.heroImage)}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-brand-blue text-white text-xs font-semibold px-3 py-1 rounded-full">
              {categoryLabels[post.category] || post.category}
            </span>
          </div>
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          {post.readingTime && (
            <>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {post.author.name.charAt(0)}
            </div>
            <span className="text-sm text-gray-600">{post.author.name}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-brand-blue font-medium text-sm hover:underline inline-flex items-center gap-1"
          >
            Read more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  const breadcrumbItems = [{ name: "Blog", href: "/blog", current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Hero Section */}
        <section className="section-standard lg:py-24 bg-white">
          <div className="container-standard">
            <div className="text-center">
              <h1 className="heading-hero">Industry Insights & Expert Tips</h1>
              <p className="text-xl text-gray-800 mb-8 mx-auto max-w-3xl">
                Professional scaffolding guidance, safety tips, and industry news from our
                experienced team. Stay informed with the latest insights from Colossus Scaffolding.
              </p>

              <Link
                href="/blog/rss.xml"
                className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-hover font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
                  <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z" />
                </svg>
                Subscribe via RSS
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="section-standard bg-white">
            <div className="container-standard">
              <h2 className="heading-section mb-8">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 2).map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="section-standard bg-gray-50">
          <div className="container-standard">
            <h2 className="heading-section mb-8">
              {featuredPosts.length > 0 ? "Latest Articles" : "All Articles"}
            </h2>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No blog posts yet. Check back soon for industry insights and expert tips.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(featuredPosts.length > 0 ? regularPosts : posts).map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-gray-800 mb-6">
                Have a question about scaffolding? Contact our expert team.
              </p>
              <Link href="/contact" className="btn-primary-lg">
                Get Expert Advice
              </Link>
            </div>
          </div>
        </section>
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
        ]}
        webpage={{
          "@type": "Blog",
          "@id": absUrl("/blog#blog"),
          url: absUrl("/blog"),
          name: "Colossus Scaffolding Blog",
          description:
            "Expert scaffolding insights, safety tips, and industry guidance from the Colossus Scaffolding team.",
        }}
      />
    </>
  );
}
