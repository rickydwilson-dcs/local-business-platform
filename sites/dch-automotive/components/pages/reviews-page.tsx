import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { PageHero } from '@/components/page-hero';

interface Testimonial {
  slug: string;
  name: string;
  rating: number;
  body: string;
  date?: string;
}

export function ReviewsPage({ testimonials }: { testimonials: Testimonial[] }) {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Reviews', href: '/reviews', current: true },
  ];

  const count = testimonials.length;
  const average =
    count > 0
      ? Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / count) * 10) / 10
      : 0;

  return (
    <>
      <BreadcrumbBar items={breadcrumbItems} />

      <PageHero
        title="What Our Customers Say"
        description="Don't just take our word for it — read what our customers say about our vehicle security, fleet and accessory work."
      />

      {count > 0 && (
        <section className="bg-[#080807] border-y border-white/5 py-12">
          <div className="container mx-auto px-6 flex justify-center">
            <div className="stamped-plate px-10 py-6 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-brand-primary"
                    style={{
                      fontVariationSettings: i < Math.round(average) ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-heading font-black text-3xl">{average}</p>
              <p className="text-white/60 text-sm uppercase tracking-widest">
                from {count} review{count === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-24 container mx-auto px-6">
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              No reviews yet. Check back soon for customer testimonials.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.slug}
                className="bg-surface-card p-10 border-l-4 border-brand-primary relative"
              >
                <span className="material-symbols-outlined absolute top-8 right-8 text-brand-primary/20 text-6xl">
                  format_quote
                </span>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-brand-primary text-lg"
                      style={{
                        fontVariationSettings: i < testimonial.rating ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-xl italic font-light text-white/90 mb-6 leading-relaxed">
                  {testimonial.body}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-heading font-bold text-brand-primary flex-shrink-0">
                    {testimonial.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold uppercase text-sm tracking-widest">
                      {testimonial.name}
                    </p>
                    {testimonial.date && (
                      <p className="text-xs text-white/40 uppercase">{testimonial.date}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
