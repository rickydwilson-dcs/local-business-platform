import type { BlogPageTemplateProps } from '@platform/core-components';
import Image from 'next/image';
import Link from 'next/link';

function isResolvableImageSrc(src?: string): src is string {
  return !!src && (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://'));
}

export function SiteBlogPage({ posts }: BlogPageTemplateProps) {
  return (
    <div className="min-h-screen font-sans">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-secondary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-heading text-white mb-4 leading-[1.1]">
              Blog &amp; Guides
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-sans leading-relaxed">
              Tips, guides, and industry insights for tradespeople.
            </p>
          </div>
        </div>
      </header>

      {/* ─── Posts Grid ──────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-surface-muted-foreground text-lg font-sans">
                No posts yet — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-surface-card rounded-[20px] shadow-md border border-surface-card-border overflow-hidden transition-transform hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  {isResolvableImageSrc(post.heroImage) && (
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-muted">
                      <Image
                        src={post.heroImage}
                        alt={`${post.title} — thumbnail`}
                        width={400}
                        height={300}
                        quality={58}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Colored strip */}
                  <div className="bg-brand-accent/10 px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <time
                        dateTime={post.date}
                        className="text-surface-muted-foreground text-xs font-sans"
                      >
                        {post.date}
                      </time>
                      <span className="bg-brand-primary/15 text-brand-primary text-xs font-semibold font-sans px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h2 className="font-heading font-bold text-lg text-surface-foreground mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-surface-muted-foreground text-sm leading-relaxed font-sans line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    {post.readingTime && (
                      <p className="text-surface-muted-foreground text-xs font-sans mb-4">
                        {post.readingTime} min read
                        {post.author ? ` · ${post.author.name}` : ''}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-brand-primary font-medium text-sm font-sans hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
