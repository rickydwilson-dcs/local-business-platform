// Reviews Page — Castor Theme
// =============================
// Standalone reviews page for the castor-test Stitch output site.
// Hardcoded hex values, no imports from @platform/core-components.

export default function ReviewsPage() {
  const reviews = [
    {
      name: 'Sarah M.',
      initials: 'SM',
      location: 'Eastbourne, Old Town',
      rating: 5,
      service: 'Bathroom Fitting',
      date: '12 March 2026',
      text: "We couldn't be happier with our new bathroom. DCS understood exactly what we wanted—a modern space that still felt in keeping with our Victorian home. The craftsmanship was exceptional and they finished on time and on budget.",
      featured: true,
    },
    {
      name: 'James P.',
      initials: 'JP',
      location: 'Hailsham',
      rating: 5,
      service: 'Boiler Installation',
      date: '28 February 2026',
      text: 'Replaced an ancient boiler with a new combi system. Professional from the first visit to the final handover. The engineers explained everything clearly and left the place spotless. Highly recommended.',
      featured: true,
    },
    {
      name: 'Linda R.',
      initials: 'LR',
      location: 'Lewes',
      rating: 5,
      service: 'Central Heating',
      date: '15 February 2026',
      text: 'Full central heating upgrade on a Georgian townhouse. DCS handled every detail—power flush, radiator upgrades, smart controls. The difference in efficiency and warmth is remarkable.',
      featured: false,
    },
    {
      name: 'Tom C.',
      initials: 'TC',
      location: 'Seaford',
      rating: 5,
      service: 'Emergency Repair',
      date: '3 February 2026',
      text: 'Burst pipe on a Sunday evening. Called DCS and they had an engineer on site within 40 minutes. Fixed the immediate problem and came back the next week to sort the underlying issue properly.',
      featured: false,
    },
    {
      name: 'Emma W.',
      initials: 'EW',
      location: 'Polegate',
      rating: 5,
      service: 'Leak Detection',
      date: '22 January 2026',
      text: 'Damp patch on a ceiling that nobody else could trace. DCS used thermal imaging to find the exact spot in under an hour—no tearing up floors. Saved us a fortune in unnecessary damage.',
      featured: false,
    },
    {
      name: 'David K.',
      initials: 'DK',
      location: 'Newhaven',
      rating: 5,
      service: 'Bathroom Fitting',
      date: '10 January 2026',
      text: 'Second bathroom fit-out with DCS in three years. That alone should tell you everything. Reliable, tidy, honest about what was needed and what wasn\u2019t.',
      featured: false,
    },
  ];

  const averageRating = 5.0;
  const totalReviews = reviews.length;
  const featuredReviews = reviews.filter((r) => r.featured);

  return (
    <>
      {/* TopNavBar — Navy variant */}
      <nav className="bg-[#1a3a6b] sticky top-0 z-50 shadow-lg border-none">
        <div className="flex justify-between items-center px-8 py-4 max-w-[1280px] mx-auto w-full">
          <a className="font-bold text-2xl text-white" href="/">
            DCS Plumbing
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/services"
            >
              Services
            </a>
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/locations"
            >
              Areas Covered
            </a>
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/about"
            >
              About Us
            </a>
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/blog"
            >
              FAQs
            </a>
            <a
              className="font-medium tracking-wide text-sm text-white/90 hover:text-[#3a7d44] transition-colors duration-200"
              href="/contact"
            >
              Contact
            </a>
          </div>
          <a
            className="bg-[#3a7d44] text-white px-6 py-2 rounded-lg font-semibold text-sm active:translate-y-[1px] transition-transform"
            href="/contact"
          >
            Get a Quote
          </a>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[400px] flex flex-col justify-center bg-[#1a3a6b] overflow-hidden">
          <div className="absolute inset-0">
            <img
              alt="Happy DCS Plumbing customers"
              className="w-full h-full object-cover opacity-40"
              src="/stitch-images/img-018.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a6b] via-[#1a3a6b]/80 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-[1280px] mx-auto w-full px-8 py-12">
            <nav className="flex mb-8 text-sm font-medium tracking-wide text-white/60">
              <a
                className="hover:text-white transition-colors after:content-['/'] after:mx-2 after:text-white/40"
                href="/"
              >
                Home
              </a>
              <span className="text-white">Reviews</span>
            </nav>
            <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6 max-w-2xl">
              What our customers say
            </h1>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed">
              Real feedback from homeowners and businesses across Eastbourne and East Sussex. Honest
              work, plainly done.
            </p>
          </div>
        </section>

        {/* Aggregate Rating Band */}
        <section className="bg-white border-b border-[rgba(226,232,240,0.6)]">
          <div className="max-w-[1280px] mx-auto px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <span className="text-[#1c1c1e] text-6xl font-extrabold tracking-tight">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex gap-0.5 text-[#f59e0b]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-[#64748b] text-sm mt-1">
                      Based on {totalReviews} reviews
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-4 justify-center md:justify-end">
                <div className="flex items-center gap-3 px-5 py-3 bg-[#f0f4f8] rounded-lg">
                  <span
                    className="material-symbols-outlined text-[#3a7d44]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="text-[#1c1c1e] font-semibold text-sm">Gas Safe Registered</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-[#f0f4f8] rounded-lg">
                  <span
                    className="material-symbols-outlined text-[#3a7d44]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    workspace_premium
                  </span>
                  <span className="text-[#1c1c1e] font-semibold text-sm">15+ Years Local</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-[#f0f4f8] rounded-lg">
                  <span
                    className="material-symbols-outlined text-[#3a7d44]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield
                  </span>
                  <span className="text-[#1c1c1e] font-semibold text-sm">Fully Insured</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Reviews */}
        <section className="py-[clamp(4rem,8vw,7rem)] bg-[#f0f4f8]">
          <div className="max-w-[1280px] mx-auto px-8">
            <header className="mb-16">
              <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
                Featured reviews
              </h2>
              <div className="w-20 h-1 bg-[#3a7d44]"></div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredReviews.map((review) => (
                <div
                  key={review.name + review.date}
                  className="bg-white rounded-xl border border-[rgba(226,232,240,0.6)] shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-8 flex flex-col"
                >
                  <div className="flex gap-0.5 text-[#f59e0b] mb-6">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <blockquote className="italic text-[#1c1c1e] text-lg leading-relaxed mb-6 flex-grow">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4 pt-6 border-t border-[rgba(226,232,240,0.6)]">
                    <div className="w-12 h-12 bg-[#1a3a6b] text-white rounded-full flex items-center justify-center font-bold">
                      {review.initials}
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-[#1c1c1e]">{review.name}</div>
                      <div className="text-[#64748b] text-sm">{review.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#3a7d44] text-xs font-bold tracking-widest uppercase">
                        {review.service}
                      </div>
                      <div className="text-[#64748b] text-xs mt-1">{review.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Reviews */}
        <section className="py-[clamp(4rem,8vw,7rem)] bg-white">
          <div className="max-w-[1280px] mx-auto px-8">
            <header className="mb-16">
              <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">All reviews</h2>
              <div className="w-20 h-1 bg-[#3a7d44]"></div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <article
                  key={review.name + review.date}
                  className="bg-white rounded-xl border border-[rgba(226,232,240,0.6)] shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-8 flex flex-col hover:-translate-y-1 transition-transform"
                >
                  <div className="flex gap-0.5 text-[#f59e0b] mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="inline-block text-[#3a7d44] text-xs font-bold tracking-widest uppercase mb-3">
                    {review.service}
                  </span>
                  <p className="text-[#64748b] leading-relaxed mb-6 flex-grow">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-[rgba(226,232,240,0.6)]">
                    <div className="w-10 h-10 bg-[#1a3a6b] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {review.initials}
                    </div>
                    <div>
                      <div className="font-bold text-[#1c1c1e] text-sm">{review.name}</div>
                      <div className="text-[#64748b] text-xs">{review.location}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="bg-[#1a3a6b] py-16 overflow-hidden relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[20rem]">reviews</span>
          </div>
          <div className="max-w-[1280px] mx-auto px-8 relative z-10 text-left">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
              Ready to join our happy customers?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl">
              From small repairs to full installations, we deliver the same straightforward,
              reliable service to every customer. Get in touch for a free, no-obligation quote.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="bg-[#3a7d44] text-white px-8 py-3 rounded-lg font-semibold text-lg active:translate-y-[1px] transition-transform"
                href="/contact"
              >
                Get a free quote
              </a>
              <a
                className="border-[1.5px] border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#1a3a6b] transition-colors flex items-center gap-2"
                href="tel:0800XXXXXXX"
              >
                <span className="material-symbols-outlined">call</span>
                0800 XXX XXXX
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a3a6b] border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8 py-16 max-w-[1280px] mx-auto w-full">
          <div>
            <a className="font-bold text-xl text-white mb-6 block" href="/">
              DCS Plumbing
            </a>
            <p className="text-white/80 leading-relaxed">
              &copy; 2024 DCS Plumbing Eastbourne. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-white/60 hover:text-[#3a7d44] transition-colors"
                  href="/services"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="text-white/60 hover:text-[#3a7d44] transition-colors"
                  href="/projects"
                >
                  Projects
                </a>
              </li>
              <li>
                <a className="text-white/60 hover:text-[#3a7d44] transition-colors" href="/reviews">
                  Reviews
                </a>
              </li>
              <li>
                <a className="text-white/60 hover:text-[#3a7d44] transition-colors" href="/contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Contact Us</h4>
            <div className="space-y-4 text-white/80">
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">phone</span>0800 XXX XXXX
              </p>
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                Eastbourne, East Sussex
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
