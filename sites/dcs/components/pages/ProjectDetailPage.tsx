import type { ProjectDetailPageTemplateProps } from '@platform/core-components';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl, isValidImagePath } from '@/lib/image';

export function SiteProjectDetailPage({
  frontmatter,
  mdxContent,
  breadcrumbs,
}: ProjectDetailPageTemplateProps) {
  return (
    <div className="min-h-screen font-sans">
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
      <header className="bg-brand-secondary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-3xl">
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-brand-accent/15 text-brand-accent text-xs font-semibold px-2.5 py-1 rounded-full font-sans"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-heading text-white mb-4 leading-[1.1]">
              {frontmatter.title}
            </h1>
            {frontmatter.date && (
              <time dateTime={frontmatter.date} className="text-white/70 text-sm font-sans">
                {frontmatter.date}
              </time>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero image ──────────────────────────────────────────────────────── */}
      {isValidImagePath(frontmatter.heroImage) && (
        <div className="bg-surface-background">
          <div className="max-w-[1200px] mx-auto px-6 -mt-10 md:-mt-14">
            <div className="relative w-full aspect-[16/9] rounded-[20px] overflow-hidden shadow-lg bg-surface-muted">
              <Image
                src={getImageUrl(frontmatter.heroImage)}
                alt={`${frontmatter.title} — hero image`}
                width={1200}
                height={675}
                quality={58}
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Content Area ────────────────────────────────────────────────────── */}
      <section className="bg-surface-background py-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* MDX prose */}
          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-surface-foreground prose-a:text-brand-primary prose-strong:text-surface-foreground">
            {mdxContent}
          </div>

          {/* Results / outcomes */}
          {frontmatter.outcomes && frontmatter.outcomes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold font-heading text-surface-foreground mb-6">
                Results
              </h2>
              <ul className="space-y-3 list-none m-0 p-0">
                {frontmatter.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-semantic-success/20 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-3 h-3 text-semantic-success"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-surface-foreground font-sans leading-relaxed">
                      {outcome}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-surface-foreground mb-2">
              Like what you see? Let&apos;s talk.
            </h2>
            <p className="text-surface-foreground/70 font-sans">
              We&apos;ll build you a site that wins more work.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 bg-brand-primary text-white px-10 py-4 rounded-xl text-base font-bold font-sans shadow-lg hover:opacity-90 transition-opacity text-center"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
