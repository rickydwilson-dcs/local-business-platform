export default function BlogPage() {
  const articles = [
    {
      category: 'Maintenance',
      title: 'How to spot a hidden water leak',
      excerpt:
        'High water bills or mysterious damp patches? Learn the subtle signs of underground or wall-cavity leaks before they cause major structural damage.',
      author: 'Paul R.',
      initials: 'PR',
      readTime: '5 min read',
      img: 'img-022.jpg',
      href: '/blog/how-to-spot-a-hidden-water-leak',
    },
    {
      category: 'Boilers',
      title: 'When to replace your boiler',
      excerpt:
        'Efficiency drops and rising repair costs are clear indicators. We break down the tipping point between repairing your old unit and investing in a modern A-rated system.',
      author: 'Dave C.',
      initials: 'DC',
      readTime: '8 min read',
      img: 'img-015.jpg',
      href: '/blog',
    },
    {
      category: 'Emergency',
      title: 'Emergency plumbing: what to do first',
      excerpt:
        'Burst pipe? Flood? Step one is always the stopcock. Learn how to minimize damage while waiting for a professional emergency plumber to arrive.',
      author: 'Sarah J.',
      initials: 'SJ',
      readTime: '4 min read',
      img: 'img-023.jpg',
      href: '/blog',
    },
    {
      category: 'Renovation',
      title: 'Bathroom renovation on a budget',
      excerpt:
        "Refreshing your space doesn't need to cost a fortune. Discover how strategic plumbing upgrades and smart tile choices can transform your bathroom.",
      author: 'Paul R.',
      initials: 'PR',
      readTime: '12 min read',
      img: 'img-004.jpg',
      href: '/blog',
    },
    {
      category: 'East Sussex',
      title: 'Hard water in East Sussex: what you need to know',
      excerpt:
        'Limescale is a common issue in Eastbourne. Learn how hard water affects your appliances and whether a water softener is the right solution for your home.',
      author: 'Dave C.',
      initials: 'DC',
      readTime: '7 min read',
      img: 'img-024.jpg',
      href: '/blog',
    },
    {
      category: 'DIY Tips',
      title: 'How to bleed a radiator',
      excerpt:
        "Cold spots at the top of your radiators? It's likely trapped air. This simple 10-minute job can significantly improve your home heating efficiency.",
      author: 'Sarah J.',
      initials: 'SJ',
      readTime: '6 min read',
      img: 'img-025.jpg',
      href: '/blog',
    },
  ];

  return (
    <>
      {/* TopNavBar — Navy variant */}
      <nav className="bg-[#1a3a6b] border-b border-[#1a3a6b] shadow-sm z-50 sticky top-0">
        <div className="flex justify-between items-center w-full px-6 md:px-8 max-w-[1280px] mx-auto h-20">
          <div className="font-extrabold text-2xl text-white">DCS Plumbing</div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              className="font-medium tracking-wider text-sm text-white/90 hover:text-white hover:bg-white/5 transition-colors active:scale-95 duration-150"
              href="/services"
            >
              Services
            </a>
            <a
              className="font-medium tracking-wider text-sm text-white/90 hover:text-white hover:bg-white/5 transition-colors active:scale-95 duration-150"
              href="/locations"
            >
              Areas Covered
            </a>
            <a
              className="font-medium tracking-wider text-sm text-white/90 hover:text-white hover:bg-white/5 transition-colors active:scale-95 duration-150"
              href="/about"
            >
              About Us
            </a>
            <a
              className="font-medium tracking-wider text-sm text-white/90 hover:text-white hover:bg-white/5 transition-colors active:scale-95 duration-150"
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

      {/* Page Header / Hero */}
      <header className="relative bg-[#1a3a6b] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-30"
            alt="Plumbing workshop"
            src="/stitch-images/img-018.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a6b] via-[#1a3a6b]/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8">
          <nav className="flex mb-8 text-white/70 text-sm tracking-widest uppercase">
            <a className="hover:text-[#3a7d44] transition-colors" href="/">
              Home
            </a>
            <span className="mx-3 opacity-50">&gt;</span>
            <span className="text-white">Blog</span>
          </nav>
          <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6 max-w-3xl">
            Plumbing tips and advice
          </h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            Expert insights from East Sussex&apos;s trusted plumbing professionals. Maintenance
            guides, renovation inspiration, and emergency support.
          </p>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-28">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Article Grid */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 gap-12">
              {articles.map((article) => (
                <article
                  key={article.title}
                  className="group flex flex-col md:flex-row gap-8 items-start border-b border-[rgba(226,232,240,0.6)] pb-12"
                >
                  <div className="w-full md:w-2/5 aspect-[4/3] rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={article.title}
                      src={`/stitch-images/${article.img}`}
                    />
                  </div>
                  <div className="flex-grow">
                    <span className="inline-block text-[#3a7d44] text-xs font-bold tracking-widest uppercase mb-3">
                      {article.category}
                    </span>
                    <h2 className="text-[#1c1c1e] text-3xl md:text-4xl font-bold mb-4 leading-tight group-hover:text-[#1a3a6b] transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-[#64748b] mb-6 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-[#1a3a6b] flex items-center justify-center text-white font-bold text-xs">
                        {article.initials}
                      </div>
                      <div>
                        <p className="text-[#1c1c1e] font-semibold text-sm">{article.author}</p>
                        <p className="text-[#64748b] text-xs">{article.readTime}</p>
                      </div>
                    </div>
                    <a
                      className="inline-flex items-center text-[#3a7d44] font-bold hover:gap-3 gap-2 transition-all"
                      href={article.href}
                    >
                      Read more{' '}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <nav className="flex items-center justify-center gap-2 mt-20">
              <a
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[rgba(226,232,240,0.6)] text-[#1a3a6b] hover:bg-[#f0f4f8] transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </a>
              <a
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a3a6b] text-white font-semibold"
                href="#"
              >
                1
              </a>
              <a
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[rgba(226,232,240,0.6)] text-[#64748b] hover:bg-[#f0f4f8] transition-colors"
                href="#"
              >
                2
              </a>
              <a
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[rgba(226,232,240,0.6)] text-[#64748b] hover:bg-[#f0f4f8] transition-colors"
                href="#"
              >
                3
              </a>
              <a
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[rgba(226,232,240,0.6)] text-[#1a3a6b] hover:bg-[#f0f4f8] transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </a>
            </nav>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-12">
            {/* Categories */}
            <div className="p-8 bg-[#f0f4f8] rounded-xl">
              <h3 className="text-2xl font-bold text-[#1c1c1e] mb-6">Categories</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Boilers', count: '12' },
                  { name: 'Maintenance', count: '24' },
                  { name: 'Renovation', count: '08' },
                  { name: 'Emergency', count: '15' },
                ].map((cat) => (
                  <li key={cat.name}>
                    <a
                      className="flex justify-between items-center group text-[#64748b] hover:text-[#1a3a6b] transition-colors"
                      href="#"
                    >
                      <span>{cat.name}</span>
                      <span className="bg-white px-2 py-1 rounded text-xs border border-[rgba(226,232,240,0.6)]">
                        {cat.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="p-8 border border-[rgba(226,232,240,0.6)] rounded-xl">
              <h3 className="text-2xl font-bold text-[#1c1c1e] mb-6">Recent Posts</h3>
              <div className="space-y-6">
                {[
                  {
                    title: 'How to spot a hidden water leak',
                    date: 'Oct 24, 2023',
                    img: 'img-022.jpg',
                  },
                  {
                    title: 'When to replace your boiler',
                    date: 'Oct 18, 2023',
                    img: 'img-015.jpg',
                  },
                  {
                    title: 'Emergency plumbing: first steps',
                    date: 'Sep 30, 2023',
                    img: 'img-023.jpg',
                  },
                ].map((post) => (
                  <a key={post.title} className="flex gap-4 group" href="#">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        alt={post.title}
                        src={`/stitch-images/${post.img}`}
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-[#1c1c1e] leading-tight group-hover:text-[#1a3a6b] transition-colors">
                        {post.title}
                      </p>
                      <p className="text-xs text-[#64748b] mt-1">{post.date}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Callout */}
            <div className="p-8 bg-[#1a3a6b] rounded-xl text-white">
              <h3 className="text-xl font-bold mb-4">Need an expert?</h3>
              <p className="text-white/80 mb-6 text-sm">
                DCS Plumbing provides professional, local services across Eastbourne and East
                Sussex.
              </p>
              <a
                className="block text-center bg-[#3a7d44] text-white py-3 rounded-lg font-semibold active:translate-y-[1px] transition-all"
                href="/contact"
              >
                Get a Quote
              </a>
            </div>
          </aside>
        </div>
      </main>

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
                <a className="text-white/70 hover:text-[#3a7d44] transition-colors" href="/blog">
                  FAQs
                </a>
              </li>
              <li>
                <a className="text-[#3a7d44] hover:text-[#3a7d44] transition-colors" href="/blog">
                  Blog
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
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/80">
                <span className="material-symbols-outlined text-[#3a7d44]">phone</span>
                <span>0800 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <span className="material-symbols-outlined text-[#3a7d44]">location_on</span>
                <span>Eastbourne, East Sussex</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <span className="material-symbols-outlined text-[#3a7d44]">schedule</span>
                <span>Mon-Sat: 08:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
