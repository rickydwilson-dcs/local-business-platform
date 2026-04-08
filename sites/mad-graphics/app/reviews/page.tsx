/**
 * Reviews Page
 * ============
 *
 * Customer testimonials in the site's dark editorial style.
 */

import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { getTestimonials, calculateAggregateRating } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { PageHeader } from '@/components/ui/page-header';
import { CtaBand } from '@/components/ui/cta-band';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Customer Reviews | What Our Clients Say | ${siteConfig.business.name}`,
  description: `Read what our customers say about ${siteConfig.business.name}. Trusted by homeowners and businesses for professional services.`,
  keywords: [
    'reviews',
    'testimonials',
    'customer reviews',
    'client testimonials',
    'company reviews',
  ],
  openGraph: {
    title: 'Customer Reviews | What Our Clients Say',
    description: `Read what our customers say about ${siteConfig.business.name}. Trusted by homeowners and businesses.`,
    url: '/reviews',
    type: 'website',
  },
};

export default async function ReviewsPage() {
  const testimonials = await getTestimonials();
  const { average, count } = calculateAggregateRating(testimonials);
  const featuredTestimonials = testimonials.filter((t) => t.featured);
  const regularTestimonials = testimonials.filter((t) => !t.featured);

  return (
    <>
      <PageHeader
        overline="Word on the shop floor"
        title="What our clients say"
        showDivider={false}
      />

      {/* Aggregate Rating */}
      {count > 0 && (
        <div className="px-8 pb-8">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <span className="text-5xl font-headline font-bold text-brand-primary">{average}</span>
            <div className="flex text-brand-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {i < Math.round(average) ? 'star' : 'star_border'}
                </span>
              ))}
            </div>
            <span className="text-surface-muted-foreground font-body text-sm uppercase tracking-widest">
              from {count} reviews
            </span>
          </div>
          <div className="max-w-7xl mx-auto mt-8 h-[2px] bg-surface-card-border/30 w-full" />
        </div>
      )}

      {/* Featured Reviews */}
      {featuredTestimonials.length > 0 && (
        <section className="py-20 bg-surface-background">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16">
              <span className="label-overline mb-4 inline-block">Featured</span>
              <h2 className="text-5xl font-headline font-bold">Top reviews</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredTestimonials.map((t) => (
                <div
                  key={t.slug}
                  className="bg-surface-muted p-12 border border-surface-card-border"
                >
                  <div className="flex text-brand-primary mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-2xl font-headline italic text-surface-foreground leading-relaxed mb-8">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <div className="font-bold text-lg uppercase tracking-wider font-body">
                      {t.customerName}
                    </div>
                    {(t.customerCompany || t.customerRole) && (
                      <div className="text-surface-muted-foreground text-xs font-body uppercase tracking-widest">
                        {t.customerCompany || t.customerRole}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Reviews */}
      <section className="py-20 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
            <h2 className="text-5xl font-headline font-bold">
              {featuredTestimonials.length > 0 ? 'All reviews' : 'Client reviews'}
            </h2>
          </div>

          {testimonials.length === 0 ? (
            <p className="text-surface-muted-foreground text-lg">
              No reviews yet. Check back soon for customer testimonials.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-card-border/20">
              {(featuredTestimonials.length > 0 ? regularTestimonials : testimonials).map((t) => (
                <div key={t.slug} className="bg-surface-background p-8">
                  <div className="flex text-brand-primary mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-lg font-headline italic text-surface-foreground leading-relaxed mb-6">
                    &ldquo;{t.excerpt || t.text}&rdquo;
                  </p>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wider font-body">
                      {t.customerName}
                    </div>
                    {t.location && (
                      <div className="text-surface-muted-foreground text-xs font-body uppercase tracking-widest">
                        {t.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        headline="Ready to join them?"
        subtext="Get a free quote for your project today."
        primaryLabel="Get Free Quote"
        primaryHref="/contact"
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Reviews', url: '/reviews' },
        ]}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl('/reviews#webpage'),
          url: absUrl('/reviews'),
          name: 'Customer Reviews',
          description: `Read what our customers say about ${siteConfig.business.name}. Trusted by homeowners and businesses.`,
        }}
        aggregateRating={
          count > 0
            ? {
                '@type': 'AggregateRating',
                '@id': absUrl('/reviews#aggregaterating'),
                ratingValue: average,
                bestRating: 5,
                worstRating: 1,
                ratingCount: count,
              }
            : undefined
        }
      />
    </>
  );
}
