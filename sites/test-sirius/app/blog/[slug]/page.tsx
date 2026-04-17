{
  /* Source: https://www.rpautomotivephotography.com — blog detail (fallback template) */
}

import { SiriusHeader } from '@platform/themes/sirius/components';
import { SiriusFooter } from '@platform/themes/sirius/components';
import { PageTitleBanner } from '@platform/themes/sirius/components';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <SiriusHeader logo="RP Automotive" navLinks={navLinks} />
      <PageTitleBanner pageTitle={title} />

      {/* Breadcrumb */}
      <section className="bg-surface-muted py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-surface-muted-foreground">
            <a href="/" className="hover:text-brand-primary transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/blog" className="hover:text-brand-primary transition-colors">
              Blog
            </a>
            <span>/</span>
            <span className="text-surface-foreground">{title}</span>
          </nav>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-surface-muted-foreground mb-6">
              <span>Rachel Persaud</span>
              <span>|</span>
              <span>5 min read</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-surface-foreground leading-relaxed mb-6">
              Every vehicle has a story to tell. Through careful composition, lighting, and an
              understanding of automotive design, we capture the character and spirit that makes
              each car or motorcycle unique.
            </p>

            <h2 className="text-2xl font-bold text-surface-foreground mt-10 mb-4">The Approach</h2>
            <p className="text-surface-foreground leading-relaxed mb-6">
              Our process begins with understanding the vehicle and its owner. We discuss the style,
              the setting, and the final use of the images — whether for print, social media, or
              sale listings.
            </p>

            <h2 className="text-2xl font-bold text-surface-foreground mt-10 mb-4">
              What is Included
            </h2>
            <ul className="space-y-3 mb-8">
              {[
                'Pre-shoot consultation',
                'Location scouting',
                'Professional editing',
                'High-resolution digital files',
                'Print-ready versions',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-brand-primary mt-0.5">
                    check_circle
                  </span>
                  <span className="text-surface-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-surface-foreground mb-8">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Classic Car Collection Shoot', slug: 'classic-car-collection' },
              { title: 'Motorcycle Photography Tips', slug: 'motorcycle-photography-tips' },
            ].map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`} className="card-interactive group">
                <div className="aspect-video bg-surface-muted rounded-lg mb-4" />
                <h3 className="text-lg font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors">
                  {post.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-on-brand-primary mb-4">Book Your Shoot</h2>
          <p className="text-on-brand-primary mb-8">
            Ready to get your vehicle professionally photographed?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-surface-background text-brand-primary font-semibold hover:bg-surface-muted transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>
      </section>

      <SiriusFooter
        copyrightText={`\u00A9 ${new Date().getFullYear()} RP Automotive Photography. All rights reserved.`}
        termsLink={{ label: 'Terms & Conditions', href: '/terms' }}
      />
    </>
  );
}
