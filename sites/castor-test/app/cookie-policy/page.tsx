export default function CookiePolicyPage() {
  const sections = [
    { id: 'what-are-cookies', title: 'What are cookies' },
    { id: 'cookies-we-use', title: 'Cookies we use' },
    { id: 'managing-cookies', title: 'Managing cookies' },
    { id: 'third-party-cookies', title: 'Third-party cookies' },
    { id: 'contact-us', title: 'Contact us' },
  ];

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
        {/* Header */}
        <div className="bg-[#f0f4f8] py-16">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <h1 className="text-[#1c1c1e] text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em]">
              Cookie Policy
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
                <section id="what-are-cookies">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">What are cookies</h2>
                  <p className="mb-4">
                    Cookies are small text files that are placed on your computer or mobile device
                    when you visit a website. They are widely used to make websites work more
                    efficiently, provide a better user experience, and give website owners useful
                    information about how their site is being used.
                  </p>
                  <p className="text-[#64748b]">
                    Cookies do not contain any personally identifiable information on their own, but
                    the data they store can be linked to information you provide to us (e.g.,
                    through a contact form).
                  </p>
                </section>

                <section id="cookies-we-use">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Cookies we use</h2>
                  <p className="mb-6">Our website uses the following categories of cookies:</p>

                  <div className="space-y-6">
                    <div className="bg-[#f0f4f8] p-6 rounded-xl">
                      <h3 className="font-bold text-[#1a3a6b] mb-2">Strictly necessary cookies</h3>
                      <p className="text-[#64748b] text-sm mb-3">
                        These cookies are essential for the website to function. They cannot be
                        switched off.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="py-2 pr-4 font-semibold text-[#1c1c1e]">Cookie</th>
                              <th className="py-2 pr-4 font-semibold text-[#1c1c1e]">Purpose</th>
                              <th className="py-2 font-semibold text-[#1c1c1e]">Duration</th>
                            </tr>
                          </thead>
                          <tbody className="text-[#64748b]">
                            <tr className="border-b border-slate-100">
                              <td className="py-2 pr-4">cookie_consent</td>
                              <td className="py-2 pr-4">Stores your cookie preferences</td>
                              <td className="py-2">1 year</td>
                            </tr>
                            <tr>
                              <td className="py-2 pr-4">csrf_token</td>
                              <td className="py-2 pr-4">
                                Protects against cross-site request forgery
                              </td>
                              <td className="py-2">Session</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-[#f0f4f8] p-6 rounded-xl">
                      <h3 className="font-bold text-[#1a3a6b] mb-2">Analytics cookies</h3>
                      <p className="text-[#64748b] text-sm mb-3">
                        These cookies help us understand how visitors interact with our website by
                        collecting anonymised data.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="py-2 pr-4 font-semibold text-[#1c1c1e]">Cookie</th>
                              <th className="py-2 pr-4 font-semibold text-[#1c1c1e]">Purpose</th>
                              <th className="py-2 font-semibold text-[#1c1c1e]">Duration</th>
                            </tr>
                          </thead>
                          <tbody className="text-[#64748b]">
                            <tr className="border-b border-slate-100">
                              <td className="py-2 pr-4">_ga</td>
                              <td className="py-2 pr-4">Google Analytics - distinguishes users</td>
                              <td className="py-2">2 years</td>
                            </tr>
                            <tr>
                              <td className="py-2 pr-4">_ga_*</td>
                              <td className="py-2 pr-4">
                                Google Analytics 4 - maintains session state
                              </td>
                              <td className="py-2">2 years</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="managing-cookies">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Managing cookies</h2>
                  <p className="mb-4">
                    You can control and manage cookies in several ways. Most web browsers allow you
                    to manage cookie preferences through their settings. You can:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[#64748b]">
                    <li>Delete all cookies that are already stored on your device</li>
                    <li>Block cookies from being set by specific or all websites</li>
                    <li>Set your browser to notify you when a cookie is being set</li>
                  </ul>
                  <p className="mt-4 text-[#64748b]">
                    Please note that blocking or deleting cookies may impact the functionality of
                    our website.
                  </p>
                </section>

                <section id="third-party-cookies">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Third-party cookies</h2>
                  <p className="mb-4 text-[#64748b]">
                    Some cookies on our site are set by third-party services. We use Google
                    Analytics to understand how visitors use our website. Google&apos;s privacy
                    policy can be found at{' '}
                    <span className="text-[#1a3a6b]">policies.google.com/privacy</span>.
                  </p>
                  <p className="text-[#64748b]">
                    We do not allow any other third-party advertising or tracking cookies on our
                    website.
                  </p>
                </section>

                <section id="contact-us">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact us</h2>
                  <p className="mb-4 text-[#64748b]">
                    If you have any questions about our use of cookies, please contact us:
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
