/**
 * Blog Post Detail — static placeholder (no generateStaticParams per brief)
 */
import type { Metadata } from 'next';
import { BlogPostBody } from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Blog Post | Digital Marketing Weekend 2026',
  description: 'An article from Digital Marketing Weekend.',
};

export default function BlogPostPage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Blog
          </span>
          <h1 className="text-h1 text-surface-foreground mb-6">
            Why Small Businesses Need a Digital Marketing Strategy
          </h1>
          <p className="text-small text-surface-foreground opacity-60">
            Published April 2026 · 5 min read
          </p>
        </div>
      </section>

      <BlogPostBody />

      <section className="py-12 px-4 bg-surface-background text-center">
        <a
          href="/blog"
          className="text-brand-secondary font-semibold hover:opacity-80 transition-opacity"
        >
          ← Back to Blog
        </a>
      </section>
    </main>
  );
}
