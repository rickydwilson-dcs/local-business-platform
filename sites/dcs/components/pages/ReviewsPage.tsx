import type { ReviewsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 mb-4" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-brand-accent text-xl leading-none"
          style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
          aria-hidden="true"
        >
          star
        </span>
      ))}
    </div>
  );
}

export function SiteReviewsPage({ siteConfig, testimonials }: ReviewsPageTemplateProps) {
  const hasTestimonials = testimonials.length > 0;
  const averageRating = hasTestimonials
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
    : 0;

  return (
    <div className="min-h-screen font-sans">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-surface-background py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div className="max-w-2xl">
              <span className="inline-block bg-brand-primary/15 text-brand-primary px-4 py-1.5 rounded-full text-sm font-semibold font-sans mb-6 w-fit">
                Client reviews
              </span>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-heading text-surface-foreground mb-4 leading-[1.1] solaris-heading">
                What people <span className="text-brand-primary">say about us.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-muted-foreground font-sans leading-relaxed">
                What tradespeople say about working with {siteConfig.name}.
              </p>
              <div className="mt-6 w-16 h-1 bg-brand-accent rounded-full" />
            </div>

            {hasTestimonials && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl text-center shrink-0">
                <div className="flex items-center gap-1 justify-center mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-brand-accent text-lg"
                      style={{
                        fontVariationSettings:
                          i < Math.round(averageRating) ? "'FILL' 1" : "'FILL' 0",
                      }}
                      aria-hidden="true"
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-2xl font-bold font-heading text-surface-foreground leading-none">
                  {averageRating.toFixed(1)}{' '}
                  <span className="text-base font-semibold text-surface-muted-foreground">/ 5</span>
                </p>
                <p className="text-xs text-surface-muted-foreground mt-1 font-sans">
                  from {testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Testimonials Grid ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-surface-muted">
        <div className="max-w-[1200px] mx-auto px-6">
          {!hasTestimonials ? (
            <div className="text-center py-16">
              <p className="text-surface-muted-foreground text-lg font-sans">
                No reviews yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.slug}
                  className={`bg-surface-card rounded-[20px] shadow-sm solaris-card-hover border border-surface-card-border p-6 flex flex-col solaris-reveal solaris-stagger-${(index % 6) + 1}`}
                >
                  <StarRating rating={testimonial.rating} />

                  <blockquote className="text-surface-foreground font-sans leading-relaxed mb-5 flex-1">
                    &ldquo;{testimonial.body}&rdquo;
                  </blockquote>

                  <div className="pt-4 border-t border-surface-card-border flex items-center justify-between">
                    <div>
                      <p className="font-heading font-bold text-surface-foreground">
                        {testimonial.name}
                      </p>
                      {testimonial.platform && (
                        <p className="text-surface-muted-foreground text-sm mt-0.5 font-sans">
                          {testimonial.platform}
                          {testimonial.date && (
                            <span className="ml-2">&middot; {testimonial.date}</span>
                          )}
                        </p>
                      )}
                      {!testimonial.platform && testimonial.date && (
                        <p className="text-surface-muted-foreground text-sm mt-0.5 font-sans">
                          {testimonial.date}
                        </p>
                      )}
                    </div>
                    <span
                      className="material-symbols-outlined text-brand-primary/40 text-4xl leading-none shrink-0"
                      aria-hidden="true"
                    >
                      format_quote
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Strip ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-surface-foreground mb-4 solaris-heading">
            Ready to join our happy clients?
          </h2>
          <p className="text-lg text-surface-foreground/80 font-sans mb-10 max-w-xl mx-auto">
            Get in touch with {siteConfig.name} today and see what we can do for you.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-primary text-white px-10 py-4 rounded-xl text-base font-bold shadow-lg hover:opacity-90 transition-opacity font-sans"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
