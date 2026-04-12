import type { AboutPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function CygnusAboutPage({ siteConfig }: AboutPageTemplateProps) {
  return (
    <div className="min-h-screen bg-surface-background font-body">
      {/* Page Hero */}
      <section className="relative min-h-[870px] flex items-end pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* TODO: Replace with actual about hero image from R2 */}
          <div className="w-full h-full bg-surface-muted grayscale opacity-40" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(14,14,14,0.4), var(--color-surface-background))",
            }}
          />
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
          <span className="inline-block text-brand-primary font-body font-bold uppercase tracking-[0.3em] mb-4">
            {siteConfig.address.city}
          </span>
          <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8 text-surface-foreground">
            Our story
          </h1>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-32 bg-surface-background">
        <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-7">
            <p className="text-brand-primary font-body font-bold uppercase tracking-widest mb-6">
              Our Approach
            </p>
            <h2 className="text-5xl font-headline font-bold mb-8 text-surface-foreground">
              Trusted professionals in {siteConfig.address.city}.
            </h2>
            <div className="space-y-6 text-surface-foreground/80 text-lg leading-relaxed max-w-2xl font-body">
              <p>
                {siteConfig.name} was founded with a singular vision: to deliver exceptional quality
                and reliability to every client. We combine technical expertise with a genuine
                passion for our craft.
              </p>
              <p>
                {siteConfig.tagline}. Over the years, we have built a reputation for meticulous
                attention to detail and outstanding customer service across{" "}
                {siteConfig.address.city} and surrounding areas.
              </p>
            </div>
          </div>
          <div className="md:col-span-5 pt-12 md:pt-24">
            <div className="relative p-12 bg-surface-card border-l-4 border-brand-primary">
              <span className="material-symbols-outlined text-5xl text-brand-primary opacity-30 absolute top-4 right-8">
                format_quote
              </span>
              <blockquote className="text-2xl font-headline italic leading-snug text-surface-foreground">
                &ldquo;We believe in doing things right the first time. Every project that leaves
                our hands carries our reputation. We build to last.&rdquo;
              </blockquote>
              <div className="mt-8">
                <p className="font-bold text-surface-foreground">{siteConfig.name}</p>
                <p className="text-sm uppercase tracking-widest text-brand-primary">
                  {siteConfig.address.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 bg-surface-muted">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(siteConfig.stats && siteConfig.stats.length > 0
              ? siteConfig.stats.map((stat) => ({
                  icon: stat.label.toLowerCase().includes("year")
                    ? "history"
                    : stat.label.toLowerCase().includes("star") ||
                        stat.label.toLowerCase().includes("rated")
                      ? "stars"
                      : stat.label.toLowerCase().includes("location") ||
                          stat.label.toLowerCase().includes("based")
                        ? "location_on"
                        : "verified",
                  label: `${stat.value} ${stat.label}`,
                }))
              : [
                  { icon: "verified", label: "Fully Certified" },
                  { icon: "stars", label: "5-Star Rated" },
                  { icon: "history", label: "Years of Experience" },
                  {
                    icon: "location_on",
                    label: `${siteConfig.address.city} Based`,
                  },
                ]
            ).map((item, index) => (
              <div
                key={index}
                className="group flex flex-col items-center justify-center p-8 grayscale hover:grayscale-0 transition-all duration-500 border border-surface-card-border/10"
              >
                <span className="material-symbols-outlined text-4xl mb-4 text-surface-foreground group-hover:text-brand-primary">
                  {item.icon}
                </span>
                <p className="text-center font-body font-bold uppercase tracking-tighter text-sm text-surface-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Cards */}
      <section className="py-32 bg-surface-background">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="mb-16">
            <h2 className="text-5xl font-headline font-bold text-surface-foreground">
              Our Principles.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                icon: "architecture",
                title: "Precision",
                body: "We hold ourselves to the highest standards. Every detail matters, every measurement counts. We do not settle for close enough.",
              },
              {
                icon: "brush",
                title: "Creativity",
                body: "We find the art in the technical and the beauty in the functional. Our work is designed to stand out and deliver results.",
              },
              {
                icon: "handshake",
                title: "Reliability",
                body: "On time, on budget, and built to last. When we give our word, consider it done. Our reputation depends on it.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`group p-12 border border-surface-card-border/15 hover:bg-brand-primary transition-colors duration-500 ${
                  index === 1 ? "border-l-0 border-r-0" : ""
                }`}
              >
                <span className="material-symbols-outlined text-5xl mb-8 group-hover:text-on-brand-primary text-brand-primary">
                  {value.icon}
                </span>
                <h3 className="text-3xl font-headline font-bold mb-4 text-surface-foreground group-hover:text-on-brand-primary">
                  {value.title}
                </h3>
                <p className="text-surface-foreground/70 group-hover:text-on-brand-primary/80 leading-relaxed font-body">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-brand-primary py-24">
        <div className="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12 text-on-brand-primary">
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-5xl font-headline font-bold mb-4 text-on-brand-primary">
              Work with us
            </h2>
            <p className="text-xl font-body text-on-brand-primary/90">
              Ready to get started? Let&apos;s discuss your next project.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-on-brand-primary text-brand-primary px-12 py-5 font-bold uppercase tracking-widest text-lg hover:opacity-90 transition-all duration-300 shadow-2xl rounded-lg"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
