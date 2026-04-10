export default function VictorianBathroomRenovationPage() {
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
        {/* Breadcrumb */}
        <nav className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
          <ol className="flex items-center space-x-2 text-[#64748b] text-xs uppercase tracking-widest">
            <li>
              <a className="hover:text-[#3a7d44] transition-colors" href="/">
                Home
              </a>
            </li>
            <li>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            </li>
            <li>
              <a className="hover:text-[#3a7d44] transition-colors" href="/projects">
                Projects
              </a>
            </li>
            <li>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            </li>
            <li className="text-[#3a7d44] font-semibold">Victorian Bathroom Renovation</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[614px] min-h-[400px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[#1a3a6b]/75 z-10"></div>
          <img
            alt="Victorian bathroom renovation"
            className="absolute inset-0 w-full h-full object-cover"
            src="/stitch-images/img-004.jpg"
          />
          <div className="relative z-20 max-w-[1280px] mx-auto px-6 md:px-8 w-full">
            <div className="max-w-3xl">
              <span className="inline-block text-[#3a7d44] text-xs font-bold tracking-widest uppercase mb-4">
                Bathroom Fitting
              </span>
              <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
                Victorian bathroom renovation, Eastbourne
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                A complete transformation of a period bathroom in Eastbourne&apos;s Old Town,
                blending heritage character with modern plumbing standards and luxury finishes.
              </p>
            </div>
          </div>
        </section>

        {/* Overview Gallery */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl overflow-hidden h-[400px]">
                <img
                  alt="Before renovation"
                  className="w-full h-full object-cover"
                  src="/stitch-images/img-028.jpg"
                />
              </div>
              <div className="rounded-xl overflow-hidden h-[400px]">
                <img
                  alt="After renovation"
                  className="w-full h-full object-cover"
                  src="/stitch-images/img-029.jpg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Project Scope & Testimonial */}
        <section className="py-16 md:py-24 bg-[#f0f4f8]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7">
                <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
                  Project scope
                </h2>
                <div className="space-y-6 text-[#64748b] text-lg leading-[1.65]">
                  <p>
                    This Victorian property in Eastbourne&apos;s Old Town required a sensitive
                    approach to bathroom renovation. The existing room featured original cast-iron
                    pipework and a dated layout that no longer met the homeowner&apos;s needs.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span
                        className="material-symbols-outlined text-[#3a7d44] mt-1"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span>
                        Complete strip-out of existing bathroom including removal of cast-iron bath
                        and outdated plumbing
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className="material-symbols-outlined text-[#3a7d44] mt-1"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span>
                        Full replumb with modern copper and plastic pipework to current building
                        regulations
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className="material-symbols-outlined text-[#3a7d44] mt-1"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span>
                        Installation of a freestanding roll-top bath with period-style taps and
                        chrome waste
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className="material-symbols-outlined text-[#3a7d44] mt-1"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span>
                        Walk-in rainfall shower with thermostatic valve and glass screen enclosure
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="bg-white p-8 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
                  <div className="flex gap-0.5 text-[#f59e0b] mb-6">
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
                  <blockquote className="italic text-[#1c1c1e] text-lg leading-relaxed mb-6">
                    &ldquo;We couldn&apos;t be happier with our new bathroom. DCS understood exactly
                    what we wanted&mdash;a modern space that still felt in keeping with our
                    Victorian home. The craftsmanship was exceptional and they finished on time and
                    on budget.&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#1a3a6b] text-white rounded-full flex items-center justify-center font-bold">
                      SM
                    </div>
                    <div>
                      <div className="font-bold text-[#1c1c1e]">Sarah M.</div>
                      <div className="text-[#64748b] text-sm">Eastbourne</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Panel */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="bg-[#1a3a6b] rounded-2xl p-10 md:p-16 text-center shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">
                  Planning a bathroom renovation?
                </h2>
                <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                  Whether it&apos;s a period property or a modern home, we deliver bespoke bathroom
                  installations with precision and care.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    className="w-full sm:w-auto px-8 py-4 bg-[#3a7d44] text-white font-semibold rounded-lg hover:brightness-110 active:translate-y-[1px] transition-all"
                    href="/contact"
                  >
                    Get a quote
                  </a>
                  <a
                    className="w-full sm:w-auto px-8 py-4 bg-transparent border-[1.5px] border-white text-white font-semibold rounded-lg hover:bg-white/10 active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                    href="tel:0800XXXXXXX"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    0800 XXX XXXX
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 py-12 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-4">
            <p className="text-lg font-bold text-[#1a3a6b]">DCS Plumbing</p>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              Professional plumbing and heating services. Serving Eastbourne and the surrounding
              Sussex coast.
            </p>
          </div>
          <div className="space-y-4">
            <p className="font-bold text-[#1c1c1e]">Quick Links</p>
            <div className="grid grid-cols-1 gap-2">
              <a
                className="text-slate-600 text-sm hover:text-[#3a7d44] transition-colors"
                href="/services"
              >
                Services
              </a>
              <a
                className="text-slate-600 text-sm hover:text-[#3a7d44] transition-colors"
                href="/projects"
              >
                Projects
              </a>
              <a
                className="text-slate-600 text-sm hover:text-[#3a7d44] transition-colors"
                href="/about"
              >
                About Us
              </a>
              <a
                className="text-slate-600 text-sm hover:text-[#3a7d44] transition-colors"
                href="/contact"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <p className="font-bold text-[#1c1c1e]">Contact Us</p>
            <div className="space-y-3">
              <p className="flex items-center gap-3 text-slate-600 text-sm">
                <span className="material-symbols-outlined text-[#3a7d44]">call</span>0800 XXX XXXX
              </p>
              <p className="flex items-center gap-3 text-slate-600 text-sm">
                <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                Eastbourne, East Sussex
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-6 border-t border-slate-100">
          <p className="text-slate-400 text-[10px] uppercase tracking-widest text-center md:text-left">
            &copy; DCS Plumbing Eastbourne. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
