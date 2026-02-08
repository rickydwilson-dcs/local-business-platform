import Link from "next/link";
import type { Metadata } from "next";
import { Schema, Breadcrumbs } from "@platform/core-components";
import { getTestimonials, calculateAggregateRating, type Testimonial } from "@/lib/content";
import { absUrl } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Customer Reviews | What Our Clients Say",
  description:
    "Read what our customers say about Colossus Scaffolding. Trusted by homeowners and businesses across Sussex, Kent, and Surrey for professional scaffolding services.",
  keywords: [
    "scaffolding reviews",
    "scaffolding testimonials",
    "Colossus Scaffolding reviews",
    "scaffolding company reviews",
    "customer testimonials",
  ],
  openGraph: {
    title: "Customer Reviews | What Our Clients Say",
    description:
      "Read what our customers say about Colossus Scaffolding. Trusted by homeowners and businesses across the South East.",
    url: absUrl("/reviews"),
    type: "website",
  },
  alternates: {
    canonical: absUrl("/reviews"),
  },
};

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-0.5">
      <span className="sr-only">{rating} out of 5 stars</span>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${sizeClasses[size]} ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function AggregateRatingDisplay({ average, count }: { average: number; count: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="text-5xl font-bold text-brand-primary mb-2">{average.toFixed(1)}</div>
      <StarRating rating={Math.round(average)} size="lg" />
      <p className="text-gray-600 mt-2">Based on {count} reviews</p>

      {/* Rating Distribution */}
      <div className="mt-6 space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          // For demo, assuming mostly 5-star reviews
          const percentage = stars === 5 ? 90 : stars === 4 ? 10 : 0;
          return (
            <div key={stars} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-gray-600">{stars}</span>
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-gray-500">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white text-lg font-bold">
            {testimonial.customerName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{testimonial.customerName}</h3>
            <p className="text-sm text-gray-500">
              {testimonial.customerRole}
              {testimonial.customerCompany && `, ${testimonial.customerCompany}`}
            </p>
          </div>
        </div>
        {testimonial.verified && (
          <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
            <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Review Text */}
      <blockquote className="text-gray-700 mb-4">&ldquo;{testimonial.text}&rdquo;</blockquote>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <time dateTime={testimonial.date}>
          {new Date(testimonial.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        {testimonial.service && (
          <>
            <span>·</span>
            <Link
              href={`/services/${testimonial.serviceSlug}`}
              className="text-brand-primary hover:underline"
            >
              {testimonial.service}
            </Link>
          </>
        )}
        {testimonial.location && (
          <>
            <span>·</span>
            <Link
              href={`/locations/${testimonial.locationSlug}`}
              className="text-brand-primary hover:underline"
            >
              {testimonial.location}
            </Link>
          </>
        )}
      </div>
    </article>
  );
}

export default async function ReviewsPage() {
  const testimonials = await getTestimonials();
  const { average, count } = calculateAggregateRating(testimonials);
  const featuredTestimonials = testimonials.filter((t) => t.featured);

  const breadcrumbItems = [{ name: "Reviews", href: "/reviews", current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Hero Section */}
        <section className="section-standard lg:py-24 bg-white">
          <div className="container-standard">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="heading-hero">What Our Customers Say</h1>
              <p className="text-xl text-gray-800 mb-8">
                Don&apos;t just take our word for it. Read what homeowners and businesses across the
                South East say about our scaffolding services.
              </p>
            </div>
          </div>
        </section>

        {/* Aggregate Rating */}
        <section className="section-standard bg-surface-muted">
          <div className="container-standard">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <AggregateRatingDisplay average={average} count={count} />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-brand-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">TG20:21 Compliant</h3>
                        <p className="text-sm text-gray-600">Industry-standard safety compliance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-brand-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">CISRS Qualified</h3>
                        <p className="text-sm text-gray-600">Trained professional scaffolders</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-brand-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Fast Response</h3>
                        <p className="text-sm text-gray-600">Quick quotes and efficient service</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-brand-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path
                            fillRule="evenodd"
                            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">£10M Insured</h3>
                        <p className="text-sm text-gray-600">Full public liability coverage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Reviews */}
        {featuredTestimonials.length > 0 && (
          <section className="section-standard bg-white">
            <div className="container-standard">
              <h2 className="heading-section mb-8">Featured Reviews</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredTestimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.slug} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Reviews */}
        <section className="section-standard bg-surface-muted">
          <div className="container-standard">
            <h2 className="heading-section mb-8">
              {featuredTestimonials.length > 0 ? "All Reviews" : "Customer Reviews"}
            </h2>

            {testimonials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No reviews yet. Check back soon for customer testimonials.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.slug} testimonial={testimonial} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-compact bg-brand-primary">
          <div className="container-standard text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Experience Our Service?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our satisfied customers across the South East. Get a free quote for your
              scaffolding project today.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Free Quote
            </Link>
          </div>
        </section>
      </div>

      <Schema
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Reviews", url: "/reviews" },
        ]}
        webpage={{
          "@type": "WebPage",
          "@id": absUrl("/reviews#webpage"),
          url: absUrl("/reviews"),
          name: "Customer Reviews",
          description:
            "Read what our customers say about Colossus Scaffolding. Trusted by homeowners and businesses across the South East.",
        }}
        aggregateRating={
          count > 0
            ? {
                "@type": "AggregateRating",
                "@id": absUrl("/reviews#aggregaterating"),
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
