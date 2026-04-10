export default function BlogDetailPage() {
  return (
    <>
      {/* TopNavBar — Navy variant */}
      <nav className="bg-[#1a3a6b] border-b border-[#1a3a6b] shadow-sm z-50 sticky top-0">
        <div className="flex justify-between items-center w-full px-6 md:px-8 max-w-[1280px] mx-auto h-20">
          <div className="font-extrabold text-2xl text-white">DCS Plumbing</div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              className="font-medium tracking-wider text-sm text-white/90 hover:text-white transition-colors"
              href="/services"
            >
              Services
            </a>
            <a
              className="font-medium tracking-wider text-sm text-white/90 hover:text-white transition-colors"
              href="/locations"
            >
              Areas Covered
            </a>
            <a
              className="font-medium tracking-wider text-sm text-white/90 hover:text-white transition-colors"
              href="/about"
            >
              About Us
            </a>
            <a
              className="font-medium tracking-wider text-sm text-white/90 hover:text-white transition-colors"
              href="/blog"
            >
              FAQs
            </a>
            <a
              className="bg-[#3a7d44] text-white px-6 py-2 rounded-lg font-semibold active:scale-95 transition-transform"
              href="/contact"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Full-bleed Hero */}
      <header className="relative min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            alt="Water droplets indicating a hidden leak"
            src="/stitch-images/img-022.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b] via-[#1a3a6b]/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full pb-16 pt-32">
          <nav className="flex mb-6 text-white/70 text-sm tracking-widest uppercase">
            <a className="hover:text-[#3a7d44] transition-colors" href="/">
              Home
            </a>
            <span className="mx-3 opacity-50">&gt;</span>
            <a className="hover:text-[#3a7d44] transition-colors" href="/blog">
              Blog
            </a>
            <span className="mx-3 opacity-50">&gt;</span>
            <span className="text-white">Article</span>
          </nav>
          <span className="inline-block text-[#3a7d44] text-xs font-bold tracking-widest uppercase mb-4">
            Maintenance
          </span>
          <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6 max-w-3xl">
            How to spot a hidden water leak
          </h1>
          <div className="flex items-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                JT
              </div>
              <span className="font-medium">James T.</span>
            </div>
            <span>12 March 2026</span>
            <span>5 min read</span>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="prose prose-lg max-w-none">
          {/* Drop cap first paragraph */}
          <p className="text-[#1c1c1e] text-lg leading-[1.8] first-letter:text-6xl first-letter:font-bold first-letter:text-[#1a3a6b] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
            Water leaks are one of the most common yet insidious problems homeowners face. Unlike a
            burst pipe that announces itself with a dramatic flood, hidden leaks work quietly behind
            walls, under floors, and within ceilings&mdash;slowly causing damage that can run into
            thousands of pounds before you even notice.
          </p>

          <h2 className="text-[#1c1c1e] text-2xl md:text-3xl font-bold mt-12 mb-6">
            The warning signs
          </h2>
          <p className="text-[#1c1c1e] text-lg leading-[1.8] mb-6">
            The first clue is often your water bill. If your usage hasn&apos;t changed but the cost
            has crept up, there may be water escaping somewhere in your system. Keep an eye on your
            meter&mdash;if it&apos;s moving when all taps are off, you almost certainly have a leak.
          </p>
          <p className="text-[#1c1c1e] text-lg leading-[1.8] mb-6">
            Damp patches on walls or ceilings are another telltale sign. These may appear as
            discolouration, bubbling paint, or in severe cases, visible mould growth. Pay particular
            attention to areas around bathrooms, kitchens, and where pipes run through the
            structure.
          </p>

          {/* Pull Quote */}
          <blockquote className="border-l-4 border-[#1a3a6b] pl-8 py-4 my-12 bg-[#f0f4f8] rounded-r-xl">
            <p className="italic text-xl text-[#1a3a6b] font-medium leading-relaxed">
              &ldquo;In our experience, most hidden leaks are found in the 6-12 months after a
              bathroom renovation. Joints that weren&apos;t properly soldered or sealed under
              pressure testing are the usual culprits.&rdquo;
            </p>
            <cite className="text-[#64748b] text-sm not-italic mt-4 block">
              &mdash; James T., Lead Engineer, DCS Plumbing
            </cite>
          </blockquote>

          <h2 className="text-[#1c1c1e] text-2xl md:text-3xl font-bold mt-12 mb-6">
            Where to check
          </h2>
          <p className="text-[#1c1c1e] text-lg leading-[1.8] mb-6">
            Start with the obvious areas: under sinks, around toilet bases, and near the boiler.
            Then move to less visible spots. Check the airing cupboard for damp around hot water
            cylinders. Look under baths where access panels are fitted. In older East Sussex
            properties, inspect any exposed pipework in cellars or utility rooms.
          </p>

          <h2 className="text-[#1c1c1e] text-2xl md:text-3xl font-bold mt-12 mb-6">
            Professional detection
          </h2>
          <p className="text-[#1c1c1e] text-lg leading-[1.8] mb-6">
            If you suspect a leak but can&apos;t locate it, modern technology makes it possible to
            find the source without tearing up floors or walls. Thermal imaging cameras detect
            temperature differences caused by escaping water. Acoustic listening equipment can
            pinpoint the exact location of a leak within a pipe run.
          </p>
          <p className="text-[#1c1c1e] text-lg leading-[1.8] mb-6">
            At DCS Plumbing, we use both methods to give Eastbourne homeowners a clear diagnosis
            before any repair work begins. This non-invasive approach saves time, money, and
            unnecessary disruption to your home.
          </p>

          <h2 className="text-[#1c1c1e] text-2xl md:text-3xl font-bold mt-12 mb-6">
            What to do if you find a leak
          </h2>
          <p className="text-[#1c1c1e] text-lg leading-[1.8] mb-6">
            If the leak is active and significant, turn off your water at the stopcock immediately.
            This is usually found under the kitchen sink or near the front of your property. Once
            the water is off, call a qualified plumber. Attempting DIY repairs on pressurised water
            systems can make the problem significantly worse.
          </p>
        </div>
      </main>

      {/* Related Articles Section */}
      <section className="bg-[#f0f4f8] py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <h2 className="text-[#1c1c1e] text-3xl font-bold mb-12">Related articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'When to replace your boiler',
                category: 'Boilers',
                img: 'img-015.jpg',
                readTime: '8 min read',
              },
              {
                title: 'Emergency plumbing: what to do first',
                category: 'Emergency',
                img: 'img-023.jpg',
                readTime: '4 min read',
              },
              {
                title: 'Hard water in East Sussex',
                category: 'East Sussex',
                img: 'img-024.jpg',
                readTime: '7 min read',
              },
            ].map((article) => (
              <a
                key={article.title}
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-[rgba(226,232,240,0.6)] hover:-translate-y-1 transition-transform"
                href="/blog"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={article.title}
                    src={`/stitch-images/${article.img}`}
                  />
                </div>
                <div className="p-6">
                  <span className="text-[#3a7d44] text-xs font-bold tracking-widest uppercase">
                    {article.category}
                  </span>
                  <h3 className="text-[#1c1c1e] text-lg font-bold mt-2 mb-2 group-hover:text-[#1a3a6b] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[#64748b] text-sm">{article.readTime}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-[#1a3a6b] py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 text-center">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">
            Think you might have a leak?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Our non-invasive detection service can locate hidden leaks without damaging your
            property. Get in touch for a free assessment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              className="bg-[#3a7d44] text-white px-10 py-4 rounded-lg font-bold text-lg active:-translate-y-px transition-all"
              href="/contact"
            >
              Get a Free Assessment
            </a>
            <a
              className="border-[1.5px] border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1a3a6b] transition-all"
              href="tel:0800XXXXXXX"
            >
              0800 XXX XXXX
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a3a6b] border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1280px] mx-auto px-6 md:px-8 py-16">
          <div>
            <div className="font-bold text-xl text-white mb-4">DCS Plumbing</div>
            <p className="text-white/80 leading-relaxed max-w-sm">
              &copy; 2024 DCS Plumbing Eastbourne. Professional Plumbing &amp; Heating Services in
              East Sussex.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <ul className="space-y-3">
              <li>
                <a
                  className="text-white/70 hover:text-[#3a7d44] transition-colors"
                  href="/services"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="text-white/70 hover:text-[#3a7d44] transition-colors"
                  href="/locations"
                >
                  Areas Covered
                </a>
              </li>
              <li>
                <a className="text-white/70 hover:text-[#3a7d44] transition-colors" href="/about">
                  About Us
                </a>
              </li>
            </ul>
            <ul className="space-y-3">
              <li>
                <a className="text-[#3a7d44]" href="/blog">
                  Blog
                </a>
              </li>
              <li>
                <a className="text-white/70 hover:text-[#3a7d44] transition-colors" href="/contact">
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="text-white/70 hover:text-[#3a7d44] transition-colors"
                  href="/privacy-policy"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact Details</h4>
            <div className="space-y-4 text-white/80">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">phone</span>
                <span>0800 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                <span>Eastbourne, East Sussex</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
