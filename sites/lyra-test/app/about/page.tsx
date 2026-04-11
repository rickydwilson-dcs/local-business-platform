export default function AboutPage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Lush English Garden"
              className="w-full h-full object-cover"
              src="/stitch-images/img-024.jpg"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(145deg, rgba(22,53,38,0.9) 0%, rgba(45,76,59,0.7) 100%)',
              }}
            ></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl text-white">
              <span className="inline-block py-1 px-3 mb-6 bg-brand-accent text-surface-foreground font-medium text-xs tracking-widest uppercase rounded-sm">
                Est. 2005
              </span>
              <h1 className="text-5xl md:text-7xl font-bold italic leading-tight mb-6">
                A Legacy of Living Landscapes
              </h1>
              <p className="text-xl md:text-2xl font-light text-brand-light max-w-xl leading-relaxed">
                For nineteen years, we have nurtured the gardens of the United Kingdom, blending
                heritage techniques with modern horticultural excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-24 bg-surface-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 space-y-8">
                <h2 className="text-5xl text-brand-primary">The Hands That Tend the Earth</h2>
                <div className="space-y-6 text-surface-secondary leading-relaxed text-lg">
                  <p>
                    Founded in 2005 by Arthur Smith and his sons, our journey began with a single
                    lawnmower and a shared belief: that a garden is not merely a space, but a
                    legacy. In an era of rapid automation, we chose to remain rooted in the tactile
                    traditions of British horticulture.
                  </p>
                  <p>
                    From our humble beginnings in the Surrey countryside, Smith &amp; Sons has grown
                    into a premier maintenance firm recognized for its uncompromising attention to
                    detail. Every hedge we trim and every border we design is a testament to the
                    family values of patience, stewardship, and local craftsmanship.
                  </p>
                  {/* TODO: border-[#e7bdb1] — pinkish accent, no theme token yet; consider adding brand.blush */}
                  <p className="italic text-xl text-brand-primary border-l-4 border-[#e7bdb1] pl-6 font-heading">
                    &ldquo;We don&apos;t just maintain gardens; we preserve the stories told by the
                    land.&rdquo; &mdash; Arthur Smith, Founder
                  </p>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
                  <img
                    alt="Arthur Smith and Sons Heritage"
                    className="w-full h-full object-cover grayscale-[20%]"
                    src="/stitch-images/img-003.jpg"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-brand-primary p-8 rounded shadow-xl hidden md:block">
                  <p className="text-white italic text-2xl font-heading">19+ Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-surface-muted">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl text-brand-primary mb-4">
                Cultivated Principles
              </h2>
              <div className="h-1 w-24 bg-brand-accent mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'temp_preferences_eco',
                  title: 'Rooted in Quality',
                  desc: "We select only the finest specimens and use premium organic fertilizers. Quality isn't an option; it's the foundation of every leaf we touch.",
                },
                {
                  icon: 'handshake',
                  title: 'Grown on Trust',
                  desc: 'Nineteen years of serving the same families across Surrey and beyond. Our reputation is built on reliability and honest, transparent communication.',
                },
                {
                  icon: 'search_insights',
                  title: 'Dedicated to Detail',
                  desc: 'From the perfect edge on a lawn to the health of a rosebud, we notice the small things that others miss. Perfection is in the details.',
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-surface-background p-10 rounded-xl group hover:bg-brand-dark transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-8 group-hover:bg-brand-accent transition-colors">
                    <span className="material-symbols-outlined text-brand-primary text-3xl">
                      {value.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl text-brand-primary mb-4 group-hover:text-white transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-surface-secondary group-hover:text-brand-light transition-colors leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center items-center gap-12">
              {[
                { icon: 'verified', label: 'Fully Insured' },
                { icon: 'potted_plant', label: 'RHS Member' },
                { icon: 'gavel', label: 'SafeContractor Approved' },
                { icon: 'landscape', label: 'BALI Member' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-lg font-bold text-surface-foreground opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 font-heading"
                >
                  <span className="material-symbols-outlined text-brand-secondary">
                    {item.icon}
                  </span>{' '}
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-surface-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-5xl text-brand-primary mb-6">The Custodians</h2>
                <p className="text-surface-secondary text-lg leading-relaxed">
                  Meet the experts who bring decades of horticultural passion to your doorstep. Each
                  gardener at Smith &amp; Sons is hand-picked for their technical skill and respect
                  for nature.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: 'James Smith',
                  role: 'Head of Estate Maintenance',
                  img: 'img-023.jpg',
                  hover: 'Senior Director',
                },
                {
                  name: 'Elena Thorne',
                  role: 'Horticultural Advisor',
                  img: 'img-014.jpg',
                  hover: 'Plant Specialist',
                },
                {
                  name: 'Thomas Smith',
                  role: 'Project Supervisor',
                  img: 'img-016.jpg',
                  hover: 'Site Manager',
                },
                {
                  name: 'Sarah Green',
                  role: 'Pruning & Shaping Artist',
                  img: 'img-008.jpg',
                  hover: 'Topiary Expert',
                },
              ].map((member) => (
                <div key={member.name} className="group">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 relative">
                    <img
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={`/stitch-images/${member.img}`}
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-sm transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <p className="text-xs uppercase tracking-widest text-brand-secondary">
                        {member.hover}
                      </p>
                    </div>
                  </div>
                  <h4 className="text-2xl text-brand-primary">{member.name}</h4>
                  <p className="text-surface-secondary text-sm">{member.role}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:underline"
              >
                Join Our Team
                <span className="material-symbols-outlined">arrow_right_alt</span>
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-brand-primary text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl italic mb-8">Begin Your Garden&apos;s Next Chapter</h2>
            <p className="text-xl mb-12 text-brand-light leading-relaxed">
              Whether you require a one-off renovation or meticulous year-round care, our family is
              ready to serve yours.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="/contact"
                className="bg-brand-accent text-surface-foreground px-10 py-4 rounded font-bold text-lg hover:brightness-110 transition-all"
              >
                Schedule a Consultation
              </a>
              <a
                href="/services"
                className="border border-white/30 px-10 py-4 rounded font-bold text-lg hover:bg-white/10 transition-all"
              >
                View Our Portfolio
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
