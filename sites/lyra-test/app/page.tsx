export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <header className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-brand-primary to-[#2d4c3b] opacity-95"></div>
          <img
            alt="Manicured British Garden"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            src="/stitch-images/img-020.jpg"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="inline-block bg-brand-accent text-[#261a00] px-4 py-1 rounded-full text-sm font-semibold mb-6">
              Now Booking for Spring Maintenance
            </span>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]"
              style={{ fontFamily: 'Newsreader, serif' }}
            >
              Established Reliability for{' '}
              <span className="text-[#c7ebd4]">British Landscapes.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#c7ebd4] opacity-90 mb-10 max-w-xl leading-relaxed">
              Three generations of expertise in professional garden care. From pristine lawns to
              expert pruning, we treat your outdoor space with the respect it deserves.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="bg-[#c7ebd4] text-[#012113] px-8 py-4 rounded-lg text-lg font-bold shadow-xl hover:bg-white transition-all text-center"
              >
                Get a Free Quote
              </a>
              <a
                href="/services"
                className="border border-[#c7ebd4]/30 text-white backdrop-blur-sm px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-all text-center"
              >
                Our Services
              </a>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl transform rotate-2">
              <img
                alt="Professional gardener at work"
                className="w-full h-full object-cover"
                src="/stitch-images/img-002.jpg"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#efeeea] p-6 rounded-xl shadow-xl max-w-xs transform -rotate-2">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="material-symbols-outlined text-brand-accent"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-brand-accent"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-brand-accent"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-brand-accent"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-brand-accent"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <p className="text-sm font-medium italic">
                &ldquo;The most reliable service in the county. Our garden has never looked
                better.&rdquo;
              </p>
              <p className="text-xs text-[#727973] mt-2">&mdash; Mrs. Higgins, Surrey</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="bg-[#efeeea] py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <div className="flex items-center gap-6">
              <div className="bg-brand-primary/10 p-4 rounded-full">
                <span className="material-symbols-outlined text-brand-primary text-4xl">
                  history
                </span>
              </div>
              <div>
                <div
                  className="text-3xl font-bold text-brand-primary"
                  style={{ fontFamily: 'Newsreader, serif' }}
                >
                  15+ Years
                </div>
                <div className="text-[#727973] text-sm uppercase tracking-wider font-semibold">
                  In Business
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="bg-brand-primary/10 p-4 rounded-full">
                <span className="material-symbols-outlined text-brand-primary text-4xl">
                  sentiment_satisfied
                </span>
              </div>
              <div>
                <div
                  className="text-3xl font-bold text-brand-primary"
                  style={{ fontFamily: 'Newsreader, serif' }}
                >
                  500+
                </div>
                <div className="text-[#727973] text-sm uppercase tracking-wider font-semibold">
                  Happy Customers
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="bg-brand-primary/10 p-4 rounded-full">
                <span className="material-symbols-outlined text-brand-primary text-4xl">
                  calendar_today
                </span>
              </div>
              <div>
                <div
                  className="text-3xl font-bold text-brand-primary"
                  style={{ fontFamily: 'Newsreader, serif' }}
                >
                  Daily
                </div>
                <div className="text-[#727973] text-sm uppercase tracking-wider font-semibold">
                  Garden Maintenance
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2
                className="text-4xl md:text-5xl font-bold text-brand-primary mb-6"
                style={{ fontFamily: 'Newsreader, serif' }}
              >
                Masterfully Managed Gardens
              </h2>
              <p className="text-lg text-[#424843]">
                We offer a comprehensive suite of services tailored to the unique needs of the
                British climate and local flora.
              </p>
            </div>
            <a
              className="text-brand-secondary font-bold flex items-center gap-2 hover:underline group"
              href="/services"
            >
              View all services
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                img: 'img-001.jpg',
                title: 'Professional Lawn Mowing',
                desc: 'Expert precision cutting, edging, and feeding for a carpet-like finish all year round.',
              },
              {
                img: 'img-025.jpg',
                title: 'Hedge Trimming & Pruning',
                desc: 'Artistic shaping and structural pruning to ensure the health and aesthetics of your greenery.',
              },
              {
                img: 'img-011.jpg',
                title: 'Garden Clearance',
                desc: 'Comprehensive seasonal clean-ups and debris removal to reclaim your outdoor living space.',
              },
              {
                img: 'img-007.jpg',
                title: 'Seasonal Planting',
                desc: 'Strategic planting schemes designed to provide year-round color and biodiversity.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-surface-muted rounded-xl overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={`/stitch-images/${card.img}`}
                  />
                </div>
                <div className="p-8">
                  <h3
                    className="text-xl font-bold mb-3 text-brand-primary"
                    style={{ fontFamily: 'Newsreader, serif' }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-[#424843] text-sm leading-relaxed mb-6">{card.desc}</p>
                  <a
                    href="/services"
                    className="text-brand-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2"
                  >
                    Details{' '}
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#efeeea] relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold text-brand-primary mb-4"
              style={{ fontFamily: 'Newsreader, serif' }}
            >
              Word From Our Neighbours
            </h2>
            <div className="w-24 h-1 bg-brand-accent mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-surface-background p-10 rounded-xl relative shadow-sm border border-surface-border/10">
              <span className="material-symbols-outlined text-6xl text-brand-primary/10 absolute top-4 right-8">
                format_quote
              </span>
              <div className="flex items-center gap-1 text-brand-accent mb-4">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <blockquote
                className="text-xl italic text-brand-primary leading-relaxed mb-6"
                style={{ fontFamily: 'Newsreader, serif' }}
              >
                &ldquo;Reliable and thorough! Smith &amp; Sons have been looking after our estate
                for three years now, and the level of detail they provide is unmatched.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2d4c3b] flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <div className="font-bold text-brand-primary">James Darlington</div>
                  <div className="text-sm text-[#727973]">Hampshire Estate</div>
                </div>
              </div>
            </div>
            <div className="bg-surface-background p-10 rounded-xl relative shadow-sm border border-surface-border/10">
              <span className="material-symbols-outlined text-6xl text-brand-primary/10 absolute top-4 right-8">
                format_quote
              </span>
              <div className="flex items-center gap-1 text-brand-accent mb-4">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <blockquote
                className="text-xl italic text-brand-primary leading-relaxed mb-6"
                style={{ fontFamily: 'Newsreader, serif' }}
              >
                &ldquo;Transformed our garden in just one day. The clearance team was incredibly
                hardworking and left the place spotless. Highly recommended.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <div className="font-bold text-brand-primary">Sarah Miller</div>
                  <div className="text-sm text-[#727973]">Cotswolds Resident</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-24 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[30rem] leading-none">park</span>
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <h2
            className="text-4xl md:text-6xl font-bold mb-8 max-w-3xl mx-auto"
            style={{ fontFamily: 'Newsreader, serif' }}
          >
            Ready to restore your garden&apos;s glory?
          </h2>
          <p className="text-xl text-[#accfb8] opacity-80 mb-12 max-w-xl mx-auto">
            Join hundreds of local families who trust Smith &amp; Sons for their regular
            maintenance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/contact"
              className="bg-brand-accent text-[#261a00] px-10 py-5 rounded-lg text-xl font-bold hover:scale-105 transition-transform"
            >
              Request Your Free Site Visit
            </a>
            <a
              href="/contact"
              className="flex items-center justify-center gap-3 px-10 py-5 text-xl font-bold border border-[#c7ebd4]/30 text-white rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">call</span> 0800 GARDEN HELP
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
