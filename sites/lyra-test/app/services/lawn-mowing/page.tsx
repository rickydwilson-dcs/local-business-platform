export default function LawnMowingPage() {
  return (
    <>
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="text-[#727973] text-sm uppercase tracking-widest flex items-center gap-1">
            <a className="hover:text-brand-primary transition-colors" href="/">
              Home
            </a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <a className="hover:text-brand-primary transition-colors" href="/services">
              Services
            </a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-brand-primary font-bold">Lawn Mowing &amp; Edging</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="inline-block bg-brand-accent text-[#261a00] px-3 py-1 text-xs font-bold uppercase tracking-tighter mb-6 rounded-sm">
              Premium Grounds Care
            </span>
            <h1
              className="text-5xl md:text-7xl font-bold text-brand-primary leading-[1.1] mb-6"
              style={{ fontFamily: 'Newsreader, serif' }}
            >
              Lawn Mowing &amp; <br />
              <span className="font-normal italic">Precision Edging</span>
            </h1>
            <p className="text-xl text-[#424843] max-w-lg mb-8 leading-relaxed">
              Restore the quintessential English character of your estate with our signature striped
              finish and architectural edging. Built on generations of heritage gardening.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/contact"
                className="bg-brand-primary text-white px-8 py-4 rounded-md font-medium text-lg hover:shadow-lg transition-all flex items-center group"
              >
                Get a Free Quote
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>
              <a
                href="#overview"
                className="border border-surface-border text-brand-primary px-8 py-4 rounded-md font-medium text-lg hover:bg-surface-muted transition-all"
              >
                Our Methods
              </a>
            </div>
          </div>
          <div className="relative h-[500px] rounded-xl overflow-hidden group">
            <img
              alt="Lush green lawn with perfect stripes"
              className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              src="/stitch-images/img-018.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/30 to-transparent"></div>
          </div>
        </section>

        {/* Service Overview */}
        <section id="overview" className="bg-surface-muted py-20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <h2
                className="text-3xl font-bold text-brand-primary mb-6"
                style={{ fontFamily: 'Newsreader, serif' }}
              >
                Refining the Canvas of Your Garden
              </h2>
              <div className="w-16 h-1 bg-brand-accent mb-8"></div>
              <div className="space-y-6 text-[#424843] text-lg leading-relaxed">
                <p>
                  A truly exceptional lawn is more than just short grass; it is the fundamental
                  architecture of your outdoor space. At Smith &amp; Sons, we treat every acre as a
                  legacy. Our professional mowing service utilizes heavy-duty cylinder and rotary
                  mowers adjusted specifically to your turf&apos;s height and health requirements.
                </p>
                <p>
                  Beyond the cut, our precision edging service creates defined, crisp boundaries
                  between your turf and floral borders or stone pathways. This architectural
                  approach prevents grass encroachment and elevates the visual structure of your
                  entire property, ensuring a finish that is both manicured and sustainable.
                </p>
              </div>
            </div>
            <div className="md:col-span-6 md:col-start-7 bg-white p-8 md:p-12 rounded-xl shadow-sm border-l-4 border-brand-primary self-center">
              <h3
                className="text-2xl font-bold mb-8 text-brand-primary italic"
                style={{ fontFamily: 'Newsreader, serif' }}
              >
                The Smith &amp; Sons Guarantee
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-brand-secondary mr-4">
                    calendar_month
                  </span>
                  <div>
                    <span className="font-bold block text-surface-foreground">
                      Fortnightly or Weekly Schedules
                    </span>
                    <span className="text-sm text-[#727973]">
                      Tailored visits to match your grass&apos;s peak growing cycle.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-brand-secondary mr-4">
                    construction
                  </span>
                  <div>
                    <span className="font-bold block text-surface-foreground">
                      Industrial Grade Equipment
                    </span>
                    <span className="text-sm text-[#727973]">
                      Professional mowers for that &ldquo;Wimbledon&rdquo; finish.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-brand-secondary mr-4">
                    format_align_center
                  </span>
                  <div>
                    <span className="font-bold block text-surface-foreground">
                      Perfect Stripe Finish
                    </span>
                    <span className="text-sm text-[#727973]">
                      Intentional directional mowing for visual depth and elegance.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-brand-secondary mr-4">
                    recycling
                  </span>
                  <div>
                    <span className="font-bold block text-surface-foreground">
                      Green Waste Removal
                    </span>
                    <span className="text-sm text-[#727973]">
                      All clippings removed and responsibly composted.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
            <h2
              className="text-4xl font-bold text-brand-primary italic"
              style={{ fontFamily: 'Newsreader, serif' }}
            >
              Heritage in Progress
            </h2>
            <p className="text-[#727973] uppercase tracking-widest text-xs font-semibold">
              Before &amp; After Portfolio
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-xl">
              <img
                alt="Cotswold Estate lawn"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="/stitch-images/img-010.jpg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm uppercase tracking-widest italic">
                  The Cotswold Estate
                </span>
              </div>
            </div>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-xl md:mt-12">
              <img
                alt="Sussex Manor Grounds"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="/stitch-images/img-006.jpg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm uppercase tracking-widest italic">
                  Sussex Manor Grounds
                </span>
              </div>
            </div>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-xl">
              <img
                alt="Modern Rectory Garden"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="/stitch-images/img-005.jpg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm uppercase tracking-widest italic">
                  Modern Rectory Garden
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="bg-[#efeeea] py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="text-4xl font-bold text-center text-brand-primary mb-16"
              style={{ fontFamily: 'Newsreader, serif' }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="group bg-surface-background rounded-xl p-6 shadow-sm open:shadow-md">
                <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-lg text-brand-primary">
                  How often should my lawn be mowed?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="text-[#424843] leading-relaxed mt-4">
                  During the peak growing season (March to October), we recommend weekly or
                  fortnightly visits. This maintains density and prevents the grass from becoming
                  stressed. In dormant winter months, mowing is typically suspended to protect the
                  root system.
                </div>
              </details>
              <details className="group bg-surface-background rounded-xl p-6 shadow-sm open:shadow-md">
                <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-lg text-brand-primary">
                  Do you take the grass clippings away?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="text-[#424843] leading-relaxed mt-4">
                  Yes, our &ldquo;Green Waste Pledge&rdquo; ensures all clippings are collected,
                  bagged, and removed from your site for eco-friendly composting at local
                  facilities, leaving your property immaculate.
                </div>
              </details>
              <details className="group bg-surface-background rounded-xl p-6 shadow-sm open:shadow-md">
                <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-lg text-brand-primary">
                  Do you offer one-off cuts?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="text-[#424843] leading-relaxed mt-4">
                  While we specialize in long-term estate management contracts, we do accommodate
                  one-off &ldquo;restoration&rdquo; cuts for properties that have been neglected or
                  for special garden events. Please contact us for a specific quote.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* CTA Panel */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="relative bg-brand-primary rounded-2xl p-12 md:p-20 overflow-hidden flex flex-col items-center text-center">
            <div className="w-96 h-96 bg-[#2d4c3b] rounded-full absolute -right-24 -top-24 blur-3xl opacity-30"></div>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10"
              style={{ fontFamily: 'Newsreader, serif' }}
            >
              Ready to transform your lawn?
            </h2>
            <p className="text-[#99bca6] text-xl max-w-2xl mb-12 relative z-10">
              Join the many prestigious estates across the county who trust Smith &amp; Sons with
              their outdoor legacy. Consultations are complimentary and detailed.
            </p>
            <a
              href="/contact"
              className="bg-brand-accent text-[#261a00] px-10 py-5 rounded-md font-bold text-lg hover:brightness-110 transition-all shadow-xl relative z-10"
            >
              Book a Consultation
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
