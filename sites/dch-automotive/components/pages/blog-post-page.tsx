import type { BlogPostPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { CtaBand } from '@/components/cta-band';

const categoryLabels: Record<string, string> = {
  'industry-tips': 'Industry Tips',
  'how-to-guide': 'How-To Guide',
  'case-study': 'Case Study',
  seasonal: 'Seasonal',
  news: 'News',
};

export function BlogPostPage({
  siteConfig,
  frontmatter,
  mdxContent,
  relatedPosts,
  readingTime,
  breadcrumbs,
  schemaNodes,
}: BlogPostPageTemplateProps) {
  return (
    <>
      {schemaNodes}

      <BreadcrumbBar items={breadcrumbs} />

      <article>
        {/* Hero */}
        <section className="py-16 sm:py-24 container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6 text-xs uppercase tracking-widest">
              <span className="bg-brand-primary/10 text-brand-primary font-bold px-3 py-1">
                {categoryLabels[frontmatter.category] || frontmatter.category}
              </span>
              <span className="text-white/40">
                {new Date(frontmatter.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="text-white/40">{readingTime ?? 0} min read</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase tracking-tight mb-6">
              {frontmatter.title}
            </h1>
            <div className="w-20 h-1.5 bg-brand-primary mb-6" />
            {frontmatter.description && (
              <p className="text-xl text-white/80 leading-relaxed">{frontmatter.description}</p>
            )}
          </div>
        </section>

        {frontmatter.heroImage && (
          <div className="container mx-auto px-6 mb-16">
            <div className="max-w-4xl mx-auto aspect-[16/9] relative overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
              <img
                className="w-full h-full object-cover"
                alt={frontmatter.title}
                src={frontmatter.heroImage}
              />
            </div>
          </div>
        )}

        {/* Article content */}
        <section className="pb-16 sm:pb-24 container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h3:text-xl prose-p:text-white/70 prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-white/70 prose-li:marker:text-brand-primary prose-img:rounded-none prose-img:border prose-img:border-white/10 prose-img:my-8">
              {mdxContent}
            </div>

            {/* Tags */}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-surface-card border border-surface-card-border text-white/70 text-sm px-4 py-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related services */}
            {frontmatter.relatedServices && frontmatter.relatedServices.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                  Related Services
                </h3>
                <div className="flex flex-wrap gap-3">
                  {frontmatter.relatedServices.map((serviceSlug) => (
                    <Link
                      key={serviceSlug}
                      href={`/services/${serviceSlug}`}
                      className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary font-bold uppercase tracking-wide text-sm px-4 py-2 hover:bg-brand-primary/20 transition-colors"
                    >
                      {serviceSlug
                        .split('-')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author */}
            <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-heading font-bold text-brand-primary flex-shrink-0">
                {frontmatter.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-bold uppercase tracking-wide text-sm">
                  {frontmatter.author.name}
                </p>
                {frontmatter.author.role && (
                  <p className="text-xs text-white/40 uppercase">{frontmatter.author.role}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <CtaBand
          siteConfig={siteConfig}
          title="Need Professional Advice?"
          description={`Contact ${siteConfig.name} for a free consultation today.`}
        />
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 sm:py-24 bg-[#080807] border-y border-white/5">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">
              Related Articles
            </h2>
            <div className="w-20 h-1.5 bg-brand-primary mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-surface-card border border-surface-card-border hover:border-brand-primary transition-all"
                >
                  {post.heroImage && (
                    <div className="h-40 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={post.title}
                        src={post.heroImage}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-heading font-bold uppercase mb-2">{post.title}</h3>
                    <p className="text-white/60 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
