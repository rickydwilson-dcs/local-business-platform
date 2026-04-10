export default function ContactPage() {
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
      <header className="relative min-h-[409px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Contact DCS Plumbing"
            className="w-full h-full object-cover"
            src="/stitch-images/img-012.jpg"
          />
          <div className="absolute inset-0 bg-[#1a3a6b]/75"></div>
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full py-20">
          <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
            Get in touch
          </h1>
          <p className="text-white/80 max-w-[500px] text-lg leading-relaxed">
            Professional plumbing and heating services across Eastbourne and East Sussex. We&apos;re
            here to help with emergencies, maintenance, and new installations.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7">
            <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-6">
              Send us a message
            </h2>
            <p className="text-[#64748b] mb-10 max-w-[65ch]">
              Complete the form below and one of our expert engineers will get back to you shortly.
              For emergencies, please call us directly.
            </p>
            <form action="#" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm text-[#1c1c1e]" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="px-4 py-3 border border-[rgba(226,232,240,0.6)] rounded-lg focus:ring-2 focus:ring-[#1a3a6b] focus:ring-offset-2 outline-none transition-all placeholder:text-[#64748b]/50"
                    id="name"
                    name="name"
                    required
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm text-[#1c1c1e]" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="px-4 py-3 border border-[rgba(226,232,240,0.6)] rounded-lg focus:ring-2 focus:ring-[#1a3a6b] focus:ring-offset-2 outline-none transition-all placeholder:text-[#64748b]/50"
                    id="email"
                    name="email"
                    required
                    type="email"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-[#1c1c1e]" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="px-4 py-3 border border-[rgba(226,232,240,0.6)] rounded-lg focus:ring-2 focus:ring-[#1a3a6b] focus:ring-offset-2 outline-none transition-all placeholder:text-[#64748b]/50"
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-[#1c1c1e]" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="px-4 py-3 border border-[rgba(226,232,240,0.6)] rounded-lg focus:ring-2 focus:ring-[#1a3a6b] focus:ring-offset-2 outline-none transition-all placeholder:text-[#64748b]/50"
                  id="message"
                  name="message"
                  required
                  rows={5}
                ></textarea>
              </div>
              <button
                className="bg-[#3a7d44] text-white px-8 py-4 rounded-lg font-semibold text-base shadow-sm hover:brightness-110 active:translate-y-[1px] transition-all w-full md:w-auto"
                type="submit"
              >
                Send message
              </button>
            </form>
          </div>

          {/* Right: Sidebar */}
          <aside className="lg:col-span-5 space-y-12">
            {/* Contact Info Card */}
            <div className="bg-[#f0f4f8] p-8 md:p-10 rounded-xl space-y-8">
              <h3 className="text-[#1c1c1e] text-2xl font-bold">Contact Details</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#3a7d44]">phone_in_talk</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#64748b] mb-1">
                      Call us
                    </p>
                    <p className="text-xl font-bold text-[#1a3a6b]">0800 XXX XXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#64748b] mb-1">
                      Our location
                    </p>
                    <p className="text-lg text-[#1c1c1e] leading-snug">Eastbourne, East Sussex</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#3a7d44]">schedule</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#64748b] mb-1">
                      Opening hours
                    </p>
                    <ul className="text-[#1c1c1e] space-y-1">
                      <li>
                        Mon-Fri: <span className="font-medium">8am-6pm</span>
                      </li>
                      <li>
                        Sat: <span className="font-medium">9am-1pm</span>
                      </li>
                      <li className="text-[#64748b] italic text-sm">Sunday: Closed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-[rgba(226,232,240,0.6)] h-[300px]">
              <img
                alt="Map of Eastbourne"
                className="w-full h-full object-cover grayscale opacity-80"
                src="/stitch-images/img-013.jpg"
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Image Break */}
      <section className="w-full overflow-hidden">
        <img
          alt="Professional plumbing installation"
          className="w-full h-[400px] md:h-[600px] object-cover"
          src="/stitch-images/img-014.jpg"
        />
      </section>

      {/* Trust Stats Section */}
      <section className="bg-[#f0f4f8] py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <p className="text-[#3a7d44] text-4xl font-bold mb-2">15+</p>
              <p className="text-[#64748b] text-sm font-medium uppercase tracking-wider">
                Years experience
              </p>
            </div>
            <div>
              <p className="text-[#3a7d44] text-4xl font-bold mb-2">24/7</p>
              <p className="text-[#64748b] text-sm font-medium uppercase tracking-wider">
                Emergency callout
              </p>
            </div>
            <div>
              <p className="text-[#3a7d44] text-4xl font-bold mb-2">500+</p>
              <p className="text-[#64748b] text-sm font-medium uppercase tracking-wider">
                Happy clients
              </p>
            </div>
            <div>
              <p className="text-[#3a7d44] text-4xl font-bold mb-2">100%</p>
              <p className="text-[#64748b] text-sm font-medium uppercase tracking-wider">
                Guaranteed work
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-base leading-relaxed">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <a className="font-bold text-xl text-[#1a3a6b]" href="/">
              DCS Plumbing
            </a>
            <p className="text-[#64748b] max-w-xs">
              Your local experts for reliable plumbing and heating services across Eastbourne and
              the surrounding areas.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-[#1c1c1e] uppercase text-xs tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-[#64748b] hover:text-[#1a3a6b] transition-colors"
                  href="/services"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="text-[#64748b] hover:text-[#1a3a6b] transition-colors"
                  href="/services"
                >
                  Emergency Plumbing
                </a>
              </li>
              <li>
                <a
                  className="text-[#64748b] hover:text-[#1a3a6b] transition-colors"
                  href="/services/boiler-installation"
                >
                  Boiler Repair
                </a>
              </li>
              <li>
                <a className="text-[#3a7d44] font-medium transition-colors" href="/contact">
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  className="text-[#64748b] hover:text-[#1a3a6b] transition-colors"
                  href="/privacy-policy"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-[#1c1c1e] uppercase text-xs tracking-widest">
              Contact Info
            </h4>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-[#64748b]">
                <span className="material-symbols-outlined text-sm">phone</span>
                0800 XXX XXXX
              </p>
              <p className="flex items-center gap-2 text-[#64748b]">
                <span className="material-symbols-outlined text-sm">location_on</span>
                Eastbourne, East Sussex
              </p>
              <p className="flex items-center gap-2 text-[#64748b]">
                <span className="material-symbols-outlined text-sm">mail</span>
                info@dcsplumbing.co.uk
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-8 border-t border-slate-100 text-center md:text-left">
          <p className="text-[#64748b] text-sm">
            &copy; 2024 DCS Plumbing Eastbourne. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
