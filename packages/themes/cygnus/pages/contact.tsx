import type { ContactPageTemplateProps } from "@platform/core-components";
import Link from "next/link";
import { ContactForm } from "@platform/core-components";

export function CygnusContactPage({ siteConfig }: ContactPageTemplateProps) {
  return (
    <div className="min-h-screen bg-surface-background font-body">
      {/* Page Hero */}
      <section className="relative h-[614px] flex items-end pb-24 px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* TODO: Replace with actual contact hero image from R2 */}
          <div className="w-full h-full bg-surface-muted" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--color-surface-background), var(--color-surface-background-60, rgba(19,19,19,0.6)), transparent)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto w-full">
          <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8 text-surface-foreground">
            Get in touch
          </h1>
          <div className="w-24 h-1 bg-brand-primary" />
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1440px] mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-surface-card p-8 md:p-12 border border-surface-card-border/15 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
            <h2 className="mb-12 text-5xl font-headline font-bold text-surface-foreground">
              Send us a message
            </h2>
            <ContactForm services={[]} serviceAreas={[siteConfig.address.city]} />
          </div>
        </div>

        {/* Right Column: Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-16">
          <div>
            <h2 className="mb-10 text-5xl font-headline font-bold text-surface-foreground">
              Direct Contact
            </h2>
            <div className="space-y-12">
              {/* Phone */}
              {siteConfig.cta.phone.show && (
                <div className="flex gap-6 items-start">
                  <div className="bg-brand-primary/10 p-4 border border-brand-primary/20">
                    <span
                      className="material-symbols-outlined text-brand-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      phone_in_talk
                    </span>
                  </div>
                  <div>
                    <span className="block font-body text-xs uppercase tracking-widest text-surface-muted-foreground font-bold mb-1">
                      Telephone
                    </span>
                    <Link
                      href={`tel:${siteConfig.phone}`}
                      className="text-2xl font-headline italic font-bold text-surface-foreground hover:text-brand-primary transition-colors"
                    >
                      {siteConfig.phoneDisplay}
                    </Link>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="flex gap-6 items-start">
                <div className="bg-brand-primary/10 p-4 border border-brand-primary/20">
                  <span
                    className="material-symbols-outlined text-brand-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    location_on
                  </span>
                </div>
                <div>
                  <span className="block font-body text-xs uppercase tracking-widest text-surface-muted-foreground font-bold mb-1">
                    Service Area
                  </span>
                  <p className="text-xl font-headline leading-relaxed italic text-surface-foreground">
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
              <div className="flex gap-6 items-start">
                <div className="bg-brand-primary/10 p-4 border border-brand-primary/20">
                  <span
                    className="material-symbols-outlined text-brand-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    schedule
                  </span>
                </div>
                <div>
                  <span className="block font-body text-xs uppercase tracking-widest text-surface-muted-foreground font-bold mb-1">
                    Opening Hours
                  </span>
                  <div className="space-y-1 font-body text-surface-muted-foreground">
                    <div className="flex justify-between w-64 border-b border-surface-card-border/10 pb-1">
                      <span>Mon - Fri</span>
                      <span className="text-surface-foreground">8am - 5:30pm</span>
                    </div>
                    <div className="flex justify-between w-64 border-b border-surface-card-border/10 pb-1 pt-1">
                      <span>Sat</span>
                      <span className="text-surface-foreground">9am - 1pm</span>
                    </div>
                    <div className="flex justify-between w-64 pt-1">
                      <span>Sun</span>
                      <span className="text-brand-primary font-bold italic">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative quote */}
          <div className="border-l-4 border-brand-primary p-8 bg-surface-card italic text-surface-muted-foreground/80 font-headline text-lg">
            &ldquo;Quality and precision are not just standards &mdash; they&apos;re our obsession.
            Every project is executed with care and expertise.&rdquo;
          </div>
        </div>
      </section>

      {/* Map placeholder section */}
      <section className="w-full h-[500px] bg-surface-muted relative overflow-hidden grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity duration-700">
        {/* TODO: Embed map for business location */}
        <div className="w-full h-full bg-surface-muted" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(19,19,19,0.2)" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-16 h-16 bg-brand-primary rounded-full animate-ping absolute opacity-20" />
          <div className="w-4 h-4 bg-brand-primary relative z-10" />
          <div className="mt-4 bg-surface-card px-4 py-2 border border-brand-primary/40 text-xs font-bold uppercase tracking-widest text-brand-primary">
            {siteConfig.name}
          </div>
        </div>
      </section>

      {/* Visual Break */}
      <section className="py-24 overflow-hidden">
        <div className="relative h-[400px] w-full bg-surface-muted">
          {/* TODO: Full-width showcase image from R2 */}
          <div className="w-full h-full bg-surface-muted" />
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{ backgroundColor: "rgba(var(--color-brand-primary-rgb, 247,148,29), 0.1)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-8">
              <span className="block font-body text-xs uppercase tracking-[0.4em] text-surface-foreground mb-4 font-bold">
                {siteConfig.tagline}
              </span>
              <h2 className="text-5xl md:text-8xl font-headline font-bold italic text-surface-foreground">
                {siteConfig.address.city}.
              </h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
