export default function BoilerInstallationPage() {
  return (
    <>
      {/* TopNavBar — Navy variant with phone */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#1a3a6b] shadow-sm h-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-full flex justify-between items-center">
          <a className="text-xl font-bold text-white tracking-tight" href="/">
            DCS Plumbing
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a
              className="text-white/90 hover:text-white font-medium text-[0.875rem] tracking-wider transition-colors"
              href="/services"
            >
              Services
            </a>
            <a
              className="text-white/90 hover:text-white font-medium text-[0.875rem] tracking-wider transition-colors"
              href="/locations"
            >
              Areas Covered
            </a>
            <a
              className="text-white/90 hover:text-white font-medium text-[0.875rem] tracking-wider transition-colors"
              href="/about"
            >
              About Us
            </a>
            <a
              className="text-white/90 hover:text-white font-medium text-[0.875rem] tracking-wider transition-colors"
              href="/blog"
            >
              FAQs
            </a>
            <a
              className="text-white/90 hover:text-white font-medium text-[0.875rem] tracking-wider transition-colors"
              href="/contact"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a
              className="text-white font-semibold text-sm md:text-base border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              href="tel:0800XXXXXXX"
            >
              0800 XXX XXXX
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-20">
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
              <a className="hover:text-[#3a7d44] transition-colors" href="/services">
                Services
              </a>
            </li>
            <li>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            </li>
            <li className="text-[#3a7d44] font-semibold">Boiler installation</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[614px] min-h-[400px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[#1a3a6b]/75 z-10"></div>
          <img
            alt="Boiler installation service"
            className="absolute inset-0 w-full h-full object-cover"
            src="/stitch-images/img-015.jpg"
          />
          <div className="relative z-20 max-w-[1280px] mx-auto px-6 md:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
                Boiler installation
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                Experience the gold standard in heating with DCS Plumbing. We provide
                energy-efficient boiler replacements and new installations tailored to your
                Eastbourne home.
              </p>
              <a
                className="inline-flex items-center justify-center px-8 py-4 bg-[#3a7d44] text-white font-semibold rounded-lg hover:brightness-110 active:translate-y-[1px] transition-all"
                href="#contact"
              >
                Request a Free Quote
              </a>
            </div>
          </div>
        </section>

        {/* Description & Benefits */}
        <section className="py-16 md:py-24 bg-[#f0f4f8]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7">
                <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
                  Expert heating for Eastbourne homes
                </h2>
                <div className="space-y-6 text-[#64748b] text-lg leading-[1.65]">
                  <p>
                    At DCS Plumbing, we understand that a new boiler is a significant investment for
                    your property. Our team of local, professional engineers has been serving the
                    Eastbourne and wider East Sussex area for over a decade, providing honest advice
                    and meticulous workmanship.
                  </p>
                  <p>
                    We don&apos;t just swap boxes; we assess your household&apos;s water usage,
                    insulation, and radiator count to recommend a system that maximises comfort
                    while minimising your energy bills. Whether you&apos;re looking for a combi
                    upgrade or a complex system boiler installation, we ensure your heating is fit
                    for the future.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="bg-white p-8 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
                  <h3 className="font-bold text-xl text-[#1a3a6b] mb-6">Why choose DCS?</h3>
                  <div className="space-y-6">
                    {[
                      {
                        icon: 'verified_user',
                        title: 'Gas Safe certified engineers',
                        desc: 'Fully qualified and insured experts you can trust.',
                      },
                      {
                        icon: 'payments',
                        title: 'Fixed price quotes',
                        desc: 'The price we quote is the price you pay. No hidden extras.',
                      },
                      {
                        icon: 'verified',
                        title: '10-year warranty available',
                        desc: 'Extended manufacturer warranties for total peace of mind.',
                      },
                      {
                        icon: 'schedule',
                        title: 'Same-day service',
                        desc: 'Emergency boiler failures handled with rapid response.',
                      },
                    ].map((benefit) => (
                      <div key={benefit.title} className="flex items-start gap-4">
                        <span
                          className="material-symbols-outlined text-[#3a7d44]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {benefit.icon}
                        </span>
                        <div>
                          <p className="font-semibold text-[#1c1c1e]">{benefit.title}</p>
                          <p className="text-sm text-[#64748b]">{benefit.desc}</p>
                        </div>
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
              Our recent installations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden rounded-xl h-80 md:h-[450px]">
                <img
                  alt="Boiler installation project 1"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/stitch-images/img-019.jpg"
                />
                <div className="absolute inset-0 bg-[#1a3a6b]/60 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">New Combi-Boiler installation in Meads</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-xl h-80 md:h-[400px] md:mt-12">
                <img
                  alt="Boiler installation project 2"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/stitch-images/img-020.jpg"
                />
                <div className="absolute inset-0 bg-[#1a3a6b]/60 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">Precision pipework for a kitchen upgrade</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-xl h-80 md:h-[450px]">
                <img
                  alt="Boiler installation project 3"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/stitch-images/img-021.jpg"
                />
                <div className="absolute inset-0 bg-[#1a3a6b]/60 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">Full system replacement in Old Town</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 md:py-24 bg-[#f0f4f8]">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-12 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              <details className="group border-b border-[rgba(226,232,240,0.6)] py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-bold text-[#1a3a6b] group-hover:text-[#3a7d44] transition-colors">
                    How long does a boiler installation take?
                  </span>
                  <span className="material-symbols-outlined transition-transform text-[#3a7d44] group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-4 text-[#64748b] leading-relaxed">
                  Most standard boiler swaps can be completed within a single day. However, if you
                  are changing the type of system (e.g., from a regular boiler to a combi) or moving
                  the boiler location, it may take 2 to 3 days. We always provide a clear timeline
                  before starting work.
                </div>
              </details>
              <details className="group border-b border-[rgba(226,232,240,0.6)] py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-bold text-[#1a3a6b] group-hover:text-[#3a7d44] transition-colors">
                    What boiler brands do you install?
                  </span>
                  <span className="material-symbols-outlined transition-transform text-[#3a7d44] group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-4 text-[#64748b] leading-relaxed">
                  We are accredited installers for leading brands including Worcester Bosch,
                  Vaillant, and Ideal. While we can install any boiler of your choice, we recommend
                  these brands for their reliability, efficiency, and excellent UK-based customer
                  support.
                </div>
              </details>
              <details className="group border-b border-[rgba(226,232,240,0.6)] py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-bold text-[#1a3a6b] group-hover:text-[#3a7d44] transition-colors">
                    Do you offer finance options?
                  </span>
                  <span className="material-symbols-outlined transition-transform text-[#3a7d44] group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-4 text-[#64748b] leading-relaxed">
                  Yes, we understand that a new boiler is a major purchase. We offer a range of
                  flexible payment plans to suit different budgets, including 0% interest options on
                  selected models. Contact us to discuss the current financing plans available.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* CTA Panel */}
        <section className="py-16 md:py-24" id="contact">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="bg-[#1a3a6b] rounded-2xl p-10 md:p-16 text-center shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">Ready to book?</h2>
                <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                  Get in touch for a transparent, no-obligation quote. Our engineers are ready to
                  help you find the perfect heating solution.
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
              Professional plumbing and heating services you can rely on. Serving Eastbourne and the
              surrounding Sussex coast.
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
                href="/blog"
              >
                FAQs
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
                <span className="material-symbols-outlined text-[#3a7d44]">call</span>
                0800 XXX XXXX
              </p>
              <p className="flex items-center gap-3 text-slate-600 text-sm">
                <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                Eastbourne, East Sussex
              </p>
              <p className="flex items-center gap-3 text-slate-600 text-sm">
                <span className="material-symbols-outlined text-[#3a7d44]">schedule</span>
                Mon - Fri: 8:00 - 18:00
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
