import type { AboutPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

const defaultStats = [
  { value: "Founded 2019", label: "Years in Business" },
  { value: "UK-Wide", label: "Client Coverage" },
  { value: "5-Star", label: "Rated Service" },
];

const values = [
  {
    icon: "trending_up",
    title: "We care about your results",
    body: "Every site we build is measured against one goal: more enquiries for your trade business. We track what works and keep improving.",
  },
  {
    icon: "handshake",
    title: "No jargon, no hassle",
    body: "We explain everything in plain English. No confusing tech talk, no surprise invoices — just honest, straightforward service.",
  },
  {
    icon: "support_agent",
    title: "Always reachable",
    body: "You get a real person to talk to. Call or email whenever you need us — we respond the same working day.",
  },
];

export function SiteAboutPage({ siteConfig }: AboutPageTemplateProps) {
  const statItems =
    siteConfig.stats && siteConfig.stats.length > 0 ? siteConfig.stats : defaultStats;

  return (
    <div className="min-h-screen font-body">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70 font-body">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="material-symbols-outlined text-sm leading-none align-middle">
                  chevron_right
                </span>
              </li>
              <li>
                <span className="text-white font-semibold" aria-current="page">
                  About
                </span>
              </li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-headline text-white mb-4 leading-[1.1]">
              About Digital Consulting Services
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed">
              {siteConfig.tagline}
            </p>
          </div>
        </div>
      </header>

      {/* ─── Story ─────────────────────────────────────────────────────────────── */}
      <section className="bg-surface-background py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — story text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-surface-foreground mb-6">
                Our Story
              </h2>
              <p className="text-surface-muted-foreground font-body leading-relaxed mb-5">
                Digital Consulting Services was founded in 2019 by Ricky Wilson with one clear
                purpose: to help skilled tradespeople get found online and win more work. Based in
                Polegate, East Sussex, we saw first-hand how brilliant plumbers, electricians, and
                builders were losing jobs simply because their online presence didn&rsquo;t reflect
                the quality of their work.
              </p>
              <p className="text-surface-muted-foreground font-body leading-relaxed mb-5">
                Since then we&rsquo;ve grown into a specialist web design and digital marketing
                agency working exclusively with local service businesses across the UK. Every site
                we build is fast, mobile-first, and engineered to rank in local search — so when a
                homeowner in your area searches for the job you do, your business comes up first.
              </p>
              <p className="text-surface-muted-foreground font-body leading-relaxed">
                We&rsquo;re proudly independent and UK-based. No offshore outsourcing, no account
                managers who don&rsquo;t know your industry. You deal directly with the people doing
                the work — and we measure our success by the enquiries hitting your phone.
              </p>
            </div>

            {/* Right — placeholder image area */}
            <div className="bg-surface-muted rounded-[20px] aspect-[4/3] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-brand-primary"
                style={{ fontSize: "72px", fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                web
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="bg-surface-muted py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {statItems.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-headline text-4xl font-bold text-brand-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-surface-muted-foreground font-body text-sm uppercase tracking-wider font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Values ────────────────────────────────────────────────────────────── */}
      <section className="bg-surface-background py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-surface-foreground mb-4">
              What We Believe In
            </h2>
            <div className="w-16 h-1 bg-brand-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value) => (
              <div
                key={value.icon}
                className="bg-surface-card rounded-[20px] shadow-md border border-surface-card-border p-6"
              >
                <div className="bg-brand-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
                  <span
                    className="material-symbols-outlined text-brand-primary text-3xl leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    {value.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-headline text-surface-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-surface-muted-foreground font-body leading-relaxed text-sm">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Strip ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-surface-foreground mb-4">
            Ready to grow your trade business?
          </h2>
          <p className="text-lg text-surface-foreground/80 font-body mb-10 max-w-xl mx-auto">
            Let&rsquo;s build you a website that wins more jobs in {siteConfig.address.city}
            {siteConfig.address.county ? ` and ${siteConfig.address.county}` : ""}.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-surface-foreground text-white px-10 py-4 rounded-xl text-base font-bold shadow-lg hover:opacity-90 transition-opacity font-body"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
