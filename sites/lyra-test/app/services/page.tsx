export default function ServicesPage() {
  return (
    <>
      <main>
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <nav className="flex items-center space-x-2 text-sm text-surface-secondary mb-6 uppercase tracking-widest">
            <a className="hover:text-brand-primary transition-colors" href="/">
              Home
            </a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-brand-primary font-semibold">Services</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl text-brand-primary leading-tight tracking-tight mb-8">
                Our Professional <br />
                <span className="italic">Gardening Services</span>
              </h1>
              <p className="text-xl text-surface-secondary max-w-lg leading-relaxed">
                Professional, reliable garden care for residential and commercial properties across
                the UK. Rooted in tradition, growing through quality.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-brand-accent text-surface-foreground px-6 py-4 rounded-lg inline-flex items-center space-x-3 mb-4">
                <span className="material-symbols-outlined">calendar_today</span>
                <span className="text-sm uppercase tracking-wider font-bold">
                  Now Booking for Spring
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: 'img-013.jpg',
                icon: 'grass',
                title: 'Lawn Mowing & Edging',
                desc: 'Precision cutting and crisp border edging to give your property that quintessential manicured look all year round.',
                bg: 'bg-surface-muted',
                link: '/services/lawn-mowing',
              },
              {
                img: 'img-017.jpg',
                icon: 'content_cut',
                title: 'Hedge Trimming',
                desc: 'Expert shaping and health-maintenance pruning for hedges of all sizes, from boxwood to towering conifers.',
                bg: 'bg-surface-muted',
                link: '/services/lawn-mowing',
              },
              {
                img: 'img-019.jpg',
                icon: 'delete_sweep',
                title: 'Garden Clearance',
                desc: 'Full-scale removal of overgrowth, debris, and unwanted green waste to reclaim your outdoor living space.',
                bg: 'bg-surface-muted',
                link: '/services/lawn-mowing',
              },
              {
                img: 'img-021.jpg',
                icon: 'local_florist',
                title: 'Planting & Borders',
                desc: 'Seasonal color planning and professional installation of perennials, shrubs, and ornamental trees.',
                bg: 'bg-surface-muted',
                link: '/services/lawn-mowing',
              },
              {
                img: 'img-015.jpg',
                icon: 'cleaning_services',
                title: 'Patio & Path Maintenance',
                desc: 'Pressure washing, re-sanding, and weed prevention for stone patios, brick paths, and driveways.',
                bg: 'bg-surface-muted',
                link: '/services/lawn-mowing',
              },
              {
                img: 'img-012.jpg',
                icon: 'auto_awesome',
                title: 'Seasonal Tidy-ups',
                desc: 'Comprehensive leaf clearance, winter mulching, and spring preparation to keep your garden resilient.',
                bg: 'bg-surface-muted',
                link: '/services/lawn-mowing',
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`group relative overflow-hidden ${card.bg} rounded-xl flex flex-col transition-all duration-500`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={card.title}
                    src={`/stitch-images/${card.img}`}
                  />
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-brand-secondary text-3xl">
                      {card.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl text-brand-primary mb-3">{card.title}</h3>
                  <p className="text-surface-secondary mb-8 leading-relaxed">{card.desc}</p>
                  <a
                    className="mt-auto inline-flex items-center text-brand-secondary font-bold hover:underline"
                    href={card.link}
                  >
                    Learn more{' '}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Band */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="relative bg-brand-primary rounded-xl p-12 md:p-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[200px] text-brand-dark absolute -right-8 -bottom-8">
                potted_plant
              </span>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl text-white leading-tight mb-6">
                Ready to restore your garden&apos;s glory?
              </h2>
              <p className="text-brand-light text-lg mb-10">
                Contact our expert team today for a custom maintenance plan tailored specifically to
                your landscape&apos;s needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="bg-brand-accent text-surface-foreground px-8 py-4 rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Request a Free Quote</span>
                  <span className="material-symbols-outlined text-lg">description</span>
                </a>
                <a
                  href="/contact"
                  className="border border-brand-light/30 text-white px-8 py-4 rounded-lg font-bold hover:bg-brand-dark transition-all flex items-center justify-center space-x-2"
                >
                  <span>Call Us</span>
                  <span className="material-symbols-outlined text-lg">phone_in_talk</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
