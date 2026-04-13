import type { ReviewsPageTemplateProps } from "@platform/core-components";

export function CorvusReviewsPage({ siteConfig, testimonials }: ReviewsPageTemplateProps) {
  return (
    <main className="page-reviews">
      {/* corvus reviews layout — stub, to be populated by pipeline */}
      <section className="py-16">
        <h1 className="text-4xl font-bold text-center">Customer Reviews</h1>
      </section>
      <section className="py-8">
        {testimonials.map((t) => (
          <div key={t.slug}>
            {t.name}: {t.body}
          </div>
        ))}
      </section>
    </main>
  );
}
