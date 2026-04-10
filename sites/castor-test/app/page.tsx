export default function HomePage() {
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

      {/* Hero Section */}
      <header className="relative min-h-[870px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            alt="Modern chrome plumbing fixtures in a bright bathroom"
            src="/stitch-images/img-001.jpg"
          />
          <div className="absolute inset-0 bg-[#1a3a6b]/75"></div>
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full py-20">
          <div className="max-w-2xl">
            <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
              Reliable plumbing for every East Sussex home.
            </h1>
            <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-10 max-w-[60ch]">
              From emergency repairs to bespoke bathroom installations, we provide professional
              craftsmanship and honest pricing across Eastbourne and the coast.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="bg-[#3a7d44] text-white px-8 py-4 rounded-lg font-semibold active:-translate-y-px transition-all"
                href="/contact"
              >
                Request a Free Quote
              </a>
              <a
                className="border-[1.5px] border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#1a3a6b] transition-all"
                href="/services"
              >
                View Our Services
              </a>
            </div>
          </div>
          {/* Floating Trust Card */}
          <div className="absolute bottom-8 right-6 md:right-8 bg-white p-5 rounded-xl shadow-lg border border-[rgba(226,232,240,0.6)] hidden sm:flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex gap-0.5 text-[#f59e0b] mb-1">
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
              <span className="text-[#1c1c1e] font-bold text-lg">4.9 / 5.0 Rating</span>
              <span className="text-[#64748b] text-sm">Based on 250+ local reviews</span>
            </div>
            <div className="w-12 h-12 bg-[#f0f4f8] rounded-full flex items-center justify-center text-[#1a3a6b]">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="bg-[#f0f4f8] py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-5">
            <span className="material-symbols-outlined text-4xl text-[#3a7d44]">schedule</span>
            <div>
              <div className="text-3xl font-extrabold text-[#3a7d44]">15+ Years</div>
              <div className="text-[#64748b] font-medium">Professional Experience</div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="material-symbols-outlined text-4xl text-[#3a7d44]">handyman</span>
            <div>
              <div className="text-3xl font-extrabold text-[#3a7d44]">5,000+</div>
              <div className="text-[#64748b] font-medium">Jobs Completed Locally</div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="material-symbols-outlined text-4xl text-[#3a7d44]">thumb_up</span>
            <div>
              <div className="text-3xl font-extrabold text-[#3a7d44]">100%</div>
              <div className="text-[#64748b] font-medium">Workmanship Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (Zig-Zag) */}
      <section className="py-24 space-y-24 max-w-[1280px] mx-auto px-6 md:px-8">
        {/* Service 1: Boiler Installation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="material-symbols-outlined text-[#3a7d44]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                heat_pump
              </span>
              <span className="text-[#64748b] font-semibold tracking-wider text-xs uppercase">
                Heating Systems
              </span>
            </div>
            <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
              Expert boiler installation and servicing.
            </h2>
            <p className="text-[#1c1c1e] leading-relaxed mb-8">
              We specialize in high-efficiency gas boiler installations that save you money on
              energy bills. Our Gas Safe registered engineers ensure your home stays warm and safe
              year-round.
            </p>
            <a
              className="text-[#3a7d44] font-semibold flex items-center gap-2 group"
              href="/services/boiler-installation"
            >
              View Details
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="order-1 md:order-2">
            <img
              className="rounded-xl shadow-md w-full aspect-[4/3] object-cover"
              alt="Professional plumber inspecting a modern wall-mounted gas boiler"
              src="/stitch-images/img-002.jpg"
            />
          </div>
        </div>

        {/* Service 2: Emergency Repairs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <img
              className="rounded-xl shadow-md w-full aspect-[4/3] object-cover"
              alt="Plumber using a wrench to tighten a leaking copper pipe"
              src="/stitch-images/img-003.jpg"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="material-symbols-outlined text-[#3a7d44]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency_home
              </span>
              <span className="text-[#64748b] font-semibold tracking-wider text-xs uppercase">
                24/7 Response
              </span>
            </div>
            <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
              Emergency plumbing repairs when you need it.
            </h2>
            <p className="text-[#1c1c1e] leading-relaxed mb-8">
              Burst pipes or major leaks don&apos;t wait for business hours. Our rapid response team
              is available across Eastbourne to tackle urgent issues before they cause costly
              property damage.
            </p>
            <a
              className="text-[#3a7d44] font-semibold flex items-center gap-2 group"
              href="/services"
            >
              View Details
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
          </div>
        </div>

        {/* Service 3: Bathroom Fitting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="material-symbols-outlined text-[#3a7d44]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bathtub
              </span>
              <span className="text-[#64748b] font-semibold tracking-wider text-xs uppercase">
                Renovations
              </span>
            </div>
            <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
              Bespoke bathroom fitting and design.
            </h2>
            <p className="text-[#1c1c1e] leading-relaxed mb-8">
              Transform your bathroom into a personal sanctuary. We handle everything from plumbing
              and tiling to fixture installation, delivering a premium finish that adds value to
              your home.
            </p>
            <a
              className="text-[#3a7d44] font-semibold flex items-center gap-2 group"
              href="/services"
            >
              View Details
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="order-1 md:order-2">
            <img
              className="rounded-xl shadow-md w-full aspect-[4/3] object-cover"
              alt="Luxury bathroom with standalone bathtub and elegant black fixtures"
              src="/stitch-images/img-004.jpg"
            />
          </div>
        </div>

        {/* Service 4: Leak Detection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <img
              className="rounded-xl shadow-md w-full aspect-[4/3] object-cover"
              alt="Technician using thermal imaging to detect a hidden water leak"
              src="/stitch-images/img-005.jpg"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="material-symbols-outlined text-[#3a7d44]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                search_check
              </span>
              <span className="text-[#64748b] font-semibold tracking-wider text-xs uppercase">
                Diagnostics
              </span>
            </div>
            <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
              Non-invasive leak detection technology.
            </h2>
            <p className="text-[#1c1c1e] leading-relaxed mb-8">
              Stop the mystery damp. We use advanced diagnostic tools to locate hidden leaks
              accurately without unnecessary damage to your walls or flooring, saving you time and
              money.
            </p>
            <a
              className="text-[#3a7d44] font-semibold flex items-center gap-2 group"
              href="/services"
            >
              View Details
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#f0f4f8] py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="mb-16">
            <h2 className="text-[#1c1c1e] text-4xl font-bold mb-4">What our customers say.</h2>
            <p className="text-[#64748b] max-w-xl">
              Verified reviews from homeowners across Eastbourne and East Sussex.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Column 1 */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-sm border-l-4 border-l-[#3a7d44]">
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
                <blockquote className="italic text-[#1c1c1e] text-lg leading-relaxed mb-8">
                  &ldquo;DCS Plumbing arrived within an hour of our emergency call. Professional,
                  tidy, and fixed the burst pipe quickly. Couldn&apos;t recommend them enough for
                  their local service.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1a3a6b] text-white rounded-full flex items-center justify-center font-bold">
                    PR
                  </div>
                  <div>
                    <div className="font-bold text-[#1c1c1e]">Paul R.</div>
                    <div className="text-[#64748b] text-sm">Eastbourne</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-sm border-l-4 border-l-[#3a7d44]">
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
                <blockquote className="italic text-[#1c1c1e] text-lg leading-relaxed mb-8">
                  &ldquo;Absolutely thrilled with our new bathroom. The attention to detail in the
                  tiling and fixture installation was second to none. A truly professional
                  team.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1a3a6b] text-white rounded-full flex items-center justify-center font-bold">
                    SM
                  </div>
                  <div>
                    <div className="font-bold text-[#1c1c1e]">Sarah M.</div>
                    <div className="text-[#64748b] text-sm">Pevensey Bay</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Column 2 (Staggered) */}
            <div className="space-y-8 md:mt-12">
              <div className="bg-white p-8 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-sm border-l-4 border-l-[#3a7d44]">
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
                <blockquote className="italic text-[#1c1c1e] text-lg leading-relaxed mb-8">
                  &ldquo;Excellent boiler service. The engineer was knowledgeable and took the time
                  to explain how to use the new smart thermostat. Fair pricing and honest
                  advice.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1a3a6b] text-white rounded-full flex items-center justify-center font-bold">
                    JL
                  </div>
                  <div>
                    <div className="font-bold text-[#1c1c1e]">James L.</div>
                    <div className="text-[#64748b] text-sm">Polegate</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-xl border border-[rgba(226,232,240,0.6)] shadow-sm border-l-4 border-l-[#3a7d44]">
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
                <blockquote className="italic text-[#1c1c1e] text-lg leading-relaxed mb-8">
                  &ldquo;Professional from start to finish. They diagnosed a leak that two other
                  plumbers had missed. Saved us from a lot of damage. Highly expert team.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1a3a6b] text-white rounded-full flex items-center justify-center font-bold">
                    DW
                  </div>
                  <div>
                    <div className="font-bold text-[#1c1c1e]">David W.</div>
                    <div className="text-[#64748b] text-sm">Seaford</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a
              href="/reviews"
              className="inline-flex items-center gap-2 text-[#1a3a6b] font-semibold text-sm border-b-2 border-[#1a3a6b] pb-0.5 hover:text-[#3a7d44] hover:border-[#3a7d44] transition-colors duration-200"
            >
              See all reviews
              <span className="material-symbols-outlined text-base leading-none">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-[#1a3a6b] py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 text-center">
          <span className="material-symbols-outlined text-[#3a7d44] text-6xl mb-6">plumbing</span>
          <h2 className="text-white text-3xl md:text-5xl font-bold mb-8">
            Ready to start your plumbing project?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              className="bg-[#3a7d44] text-white px-10 py-4 rounded-lg font-bold text-lg active:-translate-y-px transition-all"
              href="/contact"
            >
              Get a Quote
            </a>
            <a
              className="border-[1.5px] border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1a3a6b] transition-all"
              href="tel:0800XXXXXXX"
            >
              Call Us: 0800 XXX XXXX
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a3a6b] border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 px-6 md:px-8 max-w-[1280px] mx-auto">
          <div>
            <a className="font-bold text-xl text-white block mb-6" href="/">
              DCS Plumbing
            </a>
            <p className="leading-relaxed text-slate-300">
              Your local experts for professional plumbing and heating across Eastbourne and the
              wider East Sussex area. Quality you can trust.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-semibold mb-6">Services</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    className="text-slate-400 hover:text-[#3a7d44] transition-colors"
                    href="/services"
                  >
                    Boiler Repair
                  </a>
                </li>
                <li>
                  <a
                    className="text-slate-400 hover:text-[#3a7d44] transition-colors"
                    href="/services"
                  >
                    Installations
                  </a>
                </li>
                <li>
                  <a
                    className="text-slate-400 hover:text-[#3a7d44] transition-colors"
                    href="/services"
                  >
                    Emergency
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    className="text-slate-400 hover:text-[#3a7d44] transition-colors"
                    href="/about"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="text-slate-400 hover:text-[#3a7d44] transition-colors"
                    href="/privacy-policy"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    className="text-slate-400 hover:text-[#3a7d44] transition-colors"
                    href="/contact"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Details</h4>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">call</span>
                <span>0800 XXX XXXX</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                <span>Eastbourne, East Sussex</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">schedule</span>
                <span>
                  Mon-Fri: 8am - 6pm
                  <br />
                  Emergency: 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-8 border-t border-white/5">
          <p className="text-slate-500 text-sm text-center">
            &copy; 2024 DCS Plumbing. Eastbourne &amp; East Sussex Professional Plumbing.
          </p>
        </div>
      </footer>
    </>
  );
}
