export default function PrivacyPolicyPage() {
  const sections = [
    { id: 'data-we-collect', title: 'Data we collect' },
    { id: 'how-we-use-it', title: 'How we use it' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'your-rights', title: 'Your rights' },
    { id: 'contact-us', title: 'Contact us' },
  ];

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-200/60 shadow-sm h-20">
        <div className="flex justify-between items-center max-w-[1280px] mx-auto px-6 md:px-8 h-full">
          <a className="font-extrabold text-2xl text-[#1a3a6b] tracking-tighter" href="/">
            DCS Plumbing
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="font-medium tracking-wide text-sm text-[#1c1c1e] hover:text-[#3a7d44] transition-colors duration-200"
              href="/services"
            >
              Services
            </a>
            <a
              className="font-medium tracking-wide text-sm text-[#1c1c1e] hover:text-[#3a7d44] transition-colors duration-200"
              href="/locations"
            >
              Areas Covered
            </a>
            <a
              className="font-medium tracking-wide text-sm text-[#1c1c1e] hover:text-[#3a7d44] transition-colors duration-200"
              href="/about"
            >
              About Us
            </a>
            <a
              className="font-medium tracking-wide text-sm text-[#1c1c1e] hover:text-[#3a7d44] transition-colors duration-200"
              href="/contact"
            >
              Contact
            </a>
          </div>
          <a
            className="bg-[#3a7d44] text-white px-6 py-2.5 rounded-lg font-semibold text-sm"
            href="/contact"
          >
            Get a Quote
          </a>
        </div>
      </nav>

      <main className="pt-20">
        {/* Header */}
        <div className="bg-[#f0f4f8] py-16">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <h1 className="text-[#1c1c1e] text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em]">
              Privacy Policy
            </h1>
            <p className="text-[#64748b] mt-4 text-lg">Last updated: 1 January 2024</p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar — sticky on desktop, details toggle on mobile */}
            <aside className="lg:w-64 shrink-0">
              <details className="lg:hidden border border-slate-200 rounded-lg p-4 mb-8">
                <summary className="font-semibold text-[#1c1c1e] cursor-pointer">
                  Jump to section
                </summary>
                <ul className="mt-4 space-y-3">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        className="text-[#64748b] hover:text-[#1a3a6b] transition-colors text-sm"
                        href={`#${s.id}`}
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
              <nav className="hidden lg:block lg:sticky lg:top-28">
                <h3 className="font-bold text-[#1c1c1e] text-sm uppercase tracking-widest mb-6">
                  On this page
                </h3>
                <ul className="space-y-4">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        className="text-[#64748b] hover:text-[#1a3a6b] transition-colors text-sm"
                        href={`#${s.id}`}
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl">
              <div className="space-y-12 text-[#1c1c1e] leading-[1.8]">
                <section id="data-we-collect">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Data we collect</h2>
                  <p className="mb-4">
                    When you use our website or contact us for a quote, we may collect the following
                    personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[#64748b]">
                    <li>
                      Your name, email address, and telephone number when submitted via our contact
                      form
                    </li>
                    <li>Your postal address if you request an on-site visit or quotation</li>
                    <li>
                      Technical data such as your IP address, browser type, and device information
                      collected automatically when you visit our site
                    </li>
                    <li>
                      Usage data including pages visited, time spent on the site, and referral
                      source
                    </li>
                  </ul>
                </section>

                <section id="how-we-use-it">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">How we use it</h2>
                  <p className="mb-4">
                    We use the information we collect for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[#64748b]">
                    <li>To respond to your enquiries and provide quotes for plumbing services</li>
                    <li>To schedule and manage appointments and service visits</li>
                    <li>To improve our website and the services we offer</li>
                    <li>
                      To comply with legal obligations, including tax and accounting requirements
                    </li>
                  </ul>
                  <p className="mt-4 text-[#64748b]">
                    We do not sell, rent, or share your personal data with third parties for
                    marketing purposes. We may share data with trusted service providers (e.g.,
                    email hosting) who assist in operating our business, under strict
                    confidentiality agreements.
                  </p>
                </section>

                <section id="cookies">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Cookies</h2>
                  <p className="mb-4">
                    Our website uses cookies to improve your browsing experience. Cookies are small
                    text files stored on your device that help us understand how you use our site.
                  </p>
                  <p className="mb-4 text-[#64748b]">We use the following types of cookies:</p>
                  <ul className="list-disc pl-6 space-y-2 text-[#64748b]">
                    <li>
                      <strong className="text-[#1c1c1e]">Essential cookies:</strong> Required for
                      the website to function correctly (e.g., form submissions)
                    </li>
                    <li>
                      <strong className="text-[#1c1c1e]">Analytics cookies:</strong> Help us
                      understand visitor behaviour through anonymised data (e.g., Google Analytics)
                    </li>
                  </ul>
                  <p className="mt-4 text-[#64748b]">
                    You can manage cookie preferences through your browser settings. For more
                    detail, see our{' '}
                    <a
                      className="text-[#1a3a6b] underline hover:text-[#3a7d44]"
                      href="/cookie-policy"
                    >
                      Cookie Policy
                    </a>
                    .
                  </p>
                </section>

                <section id="your-rights">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Your rights</h2>
                  <p className="mb-4">
                    Under UK GDPR, you have the following rights regarding your personal data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[#64748b]">
                    <li>
                      <strong className="text-[#1c1c1e]">Right of access:</strong> You can request a
                      copy of the personal data we hold about you
                    </li>
                    <li>
                      <strong className="text-[#1c1c1e]">Right to rectification:</strong> You can
                      ask us to correct inaccurate or incomplete data
                    </li>
                    <li>
                      <strong className="text-[#1c1c1e]">Right to erasure:</strong> You can request
                      that we delete your personal data
                    </li>
                    <li>
                      <strong className="text-[#1c1c1e]">Right to restrict processing:</strong> You
                      can ask us to limit how we use your data
                    </li>
                    <li>
                      <strong className="text-[#1c1c1e]">Right to data portability:</strong> You can
                      request your data in a machine-readable format
                    </li>
                  </ul>
                  <p className="mt-4 text-[#64748b]">
                    To exercise any of these rights, please contact us using the details below. We
                    will respond within 30 days.
                  </p>
                </section>

                <section id="contact-us">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact us</h2>
                  <p className="mb-4 text-[#64748b]">
                    If you have any questions about this privacy policy or how we handle your data,
                    please contact us:
                  </p>
                  <div className="bg-[#f0f4f8] p-6 rounded-xl space-y-3 text-[#64748b]">
                    <p>
                      <strong className="text-[#1c1c1e]">DCS Plumbing</strong>
                    </p>
                    <p>Eastbourne, East Sussex</p>
                    <p>Phone: 0800 XXX XXXX</p>
                    <p>Email: info@dcsplumbing.co.uk</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a3a6b] border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 px-6 md:px-8 max-w-[1280px] mx-auto">
          <div>
            <a className="font-bold text-xl text-white block mb-6" href="/">
              DCS Plumbing
            </a>
            <p className="leading-relaxed text-slate-300">
              Your local experts for professional plumbing and heating across Eastbourne and the
              wider East Sussex area.
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
                    All Services
                  </a>
                </li>
                <li>
                  <a
                    className="text-slate-400 hover:text-[#3a7d44] transition-colors"
                    href="/services/boiler-installation"
                  >
                    Boiler Repair
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
                    href="/cookie-policy"
                  >
                    Cookie Policy
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
