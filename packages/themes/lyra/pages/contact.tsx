import type { ContactPageTemplateProps } from "@platform/core-components";
import { ContactForm } from "@platform/core-components";
import Link from "next/link";

export function LyraContactPage({ siteConfig }: ContactPageTemplateProps) {
  return (
    <main className="pt-24 min-h-screen">
      {/* Hero Section / Header Area */}
      <section className="relative px-8 py-20 bg-surface-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-end">
          <div className="z-10">
            <span className="bg-brand-accent text-surface-foreground px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm mb-6 inline-block font-body">
              Get in Touch
            </span>
            <h1 className="text-5xl md:text-7xl font-headline text-brand-primary font-bold leading-tight mb-6">
              Contact {siteConfig.name}
            </h1>
            <p className="text-lg md:text-xl text-surface-muted-foreground max-w-lg leading-relaxed font-body">
              Whether it&apos;s routine maintenance or a complete transformation, our team is ready
              to help with your project in {siteConfig.address.city}.
            </p>
          </div>
          <div className="hidden md:block relative h-64 overflow-hidden rounded-lg">
            {/* TODO: accept heroImage prop for contact page image */}
            <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-[var(--color-brand-dark)]/5 grayscale-[20%] hover:grayscale-0 transition-all duration-700" />
          </div>
        </div>
      </section>

      {/* Main Content Area: Form & Sidebar */}
      <section className="px-8 py-20 bg-surface-muted">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar: Business Details */}
          <aside className="lg:col-span-4 space-y-12 order-2 lg:order-1">
            <div className="bg-surface-card p-8 rounded-lg shadow-sm border-l-4 border-brand-primary">
              <h3 className="font-headline text-2xl text-brand-primary font-bold mb-8 italic">
                {siteConfig.name}
              </h3>
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="bg-[var(--color-brand-light)] p-2 rounded">
                    <span className="material-symbols-outlined text-brand-primary">call</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-muted-foreground uppercase tracking-wider mb-1 font-body">
                      Phone
                    </p>
                    <Link
                      href={`tel:${siteConfig.phone}`}
                      className="text-xl font-medium text-brand-primary hover:underline"
                    >
                      {siteConfig.phoneDisplay}
                    </Link>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="bg-[var(--color-brand-light)] p-2 rounded">
                    <span className="material-symbols-outlined text-brand-primary">
                      location_on
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-muted-foreground uppercase tracking-wider mb-1 font-body">
                      Area Served
                    </p>
                    <p className="text-lg leading-snug font-body">
                      {siteConfig.address.city}
                      {siteConfig.address.county && (
                        <>
                          ,<br />
                          {siteConfig.address.county}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-[var(--color-brand-light)] p-2 rounded">
                    <span className="material-symbols-outlined text-brand-primary">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-muted-foreground uppercase tracking-wider mb-1 font-body">
                      Opening Hours
                    </p>
                    <ul className="text-sm space-y-1 font-body">
                      <li className="flex justify-between gap-4">
                        <span>Mon &ndash; Fri</span>
                        <span className="font-semibold">8am &ndash; 6pm</span>
                      </li>
                      <li className="flex justify-between gap-4">
                        <span>Sat</span>
                        <span className="font-semibold">8am &ndash; 4pm</span>
                      </li>
                      <li className="flex justify-between gap-4 text-surface-muted-foreground/60">
                        <span>Sun</span>
                        <span>Closed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Service area highlight */}
            <div className="bg-brand-secondary text-white p-8 rounded-lg">
              <h4 className="font-headline text-xl mb-4 italic">
                Serving {siteConfig.address.city}
                {siteConfig.address.county ? ` & ${siteConfig.address.county}` : ""}
              </h4>
              <p className="text-sm opacity-90 leading-relaxed mb-6 font-body">
                We provide professional services across {siteConfig.address.city} and the
                surrounding areas. Contact us to find out if we cover your location.
              </p>
              <div className="aspect-video bg-white/10 rounded-md overflow-hidden relative">
                <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl opacity-50">map</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Form Section */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-surface-card p-8 md:p-12 rounded-xl shadow-sm border border-surface-cardBorder/20">
              <h2 className="font-headline text-3xl text-brand-primary font-bold mb-2">
                Send an Enquiry
              </h2>
              <p className="text-surface-muted-foreground mb-10 font-body">
                Fill out the form below and our team will contact you shortly.
              </p>
              <ContactForm
                services={[]}
                serviceAreas={[
                  siteConfig.address.city,
                  ...(siteConfig.address.county ? [siteConfig.address.county] : []),
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Landscape Break / Tagline Banner */}
      <section className="w-full h-64 md:h-80 relative overflow-hidden">
        {/* TODO: accept a banner image prop */}
        <div className="absolute inset-0 bg-brand-primary" />
        <div className="absolute inset-0" style={{ background: "rgba(22,53,38,0.7)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-8">
            <h3 className="font-headline text-4xl font-bold mb-4 italic">
              Reliable. Professional. Results.
            </h3>
          </div>
        </div>
      </section>
    </main>
  );
}
