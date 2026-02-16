/**
 * Blog Post Detail Page
 * =====================
 *
 * Individual blog post page with MDX content rendering.
 * Features hero section, author bio, tags, and related posts.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Schema,
  Breadcrumbs,
  BlogPostHero,
  BlogPostCard,
  AuthorCard,
  CTASection,
} from '@platform/core-components';
import { getBlogPosts, getBlogPost, calculateReadingTime, type BlogPost } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { loadMdx } from '@/lib/mdx';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

const categoryLabels: Record<string, string> = {
  'industry-tips': 'Industry Tips',
  'how-to-guide': 'How-To Guide',
  'case-study': 'Case Study',
  seasonal: 'Seasonal',
  news: 'News',
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
      title: 'Article Not Found',
      description: 'The requested blog article could not be found.',
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
      type: 'article',
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
      card: 'summary_large_image',
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
    <section className="section-standard bg-surface-subtle">
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
  const { content: mdxContent } = await loadMdx({ baseDir: 'blog', slug });
  const allPosts = await getBlogPosts();
  const readingTime = frontmatter.readingTime || calculateReadingTime(rawContent);

  const breadcrumbItems = [
    { name: 'Blog', href: '/blog' },
    { name: frontmatter.title, href: `/blog/${slug}`, current: true },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main>
        <article>
          {/* Hero Section */}
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

          {/* Article Content */}
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                {/* Prose Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
                  {mdxContent}
                </div>

                {/* Tags */}
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-surface-border">
                    <h3 className="text-sm font-semibold text-surface-muted uppercase tracking-wide mb-4">
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-surface-subtle text-surface-muted-foreground text-sm px-4 py-2 rounded-full hover:bg-surface-border transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Services */}
                {frontmatter.relatedServices && frontmatter.relatedServices.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-surface-border">
                    <h3 className="text-sm font-semibold text-surface-muted uppercase tracking-wide mb-4">
                      Related Services
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {frontmatter.relatedServices.map((serviceSlug) => (
                        <Link
                          key={serviceSlug}
                          href={`/services/${serviceSlug}`}
                          className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary font-medium text-sm px-4 py-2 rounded-full hover:bg-brand-primary/20 transition-colors"
                        >
                          {serviceSlug
                            .split('-')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
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

          {/* CTA Section */}
          <CTASection
            title="Need Professional Advice?"
            description={`Our expert team is ready to help with your requirements. Contact ${siteConfig.business.name} for a free consultation today.`}
            primaryButtonText="Get a Free Quote"
            primaryButtonUrl="/contact"
            secondaryButtonText="Learn More"
            secondaryButtonUrl="/services"
          />
        </article>

        {/* Related Posts */}
        <RelatedPosts posts={allPosts} currentSlug={slug} />
      </main>

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: frontmatter.title, url: `/blog/${slug}` },
        ]}
        article={{
          '@type': 'BlogPosting',
          '@id': absUrl(`/blog/${slug}#article`),
          headline: frontmatter.title,
          description: frontmatter.description,
          image: frontmatter.heroImage ? getImageUrl(frontmatter.heroImage) : undefined,
          datePublished: frontmatter.date,
          dateModified: frontmatter.date,
          author: {
            '@type': 'Person',
            name: frontmatter.author.name,
            jobTitle: frontmatter.author.role,
          },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.business.name,
            logo: {
              '@type': 'ImageObject',
              url: absUrl('/logo.svg'),
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': absUrl(`/blog/${slug}`),
          },
        }}
      />
    </>
  );
}
