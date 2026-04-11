export default function ContactPage() {
  return (
    <>
      <main>
        {/* Page Header */}
        <section className="bg-surface-background py-20 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <span className="inline-block bg-brand-accent text-[#261a00] px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm mb-6">
                Established 1978
              </span>
              <h1
                className="text-5xl md:text-7xl font-bold text-brand-primary leading-tight mb-6"
                style={{ fontFamily: 'Newsreader, serif' }}
              >
                Get in Touch with Our Gardeners
              </h1>
              <p className="text-lg md:text-xl text-[#424843] max-w-lg leading-relaxed">
                Whether it&apos;s routine maintenance or a complete landscape transformation, our
                team is ready to bring the heritage of Surrey gardens to your home.
              </p>
            </div>
            <div className="hidden md:block relative h-64 overflow-hidden rounded-xl">
              <img
                className="w-full h-full object-cover grayscale-[20%]"
                alt="Garden tools in greenhouse"
                src="/stitch-images/img-009.jpg"
              />
            </div>
          </div>
        </section>

        {/* Form + Sidebar */}
        <section className="bg-surface-muted py-20 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Form */}
            <div className="lg:col-span-8">
              <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-surface-border/20">
                <h2
                  className="text-3xl text-brand-primary font-bold mb-2"
                  style={{ fontFamily: 'Newsreader, serif' }}
                >
                  Send an Enquiry
                </h2>
                <p className="text-[#424843] mb-10">
                  Fill out the form below and one of our senior gardeners will contact you shortly.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#424843] px-1">
                      Name
                    </label>
                    <input
                      className="w-full bg-[#e4e2de]/40 border-none focus:ring-2 focus:ring-brand-primary rounded-md py-4 px-5 text-surface-foreground"
                      placeholder="E.g. Arthur Smith"
                      type="text"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#424843] px-1">
                      Email
                    </label>
                    <input
                      className="w-full bg-[#e4e2de]/40 border-none focus:ring-2 focus:ring-brand-primary rounded-md py-4 px-5 text-surface-foreground"
                      placeholder="arthur@example.com"
                      type="email"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#424843] px-1">
                      Phone Number
                    </label>
                    <input
                      className="w-full bg-[#e4e2de]/40 border-none focus:ring-2 focus:ring-brand-primary rounded-md py-4 px-5 text-surface-foreground"
                      placeholder="07123 456789"
                      type="tel"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#424843] px-1">
                      Your Message
                    </label>
                    <textarea
                      className="w-full bg-[#e4e2de]/40 border-none focus:ring-2 focus:ring-brand-primary rounded-md py-4 px-5 text-surface-foreground"
                      placeholder="Tell us about your garden needs..."
                      rows={5}
                      readOnly
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <span className="w-full md:w-auto bg-brand-primary text-white px-12 py-5 rounded-md font-bold text-lg flex items-center justify-center gap-3 cursor-default">
                      Send My Message
                      <span className="material-symbols-outlined">send</span>
                    </span>
                    <p className="text-xs text-[#424843]/60 mt-4 italic text-center md:text-left">
                      We typically respond to all garden enquiries within 24 business hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-white p-8 rounded-xl border-l-4 border-brand-primary">
                <h3
                  className="text-2xl text-brand-primary font-bold mb-8 italic"
                  style={{ fontFamily: 'Newsreader, serif' }}
                >
                  Heritage of Guildford
                </h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#c7ebd4] p-2 rounded">
                      <span className="material-symbols-outlined text-brand-primary">call</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#424843] uppercase tracking-wider mb-1">
                        Phone
                      </p>
                      <p className="text-xl font-medium text-brand-primary">01234 567890</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-[#c7ebd4] p-2 rounded">
                      <span className="material-symbols-outlined text-brand-primary">
                        location_on
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#424843] uppercase tracking-wider mb-1">
                        Address
                      </p>
                      <p className="text-lg leading-snug">
                        12 High Street,
                        <br />
                        Guildford, Surrey,
                        <br />
                        GU1 1AA
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-[#c7ebd4] p-2 rounded">
                      <span className="material-symbols-outlined text-brand-primary">schedule</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#424843] uppercase tracking-wider mb-1">
                        Opening Hours
                      </p>
                      <ul className="text-sm space-y-1">
                        <li className="flex justify-between gap-4">
                          <span>Mon &ndash; Fri</span>{' '}
                          <span className="font-semibold">8am &ndash; 6pm</span>
                        </li>
                        <li className="flex justify-between gap-4">
                          <span>Sat</span> <span className="font-semibold">8am &ndash; 4pm</span>
                        </li>
                        <li className="flex justify-between gap-4 text-[#424843]/60">
                          <span>Sun</span> <span>Closed</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-brand-secondary text-white p-8 rounded-xl">
                <h4 className="text-xl mb-4 italic" style={{ fontFamily: 'Newsreader, serif' }}>
                  Serving the Surrey Hills
                </h4>
                <p className="text-sm opacity-90 leading-relaxed mb-6">
                  From the cobblestones of Guildford High Street to the rolling estates of the
                  Surrey Hills, we provide professional care for every green space.
                </p>
                <div className="aspect-video rounded-md overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl opacity-50">map</span>
                  </div>
                  <img
                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                    alt="Map of Guildford area"
                    src="/stitch-images/img-004.jpg"
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Landscape Break */}
        <section className="w-full h-80 relative overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="Manicured English garden"
            src="/stitch-images/img-022.jpg"
          />
          <div className="absolute inset-0 bg-brand-primary/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-8">
              <h3 className="text-4xl font-bold italic" style={{ fontFamily: 'Newsreader, serif' }}>
                Reliable. Roots-run-deep. Results.
              </h3>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
