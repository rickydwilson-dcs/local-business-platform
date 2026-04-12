import type { ContactPageTemplateProps } from "@platform/core-components";
import Link from "next/link";
import { ContactForm } from "@platform/core-components";

export function NovaContactPage({ siteConfig }: ContactPageTemplateProps) {
  return (
    <>
      {/* Hero Section — image overlay with orange tint */}
      <section className="relative h-[614px] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* TODO: Replace with actual contact hero image */}
          <div className="w-full h-full bg-brand-accent" />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(232,81,24,0.4)", mixBlendMode: "multiply" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(26,26,26,0.8) 0%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-white mb-6 leading-tight">
              Get In Touch
            </h1>
            <p className="text-xl text-white/90 max-w-xl font-body">
              Get a free quote or discuss your project with our expert team in{" "}
              {siteConfig.address.city}. We&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Two-Column Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-surface-muted p-8 md:p-12 rounded-xl border border-zinc-100">
                <h2 className="text-3xl font-headline font-bold mb-8 text-surface-foreground">
                  Send an Enquiry
                </h2>
                <ContactForm services={[]} serviceAreas={[siteConfig.address.city]} />
              </div>
            </div>

            {/* Sidebar Info Column */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              <div>
                <h3 className="text-xl font-bold text-brand-secondary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined">contact_support</span>
                  Contact Information
                </h3>
                <div className="space-y-8">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(232,81,24,0.1)" }}
                    >
                      <span className="material-symbols-outlined text-brand-primary">call</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Phone
                      </p>
                      <Link
                        href={`tel:${siteConfig.phone}`}
                        className="text-2xl font-headline font-bold text-surface-foreground hover:text-brand-primary transition-colors"
                      >
                        {siteConfig.phoneDisplay}
                      </Link>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(232,81,24,0.1)" }}
                    >
                      <span className="material-symbols-outlined text-brand-primary">
                        location_on
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Visit Us
                      </p>
                      <p className="text-lg leading-relaxed text-surface-foreground">
                        {siteConfig.address.city}
                        {siteConfig.address.county && (
                          <>
                            <br />
                            {siteConfig.address.county}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(232,81,24,0.1)" }}
                    >
                      <span className="material-symbols-outlined text-brand-primary">schedule</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Opening Hours
                      </p>
                      <div className="text-lg text-surface-foreground">
                        <div className="flex justify-between gap-8 mb-1">
                          <span className="font-medium">Monday - Friday</span>
                          <span>8am - 6pm</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="font-medium">Saturday</span>
                          <span>9am - 1pm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div
                className="p-6 border-2 border-dashed rounded-xl"
                style={{
                  borderColor: "rgba(91,168,41,0.3)",
                  backgroundColor: "rgba(91,168,41,0.05)",
                }}
              >
                <p className="text-brand-secondary font-bold text-center italic font-headline text-xl">
                  &ldquo;Precision, Creativity, and Impact &mdash; guaranteed with every
                  project.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="w-full h-[450px] relative bg-zinc-200">
        {/* TODO: Integrate actual map component or embed */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white px-8 py-4 rounded-full shadow-2xl border border-zinc-100 flex items-center gap-3">
            <span className="w-3 h-3 bg-brand-primary rounded-full animate-pulse" />
            <span className="font-bold text-surface-foreground">
              Find us in {siteConfig.address.city}
            </span>
          </div>
        </div>
      </section>

      {/* Landscape Image Break */}
      <section className="relative h-[500px] overflow-hidden">
        {/* TODO: Replace with actual portfolio/showcase image */}
        <div className="w-full h-full bg-brand-accent" />
        <div
          className="absolute inset-0 flex items-center"
          style={{
            background: "linear-gradient(to right, rgba(26,26,26,0.6) 0%, transparent 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-1 bg-brand-secondary text-white text-xs font-black uppercase tracking-widest mb-4">
                Portfolio Highlight
              </span>
              <h2 className="text-4xl font-headline font-bold text-white mb-4 italic">
                {siteConfig.tagline}
              </h2>
              <p className="text-white/80 text-lg">
                From start to finish, we deliver precision and visual impact that gets you noticed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
