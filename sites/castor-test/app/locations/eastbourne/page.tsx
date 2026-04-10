export default function EastbournePage() {
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
              <a className="hover:text-[#3a7d44] transition-colors" href="/locations">
                Areas Covered
              </a>
            </li>
            <li>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            </li>
            <li className="text-[#3a7d44] font-semibold">Eastbourne</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[614px] min-h-[400px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[#1a3a6b]/75 z-10"></div>
          <img
            alt="Eastbourne seafront"
            className="absolute inset-0 w-full h-full object-cover"
            src="/stitch-images/img-026.jpg"
          />
          <div className="relative z-20 max-w-[1280px] mx-auto px-6 md:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
                Plumbing services in Eastbourne
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                Your trusted local plumbers serving Eastbourne and the surrounding area. From
                emergency callouts to full bathroom installations, we&apos;re here when you need us.
              </p>
              <a
                className="inline-flex items-center justify-center px-8 py-4 bg-[#3a7d44] text-white font-semibold rounded-lg hover:brightness-110 active:translate-y-[1px] transition-all"
                href="/contact"
              >
                Request a Free Quote
              </a>
            </div>
          </div>
        </section>

        {/* Description & Services List */}
        <section className="py-16 md:py-24 bg-[#f0f4f8]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7">
                <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
                  Local expertise in Eastbourne
                </h2>
                <div className="space-y-6 text-[#64748b] text-lg leading-[1.65]">
                  <p>
                    DCS Plumbing has been serving Eastbourne homeowners and businesses for over 15
                    years. We know the local housing stock, water pressure challenges, and building
                    regulations inside out. Whether you live in the Old Town, Meads, or Langney, our
                    team provides fast, reliable service you can count on.
                  </p>
                  <p>
                    As a local family business, we take pride in our reputation within the
                    Eastbourne community. Many of our customers come through word-of-mouth
                    recommendations, and we work hard to maintain that trust with every job we
                    complete.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="bg-white p-8 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
                  <h3 className="font-bold text-xl text-[#1a3a6b] mb-6">Services in Eastbourne</h3>
                  <div className="space-y-5">
                    {[
                      { icon: 'heat_pump', name: 'Boiler installation' },
                      { icon: 'emergency_home', name: 'Emergency repairs' },
                      { icon: 'bathtub', name: 'Bathroom fitting' },
                      { icon: 'search_check', name: 'Leak detection' },
                      { icon: 'plumbing', name: 'Drain unblocking' },
                    ].map((service) => (
                      <div key={service.name} className="flex items-center gap-4">
                        <span
                          className="material-symbols-outlined text-[#3a7d44]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {service.icon}
                        </span>
                        <p className="font-semibold text-[#1c1c1e]">{service.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-12 text-center">
              Recent work in Eastbourne
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden rounded-xl h-80 md:h-[450px]">
                <img
                  alt="Eastbourne project 1"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/stitch-images/img-019.jpg"
                />
                <div className="absolute inset-0 bg-[#1a3a6b]/60 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">Boiler replacement in Meads</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-xl h-80 md:h-[400px] md:mt-12">
                <img
                  alt="Eastbourne project 2"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/stitch-images/img-004.jpg"
                />
                <div className="absolute inset-0 bg-[#1a3a6b]/60 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">Bathroom renovation in Old Town</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-xl h-80 md:h-[450px]">
                <img
                  alt="Eastbourne project 3"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/stitch-images/img-020.jpg"
                />
                <div className="absolute inset-0 bg-[#1a3a6b]/60 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">Emergency pipe repair in Langney</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Local Info */}
        <section className="py-16 md:py-24 bg-[#f0f4f8]">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-12 text-center">
              Local information
            </h2>
            <div className="space-y-4">
              <details className="group border-b border-[rgba(226,232,240,0.6)] py-4" open>
                <summary className="flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-bold text-[#1a3a6b] group-hover:text-[#3a7d44] transition-colors">
                    Average travel time
                  </span>
                  <span className="material-symbols-outlined transition-transform text-[#3a7d44] group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-4 text-[#64748b] leading-relaxed">
                  Our engineers are typically on-site within 15 minutes for Eastbourne call-outs.
                  We&apos;re based locally, which means faster response times and lower call-out
                  charges compared to out-of-area firms.
                </div>
              </details>
              <details className="group border-b border-[rgba(226,232,240,0.6)] py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-bold text-[#1a3a6b] group-hover:text-[#3a7d44] transition-colors">
                    Service radius
                  </span>
                  <span className="material-symbols-outlined transition-transform text-[#3a7d44] group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-4 text-[#64748b] leading-relaxed">
                  We cover a 10-mile radius from central Eastbourne, including Meads, Old Town,
                  Langney, Hampden Park, Willingdon, and Polegate. For locations further afield,
                  please call to discuss availability.
                </div>
              </details>
              <details className="group border-b border-[rgba(226,232,240,0.6)] py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-bold text-[#1a3a6b] group-hover:text-[#3a7d44] transition-colors">
                    Local landmark
                  </span>
                  <span className="material-symbols-outlined transition-transform text-[#3a7d44] group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-4 text-[#64748b] leading-relaxed">
                  We&apos;re proud to serve the area around Eastbourne Pier and the surrounding
                  seafront properties. Many of the Victorian and Edwardian buildings in this area
                  have unique plumbing challenges that we&apos;re experienced in handling.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* CTA Panel */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="bg-[#1a3a6b] rounded-2xl p-10 md:p-16 text-center shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">
                  Need a plumber in Eastbourne?
                </h2>
                <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                  Get in touch for a transparent, no-obligation quote. Our local engineers are ready
                  to help.
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
                href="/locations"
              >
                Areas Covered
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
