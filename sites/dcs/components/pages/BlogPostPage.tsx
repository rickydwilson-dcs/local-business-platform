import type { BlogPostPageTemplateProps, BlogPostSummary } from '@platform/core-components';
import Link from 'next/link';

export function SiteBlogPostPage({
  frontmatter,
  mdxContent,
  relatedPosts,
  readingTime,
  breadcrumbs,
  schemaNodes,
}: BlogPostPageTemplateProps) {
  return (
    <div className="min-h-screen font-body">
      {schemaNodes}

      {/* ─── Breadcrumb ──────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="max-w-[1200px] mx-auto px-6 pt-5 pb-2">
        <ol className="flex items-center gap-1.5 text-sm text-surface-muted-foreground flex-wrap">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="select-none">
                  &gt;
                </span>
              )}
              {item.current ? (
                <span className="text-surface-foreground font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-brand-primary transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-headline text-white mb-5 leading-[1.1]">
              {frontmatter.title}
            </h1>
            <p className="text-white/70 text-sm font-body">
              <time dateTime={frontmatter.date}>{frontmatter.date}</time>
              {' · '}
              {frontmatter.author.name}
              {frontmatter.author.role && `, ${frontmatter.author.role}`}
              {readingTime && ` · ${readingTime} min read`}
            </p>
          </div>
        </div>
      </header>

      {/* ─── Two-column body ─────────────────────────────────────────────────── */}
      <section className="bg-surface-background py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* ── Left: article content + tags ─────────────────────────────── */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-surface-foreground prose-a:text-brand-primary prose-strong:text-surface-foreground">
                {mdxContent}
              </div>

              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-brand-primary/10 text-brand-primary text-xs px-3 py-1 rounded-full font-body"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: sticky sidebar ────────────────────────────────────── */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20">
                {/* CTA card */}
                <div className="bg-brand-primary text-white rounded-[20px] p-6 mb-6">
                  <h3 className="font-headline font-bold text-xl mb-2">
                    Need a website for your trade?
                  </h3>
                  <p className="text-white/80 text-sm font-body mb-5 leading-relaxed">
                    Get your trade business online with a professional website that wins more work.
                  </p>
                  <Link
                    href="/contact"
                    className="block w-full bg-white text-brand-primary text-center px-6 py-3 rounded-xl font-bold font-body text-sm hover:bg-white/90 transition-colors"
                  >
                    Get in Touch
                  </Link>
                </div>

                {/* Related posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-surface-card rounded-[20px] p-6 border border-surface-card-border">
                    <h3 className="font-headline font-bold text-lg text-surface-foreground mb-4">
                      Related posts
                    </h3>
                    <ul className="space-y-4">
                      {relatedPosts.slice(0, 3).map((post: BlogPostSummary) => (
                        <li key={post.slug}>
                          <Link href={`/blog/${post.slug}`} className="group block">
                            <p className="font-semibold text-sm text-surface-foreground font-body leading-snug group-hover:text-brand-primary transition-colors mb-1">
                              {post.title}
                            </p>
                            <time
                              dateTime={post.date}
                              className="text-surface-muted-foreground text-xs font-body"
                            >
                              {post.date}
                            </time>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-surface-foreground mb-2">
              Get your trade business online today.
            </h2>
            <p className="text-surface-foreground/70 font-body">
              A professional website that works as hard as you do.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 bg-brand-primary text-white px-10 py-4 rounded-xl text-base font-bold font-body shadow-lg hover:opacity-90 transition-opacity text-center"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
