import type { ReviewsPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 mb-4" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-brand-primary text-xl leading-none"
          style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
          aria-hidden="true"
        >
          star
        </span>
      ))}
    </div>
  );
}

export function SolarisReviewsPage({ siteConfig, testimonials }: ReviewsPageTemplateProps) {
  return (
    <div className="min-h-screen font-body">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-headline text-white mb-4 leading-[1.1]">
              Client Reviews
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed">
              What tradespeople say about working with DCS.
            </p>
          </div>
        </div>
      </header>

      {/* ─── Testimonials Grid ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          {testimonials.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-surface-muted-foreground text-lg font-body">
                No reviews yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.slug}
                  className="bg-surface-card rounded-[20px] shadow-md solaris-card-hover border border-surface-card-border p-6 flex flex-col"
                >
                  <StarRating rating={testimonial.rating} />

                  <p className="italic text-surface-foreground leading-relaxed mb-4 flex-1">
                    &ldquo;{testimonial.body}&rdquo;
                  </p>

                  <div>
                    <p className="font-headline font-bold text-surface-foreground">
                      {testimonial.name}
                    </p>
                    {testimonial.platform && (
                      <p className="text-surface-muted-foreground text-sm mt-0.5">
                        {testimonial.platform}
                        {testimonial.date && (
                          <span className="ml-2">&middot; {testimonial.date}</span>
                        )}
                      </p>
                    )}
                    {!testimonial.platform && testimonial.date && (
                      <p className="text-surface-muted-foreground text-sm mt-0.5">
                        {testimonial.date}
                      </p>
                    )}
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
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-surface-foreground mb-4">
            Ready to join our happy clients?
          </h2>
          <p className="text-lg text-surface-muted-foreground font-body mb-10 max-w-xl mx-auto">
            Get in touch with {siteConfig.name} today and see what we can do for you.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-primary text-white px-10 py-4 rounded-xl text-base font-bold shadow-lg hover:opacity-90 transition-opacity font-body"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
